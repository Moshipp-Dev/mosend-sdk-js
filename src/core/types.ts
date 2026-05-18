export type ApiTimestamp = string;

export interface ApiEnvelope<T> {
  data: T;
  timestamp: ApiTimestamp;
}

export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

export interface Paginated<T> {
  data: T[];
  pageInfo: PageInfo;
}

export interface RateLimitInfo {
  limit: number | null;
  remaining: number | null;
  resetSec: number | null;
}

export interface RawResponse {
  status: number;
  requestId: string | null;
  rateLimit: RateLimitInfo;
  timestamp: ApiTimestamp | null;
}

export interface RequestOptions {
  idempotencyKey?: string;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
