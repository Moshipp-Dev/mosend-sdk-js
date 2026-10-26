import type { UpdateSurveyConfigInput } from "../types/account.js";
import type { DateRangeQuery } from "../types/botAgents.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/surveys` — encuesta de satisfacción tras el cierre. */
export class SurveysResource extends Resource {
  /** Configuración actual; si nunca se guardó, los valores por defecto (apagada). */
  async getConfig(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/surveys/config`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async updateConfig(input: UpdateSurveyConfigInput & { orgId?: string }, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "PATCH",
      path: `/organizations/${orgId}/surveys/config`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Nota media, tasa de respuesta, desglose por opción y por asesor, comentarios. */
  async results(query: DateRangeQuery & { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/surveys/results`,
      query: rest,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
