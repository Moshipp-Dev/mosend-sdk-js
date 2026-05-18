import { resolveAuthHeader, type AuthConfig } from "./auth.js";
import {
  buildApiError,
  MosendError,
  MosendNetworkError,
  MosendValidationError,
  type MosendApiErrorBody,
} from "./errors.js";
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
}

export interface RequestArgs {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  options?: RequestOptions;
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
    userAgent: input.userAgent ?? `mosend-sdk-js/0.1.0`,
    defaultHeaders: input.defaultHeaders ?? {},
    ...(input.apiKey !== undefined ? { apiKey: input.apiKey } : {}),
    ...(input.accessToken !== undefined ? { accessToken: input.accessToken } : {}),
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

  async request<T>(args: RequestArgs): Promise<ResolvedResponse<T>> {
    const url = this.buildUrl(args.path, args.query);
    const isMultipart =
      typeof FormData !== "undefined" && args.body instanceof FormData;
    const headers = this.buildHeaders(args.options, args.body !== undefined, isMultipart);
    const init: RequestInit = { method: args.method, headers };
    if (args.body !== undefined) {
      init.body = isMultipart ? (args.body as FormData) : JSON.stringify(args.body);
    }

    const retries = this.cfg.retries;
    const maxAttempts = retries ? Math.max(1, retries.max + 1) : 1;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const externalSignal = args.options?.signal;
      if (externalSignal) {
        if (externalSignal.aborted) controller.abort(externalSignal.reason);
        else externalSignal.addEventListener("abort", () => controller.abort(externalSignal.reason), { once: true });
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
        throw new MosendNetworkError(
          err instanceof Error ? err.message : "Network error",
          err,
        );
      }
      clearTimeout(timeout);

      const raw = readRawMetadata(response);
      if (response.ok) {
        return await parseEnvelope<T>(response, raw);
      }

      const apiError = await buildErrorFromResponse(response, raw);
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

  private buildHeaders(
    opts: RequestOptions | undefined,
    hasBody: boolean,
    isMultipart: boolean,
  ): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "User-Agent": this.cfg.userAgent,
      ...this.cfg.defaultHeaders,
      ...resolveAuthHeader({
        ...(this.cfg.apiKey !== undefined ? { apiKey: this.cfg.apiKey } : {}),
        ...(this.cfg.accessToken !== undefined ? { accessToken: this.cfg.accessToken } : {}),
      }),
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
    retryAfterHeader !== null
      ? Number(retryAfterHeader)
      : raw.rateLimit.resetSec;
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

export function toPaginated<T>(
  payload: unknown,
): Paginated<T> {
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
