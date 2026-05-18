import type { CreateTagInput, Tag } from "../types/messaging.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class TagsResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Tag[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Tag[]>({
      method: "GET",
      path: `/organizations/${orgId}/tags`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(
    input: CreateTagInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Tag> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Tag>({
      method: "POST",
      path: `/organizations/${orgId}/tags`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/tags/${id}`,
      ...(options ? { options } : {}),
    });
  }
}
