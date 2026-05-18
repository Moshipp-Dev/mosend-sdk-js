import { describe, expect, it, vi } from "vitest";
import { MosendClient } from "../src/index.js";
import { MosendAuthError } from "../src/core/errors.js";
import { createMockFetch } from "./helpers/mockFetch.js";

const ORG_ID = "11111111-1111-1111-1111-111111111111";

const INITIAL_TOKENS = {
  accessToken: "access-1",
  refreshToken: "refresh-1",
  expiresIn: 900,
};

const NEW_TOKENS = {
  accessToken: "access-2",
  refreshToken: "refresh-2",
  expiresIn: 900,
};

function refreshResponse(tokens: typeof NEW_TOKENS) {
  return { status: 200, body: { data: tokens, timestamp: "" } };
}

function listingResponse() {
  return {
    status: 200,
    body: {
      data: { data: [], pageInfo: { endCursor: null, hasNextPage: false } },
      timestamp: "",
    },
  };
}

describe("auto-refresh: reactive 401 path", () => {
  it("refreshes the access token and retries the request once when server returns 401", async () => {
    let firstHit = true;
    const { fetch, requests } = createMockFetch((req) => {
      if (req.url.endsWith("/auth/refresh")) {
        expect(JSON.parse(req.body!)).toEqual({ refreshToken: "refresh-1" });
        return refreshResponse(NEW_TOKENS);
      }
      if (firstHit) {
        firstHit = false;
        return {
          status: 401,
          body: { statusCode: 401, error: "Unauthorized", message: "expired" },
        };
      }
      return listingResponse();
    });

    const onTokenRefresh = vi.fn();
    const mosend = new MosendClient({
      tokens: INITIAL_TOKENS,
      orgId: ORG_ID,
      fetch,
      onTokenRefresh,
    });

    await mosend.contacts.list();

    const paths = requests.map((r) => new URL(r.url).pathname);
    expect(paths[0]).toBe(`/organizations/${ORG_ID}/contacts`);
    expect(paths[1]).toBe("/auth/refresh");
    expect(paths[2]).toBe(`/organizations/${ORG_ID}/contacts`);
    expect(requests[2]!.headers["authorization"]).toBe("Bearer access-2");
    expect(onTokenRefresh).toHaveBeenCalledTimes(1);
    expect(onTokenRefresh).toHaveBeenCalledWith(NEW_TOKENS);
  });

  it("does not loop forever on repeated 401: a second 401 surfaces to the caller", async () => {
    const { fetch } = createMockFetch((req) => {
      if (req.url.endsWith("/auth/refresh")) return refreshResponse(NEW_TOKENS);
      return {
        status: 401,
        body: { statusCode: 401, error: "Unauthorized", message: "still expired" },
      };
    });
    const mosend = new MosendClient({ tokens: INITIAL_TOKENS, orgId: ORG_ID, fetch });
    await expect(mosend.contacts.list()).rejects.toBeInstanceOf(MosendAuthError);
  });
});

describe("auto-refresh: proactive skew path", () => {
  it("refreshes proactively when the token is about to expire (within skew)", async () => {
    // Token expires in 10 seconds; default skew is 30s → refresh BEFORE request.
    const { fetch, requests } = createMockFetch((req) => {
      if (req.url.endsWith("/auth/refresh")) return refreshResponse(NEW_TOKENS);
      return listingResponse();
    });
    const mosend = new MosendClient({
      tokens: { accessToken: "access-1", refreshToken: "refresh-1", expiresIn: 10 },
      orgId: ORG_ID,
      fetch,
    });

    await mosend.contacts.list();

    expect(requests).toHaveLength(2);
    expect(new URL(requests[0]!.url).pathname).toBe("/auth/refresh");
    expect(new URL(requests[1]!.url).pathname).toBe(`/organizations/${ORG_ID}/contacts`);
    expect(requests[1]!.headers["authorization"]).toBe("Bearer access-2");
  });

  it("does NOT refresh when the token is comfortably fresh", async () => {
    const { fetch, requests } = createMockFetch(() => listingResponse());
    const mosend = new MosendClient({
      tokens: { accessToken: "access-1", refreshToken: "refresh-1", expiresIn: 900 },
      orgId: ORG_ID,
      fetch,
      refreshSkewMs: 30_000,
    });
    await mosend.contacts.list();
    expect(requests).toHaveLength(1);
    expect(new URL(requests[0]!.url).pathname).toBe(`/organizations/${ORG_ID}/contacts`);
    expect(requests[0]!.headers["authorization"]).toBe("Bearer access-1");
  });
});

