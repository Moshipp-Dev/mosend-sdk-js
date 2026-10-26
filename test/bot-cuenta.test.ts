import { describe, expect, it } from "vitest";
import { createHttpClient } from "../src/core/http.js";
import type { ResourceContext } from "../src/resources/base.js";
import { AccountDeletionResource } from "../src/resources/accountDeletion.js";
import { AdCampaignsResource } from "../src/resources/adCampaigns.js";
import { AiCreditsResource } from "../src/resources/aiCredits.js";
import { AttendanceResource } from "../src/resources/attendance.js";
import { AuthResource } from "../src/resources/auth.js";
import { BillingResource } from "../src/resources/billing.js";
import { BotAgentsResource } from "../src/resources/botAgents.js";
import { BotImagesResource } from "../src/resources/botImages.js";
import { BotServicesResource } from "../src/resources/botServices.js";
import { BotSummaryResource } from "../src/resources/botSummary.js";
import { ConnectionTestResource } from "../src/resources/connectionTest.js";
import { ConnectorsResource } from "../src/resources/connectors.js";
import { DayOffResource } from "../src/resources/dayOff.js";
import { HealthResource } from "../src/resources/health.js";
import { InvitationsResource } from "../src/resources/invitations.js";
import { KnowledgeResource } from "../src/resources/knowledge.js";
import { MembershipsResource } from "../src/resources/memberships.js";
import { MessagingLimitResource } from "../src/resources/messagingLimit.js";
import { OAuthResource } from "../src/resources/oauth.js";
import { OrganizationsResource } from "../src/resources/organizations.js";
import { PushResource } from "../src/resources/push.js";
import { ReportsResource } from "../src/resources/reports.js";
import { ScheduleResource } from "../src/resources/schedule.js";
import { ShiftRemindersResource } from "../src/resources/shiftReminders.js";
import { SurveysResource } from "../src/resources/surveys.js";
import { UsersResource } from "../src/resources/users.js";
import { WabaUsageResource } from "../src/resources/wabaUsage.js";
import { WebhooksOutboundResource } from "../src/resources/webhooksOutbound.js";
import { createMockFetch, type RecordedRequest } from "./helpers/mockFetch.js";

const ORG = "org-1";
const O = `/organizations/${ORG}`;

function setup() {
  const { fetch, requests } = createMockFetch(() => ({ status: 200, body: { data: {} } }));
  const ctx: ResourceContext = {
    http: createHttpClient({ apiKey: "mk_live_abcd1234.secret", fetch }),
    defaultOrgId: ORG,
  };
  return { ctx, requests };
}

function pathOf(req: RecordedRequest): string {
  return new URL(req.url).pathname;
}

function queryOf(req: RecordedRequest): Record<string, string> {
  return Object.fromEntries(new URL(req.url).searchParams.entries());
}

type Case = [
  name: string,
  call: (ctx: ResourceContext) => Promise<unknown>,
  method: string,
  path: string,
  body?: unknown,
  query?: Record<string, string>,
];

