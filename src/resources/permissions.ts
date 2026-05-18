import type { Permission } from "../types/identity.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class PermissionsResource extends Resource {
  async list(options?: RequestOptions): Promise<Permission[]> {
    const res = await this.http.request<Permission[]>({
      method: "GET",
      path: `/permissions`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
