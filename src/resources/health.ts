import type { HealthStatus } from "../types/misc.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class HealthResource extends Resource {
  async live(options?: RequestOptions): Promise<HealthStatus> {
    const res = await this.http.request<HealthStatus>({
      method: "GET",
      path: `/health/live`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async ready(options?: RequestOptions): Promise<HealthStatus> {
    const res = await this.http.request<HealthStatus>({
      method: "GET",
      path: `/health/ready`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async status(options?: RequestOptions): Promise<HealthStatus> {
    const res = await this.http.request<HealthStatus>({
      method: "GET",
      path: `/health`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
