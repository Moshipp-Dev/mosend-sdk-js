import type {
  EditMessageInput,
  Message,
  SendCarouselInput,
  SendFlowInput,
  SendInteractiveInput,
  SendMessageInput,
  SendProductInput,
} from "../types/messaging.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { MosendValidationError } from "../core/errors.js";

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

  /**
   * Sube un adjunto y devuelve su `mediaId` para usar luego en
   * `messages.send({ type, payload: { id: mediaId } })`.
   */
  async upload(
    input: { file: Blob | File; phoneNumberId: string; filename?: string; orgId?: string },
    options?: RequestOptions,
  ): Promise<{ mediaId: string; mimeType: string; filename: string; size: number }> {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError("FormData is not available in this runtime.");
    }
    const orgId = this.requireOrgId(input.orgId);
    const form = new FormData();
    const filename = input.filename ?? (input.file as File).name ?? "attachment";
    form.append("file", input.file, filename);
    const res = await this.http.request<{
      mediaId: string;
      mimeType: string;
      filename: string;
      size: number;
    }>({
      method: "POST",
      path: `/organizations/${orgId}/messages/upload`,
      query: { phoneNumberId: input.phoneNumberId },
      body: form,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  private async post<T>(
    ruta: string,
    input: { orgId?: string } & object,
    options?: RequestOptions,
  ): Promise<T> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<T>({
      method: "POST",
      path: `/organizations/${orgId}/messages${ruta}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Mensaje de servicio interactivo: lista, botón CTA URL, pedir ubicación o datos de contacto. */
  sendInteractive(input: SendInteractiveInput & MessageScope, options?: RequestOptions): Promise<Message> {
    return this.post<Message>("/interactive", input, options);
  }

  /** Mensaje de producto de WhatsApp Commerce (uno, varios o el catálogo). */
  sendProduct(input: SendProductInput & MessageScope, options?: RequestOptions): Promise<Message> {
    return this.post<Message>("/product", input, options);
  }

  /** Mensaje de WhatsApp Flow (formulario nativo). */
  sendFlow(input: SendFlowInput & MessageScope, options?: RequestOptions): Promise<Message> {
    return this.post<Message>("/flow", input, options);
  }

  /** Carrusel multimedia interactivo (hasta 10 tarjetas). */
  sendCarousel(input: SendCarouselInput & MessageScope, options?: RequestOptions): Promise<Message> {
    return this.post<Message>("/carousel", input, options);
  }

  /** Muestra el contenido de un mensaje que el cliente eliminó. */
  async reveal(
    messageId: string,
    scope: MessageScope = {},
    options?: RequestOptions,
  ): Promise<{
    id: string;
    type: string;
    payload: unknown;
    transcript?: string | null;
    deletedAt?: string | null;
  }> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<{
      id: string;
      type: string;
      payload: unknown;
      transcript?: string | null;
      deletedAt?: string | null;
    }>({
      method: "POST",
      path: `/organizations/${orgId}/messages/${messageId}/revelar`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
