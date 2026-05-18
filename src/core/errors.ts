export interface MosendApiErrorBody {
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp?: string;
  path?: string;
  metaCode?: number;
  metaSubcode?: number;
}

export class MosendError extends Error {
  override readonly name: string = "MosendError";
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class MosendValidationError extends MosendError {
  override readonly name = "MosendValidationError";
  constructor(message: string) {
    super(message);
  }
}

export class MosendNetworkError extends MosendError {
  override readonly name = "MosendNetworkError";
  override readonly cause: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.cause = cause;
  }
}

export class MosendWebhookSignatureError extends MosendError {
  override readonly name = "MosendWebhookSignatureError";
  constructor(message = "Invalid webhook signature") {
    super(message);
  }
}

export class MosendApiError extends MosendError {
  override readonly name: string = "MosendApiError";
  readonly status: number;
  readonly code: string;
  readonly body: MosendApiErrorBody | string | null;
  readonly requestId: string | null;
  readonly path: string | undefined;
  readonly metaCode: number | undefined;
  readonly metaSubcode: number | undefined;

  constructor(args: {
    status: number;
    message: string;
    code?: string;
    body?: MosendApiErrorBody | string | null;
    requestId?: string | null;
    path?: string;
    metaCode?: number;
    metaSubcode?: number;
  }) {
    super(args.message);
    this.status = args.status;
    this.code = args.code ?? "api_error";
    this.body = args.body ?? null;
    this.requestId = args.requestId ?? null;
    this.path = args.path;
    this.metaCode = args.metaCode;
    this.metaSubcode = args.metaSubcode;
  }
}

export class MosendBadRequestError extends MosendApiError {
  override readonly name = "MosendBadRequestError";
}
export class MosendAuthError extends MosendApiError {
  override readonly name = "MosendAuthError";
}
export class MosendPaymentRequiredError extends MosendApiError {
  override readonly name = "MosendPaymentRequiredError";
}
export class MosendForbiddenError extends MosendApiError {
  override readonly name = "MosendForbiddenError";
}
export class MosendNotFoundError extends MosendApiError {
  override readonly name = "MosendNotFoundError";
}
export class MosendConflictError extends MosendApiError {
  override readonly name = "MosendConflictError";
}
export class MosendUnprocessableError extends MosendApiError {
  override readonly name = "MosendUnprocessableError";
}
export class MosendRateLimitError extends MosendApiError {
  override readonly name = "MosendRateLimitError";
  readonly retryAfterSec: number | null;
  constructor(args: ConstructorParameters<typeof MosendApiError>[0] & { retryAfterSec?: number | null }) {
    super(args);
    this.retryAfterSec = args.retryAfterSec ?? null;
  }
}
export class MosendServerError extends MosendApiError {
  override readonly name = "MosendServerError";
}

export function buildApiError(args: {
  status: number;
  body: MosendApiErrorBody | string | null;
  requestId: string | null;
  retryAfterSec: number | null;
}): MosendApiError {
  const { status, body, requestId, retryAfterSec } = args;
  const parsed = typeof body === "object" && body !== null ? body : null;
  const message =
    parsed && typeof parsed.message === "string"
      ? parsed.message
      : parsed && Array.isArray(parsed.message)
        ? parsed.message.join("; ")
        : typeof body === "string" && body.length > 0
          ? body
          : `HTTP ${status}`;
  const base = {
    status,
    message,
    code: parsed?.error ?? "api_error",
    body,
    requestId,
    ...(parsed?.path !== undefined ? { path: parsed.path } : {}),
    ...(parsed?.metaCode !== undefined ? { metaCode: parsed.metaCode } : {}),
    ...(parsed?.metaSubcode !== undefined ? { metaSubcode: parsed.metaSubcode } : {}),
  };
  switch (status) {
    case 400:
      return new MosendBadRequestError(base);
    case 401:
      return new MosendAuthError(base);
    case 402:
      return new MosendPaymentRequiredError(base);
    case 403:
      return new MosendForbiddenError(base);
    case 404:
      return new MosendNotFoundError(base);
    case 409:
      return new MosendConflictError(base);
    case 422:
      return new MosendUnprocessableError(base);
    case 429:
      return new MosendRateLimitError({ ...base, retryAfterSec });
    default:
      if (status >= 500) return new MosendServerError(base);
      return new MosendApiError(base);
  }
}
