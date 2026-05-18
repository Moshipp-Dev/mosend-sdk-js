import type { BotEvent } from "../types/bot.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export interface ListBotEventsQuery {
  orgId?: string;
  phoneNumberId?: string;
  limit?: number;
}

export class BotEventsResource extends Resource {
  async list(query: ListBotEventsQuery = {}, options?: RequestOptions): Promise<BotEvent[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<BotEvent[]>({
      method: "GET",
      path: `/organizations/${orgId}/bot/events`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
