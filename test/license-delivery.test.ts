import { describe, expect, it } from "vitest";
import { createHttpClient } from "../src/core/http.js";
import { LicenseDeliveryResource } from "../src/resources/licenseDelivery.js";
import { createMockFetch } from "./helpers/mockFetch.js";

const ORG_ID = "11111111-1111-1111-1111-111111111111";
const BASE = `https://api.mosend.dev/organizations/${ORG_ID}/license-delivery`;

function resource() {
  const { fetch, requests } = createMockFetch(() => ({
    status: 200,
    body: { data: { ok: true } },
  }));
  const http = createHttpClient({ apiKey: "mk_live_abcd1234.secret", fetch });
  return { ld: new LicenseDeliveryResource({ http, defaultOrgId: ORG_ID }), requests };
}

type Call = (ld: LicenseDeliveryResource) => Promise<unknown>;

interface Case {
  call: Call;
  method: string;
  path: string;
  body?: unknown;
  query?: string;
  file?: boolean;
}

const file = new Blob(["png"], { type: "image/png" });

const cases: Record<string, Case> = {
  "getSettings → GET /settings": {
    call: (ld) => ld.getSettings(),
    method: "GET",
    path: "/settings",
  },
  "updateSettings → PUT /settings": {
    call: (ld) => ld.updateSettings({ enabled: true }),
    method: "PUT",
    path: "/settings",
    body: { enabled: true },
  },
  "setPaidAddon → PUT /settings/addon": {
    call: (ld) => ld.setPaidAddon({ enabled: true }),
    method: "PUT",
    path: "/settings/addon",
    body: { enabled: true },
  },
  "sellingReadiness → GET /selling-readiness": {
    call: (ld) => ld.sellingReadiness({ phoneNumberId: "p-1" }),
    method: "GET",
    path: "/selling-readiness",
    query: "phoneNumberId=p-1",
  },
  "analytics → GET /analytics": {
    call: (ld) => ld.analytics({ days: 30 }),
    method: "GET",
    path: "/analytics",
    query: "days=30",
  },
  "listCoupons → GET /coupons": {
    call: (ld) => ld.listCoupons(),
    method: "GET",
    path: "/coupons",
  },
  "createCoupon → POST /coupons": {
    call: (ld) => ld.createCoupon({ code: "x", discountValue: 1 }),
    method: "POST",
    path: "/coupons",
    body: { code: "x", discountValue: 1 },
  },
  "updateCoupon → PATCH /coupons/cou-1": {
    call: (ld) => ld.updateCoupon("cou-1", { code: "x" }),
    method: "PATCH",
    path: "/coupons/cou-1",
    body: { code: "x" },
  },
  "deleteCoupon → DELETE /coupons/cou-1": {
    call: (ld) => ld.deleteCoupon("cou-1"),
    method: "DELETE",
    path: "/coupons/cou-1",
  },
  "listPriceLists → GET /price-lists": {
    call: (ld) => ld.listPriceLists(),
    method: "GET",
    path: "/price-lists",
  },
  "createPriceList → POST /price-lists": {
    call: (ld) => ld.createPriceList({ name: "x" }),
    method: "POST",
    path: "/price-lists",
    body: { name: "x" },
  },
  "updatePriceList → PATCH /price-lists/pri-1": {
    call: (ld) => ld.updatePriceList("pri-1", { name: "x" }),
    method: "PATCH",
    path: "/price-lists/pri-1",
    body: { name: "x" },
  },
  "deletePriceList → DELETE /price-lists/pri-1": {
    call: (ld) => ld.deletePriceList("pri-1"),
    method: "DELETE",
    path: "/price-lists/pri-1",
  },
  "setPriceListItem → PUT /price-lists/pri-1/items": {
    call: (ld) => ld.setPriceListItem("pri-1", { productId: "x" }),
    method: "PUT",
    path: "/price-lists/pri-1/items",
    body: { productId: "x" },
  },
  "bulkSetPriceListItems → PUT /price-lists/pri-1/items/bulk": {
    call: (ld) =>
      ld.bulkSetPriceListItems("pri-1", { productIds: ["x"], modo: "PORCENTAJE_DEL_BASE" }),
    method: "PUT",
    path: "/price-lists/pri-1/items/bulk",
    body: { productIds: ["x"], modo: "PORCENTAJE_DEL_BASE" },
  },
  "listProducts → GET /products": {
    call: (ld) => ld.listProducts({ contactId: "c-1" }),
    method: "GET",
    path: "/products",
    query: "contactId=c-1",
  },
  "createProduct → POST /products": {
    call: (ld) => ld.createProduct({ name: "x", priceCents: 1 }),
    method: "POST",
    path: "/products",
    body: { name: "x", priceCents: 1 },
  },
  "importProducts → POST /products/import": {
    call: (ld) => ld.importProducts({ products: [{ name: "x", priceCents: 1 }] }),
    method: "POST",
    path: "/products/import",
    body: { products: [{ name: "x", priceCents: 1 }] },
  },
  "bulkUpdateProducts → POST /products/bulk": {
    call: (ld) => ld.bulkUpdateProducts({ patch: { active: true }, productIds: ["x"] }),
    method: "POST",
    path: "/products/bulk",
    body: { patch: { active: true }, productIds: ["x"] },
  },
  "bulkPriceProducts → POST /products/bulk-price": {
    call: (ld) => ld.bulkPriceProducts({ modo: "PORCENTAJE", valor: 1, productIds: ["x"] }),
    method: "POST",
    path: "/products/bulk-price",
    body: { modo: "PORCENTAJE", valor: 1, productIds: ["x"] },
  },
  "bulkDeleteProducts → POST /products/bulk-delete": {
    call: (ld) => ld.bulkDeleteProducts({ productIds: ["x"] }),
    method: "POST",
    path: "/products/bulk-delete",
    body: { productIds: ["x"] },
  },
  "getProduct → GET /products/pro-1": {
    call: (ld) => ld.getProduct("pro-1"),
    method: "GET",
    path: "/products/pro-1",
  },
  "updateProduct → PATCH /products/pro-1": {
    call: (ld) => ld.updateProduct("pro-1", { name: "x" }),
    method: "PATCH",
    path: "/products/pro-1",
    body: { name: "x" },
  },
  "deleteProduct → DELETE /products/pro-1": {
    call: (ld) => ld.deleteProduct("pro-1"),
    method: "DELETE",
    path: "/products/pro-1",
  },
  "setProductPrices → PUT /products/pro-1/prices": {
    call: (ld) => ld.setProductPrices("pro-1", { precios: [{ currency: "COP", priceCents: 1 }] }),
    method: "PUT",
    path: "/products/pro-1/prices",
    body: { precios: [{ currency: "COP", priceCents: 1 }] },
  },
  "uploadProductImage → POST /products/pro-1/image": {
    call: (ld) => ld.uploadProductImage("pro-1", { file, filename: "a.png" }),
    method: "POST",
    path: "/products/pro-1/image",
    file: true,
  },
  "removeProductImage → DELETE /products/pro-1/image": {
    call: (ld) => ld.removeProductImage("pro-1"),
    method: "DELETE",
    path: "/products/pro-1/image",
  },
  "checkout → POST /products/pro-1/checkout": {
    call: (ld) => ld.checkout("pro-1", { variantId: "x" }),
    method: "POST",
    path: "/products/pro-1/checkout",
    body: { variantId: "x" },
  },
  "addKeys → POST /products/pro-1/keys": {
    call: (ld) => ld.addKeys("pro-1", { keys: ["x"] }),
    method: "POST",
    path: "/products/pro-1/keys",
    body: { keys: ["x"] },
  },
  "listKeys → GET /products/pro-1/keys": {
    call: (ld) => ld.listKeys("pro-1", { status: "AVAILABLE" }),
    method: "GET",
    path: "/products/pro-1/keys",
    query: "status=AVAILABLE",
  },
  "deleteKey → DELETE /products/pro-1/keys/key-1": {
    call: (ld) => ld.deleteKey("pro-1", "key-1"),
    method: "DELETE",
    path: "/products/pro-1/keys/key-1",
  },
  "revokeKey → POST /products/pro-1/keys/key-1/revoke": {
    call: (ld) => ld.revokeKey("pro-1", "key-1"),
    method: "POST",
    path: "/products/pro-1/keys/key-1/revoke",
  },
  "createVariant → POST /products/pro-1/variants": {
    call: (ld) => ld.createVariant("pro-1", { name: "x", priceCents: 1 }),
    method: "POST",
    path: "/products/pro-1/variants",
    body: { name: "x", priceCents: 1 },
  },
  "updateVariant → PATCH /products/pro-1/variants/var-1": {
    call: (ld) => ld.updateVariant("pro-1", "var-1", { name: "x" }),
    method: "PATCH",
    path: "/products/pro-1/variants/var-1",
    body: { name: "x" },
  },
  "deleteVariant → DELETE /products/pro-1/variants/var-1": {
    call: (ld) => ld.deleteVariant("pro-1", "var-1"),
    method: "DELETE",
    path: "/products/pro-1/variants/var-1",
  },
  "previewCart → POST /conversations/con-1/cart-preview": {
    call: (ld) => ld.previewCart("con-1", { items: [{ productId: "x" }] }),
    method: "POST",
    path: "/conversations/con-1/cart-preview",
    body: { items: [{ productId: "x" }] },
  },
  "sellToConversation → POST /conversations/con-1/sell": {
    call: (ld) => ld.sellToConversation("con-1", { productId: "x" }),
    method: "POST",
    path: "/conversations/con-1/sell",
    body: { productId: "x" },
  },
  "sellCartToConversation → POST /conversations/con-1/sell-cart": {
    call: (ld) => ld.sellCartToConversation("con-1", { items: [{ productId: "x" }] }),
    method: "POST",
    path: "/conversations/con-1/sell-cart",
    body: { items: [{ productId: "x" }] },
  },
  "dispatch → POST /conversations/con-1/dispatch": {
    call: (ld) => ld.dispatch("con-1", { productId: "x" }),
    method: "POST",
    path: "/conversations/con-1/dispatch",
    body: { productId: "x" },
  },
  "registerManualSale → POST /conversations/con-1/venta-manual": {
    call: (ld) => ld.registerManualSale("con-1", { productId: "x", entregar: true, pagado: true }),
    method: "POST",
    path: "/conversations/con-1/venta-manual",
    body: { productId: "x", entregar: true, pagado: true },
  },
  "registerManualCartSale → POST /conversations/con-1/venta-manual-carrito": {
    call: (ld) =>
      ld.registerManualCartSale("con-1", {
        items: [{ productId: "x" }],
        entregar: true,
        pagado: true,
      }),
    method: "POST",
    path: "/conversations/con-1/venta-manual-carrito",
    body: { items: [{ productId: "x" }], entregar: true, pagado: true },
  },
  "uploadTransferQr → POST /transfer-qr": {
    call: (ld) => ld.uploadTransferQr({ file, filename: "a.png" }),
    method: "POST",
    path: "/transfer-qr",
    file: true,
  },
  "removeTransferQr → DELETE /transfer-qr": {
    call: (ld) => ld.removeTransferQr(),
    method: "DELETE",
    path: "/transfer-qr",
  },
  "getRenewalTemplate → GET /renewal-template": {
    call: (ld) => ld.getRenewalTemplate(),
    method: "GET",
    path: "/renewal-template",
  },
  "createRenewalTemplate → POST /renewal-template": {
    call: (ld) => ld.createRenewalTemplate({ wabaId: "x" }),
    method: "POST",
    path: "/renewal-template",
    body: { wabaId: "x" },
  },
  "listExpirations → GET /expirations": {
    call: (ld) => ld.listExpirations({ days: 15, includeExpired: true }),
    method: "GET",
    path: "/expirations",
    query: "days=15&includeExpired=true",
  },
  "listOrders → GET /orders": {
    call: (ld) => ld.listOrders({ status: "PAID", limit: 10 }),
    method: "GET",
    path: "/orders",
    query: "status=PAID&limit=10",
  },
  "getOrder → GET /orders/ord-1": {
    call: (ld) => ld.getOrder("ord-1"),
    method: "GET",
    path: "/orders/ord-1",
  },
  "setOrderExpiration → PATCH /orders/ord-1/expiration": {
    call: (ld) => ld.setOrderExpiration("ord-1", { expiresAt: "x" }),
    method: "PATCH",
    path: "/orders/ord-1/expiration",
    body: { expiresAt: "x" },
  },
  "resendOrder → POST /orders/ord-1/resend": {
    call: (ld) => ld.resendOrder("ord-1"),
    method: "POST",
    path: "/orders/ord-1/resend",
  },
  "replaceKey → POST /orders/ord-1/keys/key-1/replace": {
    call: (ld) => ld.replaceKey("ord-1", "key-1", { source: "inventory" }),
    method: "POST",
    path: "/orders/ord-1/keys/key-1/replace",
    body: { source: "inventory" },
  },
  "cancelOrder → POST /orders/ord-1/cancel": {
    call: (ld) => ld.cancelOrder("ord-1"),
    method: "POST",
    path: "/orders/ord-1/cancel",
  },
  "uploadPaymentCapture → POST /orders/ord-1/captura-de-pago": {
    call: (ld) => ld.uploadPaymentCapture("ord-1", { file, filename: "a.png" }),
    method: "POST",
    path: "/orders/ord-1/captura-de-pago",
    file: true,
  },
  "changePaymentMethod → POST /orders/ord-1/cambiar-medio": {
    call: (ld) => ld.changePaymentMethod("ord-1", { medio: "x" }),
    method: "POST",
    path: "/orders/ord-1/cambiar-medio",
    body: { medio: "x" },
  },
  "confirmTransfer → POST /orders/ord-1/confirm-transfer": {
    call: (ld) => ld.confirmTransfer("ord-1", { medio: "x" }),
    method: "POST",
    path: "/orders/ord-1/confirm-transfer",
    body: { medio: "x" },
  },
  "completeDelivery → POST /orders/ord-1/completar-entrega": {
    call: (ld) => ld.completeDelivery("ord-1", { llaves: ["x"] }),
    method: "POST",
    path: "/orders/ord-1/completar-entrega",
    body: { llaves: ["x"] },
  },
  "refundOrder → POST /orders/ord-1/refund": {
    call: (ld) => ld.refundOrder("ord-1", { reason: "x" }),
    method: "POST",
    path: "/orders/ord-1/refund",
    body: { reason: "x" },
  },
  "completeExtraData → PATCH /orders/ord-1/dato-adicional": {
    call: (ld) => ld.completeExtraData("ord-1", { valor: "x" }),
    method: "PATCH",
    path: "/orders/ord-1/dato-adicional",
    body: { valor: "x" },
  },
  "markPaid → POST /orders/ord-1/marcar-pagada": {
    call: (ld) => ld.markPaid("ord-1", { medio: "x" }),
    method: "POST",
    path: "/orders/ord-1/marcar-pagada",
    body: { medio: "x" },
  },
  "markDelivered → POST /orders/ord-1/marcar-entregada": {
    call: (ld) => ld.markDelivered("ord-1"),
    method: "POST",
    path: "/orders/ord-1/marcar-entregada",
  },
  "submitOtp → POST /orders/ord-1/otp": {
    call: (ld) => ld.submitOtp("ord-1", { code: "x" }),
    method: "POST",
    path: "/orders/ord-1/otp",
    body: { code: "x" },
  },
  "resendOtp → POST /orders/ord-1/otp/resend": {
    call: (ld) => ld.resendOtp("ord-1"),
    method: "POST",
    path: "/orders/ord-1/otp/resend",
  },
  "listOrderReceipts → GET /orders/ord-1/receipts": {
    call: (ld) => ld.listOrderReceipts("ord-1"),
    method: "GET",
    path: "/orders/ord-1/receipts",
  },
  "testInbox → POST /inbox/test": {
    call: (ld) => ld.testInbox(),
    method: "POST",
    path: "/inbox/test",
  },
  "listMailboxes → GET /buzones": {
    call: (ld) => ld.listMailboxes(),
    method: "GET",
    path: "/buzones",
  },
  "createMailbox → POST /buzones": {
    call: (ld) => ld.createMailbox({ host: "x" }),
    method: "POST",
    path: "/buzones",
    body: { host: "x" },
  },
  "updateMailbox → PATCH /buzones/buz-1": {
    call: (ld) => ld.updateMailbox("buz-1", { host: "x" }),
    method: "PATCH",
    path: "/buzones/buz-1",
    body: { host: "x" },
  },
  "deleteMailbox → DELETE /buzones/buz-1": {
    call: (ld) => ld.deleteMailbox("buz-1"),
    method: "DELETE",
    path: "/buzones/buz-1",
  },
  "testMailbox → POST /buzones/buz-1/probar": {
    call: (ld) => ld.testMailbox("buz-1"),
    method: "POST",
    path: "/buzones/buz-1/probar",
  },
  "listInboxPayments → GET /inbox/payments": {
    call: (ld) => ld.listInboxPayments(),
    method: "GET",
    path: "/inbox/payments",
  },
  "matchPayment → POST /inbox/payments/pag-1/match": {
    call: (ld) => ld.matchPayment("pag-1", { orderId: "x" }),
    method: "POST",
    path: "/inbox/payments/pag-1/match",
    body: { orderId: "x" },
  },
  "matchPaymentToCharge → POST /inbox/payments/pag-1/match-cobro": {
    call: (ld) => ld.matchPaymentToCharge("pag-1", { cobroId: "x" }),
    method: "POST",
    path: "/inbox/payments/pag-1/match-cobro",
    body: { cobroId: "x" },
  },
  "getReassignOptions → GET /inbox/payments/pag-1/reassign-options": {
    call: (ld) => ld.getReassignOptions("pag-1"),
    method: "GET",
    path: "/inbox/payments/pag-1/reassign-options",
  },
  "reassignPayment → POST /inbox/payments/pag-1/reassign": {
    call: (ld) => ld.reassignPayment("pag-1", { orderId: "x" }),
    method: "POST",
    path: "/inbox/payments/pag-1/reassign",
    body: { orderId: "x" },
  },
  "ignorePayment → POST /inbox/payments/pag-1/ignore": {
    call: (ld) => ld.ignorePayment("pag-1", { nota: "x" }),
    method: "POST",
    path: "/inbox/payments/pag-1/ignore",
    body: { nota: "x" },
  },
  "paymentsInbox → GET /payments-inbox": {
    call: (ld) => ld.paymentsInbox({ origen: "BANCO", q: "juan" }),
    method: "GET",
    path: "/payments-inbox",
    query: "origen=BANCO&q=juan",
  },
  "discardPayments → POST /payments-inbox/discard": {
    call: (ld) => ld.discardPayments({ items: [{ id: "i-1", origen: "BANCO" }], reason: "x" }),
    method: "POST",
    path: "/payments-inbox/discard",
    body: { items: [{ id: "i-1", origen: "BANCO" }], reason: "x" },
  },
  "listOrdersToCharge → GET /cobros-agrupados/pendientes": {
    call: (ld) => ld.listOrdersToCharge({ contactId: "c-1" }),
    method: "GET",
    path: "/cobros-agrupados/pendientes",
    query: "contactId=c-1",
  },
  "listGroupedCharges → GET /cobros-agrupados": {
    call: (ld) => ld.listGroupedCharges({ status: "PENDIENTE" }),
    method: "GET",
    path: "/cobros-agrupados",
    query: "status=PENDIENTE",
  },
  "createGroupedCharge → POST /cobros-agrupados": {
    call: (ld) => ld.createGroupedCharge({ contactId: "x" }),
    method: "POST",
    path: "/cobros-agrupados",
    body: { contactId: "x" },
  },
  "resendGroupedCharge → POST /cobros-agrupados/cob-1/reenviar": {
    call: (ld) => ld.resendGroupedCharge("cob-1"),
    method: "POST",
    path: "/cobros-agrupados/cob-1/reenviar",
  },
  "voidGroupedCharge → POST /cobros-agrupados/cob-1/anular": {
    call: (ld) => ld.voidGroupedCharge("cob-1", { motivo: "x" }),
    method: "POST",
    path: "/cobros-agrupados/cob-1/anular",
    body: { motivo: "x" },
  },
  "markGroupedChargePaid → POST /cobros-agrupados/cob-1/marcar-pagado": {
    call: (ld) => ld.markGroupedChargePaid("cob-1", { orderIds: ["x"] }),
    method: "POST",
    path: "/cobros-agrupados/cob-1/marcar-pagado",
    body: { orderIds: ["x"] },
  },
  "registerJointPayment → POST /cobros-agrupados/pago-registrado": {
    call: (ld) => ld.registerJointPayment({ orderIds: ["x"], contactId: "x" }),
    method: "POST",
    path: "/cobros-agrupados/pago-registrado",
    body: { orderIds: ["x"], contactId: "x" },
  },
  "createFreeCharge → POST /cobros-libres": {
    call: (ld) => ld.createFreeCharge({ contactId: "x" }),
    method: "POST",
    path: "/cobros-libres",
    body: { contactId: "x" },
  },
  "listMosendInvoices → GET /cobros-libres/facturas-mosend": {
    call: (ld) => ld.listMosendInvoices({ contactId: "c-1" }),
    method: "GET",
    path: "/cobros-libres/facturas-mosend",
    query: "contactId=c-1",
  },
  "listBillingProfiles → GET /perfiles-de-cobro": {
    call: (ld) => ld.listBillingProfiles(),
    method: "GET",
    path: "/perfiles-de-cobro",
  },
  "createBillingProfile → POST /perfiles-de-cobro": {
    call: (ld) => ld.createBillingProfile({ nombre: "x" }),
    method: "POST",
    path: "/perfiles-de-cobro",
    body: { nombre: "x" },
  },
  "updateBillingProfile → PATCH /perfiles-de-cobro/per-1": {
    call: (ld) => ld.updateBillingProfile("per-1", { nombre: "x" }),
    method: "PATCH",
    path: "/perfiles-de-cobro/per-1",
    body: { nombre: "x" },
  },
  "deleteBillingProfile → DELETE /perfiles-de-cobro/per-1": {
    call: (ld) => ld.deleteBillingProfile("per-1"),
    method: "DELETE",
    path: "/perfiles-de-cobro/per-1",
  },
  "billingProfilesSummary → GET /perfiles-de-cobro/resumen": {
    call: (ld) => ld.billingProfilesSummary({ dias: 7 }),
    method: "GET",
    path: "/perfiles-de-cobro/resumen",
    query: "dias=7",
  },
  "listTransferAccounts → GET /transfer-accounts": {
    call: (ld) => ld.listTransferAccounts(),
    method: "GET",
    path: "/transfer-accounts",
  },
  "createTransferAccount → POST /transfer-accounts": {
    call: (ld) => ld.createTransferAccount({ label: "x", accountNumber: "x" }),
    method: "POST",
    path: "/transfer-accounts",
    body: { label: "x", accountNumber: "x" },
  },
  "updateTransferAccount → PATCH /transfer-accounts/acc-1": {
    call: (ld) => ld.updateTransferAccount("acc-1", { label: "x" }),
    method: "PATCH",
    path: "/transfer-accounts/acc-1",
    body: { label: "x" },
  },
  "deleteTransferAccount → DELETE /transfer-accounts/acc-1": {
    call: (ld) => ld.deleteTransferAccount("acc-1"),
    method: "DELETE",
    path: "/transfer-accounts/acc-1",
  },
  "reorderTransferAccounts → POST /transfer-accounts/reorder": {
    call: (ld) => ld.reorderTransferAccounts({ ids: ["x"] }),
    method: "POST",
    path: "/transfer-accounts/reorder",
    body: { ids: ["x"] },
  },
  "listTransferKeys → GET /transfer-keys": {
    call: (ld) => ld.listTransferKeys(),
    method: "GET",
    path: "/transfer-keys",
  },
  "createTransferKey → POST /transfer-keys": {
    call: (ld) => ld.createTransferKey({ label: "x", key: "x" }),
    method: "POST",
    path: "/transfer-keys",
    body: { label: "x", key: "x" },
  },
  "updateTransferKey → PATCH /transfer-keys/key-1": {
    call: (ld) => ld.updateTransferKey("key-1", { label: "x" }),
    method: "PATCH",
    path: "/transfer-keys/key-1",
    body: { label: "x" },
  },
  "deleteTransferKey → DELETE /transfer-keys/key-1": {
    call: (ld) => ld.deleteTransferKey("key-1"),
    method: "DELETE",
    path: "/transfer-keys/key-1",
  },
  "activateTransferKey → POST /transfer-keys/key-1/activate": {
    call: (ld) => ld.activateTransferKey("key-1"),
    method: "POST",
    path: "/transfer-keys/key-1/activate",
  },
  "uploadTransferKeyQr → POST /transfer-keys/key-1/qr": {
    call: (ld) => ld.uploadTransferKeyQr("key-1", { file, filename: "a.png" }),
    method: "POST",
    path: "/transfer-keys/key-1/qr",
    file: true,
  },
  "removeTransferKeyQr → DELETE /transfer-keys/key-1/qr": {
    call: (ld) => ld.removeTransferKeyQr("key-1"),
    method: "DELETE",
    path: "/transfer-keys/key-1/qr",
  },
  "listPendingReceipts → GET /receipts": {
    call: (ld) => ld.listPendingReceipts({ limit: 20 }),
    method: "GET",
    path: "/receipts",
    query: "limit=20",
  },
  "approveReceipt → POST /receipts/rec-1/approve": {
    call: (ld) => ld.approveReceipt("rec-1", { note: "x" }),
    method: "POST",
    path: "/receipts/rec-1/approve",
    body: { note: "x" },
  },
  "rejectReceipt → POST /receipts/rec-1/reject": {
    call: (ld) => ld.rejectReceipt("rec-1", { reason: "x" }),
    method: "POST",
    path: "/receipts/rec-1/reject",
    body: { reason: "x" },
  },
};

