import type {
  AddPaymentMethodInput,
  BillingPreferences,
  PaymentMethod,
  SetAutoPayInput,
} from "../types/billing.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class PaymentMethodsResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<PaymentMethod[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<PaymentMethod[]>({
      method: "GET",
      path: `/organizations/${orgId}/billing/payment-methods`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async add(
    input: AddPaymentMethodInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<PaymentMethod> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<PaymentMethod>({
      method: "POST",
      path: `/organizations/${orgId}/billing/payment-methods`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/billing/payment-methods/${id}`,
      ...(options ? { options } : {}),
    });
  }

  async setDefault(
    id: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<PaymentMethod> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<PaymentMethod>({
      method: "POST",
      path: `/organizations/${orgId}/billing/payment-methods/${id}/default`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async preferences(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<BillingPreferences> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<BillingPreferences>({
      method: "GET",
      path: `/organizations/${orgId}/billing/preferences`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async setAutoPay(
    input: SetAutoPayInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<BillingPreferences> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<BillingPreferences>({
      method: "PATCH",
      path: `/organizations/${orgId}/billing/auto-pay`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
