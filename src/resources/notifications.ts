import type { Notification } from "../types/misc.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class NotificationsResource extends Resource {
  async list(options?: RequestOptions): Promise<Notification[]> {
    const res = await this.http.request<Notification[]>({
      method: "GET",
      path: `/notifications`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async markRead(id: string, options?: RequestOptions): Promise<Notification> {
    const res = await this.http.request<Notification>({
      method: "PATCH",
      path: `/notifications/${id}/read`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
