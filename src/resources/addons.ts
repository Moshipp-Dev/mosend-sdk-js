import type { Addon, AddonChangeInput, AddonPreview } from "../types/billing.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class AddonsResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Addon[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Addon[]>({
      method: "GET",
      path: `/organizations/${orgId}/billing/addons`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async preview(
    input: AddonChangeInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<AddonPreview> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AddonPreview>({
      method: "POST",
      path: `/organizations/${orgId}/billing/addons/preview`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    input: AddonChangeInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Addon[]> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Addon[]>({
      method: "PATCH",
      path: `/organizations/${orgId}/billing/addons`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
