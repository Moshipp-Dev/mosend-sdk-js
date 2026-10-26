import type { RequestDeletionInput } from "../types/account.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/deletion-request` — eliminación de la organización con 30 días de gracia. */
export class AccountDeletionResource extends Resource {
  /** Estado de la solicitud (cualquier miembro). */
  async status(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/deletion-request`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Solicita la eliminación (solo owner). */
  async request(input: RequestDeletionInput & { orgId?: string }, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/deletion-request`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Cancela la eliminación durante el periodo de gracia (solo owner). */
  async cancel(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/deletion-request`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
