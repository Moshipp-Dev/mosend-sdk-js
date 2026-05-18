import type { ISODateString, UUID } from "./common.js";

export type MessageType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "document"
  | "sticker"
  | "location"
  | "contacts"
  | "interactive"
  | "template"
  | "reaction";

export type MessageDirection = "IN" | "OUT";

export type MessageStatus = "queued" | "sent" | "delivered" | "read" | "failed";

export interface MessagePayloadText {
  body: string;
  previewUrl?: boolean;
}

export interface MessagePayloadMedia {
  link?: string;
  id?: string;
  caption?: string;
  filename?: string;
}

export interface MessagePayloadLocation {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export type SendMessageInput =
  | {
      phoneNumberId: UUID;
      to: string;
      type: "text";
      payload: MessagePayloadText;
      contextMessageId?: string;
    }
  | {
      phoneNumberId: UUID;
      to: string;
      type: "image" | "video" | "audio" | "document" | "sticker";
      payload: MessagePayloadMedia;
      contextMessageId?: string;
    }
  | {
      phoneNumberId: UUID;
      to: string;
      type: "location";
      payload: MessagePayloadLocation;
      contextMessageId?: string;
    }
  | SendTemplateInput;

export type TemplateVariableValue = string | { type: string; text?: string; [key: string]: unknown };

export interface SendTemplateInput {
  phoneNumberId: UUID;
  to: string;
  type: "template";
  templateId?: UUID;
  templateName?: string;
  templateLanguage?: string;
  variables?:
    | TemplateVariableValue[]
    | {
        body?: TemplateVariableValue[];
        header?: { type: string; link?: string; text?: string; [key: string]: unknown };
        buttons?: Array<{ index: number; value: string }>;
      };
}

export interface Message {
  id: UUID;
  conversationId: UUID;
  phoneNumberId: UUID;
  to?: string;
  from?: string;
  direction: MessageDirection;
  type: MessageType;
  status: MessageStatus;
  payload: Record<string, unknown>;
  metaMessageId?: string;
  errorCode?: string;
  errorTitle?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface EditMessageInput {
  payload: Record<string, unknown>;
}

export interface Template {
  id: UUID;
  name: string;
  language: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "DISABLED";
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  components: Array<{
    type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
    text?: string;
    format?: string;
    example?: Record<string, unknown>;
    buttons?: Array<Record<string, unknown>>;
  }>;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Contact {
  id: UUID;
  waId: string;
  name?: string;
  language?: string;
  optInStatus: "OPTED_IN" | "OPTED_OUT" | "UNKNOWN";
  tags?: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateContactInput {
  waId: string;
  name?: string;
  language?: string;
  optInStatus?: "OPTED_IN" | "OPTED_OUT" | "UNKNOWN";
  attributes?: Record<string, unknown>;
}

export interface ContactList {
  id: UUID;
  name: string;
  description?: string;
  memberCount?: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type BroadcastStatus = "DRAFT" | "SCHEDULED" | "SENDING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface Broadcast {
  id: UUID;
  name: string;
  status: BroadcastStatus;
  phoneNumberId: UUID;
  templateId: UUID;
  templateLanguage: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  startedAt?: ISODateString;
  completedAt?: ISODateString;
  scheduledAt?: ISODateString;
  recipients?: Array<{
    contactId: UUID;
    contact?: { name?: string; waId: string };
    status: "PENDING" | "SENT" | "FAILED" | "DELIVERED" | "READ";
    messageId?: UUID;
    sentAt?: ISODateString;
    errorMessage?: string;
  }>;
  createdAt: ISODateString;
}

export interface CreateBroadcastInput {
  name: string;
  phoneNumberId: UUID;
  templateId: UUID;
  templateLanguage: string;
  listId?: UUID;
  contactIds?: UUID[];
  templateVariables?: Array<{
    type: "header" | "body" | "button";
    parameters: Array<Record<string, unknown>>;
  }>;
  scheduledAt?: ISODateString;
}

export type ConversationStatus = "OPEN" | "CLOSED" | "SNOOZED" | "ARCHIVED";

export interface Conversation {
  id: UUID;
  phoneNumberId: UUID;
  contactId: UUID;
  contact?: Contact;
  status: ConversationStatus;
  unreadCount?: number;
  assigneeUserId?: UUID;
  pinned?: boolean;
  snoozedUntil?: ISODateString;
  lastMessagePreview?: string;
  lastMessageAt?: ISODateString;
  tags?: Array<{ id: UUID; name: string; color?: string }>;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface MessagingSettings {
  windowExtensionHours?: number;
  autoCloseAfterDays?: number;
  defaultAssigneeId?: UUID;
  [key: string]: unknown;
}

export interface WorkloadSettings {
  enabled: boolean;
  maxOpenPerAgent?: number;
  strategy?: "ROUND_ROBIN" | "LEAST_BUSY" | "MANUAL";
  [key: string]: unknown;
}

export interface ConversationWorkload {
  agents: Array<{
    userId: UUID;
    name?: string;
    openCount: number;
    capacity?: number;
  }>;
}

export interface UnreadCounts {
  total: number;
  byPhoneNumber: Array<{ phoneNumberId: UUID; count: number }>;
}

export interface Reaction {
  messageId: UUID;
  emoji: string;
  userId?: UUID;
  contactId?: UUID;
  createdAt: ISODateString;
}

export interface SetReactionInput {
  emoji: string;
}

export interface Sticker {
  id: UUID;
  url: string;
  mimeType: string;
  width?: number;
  height?: number;
  filename?: string;
  createdAt: ISODateString;
}

export interface SendStickerInput {
  phoneNumberId: UUID;
  to: string;
  conversationId?: UUID;
}

export interface Tag {
  id: UUID;
  name: string;
  color?: string;
  createdAt: ISODateString;
}

export interface CreateTagInput {
  name: string;
  color?: string;
}

export interface OptIn {
  id: UUID;
  contactId: UUID;
  phone: string;
  source: string;
  createdAt: ISODateString;
}

export interface CreateOptInInput {
  phone: string;
  source: string;
}

export interface QuickReply {
  id: UUID;
  shortcut: string;
  body: string;
  useCount?: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateQuickReplyInput {
  shortcut: string;
  body: string;
}

export type UpdateQuickReplyInput = Partial<CreateQuickReplyInput>;

export interface WhatsappLink {
  id: UUID;
  name: string;
  slug: string;
  phoneNumberId: UUID;
  prefilledMessage?: string;
  shortUrl?: string;
  archived?: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateWhatsappLinkInput {
  name: string;
  phoneNumberId: UUID;
  prefilledMessage?: string;
  slug?: string;
}

export type UpdateWhatsappLinkInput = Partial<CreateWhatsappLinkInput>;

export interface WhatsappLinkStats {
  totalClicks: number;
  uniqueClicks?: number;
  clicksByDay?: Array<{ day: ISODateString; count: number }>;
}
