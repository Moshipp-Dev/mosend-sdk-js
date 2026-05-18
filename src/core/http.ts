import { resolveAuthHeader, type AuthConfig } from "./auth.js";
import {
  buildApiError,
  MosendApiError,
  MosendError,
  MosendNetworkError,
  MosendValidationError,
  type MosendApiErrorBody,
} from "./errors.js";
import type { TokenManager } from "./tokenManager.js";
import type {
  ApiEnvelope,
  Paginated,
  PageInfo,
  RawResponse,
  RequestOptions,
} from "./types.js";

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export interface RetryConfig {
  max: number;
  on: number[];
  baseDelayMs?: number;
}

export interface HttpClientConfig extends AuthConfig {
  baseUrl: string;
  timeoutMs: number;
  retries: RetryConfig | null;
  fetch: FetchLike;
  userAgent: string;
  defaultHeaders: Record<string, string>;
  tokenManager?: TokenManager;
}

export interface RequestArgs {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  options?: RequestOptions;
  /**
   * Internal flag: bypass the TokenManager (no proactive refresh, no auth
   * header, no 401-retry). Used by /auth/refresh itself to avoid recursion.
   */
  skipAuth?: boolean;
}

export interface ResolvedResponse<T> {
  data: T;
  raw: RawResponse;
}

const DEFAULT_BASE_URL = "https://api.mosend.dev";

export function createHttpClient(input: Partial<HttpClientConfig>): HttpClient {
  const baseUrl = (input.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
  const fetchImpl = input.fetch ?? globalThis.fetch;
  if (typeof fetchImpl !== "function") {
    throw new MosendValidationError(
      "global fetch is not available. Pass `fetch` in MosendClient options (Node <18 or restricted runtime).",
    );
  }
  const cfg: HttpClientConfig = {
    baseUrl,
    timeoutMs: input.timeoutMs ?? 30_000,
    retries: input.retries ?? null,
    fetch: fetchImpl,
    userAgent: input.userAgent ?? `moshipp-mosend-sdk/0.2.0`,
    defaultHeaders: input.defaultHeaders ?? {},
    ...(input.apiKey !== undefined ? { apiKey: input.apiKey } : {}),
    ...(input.accessToken !== undefined ? { accessToken: input.accessToken } : {}),
    ...(input.tokenManager ? { tokenManager: input.tokenManager } : {}),
  };
  return new HttpClient(cfg);
}

export class HttpClient {
  constructor(private cfg: HttpClientConfig) {}

  setAccessToken(token: string | undefined): void {
    if (token === undefined) {
      delete this.cfg.accessToken;
    } else {
      this.cfg.accessToken = token;
    }
  }

  setApiKey(key: string | undefined): void {
    if (key === undefined) {
      delete this.cfg.apiKey;
    } else {
      this.cfg.apiKey = key;
    }
  }

  setTokenManager(tm: TokenManager | undefined): void {
    if (tm === undefined) {
      delete this.cfg.tokenManager;
    } else {
      this.cfg.tokenManager = tm;
    }
  }

  async request<T>(args: RequestArgs): Promise<ResolvedResponse<T>> {
    const url = this.buildUrl(args.path, args.query);
    const isMultipart = typeof FormData !== "undefined" && args.body instanceof FormData;

    // Auth refresh state: when tokenManager exists, we allow exactly one
    // forced refresh + retry if the server returns 401.
    let authRetriedOnce = false;
    const retries = this.cfg.retries;
    const maxAttempts = retries ? Math.max(1, retries.max + 1) : 1;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const headers = await this.buildHeaders(
        args.options,
        args.body !== undefined,
        isMultipart,
        args.skipAuth ?? false,
      );
      const init: RequestInit = { method: args.method, headers };
      if (args.body !== undefined) {
        init.body = isMultipart ? (args.body as FormData) : JSON.stringify(args.body);
      }

      const controller = new AbortController();
      const externalSignal = args.options?.signal;
      if (externalSignal) {
        if (externalSignal.aborted) controller.abort(externalSignal.reason);
        else
          externalSignal.addEventListener("abort", () => controller.abort(externalSignal.reason), {
            once: true,
          });
      }
      const timeoutMs = args.options?.timeoutMs ?? this.cfg.timeoutMs;
      const timeout = setTimeout(() => controller.abort(new Error("Request timeout")), timeoutMs);
      let response: Response;
      try {
        response = await this.cfg.fetch(url, { ...init, signal: controller.signal });
      } catch (err) {
        clearTimeout(timeout);
        lastError = err;
        if (retries && attempt < maxAttempts) {
          await sleep(backoffDelay(retries, attempt));
          continue;
        }
        throw new MosendNetworkError(err instanceof Error ? err.message : "Network error", err);
      }
      clearTimeout(timeout);

      const raw = readRawMetadata(response);
      if (response.ok) {
        return await parseEnvelope<T>(response, raw);
      }

      const apiError = await buildErrorFromResponse(response, raw);

      // 401 → try a forced token refresh (once) and retry the same request.
      // We only kick in if a tokenManager is configured. Without one, 401 is final.
      // skipAuth requests (the refresh call itself) never trigger this path.
      if (
        response.status === 401 &&
        this.cfg.tokenManager &&
        !authRetriedOnce &&
        !args.skipAuth
      ) {
        authRetriedOnce = true;
        try {
          await this.cfg.tokenManager.refresh();
          // Do not consume one of the configured retry attempts on auth refresh.
          attempt -= 1;
          continue;
        } catch (refreshErr) {
          // Refresh failed — surface the original 401 to the caller.
          if (refreshErr instanceof MosendApiError) throw refreshErr;
          throw apiError;
        }
      }

      const shouldRetry =
        retries && attempt < maxAttempts && retries.on.includes(response.status);
      if (shouldRetry) {
        const retryAfter = retryAfterMs(response, attempt, retries);
        await sleep(retryAfter);
        lastError = apiError;
        continue;
      }
      throw apiError;
    }

    if (lastError instanceof MosendError) throw lastError;
    throw new MosendNetworkError("Exhausted retries", lastError);
  }

  private buildUrl(
    path: string,
    query?: Record<string, string | number | boolean | null | undefined>,
  ): string {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${this.cfg.baseUrl}${normalized}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) continue;
        url.searchParams.append(key, String(value));
      }
    }
    return url.toString();
  }

  private async buildHeaders(
    opts: RequestOptions | undefined,
    hasBody: boolean,
    isMultipart: boolean,
    skipAuth: boolean,
  ): Promise<Record<string, string>> {
    const authConfig: AuthConfig = skipAuth
      ? {}
      : {
          ...(this.cfg.apiKey !== undefined ? { apiKey: this.cfg.apiKey } : {}),
          ...(this.cfg.accessToken !== undefined ? { accessToken: this.cfg.accessToken } : {}),
        };
    // TokenManager wins over a static accessToken — it always reflects the
    // freshest token (and may refresh proactively when expiry is near).
    if (!skipAuth && this.cfg.tokenManager) {
      const token = await this.cfg.tokenManager.getAccessToken();
      if (token) authConfig.accessToken = token;
    }
    const headers: Record<string, string> = {
      Accept: "application/json",
      "User-Agent": this.cfg.userAgent,
      ...this.cfg.defaultHeaders,
      ...resolveAuthHeader(authConfig),
    };
    if (hasBody && !isMultipart) headers["Content-Type"] = "application/json";
    if (opts?.idempotencyKey) headers["Idempotency-Key"] = opts.idempotencyKey;
    if (opts?.headers) Object.assign(headers, opts.headers);
    return headers;
  }
}

