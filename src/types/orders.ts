import type { ISODateString, UUID } from "./common.js";

// Pedidos del carrito de WhatsApp y catálogo de Meta Commerce. Los `Decimal`
// de la base (`total`, `itemPrice`, `price`) llegan como string.

export type WhatsAppOrderStatus = "RECEIVED" | "PROCESSING" | "COMPLETED" | "CANCELLED";

export interface WhatsAppOrderItem {
  id: UUID;
  orderId: UUID;
  productRetailerId: string;
  quantity: number;
  itemPrice: string;
  currency: string | null;
}

export interface WhatsAppOrder {
  id: UUID;
  organizationId: UUID;
  conversationId: UUID;
  contactId: UUID;
  phoneNumberId: UUID;
  messageId: UUID | null;
  metaMessageId: string;
  catalogId: string;
  note: string | null;
  currency: string | null;
  total: string;
  status: WhatsAppOrderStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  items: WhatsAppOrderItem[];
}

export interface UpdateWhatsAppOrderStatusInput {
  status: WhatsAppOrderStatus;
}

export interface CatalogConnectResult {
  catalogId: string;
  catalogName: string | null;
  /** Productos sincronizados. */
  products: number;
}

export interface CatalogSyncResult {
  catalogId: string;
  products: number;
}

export interface CatalogProduct {
  id: UUID;
  organizationId: UUID;
  catalogId: string;
  retailerId: string;
  metaProductId: string | null;
  name: string | null;
  price: string | null;
  currency: string | null;
  availability: string | null;
  imageUrl: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Respuesta de Meta tal cual (snake_case); puede venir vacía. */
export interface CommerceSettings {
  is_cart_enabled?: boolean;
  is_catalog_visible?: boolean;
}

export interface UpdateCommerceSettingsInput {
  isCartEnabled?: boolean;
  isCatalogVisible?: boolean;
}
