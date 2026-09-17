import { describe, expect, it } from "vitest";
import {
  computeWebhookSignature,
  parseWebhookEvent,
  verifyWebhookSignature,
} from "../src/core/webhooks.js";
import { MosendWebhookSignatureError } from "../src/core/errors.js";

const SECRET = "whsec_test_super_secret";

describe("webhooks", () => {
  // El sobre real que manda el backend: `{ type, organizationId, data,
  // timestamp }`. No hay `deliveryId`: se deduplica por el id del recurso.
  const body = JSON.stringify({
    type: "message.new",
    organizationId: "org-1",
    data: { conversationId: "c1", messageId: "m1", direction: "IN" },
    timestamp: "2026-05-01T03:42:18.123Z",
  });

  it("computes a stable HMAC SHA-256 signature", () => {
    const sig1 = computeWebhookSignature(body, SECRET);
    const sig2 = computeWebhookSignature(body, SECRET);
    expect(sig1).toBe(sig2);
    expect(sig1.startsWith("sha256=")).toBe(true);
    expect(sig1.length).toBeGreaterThan("sha256=".length + 32);
  });

  it("verifies a correct signature", () => {
    const sig = computeWebhookSignature(body, SECRET);
    expect(verifyWebhookSignature(body, sig, SECRET)).toBe(true);
  });

  it("rejects a tampered body", () => {
    const sig = computeWebhookSignature(body, SECRET);
    const tampered = body.replace("message.new", "message.status");
    expect(verifyWebhookSignature(tampered, sig, SECRET)).toBe(false);
  });

  it("rejects wrong secret", () => {
    const sig = computeWebhookSignature(body, SECRET);
    expect(verifyWebhookSignature(body, sig, "different_secret")).toBe(false);
  });

  it("rejects missing signature", () => {
    expect(verifyWebhookSignature(body, null, SECRET)).toBe(false);
    expect(verifyWebhookSignature(body, "", SECRET)).toBe(false);
  });

  it("parseWebhookEvent returns the typed event when valid", () => {
    const sig = computeWebhookSignature(body, SECRET);
    const event = parseWebhookEvent(body, sig, SECRET);
    expect(event.type).toBe("message.new");
    expect(event.organizationId).toBe("org-1");
    expect((event.data as { messageId: string }).messageId).toBe("m1");
  });

  it("parseWebhookEvent throws MosendWebhookSignatureError on invalid signature", () => {
    expect(() => parseWebhookEvent(body, "sha256=bad", SECRET)).toThrow(MosendWebhookSignatureError);
  });
});
