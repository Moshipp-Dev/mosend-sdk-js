import { describe, expect, it } from "vitest";
import { MosendClient } from "../src/index.js";
import { createMockFetch } from "./helpers/mockFetch.js";

const ORG_ID = "11111111-1111-1111-1111-111111111111";
const API_KEY = "mk_live_abcd1234.secret";

describe("bot resources", () => {
  it("botConfig.upsert uses PUT /bot/config/:phoneId with body", async () => {
    const { fetch, requests } = createMockFetch(() => ({
      status: 200,
      body: {
        data: {
          id: "cfg-1",
          phoneNumberId: "phone-1",
          mode: "AI_AGENT",
          systemPrompt: "you are kind",
          createdAt: "2026-05-01T00:00:00Z",
          updatedAt: "2026-05-01T00:00:00Z",
        },
        timestamp: "",
      },
    }));
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    const cfg = await mosend.botConfig.upsert("phone-1", {
      mode: "AI_AGENT",
      aiSystemPrompt: "you are kind",
    });
    expect(cfg.mode).toBe("AI_AGENT");
    expect(requests).toHaveLength(1);
    expect(requests[0]!.method).toBe("PUT");
    expect(requests[0]!.url).toBe(
      `https://api.mosend.dev/organizations/${ORG_ID}/bot/config/phone-1`,
    );
    expect(JSON.parse(requests[0]!.body!)).toEqual({
      mode: "AI_AGENT",
      aiSystemPrompt: "you are kind",
    });
  });

  it("botConfig.toggle uses PATCH .../toggle", async () => {
    const { fetch, requests } = createMockFetch(() => ({
      status: 200,
      body: { data: { id: "cfg-1", mode: "OFF", phoneNumberId: "phone-1", createdAt: "", updatedAt: "" } },
    }));
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    await mosend.botConfig.toggle("phone-1");
    expect(requests[0]!.method).toBe("PATCH");
    expect(requests[0]!.url.endsWith(`/bot/config/phone-1/toggle`)).toBe(true);
  });

  it("autoReplies.create uses POST /bot/auto-replies", async () => {
    const { fetch, requests } = createMockFetch(() => ({
      status: 200,
      body: {
        data: {
          id: "ar-1",
          name: "Precio",
          trigger: "KEYWORD",
          keywords: ["precio"],
          actionType: "SEND_TEXT",
          textBody: "ver mosend.dev/precios",
          createdAt: "",
          updatedAt: "",
        },
      },
    }));
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    const ar = await mosend.autoReplies.create({
      name: "Precio",
      trigger: "KEYWORD",
      keywords: ["precio"],
      actionType: "SEND_TEXT",
      textBody: "ver mosend.dev/precios",
    });
    expect(ar.id).toBe("ar-1");
    expect(requests[0]!.url.endsWith(`/bot/auto-replies`)).toBe(true);
  });

  it("flows.publish, unpublish, duplicate use POST with correct sub-paths", async () => {
    const calls: string[] = [];
    const { fetch } = createMockFetch((req) => {
      calls.push(req.url);
      return {
        status: 200,
        body: { data: { id: "f-1", name: "x", steps: [], createdAt: "", updatedAt: "" } },
      };
    });
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    await mosend.flows.publish("f-1");
    await mosend.flows.unpublish("f-1");
    await mosend.flows.duplicate("f-1");
    expect(calls[0]!.endsWith(`/bot/flows/f-1/publish`)).toBe(true);
    expect(calls[1]!.endsWith(`/bot/flows/f-1/unpublish`)).toBe(true);
    expect(calls[2]!.endsWith(`/bot/flows/f-1/duplicate`)).toBe(true);
  });

  it("orgAiProviders.upsert hits PUT /bot/ai-providers/:provider", async () => {
    const { fetch, requests } = createMockFetch(() => ({
      status: 200,
      body: { data: { provider: "openai", configured: true } },
    }));
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    await mosend.orgAiProviders.upsert("openai", { apiKey: "sk-test" });
    expect(requests[0]!.method).toBe("PUT");
    expect(requests[0]!.url.endsWith(`/bot/ai-providers/openai`)).toBe(true);
    expect(JSON.parse(requests[0]!.body!)).toEqual({ apiKey: "sk-test" });
  });

  it("conversations.requestHandoff hits POST .../request-handoff", async () => {
    const { fetch, requests } = createMockFetch(() => ({
      status: 200,
      body: { data: { id: "c-1", status: "OPEN" } },
    }));
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    await mosend.conversations.requestHandoff("c-1");
    expect(requests[0]!.method).toBe("POST");
    expect(requests[0]!.url.endsWith(`/conversations/c-1/request-handoff`)).toBe(true);
  });

  it("knowledge.upload sends multipart/form-data with file/title/tags", async () => {
    const { fetch, requests } = createMockFetch(() => ({
      status: 200,
      body: {
        data: {
          id: "kd-1",
          title: "Guía",
          filename: "guia.txt",
          mimeType: "text/plain",
          sizeBytes: 5,
          tags: ["soporte"],
          status: "PROCESSING",
          createdAt: "",
          updatedAt: "",
        },
      },
    }));
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    const file = new Blob(["hello"], { type: "text/plain" });
    const doc = await mosend.knowledge.upload({
      file,
      filename: "guia.txt",
      title: "Guía",
      tags: ["soporte"],
    });
    expect(doc.id).toBe("kd-1");
    const req = requests[0]!;
    expect(req.method).toBe("POST");
    expect(req.url.endsWith(`/bot/knowledge`)).toBe(true);
    expect(req.formData).not.toBeNull();
    expect(req.formData!["title"]).toBe("Guía");
    expect(req.formData!["tags"]).toBe("soporte");
    expect(req.formData!["file"]).toContain("guia.txt");
  });

  it("knowledge.reprocess hits POST .../reprocess", async () => {
    const { fetch, requests } = createMockFetch(() => ({
      status: 200,
      body: {
        data: {
          id: "kd-1",
          title: "x",
          filename: "x",
          mimeType: "text/plain",
          sizeBytes: 1,
          tags: [],
          status: "PROCESSING",
          createdAt: "",
          updatedAt: "",
        },
      },
    }));
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    await mosend.knowledge.reprocess("kd-1");
    expect(requests[0]!.method).toBe("POST");
    expect(requests[0]!.url.endsWith(`/bot/knowledge/kd-1/reprocess`)).toBe(true);
  });
});
