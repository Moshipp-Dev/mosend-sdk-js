import { describe, expect, it } from "vitest";
import { isApiKey, resolveAuthHeader } from "../src/core/auth.js";

describe("auth header resolution", () => {
  it("detects mk_live_ and mk_test_ as API keys", () => {
    expect(isApiKey("mk_live_abcd.secret")).toBe(true);
    expect(isApiKey("mk_test_abcd.secret")).toBe(true);
    expect(isApiKey("eyJhbGciOiJIUzI1NiJ9.foo.bar")).toBe(false);
  });

  it("uses X-Api-Key when the token has the API key prefix", () => {
    expect(resolveAuthHeader({ apiKey: "mk_live_abcd.secret" })).toEqual({
      "X-Api-Key": "mk_live_abcd.secret",
    });
  });

  it("falls back to Authorization: Bearer for non-prefixed tokens passed as apiKey", () => {
    expect(resolveAuthHeader({ apiKey: "eyJhbGciOiJIUzI1NiJ9.foo.bar" })).toEqual({
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.foo.bar",
    });
  });

  it("uses Authorization: Bearer for accessToken", () => {
    expect(resolveAuthHeader({ accessToken: "jwt-token" })).toEqual({
      Authorization: "Bearer jwt-token",
    });
  });

  it("returns empty object when nothing is set", () => {
    expect(resolveAuthHeader({})).toEqual({});
  });
});
