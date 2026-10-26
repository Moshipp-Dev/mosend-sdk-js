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

/** Archivo adjunto a una nota (lo devuelve `contacts.uploadNoteAttachment`). */
export interface NoteAttachment {
  mediaId: UUID;
  nombre: string;
  tipo: string;
  tamano: number;
}

export interface ContactNote {
  id: UUID;
  contactId: UUID;
  body: string;
  pinned: boolean;
  authorUserId?: UUID;
  /** Usuarios mencionados con @. */
  menciones?: UUID[];
  adjuntos?: NoteAttachment[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateContactNoteInput {
  /** 1-5000 caracteres. */
  body: string;
  pinned?: boolean;
  /** Usuarios mencionados con @ (máx. 20): se les avisa. */
  menciones?: UUID[];
  /** Archivos subidos antes con `uploadNoteAttachment` (máx. 10). */
  adjuntos?: NoteAttachment[];
}

export interface UpdateContactNoteInput {
  body?: string;
  pinned?: boolean;
  menciones?: UUID[];
  adjuntos?: NoteAttachment[];
}

/**
 * Filtro de contactos: el mismo del listado (`contacts.list`), de la
 * exportación, de `contactLists.addByFilter` y de las listas inteligentes.
 */
export interface ContactFilter {
  q?: string;
  channel?: "whatsapp" | "web" | "all";
  identifiedOnly?: boolean;
  tagId?: string;
  optInStatus?: "OPTED_IN" | "OPTED_OUT" | "UNKNOWN";
  country?: string;
  language?: string;
  hasConversations?: boolean;
  lastActivityDaysGt?: number;
}

/** Filtros del CRM sobre contactos (listado, exportación y listas inteligentes). */
export interface ContactCrmFilter {
  /** Id del dueño, o `"ninguno"` para los que no tienen. */
  duenoUserId?: string;
  /** Id de la empresa, o `"ninguna"`. */
  empresaId?: string;
  etapa?: "PROSPECTO" | "CLIENTE" | "RECURRENTE" | "INACTIVO";
  /** Valor exacto de campos definidos: `{ clave: valor }`. */
  campos?: Record<string, string | number>;
  /** Compró en los últimos N días. */
  compraEnDias?: number;
  /** No compra hace más de N días (o nunca). */
  sinCompraDias?: number;
  gastoMin?: number;
  puntajeMin?: number;
}

/** Filtro guardado de una lista inteligente: sus miembros se calculan al usarla. */
export type ContactListSmartFilter = ContactFilter & ContactCrmFilter & Record<string, unknown>;

export interface ContactList {
  id: UUID;
  name: string;
  description?: string;
  color?: string;
  memberCount?: number;
  /** Presente si es lista inteligente. */
  smartFilter?: ContactListSmartFilter | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * Destino de una columna al importar un CSV: `phone`, `name`, `email`,
 * `language`, `opt_in`, `empresa`, `empresa_nit`, `dueno` (correo del asesor),
 * `etapa`, `ignorar` o `campo:<clave>`.
 */
export type ImportColumnTarget =
  | "phone"
  | "name"
  | "email"
  | "language"
  | "opt_in"
  | "empresa"
  | "empresa_nit"
  | "dueno"
  | "etapa"
  | "ignorar"
  | `campo:${string}`;

export interface ImportContactsCsvInput {
  file: Blob | File;
  filename?: string;
  /** País por defecto para números sin indicativo (p. ej. `"CO"`). */
  defaultCountry?: string;
  defaultOptIn?: boolean;
  /** `{ "<columna del CSV>": destino }`. Una columna sin destino entra como atributo suelto. */
  mapeo?: Record<string, ImportColumnTarget>;
}

export interface ImportContactsResult {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  errors: Array<{ row: number; phone: string; reason: string }>;
  [key: string]: unknown;
}

export interface ImportPreview {
  total: number;
  columnas: string[];
  muestra: Array<Record<string, string>>;
  sugerido: Record<string, ImportColumnTarget>;
  campos: Array<{ clave: string; etiqueta: string }>;
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
  autoOpenContactPanel?: boolean;
  requireOwnershipToReply?: boolean;
  /** Pedir clasificación al cerrar una conversación. */
  askCategoryOnClose?: boolean;
  /** Cuándo se marca como vista: al abrirla o al empezar a responderla. */
  markReadOn?: "ABRIR" | "ATENDER";
  contactPanelDefaultTab?: "info" | "notes" | "tasks" | "seguimiento" | "gallery";
  contactPanelTabs?: string[];
  contactPanelOpenTab?: string | null;
  contactPanelOpenSubTab?: string | null;
  /** Pestañas visibles del inbox (orden + visibilidad, máx. 3). */
  inboxTabs?: string[];
  unreadScope?: "open" | "all";
}

/** Correos de aviso por retraso de conversación y demás correos de la org. */
export interface NotificationSettings {
  conversationDelayEmail?: {
    enabled?: boolean;
    toAdmins?: boolean;
    toAssignedAgent?: boolean;
    thresholdMin?: number;
  };
  emails?: Record<string, boolean>;
  [key: string]: unknown;
}

export interface UpdateNotificationSettingsInput {
  conversationDelayEmail?: {
    enabled?: boolean;
    toAdmins?: boolean;
    toAssignedAgent?: boolean;
    thresholdMin?: number;
  };
  /** Interruptores por tipo de correo: `{ <clave>: true|false }`. */
  emails?: Partial<Record<string, boolean>>;
}

export interface WorkloadSettings {
  slaResponseThresholdMin?: number;
  staleConversationThresholdHours?: number;
  [key: string]: unknown;
}

export interface UpdateWorkloadSettingsInput {
  slaResponseThresholdMin?: number;
  staleConversationThresholdHours?: number;
  autoCloseAfterAgentLastMin?: number | null;
  autoCloseAfterClientLastMin?: number | null;
  autoCloseRespectBusinessHours?: boolean;
  botMemoryResetHours?: number;
  volverAlUltimoAsesor?: boolean;
  siElAsesorNoEstaTrabajando?: "bot" | "otro_asesor";
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

export type UpdateTagInput = Partial<CreateTagInput>;

// ── Mensajes interactivos (POST /messages/interactive|product|flow|carousel) ──

interface InteractiveBase {
  phoneNumberId: UUID;
  /** waId del destinatario. */
  to: string;
  replyToMessageId?: string;
}

export interface ListRow {
  id: string;
  /** Máx. 24 caracteres. */
  title: string;
  /** Máx. 72 caracteres. */
  description?: string;
}

export interface ListSection {
  title?: string;
  rows: ListRow[];
}

export interface SendInteractiveInput extends InteractiveBase {
  kind: "list" | "cta_url" | "location_request" | "request_contact_info";
  bodyText?: string;
  headerText?: string;
  footerText?: string;
  /** Texto del botón que abre la lista (`kind: "list"`). */
  buttonText?: string;
  sections?: ListSection[];
  /** Texto del botón (`kind: "cta_url"`). */
  displayText?: string;
  url?: string;
}

export interface ProductSection {
  title: string;
  productRetailerIds: string[];
}

export interface SendProductInput extends InteractiveBase {
  catalogId: string;
  bodyText?: string;
  footerText?: string;
  headerText?: string;
  /** Producto único. */
  productRetailerId?: string;
  products?: string[];
  sections?: ProductSection[];
  /** Mensaje de catálogo completo. */
  catalogMessage?: boolean;
  thumbnailProductRetailerId?: string;
}

export interface SendFlowInput extends InteractiveBase {
  /** Id del Flow en Meta. */
  flowId: string;
  bodyText: string;
  ctaText: string;
  headerText?: string;
  footerText?: string;
  screen?: string;
  data?: Record<string, unknown>;
  flowAction?: "navigate" | "data_exchange";
}

export interface CarouselCard {
  headerType: "image" | "video";
  headerLink: string;
  /** Máx. 160 caracteres. */
  bodyText?: string;
  ctaUrl?: { displayText: string; url: string };
  quickReplies?: Array<{ id: string; title: string }>;
}

export interface SendCarouselInput extends InteractiveBase {
  bodyText: string;
  /** Hasta 10 tarjetas. */
  cards: CarouselCard[];
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

/** Enlace de suscripción (In-App Signup): opt-in verificado por Meta. */
export interface SignupLink {
  id: UUID;
  wabaId: UUID;
  metaSignupId: string;
  displayName?: string | null;
  signupMessage: string;
  confirmationMessage: string;
  privacyPolicyUrl: string;
  websiteUrl?: string | null;
  promoCode?: string | null;
  status: "ACTIVE" | "DISABLED";
  wabaName?: string;
  /** Deep links wa.me/<tel>/signup/<id>, uno por número REGISTERED de la WABA. */
  deepLinks?: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateSignupLinkInput {
  wabaId: UUID;
  /** Pantalla de consentimiento de Meta (1-300 chars). */
  signupMessage: string;
  /** Mensaje post-aceptación; admite {{promo_code}} (1-300 chars). */
  confirmationMessage: string;
  /** INMUTABLE después de crear. */
  privacyPolicyUrl: string;
  websiteUrl?: string;
  /** Alfanumérico 1-50; requerido si usas {{promo_code}}. */
  promoCode?: string;
  displayName?: string;
}

export interface UpdateSignupLinkInput {
  status?: "ACTIVE" | "DISABLED";
  signupMessage?: string;
  confirmationMessage?: string;
  promoCode?: string;
  displayName?: string;
  websiteUrl?: string;
}

export interface WhatsappLinkStats {
  totalClicks: number;
  uniqueClicks?: number;
  clicksByDay?: Array<{ day: ISODateString; count: number }>;
}
