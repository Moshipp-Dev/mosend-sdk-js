import type { ISODateString, UUID } from "./common.js";

export interface WebChatChannel {
  id: UUID;
  name: string;
  token: string;
  phoneNumberId?: UUID;
  brandColor?: string;
  welcomeMessage?: string;
  requireOtp?: boolean;
  requireHmac?: boolean;
  hasIdentitySecret?: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateWebChatChannelInput {
  name: string;
  phoneNumberId?: UUID;
  brandColor?: string;
  welcomeMessage?: string;
  requireOtp?: boolean;
  requireHmac?: boolean;
}

export type UpdateWebChatChannelInput = Partial<CreateWebChatChannelInput>;

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

export interface CreateWebChatSessionInput {
  visitorId?: string;
  email?: string;
  name?: string;
  userId?: string;
  identityHash?: string;
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
  type: string;
  payload: Record<string, unknown>;
}

export interface LinkEmailInput {
  email: string;
  otp: string;
}
