import { describe, expect, it } from "vitest";
import { createHttpClient } from "../src/core/http.js";
import type { ResourceContext } from "../src/resources/base.js";
import { BroadcastsResource } from "../src/resources/broadcasts.js";
import { ContactListsResource } from "../src/resources/contactLists.js";
import { ContactsResource } from "../src/resources/contacts.js";
import { ConversationsResource } from "../src/resources/conversations.js";
import { CrmResource } from "../src/resources/crm.js";
import { DealsResource } from "../src/resources/deals.js";
import { DocumentsResource } from "../src/resources/documents.js";
import { FlowsResource } from "../src/resources/flows.js";
import { LinkPagesResource } from "../src/resources/linkPages.js";
import { MessagesResource } from "../src/resources/messages.js";
import { PhoneNumbersResource } from "../src/resources/phoneNumbers.js";
import { TagsResource } from "../src/resources/tags.js";
import { TemplatesResource } from "../src/resources/templates.js";
import { WabaResource } from "../src/resources/waba.js";
import { WebChatPublicResource } from "../src/resources/webChatPublic.js";
import { WebChatResource } from "../src/resources/webChat.js";
import { WhatsappFlowsResource } from "../src/resources/whatsappFlows.js";
import { WhatsappGroupsResource } from "../src/resources/whatsappGroups.js";
import { createMockFetch, type RecordedRequest } from "./helpers/mockFetch.js";

const ORG = "11111111-1111-1111-1111-111111111111";
const BASE = "https://api.mosend.dev";

function setup() {
  const { fetch, requests } = createMockFetch(() => ({
    status: 200,
    body: { data: {}, timestamp: "" },
  }));
  const http = createHttpClient({ apiKey: "mk_live_abcd1234.secret", fetch });
  const ctx: ResourceContext = { http, defaultOrgId: ORG };
  const last = (): RecordedRequest => requests[requests.length - 1]!;
  const call = () => {
    const r = last();
    const url = new URL(r.url);
    return { method: r.method, path: url.pathname, query: url.searchParams, req: r };
  };
  const body = () => JSON.parse(last().body!) as Record<string, unknown>;
  return { ctx, call, body, requests };
}

const o = (p: string) => `/organizations/${ORG}${p}`;
const file = () => new Blob(["phone,name\n573000000000,Ana"], { type: "text/csv" });

describe("conversations — endpoints nuevos", () => {
  it("notification-settings GET/PATCH, agent, devolver-al-bot, tomar-hilo", async () => {
    const { ctx, call, body } = setup();
    const r = new ConversationsResource(ctx);

    await r.getNotificationSettings();
    expect(call()).toMatchObject({
      method: "GET",
      path: o("/conversations/notification-settings"),
    });

    await r.updateNotificationSettings({
      conversationDelayEmail: { enabled: true, thresholdMin: 15 },
    });
    expect(call()).toMatchObject({
      method: "PATCH",
      path: o("/conversations/notification-settings"),
    });
    expect(body()).toEqual({ conversationDelayEmail: { enabled: true, thresholdMin: 15 } });

    await r.setAgent("c-1", { agentId: null });
    expect(call()).toMatchObject({ method: "PATCH", path: o("/conversations/c-1/agent") });
    expect(body()).toEqual({ agentId: null });

    await r.returnToBot("c-1");
    expect(call()).toMatchObject({ method: "POST", path: o("/conversations/c-1/devolver-al-bot") });

    await r.takeThread("c-1");
    expect(call()).toMatchObject({ method: "POST", path: o("/conversations/c-1/tomar-hilo") });
  });

  it("campos alineados: around, desde/hasta, followUpAt, handoff con detail, snooze con note", async () => {
    const { ctx, call, body } = setup();
    const r = new ConversationsResource(ctx);

    await r.listMessages("c-1", { around: "m-9", limit: 20 });
    expect(call().query.get("around")).toBe("m-9");

    await r.activityTrends({ desde: "2026-10-01", hasta: "2026-10-25" });
    expect(call().query.get("desde")).toBe("2026-10-01");

    await r.workloadByAgent("u-1", { days: 7 });
    expect(call().path).toBe(o("/conversations/workload/agent/u-1"));
    expect(call().query.get("days")).toBe("7");

    await r.unreadCounts({ phoneNumberId: "p-1" });
    expect(call().query.get("phoneNumberId")).toBe("p-1");

    await r.setStatus("c-1", {
      status: "closed",
      resolutionOutcome: "PENDING_FOLLOWUP",
      followUpAt: "2026-11-01",
    });
    expect(body()).toEqual({
      status: "closed",
      resolutionOutcome: "PENDING_FOLLOWUP",
      followUpAt: "2026-11-01",
    });

    await r.requestHandoff("c-1", { detail: "pidió ventas" });
    expect(call()).toMatchObject({ method: "POST", path: o("/conversations/c-1/request-handoff") });
    expect(body()).toEqual({ detail: "pidió ventas" });

    await r.snooze("c-1", { until: "2026-11-01T09:00:00Z", note: "llamar" });
    expect(body()).toEqual({ until: "2026-11-01T09:00:00Z", note: "llamar" });
  });
});

