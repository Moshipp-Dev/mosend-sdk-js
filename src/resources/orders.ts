import type { UpdateWhatsAppOrderStatusInput, WhatsAppOrder } from "../types/orders.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/orders` — pedidos recibidos por el carrito de WhatsApp. */
export class OrdersResource extends Resource {
  /** Pedido asociado a un mensaje del inbox; `null` si el mensaje no trae pedido. */
  async getByMessage(
    messageId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<WhatsAppOrder | null> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<WhatsAppOrder | null>({
      method: "GET",
      path: `/organizations/${orgId}/orders/by-message/${messageId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async updateStatus(
    orderId: string,
    input: UpdateWhatsAppOrderStatusInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<WhatsAppOrder> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<WhatsAppOrder>({
      method: "PATCH",
      path: `/organizations/${orgId}/orders/${orderId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
