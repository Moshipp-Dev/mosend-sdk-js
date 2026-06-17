import type { ISODateString, UUID } from "./common.js";

export type TaskStatus = "pending" | "completed" | "overdue";

export interface Task {
  id: UUID;
  contactId: UUID;
  conversationId?: UUID;
  assignedToUserId?: UUID | null;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueAt: ISODateString;
  completedAt?: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateTaskInput {
  contactId: UUID;
  conversationId?: UUID;
  /** Omitir = se asigna al creador; `null` = cola del equipo; UUID = asignar. */
  assignedToUserId?: UUID | null;
  title: string;
  description?: string;
  dueAt: ISODateString;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  dueAt?: ISODateString;
  assignedToUserId?: UUID | null;
}

export interface TaskCounts {
  badge: number;
  mine: number;
  overdue: number;
  dueToday: number;
  teamPending: number;
}
