import type { ISODateString, UUID } from "./common.js";

export type SalesCurrency = "COP" | "USD" | "MXN";
export type SalesOrderStatus = "DRAFT" | "CONFIRMED" | "PAID" | "FULFILLED" | "CANCELLED";
export type SalesChannel = "WHATSAPP" | "WEB" | "INSTAGRAM" | "STORE" | "MANUAL";
export type SalesInvoiceStatus = "PENDING" | "ISSUED" | "REJECTED" | "ERROR" | "CREDITED";
export type SalesDocType = "INVOICE" | "CREDIT_NOTE";

export interface SalesDeleted {
  deleted: true;
}

// ─── Entitlement ─────────────────────────────────────────────────────────────

export interface SalesFeatureEntitlement {
  available: boolean;
  includedInPlan: boolean;
  paidAddon: boolean;
}

export interface SalesEntitlement {
  organizationId: UUID;
  salesBilling: SalesFeatureEntitlement;
  einvoicing: SalesFeatureEntitlement;
}

export interface SetSalesAddonsInput {
  salesBilling?: boolean;
  einvoicing?: boolean;
}

// ─── Productos ───────────────────────────────────────────────────────────────

export interface SalesProduct {
  id: UUID;
  organizationId: UUID;
  name: string;
  sku: string | null;
  description: string | null;
  priceCents: number;
  currency: string;
  taxRate: number;
  unitCode: string | null;
  imageMediaId: UUID | null;
  active: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateSalesProductInput {
  name: string;
  sku?: string;
  description?: string;
  /** Precio unitario en centavos. */
  priceCents: number;
  currency?: SalesCurrency;
  /** IVA en porcentaje entero (0–100). */
  taxRate?: number;
  /** Código de unidad DIAN (ej. "94" = unidad). */
  unitCode?: string;
  imageMediaId?: UUID;
  active?: boolean;
}

export interface UpdateSalesProductInput {
  name?: string;
  sku?: string | null;
  description?: string | null;
  priceCents?: number;
  currency?: SalesCurrency;
  taxRate?: number;
  unitCode?: string | null;
  imageMediaId?: UUID | null;
  active?: boolean;
}

export interface ListSalesProductsQuery {
  q?: string;
  /** "true" | "false" */
  active?: "true" | "false";
}

// ─── Pedidos ─────────────────────────────────────────────────────────────────

export interface SalesOrderItemInput {
  /** Producto del catálogo; sin él la línea es libre. */
  productId?: UUID;
  /** Requerida si no hay productId. */
  description?: string;
  quantity: number;
  /** Requerido si no hay productId. */
  unitPriceCents?: number;
  taxRate?: number;
}

export interface SalesOrderItem {
  id: UUID;
  orderId: UUID;
  productId: UUID | null;
  description: string;
  quantity: number;
  unitPriceCents: number;
  taxRate: number;
  lineSubtotalCents: number;
  lineTaxCents: number;
  lineTotalCents: number;
}

export interface SalesOrder {
  id: UUID;
  organizationId: UUID;
  number: number;
  contactId: UUID | null;
  conversationId: UUID | null;
  billingProfileId: UUID | null;
  channel: string;
  source: string;
  status: SalesOrderStatus;
  currency: string;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  notes: string | null;
  externalRef: string | null;
  createdByUserId: UUID | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface SalesOrderWithItems extends SalesOrder {
  items: SalesOrderItem[];
}

export interface CreateSalesOrderInput {
  contactId?: UUID;
  conversationId?: UUID;
  billingProfileId?: UUID;
  channel?: SalesChannel;
  currency?: SalesCurrency;
  notes?: string;
  items: SalesOrderItemInput[];
}

export interface ListSalesOrdersQuery {
  status?: SalesOrderStatus;
  contactId?: UUID;
  conversationId?: UUID;
}

export interface UpdateSalesOrderStatusInput {
  status: SalesOrderStatus;
}

// ─── Perfiles de facturación ─────────────────────────────────────────────────

export interface SalesBillingProfile {
  id: UUID;
  organizationId: UUID;
  contactId: UUID | null;
  legalName: string;
  docNumber: string;
  dv: number | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  municipalityId: number | null;
  typeDocumentId: number;
  typeOrganizationId: number;
  typeRegimeId: number;
  typeLiabilityId: number;
  isDefault: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateBillingProfileInput {
  /** null = tercero/empresa suelta. */
  contactId?: UUID;
  legalName: string;
  docNumber: string;
  dv?: number;
  email?: string;
  phone?: string;
  address?: string;
  municipalityId?: number;
  typeDocumentId?: number;
  typeOrganizationId?: number;
  typeRegimeId?: number;
  typeLiabilityId?: number;
  isDefault?: boolean;
}

export interface UpdateBillingProfileInput {
  legalName?: string;
  docNumber?: string;
  dv?: number | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  municipalityId?: number | null;
  typeDocumentId?: number;
  typeOrganizationId?: number;
  typeRegimeId?: number;
  typeLiabilityId?: number;
  isDefault?: boolean;
}

// ─── Facturación electrónica: empresas emisoras ──────────────────────────────

/** Configuración de una empresa emisora. Nunca incluye el token. */
export interface EInvoicingConfig {
  /** null mientras no hay nada configurado. */
  id: UUID | null;
  name: string;
  isDefault: boolean;
  organizationId: UUID;
  provider: string;
  baseUrl: string;
  apiKeyConfigured: boolean;
  idSoftware: string | null;
  resolutionNumber: string | null;
  environment: string;
  establishmentName: string | null;
  establishmentAddress: string | null;
  establishmentPhone: string | null;
  establishmentEmail: string | null;
  establishmentMunicipalityId: number | null;
  paymentFormId: number;
  paymentMethodId: number;
  autoSendOnIssue: boolean;
  autoSendCreditNotes: boolean;
  sendTemplateName: string | null;
  sendTemplateLang: string | null;
  sendByEmail: boolean;
  enabled: boolean;
  creditNotePrefix: string | null;
  emitterNit: string | null;
  razonSocial: string | null;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  ciudad: string | null;
  sitioWeb: string | null;
  logoMediaId: UUID | null;
  cotFormasDePago: string | null;
  cotCondiciones: string | null;
  cotNotas: string | null;
  cotVigenciaDias: number | null;
  facturaElectronicamente: boolean;
  marcas: Array<{ id: UUID; nombre: string }>;
}

export interface UpdateEInvoicingConfigInput {
  /** Empresa a editar; sin esto se edita la predeterminada (o se crea la primera). */
  configId?: UUID;
  /** Crear una empresa nueva. */
  nueva?: boolean;
  name?: string;
  isDefault?: boolean;
  /** Solo https y hosts permitidos. */
  baseUrl?: string;
  /** Token en claro (se cifra); '' lo borra. */
  apiKey?: string;
  idSoftware?: string;
  /** '' la limpia. */
  resolutionNumber?: string;
  environment?: "habilitacion" | "produccion";
  establishmentName?: string;
  establishmentAddress?: string;
  /** Solo dígitos (7 a 10). */
  establishmentPhone?: string;
  /** NIT sin DV. */
  emitterNit?: string;
  establishmentEmail?: string;
  establishmentMunicipalityId?: number | null;
  /** 1 = Contado, 2 = Crédito. */
  paymentFormId?: 1 | 2;
  /** Medio de pago DIAN (10 = Efectivo, 42 = Consignación, …). */
  paymentMethodId?: number;
  sendByEmail?: boolean;
  autoSendOnIssue?: boolean;
  autoSendCreditNotes?: boolean;
  sendTemplateName?: string | null;
  sendTemplateLang?: string | null;
  enabled?: boolean;
  creditNotePrefix?: string;
  razonSocial?: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
  ciudad?: string;
  sitioWeb?: string;
  logoMediaId?: UUID | null;
  cotFormasDePago?: string;
  cotCondiciones?: string;
  cotNotas?: string;
  cotVigenciaDias?: number | null;
  /** Reemplaza la lista de marcas que trabajan con esta empresa. */
  marcaIds?: UUID[];
}

export interface ValidateEInvoicingInput {
  configId?: UUID;
  /** Token a probar; si se omite, usa el guardado. */
  apiKey?: string;
  idSoftware?: string;
  baseUrl?: string;
}

export interface EInvoicingResolution {
  resolutionNumber: string;
  prefix: string;
  fromNumber: number;
  toNumber: number;
  dateTo?: string | null;
  nextConsecutive?: string | null;
  environment?: string;
}

export type ValidateEInvoicingResult =
  | { ok: false; message: string }
  | {
      ok: true;
      nit: string | null;
      nitNoCoincide: boolean;
      creditNotePrefix: string | null;
      environment: "habilitacion" | "produccion" | null;
      resolution: EInvoicingResolution | null;
      resolutions: EInvoicingResolution[];
      currentPrefix?: string;
      currentNumber?: number;
      message: string;
    };

export interface SuggestEInvoicingCompanyQuery {
  conversationId?: UUID;
  customerOrderId?: UUID;
  orderId?: UUID;
}

export interface ImportEInvoicingCustomersResult {
  created: number;
  updated: number;
  total: number;
}

export interface EInvoicingCustomerLookupQuery {
  doc: string;
  docType?: string;
  configId?: UUID;
}

export interface EInvoicingCustomerLookup {
  found: boolean;
  source: "local" | "registered" | "dian" | null;
  dianNote?: string;
  dianNotRegistered?: boolean;
  data?: {
    legalName: string;
    docNumber: string;
    dv: number | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    typeDocumentId: number;
    typeOrganizationId: number;
    typeRegimeId: number;
    typeLiabilityId: number;
  };
}

// ─── Facturación electrónica: documentos ─────────────────────────────────────

export interface SalesInvoice {
  id: UUID;
  organizationId: UUID;
  orderId: UUID | null;
  billingProfileId: UUID | null;
  contactId: UUID | null;
  conversationId: UUID | null;
  currency: string;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  notes: string | null;
  externalRef: string | null;
  provider: string;
  configId: UUID | null;
  docType: SalesDocType;
  relatedInvoiceId: UUID | null;
  status: SalesInvoiceStatus;
  prefix: string | null;
  number: number | null;
  cufe: string | null;
  qrUrl: string | null;
  pdfFile: string | null;
  xmlFile: string | null;
  dianStatus: string | null;
  error: string | null;
  /** Respuesta cruda del proveedor (no viene en el listado). */
  rawResponse?: unknown;
  pdfMediaId: UUID | null;
  pdfShareToken: string | null;
  issuedAt: ISODateString | null;
  creditedAt: ISODateString | null;
  sentToCustomerAt: ISODateString | null;
  sendPendingReason: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ListSalesInvoicesQuery {
  orderId?: UUID;
  contactId?: UUID;
  status?: SalesInvoiceStatus;
  docType?: SalesDocType;
  configId?: UUID;
}

export interface GenerateInvoiceInput {
  /** Pedido a facturar. Excluyente con `items`. */
  orderId?: UUID;
  /** Líneas de una factura directa. Excluyente con `orderId`. */
  items?: SalesOrderItemInput[];
  contactId?: UUID;
  conversationId?: UUID;
  notes?: string;
  /** Idempotencia de la emisión directa (sin pedido). */
  idempotencyKey?: string;
  /** Empresa emisora; sin esto, la predeterminada. */
  configId?: UUID;
  billingProfileId?: UUID;
  paymentFormId?: number;
  paymentMethodId?: number;
}

export interface CreateSalesCreditNoteInput {
  invoiceId: UUID;
  /** Código de discrepancia DIAN (1 = devolución parcial, 2 = anulación, …). */
  discrepancyCode?: number;
  reason?: string;
  /** Emitir aunque un intento anterior quedara sin confirmar. */
  force?: boolean;
}

export interface InvoiceLicenseOrderInput {
  /** Venta de licencia ya PAGADA/ENTREGADA. */
  customerOrderId: UUID;
  configId?: UUID;
  billingProfileId?: UUID;
  legalName?: string;
  docNumber?: string;
  dv?: number;
  email?: string;
  address?: string;
  typeDocumentId?: number;
  typeOrganizationId?: number;
  typeRegimeId?: number;
  typeLiabilityId?: number;
  paymentFormId?: number;
  paymentMethodId?: number;
  /** Líneas editadas antes de emitir. */
  items?: SalesOrderItemInput[];
  notes?: string;
}

export interface CreateLicenseInvoiceDraftInput {
  customerOrderId: UUID;
}

export interface SendInvoiceResult {
  sent: true;
  messageId: UUID;
  conversationId: UUID | null;
}

export interface SalesInvoicePdf {
  filename: string;
  contentType: "application/pdf";
  base64: string;
}
