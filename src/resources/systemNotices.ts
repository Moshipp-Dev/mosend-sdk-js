import type { SystemNotice } from "../types/misc.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class SystemNoticesResource extends Resource {
  /** Avisos globales activos del sistema (banner). No requiere orgId. */
  async active(options?: RequestOptions): Promise<SystemNotice[]> {
    const res = await this.http.request<SystemNotice[]>({
      method: "GET",
      path: `/system-notices/active`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
