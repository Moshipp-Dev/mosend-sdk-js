/**
 * Mosend como proveedor OAuth 2.1: utilidades para que una aplicación externa
 * pida acceso a la cuenta de un cliente («Autorizar acceso»), canjee el código
 * con PKCE, renueve y revoque. Los tokens que salen de aquí se pasan al
 * `MosendClient` con la opción `oauth` para que renueve solo.
 *
 * Funciona en Node ≥ 18 y en navegadores (usa Web Crypto y fetch globales).
 */
import type { FetchLike } from "./http.js";
import {
  MosendApiError,
  MosendAuthError,
  MosendRateLimitError,
  MosendServerError,
  MosendValidationError,
  type MosendApiErrorBody,
} from "./errors.js";

export const DEFAULT_OAUTH_BASE_URL = "https://api.mosend.dev";

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  /** Segundos de vida del access token desde que se emitió. */
  expiresIn: number;
  /** Alcances concedidos, separados por espacio. */
  scope: string;
}

export interface PkcePair {
  /** Guárdalo hasta canjear el código (43 caracteres base64url). */
  codeVerifier: string;
  /** Va en la URL de autorización como `code_challenge` (S256). */
  codeChallenge: string;
}

interface OAuthErrorBody {
  error?: string;
  error_description?: string;
}

function base64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = typeof btoa === "function" ? btoa(bin) : Buffer.from(bin, "binary").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function webCrypto(): Crypto {
  const c = globalThis.crypto;
  if (!c || !c.subtle) {
    // Node exposes crypto globally from v19; in a browser, `crypto.subtle`
    // only exists in a secure context (https or localhost).
    throw new MosendValidationError(
      "Web Crypto is unavailable. On Node use v19+ (or v18 with --experimental-global-webcrypto); in a browser, serve the page over https or localhost.",
    );
  }
  return c;
}

/** Par PKCE (RFC 7636) con S256, el único método que admite Mosend. */
export async function createPkcePair(): Promise<PkcePair> {
  const crypto = webCrypto();
  const random = new Uint8Array(32);
  crypto.getRandomValues(random);
  const codeVerifier = base64url(random);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
  return { codeVerifier, codeChallenge: base64url(new Uint8Array(digest)) };
}

/** `state` aleatorio para atar la respuesta a esta petición. */
export function createState(): string {
  const crypto = webCrypto();
  const random = new Uint8Array(16);
  crypto.getRandomValues(random);
  return base64url(random);
}

export interface AuthorizeUrlInput {
  baseUrl?: string;
  clientId: string;
  redirectUri: string;
  /** Alcances del catálogo de permisos de Mosend, p. ej. `["contacts:read"]`. */
  scopes: string[];
  state: string;
  codeChallenge: string;
  /** `none` salta la pantalla si ya existe una concesión que cubre lo pedido. */
  prompt?: "none" | "consent" | "login";
}

/** URL a la que enviar a la persona para que autorice la aplicación. */
export function buildAuthorizeUrl(input: AuthorizeUrlInput): string {
  const base = (input.baseUrl ?? DEFAULT_OAUTH_BASE_URL).replace(/\/+$/, "");
  const params = new URLSearchParams({
    response_type: "code",
    client_id: input.clientId,
    redirect_uri: input.redirectUri,
    scope: input.scopes.join(" "),
    state: input.state,
    code_challenge: input.codeChallenge,
    code_challenge_method: "S256",
    ...(input.prompt ? { prompt: input.prompt } : {}),
  });
  return `${base}/oauth/authorize?${params.toString()}`;
}

export interface OAuthClientCredentials {
  baseUrl?: string;
  clientId: string;
  /** Solo aplicaciones confidenciales; las públicas van solo con PKCE. */
  clientSecret?: string;
  fetch?: FetchLike;
}

