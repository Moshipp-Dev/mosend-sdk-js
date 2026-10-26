import { describe, expect, it } from "vitest";
import { createHttpClient } from "../src/core/http.js";
import type { ResourceContext } from "../src/resources/base.js";
import { AgendaResource } from "../src/resources/agenda.js";
import { CatalogsResource } from "../src/resources/catalogs.js";
import { MercadoPagoResource } from "../src/resources/mercadoPago.js";
import { NequiPaymentsResource } from "../src/resources/nequiPayments.js";
import { OrdersResource } from "../src/resources/orders.js";
import { PaymentReportsResource } from "../src/resources/paymentReports.js";
import { QuotesResource } from "../src/resources/quotes.js";
import { SalesResource } from "../src/resources/sales.js";
import { WompiResource } from "../src/resources/wompi.js";
import { createMockFetch, type MockResponseInit } from "./helpers/mockFetch.js";

const ORG_ID = "11111111-1111-1111-1111-111111111111";
const API_KEY = "mk_live_abcd1234.secret";
const BASE = "https://api.mosend.dev";

function setup(
  respond: () => MockResponseInit = () => ({ status: 200, body: { data: {}, timestamp: "" } }),
) {
  const { fetch, requests } = createMockFetch(respond);
  const ctx: ResourceContext = {
    http: createHttpClient({ apiKey: API_KEY, baseUrl: BASE, fetch }),
    defaultOrgId: ORG_ID,
  };
  const last = () => {
    const req = requests[requests.length - 1]!;
    const url = new URL(req.url);
    return {
      method: req.method,
      path: url.pathname,
      query: Object.fromEntries(url.searchParams.entries()),
      body: req.body && !req.formData ? (JSON.parse(req.body) as unknown) : undefined,
      formData: req.formData,
      headers: req.headers,
    };
  };
  return { ctx, requests, last };
}

type Case = [() => Promise<unknown>, string, string];

async function expectCalls(last: ReturnType<typeof setup>["last"], cases: Case[]) {
  for (const [call, method, path] of cases) {
    await call();
    const req = last();
    expect(`${req.method} ${req.path}`).toBe(`${method} ${path}`);
  }
}

const O = `/organizations/${ORG_ID}`;

