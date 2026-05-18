export type AuthMode = "apiKey" | "bearer" | "none";

export interface AuthConfig {
  apiKey?: string;
  accessToken?: string;
}

const API_KEY_PREFIXES = ["mk_live_", "mk_test_"];

export function isApiKey(token: string): boolean {
  return API_KEY_PREFIXES.some((prefix) => token.startsWith(prefix));
}

export function resolveAuthHeader(cfg: AuthConfig): Record<string, string> {
  if (cfg.apiKey) {
    if (!isApiKey(cfg.apiKey)) {
      return { Authorization: `Bearer ${cfg.apiKey}` };
    }
    return { "X-Api-Key": cfg.apiKey };
  }
  if (cfg.accessToken) {
    return { Authorization: `Bearer ${cfg.accessToken}` };
  }
  return {};
}
