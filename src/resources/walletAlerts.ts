import type { WalletAlertSettings } from "../types/billing.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class WalletAlertsResource extends Resource {
  async retrieve(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<WalletAlertSettings> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<WalletAlertSettings>({
      method: "GET",
      path: `/organizations/${orgId}/billing/alert-settings`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    input: WalletAlertSettings & { orgId?: string },
    options?: RequestOptions,
  ): Promise<WalletAlertSettings> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<WalletAlertSettings>({
      method: "PATCH",
      path: `/organizations/${orgId}/billing/alert-settings`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