describe("agenda", () => {
  it("cada método va a su ruta", async () => {
    const { ctx, last } = setup();
    const a = new AgendaResource(ctx);
    const b = `${O}/agenda`;
    await expectCalls(last, [
      [() => a.getSettings(), "GET", `${b}/settings`],
      [() => a.updateSettings({ enabled: true }), "PATCH", `${b}/settings`],
      [() => a.applyPreset({ tipo: "salon" }), "POST", `${b}/preset`],
      [() => a.getIcs(), "GET", `${b}/ics`],
      [() => a.rotateIcs(), "POST", `${b}/ics/rotate`],
      [() => a.revokeIcs(), "DELETE", `${b}/ics`],
      [() => a.listTypes(), "GET", `${b}/types`],
      [() => a.createType({ name: "Corte", durationMin: 30 }), "POST", `${b}/types`],
      [() => a.updateType("t1", { active: false }), "PATCH", `${b}/types/t1`],
      [() => a.contactSummary("c1"), "GET", `${b}/contacts/c1/resumen`],
      [() => a.listResources(), "GET", `${b}/recursos`],
      [() => a.createResource({ nombre: "Sala" }), "POST", `${b}/recursos`],
      [() => a.updateResource("r1", { cantidad: 2 }), "PATCH", `${b}/recursos/r1`],
      [() => a.deleteResource("r1"), "DELETE", `${b}/recursos/r1`],
      [() => a.listPackages({ contactId: "c1" }), "GET", `${b}/paquetes`],
      [
        () => a.createPackage({ contactId: "c1", nombre: "x", sesiones: 5 }),
        "POST",
        `${b}/paquetes`,
      ],
      [() => a.voidPackage("p1"), "DELETE", `${b}/paquetes/p1`],
      [() => a.report({ desde: "2026-10-01" }), "GET", `${b}/reporte`],
      [() => a.listWaitlist(), "GET", `${b}/lista-de-espera`],
      [
        () =>
          a.addToWaitlist({
            contactId: "c1",
            typeId: "t1",
            desde: "2026-10-01",
            hasta: "2026-10-31",
          }),
        "POST",
        `${b}/lista-de-espera`,
      ],
      [() => a.removeFromWaitlist("w1"), "DELETE", `${b}/lista-de-espera/w1`],
      [() => a.listStaff(), "GET", `${b}/staff`],
      [() => a.getAvailability(), "GET", `${b}/availability`],
      [() => a.listExceptions(), "GET", `${b}/exceptions`],
      [() => a.removeException("e1"), "DELETE", `${b}/exceptions/e1`],
      [() => a.getSlots({ typeId: "t1" }), "GET", `${b}/slots`],
      [() => a.listAppointments({ status: "CONFIRMED" }), "GET", `${b}/appointments`],
      [
        () => a.book({ typeId: "t1", contactId: "c1", startAt: "2026-11-02T14:00:00.000Z" }),
        "POST",
        `${b}/appointments`,
      ],
      [() => a.updateAppointment("ap1", { notes: "n" }), "PATCH", `${b}/appointments/ap1`],
      [() => a.cancel("ap1", { reason: "r" }), "PATCH", `${b}/appointments/ap1/cancel`],
      [() => a.reschedule("ap1", { startAt: "x" }), "PATCH", `${b}/appointments/ap1/reschedule`],
      [() => a.setStatus("ap1", { status: "COMPLETED" }), "PATCH", `${b}/appointments/ap1/status`],
      [() => a.requestEmail("ap1"), "POST", `${b}/appointments/ap1/pedir-correo`],
      [() => a.counts(), "GET", `${b}/counts`],
      [() => a.googleStatus(), "GET", `${b}/google/status`],
      [() => a.googleConnect(), "GET", `${b}/google/connect`],
      [() => a.updateGoogle({ pushEnabled: true }), "PATCH", `${b}/google`],
      [() => a.disconnectGoogle(), "DELETE", `${b}/google`],
      [
        () => a.sendBookingFlow({ contactId: "c1", appointmentTypeId: "t1" }),
        "POST",
        `${b}/booking-flow/send`,
      ],
    ]);
  });

  it("staffUserId viaja en la query, no en el body", async () => {
    const { ctx, last } = setup();
    const a = new AgendaResource(ctx);
    const rules = [{ weekday: 1, startMinute: 480, endMinute: 1020 }];
    await a.setAvailability({ staffUserId: "u1", rules });
    expect(last().method).toBe("PUT");
    expect(last().query).toEqual({ staffUserId: "u1" });
    expect(last().body).toEqual({ rules });

    await a.addException({ staffUserId: "u1", date: "2026-12-25", reason: "Navidad" });
    expect(last().query).toEqual({ staffUserId: "u1" });
    expect(last().body).toEqual({ date: "2026-12-25", reason: "Navidad" });

    await a.setAvailability({ rules });
    expect(last().query).toEqual({});
  });

  it("getSlots y listAppointments mandan sus filtros", async () => {
    const { ctx, last } = setup();
    const a = new AgendaResource(ctx);
    await a.getSlots({ typeId: "t1", days: 7, seats: 2 });
    expect(last().query).toEqual({ typeId: "t1", days: "7", seats: "2" });
    await a.listAppointments({ from: "2026-11-01", contactId: "c1" });
    expect(last().query).toEqual({ from: "2026-11-01", contactId: "c1" });
  });

  it("book manda el body tal cual", async () => {
    const { ctx, last } = setup();
    await new AgendaResource(ctx).book({
      typeId: "t1",
      contactId: "c1",
      startAt: "2026-11-02T14:00:00.000Z",
      repetir: { cadaDias: 7, veces: 4 },
    });
    expect(last().body).toEqual({
      typeId: "t1",
      contactId: "c1",
      startAt: "2026-11-02T14:00:00.000Z",
      repetir: { cadaDias: 7, veces: 4 },
    });
  });

  it("rutas públicas: sin credenciales y con el cuerpo en texto", async () => {
    const ics = "BEGIN:VCALENDAR\r\nEND:VCALENDAR";
    const { ctx, last } = setup(() => ({
      status: 200,
      body: ics,
      headers: { "content-type": "text/calendar" },
    }));
    const a = new AgendaResource(ctx);

    // El mock serializa el cuerpo con JSON.stringify: llega entre comillas.
    expect(await a.icsFeed("tok/1")).toBe(JSON.stringify(ics));
    expect(last().path).toBe("/public/agenda/tok%2F1/calendar.ics");
    expect(last().headers["x-api-key"]).toBeUndefined();

    await a.googleCallback({ code: "c", state: "s" });
    expect(`${last().method} ${last().path}`).toBe("GET /agenda/google/callback");
    expect(last().query).toEqual({ code: "c", state: "s" });

    const flow = { encrypted_flow_data: "a", encrypted_aes_key: "b", initial_vector: "c" };
    await a.bookingFlowData(flow);
    expect(`${last().method} ${last().path}`).toBe("POST /agenda/flow/data");
    expect(last().body).toEqual(flow);
  });
});

