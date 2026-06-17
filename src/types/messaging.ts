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
      replyToMessageId?: UUID;
      clientId?: string;
    }
  | {
      phoneNumberId: UUID;
      to: string;
      type: "image" | "video" | "audio" | "document" | "sticker";
      payload: MessagePayloadMedia;
      replyToMessageId?: UUID;
      clientId?: string;
    }
  | {
      phoneNumberId: UUID;
      to: string;
      type: "location";
      payload: MessagePayloadLocation;
      replyToMessageId?: UUID;
      clientId?: string;
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
  /** Nuevo texto del mensaje (web-chat). 1–4096 caracteres. */
  body: string;
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

export interface TemplateButton {
  type: string;
  text?: string;
  url?: string;
  phone_number?: string;
  example?: string[];
  [key: string]: unknown;
}

export interface TemplateComponent {
  type: string;
  format?: string;
  text?: string;
  example?: Record<string, unknown>;
  buttons?: TemplateButton[];
  cards?: Array<{ components: TemplateComponent[] }>;
  [key: string]: unknown;
}

export interface CreateTemplateInput {
  wabaId: UUID;
  name: string;
  language: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  components: TemplateComponent[];
}

export interface UpdateTemplateInput {
  components: TemplateComponent[];
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
  attributes?: Record<string, unknown>;
}

export interface UpdateContactInput {
  name?: string;
  language?: string;
  optInStatus?: "OPTED_IN" | "OPTED_OUT" | "UNKNOWN";
  attributes?: Record<string, unknown>;
}

export interface ContactNote {
  id: UUID;
  contactId: UUID;
  body: string;
  pinned: boolean;
  authorUserId?: UUID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateContactNoteInput {
  body: string;
  pinned?: boolean;
}

export interface UpdateContactNoteInput {
  body?: string;
  pinned?: boolean;
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
  templateVariables?: {
    body?: TemplateVariableValue[];
    header?: { type: string; link?: string; text?: string; [key: string]: unknown };
    buttons?: Array<{ index: number; value: string }>;
  };
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
  sendReadReceipts?: boolean;
  sendTypingIndicator?: boolean;
  [key: string]: unknown;
}

export interface UpdateMessagingSettingsInput {
  sendReadReceipts?: boolean;
  sendTypingIndicator?: boolean;
}

export interface WorkloadSettings {
  slaResponseThresholdMin?: number;
  staleConversationThresholdHours?: number;
  [key: string]: unknown;
}

export interface UpdateWorkloadSettingsInput {
  slaResponseThresholdMin?: number;
  staleConversationThresholdHours?: number;
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
  replyToMessageId?: UUID;
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
  type: "IN" | "OUT";
  source?: string;
  channel?: string;
  createdAt: ISODateString;
}

export interface CreateOptInInput {
  type: "IN" | "OUT";
  source?: string;
  channel?: string;
  payload?: Record<string, unknown>;
}

export interface QuickReply {
  id: UUID;
  shortcut: string;
  title: string;
  body: string;
  useCount?: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateQuickReplyInput {
  shortcut: string;
  title: string;
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
  campaignTag?: string;
  metadata?: Record<string, unknown>;
}

export type UpdateWhatsappLinkInput = Partial<CreateWhatsappLinkInput>;

export interface WhatsappLinkStats {
  totalClicks: number;
  uniqueClicks?: number;
  clicksByDay?: Array<{ day: ISODateString; count: number }>;
}
