import type { ISODateString, UUID } from "./common.js";

export type WebhookEventName =
  | "message.new"
  | "message.status"
  | "conversation.opened"
  | "conversation.closed"
  | "conversation.assigned"
  | "template.status"
  | "phone.quality"
  | "invoice.issued"
  | "invoice.paid"
  | "invoice.overdue"
  | "wallet.recharged";

export interface OutboundWebhook {
  id: UUID;
  url: string;
  events: WebhookEventName[];
  active: boolean;
  createdAt: ISODateString;
}

export type WebhookFormat = "GENERIC" | "TEAMS";

export interface CreateWebhookInput {
  url: string;
  events: WebhookEventName[];
  format?: WebhookFormat;
  /** Solo si `events` incluye 'conversation.unanswered'. 1–1440 min. */
  unansweredThresholdMinutes?: number;
  phoneNumberIds?: string[];
}

export interface UpdateWebhookInput {
  url?: string;
  events?: WebhookEventName[];
  format?: WebhookFormat;
  active?: boolean;
  unansweredThresholdMinutes?: number;
  phoneNumberIds?: string[];
}

export interface WebhookDelivery {
  id: UUID;
  webhookId: UUID;
  event: WebhookEventName;
  status: "PENDING" | "SUCCEEDED" | "FAILED";
  attempt: number;
  responseStatus?: number;
  responseBody?: string;
  createdAt: ISODateString;
}