describe("messages — interactivos y revelar", () => {
  it("interactive / product / flow / carousel / revelar", async () => {
    const { ctx, call, body } = setup();
    const r = new MessagesResource(ctx);

    await r.sendInteractive({
      phoneNumberId: "p",
      to: "57300",
      kind: "cta_url",
      bodyText: "Mira",
      displayText: "Abrir",
      url: "https://x.co",
    });
    expect(call()).toMatchObject({ method: "POST", path: o("/messages/interactive") });
    expect(body()).toMatchObject({ kind: "cta_url", url: "https://x.co" });
    expect(body()).not.toHaveProperty("orgId");

    await r.sendProduct({
      phoneNumberId: "p",
      to: "57300",
      catalogId: "cat",
      productRetailerId: "sku-1",
    });
    expect(call()).toMatchObject({ method: "POST", path: o("/messages/product") });

    await r.sendFlow({
      phoneNumberId: "p",
      to: "57300",
      flowId: "f",
      bodyText: "Llena",
      ctaText: "Abrir",
      flowAction: "navigate",
    });
    expect(call()).toMatchObject({ method: "POST", path: o("/messages/flow") });
    expect(body()).toMatchObject({ flowId: "f", flowAction: "navigate" });

    await r.sendCarousel({
      phoneNumberId: "p",
      to: "57300",
      bodyText: "Ofertas",
      cards: [
        {
          headerType: "image",
          headerLink: "https://x.co/a.jpg",
          quickReplies: [{ id: "a", title: "A" }],
        },
      ],
    });
    expect(call()).toMatchObject({ method: "POST", path: o("/messages/carousel") });

    await r.reveal("m-1");
    expect(call()).toMatchObject({ method: "POST", path: o("/messages/m-1/revelar") });
  });
});

