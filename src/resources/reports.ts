import type { ReportBilling, ReportMessagingPoint, ReportSummary } from "../types/misc.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class ReportsResource extends Resource {
  async summary(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<ReportSummary> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<ReportSummary>({
      method: "GET",
      path: `/organizations/${orgId}/reports/summary`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async messaging(
    query: { orgId?: string; since?: string } = {},
    options?: RequestOptions,
  ): Promise<ReportMessagingPoint[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<ReportMessagingPoint[]>({
      method: "GET",
      path: `/organizations/${orgId}/reports/messaging`,
      query: rest as Record<string, string | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async billing(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<ReportBilling> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<ReportBilling>({
      method: "GET",
      path: `/organizations/${orgId}/reports/billing`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
