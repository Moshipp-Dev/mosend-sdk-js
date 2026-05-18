import type { Waba } from "../types/waba.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export interface ListWabaQuery {
  orgId?: string;
  includeArchived?: boolean;
}

export class WabaResource extends Resource {
  async list(query: ListWabaQuery = {}, options?: RequestOptions): Promise<Waba[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Waba[]>({
      method: "GET",
      path: `/organizations/${orgId}/waba`,
      query: rest as Record<string, string | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Waba> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Waba>({
      method: "GET",
      path: `/organizations/${orgId}/waba/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async connectTestNumber(
    input: Record<string, unknown> & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<{ wabaId: string; phoneNumberId: string }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ wabaId: string; phoneNumberId: string }>({
      method: "POST",
      path: `/organizations/${orgId}/waba/connect-test-number`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async archive(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/waba/${id}`,
      ...(options ? { options } : {}),
    });
  }

  async restore(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Waba> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Waba>({
      method: "POST",
      path: `/organizations/${orgId}/waba/${id}/restore`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async purge(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/waba/${id}/purge`,
      ...(options ? { options } : {}),
    });
  }
}