describe("contacts — filtros CRM, exportación, importación con mapeo y adjuntos de notas", () => {
  it("list con filtros CRM (campos como JSON)", async () => {
    const { ctx, call } = setup();
    const r = new ContactsResource(ctx);
    await r.list({
      duenoUserId: "ninguno",
      empresaId: "e-1",
      etapa: "CLIENTE",
      campos: { segmento: "VIP" },
      compraEnDias: 30,
      sinCompraDias: 90,
      gastoMin: 100000,
      puntajeMin: 50,
      page: 2,
    });
    const { path, query } = call();
    expect(path).toBe(o("/contacts"));
    expect(query.get("duenoUserId")).toBe("ninguno");
    expect(query.get("empresaId")).toBe("e-1");
    expect(query.get("etapa")).toBe("CLIENTE");
    expect(JSON.parse(query.get("campos")!)).toEqual({ segmento: "VIP" });
    expect(query.get("compraEnDias")).toBe("30");
    expect(query.get("sinCompraDias")).toBe("90");
    expect(query.get("gastoMin")).toBe("100000");
    expect(query.get("puntajeMin")).toBe("50");
    expect(query.get("page")).toBe("2");
  });

  it("export → GET contacts/export con los mismos filtros", async () => {
    const { ctx, call } = setup();
    await new ContactsResource(ctx).export({ etapa: "INACTIVO", tagId: "t-1" });
    expect(call()).toMatchObject({ method: "GET", path: o("/contacts/export") });
    expect(call().query.get("etapa")).toBe("INACTIVO");
    expect(call().query.get("tagId")).toBe("t-1");
  });

  it("import (multipart con mapeo) y import/preview", async () => {
    const { ctx, call } = setup();
    const r = new ContactsResource(ctx);
    await r.import({
      file: file(),
      filename: "c.csv",
      defaultCountry: "CO",
      defaultOptIn: true,
      mapeo: { Teléfono: "phone", Segmento: "campo:segmento" },
    });
    expect(call()).toMatchObject({ method: "POST", path: o("/contacts/import") });
    expect(call().query.get("defaultCountry")).toBe("CO");
    expect(call().query.get("defaultOptIn")).toBe("true");
    expect(call().req.formData!["file"]).toContain("name=c.csv");
    expect(JSON.parse(call().req.formData!["mapeo"]!)).toEqual({
      Teléfono: "phone",
      Segmento: "campo:segmento",
    });

    await r.previewImport({ file: file(), filename: "c.csv" });
    expect(call()).toMatchObject({ method: "POST", path: o("/contacts/import/preview") });
    expect(call().req.formData!["file"]).toContain("name=c.csv");
  });

  it("notas: menciones/adjuntos y subida de adjunto", async () => {
    const { ctx, call, body } = setup();
    const r = new ContactsResource(ctx);
    await r.uploadNoteAttachment("ct-1", { file: file(), filename: "f.pdf" });
    expect(call()).toMatchObject({ method: "POST", path: o("/contacts/ct-1/notes/adjuntos") });
    expect(call().req.formData!["file"]).toContain("name=f.pdf");

    const adjunto = { mediaId: "md-1", nombre: "f.pdf", tipo: "application/pdf", tamano: 10 };
    await r.addNote("ct-1", { body: "Hola @Ana", menciones: ["u-1"], adjuntos: [adjunto] });
    expect(call()).toMatchObject({ method: "POST", path: o("/contacts/ct-1/notes") });
    expect(body()).toEqual({ body: "Hola @Ana", menciones: ["u-1"], adjuntos: [adjunto] });

    await r.updateNote("ct-1", "n-1", { menciones: [] });
    expect(body()).toEqual({ menciones: [] });
  });
});

describe("contactLists — filtros, vaciar, quitar en bloque, importar, smartFilter", () => {
  it("members DELETE, add/remove-by-filter, clear, import, smartFilter", async () => {
    const { ctx, call, body } = setup();
    const r = new ContactListsResource(ctx);

    await r.removeMembers("l-1", { contactIds: ["a", "b"] });
    expect(call()).toMatchObject({ method: "DELETE", path: o("/contact-lists/l-1/members") });
    expect(body()).toEqual({ contactIds: ["a", "b"] });

    await r.addByFilter("l-1", { tagId: "t-1", lastActivityDaysGt: 30 });
    expect(call()).toMatchObject({ method: "POST", path: o("/contact-lists/l-1/add-by-filter") });
    expect(body()).toEqual({ tagId: "t-1", lastActivityDaysGt: 30 });

    await r.removeByFilter("l-1", { optInStatus: "OPTED_OUT" });
    expect(call()).toMatchObject({
      method: "POST",
      path: o("/contact-lists/l-1/remove-by-filter"),
    });

    await r.clear("l-1");
    expect(call()).toMatchObject({ method: "POST", path: o("/contact-lists/l-1/clear") });

    await r.import("l-1", {
      file: file(),
      filename: "l.csv",
      mapeo: { Nombre: "name" },
      defaultOptIn: false,
    });
    expect(call()).toMatchObject({ method: "POST", path: o("/contact-lists/l-1/import") });
    expect(call().query.get("defaultOptIn")).toBe("false");
    expect(JSON.parse(call().req.formData!["mapeo"]!)).toEqual({ Nombre: "name" });

    await r.create({ name: "Dormidos", smartFilter: { sinCompraDias: 90, etapa: "CLIENTE" } });
    expect(body()).toEqual({
      name: "Dormidos",
      smartFilter: { sinCompraDias: 90, etapa: "CLIENTE" },
    });

    await r.update("l-1", { smartFilter: null });
    expect(body()).toEqual({ smartFilter: null });

    await r.listMembers("l-1", { page: 2, pageSize: 100 });
    expect(call().query.get("pageSize")).toBe("100");
  });
});

