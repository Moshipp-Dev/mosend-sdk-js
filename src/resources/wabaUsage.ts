import type { WabaUsageQuery } from "../types/account.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/** `/admin/wabas` — uso y rentabilidad por WABA. Solo staff de Mosend. */
export class WabaUsageResource extends Resource {
  /** Comparativa de cada WABA (mensajes, plantillas, fallidos, costo de Meta, IA) contra el período anterior. */
  async list(query: WabaUsageQuery = {}, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/admin/wabas/uso`,
      query: { ...query },
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Detalle de una WABA: mensajes y costo por día, plantillas que más cuestan, errores frecuentes. */
  async detail(wabaId: string, query: WabaUsageQuery = {}, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/admin/wabas/${wabaId}/detalle`,
      query: { ...query },
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
