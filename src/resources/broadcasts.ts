import type { Broadcast, CreateBroadcastInput } from "../types/messaging.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";

export interface ListBroadcastsQuery {
  orgId?: string;
  cursor?: string;
  limit?: number;
  status?: Broadcast["status"];
}

export class BroadcastsResource extends Resource {
  async list(query: ListBroadcastsQuery = {}, options?: RequestOptions): Promise<Paginated<Broadcast>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/broadcasts`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return toPaginated<Broadcast>(res.data);
  }

  async retrieve(broadcastId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Broadcast> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Broadcast>({
      method: "GET",
      path: `/organizations/${orgId}/broadcasts/${broadcastId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(input: CreateBroadcastInput & { orgId?: string }, options?: RequestOptions): Promise<Broadcast> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Broadcast>({
      method: "POST",
      path: `/organizations/${orgId}/broadcasts`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async send(
    broadcastId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<{ sent: number; failed: number; total: number }> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<{ sent: number; failed: number; total: number }>({
      method: "POST",
      path: `/organizations/${orgId}/broadcasts/${broadcastId}/send`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async cancel(broadcastId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Broadcast> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Broadcast>({
      method: "POST",
      path: `/organizations/${orgId}/broadcasts/${broadcastId}/cancel`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
