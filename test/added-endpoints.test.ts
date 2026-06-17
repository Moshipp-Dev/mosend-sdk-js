import { describe, expect, it } from "vitest";
import { MosendClient } from "../src/index.js";
import { createMockFetch } from "./helpers/mockFetch.js";

const ORG_ID = "11111111-1111-1111-1111-111111111111";
const API_KEY = "mk_live_abcd1234.secret";

function client() {
  const { fetch, requests } = createMockFetch(() => ({
    status: 200,
    body: { data: {}, timestamp: "" },
  }));
  const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
  return { mosend, requests };
}

describe("endpoints agregados — paths verificados vs backend", () => {
  it("tasks.create → POST .../tasks", async () => {
    const { mosend, requests } = client();
    await mosend.tasks.create({ contactId: "c-1", title: "Llamar", dueAt: "2026-07-01" });
    expect(requests[0]!.method).toBe("POST");
    expect(requests[0]!.url.endsWith(`/organizations/${ORG_ID}/tasks`)).toBe(true);
  });

  it("tasks.setCompleted → PATCH .../tasks/:id/complete", async () => {
    const { mosend, requests } = client();
    await mosend.tasks.setCompleted("t-1", { completed: true });
    expect(requests[0]!.method).toBe("PATCH");
    expect(requests[0]!.url.endsWith(`/tasks/t-1/complete`)).toBe(true);
    expect(JSON.parse(requests[0]!.body!)).toEqual({ completed: true });
  });

  it("aiCredits.summary → GET .../ai-credits/summary", async () => {
    const { mosend, requests } = client();
    await mosend.aiCredits.summary();
    expect(requests[0]!.url.endsWith(`/ai-credits/summary`)).toBe(true);
  });

  it("systemNotices.active → GET /system-notices/active (global)", async () => {
    const { fetch, requests } = createMockFetch(() => ({ status: 200, body: { data: [] } }));
    const mosend = new MosendClient({ apiKey: API_KEY, fetch });
    await mosend.systemNotices.active();
    expect(requests[0]!.url).toBe("https://api.mosend.dev/system-notices/active");
  });

  it("phoneNumbers.create → POST .../phone-numbers", async () => {
    const { mosend, requests } = client();
    await mosend.phoneNumbers.create({ wabaId: "w-1", cc: "57", phoneNumber: "3000000000", verifiedName: "Tienda" });
    expect(requests[0]!.method).toBe("POST");
    expect(requests[0]!.url.endsWith(`/phone-numbers`)).toBe(true);
  });

  it("phoneNumbers.requestRegistrationCode → POST .../registration/request-code", async () => {
    const { mosend, requests } = client();
    await mosend.phoneNumbers.requestRegistrationCode("p-1", { method: "SMS" });
    expect(requests[0]!.url.endsWith(`/phone-numbers/p-1/registration/request-code`)).toBe(true);
    expect(JSON.parse(requests[0]!.body!)).toEqual({ method: "SMS" });
  });

  it("templates.create → POST .../templates", async () => {
    const { mosend, requests } = client();
    await mosend.templates.create({
      wabaId: "w-1",
      name: "promo",
      language: "es",
      category: "MARKETING",
      components: [{ type: "BODY", text: "Hola {{1}}" }],
    });
    expect(requests[0]!.method).toBe("POST");
    expect(requests[0]!.url.endsWith(`/templates`)).toBe(true);
  });

  it("roles.setPermissions → PUT .../roles/:id/permissions", async () => {
    const { mosend, requests } = client();
    await mosend.roles.setPermissions("r-1", { permissions: ["messages:send"] });
    expect(requests[0]!.method).toBe("PUT");
    expect(requests[0]!.url.endsWith(`/roles/r-1/permissions`)).toBe(true);
  });

  it("apiKeys.update → PATCH .../api-keys/:id", async () => {
    const { mosend, requests } = client();
    await mosend.apiKeys.update("k-1", { name: "CI" });
    expect(requests[0]!.method).toBe("PATCH");
    expect(requests[0]!.url.endsWith(`/api-keys/k-1`)).toBe(true);
  });

  it("webhooksOutbound.update + getSecret", async () => {
    const { mosend, requests } = client();
    await mosend.webhooksOutbound.update("wh-1", { active: false });
    await mosend.webhooksOutbound.getSecret("wh-1");
    expect(requests[0]!.method).toBe("PATCH");
    expect(requests[0]!.url.endsWith(`/webhooks-outbound/wh-1`)).toBe(true);
    expect(requests[1]!.url.endsWith(`/webhooks-outbound/wh-1/secret`)).toBe(true);
  });

  it("push.rotate → POST /push/rotate", async () => {
    const { mosend, requests } = client();
    await mosend.push.rotate({ oldEndpoint: "a", endpoint: "b", p256dh: "k", auth: "x" });
    expect(requests[0]!.url.endsWith(`/push/rotate`)).toBe(true);
  });

  it("contacts.addNote → POST .../contacts/:id/notes", async () => {
    const { mosend, requests } = client();
    await mosend.contacts.addNote("c-1", { body: "VIP", pinned: true });
    expect(requests[0]!.method).toBe("POST");
    expect(requests[0]!.url.endsWith(`/contacts/c-1/notes`)).toBe(true);
  });

  it("conversations.categorize → PATCH .../conversations/:id/categorize", async () => {
    const { mosend, requests } = client();
    await mosend.conversations.categorize("conv-1", { category: "SALE" });
    expect(requests[0]!.method).toBe("PATCH");
    expect(requests[0]!.url.endsWith(`/conversations/conv-1/categorize`)).toBe(true);
  });

  it("contactLists.removeMember → DELETE .../members/:contactId", async () => {
    const { mosend, requests } = client();
    await mosend.contactLists.removeMember("l-1", "c-9");
    expect(requests[0]!.method).toBe("DELETE");
    expect(requests[0]!.url.endsWith(`/contact-lists/l-1/members/c-9`)).toBe(true);
  });

  it("broadcasts.recipients → GET .../broadcasts/:id/recipients", async () => {
    const { fetch, requests } = createMockFetch(() => ({
      status: 200,
      body: { data: { data: [], pageInfo: { endCursor: null, hasNextPage: false } } },
    }));
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    await mosend.broadcasts.recipients("b-1", { filter: "failed" });
    expect(requests[0]!.url).toContain(`/broadcasts/b-1/recipients`);
    expect(requests[0]!.url).toContain("filter=failed");
  });

  it("messages.upload → multipart POST .../messages/upload?phoneNumberId", async () => {
    const { fetch, requests } = createMockFetch(() => ({
      status: 200,
      body: { data: { mediaId: "m-1", mimeType: "image/png", filename: "a.png", size: 10 } },
    }));
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    const file = new Blob(["x"], { type: "image/png" });
    await mosend.messages.upload({ file, phoneNumberId: "p-1", filename: "a.png" });
    expect(requests[0]!.method).toBe("POST");
    expect(requests[0]!.url).toContain(`/messages/upload`);
    expect(requests[0]!.url).toContain("phoneNumberId=p-1");
    expect(requests[0]!.formData!["file"]).toContain("a.png");
  });

  it("orgAiProviders.effective → GET .../bot/ai-providers/effective", async () => {
    const { fetch, requests } = createMockFetch(() => ({ status: 200, body: { data: [] } }));
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    await mosend.orgAiProviders.effective();
    expect(requests[0]!.url.endsWith(`/bot/ai-providers/effective`)).toBe(true);
  });

  it("auth.verifyEmail → POST /auth/verify-email", async () => {
    const { fetch, requests } = createMockFetch(() => ({ status: 200, body: { data: { ok: true } } }));
    const mosend = new MosendClient({ fetch });
    await mosend.auth.verifyEmail({ token: "tok" });
    expect(requests[0]!.url.endsWith(`/auth/verify-email`)).toBe(true);
  });

  it("reports.updateTeamGoals → PATCH .../reports/team/goals", async () => {
    const { mosend, requests } = client();
    await mosend.reports.updateTeamGoals({ weeklyMessagesOut: 500 });
    expect(requests[0]!.method).toBe("PATCH");
    expect(requests[0]!.url.endsWith(`/reports/team/goals`)).toBe(true);
  });
});