describe("tags, templates, broadcasts, flows, waba, documents", () => {
  it("rutas nuevas", async () => {
    const { ctx, call, body } = setup();

    await new TagsResource(ctx).update("t-1", { color: "#ff0000" });
    expect(call()).toMatchObject({ method: "PATCH", path: o("/tags/t-1") });
    expect(body()).toEqual({ color: "#ff0000" });

    const tpl = new TemplatesResource(ctx);
    await tpl.copy("tp-1", { wabaId: "w-2" });
    expect(call()).toMatchObject({ method: "POST", path: o("/templates/tp-1/copiar") });
    expect(body()).toEqual({ wabaId: "w-2" });
    await tpl.setHeaderMedia("tp-1", { file: file(), filename: "h.jpg" });
    expect(call()).toMatchObject({ method: "POST", path: o("/templates/tp-1/header-media") });
    expect(call().req.formData!["file"]).toContain("name=h.jpg");
    await tpl.clearHeaderMedia("tp-1");
    expect(call()).toMatchObject({ method: "DELETE", path: o("/templates/tp-1/header-media") });

    await new BroadcastsResource(ctx).retryFailed("b-1");
    expect(call()).toMatchObject({ method: "POST", path: o("/broadcasts/b-1/retry-failed") });

    await new FlowsResource(ctx).templates();
    expect(call()).toMatchObject({ method: "GET", path: o("/bot/flows/plantillas") });

    await new WabaResource(ctx).resubscribeWebhooks("w-1");
    expect(call()).toMatchObject({ method: "POST", path: o("/waba/w-1/webhooks/resubscribe") });

    await new DocumentsResource(ctx).editorConfig("d-1", { mode: "view" });
    expect(call()).toMatchObject({ method: "GET", path: o("/documents/d-1/editor-config") });
    expect(call().query.get("mode")).toBe("view");
  });
});

describe("phoneNumbers — endpoints nuevos", () => {
  it("update(color), service-usage, historial, impacto, coexistencia, reconnect", async () => {
    const { ctx, call, body } = setup();
    const r = new PhoneNumbersResource(ctx);

    await r.update("p-1", { color: "violet" });
    expect(call()).toMatchObject({ method: "PATCH", path: o("/phone-numbers/p-1") });
    expect(body()).toEqual({ color: "violet" });

    await r.serviceUsage();
    expect(call()).toMatchObject({ method: "GET", path: o("/phone-numbers/service-usage") });
    await r.connectionHistory("p-1");
    expect(call()).toMatchObject({
      method: "GET",
      path: o("/phone-numbers/p-1/historial-de-conexion"),
    });
    await r.archiveImpact("p-1");
    expect(call()).toMatchObject({
      method: "GET",
      path: o("/phone-numbers/p-1/impacto-al-archivar"),
    });
    await r.syncCoexistence("p-1");
    expect(call()).toMatchObject({
      method: "POST",
      path: o("/phone-numbers/p-1/coexistence/sync"),
    });
    await r.reconnect("p-1");
    expect(call()).toMatchObject({ method: "POST", path: o("/phone-numbers/p-1/reconnect") });
  });
});

