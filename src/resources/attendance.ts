import type {
  AttendanceReportQuery,
  AttendanceSession,
  AttendanceSettings,
  SettableAttendanceStatus,
  UpdateAttendanceSettingsInput,
} from "../types/attendance.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class AttendanceResource extends Resource {
  /** Estado de jornada del agente autenticado (null = sin jornada en curso). */
  async me(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<AttendanceSession | null> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<AttendanceSession | null>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/me`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Inicia la jornada (idempotente). */
  async start(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<AttendanceSession> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<AttendanceSession>({
      method: "POST",
      path: `/organizations/${orgId}/attendance/start`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Cambia el estado de la jornada (Activo, Almuerzo, Pausa, Reunión, Capacitación). */
  async changeStatus(
    input: { status: SettableAttendanceStatus; orgId?: string },
    options?: RequestOptions,
  ): Promise<AttendanceSession> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AttendanceSession>({
      method: "POST",
      path: `/organizations/${orgId}/attendance/status`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Finaliza la jornada y congela el informe del día (con resumen opcional). */
  async end(
    input: { note?: string; orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<AttendanceSession> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AttendanceSession>({
      method: "POST",
      path: `/organizations/${orgId}/attendance/end`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Jornada de hoy del agente: totales en vivo, timeline, métricas y horario. */
  async today(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/today`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Admin ─────────────────────────────────────────────────────────────

  async getSettings(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<AttendanceSettings> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<AttendanceSettings>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/settings`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async updateSettings(
    input: UpdateAttendanceSettingsInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<AttendanceSettings> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AttendanceSettings>({
      method: "PATCH",
      path: `/organizations/${orgId}/attendance/settings`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Agentes con turno extra concedido para hoy. */
  async overtimeToday(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/overtime`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Concede o revoca el turno extra de un agente para hoy. */
  async setOvertime(
    agentId: string,
    input: { enabled: boolean; orgId?: string },
    options?: RequestOptions,
  ): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/attendance/overtime/${agentId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Estado en vivo de todos los miembros de la org. */
  async teamStatus(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/team-status`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Tablero de asistencia de un día (date = epoch ms). */
  async day(
    query: { orgId?: string; date?: number } = {},
    options?: RequestOptions,
  ): Promise<unknown> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/day`,
      query: rest as Record<string, number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Reporte de horas por agente sobre un rango ("YYYY-MM-DD"). Default: 30 días. */
  async report(query: AttendanceReportQuery = {}, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/report`,
      query: rest as Record<string, string | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Historial de jornadas del agente autenticado (from/to = epoch ms). */
  async mySessions(
    query: { orgId?: string; from?: number; to?: number } = {},
    options?: RequestOptions,
  ): Promise<AttendanceSession[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AttendanceSession[]>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/sessions`,
      query: rest as Record<string, number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Historial de jornadas de un agente con su informe (admin). */
  async agentSessions(
    agentId: string,
    query: { orgId?: string; from?: number; to?: number } = {},
    options?: RequestOptions,
  ): Promise<unknown> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/attendance/sessions/agent/${agentId}`,
      query: rest as Record<string, number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Corrige el cierre de una jornada finalizada (endedAt = epoch ms). */
  async correctSession(
    sessionId: string,
    input: { endedAt: number; orgId?: string },
    options?: RequestOptions,
  ): Promise<AttendanceSession> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<AttendanceSession>({
      method: "PATCH",
      path: `/organizations/${orgId}/attendance/sessions/${sessionId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Elimina una jornada y sus eventos (admin). */
  async deleteSession(sessionId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/attendance/sessions/${sessionId}`,
      ...(options ? { options } : {}),
    });
  }
}
