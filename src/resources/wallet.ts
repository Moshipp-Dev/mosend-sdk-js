import type { Wallet, WalletTransaction } from "../types/billing.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";

export class WalletResource extends Resource {
  async retrieve(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Wallet> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Wallet>({
      method: "GET",
      path: `/organizations/${orgId}/wallet`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async transactions(
    query: { orgId?: string; limit?: number; cursor?: string } = {},
    options?: RequestOptions,
  ): Promise<Paginated<WalletTransaction>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/wallet/transactions`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return toPaginated<WalletTransaction>(res.data);
  }
}
