import type { Membership, SetRoleInput, SetWabaScopeInput } from "../types/identity.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class MembershipsResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Membership[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Membership[]>({
      method: "GET",
      path: `/organizations/${orgId}/memberships`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async me(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Membership> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Membership>({
      method: "GET",
      path: `/organizations/${orgId}/memberships/me`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async setRole(
    id: string,
    input: SetRoleInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Membership> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Membership>({
      method: "PATCH",
      path: `/organizations/${orgId}/memberships/${id}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async setWabaScope(
    id: string,
    input: SetWabaScopeInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Membership> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Membership>({
      method: "PUT",
      path: `/organizations/${orgId}/memberships/${id}/waba-scope`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async remove(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/memberships/${id}`,
      ...(options ? { options } : {}),
    });
  }
}
