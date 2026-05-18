import type { PlanLimits } from "../types/billing.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class PlanLimitsResource extends Resource {
  async retrieve(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<PlanLimits> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<PlanLimits>({
      method: "GET",
      path: `/organizations/${orgId}/plan-limits`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