describe("auto-refresh: concurrency", () => {
  it("fires exactly ONE /auth/refresh when 10 concurrent requests need a refresh", async () => {
    let refreshCalls = 0;
    const { fetch, requests } = createMockFetch(async (req) => {
      if (req.url.endsWith("/auth/refresh")) {
        refreshCalls += 1;
        await new Promise((r) => setTimeout(r, 20));
        return refreshResponse(NEW_TOKENS);
      }
      return listingResponse();
    });
    const mosend = new MosendClient({
      tokens: { accessToken: "access-1", refreshToken: "refresh-1", expiresIn: 5 },
      orgId: ORG_ID,
      fetch,
    });

    await Promise.all(Array.from({ length: 10 }, () => mosend.contacts.list()));

    expect(refreshCalls).toBe(1);
    expect(requests.filter((r) => r.url.endsWith("/auth/refresh"))).toHaveLength(1);
    expect(requests.filter((r) => r.url.endsWith(`/organizations/${ORG_ID}/contacts`))).toHaveLength(
      10,
    );
  });
});

describe("auto-refresh: failures and manual control", () => {
  it("calls onAuthFailure and clears tokens when the refresh itself returns 401", async () => {
    const { fetch } = createMockFetch((req) => {
      if (req.url.endsWith("/auth/refresh")) {
        return {
          status: 401,
          body: { statusCode: 401, error: "Unauthorized", message: "refresh token revoked" },
        };
      }
      return {
        status: 401,
        body: { statusCode: 401, error: "Unauthorized", message: "expired" },
      };
    });
    const onAuthFailure = vi.fn();
    const mosend = new MosendClient({
      tokens: INITIAL_TOKENS,
      orgId: ORG_ID,
      fetch,
      onAuthFailure,
    });

    await expect(mosend.contacts.list()).rejects.toBeInstanceOf(MosendAuthError);
    expect(onAuthFailure).toHaveBeenCalledTimes(1);
    expect(mosend.getTokens()).toBeNull();
  });

  it("refreshNow() forces an immediate refresh regardless of expiry", async () => {
    const { fetch, requests } = createMockFetch((req) => {
      if (req.url.endsWith("/auth/refresh")) return refreshResponse(NEW_TOKENS);
      return listingResponse();
    });
    const mosend = new MosendClient({
      tokens: { accessToken: "access-1", refreshToken: "refresh-1", expiresIn: 900 },
      orgId: ORG_ID,
      fetch,
    });

    await mosend.refreshNow();

    expect(requests).toHaveLength(1);
    expect(requests[0]!.url.endsWith("/auth/refresh")).toBe(true);
    expect(mosend.getTokens()?.accessToken).toBe("access-2");
    expect(mosend.getTokens()?.refreshToken).toBe("refresh-2");
  });

  it("setTokens() replaces the in-memory pair", async () => {
    const { fetch } = createMockFetch(() => listingResponse());
    const mosend = new MosendClient({ tokens: INITIAL_TOKENS, fetch });
    mosend.setTokens({ accessToken: "manual", refreshToken: "manual-r", expiresIn: 60 });
    expect(mosend.getTokens()?.accessToken).toBe("manual");
  });
});