const cases: Case[] = [
  // account-deletion
  ["accountDeletion.status", (c) => new AccountDeletionResource(c).status(), "GET", `${O}/deletion-request`],
  ["accountDeletion.request", (c) => new AccountDeletionResource(c).request({ confirmOrgName: "Acme", reason: "x" }), "POST", `${O}/deletion-request`, { confirmOrgName: "Acme", reason: "x" }],
  ["accountDeletion.cancel", (c) => new AccountDeletionResource(c).cancel(), "DELETE", `${O}/deletion-request`],
  // ad-campaigns
  ["adCampaigns.list", (c) => new AdCampaignsResource(c).list(), "GET", `${O}/ad-campaigns`],
  ["adCampaigns.update", (c) => new AdCampaignsResource(c).update("a1", { queOfrece: "Office", activo: true }), "PATCH", `${O}/ad-campaigns/a1`, { queOfrece: "Office", activo: true }],
  ["adCampaigns.porSeguir", (c) => new AdCampaignsResource(c).porSeguir("a1"), "GET", `${O}/ad-campaigns/a1/por-seguir`],
  // ai-credits
  ["aiCredits.publicPolicy", (c) => new AiCreditsResource(c).publicPolicy(), "GET", `/ai-credits/public-policy`],
  ["aiCredits.getPolicy", (c) => new AiCreditsResource(c).getPolicy(), "GET", `/admin/ai-credit-policy`],
  ["aiCredits.updatePolicy", (c) => new AiCreditsResource(c).updatePolicy({ signupCreditUsd: 1, rechargePacks: [{ amountUsd: 10, bonusUsd: 1 }] }), "PATCH", `/admin/ai-credit-policy`, { signupCreditUsd: 1, rechargePacks: [{ amountUsd: 10, bonusUsd: 1 }] }],
  ["aiCredits.adjust", (c) => new AiCreditsResource(c).adjust("o2", { amountUsd: 5, note: "bono" }), "POST", `/admin/organizations/o2/ai-credits/adjust`, { amountUsd: 5, note: "bono" }],
  // attendance
  ["attendance.periodPresets", (c) => new AttendanceResource(c).periodPresets(), "GET", `${O}/attendance/period-presets`],
  ["attendance.listWorkModes", (c) => new AttendanceResource(c).listWorkModes(), "GET", `${O}/attendance/work-modes`],
  ["attendance.setWorkMode", (c) => new AttendanceResource(c).setWorkMode("u1", { workMode: "HOURLY" }), "PATCH", `${O}/attendance/work-modes/u1`, { workMode: "HOURLY" }],
  // auth
  ["auth.listSessions", (c) => new AuthResource(c).listSessions(), "GET", `/auth/me/sessions`],
  ["auth.closeOtherSessions", (c) => new AuthResource(c).closeOtherSessions(), "DELETE", `/auth/me/sessions`],
  ["auth.closeSession", (c) => new AuthResource(c).closeSession("s1"), "DELETE", `/auth/me/sessions/s1`],
  ["auth.signupConfig", (c) => new AuthResource(c).signupConfig(), "GET", `/auth/signup/config`],
  ["auth.signupRequestCode", (c) => new AuthResource(c).signupRequestCode({ email: "a@b.co", password: "p", name: "A", phone: "573000000000" }), "POST", `/auth/signup/request-code`, { email: "a@b.co", password: "p", name: "A", phone: "573000000000" }],
  ["auth.signupResendCode", (c) => new AuthResource(c).signupResendCode({ email: "a@b.co", phone: "57300" }), "POST", `/auth/signup/resend-code`, { email: "a@b.co", phone: "57300" }],
  ["auth.signupVerifyCode", (c) => new AuthResource(c).signupVerifyCode({ email: "a@b.co", phone: "57300", code: "123456" }), "POST", `/auth/signup/verify-code`, { email: "a@b.co", phone: "57300", code: "123456" }],
  // billing
  ["billing.setInterval", (c) => new BillingResource(c).setInterval({ interval: "YEARLY" }), "PATCH", `${O}/billing/interval`, { interval: "YEARLY" }],
  // bot-agents + configurador + probador
  ["botAgents.list", (c) => new BotAgentsResource(c).list({ phoneNumberId: "p1" }), "GET", `${O}/bot/agents`, undefined, { phoneNumberId: "p1" }],
  ["botAgents.create", (c) => new BotAgentsResource(c).create({ name: "Ventas", enabledCapabilities: ["cotizar"] }), "POST", `${O}/bot/agents`, { name: "Ventas", enabledCapabilities: ["cotizar"] }],
  ["botAgents.capabilities", (c) => new BotAgentsResource(c).capabilities(), "GET", `${O}/bot/agents/capabilities`],
  ["botAgents.modelos", (c) => new BotAgentsResource(c).modelos(), "GET", `${O}/bot/agents/modelos`],
  ["botAgents.stats", (c) => new BotAgentsResource(c).stats({ dias: 7 }), "GET", `${O}/bot/agents/stats`, undefined, { dias: "7" }],
  ["botAgents.retrieve", (c) => new BotAgentsResource(c).retrieve("g1"), "GET", `${O}/bot/agents/g1`],
  ["botAgents.update", (c) => new BotAgentsResource(c).update("g1", { enabled: false }), "PATCH", `${O}/bot/agents/g1`, { enabled: false }],
  ["botAgents.delete", (c) => new BotAgentsResource(c).delete("g1"), "DELETE", `${O}/bot/agents/g1`],
  ["botAgents.configurador", (c) => new BotAgentsResource(c).configurador("g1", { mensajes: [{ rol: "user", texto: "hola" }] }), "POST", `${O}/bot/agents/g1/configurador`, { mensajes: [{ rol: "user", texto: "hola" }] }],
  ["botAgents.probador", (c) => new BotAgentsResource(c).probador("g1", { mensajes: [{ rol: "user", texto: "precio?" }], instrucciones: "x" }), "POST", `${O}/bot/agents/g1/probador`, { mensajes: [{ rol: "user", texto: "precio?" }], instrucciones: "x" }],
  // bot-images
  ["botImages.list", (c) => new BotImagesResource(c).list(), "GET", `${O}/bot/images`],
  ["botImages.update", (c) => new BotImagesResource(c).update("i1", { caption: "Promo" }), "PATCH", `${O}/bot/images/i1`, { caption: "Promo" }],
  ["botImages.delete", (c) => new BotImagesResource(c).delete("i1", { forzar: true }), "DELETE", `${O}/bot/images/i1`, undefined, { forzar: "true" }],
  // servicios
  ["botServices.list", (c) => new BotServicesResource(c).list(), "GET", `${O}/bot/servicios`],
  ["botServices.create", (c) => new BotServicesResource(c).create({ nombre: "Hosting", precios: [{ periodo: "anual", valorCents: 100 }] }), "POST", `${O}/bot/servicios`, { nombre: "Hosting", precios: [{ periodo: "anual", valorCents: 100 }] }],
  ["botServices.update", (c) => new BotServicesResource(c).update("s1", { activo: false }), "PATCH", `${O}/bot/servicios/s1`, { activo: false }],
  ["botServices.delete", (c) => new BotServicesResource(c).delete("s1"), "DELETE", `${O}/bot/servicios/s1`],
  // resumen + salud
  ["botSummary.summary", (c) => new BotSummaryResource(c).summary({ desde: "2026-10-01", hasta: "2026-10-07" }), "GET", `${O}/bot/resumen`, undefined, { desde: "2026-10-01", hasta: "2026-10-07" }],
  ["botSummary.daySpend", (c) => new BotSummaryResource(c).daySpend({ fecha: "2026-10-01" }), "GET", `${O}/bot/resumen/dia`, undefined, { fecha: "2026-10-01" }],
  ["botSummary.health", (c) => new BotSummaryResource(c).health({ dias: 3 }), "GET", `${O}/bot/salud`, undefined, { dias: "3" }],
  // conectores
  ["connectors.list", (c) => new ConnectorsResource(c).list(), "GET", `${O}/conectores`],
  ["connectors.create", (c) => new ConnectorsResource(c).create({ type: "WHMCS", name: "W", baseUrl: "https://w.co" }), "POST", `${O}/conectores`, { type: "WHMCS", name: "W", baseUrl: "https://w.co" }],
  ["connectors.catalog", (c) => new ConnectorsResource(c).catalog(), "GET", `${O}/conectores/catalogo`],
  ["connectors.update", (c) => new ConnectorsResource(c).update("k1", { enabled: false }), "PATCH", `${O}/conectores/k1`, { enabled: false }],
  ["connectors.delete", (c) => new ConnectorsResource(c).delete("k1"), "DELETE", `${O}/conectores/k1`],
  ["connectors.test", (c) => new ConnectorsResource(c).test("k1"), "POST", `${O}/conectores/k1/probar`],
  ["connectors.execute", (c) => new ConnectorsResource(c).execute("k1", { actionKey: "whmcs.cliente", params: { email: "a@b.co" } }), "POST", `${O}/conectores/k1/ejecutar`, { actionKey: "whmcs.cliente", params: { email: "a@b.co" } }],
  ["connectors.listApprovals", (c) => new ConnectorsResource(c).listApprovals(), "GET", `${O}/conectores/aprobaciones`],
  ["connectors.approve", (c) => new ConnectorsResource(c).approve("x1"), "POST", `${O}/conectores/aprobaciones/x1/aprobar`],
  ["connectors.reject", (c) => new ConnectorsResource(c).reject("x1"), "POST", `${O}/conectores/aprobaciones/x1/rechazar`],
  // day-off
  ["dayOff.listHolidays", (c) => new DayOffResource(c).listHolidays({ year: 2026 }), "GET", `${O}/attendance/holidays`, undefined, { year: "2026" }],
  ["dayOff.upsertHolidays", (c) => new DayOffResource(c).upsertHolidays({ items: [{ date: "2026-12-25", name: "Navidad" }] }), "POST", `${O}/attendance/holidays`, { items: [{ date: "2026-12-25", name: "Navidad" }] }],
  ["dayOff.seedHolidays", (c) => new DayOffResource(c).seedHolidays({ year: 2027, country: "CO" }), "POST", `${O}/attendance/holidays/seed`, undefined, { year: "2027", country: "CO" }],
  ["dayOff.deleteHoliday", (c) => new DayOffResource(c).deleteHoliday("h1"), "DELETE", `${O}/attendance/holidays/h1`],
  ["dayOff.listLeaves", (c) => new DayOffResource(c).listLeaves({ from: "2026-10-01", to: "2026-10-31", agentId: "u1" }), "GET", `${O}/attendance/leaves`, undefined, { from: "2026-10-01", to: "2026-10-31", agentId: "u1" }],
  ["dayOff.createLeave", (c) => new DayOffResource(c).createLeave({ agentUserId: "u1", type: "VACATION", startDate: "2026-11-01", endDate: "2026-11-05" }), "POST", `${O}/attendance/leaves`, { agentUserId: "u1", type: "VACATION", startDate: "2026-11-01", endDate: "2026-11-05" }],
  ["dayOff.deleteLeave", (c) => new DayOffResource(c).deleteLeave("l1"), "DELETE", `${O}/attendance/leaves/l1`],
  // health
  ["health.status", (c) => new HealthResource(c).status(), "GET", `/health`],
  // invitations
  ["invitations.lookup", (c) => new InvitationsResource(c).lookup("tok"), "GET", `/invitations/lookup`, undefined, { token: "tok" }],
  ["invitations.activateLookup", (c) => new InvitationsResource(c).activateLookup("tok"), "GET", `/invitations/activate-lookup`, undefined, { token: "tok" }],
  ["invitations.acceptSignup", (c) => new InvitationsResource(c).acceptSignup({ token: "t", name: "A", password: "p" }), "POST", `/invitations/accept-signup`, { token: "t", name: "A", password: "p" }],
  ["invitations.activate", (c) => new InvitationsResource(c).activate({ token: "t", password: "p" }), "POST", `/invitations/activate`, { token: "t", password: "p" }],
  ["invitations.bulk", (c) => new InvitationsResource(c).bulk({ emails: ["a@b.co"], roleId: "r1" }), "POST", `${O}/invitations/bulk`, { emails: ["a@b.co"], roleId: "r1" }],
  ["invitations.preregister", (c) => new InvitationsResource(c).preregister({ members: [{ email: "a@b.co" }], roleId: "r1" }), "POST", `${O}/invitations/preregister`, { members: [{ email: "a@b.co" }], roleId: "r1" }],
  ["invitations.reactivate", (c) => new InvitationsResource(c).reactivate("m1", { notify: true }), "POST", `${O}/invitations/activation/m1`, { notify: true }],
  ["invitations.link", (c) => new InvitationsResource(c).link("i1"), "POST", `${O}/invitations/i1/link`],
  // knowledge
  ["knowledge.insights", (c) => new KnowledgeResource(c).insights({ dias: 30 }), "GET", `${O}/bot/knowledge/insights`, undefined, { dias: "30" }],
  ["knowledge.search", (c) => new KnowledgeResource(c).search({ query: "precio", topK: 3 }), "POST", `${O}/bot/knowledge/search`, { query: "precio", topK: 3 }],
  ["knowledge.createNote", (c) => new KnowledgeResource(c).createNote({ title: "T", content: "C", compartido: true }), "POST", `${O}/bot/knowledge/notes`, { title: "T", content: "C", compartido: true }],
  ["knowledge.updateNote", (c) => new KnowledgeResource(c).updateNote("d1", { content: "C2" }), "PATCH", `${O}/bot/knowledge/notes/d1`, { content: "C2" }],
  ["knowledge.createFromUrl", (c) => new KnowledgeResource(c).createFromUrl({ url: "https://x.co", syncEveryHours: 24 }), "POST", `${O}/bot/knowledge/url`, { url: "https://x.co", syncEveryHours: 24 }],
  ["knowledge.updateAgents", (c) => new KnowledgeResource(c).updateAgents("d1", { agentIds: ["g1"], compartido: false }), "PATCH", `${O}/bot/knowledge/d1/agentes`, { agentIds: ["g1"], compartido: false }],
  // limite-de-mensajes
  ["messagingLimit.retrieve", (c) => new MessagingLimitResource(c).retrieve({ phoneNumberId: "p1" }), "GET", `${O}/messaging-limit`, undefined, { phoneNumberId: "p1" }],
  // memberships
  ["memberships.updateMyPreferences", (c) => new MembershipsResource(c).updateMyPreferences({ contactPanelDefaultTab: "notes" }), "PATCH", `${O}/memberships/me/preferences`, { contactPanelDefaultTab: "notes" }],
  ["memberships.setSuspension", (c) => new MembershipsResource(c).setSuspension("m1", { suspended: true, reason: "x" }), "PATCH", `${O}/memberships/m1/suspension`, { suspended: true, reason: "x" }],
  // oauth (consent + grants + public)
  ["oauth.getRequest", (c) => new OAuthResource(c).getRequest("q1"), "GET", `/oauth/requests/q1`],
  ["oauth.decide", (c) => new OAuthResource(c).decide("q1", { approve: true, organizationId: ORG }), "POST", `/oauth/requests/q1/decision`, { approve: true, organizationId: ORG }],
  ["oauth.userinfo", (c) => new OAuthResource(c).userinfo(), "GET", `/oauth/userinfo`],
  ["oauth.listGrants", (c) => new OAuthResource(c).listGrants(), "GET", `${O}/oauth/grants`],
  ["oauth.revokeGrant", (c) => new OAuthResource(c).revokeGrant("gr1"), "DELETE", `${O}/oauth/grants/gr1`],
  ["oauth.authorize", (c) => new OAuthResource(c).authorize({ response_type: "code", client_id: "c", redirect_uri: "https://a.co/cb", scope: "contacts:read", state: "s", code_challenge: "x", code_challenge_method: "S256" }), "GET", `/oauth/authorize`, undefined, { response_type: "code", client_id: "c", redirect_uri: "https://a.co/cb", scope: "contacts:read", state: "s", code_challenge: "x", code_challenge_method: "S256" }],
  ["oauth.token", (c) => new OAuthResource(c).token({ grant_type: "refresh_token", refresh_token: "mor_x", client_id: "c" }), "POST", `/oauth/token`, { grant_type: "refresh_token", refresh_token: "mor_x", client_id: "c" }],
  ["oauth.revoke", (c) => new OAuthResource(c).revoke({ token: "mot_x", client_id: "c" }), "POST", `/oauth/revoke`, { token: "mot_x", client_id: "c" }],
  ["oauth.introspect", (c) => new OAuthResource(c).introspect({ token: "mot_x", token_type_hint: "access_token" }), "POST", `/oauth/introspect`, { token: "mot_x", token_type_hint: "access_token" }],
  ["oauth.metadata", (c) => new OAuthResource(c).metadata(), "GET", `/.well-known/oauth-authorization-server`],
  ["oauth.metadataAlias", (c) => new OAuthResource(c).metadataAlias(), "GET", `/oauth/metadata`],
  // organizations
  ["organizations.quota", (c) => new OrganizationsResource(c).quota(), "GET", `/organizations/quota`],
  ["organizations.suspension", (c) => new OrganizationsResource(c).suspension("o9"), "GET", `/organizations/o9/suspension`],
  ["organizations.billingGroup", (c) => new OrganizationsResource(c).billingGroup(), "GET", `${O}/billing-group`],
  ["organizations.linkBillingGroup", (c) => new OrganizationsResource(c).linkBillingGroup({ parentOrgId: "p0" }), "POST", `${O}/billing-group/link`, { parentOrgId: "p0" }],
  ["organizations.unlinkBillingGroup", (c) => new OrganizationsResource(c).unlinkBillingGroup(), "POST", `${O}/billing-group/unlink`],
  ["organizations.setAiLimits", (c) => new OrganizationsResource(c).setAiLimits("o2", { dailyUsd: 1, monthlyUsd: 20 }), "PATCH", `${O}/billing-group/o2/ai-limits`, { dailyUsd: 1, monthlyUsd: 20 }],
  // prueba-de-conexion
  ["connectionTest.start", (c) => new ConnectionTestResource(c).start("p1"), "POST", `${O}/phone-numbers/p1/prueba-de-conexion`],
  ["connectionTest.status", (c) => new ConnectionTestResource(c).status("p1", "ABC123"), "GET", `${O}/phone-numbers/p1/prueba-de-conexion/ABC123`],
  // push
  ["push.registerDevice", (c) => new PushResource(c).registerDevice({ token: "fcm", platform: "ANDROID" }), "POST", `/push/device`, { token: "fcm", platform: "ANDROID" }],
  ["push.unregisterDevice", (c) => new PushResource(c).unregisterDevice({ token: "fcm" }), "DELETE", `/push/device`, { token: "fcm" }],
  // reports
  ["reports.channelsSummary", (c) => new ReportsResource(c).channelsSummary(), "GET", `${O}/reports/channels-summary`],
  ["reports.portada", (c) => new ReportsResource(c).portada({ dias: 7 }), "GET", `${O}/reports/portada`, undefined, { dias: "7" }],
  ["reports.teamSeries", (c) => new ReportsResource(c).teamSeries({ granularity: "day", compare: true, channel: "WEB" }), "GET", `${O}/reports/team/series`, undefined, { granularity: "day", compare: "true", channel: "WEB" }],
  ["reports.ventas", (c) => new ReportsResource(c).ventas({ agrupar: "semana", moneda: "COP" }), "GET", `${O}/reports/ventas`, undefined, { agrupar: "semana", moneda: "COP" }],
  // schedule
  ["schedule.myUpcoming", (c) => new ScheduleResource(c).myUpcoming({ semana: 1 }), "GET", `${O}/attendance/my-schedule/proximos`, undefined, { semana: "1" }],
  // shift-reminders
  ["shiftReminders.test", (c) => new ShiftRemindersResource(c).test(), "POST", `${O}/shift-reminders/test`],
  // surveys
  ["surveys.getConfig", (c) => new SurveysResource(c).getConfig(), "GET", `${O}/surveys/config`],
  ["surveys.updateConfig", (c) => new SurveysResource(c).updateConfig({ active: true, audience: "HUMAN" }), "PATCH", `${O}/surveys/config`, { active: true, audience: "HUMAN" }],
  ["surveys.results", (c) => new SurveysResource(c).results({ dias: 30 }), "GET", `${O}/surveys/results`, undefined, { dias: "30" }],
  // users
  ["users.requestPhoneCode", (c) => new UsersResource(c).requestPhoneCode(), "POST", `/users/me/phone/request-code`],
  ["users.verifyPhoneCode", (c) => new UsersResource(c).verifyPhoneCode({ code: "123456" }), "POST", `/users/me/phone/verify-code`, { code: "123456" }],
  // uso-por-waba
  ["wabaUsage.list", (c) => new WabaUsageResource(c).list({ days: 30 }), "GET", `/admin/wabas/uso`, undefined, { days: "30" }],
  ["wabaUsage.detail", (c) => new WabaUsageResource(c).detail("w1", { desde: "2026-10-01" }), "GET", `/admin/wabas/w1/detalle`, undefined, { desde: "2026-10-01" }],
  // webhooks-outbound
  ["webhooksOutbound.sendTest", (c) => new WebhooksOutboundResource(c).sendTest("h1"), "POST", `${O}/webhooks-outbound/h1/test`],
];

