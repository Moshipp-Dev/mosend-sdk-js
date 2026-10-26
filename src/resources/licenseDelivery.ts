import type { RequestOptions } from "../core/types.js";
import { MosendValidationError } from "../core/errors.js";
import type {
  AddLicenseKeysInput,
  AnularCobroAgrupadoInput,
  BulkImportProductsInput,
  BulkPriceListItemsInput,
  BulkPriceProductsInput,
  BulkProductIdsInput,
  BulkUpdateProductsInput,
  BuzonDeAvisosInput,
  CambiarMedioDelPedidoInput,
  CompletarDatoAdicionalInput,
  CompletarEntregaInput,
  ConciliarCobroInput,
  ConciliarPagoInput,
  ConfirmarPagoManualInput,
  ContactIdQuery,
  CrearCobroAgrupadoInput,
  CrearCobroLibreInput,
  CreateCheckoutInput,
  CreateDigitalProductInput,
  CreateLicenseCouponInput,
  CreatePriceListInput,
  CreateRenewalTemplateInput,
  CreateVariantInput,
  CuentaDeTransferenciaInput,
  DescartarEnMasaInput,
  DispatchInput,
  EditarCuentaDeTransferenciaInput,
  EditarLlaveDeCobroInput,
  IgnorarPagoInput,
  LicenseAnalyticsQuery,
  ListDigitalProductsQuery,
  ListExpirationsQuery,
  ListGroupedChargesQuery,
  ListLicenseKeysQuery,
  ListLicenseOrdersQuery,
  ListPendingReceiptsQuery,
  LlaveDeCobroInput,
  MarcarCobroPagadoInput,
  PaymentsInboxQuery,
  PerfilDeCobroInput,
  PreviewCarritoInput,
  RangeQuery,
  ReasignarPagoInput,
  RechazarComprobanteInput,
  RefundOrderInput,
  RegistrarPagoConjuntoInput,
  RegistrarVentaManualInput,
  ReordenarCuentasInput,
  ReplaceLicenseKeyInput,
  RevisarComprobanteInput,
  SellCartToConversationInput,
  SellToConversationInput,
  SellingReadinessQuery,
  SetOrderExpirationInput,
  SetPaidAddonInput,
  SetPriceListItemInput,
  SetProductPricesInput,
  SubmitOtpInput,
  UpdateDigitalProductInput,
  UpdateLicenseCouponInput,
  UpdateLicenseDeliverySettingsInput,
  UpdatePriceListInput,
  UpdateVariantInput,
  UploadLicenseDeliveryFileInput,
  VentaManualCarritoInput,
} from "../types/licenseDelivery.js";
import { Resource } from "./base.js";

/**
 * `/organizations/{orgId}/license-delivery` — licencias digitales: productos y
 * variantes, inventario de llaves, pedidos y entregas, cupones, listas de precios,
 * cobros (agrupados y libres), bandeja de pagos, comprobantes, marcas que cobran,
 * cuentas y llaves de transferencia.
 *
 * Las respuestas no están tipadas en el contrato: cada método acepta un genérico
 * `T` (por defecto `unknown`) para que el llamador declare la forma que espera.
 */
export class LicenseDeliveryResource extends Resource {
  // ─── Ajustes ───────────────────────────────────────────────────────────────