describe("sales", () => {
  it("cada método va a su ruta", async () => {
    const { ctx, last } = setup();
    const s = new SalesResource(ctx);
    const b = `${O}/sales`;
    const e = `${b}/einvoicing`;
    await expectCalls(last, [
      [() => s.entitlement(), "GET", `${b}/entitlement`],
      [() => s.setAddons({ einvoicing: true }), "PUT", `${b}/addons`],
      [() => s.listProducts({ q: "x" }), "GET", `${b}/products`],
      [() => s.getProduct("p1"), "GET", `${b}/products/p1`],
      [() => s.createProduct({ name: "x", priceCents: 100 }), "POST", `${b}/products`],
      [() => s.updateProduct("p1", { active: false }), "PATCH", `${b}/products/p1`],
      [() => s.deleteProduct("p1"), "DELETE", `${b}/products/p1`],
      [
        () => s.createOrder({ items: [{ description: "x", quantity: 1, unitPriceCents: 100 }] }),
        "POST",
        `${b}/orders`,
      ],
      [() => s.listOrders({ status: "PAID" }), "GET", `${b}/orders`],
      [() => s.getOrder("o1"), "GET", `${b}/orders/o1`],
      [() => s.updateOrderStatus("o1", { status: "PAID" }), "PATCH", `${b}/orders/o1/status`],
      [() => s.deleteOrder("o1"), "DELETE", `${b}/orders/o1`],
      [() => s.listBillingProfiles(), "GET", `${b}/billing-profiles`],
      [() => s.getBillingProfile("bp1"), "GET", `${b}/billing-profiles/bp1`],
      [
        () => s.createBillingProfile({ legalName: "x", docNumber: "1" }),
        "POST",
        `${b}/billing-profiles`,
      ],
      [
        () => s.updateBillingProfile("bp1", { email: "a@b.co" }),
        "PATCH",
        `${b}/billing-profiles/bp1`,
      ],
      [() => s.deleteBillingProfile("bp1"), "DELETE", `${b}/billing-profiles/bp1`],
      [() => s.getEinvoicingConfig({ configId: "cf1" }), "GET", `${e}/config`],
      [() => s.updateEinvoicingConfig({ name: "x" }), "PUT", `${e}/config`],
      [() => s.validateEinvoicing(), "POST", `${e}/validate`],
      [() => s.listEinvoicingCompanies(), "GET", `${e}/companies`],
      [() => s.suggestEinvoicingCompany({ orderId: "o1" }), "GET", `${e}/companies/sugerida`],
      [() => s.deleteEinvoicingCompany("cf1"), "DELETE", `${e}/companies/cf1`],
      [() => s.importEinvoicingCustomers(), "POST", `${e}/customers/import`],
      [() => s.lookupEinvoicingCustomer({ doc: "900" }), "GET", `${e}/customer-lookup`],
      [() => s.listInvoices({ docType: "INVOICE" }), "GET", `${e}/invoices`],
      [() => s.generateInvoice({ orderId: "o1" }), "POST", `${e}/invoices`],
      [() => s.createCreditNote({ invoiceId: "i1" }), "POST", `${e}/credit-notes`],
      [
        () => s.invoiceLicenseOrder({ customerOrderId: "co1" }),
        "POST",
        `${e}/license-orders/invoice`,
      ],
      [
        () => s.createLicenseInvoiceDraft({ customerOrderId: "co1" }),
        "POST",
        `${e}/license-orders/draft`,
      ],
      [() => s.sendInvoice("i1"), "POST", `${e}/invoices/i1/send`],
      [() => s.getInvoicePdf("i1"), "GET", `${e}/invoices/i1/pdf`],
    ]);
  });

  it("body y query 1:1 con la API", async () => {
    const { ctx, last } = setup();
    const s = new SalesResource(ctx);
    await s.createOrder({ channel: "WHATSAPP", items: [{ productId: "p1", quantity: 2 }] });
    expect(last().body).toEqual({ channel: "WHATSAPP", items: [{ productId: "p1", quantity: 2 }] });
    await s.lookupEinvoicingCustomer({ doc: "900123", docType: "31", configId: "cf1" });
    expect(last().query).toEqual({ doc: "900123", docType: "31", configId: "cf1" });
    await s.importEinvoicingCustomers({ configId: "cf1" });
    expect(last().query).toEqual({ configId: "cf1" });
    expect(last().body).toBeUndefined();
  });

  it("publicInvoicePdf devuelve los bytes sin credenciales", async () => {
    const { ctx, last } = setup(() => ({ status: 200, body: "PDF" }));
    const buf = await new SalesResource(ctx).publicInvoicePdf("tok");
    expect(buf).toBeInstanceOf(ArrayBuffer);
    expect(`${last().method} ${last().path}`).toBe("GET /sales/invoice-pdf/tok");
    expect(last().headers["x-api-key"]).toBeUndefined();
  });
});

