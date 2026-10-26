import type {
  CreateBillingProfileInput,
  CreateLicenseInvoiceDraftInput,
  CreateSalesCreditNoteInput,
  CreateSalesOrderInput,
  CreateSalesProductInput,
  EInvoicingConfig,
  EInvoicingCustomerLookup,
  EInvoicingCustomerLookupQuery,
  GenerateInvoiceInput,
  ImportEInvoicingCustomersResult,
  InvoiceLicenseOrderInput,
  ListSalesInvoicesQuery,
  ListSalesOrdersQuery,
  ListSalesProductsQuery,
  SalesBillingProfile,
  SalesDeleted,
  SalesEntitlement,
  SalesInvoice,
  SalesInvoicePdf,
  SalesOrder,
  SalesOrderWithItems,
  SalesProduct,
  SendInvoiceResult,
  SetSalesAddonsInput,
  SuggestEInvoicingCompanyQuery,
  UpdateBillingProfileInput,
  UpdateEInvoicingConfigInput,
  UpdateSalesOrderStatusInput,
  UpdateSalesProductInput,
  ValidateEInvoicingInput,
  ValidateEInvoicingResult,
} from "../types/sales.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

type Scope = { orgId?: string };
type Query = Record<string, string | number | boolean | undefined>;

/**
 * `/organizations/:orgId/sales` — Ventas: catálogo de productos, pedidos,
 * perfiles de facturación y facturación electrónica DIAN (empresas emisoras,
 * facturas, notas crédito y facturas de ventas de licencias).
 */
export class SalesResource extends Resource {
  private async call<T>(
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    orgId: string | undefined,
    sub: string,
    extra: { body?: unknown; query?: Query } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const id = this.requireOrgId(orgId);
    const res = await this.http.request<T>({
      method,
      path: `/organizations/${id}/sales${sub}`,
      ...(extra.body !== undefined ? { body: extra.body } : {}),
      ...(extra.query ? { query: extra.query } : {}),
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Entitlement y add-ons ────────────────────────────────────────────────

  entitlement(scope: Scope = {}, options?: RequestOptions): Promise<SalesEntitlement> {
    return this.call("GET", scope.orgId, "/entitlement", {}, options);
  }

  setAddons(
    input: SetSalesAddonsInput & Scope,
    options?: RequestOptions,
  ): Promise<SalesEntitlement> {
    const { orgId, ...body } = input;
    return this.call("PUT", orgId, "/addons", { body }, options);
  }

  // ─── Productos ────────────────────────────────────────────────────────────

  listProducts(
    query: ListSalesProductsQuery & Scope = {},
    options?: RequestOptions,
  ): Promise<SalesProduct[]> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/products", { query: rest }, options);
  }

  getProduct(
    productId: string,
    scope: Scope = {},
    options?: RequestOptions,
  ): Promise<SalesProduct> {
    return this.call("GET", scope.orgId, `/products/${productId}`, {}, options);
  }

  createProduct(
    input: CreateSalesProductInput & Scope,
    options?: RequestOptions,
  ): Promise<SalesProduct> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/products", { body }, options);
  }

  updateProduct(
    productId: string,
    input: UpdateSalesProductInput & Scope,
    options?: RequestOptions,
  ): Promise<SalesProduct> {
    const { orgId, ...body } = input;
    return this.call("PATCH", orgId, `/products/${productId}`, { body }, options);
  }

  deleteProduct(
    productId: string,
    scope: Scope = {},
    options?: RequestOptions,
  ): Promise<SalesDeleted> {
    return this.call("DELETE", scope.orgId, `/products/${productId}`, {}, options);
  }

  // ─── Pedidos ──────────────────────────────────────────────────────────────

  createOrder(
    input: CreateSalesOrderInput & Scope,
    options?: RequestOptions,
  ): Promise<SalesOrderWithItems> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/orders", { body }, options);
  }

