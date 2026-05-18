import type { DailyUsage } from "../types/billing.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class UsageResource extends Resource {
  async daily(
    query: { orgId?: string; metric?: string; since?: string } = {},
    options?: RequestOptions,
  ): Promise<DailyUsage> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<DailyUsage>({
      method: "GET",
      path: `/organizations/${orgId}/usage/daily`,
      query: rest as Record<string, string | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
