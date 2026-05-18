import type { FetchLike } from "../../src/core/http.js";

export interface RecordedRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  formData: Record<string, string> | null;
}

export interface MockResponseInit {
  status?: number;
  headers?: Record<string, string>;
  body?: unknown;
}

export type Handler = (req: RecordedRequest) => MockResponseInit | Promise<MockResponseInit>;

export function createMockFetch(handler: Handler): {
  fetch: FetchLike;
  requests: RecordedRequest[];
} {
  const requests: RecordedRequest[] = [];
  const fetchImpl: FetchLike = async (input, init = {}) => {
    const headers: Record<string, string> = {};
    const rawHeaders = init.headers ?? {};
    if (rawHeaders instanceof Headers) {
      rawHeaders.forEach((v, k) => (headers[k.toLowerCase()] = v));
    } else if (Array.isArray(rawHeaders)) {
      for (const [k, v] of rawHeaders) headers[k.toLowerCase()] = v;
    } else {
      for (const [k, v] of Object.entries(rawHeaders)) headers[k.toLowerCase()] = String(v);
    }
    let bodyStr: string | null = null;
    let formDataEntries: Record<string, string> | null = null;
    if (typeof init.body === "string") {
      bodyStr = init.body;
    } else if (init.body instanceof FormData) {
      formDataEntries = {};
      for (const [key, value] of init.body.entries()) {
        if (typeof value === "string") {
          formDataEntries[key] = value;
        } else {
          formDataEntries[key] = `[Blob name=${(value as File).name ?? ""} size=${value.size}]`;
        }
      }
      bodyStr = JSON.stringify(formDataEntries);
      headers["content-type"] = headers["content-type"] ?? "multipart/form-data; boundary=test";
    } else if (init.body != null) {
      bodyStr = String(init.body);
    }
    const recorded: RecordedRequest = {
      url: input,
      method: (init.method ?? "GET").toUpperCase(),
      headers,
      body: bodyStr,
      formData: formDataEntries,
    };
    requests.push(recorded);
    const result = await handler(recorded);
    const responseBody = result.body === undefined ? "" : JSON.stringify(result.body);
    const responseHeaders = new Headers(result.headers);
    if (responseBody && !responseHeaders.has("content-type")) {
      responseHeaders.set("content-type", "application/json");
    }
    return new Response(responseBody, {
      status: result.status ?? 200,
      headers: responseHeaders,
    });
  };
  return { fetch: fetchImpl, requests };
}
