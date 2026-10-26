import type { GatewayWebhookAck, WompiEvent } from "../types/payments.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/**
 * `/webhooks/wompi` — webhook de eventos de Wompi (cobro a cliente final).
 * Público: lo llama Wompi de servidor a servidor y la firma va dentro del
 * evento. Sirve para reenviar a Mosend un evento recibido en otro lado (p. ej.
 * una tienda). Responde 200 aunque el evento se descarte.
 */
export class WompiResource extends Resource {
  async webhook(event: WompiEvent, options?: RequestOptions): Promise<GatewayWebhookAck> {
    const res = await this.http.request<GatewayWebhookAck>({
      method: "POST",
      path: "/webhooks/wompi",
      body: event,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** URL propia de cada organización (`/webhooks/wompi/:orgId`). */
  async webhookForOrg(
    event: WompiEvent,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<GatewayWebhookAck> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<GatewayWebhookAck>({
      method: "POST",
      path: `/webhooks/wompi/${orgId}`,
      body: event,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
