import { describe, expect, it } from "vitest";
import { MosendClient } from "../src/index.js";
import { createMockFetch } from "./helpers/mockFetch.js";

const ORG_ID = "11111111-1111-1111-1111-111111111111";
const API_KEY = "mk_live_abcd1234.secret";

function clientWithRecorder() {
  const { fetch, requests } = createMockFetch(() => ({
    status: 200,
    body: { data: {}, timestamp: "" },
  }));
  const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
  return { mosend, requests };
}

describe("identity resources — base paths verified vs developer.mosend.dev", () => {
  it("users.me → GET /users/me", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.users.me();
    expect(requests[0]!.url.endsWith("/users/me")).toBe(true);
    expect(requests[0]!.method).toBe("GET");
  });

  it("organizations.create → POST /organizations", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.organizations.create({ name: "Acme", slug: "acme" });
    expect(requests[0]!.url.endsWith("/organizations")).toBe(true);
  });

  it("memberships.setWabaScope → PUT .../waba-scope", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.memberships.setWabaScope("m-1", { wabaIds: [] });
    expect(requests[0]!.method).toBe("PUT");
    expect(requests[0]!.url.endsWith(`/memberships/m-1/waba-scope`)).toBe(true);
  });

  it("permissions.list → GET /permissions (no orgId)", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.permissions.list();
    expect(requests[0]!.url.endsWith("/permissions")).toBe(true);
  });

  it("invitations.accept → POST /invitations/accept (root path)", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.invitations.accept({ token: "inv-token" });
    expect(requests[0]!.url.endsWith("/invitations/accept")).toBe(true);
  });

  it("twoFactor.enroll → POST /two-factor/enroll", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.twoFactor.enroll();
    expect(requests[0]!.url.endsWith("/two-factor/enroll")).toBe(true);
  });

  it("passkeys.loginOptions → POST /auth/passkey/login/options (public)", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.passkeys.loginOptions({ email: "x@x.com" });
    expect(requests[0]!.url.endsWith("/auth/passkey/login/options")).toBe(true);
  });
});

describe("messaging resources", () => {
  it("conversations.list → GET .../conversations with query", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.conversations.list({ unreadOnly: true, take: 10 });
    const req = requests[0]!;
    expect(req.method).toBe("GET");
    expect(req.url).toContain(`/organizations/${ORG_ID}/conversations`);
    expect(req.url).toContain("unreadOnly=true");
    expect(req.url).toContain("take=10");
  });

  it("conversations.addTag → POST .../conversations/:id/tags", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.conversations.addTag("c-1", { tagId: "t-1" });
    expect(requests[0]!.method).toBe("POST");
    expect(requests[0]!.url.endsWith(`/conversations/c-1/tags`)).toBe(true);
  });

  it("reactions.set → PUT .../messages/:messageId/reactions", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.reactions.set("msg-1", { emoji: "🎉" });
    expect(requests[0]!.method).toBe("PUT");
    expect(requests[0]!.url.endsWith(`/messages/msg-1/reactions`)).toBe(true);
    expect(JSON.parse(requests[0]!.body!)).toEqual({ emoji: "🎉" });
  });

  it("optIns are nested under contact", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.optIns.create("contact-1", { type: "IN", source: "website" });
    expect(requests[0]!.url.endsWith(`/contacts/contact-1/opt-ins`)).toBe(true);
  });

  it("whatsappLinks.qr → GET .../whatsapp-links/:id/qr", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.whatsappLinks.qr("wl-1");
    expect(requests[0]!.url.endsWith(`/whatsapp-links/wl-1/qr`)).toBe(true);
  });
});

describe("waba + webChat resources", () => {
  it("waba.purge → DELETE .../waba/:id/purge", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.waba.purge("waba-1");
    expect(requests[0]!.method).toBe("DELETE");
    expect(requests[0]!.url.endsWith(`/waba/waba-1/purge`)).toBe(true);
  });

  it("profiles.update lives under phone-numbers/:phoneId/profile", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.profiles.update("phone-1", { about: "We sell things" });
    expect(requests[0]!.method).toBe("PUT");
    expect(requests[0]!.url.endsWith(`/phone-numbers/phone-1/profile`)).toBe(true);
  });

  it("webChat.sendToConversation → POST .../conversations/:id/web-chat/send", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.webChat.sendToConversation("conv-1", {
      phoneNumberId: "p-1",
      to: "+573000000000",
      type: "text",
      payload: { body: "hola" },
    });
    expect(requests[0]!.url.endsWith(`/conversations/conv-1/web-chat/send`)).toBe(true);
  });

  it("webChatPublic.createSession uses /web-chat/:token (public)", async () => {
    const { fetch, requests } = createMockFetch(() => ({
      status: 200,
      body: { data: { sessionToken: "s-1", visitorId: "v-1", expiresAt: "" } },
    }));
    const mosend = new MosendClient({ fetch });
    await mosend.webChatPublic.createSession("ch-token", { email: "u@x.com" });
    expect(requests[0]!.url.endsWith(`/web-chat/ch-token/sessions`)).toBe(true);
  });
});

