import type { AiCreditSummary, AiCreditTransaction } from "../types/bot.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import type { AdjustAiCreditsInput, UpdateAiCreditPolicyInput } from "../types/account.js";

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

  /** Política pública del crédito de IA (bienvenida y packs). Sin autenticación. */
  async publicPolicy(options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/ai-credits/public-policy`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Policy global del AI Power Pack. Solo staff de Mosend. */
  async getPolicy(options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/admin/ai-credit-policy`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Actualiza la policy global. Solo staff de Mosend. */
  async updatePolicy(input: UpdateAiCreditPolicyInput, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "PATCH",
      path: `/admin/ai-credit-policy`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Ajuste manual del balance de una org (bonus, refund, corrección). Solo staff de Mosend. */
  async adjust(organizationId: string, input: AdjustAiCreditsInput, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/admin/organizations/${organizationId}/ai-credits/adjust`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
