import { describe, expect, it } from "vitest";
import { MosendClient } from "../src/index.js";
import {
  MosendAuthError,
  MosendBadRequestError,
  MosendNotFoundError,
  MosendRateLimitError,
  MosendValidationError,
} from "../src/core/errors.js";
import { createMockFetch } from "./helpers/mockFetch.js";

const ORG_ID = "11111111-1111-1111-1111-111111111111";
const API_KEY = "mk_live_abcd1234.secret-32-bytes";

describe("MosendClient — messages.send", () => {
  it("sends a text message with correct path, auth header and envelope unwrap", async () => {
    const { fetch, requests } = createMockFetch(() => ({
      status: 200,
      body: {
        data: {
          id: "msg-1",
          conversationId: "conv-1",
          phoneNumberId: "phone-1",
          to: "+573000000000",
          direction: "OUT",
          type: "text",
          status: "sent",
          payload: { body: "hi" },
          createdAt: "2026-05-01T00:00:00Z",
          updatedAt: "2026-05-01T00:00:00Z",
        },
        timestamp: "2026-05-01T00:00:00Z",
      },
    }));

    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    const msg = await mosend.messages.send(
      {
        phoneNumberId: "phone-1",
        to: "+573000000000",
        type: "text",
        payload: { body: "hi" },
      },
      { idempotencyKey: "idem-1" },
    );

    expect(msg.id).toBe("msg-1");
    expect(requests).toHaveLength(1);
    const req = requests[0]!;
    expect(req.method).toBe("POST");
    expect(req.url).toBe(`https://api.mosend.dev/organizations/${ORG_ID}/messages`);
    expect(req.headers["x-api-key"]).toBe(API_KEY);
    expect(req.headers["content-type"]).toBe("application/json");
    expect(req.headers["idempotency-key"]).toBe("idem-1");
    expect(JSON.parse(req.body!)).toEqual({
      phoneNumberId: "phone-1",
      to: "+573000000000",
      type: "text",
      payload: { body: "hi" },
    });
  });

  it("throws MosendValidationError when orgId is missing", async () => {
    const { fetch } = createMockFetch(() => ({ status: 200, body: { data: {}, timestamp: "" } }));
    const mosend = new MosendClient({ apiKey: API_KEY, fetch });
    await expect(
      mosend.messages.send({
        phoneNumberId: "phone-1",
        to: "+573000000000",
        type: "text",
        payload: { body: "hi" },
      }),
    ).rejects.toBeInstanceOf(MosendValidationError);
  });

  it("maps 400 to MosendBadRequestError with parsed body", async () => {
    const { fetch } = createMockFetch(() => ({
      status: 400,
      body: {
        statusCode: 400,
        error: "Bad Request",
        message: "phoneNumberId must be a UUID",
        path: "/organizations/x/messages",
      },
    }));
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    const promise = mosend.messages.send({
      phoneNumberId: "not-a-uuid",
      to: "+573000000000",
      type: "text",
      payload: { body: "hi" },
    });
    await expect(promise).rejects.toBeInstanceOf(MosendBadRequestError);
    await promise.catch((err: MosendBadRequestError) => {
      expect(err.status).toBe(400);
      expect(err.message).toBe("phoneNumberId must be a UUID");
      expect(err.code).toBe("Bad Request");
    });
  });

  it("maps 401 → MosendAuthError, 404 → MosendNotFoundError", async () => {
    const { fetch } = createMockFetch((req) => {
      if (req.method === "POST") {
        return { status: 401, body: { statusCode: 401, error: "Unauthorized", message: "bad token" } };
      }
      return { status: 404, body: { statusCode: 404, error: "Not Found", message: "no such message" } };
    });
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    await expect(
      mosend.messages.send({
        phoneNumberId: "p",
        to: "+57",
        type: "text",
        payload: { body: "hi" },
      }),
    ).rejects.toBeInstanceOf(MosendAuthError);
    await expect(mosend.messages.getMedia("m-1")).rejects.toBeInstanceOf(MosendNotFoundError);
  });

  it("maps 429 to MosendRateLimitError with retryAfter from headers", async () => {
    const { fetch } = createMockFetch(() => ({
      status: 429,
      headers: { "retry-after": "7", "x-ratelimit-reset": "7" },
      body: { statusCode: 429, error: "Too Many Requests", message: "slow down" },
    }));
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    const promise = mosend.contacts.list();
    await expect(promise).rejects.toBeInstanceOf(MosendRateLimitError);
    await promise.catch((err: MosendRateLimitError) => {
      expect(err.retryAfterSec).toBe(7);
    });
  });
});

describe("MosendClient — broadcasts", () => {
  it("creates a broadcast and sends it", async () => {
    const { fetch, requests } = createMockFetch((req) => {
      if (req.method === "POST" && req.url.endsWith("/broadcasts")) {
        return {
          status: 200,
          body: {
            data: {
              id: "bc-1",
              name: "promo",
              status: "DRAFT",
              phoneNumberId: "phone-1",
              templateId: "t-1",
              templateLanguage: "es_CO",
              totalRecipients: 0,
              sentCount: 0,
              failedCount: 0,
              createdAt: "2026-05-01T00:00:00Z",
            },
            timestamp: "2026-05-01T00:00:00Z",
          },
        };
      }
      if (req.method === "POST" && req.url.includes("/broadcasts/bc-1/send")) {
        return { status: 200, body: { data: { sent: 198, failed: 2, total: 200 }, timestamp: "" } };
      }
      return { status: 404, body: { statusCode: 404, error: "Not Found", message: "x" } };
    });
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    const bc = await mosend.broadcasts.create({
      name: "promo",
      phoneNumberId: "phone-1",
      templateId: "t-1",
      templateLanguage: "es_CO",
      listId: "list-1",
    });
    expect(bc.id).toBe("bc-1");
    const result = await mosend.broadcasts.send(bc.id);
    expect(result.sent).toBe(198);
    expect(requests).toHaveLength(2);
  });
});

describe("MosendClient — pagination iterate", () => {
  it("iterates across multiple pages until hasNextPage is false", async () => {
    let calls = 0;
    const { fetch } = createMockFetch(() => {
      calls += 1;
      if (calls === 1) {
        return {
          status: 200,
          body: {
            data: {
              data: [{ id: "c1" }, { id: "c2" }],
              pageInfo: { endCursor: "cur-1", hasNextPage: true },
            },
            timestamp: "",
          },
        };
      }
      return {
        status: 200,
        body: {
          data: {
            data: [{ id: "c3" }],
            pageInfo: { endCursor: null, hasNextPage: false },
          },
          timestamp: "",
        },
      };
    });
    const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
    const ids: string[] = [];
    for await (const contact of mosend.contacts.iterate({ limit: 2 })) {
      ids.push(contact.id);
    }
    expect(ids).toEqual(["c1", "c2", "c3"]);
    expect(calls).toBe(2);
  });
});