describe("billing resources", () => {
  it("plans.list is public (GET /plans)", async () => {
    const { fetch, requests } = createMockFetch(() => ({ status: 200, body: { data: [] } }));
    const mosend = new MosendClient({ fetch });
    await mosend.plans.list();
    expect(requests[0]!.url).toBe("https://api.mosend.dev/plans");
  });

  it("plans.previewChange → POST /plans/organizations/:orgId/preview-change", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.plans.previewChange({ toPlanSlug: "pro" });
    expect(requests[0]!.url.endsWith(`/plans/organizations/${ORG_ID}/preview-change`)).toBe(true);
  });

  it("walletAlerts → /billing/alert-settings (NOT /wallet-alerts)", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.walletAlerts.retrieve();
    expect(requests[0]!.url.endsWith(`/billing/alert-settings`)).toBe(true);
    expect(requests[0]!.url).not.toContain("wallet-alerts");
  });

  it("creditNotes is under /admin/credit-notes (no orgId path)", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.creditNotes.list({ limit: 5 });
    expect(requests[0]!.url).toContain("/admin/credit-notes");
    expect(requests[0]!.url).not.toContain("/organizations/");
  });

  it("mercadoPago.rechargeWallet → POST .../wallet/recharge", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.mercadoPago.rechargeWallet({ amount: 100 });
    expect(requests[0]!.method).toBe("POST");
    expect(requests[0]!.url.endsWith(`/wallet/recharge`)).toBe(true);
  });

  it("paymentMethods.setDefault → POST .../payment-methods/:id/default", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.paymentMethods.setDefault("pm-1");
    expect(requests[0]!.url.endsWith(`/payment-methods/pm-1/default`)).toBe(true);
  });
});

describe("otros resources", () => {
  it("health.live is public (GET /health/live)", async () => {
    const { fetch, requests } = createMockFetch(() => ({ status: 200, body: { data: { status: "ok" } } }));
    const mosend = new MosendClient({ fetch });
    await mosend.health.live();
    expect(requests[0]!.url).toBe("https://api.mosend.dev/health/live");
  });

  it("audit.list supports cursor/limit pagination", async () => {
    const { fetch, requests } = createMockFetch(() => ({
      status: 200,
      body: { data: { data: [], pageInfo: { endCursor: null, hasNextPage: false } } },
    }));
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    await mosend.audit.list({ cursor: "abc", limit: 50, action: "user.login" });
    expect(requests[0]!.url).toContain("cursor=abc");
    expect(requests[0]!.url).toContain("limit=50");
    expect(requests[0]!.url).toContain("action=user.login");
  });

  it("leads.create → POST /public/leads (no auth needed)", async () => {
    const { fetch, requests } = createMockFetch(() => ({ status: 200, body: { data: { id: "l-1" } } }));
    const mosend = new MosendClient({ fetch });
    await mosend.leads.create({ email: "lead@x.com", name: "Lead" });
    expect(requests[0]!.url).toBe("https://api.mosend.dev/public/leads");
  });

  it("integrations.uninstall → DELETE .../integrations/catalog/:id", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.integrations.uninstall("zapier");
    expect(requests[0]!.method).toBe("DELETE");
    expect(requests[0]!.url.endsWith(`/integrations/catalog/zapier`)).toBe(true);
  });

  it("push.subscribe → POST /push/subscribe (no orgId)", async () => {
    const { mosend, requests } = clientWithRecorder();
    await mosend.push.subscribe({
      endpoint: "https://example.com",
      p256dh: "k",
      auth: "a",
    });
    expect(requests[0]!.url.endsWith(`/push/subscribe`)).toBe(true);
  });
});

describe("MosendClient surface", () => {
  it("exposes all 57 resources as properties", () => {
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID });
    const expected = [
      "addons", "aiCredits", "apiKeys", "audit", "auth", "autoReplies", "billing",
      "botConfig", "botEvents", "broadcasts", "contactLists", "contacts",
      "conversations", "creditNotes", "flows", "health",
      "integrations", "invitations", "invoices", "knowledge", "leads",
      "media", "memberships", "mercadoPago", "messages", "notifications",
      "optIns", "orgAiProviders", "organizations", "passkeys", "paymentMethods",
      "permissions", "phoneNumbers", "planLimits", "plans", "pricing",
      "profiles", "push", "quickReplies", "reactions", "reports", "roles",
      "stickers", "systemNotices", "tags", "tasks", "templates", "twoFactor", "usage", "users",
      "waba", "wallet", "walletAlerts", "webChat", "webChatPublic",
      "webhooksOutbound", "whatsappLinks",
    ];
    for (const key of expected) {
      expect((mosend as unknown as Record<string, unknown>)[key]).toBeDefined();
    }
    expect(expected).toHaveLength(57);
  });
});
