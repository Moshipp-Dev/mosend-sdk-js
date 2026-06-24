import type { UUID } from "./common.js";

export type AttendanceStatus =
  | "ONLINE"
  | "LUNCH"
  | "BREAK"
  | "MEETING"
  | "TRAINING"
  | "ENDED";

export type SettableAttendanceStatus = "ONLINE" | "LUNCH" | "BREAK" | "MEETING" | "TRAINING";

export interface AttendanceSession {
  id: UUID;
  agentId: UUID;
  status: AttendanceStatus;
  startedAt: number;
  endedAt?: number | null;
  [key: string]: unknown;
}

export interface AttendanceSettings {
  enabled: boolean;
  autoCloseEnabled: boolean;
  inactivityMinutes: number;
  closeAtShiftEnd: boolean;
  requireJornadaForInbox: boolean;
  allowOvertime: boolean;
  requireActiveToAttend: boolean;
}

export interface UpdateAttendanceSettingsInput {
  enabled?: boolean;
  autoCloseEnabled?: boolean;
  inactivityMinutes?: number;
  closeAtShiftEnd?: boolean;
  requireJornadaForInbox?: boolean;
  allowOvertime?: boolean;
  requireActiveToAttend?: boolean;
}

export interface AttendanceReportQuery {
  orgId?: string;
  /** "YYYY-MM-DD" interpretado en la TZ de la org. */
  from?: string;
  to?: string;
}

export interface IsoWeek {
  isoYear: number;
  isoWeek: number;
}

export interface AgentSchedule {
  agentId: UUID;
  isoYear: number;
  isoWeek: number;
  days: Record<string, string[]>;
  lunch?: Record<string, string> | null;
  [key: string]: unknown;
}

export interface UpsertScheduleInput {
  isoYear: number;
  isoWeek: number;
  days: Record<string, string[]>;
  lunch?: Record<string, string>;
  copyToWeeks?: number;
}

export interface ScheduleWeekQuery {
  orgId?: string;
  isoYear?: number;
  isoWeek?: number;
}
