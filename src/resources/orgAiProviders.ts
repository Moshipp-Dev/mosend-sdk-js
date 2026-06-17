import type {
  AiProviderName,
  EffectiveAiProvider,
  OrgAiProvider,
  OrgAiProviderTestResult,
  UpsertOrgAiProviderInput,
} from "../types/bot.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class OrgAiProvidersResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<OrgAiProvider[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<OrgAiProvider[]>({
      method: "GET",
      path: `/organizations/${orgId}/bot/ai-providers`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Proveedores efectivos resueltos (BYOK del cliente o fallback de Mosend). */
  async effective(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<EffectiveAiProvider[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<EffectiveAiProvider[]>({
      method: "GET",
      path: `/organizations/${orgId}/bot/ai-providers/effective`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async upsert(
    provider: AiProviderName,
    input: UpsertOrgAiProviderInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<OrgAiProvider> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<OrgAiProvider>({
      method: "PUT",
      path: `/organizations/${orgId}/bot/ai-providers/${provider}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(
    provider: AiProviderName,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/bot/ai-providers/${provider}`,
      ...(options ? { options } : {}),
    });
  }

  async test(
    provider: AiProviderName,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<OrgAiProviderTestResult> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<OrgAiProviderTestResult>({
      method: "POST",
      path: `/organizations/${orgId}/bot/ai-providers/${provider}/test`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
