import type { Template } from "../types/messaging.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";
import { iteratePages } from "../core/pagination.js";

export interface ListTemplatesQuery {
  orgId?: string;
  cursor?: string;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "DISABLED";
  category?: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  language?: string;
}

export class TemplatesResource extends Resource {
  async list(query: ListTemplatesQuery = {}, options?: RequestOptions): Promise<Paginated<Template>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/templates`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return toPaginated<Template>(res.data);
  }

  iterate(query: ListTemplatesQuery = {}, options?: RequestOptions): AsyncIterableIterator<Template> {
    return iteratePages<Template, ListTemplatesQuery>(
      (params) => this.list(params, options),
      query,
    );
  }

  async retrieve(templateId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Template> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Template>({
      method: "GET",
      path: `/organizations/${orgId}/templates/${templateId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
