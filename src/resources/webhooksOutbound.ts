import type { CreateWebhookInput, OutboundWebhook, WebhookDelivery } from "../types/webhooks.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";

export class WebhooksOutboundResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Paginated<OutboundWebhook>> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/webhooks-outbound`,
      ...(options ? { options } : {}),
    });
    return toPaginated<OutboundWebhook>(res.data);
  }

  async create(
    input: CreateWebhookInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<OutboundWebhook & { secret: string }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<OutboundWebhook & { secret: string }>({
      method: "POST",
      path: `/organizations/${orgId}/webhooks-outbound`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(webhookId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/webhooks-outbound/${webhookId}`,
      ...(options ? { options } : {}),
    });
  }

  async deliveries(
    webhookId: string,
    query: { orgId?: string; cursor?: string; limit?: number } = {},
    options?: RequestOptions,
  ): Promise<Paginated<WebhookDelivery>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/webhooks-outbound/${webhookId}/deliveries`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return toPaginated<WebhookDelivery>(res.data);
  }
}