async function postToken(
  creds: OAuthClientCredentials,
  path: "/oauth/token" | "/oauth/revoke",
  params: Record<string, string>,
): Promise<Record<string, unknown>> {
  const base = (creds.baseUrl ?? DEFAULT_OAUTH_BASE_URL).replace(/\/+$/, "");
  const fetchImpl = creds.fetch ?? globalThis.fetch;
  const headers: Record<string, string> = {
    "content-type": "application/x-www-form-urlencoded",
    accept: "application/json",
  };
  const body = new URLSearchParams(params);
  if (creds.clientSecret) {
    const raw = `${encodeURIComponent(creds.clientId)}:${encodeURIComponent(creds.clientSecret)}`;
    const b64 = typeof btoa === "function" ? btoa(raw) : Buffer.from(raw).toString("base64");
    headers["authorization"] = `Basic ${b64}`;
  } else {
    body.set("client_id", creds.clientId);
  }
  const res = await fetchImpl(`${base}${path}`, { method: "POST", headers, body: body.toString() });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown> & OAuthErrorBody;
  if (!res.ok) {
    const codigo = json.error ?? "oauth_error";
    const detalle: MosendApiErrorBody = {
      statusCode: res.status,
      message: json.error_description ?? codigo,
      error: codigo,
    };
    const args = {
      status: res.status,
      message: `${codigo}: ${json.error_description ?? res.statusText}`,
      code: codigo,
      body: detalle,
      path,
    };
    // Solo `invalid_grant`/`invalid_client` significan «esta sesión ya no
    // vale». Un 429 del limitador o un 502 del proxy son pasajeros, y
    // devolverlos como error de autenticación hacía que el TokenManager
    // tirara un refresh token que seguía siendo bueno.
    if (codigo === "invalid_grant" || codigo === "invalid_client") {
      throw new MosendAuthError(args);
    }
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after"));
      throw new MosendRateLimitError({
        ...args,
        ...(Number.isFinite(retryAfter) && retryAfter > 0
          ? { retryAfterSec: retryAfter }
          : {}),
      });
    }
    if (res.status >= 500) throw new MosendServerError(args);
    throw new MosendApiError(args);
  }
  return json;
}

function toTokens(json: Record<string, unknown>): OAuthTokens {
  const access = json["access_token"];
  const refresh = json["refresh_token"];
  // Una respuesta 200 malformada producía el literal "undefined" como token y
  // un 401 incomprensible en la siguiente llamada.
  if (typeof access !== "string" || typeof refresh !== "string") {
    throw new MosendValidationError(
      "The token endpoint returned a response without access_token/refresh_token",
    );
  }
  return {
    accessToken: access,
    refreshToken: refresh,
    expiresIn: Number(json["expires_in"] ?? 3600),
    scope: typeof json["scope"] === "string" ? json["scope"] : "",
  };
}

/** Canjea el `code` de la redirección por tokens (con el `codeVerifier` del par PKCE). */
export async function exchangeCode(
  creds: OAuthClientCredentials,
  input: { code: string; redirectUri: string; codeVerifier: string },
): Promise<OAuthTokens> {
  return toTokens(
    await postToken(creds, "/oauth/token", {
      grant_type: "authorization_code",
      code: input.code,
      redirect_uri: input.redirectUri,
      code_verifier: input.codeVerifier,
    }),
  );
}

/**
 * Renueva: devuelve un par nuevo; el refresh token anterior queda usado.
 *
 * `scopes` reduce el alcance del par nuevo (RFC 6749 §6) y es IRREVERSIBLE:
 * la cadena que salga de él queda acotada a esos alcances, y recuperar los
 * demás exige volver a pasar por la pantalla de autorización.
 */
export async function refreshOAuthTokens(
  creds: OAuthClientCredentials,
  refreshToken: string,
  scopes?: string[],
): Promise<OAuthTokens> {
  return toTokens(
    await postToken(creds, "/oauth/token", {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      ...(scopes?.length ? { scope: scopes.join(" ") } : {}),
    }),
  );
}

export interface OAuthUserinfo {
  /** Id de la persona que autorizó la aplicación. */
  sub: string;
  name: string;
  email: string;
  locale: string;
  /** Organización sobre la que se concedió el acceso: el `orgId` del cliente. */
  org_id: string;
  org_name: string;
  org_slug: string;
  /** Alcances del token presentado, separados por espacio. */
  scope: string;
}

/**
 * Identidad y organización de la concesión. Es la forma de saber sobre qué
 * organización trabaja el token, así que normalmente se llama justo después
 * del canje para construir el cliente.
 *
 * Requiere el alcance `organizations:read`.
 */
export async function fetchOAuthUserinfo(
  input: { baseUrl?: string; fetch?: FetchLike },
  accessToken: string,
): Promise<OAuthUserinfo> {
  const base = (input.baseUrl ?? DEFAULT_OAUTH_BASE_URL).replace(/\/+$/, "");
  const fetchImpl = input.fetch ?? globalThis.fetch;
  const res = await fetchImpl(`${base}/oauth/userinfo`, {
    headers: { authorization: `Bearer ${accessToken}`, accept: "application/json" },
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new MosendApiError({
      status: res.status,
      message:
        typeof json["message"] === "string"
          ? json["message"]
          : `userinfo failed with ${res.status}. Does the token include the organizations:read scope?`,
      code: "userinfo_error",
    });
  }
  return json as unknown as OAuthUserinfo;
}

/** Revoca un token (RFC 7009). Revocar el refresh token corta toda la cadena. */
export async function revokeOAuthToken(
  creds: OAuthClientCredentials,
  token: string,
  hint?: "access_token" | "refresh_token",
): Promise<void> {
  await postToken(creds, "/oauth/revoke", {
    token,
    ...(hint ? { token_type_hint: hint } : {}),
  });
}