describe("cotizaciones", () => {
  it("cada método va a su ruta", async () => {
    const { ctx, last } = setup();
    const q = new QuotesResource(ctx);
    const b = `${O}/cotizaciones`;
    const linea = {
      origen: "LIBRE" as const,
      descripcion: "x",
      cantidad: 1,
      precioUnitarioCents: 100,
    };
    await expectCalls(last, [
      [() => q.availability(), "GET", `${b}/disponibilidad`],
      [() => q.companies({ conversationId: "cv1" }), "GET", `${b}/empresas`],
      [
        () => q.uploadLogo({ file: new Blob(["x"], { type: "image/png" }), filename: "logo.png" }),
        "POST",
        `${b}/emisor/logo`,
      ],
      [() => q.catalog(), "GET", `${b}/catalogo`],
      [() => q.list({ estado: "ENVIADA" }), "GET", b],
      [() => q.create({ lineas: [linea] }), "POST", b],
      [() => q.get("q1"), "GET", `${b}/q1`],
      [() => q.update("q1", { lineas: [linea] }), "PUT", `${b}/q1`],
      [() => q.delete("q1"), "DELETE", `${b}/q1`],
      [() => q.pdf("q1"), "GET", `${b}/q1/pdf`],
      [() => q.viewLink("q1"), "GET", `${b}/q1/enlace`],
      [() => q.send("q1", { mensaje: "hola" }), "POST", `${b}/q1/enviar`],
      [() => q.duplicate("q1"), "POST", `${b}/q1/duplicar`],
      [() => q.setStatus("q1", { estado: "ACEPTADA" }), "PATCH", `${b}/q1/estado`],
      [() => q.convert("q1"), "POST", `${b}/q1/convertir`],
      [() => q.publicPdf("tok"), "GET", "/cotizaciones/pdf/tok"],
      [() => q.viewPdf("tok", { descargar: "1" }), "GET", "/cotizaciones/vista/tok"],
    ]);
    expect(last().query).toEqual({ descargar: "1" });
  });

  it("uploadLogo es multipart con el campo file", async () => {
    const { ctx, last } = setup();
    await new QuotesResource(ctx).uploadLogo({
      file: new Blob(["x"], { type: "image/png" }),
      filename: "logo.png",
    });
    expect(last().formData).toEqual({ file: "[Blob name=logo.png size=1]" });
  });
});