function readRawMetadata(response: Response): RawResponse {
  const limit = response.headers.get("x-ratelimit-limit");
  const remaining = response.headers.get("x-ratelimit-remaining");
  const reset = response.headers.get("x-ratelimit-reset");
  return {
    status: response.status,
    requestId: response.headers.get("x-request-id"),
    rateLimit: {
      limit: limit !== null ? Number(limit) : null,
      remaining: remaining !== null ? Number(remaining) : null,
      resetSec: reset !== null ? Number(reset) : null,
    },
    timestamp: null,
  };
}

async function parseEnvelope<T>(response: Response, raw: RawResponse): Promise<ResolvedResponse<T>> {
  if (response.status === 204) {
    return { data: undefined as unknown as T, raw };
  }
  const text = await response.text();
  if (!text) return { data: undefined as unknown as T, raw };
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new MosendNetworkError(`Invalid JSON response: ${(err as Error).message}`, err);
  }
  if (parsed && typeof parsed === "object" && "data" in (parsed as Record<string, unknown>)) {
    const envelope = parsed as ApiEnvelope<T>;
    return {
      data: envelope.data,
      raw: { ...raw, timestamp: envelope.timestamp ?? null },
    };
  }
  return { data: parsed as T, raw };
}

async function buildErrorFromResponse(response: Response, raw: RawResponse) {
  const text = await response.text();
  let body: MosendApiErrorBody | string | null = null;
  if (text) {
    try {
      body = JSON.parse(text) as MosendApiErrorBody;
    } catch {
      body = text;
    }
  }
  const retryAfterHeader = response.headers.get("retry-after");
  const retryAfterSec =
    retryAfterHeader !== null ? Number(retryAfterHeader) : raw.rateLimit.resetSec;
  return buildApiError({
    status: response.status,
    body,
    requestId: raw.requestId,
    retryAfterSec: Number.isFinite(retryAfterSec) ? retryAfterSec : null,
  });
}

function backoffDelay(cfg: RetryConfig, attempt: number): number {
  const base = cfg.baseDelayMs ?? 250;
  const jitter = Math.random() * 100;
  return base * 2 ** (attempt - 1) + jitter;
}

function retryAfterMs(response: Response, attempt: number, cfg: RetryConfig): number {
  const header = response.headers.get("retry-after");
  if (header !== null) {
    const sec = Number(header);
    if (Number.isFinite(sec) && sec >= 0) return sec * 1000;
  }
  return backoffDelay(cfg, attempt);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function toPaginated<T>(payload: unknown): Paginated<T> {
  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { data?: unknown[] }).data)
  ) {
    const obj = payload as { data: T[]; pageInfo?: PageInfo };
    return {
      data: obj.data,
      pageInfo: obj.pageInfo ?? { endCursor: null, hasNextPage: false },
    };
  }
  if (Array.isArray(payload)) {
    return { data: payload as T[], pageInfo: { endCursor: null, hasNextPage: false } };
  }
  return { data: [], pageInfo: { endCursor: null, hasNextPage: false } };
}
