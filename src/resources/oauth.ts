import type {
  OAuthAuthorizeQuery,
  OAuthDecisionInput,
  OAuthTokenReferenceInput,
  OAuthTokenRequestInput,
  OAuthTokenResponse,
} from "../types/account.js";
import type { OAuthUserinfo } from "../core/oauth.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/**
 * Mosend como proveedor OAuth 2.1, endpoint por endpoint.
 *
 * Para integrar una aplicación externa lo cómodo son los helpers de
 * `core/oauth` (`buildAuthorizeUrl`, `exchangeCode`, `refreshOAuthTokens`,
 * `revokeOAuthToken`, `fetchOAuthUserinfo`), que arman PKCE y la autenticación
 * del cliente. Estos métodos existen para quien necesite la llamada cruda.
 * Los endpoints del estándar responden sin el sobre `{ data }`.
 */
export class OAuthResource extends Resource {
  // ─── Endpoints del estándar (los consume la aplicación externa) ─────────

  /**
   * `GET /oauth/authorize` responde con una redirección 302 a la pantalla
   * «Autorizar acceso», pensada para el navegador de la persona: normalmente
   * se construye la URL con `buildAuthorizeUrl()` y se redirige allí. Llamarlo
   * desde el servidor sirve para validar los parámetros (un error vuelve como 4xx).
   */
  async authorize(query: OAuthAuthorizeQuery, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/oauth/authorize`,
      query: { ...query },
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Canje de código (con PKCE) o renovación. Para el flujo normal usa `exchangeCode()`/`refreshOAuthTokens()`. */
  async token(input: OAuthTokenRequestInput, options?: RequestOptions): Promise<OAuthTokenResponse> {
    const res = await this.http.request<OAuthTokenResponse>({
      method: "POST",
      path: `/oauth/token`,
      body: input,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Revoca un token (RFC 7009). Siempre 200. */
  async revoke(input: OAuthTokenReferenceInput, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/oauth/revoke`,
      body: input,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Estado de un token (RFC 7662). Solo la aplicación dueña del token. */
  async introspect(input: OAuthTokenReferenceInput, options?: RequestOptions): Promise<Record<string, unknown>> {
    const res = await this.http.request<Record<string, unknown>>({
      method: "POST",
      path: `/oauth/introspect`,
      body: input,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Metadatos del servidor de autorización (RFC 8414), en la ruta de descubrimiento estándar. */
  async metadata(options?: RequestOptions): Promise<Record<string, unknown>> {
    const res = await this.http.request<Record<string, unknown>>({
      method: "GET",
      path: `/.well-known/oauth-authorization-server`,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** El mismo documento de `metadata()` bajo `/oauth/metadata`, para clientes que no consultan `/.well-known`. */
  async metadataAlias(options?: RequestOptions): Promise<Record<string, unknown>> {
    const res = await this.http.request<Record<string, unknown>>({
      method: "GET",
      path: `/oauth/metadata`,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Identidad y organización de la concesión. Requiere un token OAuth con `organizations:read`. */
  async userinfo(options?: RequestOptions): Promise<OAuthUserinfo> {
    const res = await this.http.request<OAuthUserinfo>({
      method: "GET",
      path: `/oauth/userinfo`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Pantalla de consentimiento (sesión del panel) ──────────────────────

  /**
   * Detalle de una solicitud de autorización pendiente. Lo usa la pantalla
   * «Autorizar acceso» con la sesión de la persona (JWT del panel), no una API key.
   */
  async getRequest(id: string, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/oauth/requests/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /**
   * Permite o rechaza la solicitud (sesión del panel; las API keys no pueden).
   * Devuelve la URI de vuelta a la aplicación, con `code` o `error`.
   */
  async decide(id: string, input: OAuthDecisionInput, options?: RequestOptions): Promise<{ redirectTo: string }> {
    const res = await this.http.request<{ redirectTo: string }>({
      method: "POST",
      path: `/oauth/requests/${id}/decision`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Concesiones de la organización ─────────────────────────────────────

  /** Aplicaciones con acceso a la organización. */
  async listGrants(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown[]>({
      method: "GET",
      path: `/organizations/${orgId}/oauth/grants`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Quita el acceso a una aplicación: revoca la concesión y todos sus tokens. */
  async revokeGrant(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<void>({
      method: "DELETE",
      path: `/organizations/${orgId}/oauth/grants/${id}`,
      ...(options ? { options } : {}),
    });
  }
}
