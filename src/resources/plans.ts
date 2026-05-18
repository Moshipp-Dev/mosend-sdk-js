import type {
  ChangePlanInput,
  Plan,
  PlanQuote,
  PreviewPlanChangeInput,
  PreviewPlanChangeResponse,
} from "../types/billing.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class PlansResource extends Resource {
  async list(options?: RequestOptions): Promise<Plan[]> {
    const res = await this.http.request<Plan[]>({
      method: "GET",
      path: `/plans`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(slug: string, options?: RequestOptions): Promise<Plan> {
    const res = await this.http.request<Plan>({
      method: "GET",
      path: `/plans/${slug}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async quote(slug: string, query: { coupon?: string } = {}, options?: RequestOptions): Promise<PlanQuote> {
    const res = await this.http.request<PlanQuote>({
      method: "GET",
      path: `/plans/quote/${slug}`,
      query: query as Record<string, string | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async previewChange(
    input: PreviewPlanChangeInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<PreviewPlanChangeResponse> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<PreviewPlanChangeResponse>({
      method: "POST",
      path: `/plans/organizations/${orgId}/preview-change`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async cancelSubscription(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "POST",
      path: `/plans/organizations/${orgId}/cancel-subscription`,
      ...(options ? { options } : {}),
    });
  }

  async change(input: ChangePlanInput & { orgId?: string }, options?: RequestOptions): Promise<Plan> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Plan>({
      method: "PATCH",
      path: `/plans/organizations/${orgId}/plan`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
