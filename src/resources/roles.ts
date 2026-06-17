import type { CreateRoleInput, Role, UpdateRoleInput } from "../types/identity.js";
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

  async create(input: CreateRoleInput & { orgId?: string }, options?: RequestOptions): Promise<Role> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Role>({
      method: "POST",
      path: `/organizations/${orgId}/roles`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    roleId: string,
    input: UpdateRoleInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Role> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Role>({
      method: "PATCH",
      path: `/organizations/${orgId}/roles/${roleId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Reemplaza el set completo de permisos del rol. */
  async setPermissions(
    roleId: string,
    input: { permissions: string[]; orgId?: string },
    options?: RequestOptions,
  ): Promise<Role> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Role>({
      method: "PUT",
      path: `/organizations/${orgId}/roles/${roleId}/permissions`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(roleId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/roles/${roleId}`,
      ...(options ? { options } : {}),
    });
  }
}
