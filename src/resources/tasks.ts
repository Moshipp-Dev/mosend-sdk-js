import type { CreateTaskInput, Task, TaskCounts, UpdateTaskInput } from "../types/tasks.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export interface ListTasksQuery {
  orgId?: string;
  scope?: "mine" | "all";
  status?: "pending" | "completed" | "overdue";
  contactId?: string;
  conversationId?: string;
  limit?: number;
}

export class TasksResource extends Resource {
  async list(query: ListTasksQuery = {}, options?: RequestOptions): Promise<Task[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Task[]>({
      method: "GET",
      path: `/organizations/${orgId}/tasks`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async counts(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<TaskCounts> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<TaskCounts>({
      method: "GET",
      path: `/organizations/${orgId}/tasks/counts`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(input: CreateTaskInput & { orgId?: string }, options?: RequestOptions): Promise<Task> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Task>({
      method: "POST",
      path: `/organizations/${orgId}/tasks`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    taskId: string,
    input: UpdateTaskInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Task> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Task>({
      method: "PATCH",
      path: `/organizations/${orgId}/tasks/${taskId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async setCompleted(
    taskId: string,
    input: { completed: boolean; orgId?: string },
    options?: RequestOptions,
  ): Promise<Task> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Task>({
      method: "PATCH",
      path: `/organizations/${orgId}/tasks/${taskId}/complete`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async claim(taskId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Task> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Task>({
      method: "PATCH",
      path: `/organizations/${orgId}/tasks/${taskId}/claim`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(taskId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/tasks/${taskId}`,
      ...(options ? { options } : {}),
    });
  }
}
