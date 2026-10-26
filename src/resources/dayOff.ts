import type { AgentLeave, CreateLeaveInput, HolidayItem, OrgHoliday } from "../types/account.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/attendance/holidays|leaves` — festivos y novedades (vacaciones, incapacidades…). */
export class DayOffResource extends Resource {
  async listHolidays(query: { year?: number; orgId?: string } = {}, options?: RequestOptions): Promise<OrgHoliday[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<OrgHoliday[]>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/holidays`,
      query: rest,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea o actualiza festivos (varios a la vez: calendario anual). */
  async upsertHolidays(
    input: { items: HolidayItem[]; orgId?: string },
    options?: RequestOptions,
  ): Promise<OrgHoliday[]> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<OrgHoliday[]>({
      method: "POST",
      path: `/organizations/${orgId}/attendance/holidays`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Siembra el calendario oficial de festivos de un país para un año (por defecto CO). */
  async seedHolidays(
    query: { year: number; country?: string; orgId?: string },
    options?: RequestOptions,
  ): Promise<unknown> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/attendance/holidays/seed`,
      query: rest,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async deleteHoliday(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<void>({
      method: "DELETE",
      path: `/organizations/${orgId}/attendance/holidays/${id}`,
      ...(options ? { options } : {}),
    });
  }

  /** Novedades que tocan el rango (`from`/`to` YYYY-MM-DD), opcionalmente de un asesor. */
  async listLeaves(
    query: { from?: string; to?: string; agentId?: string; orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<AgentLeave[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AgentLeave[]>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/leaves`,
      query: rest,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async createLeave(input: CreateLeaveInput & { orgId?: string }, options?: RequestOptions): Promise<AgentLeave> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AgentLeave>({
      method: "POST",
      path: `/organizations/${orgId}/attendance/leaves`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async deleteLeave(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<void>({
      method: "DELETE",
      path: `/organizations/${orgId}/attendance/leaves/${id}`,
      ...(options ? { options } : {}),
    });
  }
}
