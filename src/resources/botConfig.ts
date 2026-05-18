import type { BotConfig, UpsertBotConfigInput } from "../types/bot.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class BotConfigResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<BotConfig[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<BotConfig[]>({
      method: "GET",
      path: `/organizations/${orgId}/bot/config`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(
    phoneId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<BotConfig> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<BotConfig>({
      method: "GET",
      path: `/organizations/${orgId}/bot/config/${phoneId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async upsert(
    phoneId: string,
    input: UpsertBotConfigInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<BotConfig> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<BotConfig>({
      method: "PUT",
      path: `/organizations/${orgId}/bot/config/${phoneId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async toggle(
    phoneId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<BotConfig> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<BotConfig>({
      method: "PATCH",
      path: `/organizations/${orgId}/bot/config/${phoneId}/toggle`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
