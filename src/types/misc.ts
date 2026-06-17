import type { ISODateString, UUID } from "./common.js";

export interface AuditEvent {
  id: UUID;
  organizationId?: UUID;
  actorUserId?: UUID;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: ISODateString;
}

export interface AuditExportResponse {
  url: string;
  expiresAt?: ISODateString;
}

export interface HealthStatus {
  status: "ok" | "degraded" | "down";
  uptime?: number;
  version?: string;
  checks?: Record<string, "ok" | "degraded" | "down">;
}

export interface ReportSummary {
  conversationsOpen?: number;
  conversationsClosedLast7d?: number;
  messagesSentLast7d?: number;
  [key: string]: unknown;
}

export interface ReportMessagingPoint {
  day: ISODateString;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

export interface ReportBilling {
  period: { startedAt: ISODateString; endedAt: ISODateString };
  totalAmount: number;
  conversations: number;
  templatesSent: number;
  [key: string]: unknown;
}

export interface TeamGoals {
  weeklyConversationsCreated: number | null;
  weeklyConversationsClosed: number | null;
  weeklyMessagesOut: number | null;
  closureRateTarget: number | null;
  resolutionRateTarget: number | null;
}

export type UpdateTeamGoalsInput = Partial<TeamGoals>;

export interface Notification {
  id: UUID;
  title: string;
  body?: string;
  read: boolean;
  category?: string;
  createdAt: ISODateString;
  link?: string;
}

export interface PushConfig {
  vapidPublicKey: string;
  enabled: boolean;
}

export interface PushSubscriptionInput {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface PushSubscriptionRecord {
  id: UUID;
  endpoint: string;
  userAgent?: string;
  createdAt: ISODateString;
}

export interface LeadInput {
  name: string;
  email: string;
  message: string;
  phone?: string;
  company?: string;
  source?: string;
  utm?: Record<string, string>;
}

export interface Integration {
  id: UUID;
  slug: string;
  name: string;
  installed: boolean;
  config?: Record<string, unknown>;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface IntegrationCatalogItem {
  slug: string;
  name: string;
  description?: string;
  category?: string;
  installed?: boolean;
}

export interface InstallIntegrationInput {
  slug: string;
  config?: Record<string, unknown>;
}

export interface UpdateIntegrationInput {
  config?: Record<string, unknown>;
  enabled?: boolean;
}

export interface SystemNotice {
  id: UUID;
  severity: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  body?: string;
  linkUrl?: string;
  linkLabel?: string;
  dismissible: boolean;
  updatedAt: ISODateString;
}

export interface MediaItem {
  id: UUID;
  mimeType?: string;
  sizeBytes?: number;
  filename?: string;
  createdAt: ISODateString;
}

export interface MediaUrl {
  url: string;
  expiresAt?: ISODateString;
}