  /** Ajustes de licencias digitales de la organización. */
  async getSettings<T = unknown>(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/settings`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Actualiza los ajustes (pasarela, transferencia, bandeja, renovación, etc.). */
  async updateSettings<T = unknown>(
    input: UpdateLicenseDeliverySettingsInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PUT",
      path: `/organizations/${orgId}/license-delivery/settings`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Activa o desactiva el add-on de pago. */
  async setPaidAddon<T = unknown>(
    input: SetPaidAddonInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PUT",
      path: `/organizations/${orgId}/license-delivery/settings/addon`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Qué le falta a la organización (o a un número) para poder vender. */
  async sellingReadiness<T = unknown>(
    query: SellingReadinessQuery & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/selling-readiness`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Métricas de ventas de licencias en un rango. */
  async analytics<T = unknown>(
    query: LicenseAnalyticsQuery & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/analytics`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Cupones ───────────────────────────────────────────────────────────────

  /** Lista los cupones de descuento. */
  async listCoupons<T = unknown>(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/coupons`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea un cupón. */
  async createCoupon<T = unknown>(
    input: CreateLicenseCouponInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/coupons`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Edita un cupón. */
  async updateCoupon<T = unknown>(
    couponId: string,
    input: UpdateLicenseCouponInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PATCH",
      path: `/organizations/${orgId}/license-delivery/coupons/${couponId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Elimina un cupón. */
  async deleteCoupon<T = unknown>(
    couponId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "DELETE",
      path: `/organizations/${orgId}/license-delivery/coupons/${couponId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Listas de precios ─────────────────────────────────────────────────────

  /** Lista las listas de precios. */
  async listPriceLists<T = unknown>(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/price-lists`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea una lista de precios. */
  async createPriceList<T = unknown>(
    input: CreatePriceListInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/price-lists`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Edita una lista de precios. */
  async updatePriceList<T = unknown>(
    priceListId: string,
    input: UpdatePriceListInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PATCH",
      path: `/organizations/${orgId}/license-delivery/price-lists/${priceListId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Elimina una lista de precios. */
  async deletePriceList<T = unknown>(
    priceListId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "DELETE",
      path: `/organizations/${orgId}/license-delivery/price-lists/${priceListId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Fija (o quita con priceCents null) el precio de un producto/variante en la lista. */
  async setPriceListItem<T = unknown>(
    priceListId: string,
    input: SetPriceListItemInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PUT",
      path: `/organizations/${orgId}/license-delivery/price-lists/${priceListId}/items`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Fija precios de la lista para varios productos a la vez. */
  async bulkSetPriceListItems<T = unknown>(
    priceListId: string,
    input: BulkPriceListItemsInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PUT",
      path: `/organizations/${orgId}/license-delivery/price-lists/${priceListId}/items/bulk`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Productos ─────────────────────────────────────────────────────────────

  /** Lista los productos (con precios resueltos si se pasa conversación/contacto). */
  async listProducts<T = unknown>(
    query: ListDigitalProductsQuery & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/products`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea un producto digital. */
  async createProduct<T = unknown>(
    input: CreateDigitalProductInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/products`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Importa productos en lote (Excel/CSV). */
  async importProducts<T = unknown>(
    input: BulkImportProductsInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/products/import`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Aplica el mismo cambio a varios productos. */
  async bulkUpdateProducts<T = unknown>(
    input: BulkUpdateProductsInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/products/bulk`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Cambia el precio de varios productos (o lo previsualiza). */
  async bulkPriceProducts<T = unknown>(
    input: BulkPriceProductsInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/products/bulk-price`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Elimina varios productos. */
  async bulkDeleteProducts<T = unknown>(
    input: BulkProductIdsInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/products/bulk-delete`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Detalle de un producto. */
  async getProduct<T = unknown>(
    productId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/products/${productId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Edita un producto. */
  async updateProduct<T = unknown>(
    productId: string,
    input: UpdateDigitalProductInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PATCH",
      path: `/organizations/${orgId}/license-delivery/products/${productId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Elimina un producto. */
  async deleteProduct<T = unknown>(
    productId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "DELETE",
      path: `/organizations/${orgId}/license-delivery/products/${productId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Fija los precios del producto en otras monedas. */
  async setProductPrices<T = unknown>(
    productId: string,
    input: SetProductPricesInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PUT",
      path: `/organizations/${orgId}/license-delivery/products/${productId}/prices`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Sube la imagen del producto (PNG/JPG/WebP, máx 8 MB) y la sirve pública. */
  async uploadProductImage<T = unknown>(
    productId: string,
    input: UploadLicenseDeliveryFileInput,
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(input.orgId);
    const body = this.toForm(input);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/products/${productId}/image`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Quita la imagen subida del producto. */
  async removeProductImage<T = unknown>(
    productId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "DELETE",
      path: `/organizations/${orgId}/license-delivery/products/${productId}/image`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea un cobro (checkout) para vender el producto. */
  async checkout<T = unknown>(
    productId: string,
    input: CreateCheckoutInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/products/${productId}/checkout`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Llaves ────────────────────────────────────────────────────────────────

  /** Carga llaves al inventario del producto. */
  async addKeys<T = unknown>(
    productId: string,
    input: AddLicenseKeysInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/products/${productId}/keys`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Lista las llaves del producto. */
  async listKeys<T = unknown>(
    productId: string,
    query: ListLicenseKeysQuery & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/products/${productId}/keys`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Elimina una llave del inventario. */
  async deleteKey<T = unknown>(
    productId: string,
    keyId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "DELETE",
      path: `/organizations/${orgId}/license-delivery/products/${productId}/keys/${keyId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Revoca una llave. */
  async revokeKey<T = unknown>(
    productId: string,
    keyId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/products/${productId}/keys/${keyId}/revoke`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Variantes ─────────────────────────────────────────────────────────────

  /** Crea una variante del producto. */
  async createVariant<T = unknown>(
    productId: string,
    input: CreateVariantInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/products/${productId}/variants`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Edita una variante. */
  async updateVariant<T = unknown>(
    productId: string,
    variantId: string,
    input: UpdateVariantInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PATCH",
      path: `/organizations/${orgId}/license-delivery/products/${productId}/variants/${variantId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Elimina una variante. */
  async deleteVariant<T = unknown>(
    productId: string,
    variantId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "DELETE",
      path: `/organizations/${orgId}/license-delivery/products/${productId}/variants/${variantId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Venta desde una conversación ──────────────────────────────────────────

  /** Calcula el carrito (precios, descuentos, stock) sin crear nada. */
  async previewCart<T = unknown>(
    conversationId: string,
    input: PreviewCarritoInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/conversations/${conversationId}/cart-preview`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Vende un producto al cliente de la conversación. */
  async sellToConversation<T = unknown>(
    conversationId: string,
    input: SellToConversationInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/conversations/${conversationId}/sell`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Vende un carrito al cliente de la conversación. */
  async sellCartToConversation<T = unknown>(
    conversationId: string,
    input: SellCartToConversationInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/conversations/${conversationId}/sell-cart`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Entrega licencias a mano por la conversación. */
  async dispatch<T = unknown>(
    conversationId: string,
    input: DispatchInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/conversations/${conversationId}/dispatch`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Registra una venta hecha fuera del flujo (pagada o fiada). */
  async registerManualSale<T = unknown>(
    conversationId: string,
    input: RegistrarVentaManualInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/conversations/${conversationId}/venta-manual`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Registra una venta manual de varios productos. */
  async registerManualCartSale<T = unknown>(
    conversationId: string,
    input: VentaManualCarritoInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/conversations/${conversationId}/venta-manual-carrito`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── QR de la llave de transferencia ───────────────────────────────────────

  /** Sube el QR de la llave de transferencia (PNG/JPG/WebP). */
  async uploadTransferQr<T = unknown>(
    input: UploadLicenseDeliveryFileInput,
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(input.orgId);
    const body = this.toForm(input);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/transfer-qr`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Quita el QR de la llave de transferencia. */
  async removeTransferQr<T = unknown>(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "DELETE",
      path: `/organizations/${orgId}/license-delivery/transfer-qr`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Renovaciones ──────────────────────────────────────────────────────────

  /** Estado de la plantilla de aviso de renovación. */
  async getRenewalTemplate<T = unknown>(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/renewal-template`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea la plantilla de aviso de renovación en Meta. */
  async createRenewalTemplate<T = unknown>(
    input: CreateRenewalTemplateInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/renewal-template`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Licencias que vencen pronto (o ya vencidas). */
  async listExpirations<T = unknown>(
    query: ListExpirationsQuery & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/expirations`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Pedidos ───────────────────────────────────────────────────────────────

  /** Lista los pedidos. */
  async listOrders<T = unknown>(
    query: ListLicenseOrdersQuery & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/orders`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Detalle de un pedido. */
  async getOrder<T = unknown>(
    orderId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Cambia (o quita) la fecha de vencimiento del pedido. */
  async setOrderExpiration<T = unknown>(
    orderId: string,
    input: SetOrderExpirationInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PATCH",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/expiration`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Reenvía la licencia al cliente. */
  async resendOrder<T = unknown>(
    orderId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/resend`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Reemplaza una llave entregada. */
  async replaceKey<T = unknown>(
    orderId: string,
    keyId: string,
    input: ReplaceLicenseKeyInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/keys/${keyId}/replace`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Cancela un pedido. */
  async cancelOrder<T = unknown>(
    orderId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/cancel`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Sube la captura del pago (PNG/JPG/WebP/PDF); devuelve su mediaAssetId para confirmarlo. */
  async uploadPaymentCapture<T = unknown>(
    orderId: string,
    input: UploadLicenseDeliveryFileInput,
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(input.orgId);
    const body = this.toForm(input);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/captura-de-pago`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Cambia el medio de pago del pedido. */
  async changePaymentMethod<T = unknown>(
    orderId: string,
    input: CambiarMedioDelPedidoInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/cambiar-medio`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Confirma a mano el pago por transferencia y entrega. */
  async confirmTransfer<T = unknown>(
    orderId: string,
    input: ConfirmarPagoManualInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/confirm-transfer`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Completa una entrega asistida con las llaves del asesor. */
  async completeDelivery<T = unknown>(
    orderId: string,
    input: CompletarEntregaInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/completar-entrega`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Reembolsa un pedido. */
  async refundOrder<T = unknown>(
    orderId: string,
    input: RefundOrderInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/refund`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Completa el dato adicional pendiente del pedido. */
  async completeExtraData<T = unknown>(
    orderId: string,
    input: CompletarDatoAdicionalInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PATCH",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/dato-adicional`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Marca el pedido como pagado (sin entregar). */
  async markPaid<T = unknown>(
    orderId: string,
    input: ConfirmarPagoManualInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/marcar-pagada`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Marca el pedido como entregado. */
  async markDelivered<T = unknown>(
    orderId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/marcar-entregada`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Envía el OTP de Daviplata del cliente. */
  async submitOtp<T = unknown>(
    orderId: string,
    input: SubmitOtpInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/otp`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Pide reenviar el OTP de Daviplata. */
  async resendOtp<T = unknown>(
    orderId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/otp/resend`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Comprobantes de pago de un pedido. */
  async listOrderReceipts<T = unknown>(
    orderId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/orders/${orderId}/receipts`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Bandeja de avisos ─────────────────────────────────────────────────────

  /** Prueba la conexión a la bandeja y muestra lo que lee. */
  async testInbox<T = unknown>(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/inbox/test`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Correos donde llegan los avisos de pago. */
  async listMailboxes<T = unknown>(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/buzones`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Agrega un buzón de avisos. */
  async createMailbox<T = unknown>(
    input: BuzonDeAvisosInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/buzones`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Edita un buzón de avisos. */
  async updateMailbox<T = unknown>(
    buzonId: string,
    input: BuzonDeAvisosInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PATCH",
      path: `/organizations/${orgId}/license-delivery/buzones/${buzonId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Elimina un buzón de avisos. */
  async deleteMailbox<T = unknown>(
    buzonId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "DELETE",
      path: `/organizations/${orgId}/license-delivery/buzones/${buzonId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Prueba la conexión de un buzón. */
  async testMailbox<T = unknown>(
    buzonId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/buzones/${buzonId}/probar`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Pagos leídos de los avisos del banco. */
  async listInboxPayments<T = unknown>(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/inbox/payments`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Concilia un pago con un pedido. */
  async matchPayment<T = unknown>(
    pagoId: string,
    input: ConciliarPagoInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/inbox/payments/${pagoId}/match`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Concilia un pago con un cobro agrupado. */
  async matchPaymentToCharge<T = unknown>(
    pagoId: string,
    input: ConciliarCobroInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/inbox/payments/${pagoId}/match-cobro`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Pedidos a los que se puede mover un pago. */
  async getReassignOptions<T = unknown>(
    pagoId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/inbox/payments/${pagoId}/reassign-options`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Mueve un pago a otro pedido. */
  async reassignPayment<T = unknown>(
    pagoId: string,
    input: ReasignarPagoInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/inbox/payments/${pagoId}/reassign`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Ignora un pago. */
  async ignorePayment<T = unknown>(
    pagoId: string,
    input: IgnorarPagoInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/inbox/payments/${pagoId}/ignore`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Bandeja de pagos ──────────────────────────────────────────────────────

  /** Bandeja unificada de pagos (avisos del banco y comprobantes). */
  async paymentsInbox<T = unknown>(
    query: PaymentsInboxQuery & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/payments-inbox`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Descarta varios pagos/comprobantes (hasta 100). */
  async discardPayments<T = unknown>(
    input: DescartarEnMasaInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/payments-inbox/discard`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Cobros agrupados ──────────────────────────────────────────────────────

  /** Pedidos que el contacto debe (fiados y esperando pago). */
  async listOrdersToCharge<T = unknown>(
    query: ContactIdQuery & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/cobros-agrupados/pendientes`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Lista los cobros agrupados. */
  async listGroupedCharges<T = unknown>(
    query: ListGroupedChargesQuery & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/cobros-agrupados`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea un cobro agrupado de varios pedidos. */
  async createGroupedCharge<T = unknown>(
    input: CrearCobroAgrupadoInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/cobros-agrupados`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Reenvía el cobro al cliente. */
  async resendGroupedCharge<T = unknown>(
    cobroId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/cobros-agrupados/${cobroId}/reenviar`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Anula un cobro agrupado. */
  async voidGroupedCharge<T = unknown>(
    cobroId: string,
    input: AnularCobroAgrupadoInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/cobros-agrupados/${cobroId}/anular`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Marca un cobro agrupado como pagado (total o parcial). */
  async markGroupedChargePaid<T = unknown>(
    cobroId: string,
    input: MarcarCobroPagadoInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/cobros-agrupados/${cobroId}/marcar-pagado`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Registra un pago que cubre varios pedidos, sin cobro previo. */
  async registerJointPayment<T = unknown>(
    input: RegistrarPagoConjuntoInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/cobros-agrupados/pago-registrado`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Cobros libres ─────────────────────────────────────────────────────────

  /** Crea un cobro libre (monto y concepto a mano). */
  async createFreeCharge<T = unknown>(
    input: CrearCobroLibreInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/cobros-libres`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Facturas de la plataforma Mosend del contacto (solo la org que opera Mosend). */
  async listMosendInvoices<T = unknown>(
    query: ContactIdQuery & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/cobros-libres/facturas-mosend`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Perfiles de cobro (marcas) ────────────────────────────────────────────

  /** Lista las marcas que cobran. */
  async listBillingProfiles<T = unknown>(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/perfiles-de-cobro`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea una marca. */
  async createBillingProfile<T = unknown>(
    input: PerfilDeCobroInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/perfiles-de-cobro`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Edita una marca. */
  async updateBillingProfile<T = unknown>(
    perfilId: string,
    input: PerfilDeCobroInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PATCH",
      path: `/organizations/${orgId}/license-delivery/perfiles-de-cobro/${perfilId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Elimina una marca. */
  async deleteBillingProfile<T = unknown>(
    perfilId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "DELETE",
      path: `/organizations/${orgId}/license-delivery/perfiles-de-cobro/${perfilId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Resumen de ventas por marca. */
  async billingProfilesSummary<T = unknown>(
    query: RangeQuery & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/perfiles-de-cobro/resumen`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Cuentas de transferencia ──────────────────────────────────────────────

  /** Lista las cuentas de transferencia. */
  async listTransferAccounts<T = unknown>(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/transfer-accounts`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea una cuenta de transferencia. */
  async createTransferAccount<T = unknown>(
    input: CuentaDeTransferenciaInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/transfer-accounts`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Edita una cuenta de transferencia. */
  async updateTransferAccount<T = unknown>(
    accountId: string,
    input: EditarCuentaDeTransferenciaInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PATCH",
      path: `/organizations/${orgId}/license-delivery/transfer-accounts/${accountId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Elimina una cuenta de transferencia. */
  async deleteTransferAccount<T = unknown>(
    accountId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "DELETE",
      path: `/organizations/${orgId}/license-delivery/transfer-accounts/${accountId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Reordena las cuentas (se envían todas, en orden). */
  async reorderTransferAccounts<T = unknown>(
    input: ReordenarCuentasInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/transfer-accounts/reorder`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Llaves de cobro ───────────────────────────────────────────────────────

  /** Lista las llaves de cobro (Bre-B / Nequi). */
  async listTransferKeys<T = unknown>(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/transfer-keys`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea una llave de cobro. */
  async createTransferKey<T = unknown>(
    input: LlaveDeCobroInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/transfer-keys`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Edita una llave de cobro. */
  async updateTransferKey<T = unknown>(
    keyId: string,
    input: EditarLlaveDeCobroInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "PATCH",
      path: `/organizations/${orgId}/license-delivery/transfer-keys/${keyId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Elimina una llave de cobro. */
  async deleteTransferKey<T = unknown>(
    keyId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "DELETE",
      path: `/organizations/${orgId}/license-delivery/transfer-keys/${keyId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Deja activa esta llave. */
  async activateTransferKey<T = unknown>(
    keyId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/transfer-keys/${keyId}/activate`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Sube el QR de una llave (PNG/JPG/WebP). */
  async uploadTransferKeyQr<T = unknown>(
    keyId: string,
    input: UploadLicenseDeliveryFileInput,
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(input.orgId);
    const body = this.toForm(input);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/transfer-keys/${keyId}/qr`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Quita el QR de una llave. */
  async removeTransferKeyQr<T = unknown>(
    keyId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method: "DELETE",
      path: `/organizations/${orgId}/license-delivery/transfer-keys/${keyId}/qr`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Comprobantes ──────────────────────────────────────────────────────────

  /** Comprobantes de pago pendientes de revisión. */
  async listPendingReceipts<T = unknown>(
    query: ListPendingReceiptsQuery & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "GET",
      path: `/organizations/${orgId}/license-delivery/receipts`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Aprueba un comprobante. */
  async approveReceipt<T = unknown>(
    receiptId: string,
    input: RevisarComprobanteInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/receipts/${receiptId}/approve`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Rechaza un comprobante (el cliente lee el motivo). */
  async rejectReceipt<T = unknown>(
    receiptId: string,
    input: RechazarComprobanteInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/license-delivery/receipts/${receiptId}/reject`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
  // ─── Imagen pública ─────────────────────────────────────────────────────────

  /**
   * URL pública de la imagen del producto (`GET /license-delivery/img/:productId`,
   * sin auth). Devuelve la URL en vez de descargarla porque la respuesta es
   * binaria (la ve el cliente final y Meta la descarga para enviarla).
   */
  productImageUrl(productId: string, baseUrl = "https://api.mosend.dev"): string {
    return `${baseUrl.replace(/\/+$/, "")}/license-delivery/img/${encodeURIComponent(productId)}`;
  }

  private toForm(input: UploadLicenseDeliveryFileInput): FormData {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError("FormData is not available in this runtime.");
    }
    const form = new FormData();
    const filename = input.filename ?? (input.file as File).name ?? "file";
    form.append("file", input.file, filename);
    return form;
  }
}
