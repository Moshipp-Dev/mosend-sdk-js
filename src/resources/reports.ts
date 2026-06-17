import type {
  ReportBilling,
  ReportMessagingPoint,
  ReportSummary,
  TeamGoals,
  UpdateTeamGoalsInput,
} from "../types/misc.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";

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

  async customers(
    query: {
      orgId?: string;
      since?: string;
      until?: string;
      category?: string;
      resolutionOutcome?: string;
      q?: string;
      limit?: number;
      cursor?: string;
    } = {},
    options?: RequestOptions,
  ): Promise<Paginated<Record<string, unknown>>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/reports/customers`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return toPaginated<Record<string, unknown>>(res.data);
  }

  async customer(
    contactId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<Record<string, unknown>> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Record<string, unknown>>({
      method: "GET",
      path: `/organizations/${orgId}/reports/customers/${contactId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async teamWeekly(
    query: { orgId?: string; weeks?: number; compare?: boolean } = {},
    options?: RequestOptions,
  ): Promise<Record<string, unknown>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Record<string, unknown>>({
      method: "GET",
      path: `/organizations/${orgId}/reports/team/weekly`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async teamByAgent(
    query: { orgId?: string; since?: string; until?: string } = {},
    options?: RequestOptions,
  ): Promise<Array<Record<string, unknown>>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Array<Record<string, unknown>>>({
      method: "GET",
      path: `/organizations/${orgId}/reports/team/by-agent`,
      query: rest as Record<string, string | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async teamGoals(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<TeamGoals> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<TeamGoals>({
      method: "GET",
      path: `/organizations/${orgId}/reports/team/goals`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async updateTeamGoals(
    input: UpdateTeamGoalsInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<TeamGoals> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<TeamGoals>({
      method: "PATCH",
      path: `/organizations/${orgId}/reports/team/goals`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
