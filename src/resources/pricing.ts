import type { Pricing } from "../types/billing.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class PricingResource extends Resource {
  async retrieve(options?: RequestOptions): Promise<Pricing> {
    const res = await this.http.request<Pricing>({
      method: "GET",
      path: `/pricing`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