describe("webChat / webChatPublic / linkPages", () => {
  it("avatar del canal", async () => {
    const { ctx, call } = setup();
    const r = new WebChatResource(ctx);
    await r.uploadAvatar("ch-1", { file: file(), filename: "a.png" });
    expect(call()).toMatchObject({ method: "POST", path: o("/web-chat/channels/ch-1/avatar") });
    await r.deleteAvatar("ch-1");
    expect(call()).toMatchObject({ method: "DELETE", path: o("/web-chat/channels/ch-1/avatar") });
  });

  it("públicos del widget: vapid, push, presence, client-error", async () => {
    const { ctx, call, body } = setup();
    const r = new WebChatPublicResource(ctx);

    await r.getVapidKey("tok");
    expect(call()).toMatchObject({ method: "GET", path: "/web-chat/tok/push/vapid" });
    expect(call().req.headers["x-api-key"]).toBeUndefined();

    const subscription = { endpoint: "https://push/x", keys: { p256dh: "k", auth: "a" } };
    await r.pushSubscribe("tok", { visitorJwt: "vjwt", subscription });
    expect(call()).toMatchObject({ method: "POST", path: "/web-chat/tok/push/subscribe" });
    expect(call().req.headers["authorization"]).toBe("Bearer vjwt");
    expect(body()).toEqual({ subscription });

    await r.pushUnsubscribe("tok", { visitorJwt: "vjwt", endpoint: "https://push/x" });
    expect(call()).toMatchObject({ method: "POST", path: "/web-chat/tok/push/unsubscribe" });
    expect(body()).toEqual({ endpoint: "https://push/x" });

    await r.presence("tok", { jwt: "vjwt", away: "1" });
    expect(call()).toMatchObject({ method: "POST", path: "/web-chat/tok/presence" });
    expect(body()).toEqual({ jwt: "vjwt", away: "1" });

    await r.reportClientError("tok", { message: "boom", kind: "error" });
    expect(call()).toMatchObject({ method: "POST", path: "/web-chat/tok/client-error" });
  });

  it("página pública de enlaces", async () => {
    const { ctx, call } = setup();
    const r = new LinkPagesResource(ctx);
    // Subidas: ya existían (el detector no ve la ruta con `${slot}`).
    await r.uploadAvatar("lp-1", { file: file(), filename: "a.png" });
    expect(call()).toMatchObject({ method: "POST", path: o("/link-pages/lp-1/avatar") });
    await r.uploadCover("lp-1", { file: file(), filename: "c.png" });
    expect(call()).toMatchObject({ method: "POST", path: o("/link-pages/lp-1/cover") });

    await r.publicProfile("mi-tienda");
    expect(call()).toMatchObject({ method: "GET", path: "/link-pages/p/mi-tienda" });
    expect(r.publicImagePath("mi-tienda", "avatar")).toBe("/link-pages/p/mi-tienda/avatar");
    expect(r.publicImagePath("mi-tienda", "cover")).toBe("/link-pages/p/mi-tienda/cover");
    expect(r.publicItemPath("mi-tienda", "it-1")).toBe("/link-pages/p/mi-tienda/go/it-1");
  });
});

describe("whatsappFlows (módulo nuevo)", () => {
  it("CRUD + sync/publish/deprecate/json", async () => {
    const { ctx, call, body } = setup();
    const r = new WhatsappFlowsResource(ctx);

    await r.list({ wabaId: "w-1" });
    expect(call()).toMatchObject({ method: "GET", path: o("/whatsapp-flows") });
    expect(call().query.get("wabaId")).toBe("w-1");

    await r.create({ wabaId: "w-1", name: "Registro", categories: ["SIGN_UP"] });
    expect(call()).toMatchObject({ method: "POST", path: o("/whatsapp-flows") });
    expect(body()).toEqual({ wabaId: "w-1", name: "Registro", categories: ["SIGN_UP"] });

    await r.sync("w-1");
    expect(call()).toMatchObject({ method: "POST", path: o("/whatsapp-flows/sync/w-1") });
    await r.get("f-1");
    expect(call()).toMatchObject({ method: "GET", path: o("/whatsapp-flows/f-1") });
    await r.updateJson("f-1", { flowJson: "{}" });
    expect(call()).toMatchObject({ method: "PATCH", path: o("/whatsapp-flows/f-1/json") });
    expect(body()).toEqual({ flowJson: "{}" });
    await r.update("f-1", { name: "Nuevo" });
    expect(call()).toMatchObject({ method: "PATCH", path: o("/whatsapp-flows/f-1") });
    await r.publish("f-1");
    expect(call()).toMatchObject({ method: "POST", path: o("/whatsapp-flows/f-1/publish") });
    await r.deprecate("f-1");
    expect(call()).toMatchObject({ method: "POST", path: o("/whatsapp-flows/f-1/deprecate") });
    await r.delete("f-1");
    expect(call()).toMatchObject({ method: "DELETE", path: o("/whatsapp-flows/f-1") });
  });
});

