import type { AiCreditSummary, AiCreditTransaction } from "../types/bot.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class AiCreditsResource extends Resource {
  async summary(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<AiCreditSummary> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<AiCreditSummary>({
      method: "GET",
      path: `/organizations/${orgId}/ai-credits/summary`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async transactions(
    query: { orgId?: string; limit?: number } = {},
    options?: RequestOptions,
  ): Promise<AiCreditTransaction[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AiCreditTransaction[]>({
      method: "GET",
      path: `/organizations/${orgId}/ai-credits/transactions`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
