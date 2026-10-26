import type { DateRangeQuery } from "../types/botAgents.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/bot/resumen` y `/bot/salud` — cómo va el bot y qué se está rompiendo. */
export class BotSummaryResource extends Resource {
  /** Serie diaria de quién atendió, totales del período y del anterior, acciones y cierres. */
  async summary(query: DateRangeQuery & { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/bot/resumen`,
      query: rest,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** En qué se fue la IA un día (`fecha` YYYY-MM-DD, cortado en la zona horaria de la org). */
  async daySpend(query: { fecha: string; orgId?: string }, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/bot/resumen/dia`,
      query: rest,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Revisión de salud del bot: problemas detectados y qué hacer con cada uno. */
  async health(query: { dias?: number; orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/bot/salud`,
      query: rest,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
