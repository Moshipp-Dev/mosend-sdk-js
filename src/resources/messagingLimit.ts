import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/messaging-limit` — límite diario de mensajes de Meta por portafolio. */
export class MessagingLimitResource extends Resource {
  /**
   * Nivel, clientes contactados con plantilla en 24 h, disponibles y avisos de
   * Meta de los últimos 30 días. Con `phoneNumberId`, además el portafolio de ese número.
   */
  async retrieve(query: { phoneNumberId?: string; orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/messaging-limit`,
      query: rest,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
