import { createHmac, timingSafeEqual } from "node:crypto";
import { MosendWebhookSignatureError } from "./errors.js";

/**
 * El cuerpo que Mosend envía es exactamente `{ type, organizationId, data,
 * timestamp }`. Este SDK declaraba `event` / `deliveryId` / `occurredAt`, que
 * el backend nunca ha mandado: se escribió sin acceso al backend y quedó como
 * ficción tipada — `event.event` era `undefined` en tiempo de ejecución.
 * Tampoco hay id de entrega: para deduplicar se usa el id del recurso dentro
 * de `data` (`data.messageId`, `data.conversationId`, `data.invoiceId`…).
 */
export interface WebhookEventBase {
  type: string;
  organizationId: string;
  data: unknown;
  timestamp: string;
}

/** Los eventos que el backend emite hoy (`outbound.enqueue`). */
export type MosendWebhookEventType =
  // Mensajes
  | "message.new"
  | "message.status"
  // Conversaciones
  | "conversation.handoff_requested"
  | "conversation.unanswered"
  | "conversation.closed"
  | "conversation.assignment_changed"
  // Equipo
  | "agent.status_changed"
  // Canales y plantillas
  | "channel.disconnected"
  | "channel.reconnected"
  | "template.status"
  | "quality.changed"
  // Agenda de citas
  | "appointment.created"
  | "appointment.rescheduled"
  | "appointment.cancelled"
  | "appointment.reminded"
  // Ventas de licencias digitales
  | "sale.completed"
  | "license.key_replaced"
  // Cuenta y facturación (eventos de la org, sin número)
  | "trial.expiring"
  | "trial.expired"
  | "invoice.issued"
  | "invoice.paid"
  | "invoice.overdue"
  | "invoice.payment_rejected"
  | "invoice.refunded"
  | "organization.suspended"
  | "organization.reactivated"
  | "usage.threshold_reached";

export type MosendWebhookEvent = WebhookEventBase & {
  type: MosendWebhookEventType;
};

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
