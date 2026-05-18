import type { AuditEvent, AuditExportResponse } from "../types/misc.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";

export interface ListAuditQuery {
  orgId?: string;
  action?: string;
  resource?: string;
  actorUserId?: string;
  dateFrom?: string;
  dateTo?: string;
  cursor?: string;
  limit?: number;
}

export interface ListAdminAuditQuery extends ListAuditQuery {}

export class AuditResource extends Resource {
  async list(query: ListAuditQuery = {}, options?: RequestOptions): Promise<Paginated<AuditEvent>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/audit`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return toPaginated<AuditEvent>(res.data);
  }

  async export(query: ListAuditQuery = {}, options?: RequestOptions): Promise<AuditExportResponse> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AuditExportResponse>({
      method: "GET",
      path: `/organizations/${orgId}/audit/export`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async listAdmin(query: ListAdminAuditQuery = {}, options?: RequestOptions): Promise<Paginated<AuditEvent>> {
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/admin/audit`,
      query: query as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return toPaginated<AuditEvent>(res.data);
  }

  async exportAdmin(query: ListAdminAuditQuery = {}, options?: RequestOptions): Promise<AuditExportResponse> {
    const res = await this.http.request<AuditExportResponse>({
      method: "GET",
      path: `/admin/audit/export`,
      query: query as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