  listOrders(
    query: ListSalesOrdersQuery & Scope = {},
    options?: RequestOptions,
  ): Promise<SalesOrderWithItems[]> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/orders", { query: rest }, options);
  }

  getOrder(
    orderId: string,
    scope: Scope = {},
    options?: RequestOptions,
  ): Promise<SalesOrderWithItems> {
    return this.call("GET", scope.orgId, `/orders/${orderId}`, {}, options);
  }

  updateOrderStatus(
    orderId: string,
    input: UpdateSalesOrderStatusInput & Scope,
    options?: RequestOptions,
  ): Promise<SalesOrderWithItems> {
    const { orgId, ...body } = input;
    return this.call("PATCH", orgId, `/orders/${orderId}/status`, { body }, options);
  }

  /** Solo pedidos en borrador o cancelados. */
  deleteOrder(orderId: string, scope: Scope = {}, options?: RequestOptions): Promise<SalesDeleted> {
    return this.call("DELETE", scope.orgId, `/orders/${orderId}`, {}, options);
  }

  // ─── Perfiles de facturación ──────────────────────────────────────────────

  listBillingProfiles(
    query: { contactId?: string } & Scope = {},
    options?: RequestOptions,
  ): Promise<SalesBillingProfile[]> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/billing-profiles", { query: rest }, options);
  }

  getBillingProfile(
    profileId: string,
    scope: Scope = {},
    options?: RequestOptions,
  ): Promise<SalesBillingProfile> {
    return this.call("GET", scope.orgId, `/billing-profiles/${profileId}`, {}, options);
  }

  createBillingProfile(
    input: CreateBillingProfileInput & Scope,
    options?: RequestOptions,
  ): Promise<SalesBillingProfile> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/billing-profiles", { body }, options);
  }

  updateBillingProfile(
    profileId: string,
    input: UpdateBillingProfileInput & Scope,
    options?: RequestOptions,
  ): Promise<SalesBillingProfile> {
    const { orgId, ...body } = input;
    return this.call("PATCH", orgId, `/billing-profiles/${profileId}`, { body }, options);
  }

  deleteBillingProfile(
    profileId: string,
    scope: Scope = {},
    options?: RequestOptions,
  ): Promise<SalesDeleted> {
    return this.call("DELETE", scope.orgId, `/billing-profiles/${profileId}`, {}, options);
  }

  // ─── Facturación electrónica: empresas emisoras ───────────────────────────

  /** Config del conector (sin el token). Sin `configId`, la empresa predeterminada. */
  getEinvoicingConfig(
    query: { configId?: string } & Scope = {},
    options?: RequestOptions,
  ): Promise<EInvoicingConfig> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/einvoicing/config", { query: rest }, options);
  }

  updateEinvoicingConfig(
    input: UpdateEInvoicingConfigInput & Scope,
    options?: RequestOptions,
  ): Promise<EInvoicingConfig> {
    const { orgId, ...body } = input;
    return this.call("PUT", orgId, "/einvoicing/config", { body }, options);
  }

  /** Valida el token y trae la numeración vigente. */
  validateEinvoicing(
    input: ValidateEInvoicingInput & Scope = {},
    options?: RequestOptions,
  ): Promise<ValidateEInvoicingResult> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/einvoicing/validate", { body }, options);
  }

  /** Empresas emisoras (la predeterminada primero). */
  listEinvoicingCompanies(
    scope: Scope = {},
    options?: RequestOptions,
  ): Promise<EInvoicingConfig[]> {
    return this.call("GET", scope.orgId, "/einvoicing/companies", {}, options);
  }

  /** Desde qué empresa se propone facturar una venta, un pedido o una conversación. */
  suggestEinvoicingCompany(
    query: SuggestEInvoicingCompanyQuery & Scope = {},
    options?: RequestOptions,
  ): Promise<{ configId: string | null }> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/einvoicing/companies/sugerida", { query: rest }, options);
  }

  /** Solo empresas sin documentos. */
  deleteEinvoicingCompany(
    configId: string,
    scope: Scope = {},
    options?: RequestOptions,
  ): Promise<SalesDeleted> {
    return this.call("DELETE", scope.orgId, `/einvoicing/companies/${configId}`, {}, options);
  }

  /** Importa los clientes del proveedor como perfiles de facturación. */
  importEinvoicingCustomers(
    query: { configId?: string } & Scope = {},
    options?: RequestOptions,
  ): Promise<ImportEInvoicingCustomersResult> {
    const { orgId, ...rest } = query;
    return this.call("POST", orgId, "/einvoicing/customers/import", { query: rest }, options);
  }

  lookupEinvoicingCustomer(
    query: EInvoicingCustomerLookupQuery & Scope,
    options?: RequestOptions,
  ): Promise<EInvoicingCustomerLookup> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/einvoicing/customer-lookup", { query: rest }, options);
  }

  // ─── Facturación electrónica: documentos ──────────────────────────────────

  listInvoices(
    query: ListSalesInvoicesQuery & Scope = {},
    options?: RequestOptions,
  ): Promise<Array<Omit<SalesInvoice, "rawResponse">>> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/einvoicing/invoices", { query: rest }, options);
  }

  /** Factura un pedido (`orderId`) o líneas directas (`items`). */
  generateInvoice(
    input: GenerateInvoiceInput & Scope,
    options?: RequestOptions,
  ): Promise<SalesInvoice> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/einvoicing/invoices", { body }, options);
  }

  /** Nota crédito total que anula una factura emitida. */
  createCreditNote(
    input: CreateSalesCreditNoteInput & Scope,
    options?: RequestOptions,
  ): Promise<SalesInvoice> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/einvoicing/credit-notes", { body }, options);
  }

  invoiceLicenseOrder(
    input: InvoiceLicenseOrderInput & Scope,
    options?: RequestOptions,
  ): Promise<SalesInvoice> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/einvoicing/license-orders/invoice", { body }, options);
  }

  /** Crea (o reutiliza) el pedido borrador de una venta de licencia, sin emitir. */
  createLicenseInvoiceDraft(
    input: CreateLicenseInvoiceDraftInput & Scope,
    options?: RequestOptions,
  ): Promise<SalesOrder> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/einvoicing/license-orders/draft", { body }, options);
  }

  /** Envía la factura/nota al cliente por WhatsApp, en su conversación. */
  sendInvoice(
    invoiceId: string,
    scope: Scope = {},
    options?: RequestOptions,
  ): Promise<SendInvoiceResult> {
    return this.call("POST", scope.orgId, `/einvoicing/invoices/${invoiceId}/send`, {}, options);
  }

  /** El PDF en base64. */
  getInvoicePdf(
    invoiceId: string,
    scope: Scope = {},
    options?: RequestOptions,
  ): Promise<SalesInvoicePdf> {
    return this.call("GET", scope.orgId, `/einvoicing/invoices/${invoiceId}/pdf`, {}, options);
  }

  /** `GET /sales/invoice-pdf/:token` (público): los bytes del PDF. */
  async publicInvoicePdf(token: string, options?: RequestOptions): Promise<ArrayBuffer> {
    const res = await this.http.request<ArrayBuffer>({
      method: "GET",
      path: `/sales/invoice-pdf/${encodeURIComponent(token)}`,
      responseType: "arrayBuffer",
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
