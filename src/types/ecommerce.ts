import type { ISODateString, UUID } from "./common.js";

export type StorePlatform = "WOOCOMMERCE" | "SHOPIFY";

export type StoreConnectionStatus = "ACTIVE" | "PAUSED";

export type StoreEventType =
  | "ORDER_CREATED"
  | "ORDER_PAID"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED"
  | "ORDER_CANCELLED"
  | "REFUNDED"
  | "ABANDONED_CART"
  | "BACK_IN_STOCK"
  | "ORDER_NOTE"
  | "DIGITAL_DELIVERY";

export type StoreEventStatus =
  | "RECEIVED"
  | "SKIPPED_NO_CONSENT"
  | "SKIPPED_NO_MAPPING"
  | "SKIPPED_NO_PHONE"
  | "QUEUED"
  | "SENT"
  | "FAILED";

export interface StoreConnection {
  id: UUID;
  platform: StorePlatform;
  name: string;
  phoneNumberId: UUID;
  storeDomain?: string | null;
  status: StoreConnectionStatus;
  /** Solo presente al crear/rotar el secreto (se muestra una sola vez). */
  ingestSecret?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface StoreEventMapping {
  id: UUID;
  eventType: StoreEventType;
  enabled: boolean;
  templateId?: UUID | null;
  languageCode?: string | null;
  variableMap?: Record<string, string> | null;
  delayMinutes?: number | null;
}

export interface StoreEventLogEntry {
  id: UUID;
  eventType: StoreEventType;
  status: StoreEventStatus;
  externalEventId?: string | null;
  reason?: string | null;
  createdAt: ISODateString;
}

export interface CreateStoreConnectionInput {
  platform: StorePlatform;
  name: string;
  phoneNumberId: UUID;
  storeDomain?: string;
}

export interface UpdateStoreConnectionInput {
  name?: string;
  phoneNumberId?: UUID;
  storeDomain?: string;
  status?: StoreConnectionStatus;
}

export interface UpsertStoreMappingInput {
  eventType: StoreEventType;
  enabled?: boolean;
  templateId?: UUID;
  languageCode?: string;
  variableMap?: Record<string, string>;
  delayMinutes?: number;
}

export interface StoreTemplateCatalogItem {
  catalogKey: string;
  eventType?: StoreEventType;
  name?: string;
  language?: string;
  [key: string]: unknown;
}

export interface StoreTemplateVariable {
  key: string;
  description?: string;
  [key: string]: unknown;
}

export interface StoreTemplateStatusItem {
  catalogKey: string;
  installed: boolean;
  status?: string;
  templateId?: UUID;
  [key: string]: unknown;
}

export interface InstallStoreTemplateInput {
  catalogKey: string;
  wabaId?: UUID;
  language?: string;
  name?: string;
  connectionId?: UUID;
  bodyText?: string;
  bodyExample?: string[];
  headerText?: string;
  headerExample?: string;
  footer?: string;
  variableMap?: Record<string, string>;
}

export interface StoreTemplateStatusQuery {
  orgId?: string;
  wabaId?: string;
  connectionId?: string;
}