describe("whatsappGroups (módulo nuevo)", () => {
  it("grupos, enlace, participantes y solicitudes", async () => {
    const { ctx, call, body } = setup();
    const r = new WhatsappGroupsResource(ctx);

    await r.list({ phoneNumberId: "p-1" });
    expect(call()).toMatchObject({ method: "GET", path: o("/whatsapp-groups") });
    expect(call().query.get("phoneNumberId")).toBe("p-1");

    await r.create({
      phoneNumberId: "p-1",
      subject: "Clientes VIP",
      joinApprovalMode: "approval_required",
    });
    expect(call()).toMatchObject({ method: "POST", path: o("/whatsapp-groups") });
    expect(body()).toEqual({
      phoneNumberId: "p-1",
      subject: "Clientes VIP",
      joinApprovalMode: "approval_required",
    });

    await r.get("g-1");
    expect(call()).toMatchObject({ method: "GET", path: o("/whatsapp-groups/g-1") });
    await r.delete("g-1");
    expect(call()).toMatchObject({ method: "DELETE", path: o("/whatsapp-groups/g-1") });
    await r.getInviteLink("g-1");
    expect(call()).toMatchObject({ method: "GET", path: o("/whatsapp-groups/g-1/invite-link") });
    await r.resetInviteLink("g-1");
    expect(call()).toMatchObject({ method: "POST", path: o("/whatsapp-groups/g-1/invite-link") });
    await r.removeParticipants("g-1", { waIds: ["573000000000"] });
    expect(call()).toMatchObject({
      method: "DELETE",
      path: o("/whatsapp-groups/g-1/participants"),
    });
    expect(body()).toEqual({ waIds: ["573000000000"] });
    await r.listJoinRequests("g-1");
    expect(call()).toMatchObject({ method: "GET", path: o("/whatsapp-groups/g-1/join-requests") });
    await r.resolveJoinRequests("g-1", { joinRequestIds: ["jr-1"], accion: "aprobar" });
    expect(call()).toMatchObject({ method: "POST", path: o("/whatsapp-groups/g-1/join-requests") });
    expect(body()).toEqual({ joinRequestIds: ["jr-1"], accion: "aprobar" });
  });
});

describe("crm / deals — las rutas que el detector marcó ya existían", () => {
  it("ficha, duplicados, empresa, consultar-nit, oportunidad, inscritos, reportes", async () => {
    const { ctx, call } = setup();
    const crm = new CrmResource(ctx);
    const deals = new DealsResource(ctx);

    await crm.getProfile("ct-1");
    expect(call()).toMatchObject({ method: "GET", path: o("/crm/clientes/ct-1/ficha") });
    await crm.listDuplicates();
    expect(call()).toMatchObject({ method: "GET", path: o("/crm/duplicados") });
    await crm.getCompany("e-1");
    expect(call()).toMatchObject({ method: "GET", path: o("/crm/empresas/e-1") });
    await crm.lookupNit({ nit: "900123456" });
    expect(call()).toMatchObject({ method: "POST", path: o("/crm/empresas/consultar-nit") });
    await crm.customersReport();
    expect(call()).toMatchObject({ method: "GET", path: o("/crm/reportes/clientes") });
    await deals.get("op-1");
    expect(call()).toMatchObject({ method: "GET", path: o("/crm/oportunidades/op-1") });
    await deals.sequenceEnrollments("cd-1");
    expect(call()).toMatchObject({ method: "GET", path: o("/crm/cadencias/cd-1/inscritos") });
    await deals.report({ embudoId: "em-1" });
    expect(call()).toMatchObject({ method: "GET", path: o("/crm/reportes/embudo") });
  });
});

it("las URLs absolutas usan la base de la API", async () => {
  const { ctx, requests } = setup();
  await new TagsResource(ctx).update("t-1", { name: "x" });
  expect(requests[0]!.url.startsWith(BASE)).toBe(true);
});
