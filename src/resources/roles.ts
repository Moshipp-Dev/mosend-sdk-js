import type { Role } from "../types/identity.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class RolesResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Role[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Role[]>({
      method: "GET",
      path: `/organizations/${orgId}/roles`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
