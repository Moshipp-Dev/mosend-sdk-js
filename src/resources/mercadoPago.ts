import type { RechargeWalletInput, RechargeWalletResponse } from "../types/billing.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class MercadoPagoResource extends Resource {
  async rechargeWallet(
    input: RechargeWalletInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<RechargeWalletResponse> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<RechargeWalletResponse>({
      method: "POST",
      path: `/organizations/${orgId}/wallet/recharge`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async payInvoice(
    invoiceId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<RechargeWalletResponse> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<RechargeWalletResponse>({
      method: "POST",
      path: `/organizations/${orgId}/billing/invoices/${invoiceId}/pay`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
