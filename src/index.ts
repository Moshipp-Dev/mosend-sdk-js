export { MosendClient, type MosendClientOptions } from "./client.js";

export {
  MosendError,
  MosendApiError,
  MosendAuthError,
  MosendBadRequestError,
  MosendConflictError,
  MosendForbiddenError,
  MosendNetworkError,
  MosendNotFoundError,
  MosendPaymentRequiredError,
  MosendRateLimitError,
  MosendServerError,
  MosendUnprocessableError,
  MosendValidationError,
  MosendWebhookSignatureError,
} from "./core/errors.js";

export {
  verifyWebhookSignature,
  computeWebhookSignature,
  parseWebhookEvent,
  type MosendWebhookEvent,
} from "./core/webhooks.js";

export type {
  ApiEnvelope,
  ApiTimestamp,
  Paginated,
  PageInfo,
  RateLimitInfo,
  RawResponse,
  RequestOptions,
} from "./core/types.js";

export type { RetryConfig, FetchLike } from "./core/http.js";

export type * from "./types/common.js";
export type * from "./types/identity.js";
export type * from "./types/messaging.js";
export type * from "./types/waba.js";
export type * from "./types/webhooks.js";
export type * from "./types/bot.js";
export type * from "./types/webChat.js";
export type * from "./types/billing.js";
export type * from "./types/misc.js";
