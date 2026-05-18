import type { AutoReply, CreateAutoReplyInput, UpdateAutoReplyInput } from "../types/bot.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export interface ListAutoRepliesQuery {
  orgId?: string;
  phoneNumberId?: string;
}

export class AutoRepliesResource extends Resource {
  async list(query: ListAutoRepliesQuery = {}, options?: RequestOptions): Promise<AutoReply[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AutoReply[]>({
      method: "GET",
      path: `/organizations/${orgId}/bot/auto-replies`,
      query: rest as Record<string, string | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(
    input: CreateAutoReplyInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<AutoReply> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AutoReply>({
      method: "POST",
      path: `/organizations/${orgId}/bot/auto-replies`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateAutoReplyInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<AutoReply> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AutoReply>({
      method: "PATCH",
      path: `/organizations/${orgId}/bot/auto-replies/${id}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/bot/auto-replies/${id}`,
      ...(options ? { options } : {}),
    });
  }
}
