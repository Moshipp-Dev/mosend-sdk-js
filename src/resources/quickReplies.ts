import type { CreateQuickReplyInput, QuickReply, UpdateQuickReplyInput } from "../types/messaging.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class QuickRepliesResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<QuickReply[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<QuickReply[]>({
      method: "GET",
      path: `/organizations/${orgId}/quick-replies`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(
    input: CreateQuickReplyInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<QuickReply> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<QuickReply>({
      method: "POST",
      path: `/organizations/${orgId}/quick-replies`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateQuickReplyInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<QuickReply> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<QuickReply>({
      method: "PATCH",
      path: `/organizations/${orgId}/quick-replies/${id}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/quick-replies/${id}`,
      ...(options ? { options } : {}),
    });
  }

  async markUsed(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<QuickReply> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<QuickReply>({
      method: "POST",
      path: `/organizations/${orgId}/quick-replies/${id}/use`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