describe("bot y cuenta — método, ruta y cuerpo contra el backend", () => {
  it.each(cases)("%s", async (_name, call, method, path, body, query) => {
    const { ctx, requests } = setup();
    await call(ctx);
    const req = requests[0]!;
    expect(req.method).toBe(method);
    expect(pathOf(req)).toBe(path);
    if (body !== undefined) expect(JSON.parse(req.body!)).toEqual(body);
    if (query !== undefined) expect(queryOf(req)).toEqual(query);
  });

  it("botImages.upload → multipart con file, label y caption", async () => {
    const { ctx, requests } = setup();
    await new BotImagesResource(ctx).upload({
      file: new Blob(["x"], { type: "image/png" }),
      filename: "promo.png",
      label: "Promo",
      caption: "Hoy",
    });
    const req = requests[0]!;
    expect(req.method).toBe("POST");
    expect(pathOf(req)).toBe(`${O}/bot/images`);
    expect(req.formData).toMatchObject({ label: "Promo", caption: "Hoy" });
    expect(req.formData!["file"]).toContain("promo.png");
  });

  it("los endpoints públicos de OAuth y del registro no mandan la API key", async () => {
    const { ctx, requests } = setup();
    await new OAuthResource(ctx).token({ grant_type: "authorization_code", code: "c", code_verifier: "v" });
    await new AuthResource(ctx).signupVerifyCode({ email: "a@b.co", phone: "1", code: "1" });
    for (const req of requests) {
      expect(req.headers["x-api-key"]).toBeUndefined();
      expect(req.headers["authorization"]).toBeUndefined();
    }
  });

  it("acepta orgId por llamada en lugar del default", async () => {
    const { ctx, requests } = setup();
    await new BotAgentsResource(ctx).list({ orgId: "otra" });
    await new DayOffResource(ctx).createLeave({ orgId: "otra", agentUserId: "u", type: "SICK", startDate: "2026-01-01", endDate: "2026-01-02" });
    expect(pathOf(requests[0]!)).toBe(`/organizations/otra/bot/agents`);
    expect(pathOf(requests[1]!)).toBe(`/organizations/otra/attendance/leaves`);
    expect(JSON.parse(requests[1]!.body!)).not.toHaveProperty("orgId");
  });
});