describe("LicenseDeliveryResource — paths verificados vs backend", () => {
  it("cubre las 106 operaciones autenticadas del módulo", () => {
    expect(Object.keys(cases)).toHaveLength(106);
  });

  for (const [label, c] of Object.entries(cases)) {
    it(label, async () => {
      const { ld, requests } = resource();
      await c.call(ld);
      const req = requests[0]!;
      expect(req.method).toBe(c.method);
      const url = new URL(req.url);
      expect(`${url.origin}${url.pathname}`).toBe(`${BASE}${c.path}`);
      if (c.body !== undefined) expect(JSON.parse(req.body!)).toEqual(c.body);
      if (c.query !== undefined) expect(url.search).toBe(`?${c.query}`);
      if (c.file) expect(req.formData?.file).toMatch(/^\[Blob name=a\.png/);
    });
  }

  it("orgId por llamada pisa el default y no viaja en el body", async () => {
    const { ld, requests } = resource();
    await ld.createCoupon({ code: "BIENVENIDA", discountValue: 10, orgId: "org-2" });
    expect(requests[0]!.url).toBe(
      "https://api.mosend.dev/organizations/org-2/license-delivery/coupons",
    );
    expect(JSON.parse(requests[0]!.body!)).toEqual({ code: "BIENVENIDA", discountValue: 10 });
  });

  it("sin orgId (ni default) lanza antes de pedir", async () => {
    const { fetch } = createMockFetch(() => ({ status: 200, body: { data: {} } }));
    const http = createHttpClient({ apiKey: "mk_live_abcd1234.secret", fetch });
    const ld = new LicenseDeliveryResource({ http, defaultOrgId: undefined });
    await expect(ld.listOrders()).rejects.toThrow(/orgId is required/);
  });

  it("productImageUrl → URL pública /license-delivery/img/:productId", () => {
    const { ld } = resource();
    expect(ld.productImageUrl("p-1")).toBe("https://api.mosend.dev/license-delivery/img/p-1");
    expect(ld.productImageUrl("p-1", "http://localhost:3000/")).toBe(
      "http://localhost:3000/license-delivery/img/p-1",
    );
  });
});
