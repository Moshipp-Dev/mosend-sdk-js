import type {
  CreateWebChatSessionInput,
  LinkEmailInput,
  SendWebChatPublicMessageInput,
  WebChatMessage,
  WebChatPublicSession,
} from "../types/webChat.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { MosendValidationError } from "../core/errors.js";

export class WebChatPublicResource extends Resource {
  async createSession(
    token: string,
    input: CreateWebChatSessionInput = {},
    options?: RequestOptions,
  ): Promise<WebChatPublicSession> {
    const res = await this.http.request<WebChatPublicSession>({
      method: "POST",
      path: `/web-chat/${token}/sessions`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async resendOtp(token: string, input: { email: string }, options?: RequestOptions): Promise<void> {
    await this.http.request<unknown>({
      method: "POST",
      path: `/web-chat/${token}/sessions/resend-otp`,
      body: input,
      ...(options ? { options } : {}),
    });
  }

  async history(
    token: string,
    query: { sessionToken?: string; limit?: number; before?: string } = {},
    options?: RequestOptions,
  ): Promise<WebChatMessage[]> {
    const res = await this.http.request<WebChatMessage[]>({
      method: "GET",
      path: `/web-chat/${token}/history`,
      query: query as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async linkEmail(
    token: string,
    input: LinkEmailInput,
    options?: RequestOptions,
  ): Promise<WebChatPublicSession> {
    const res = await this.http.request<WebChatPublicSession>({
      method: "POST",
      path: `/web-chat/${token}/sessions/link-email`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async upload(
    token: string,
    input: { file: Blob | File; filename?: string },
    options?: RequestOptions,
  ): Promise<{ mediaId: string; url: string; mimeType?: string }> {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError("FormData is not available in this runtime.");
    }
    const form = new FormData();
    const filename = input.filename ?? (input.file as File).name ?? "attachment";
    form.append("file", input.file, filename);
    const res = await this.http.request<{ mediaId: string; url: string; mimeType?: string }>({
      method: "POST",
      path: `/web-chat/${token}/upload`,
      body: form,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async sendMessage(
    token: string,
    input: SendWebChatPublicMessageInput,
    options?: RequestOptions,
  ): Promise<WebChatMessage> {
    const res = await this.http.request<WebChatMessage>({
      method: "POST",
      path: `/web-chat/${token}/messages`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
