import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import {
  MosendClient,
  buildAuthorizeUrl,
  createPkcePair,
  createState,
  exchangeCode,
  refreshOAuthTokens,
} from "../src/index.js";
import { createMockFetch } from "./helpers/mockFetch.js";

const ORG_ID = "11111111-1111-1111-1111-111111111111";

describe("oauth helpers", () => {
  it("createPkcePair produces an S256 challenge of the verifier", async () => {
    const { codeVerifier, codeChallenge } = await createPkcePair();
    expect(codeVerifier).toMatch(/^[A-Za-z0-9\-_]{43}$/);
    expect(createHash("sha256").update(codeVerifier).digest("base64url")).toBe(codeChallenge);
    expect(createState()).toMatch(/^[A-Za-z0-9\-_]{22}$/);
  });

  it("buildAuthorizeUrl carries every RFC 6749 + PKCE parameter", () => {
    const url = new URL(
      buildAuthorizeUrl({
        baseUrl: "https://api.dev.mosend.dev/",
        clientId: "mc_x",
        redirectUri: "https://app.test/cb",
        scopes: ["contacts:read", "messages:send"],
        state: "st",
        codeChallenge: "c".repeat(43),
        prompt: "none",
      }),
    );
    expect(url.origin + url.pathname).toBe("https://api.dev.mosend.dev/oauth/authorize");
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("scope")).toBe("contacts:read messages:send");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("prompt")).toBe("none");
  });

  it("exchangeCode posts form-encoded with Basic auth for confidential clients", async () => {
    const { fetch, requests } = createMockFetch(() => ({
      status: 200,
      body: { access_token: "mot_a", refresh_token: "mor_r", expires_in: 3600, scope: "contacts:read", token_type: "Bearer" },
    }));
    const tokens = await exchangeCode(
      { baseUrl: "https://api.test", clientId: "mc_x", clientSecret: "mcs_y", fetch },
      { code: "moc_c", redirectUri: "https://app.test/cb", codeVerifier: "v".repeat(43) },
    );
    expect(tokens).toEqual({ accessToken: "mot_a", refreshToken: "mor_r", expiresIn: 3600, scope: "contacts:read" });
    const req = requests[0]!;
    expect(req.url).toBe("https://api.test/oauth/token");
    expect(req.headers["authorization"]).toBe("Basic " + Buffer.from("mc_x:mcs_y").toString("base64"));
    expect(req.headers["content-type"]).toBe("application/x-www-form-urlencoded");
    const body = new URLSearchParams(req.body!);
    expect(body.get("grant_type")).toBe("authorization_code");
    expect(body.get("code_verifier")).toBe("v".repeat(43));
    expect(body.has("client_id")).toBe(false);
  });

  it("public clients send client_id in the body and surface OAuth errors", async () => {
    const { fetch, requests } = createMockFetch(() => ({
      status: 400,
      body: { error: "invalid_grant", error_description: "code_verifier no coincide (PKCE)." },
    }));
    await expect(
      refreshOAuthTokens({ baseUrl: "https://api.test", clientId: "mc_pub", fetch }, "mor_old"),
    ).rejects.toThrow(/invalid_grant: code_verifier/);
    expect(new URLSearchParams(requests[0]!.body!).get("client_id")).toBe("mc_pub");
  });

  it("MosendClient with `oauth` refreshes through /oauth/token on 401 and retries", async () => {
    let first = true;
    const { fetch, requests } = createMockFetch((req) => {
      if (req.url.endsWith("/oauth/token")) {
        const body = new URLSearchParams(req.body!);
        expect(body.get("grant_type")).toBe("refresh_token");
        expect(body.get("refresh_token")).toBe("mor_1");
        return {
          status: 200,
          body: { access_token: "mot_2", refresh_token: "mor_2", expires_in: 3600, scope: "contacts:read" },
        };
      }
      if (first) {
        first = false;
        return { status: 401, body: { statusCode: 401, message: "Token OAuth inválido" } };
      }
      expect(req.headers["authorization"]).toBe("Bearer mot_2");
      return {
        status: 200,
        body: { data: { data: [], pageInfo: { endCursor: null, hasNextPage: false } }, timestamp: "" },
      };
    });
    const refreshed: string[] = [];
    const client = new MosendClient({
      baseUrl: "https://api.test",
      orgId: ORG_ID,
      fetch,
      oauth: {
        clientId: "mc_x",
        clientSecret: "mcs_y",
        tokens: { accessToken: "mot_1", refreshToken: "mor_1", expiresIn: 3600, scope: "contacts:read" },
      },
      onTokenRefresh: (t) => {
        refreshed.push(t.accessToken);
      },
    });
    await client.contacts.list();
    expect(refreshed).toEqual(["mot_2"]);
    expect(requests.filter((r) => r.url.endsWith("/oauth/token"))).toHaveLength(1);
  });
});
