import { describe, expect, it } from "vitest";
import {
  computeWebhookSignature,
  parseWebhookEvent,
  verifyWebhookSignature,
} from "../src/core/webhooks.js";
import { MosendWebhookSignatureError } from "../src/core/errors.js";

const SECRET = "whsec_test_super_secret";

describe("webhooks", () => {
  const body = JSON.stringify({
    event: "message.new",
    deliveryId: "0d6f2c9e",
    organizationId: "org-1",
    occurredAt: "2026-05-01T03:42:18.123Z",
    data: { conversationId: "c1", message: { id: "m1" } },
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
    expect(event.event).toBe("message.new");
    expect(event.deliveryId).toBe("0d6f2c9e");
  });

  it("parseWebhookEvent throws MosendWebhookSignatureError on invalid signature", () => {
    expect(() => parseWebhookEvent(body, "sha256=bad", SECRET)).toThrow(MosendWebhookSignatureError);
  });
});
