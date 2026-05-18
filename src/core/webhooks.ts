import { createHmac, timingSafeEqual } from "node:crypto";
import { MosendWebhookSignatureError } from "./errors.js";

export interface WebhookEventBase {
  event: string;
  deliveryId: string;
  organizationId: string;
  occurredAt: string;
  data: unknown;
}

export type MosendWebhookEvent =
  | (WebhookEventBase & { event: "message.new" })
  | (WebhookEventBase & { event: "message.status" })
  | (WebhookEventBase & { event: "conversation.opened" })
  | (WebhookEventBase & { event: "conversation.closed" })
  | (WebhookEventBase & { event: "conversation.assigned" })
  | (WebhookEventBase & { event: "template.status" })
  | (WebhookEventBase & { event: "phone.quality" })
  | (WebhookEventBase & { event: "invoice.issued" })
  | (WebhookEventBase & { event: "invoice.paid" })
  | (WebhookEventBase & { event: "invoice.overdue" })
  | (WebhookEventBase & { event: "wallet.recharged" });

const SIGNATURE_PREFIX = "sha256=";

export function computeWebhookSignature(rawBody: string | Uint8Array, secret: string): string {
  const hmac = createHmac("sha256", secret);
  hmac.update(typeof rawBody === "string" ? Buffer.from(rawBody, "utf8") : Buffer.from(rawBody));
  return `${SIGNATURE_PREFIX}${hmac.digest("hex")}`;
}

export function verifyWebhookSignature(
  rawBody: string | Uint8Array,
  signature: string | null | undefined,
  secret: string,
): boolean {
  if (!signature || !secret) return false;
  const expected = computeWebhookSignature(rawBody, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function parseWebhookEvent(
  rawBody: string | Uint8Array,
  signature: string | null | undefined,
  secret: string,
): MosendWebhookEvent {
  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    throw new MosendWebhookSignatureError();
  }
  const text = typeof rawBody === "string" ? rawBody : Buffer.from(rawBody).toString("utf8");
  return JSON.parse(text) as MosendWebhookEvent;
}
