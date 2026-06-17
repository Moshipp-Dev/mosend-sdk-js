import type {
  CreateWebChatChannelInput,
  UpdateWebChatChannelInput,
  SendWebChatMessageInput,
  WebChatChannel,
  WebChatIdentitySecret,
  WebChatSnippet,
} from "../types/webChat.js";
import type { Message } from "../types/messaging.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { MosendValidationError } from "../core/errors.js";

export class WebChatResource extends Resource {
  async listChannels(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<WebChatChannel[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<WebChatChannel[]>({
      method: "GET",
      path: `/organizations/${orgId}/web-chat/channels`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async createChannel(
    input: CreateWebChatChannelInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<WebChatChannel> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<WebChatChannel>({
      method: "POST",
      path: `/organizations/${orgId}/web-chat/channels`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async updateChannel(
    id: string,
    input: UpdateWebChatChannelInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<WebChatChannel> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<WebChatChannel>({
      method: "PATCH",
      path: `/organizations/${orgId}/web-chat/channels/${id}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async deleteChannel(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/web-chat/channels/${id}`,
      ...(options ? { options } : {}),
    });
  }

  async getSnippet(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<WebChatSnippet> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<WebChatSnippet>({
      method: "GET",
      path: `/organizations/${orgId}/web-chat/channels/${id}/snippet`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async generateIdentitySecret(
    id: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<WebChatIdentitySecret> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<WebChatIdentitySecret>({
      method: "POST",
      path: `/organizations/${orgId}/web-chat/channels/${id}/identity-secret`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async revokeIdentitySecret(
    id: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/web-chat/channels/${id}/identity-secret`,
      ...(options ? { options } : {}),
    });
  }

  async sendToConversation(
    conversationId: string,
    input: SendWebChatMessageInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Message> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Message>({
      method: "POST",
      path: `/organizations/${orgId}/conversations/${conversationId}/web-chat/send`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async uploadMedia(
    conversationId: string,
    input: { file: Blob | File; filename?: string; orgId?: string },
    options?: RequestOptions,
  ): Promise<{ mediaId: string; url: string; mimeType?: string }> {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError("FormData is not available in this runtime.");
    }
    const orgId = this.requireOrgId(input.orgId);
    const form = new FormData();
    const filename = input.filename ?? (input.file as File).name ?? "attachment";
    form.append("file", input.file, filename);
    const res = await this.http.request<{ mediaId: string; url: string; mimeType?: string }>({
      method: "POST",
      path: `/organizations/${orgId}/conversations/${conversationId}/web-chat/media`,
      body: form,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
