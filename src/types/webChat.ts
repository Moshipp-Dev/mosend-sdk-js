import type { ISODateString, UUID } from "./common.js";

export interface WebChatChannel {
  id: UUID;
  name: string;
  token: string;
  phoneNumberId?: UUID;
  color?: string;
  welcomeMessage?: string;
  allowedDomains?: string[];
  precaptureEnabled?: boolean;
  requireEmailUpfront?: boolean;
  botEnabled?: boolean;
  enabled?: boolean;
  hasIdentitySecret?: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateWebChatChannelInput {
  name: string;
  color?: string;
  welcomeMessage?: string;
  allowedDomains?: string[];
  precaptureEnabled?: boolean;
  requireEmailUpfront?: boolean;
  botEnabled?: boolean;
  enabled?: boolean;
}

export interface UpdateWebChatChannelInput {
  name?: string;
  color?: string;
  welcomeMessage?: string;
  allowedDomains?: string[];
  precaptureEnabled?: boolean;
  requireEmailUpfront?: boolean;
  botEnabled?: boolean;
  enabled?: boolean;
  identityRequired?: boolean;
  operatingHours?: Record<string, unknown>;
  offlineAction?: Record<string, unknown>;
  offlineMessage?: string;
  prechatFields?: Array<Record<string, unknown>>;
  departments?: Array<Record<string, unknown>>;
  proactiveTriggers?: Array<Record<string, unknown>>;
  linkEmailBannerEnabled?: boolean;
}

export interface SendWebChatMessageInput {
  type?: "text" | "image" | "video" | "audio" | "document";
  body?: string;
  mediaAssetId?: UUID;
  replyToMessageId?: UUID;
}

export interface WebChatSnippet {
  html: string;
}

export interface WebChatIdentitySecret {
  secret: string;
  rotatedAt: ISODateString;
}

export interface WebChatPublicSession {
  sessionToken: string;
  visitorId: UUID;
  identityVerified?: boolean;
  expiresAt: ISODateString;
}

export type WebChatSessionMode = "anonymous" | "identified" | "verify-otp" | "host-identified";

export interface CreateWebChatSessionInput {
  visitorId: string;
  mode: WebChatSessionMode;
  name?: string;
  email?: string;
  phone?: string;
  otp?: string;
  userId?: string;
  /** HMAC de identidad (modo host-identified). */
  hash?: string;
  attributes?: Record<string, unknown>;
  departmentId?: string;
  prechat?: Record<string, string>;
  url?: string;
  referer?: string;
  title?: string;
  lang?: string;
  utm?: Record<string, unknown>;
}

export interface WebChatMessage {
  id: UUID;
  conversationId: UUID;
  direction: "IN" | "OUT";
  type: string;
  payload: Record<string, unknown>;
  createdAt: ISODateString;
}

export interface SendWebChatPublicMessageInput {
  caption?: string;
  attachment: {
    mediaAssetId: UUID;
    kind: "image" | "video" | "document";
    filename?: string;
  };
}

export interface LinkEmailInput {
  email: string;
  name?: string;
}
