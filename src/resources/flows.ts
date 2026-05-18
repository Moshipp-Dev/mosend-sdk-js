import type {
  CreateFlowInput,
  Flow,
  FlowTestRunInput,
  FlowTestRunResult,
  UpdateFlowInput,
} from "../types/bot.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export interface ListFlowsQuery {
  orgId?: string;
  phoneNumberId?: string;
}

export class FlowsResource extends Resource {
  async list(query: ListFlowsQuery = {}, options?: RequestOptions): Promise<Flow[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Flow[]>({
      method: "GET",
      path: `/organizations/${orgId}/bot/flows`,
      query: rest as Record<string, string | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Flow> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Flow>({
      method: "GET",
      path: `/organizations/${orgId}/bot/flows/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(
    input: CreateFlowInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Flow> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Flow>({
      method: "POST",
      path: `/organizations/${orgId}/bot/flows`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateFlowInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Flow> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Flow>({
      method: "PATCH",
      path: `/organizations/${orgId}/bot/flows/${id}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async publish(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Flow> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Flow>({
      method: "POST",
      path: `/organizations/${orgId}/bot/flows/${id}/publish`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async unpublish(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Flow> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Flow>({
      method: "POST",
      path: `/organizations/${orgId}/bot/flows/${id}/unpublish`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async duplicate(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Flow> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Flow>({
      method: "POST",
      path: `/organizations/${orgId}/bot/flows/${id}/duplicate`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/bot/flows/${id}`,
      ...(options ? { options } : {}),
    });
  }

  async testRun(
    id: string,
    input: FlowTestRunInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<FlowTestRunResult> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<FlowTestRunResult>({
      method: "POST",
      path: `/organizations/${orgId}/bot/flows/${id}/test-run`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
