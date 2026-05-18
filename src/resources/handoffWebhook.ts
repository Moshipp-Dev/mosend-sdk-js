import type {
  HandoffWebhook,
  HandoffWebhookSecret,
  HandoffWebhookTestResult,
  UpsertHandoffWebhookInput,
} from "../types/bot.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class HandoffWebhookResource extends Resource {
  async retrieve(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<HandoffWebhook | null> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<HandoffWebhook | null>({
      method: "GET",
      path: `/organizations/${orgId}/integrations/handoff-webhook`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async upsert(
    input: UpsertHandoffWebhookInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<HandoffWebhook & { secret?: string }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<HandoffWebhook & { secret?: string }>({
      method: "PUT",
      path: `/organizations/${orgId}/integrations/handoff-webhook`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/integrations/handoff-webhook`,
      ...(options ? { options } : {}),
    });
  }

  async rotateSecret(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<HandoffWebhookSecret> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<HandoffWebhookSecret>({
      method: "POST",
      path: `/organizations/${orgId}/integrations/handoff-webhook/rotate-secret`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async test(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<HandoffWebhookTestResult> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<HandoffWebhookTestResult>({
      method: "POST",
      path: `/organizations/${orgId}/integrations/handoff-webhook/test`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
