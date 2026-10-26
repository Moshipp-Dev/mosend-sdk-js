import type { ServicioDelBot, ServicioInput } from "../types/botAgents.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/bot/servicios` — catálogo de servicios que el bot puede citar. */
export class BotServicesResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<ServicioDelBot[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<ServicioDelBot[]>({
      method: "GET",
      path: `/organizations/${orgId}/bot/servicios`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(input: ServicioInput & { orgId?: string }, options?: RequestOptions): Promise<ServicioDelBot> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<ServicioDelBot>({
      method: "POST",
      path: `/organizations/${orgId}/bot/servicios`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    id: string,
    input: ServicioInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<ServicioDelBot> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<ServicioDelBot>({
      method: "PATCH",
      path: `/organizations/${orgId}/bot/servicios/${id}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<void>({
      method: "DELETE",
      path: `/organizations/${orgId}/bot/servicios/${id}`,
      ...(options ? { options } : {}),
    });
  }
}
