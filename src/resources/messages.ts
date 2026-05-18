import type { Message, EditMessageInput, SendMessageInput } from "../types/messaging.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export interface MessageScope {
  orgId?: string;
}

export class MessagesResource extends Resource {
  async send(input: SendMessageInput & MessageScope, options?: RequestOptions): Promise<Message> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Message>({
      method: "POST",
      path: `/organizations/${orgId}/messages`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async edit(
    messageId: string,
    input: EditMessageInput & MessageScope,
    options?: RequestOptions,
  ): Promise<Message> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Message>({
      method: "PATCH",
      path: `/organizations/${orgId}/messages/${messageId}/edit`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(messageId: string, scope: MessageScope = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/messages/${messageId}`,
      ...(options ? { options } : {}),
    });
  }

  async restore(messageId: string, scope: MessageScope = {}, options?: RequestOptions): Promise<Message> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Message>({
      method: "POST",
      path: `/organizations/${orgId}/messages/${messageId}/restore`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async getMedia(messageId: string, scope: MessageScope = {}, options?: RequestOptions): Promise<{ url: string; mimeType?: string }> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<{ url: string; mimeType?: string }>({
      method: "GET",
      path: `/organizations/${orgId}/messages/${messageId}/media`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
