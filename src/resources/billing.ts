import type {
  BillingPeriod,
  BillingUsage,
  CouponInput,
  CouponValidation,
  EstimatedNextCharge,
} from "../types/billing.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class BillingResource extends Resource {
  async periods(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<BillingPeriod[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<BillingPeriod[]>({
      method: "GET",
      path: `/organizations/${orgId}/billing/periods`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async usage(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<BillingUsage> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<BillingUsage>({
      method: "GET",
      path: `/organizations/${orgId}/billing/usage`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async estimatedNextCharge(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<EstimatedNextCharge> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<EstimatedNextCharge>({
      method: "GET",
      path: `/organizations/${orgId}/billing/estimated-next-charge`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async validateCoupon(
    input: CouponInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<CouponValidation> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<CouponValidation>({
      method: "POST",
      path: `/organizations/${orgId}/billing/coupons/validate`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async redeemCoupon(
    input: CouponInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<CouponValidation> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<CouponValidation>({
      method: "POST",
      path: `/organizations/${orgId}/billing/coupons/redeem`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
