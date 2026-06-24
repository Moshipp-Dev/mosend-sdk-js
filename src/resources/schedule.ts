import type {
  AgentSchedule,
  IsoWeek,
  ScheduleWeekQuery,
  UpsertScheduleInput,
} from "../types/attendance.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class ScheduleResource extends Resource {
  /** Semana ISO actual según la TZ de la organización. */
  async currentWeek(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<IsoWeek> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<IsoWeek>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/current-week`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Horarios del equipo para una semana (admin). Sin semana → la actual. */
  async listWeek(query: ScheduleWeekQuery = {}, options?: RequestOptions): Promise<AgentSchedule[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AgentSchedule[]>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/schedules`,
      query: rest as Record<string, number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Horario de un agente para una semana (admin). */
  async getForAgent(
    agentId: string,
    query: ScheduleWeekQuery = {},
    options?: RequestOptions,
  ): Promise<AgentSchedule> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AgentSchedule>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/schedules/${agentId}`,
      query: rest as Record<string, number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Asigna/actualiza el horario de un agente (admin), con copia opcional. */
  async upsert(
    agentId: string,
    input: UpsertScheduleInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<AgentSchedule> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AgentSchedule>({
      method: "PUT",
      path: `/organizations/${orgId}/attendance/schedules/${agentId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Horario del agente autenticado (semana actual si no se pasa). */
  async mine(query: ScheduleWeekQuery = {}, options?: RequestOptions): Promise<AgentSchedule> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AgentSchedule>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/my-schedule`,
      query: rest as Record<string, number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
