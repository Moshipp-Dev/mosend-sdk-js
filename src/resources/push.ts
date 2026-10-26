import type { PushConfig, PushSubscriptionInput, PushSubscriptionRecord } from "../types/misc.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import type { RegisterDeviceInput } from "../types/account.js";

export class PushResource extends Resource {
  async config(options?: RequestOptions): Promise<PushConfig> {
    const res = await this.http.request<PushConfig>({
      method: "GET",
      path: `/push/config`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async subscribe(input: PushSubscriptionInput, options?: RequestOptions): Promise<PushSubscriptionRecord> {
    const res = await this.http.request<PushSubscriptionRecord>({
      method: "POST",
      path: `/push/subscribe`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async unsubscribe(input: { endpoint: string }, options?: RequestOptions): Promise<void> {
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/push/subscribe`,
      body: input,
      ...(options ? { options } : {}),
    });
  }

  async rotate(
    input: { oldEndpoint: string; endpoint: string; p256dh: string; auth: string },
    options?: RequestOptions,
  ): Promise<PushSubscriptionRecord> {
    const res = await this.http.request<PushSubscriptionRecord>({
      method: "POST",
      path: `/push/rotate`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async diagnose(
    query: { endpoint: string },
    options?: RequestOptions,
  ): Promise<{
    registered: boolean;
    id?: string;
    userAgent?: string;
    createdAt?: string;
    lastUsedAt?: string;
  }> {
    const res = await this.http.request<{
      registered: boolean;
      id?: string;
      userAgent?: string;
      createdAt?: string;
      lastUsedAt?: string;
    }>({
      method: "GET",
      path: `/push/diagnose`,
      query,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async listSubscriptions(options?: RequestOptions): Promise<PushSubscriptionRecord[]> {
    const res = await this.http.request<PushSubscriptionRecord[]>({
      method: "GET",
      path: `/push/subscriptions`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async test(options?: RequestOptions): Promise<{ sent: boolean }> {
    const res = await this.http.request<{ sent: boolean }>({
      method: "POST",
      path: `/push/test`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Registra el token de push nativo del dispositivo (FCM en Android / APNs en iOS). Lo usa la app móvil. */
  async registerDevice(input: RegisterDeviceInput, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/push/device`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Da de baja un token de push nativo (logout en el dispositivo). */
  async unregisterDevice(input: { token: string }, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "DELETE",
      path: `/push/device`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
