import type { PushConfig, PushSubscriptionInput, PushSubscriptionRecord } from "../types/misc.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

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
}