describe("pedidos de WhatsApp y catálogo", () => {
  it("cada método va a su ruta", async () => {
    const { ctx, last } = setup();
    const o = new OrdersResource(ctx);
    const c = new CatalogsResource(ctx);
    await expectCalls(last, [
      [() => o.getByMessage("m1"), "GET", `${O}/orders/by-message/m1`],
      [() => o.updateStatus("o1", { status: "COMPLETED" }), "PATCH", `${O}/orders/o1`],
      [() => c.connect("w1"), "POST", `${O}/catalog/waba/w1/connect`],
      [() => c.sync("w1"), "POST", `${O}/catalog/waba/w1/sync`],
      [() => c.listProducts({ catalogId: "cat1" }), "GET", `${O}/catalog/products`],
      [
        () => c.getCommerceSettings({ phoneNumberId: "ph1" }),
        "GET",
        `${O}/catalog/commerce-settings`,
      ],
      [
        () => c.updateCommerceSettings({ phoneNumberId: "ph1", isCartEnabled: true }),
        "PATCH",
        `${O}/catalog/commerce-settings`,
      ],
    ]);
    expect(last().query).toEqual({ phoneNumberId: "ph1" });
    expect(last().body).toEqual({ isCartEnabled: true });
  });
});

describe("cobros: Nequi, comprobantes y webhooks de pasarela", () => {
  it("cada método va a su ruta", async () => {
    const { ctx, last } = setup();
    const n = new NequiPaymentsResource(ctx);
    const p = new PaymentReportsResource(ctx);
    const w = new WompiResource(ctx);
    const mp = new MercadoPagoResource(ctx);
    await expectCalls(last, [
      [() => n.enabled(), "GET", `${O}/billing/nequi/enabled`],
      [
        () => n.createPush({ phoneNumber: "3001234567", amount: 10 }),
        "POST",
        `${O}/billing/nequi/push`,
      ],
      [() => n.createQr({ invoiceId: "i1" }), "POST", `${O}/billing/nequi/qr`],
      [() => n.status("np1"), "GET", `${O}/billing/nequi/np1/status`],
      [() => n.cancel("np1"), "POST", `${O}/billing/nequi/np1/cancel`],
      [() => p.brebInfo(), "GET", `${O}/billing/payment-reports/breb-info`],
      [
        () => p.create({ receipt: new Blob(["x"]), amount: 50000 }),
        "POST",
        `${O}/billing/payment-reports`,
      ],
      [() => p.list(), "GET", `${O}/billing/payment-reports`],
      [() => p.receiptUrl("pr1"), "GET", `${O}/billing/payment-reports/pr1/receipt`],
      [() => w.webhook({ event: "transaction.updated", data: {} }), "POST", "/webhooks/wompi"],
      [
        () => w.webhookForOrg({ event: "transaction.updated", data: {} }),
        "POST",
        `/webhooks/wompi/${ORG_ID}`,
      ],
      [() => mp.webhook({ type: "payment", data: { id: "1" } }), "POST", "/webhooks/mercado-pago"],
    ]);
  });

  it("el comprobante va como multipart con monto, factura y nota", async () => {
    const { ctx, last } = setup();
    await new PaymentReportsResource(ctx).create({
      receipt: new Blob(["xy"]),
      filename: "pago.jpg",
      amount: 50000,
      invoiceId: "i1",
      note: "ref 123",
    });
    expect(last().formData).toEqual({
      receipt: "[Blob name=pago.jpg size=2]",
      amount: "50000",
      invoiceId: "i1",
      note: "ref 123",
    });
  });

  it("el webhook de Mercado Pago reenvía query y cabeceras de firma", async () => {
    const { ctx, last } = setup();
    await new MercadoPagoResource(ctx).webhook(
      { type: "payment", data: { id: "99" } },
      { type: "payment", id: "99" },
      { headers: { "x-signature": "ts=1,v1=abc", "x-request-id": "req-1" } },
    );
    expect(last().query).toEqual({ type: "payment", id: "99" });
    expect(last().headers["x-signature"]).toBe("ts=1,v1=abc");
    expect(last().headers["x-api-key"]).toBeUndefined();
  });
});
