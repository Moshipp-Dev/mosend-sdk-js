import type { AuthTokens } from "../types/identity.js";
import { MosendAuthError, MosendError } from "./errors.js";

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export type TokenRefreshFn = (refreshToken: string) => Promise<AuthTokens>;

export interface TokenManagerOptions {
  initialTokens?: AuthTokens;
  refreshSkewMs?: number;
  refresh: TokenRefreshFn;
  onTokenRefresh?: (tokens: AuthTokens) => Promise<void> | void;
  onAuthFailure?: (error: MosendAuthError) => Promise<void> | void;
  now?: () => number;
}

const DEFAULT_SKEW_MS = 30_000;
const MIN_EXPIRES_IN_SEC = 30;

export class TokenManager {
  private tokens: StoredTokens | null;
  private inFlight: Promise<StoredTokens> | null = null;
  private readonly opts: Required<Pick<TokenManagerOptions, "refresh">> &
    Omit<TokenManagerOptions, "refresh" | "initialTokens">;

  constructor(opts: TokenManagerOptions) {
    if (typeof opts.refresh !== "function") {
      throw new MosendError("TokenManager requires a refresh function");
    }
    this.tokens = opts.initialTokens ? toStored(opts.initialTokens, opts.now ?? Date.now) : null;
    this.opts = {
      refresh: opts.refresh,
      refreshSkewMs: opts.refreshSkewMs ?? DEFAULT_SKEW_MS,
      ...(opts.onTokenRefresh ? { onTokenRefresh: opts.onTokenRefresh } : {}),
      ...(opts.onAuthFailure ? { onAuthFailure: opts.onAuthFailure } : {}),
      now: opts.now ?? Date.now,
    };
  }

  hasRefreshToken(): boolean {
    return this.tokens !== null && Boolean(this.tokens.refreshToken);
  }

  getTokensSnapshot(): StoredTokens | null {
    return this.tokens ? { ...this.tokens } : null;
  }

  setTokens(tokens: AuthTokens | null): void {
    this.tokens = tokens ? toStored(tokens, this.opts.now!) : null;
  }

  async getAccessToken(): Promise<string | null> {
    if (!this.tokens) return null;
    if (this.isExpiringSoon()) {
      if (!this.tokens.refreshToken) return this.tokens.accessToken;
      const fresh = await this.refresh();
      return fresh.accessToken;
    }
    return this.tokens.accessToken;
  }

  async refresh(): Promise<StoredTokens> {
    if (this.inFlight) return this.inFlight;
    if (!this.tokens?.refreshToken) {
      const err = new MosendAuthError({
        status: 401,
        message: "No refresh token available",
        code: "no_refresh_token",
      });
      await this.opts.onAuthFailure?.(err);
      throw err;
    }
    const refreshToken = this.tokens.refreshToken;
    this.inFlight = (async () => {
      try {
        const next = await this.opts.refresh(refreshToken);
        const stored = toStored(next, this.opts.now!);
        this.tokens = stored;
        if (this.opts.onTokenRefresh) {
          await this.opts.onTokenRefresh(next);
        }
        return stored;
      } catch (err) {
        if (err instanceof MosendAuthError) {
          this.tokens = null;
          await this.opts.onAuthFailure?.(err);
        }
        throw err;
      } finally {
        this.inFlight = null;
      }
    })();
    return this.inFlight;
  }

  private isExpiringSoon(): boolean {
    if (!this.tokens) return false;
    const now = this.opts.now!();
    return now + this.opts.refreshSkewMs! >= this.tokens.expiresAt;
  }
}

function toStored(tokens: AuthTokens, now: () => number): StoredTokens {
  const expiresInSec = tokens.expiresIn > 0 ? tokens.expiresIn : MIN_EXPIRES_IN_SEC;
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: now() + expiresInSec * 1000,
  };
}
