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

/** Los endpoints con VisitorJwtGuard leen el JWT del visitante en `Authorization`. */
function withVisitorJwt(options: RequestOptions | undefined, visitorJwt: string): RequestOptions {
  return {
    ...options,
    headers: { ...options?.headers, Authorization: `Bearer ${visitorJwt}` },
  };
}

export class WebChatPublicResource extends Resource {
  async createSession(
    token: string,
    input: CreateWebChatSessionInput,
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

  /** Clave VAPID pública para Web Push (cadena vacía si el push está apagado). */
  async getVapidKey(token: string, options?: RequestOptions): Promise<{ vapidPublicKey: string }> {
    const res = await this.http.request<{ vapidPublicKey: string }>({
      method: "GET",
      path: `/web-chat/${token}/push/vapid`,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /**
   * Registra la suscripción Web Push del visitante. Requiere el JWT del
   * visitante (el que devuelve `createSession`).
   */
  async pushSubscribe(
    token: string,
    input: {
      visitorJwt: string;
      subscription: { endpoint: string; keys: { p256dh: string; auth: string } };
    },
    options?: RequestOptions,
  ): Promise<{ ok: boolean }> {
    const { visitorJwt, ...body } = input;
    const res = await this.http.request<{ ok: boolean }>({
      method: "POST",
      path: `/web-chat/${token}/push/subscribe`,
      body,
      skipAuth: true,
      options: withVisitorJwt(options, visitorJwt),
    });
    return res.data;
  }

  /** Elimina la suscripción Web Push del visitante (por `endpoint`). */
  async pushUnsubscribe(
    token: string,
    input: { visitorJwt: string; endpoint: string },
    options?: RequestOptions,
  ): Promise<{ ok: boolean }> {
    const { visitorJwt, ...body } = input;
    const res = await this.http.request<{ ok: boolean }>({
      method: "POST",
      path: `/web-chat/${token}/push/unsubscribe`,
      body,
      skipAuth: true,
      options: withVisitorJwt(options, visitorJwt),
    });
    return res.data;
  }

  /**
   * Presencia del visitante: `away: "1"` lo marca fuera de línea al instante,
   * `"0"` en línea. El JWT del visitante va en el cuerpo (como en sendBeacon).
   */
  async presence(
    token: string,
    input: { jwt: string; away: "0" | "1" },
    options?: RequestOptions,
  ): Promise<{ ok: boolean }> {
    const res = await this.http.request<{ ok: boolean }>({
      method: "POST",
      path: `/web-chat/${token}/presence`,
      body: input,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Reporta un error de ejecución del widget. */
  async reportClientError(
    token: string,
    input: { message: string; stack?: string; url?: string; kind?: string },
    options?: RequestOptions,
  ): Promise<{ ok: boolean }> {
    const res = await this.http.request<{ ok: boolean }>({
      method: "POST",
      path: `/web-chat/${token}/client-error`,
      body: input,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
