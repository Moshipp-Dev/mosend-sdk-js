import type { LeadInput } from "../types/misc.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class LeadsResource extends Resource {
  async create(input: LeadInput, options?: RequestOptions): Promise<{ id: string }> {
    const res = await this.http.request<{ id: string }>({
      method: "POST",
      path: `/public/leads`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
