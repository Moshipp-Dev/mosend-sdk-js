import type {
  Conversation,
  ConversationWorkload,
  MessagingSettings,
  UnreadCounts,
  UpdateMessagingSettingsInput,
  UpdateWorkloadSettingsInput,
  WorkloadSettings,
} from "../types/messaging.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";

export interface ListConversationsQuery {
  orgId?: string;
  status?: "open" | "closed" | "snoozed";
  phoneNumberId?: string;
  assigneeUserId?: string;
  tagId?: string;
  unreadOnly?: boolean;
  handoffPending?: boolean;
  search?: string;
  take?: number;
  cursor?: string;
}

export interface SearchConversationsQuery {
  orgId?: string;
  q: string;
  phoneNumberId?: string;
  from?: string;
  to?: string;
  direction?: "IN" | "OUT";
  hasAttachment?: boolean;
  sentByMe?: boolean;
}

export class ConversationsResource extends Resource {
  async list(
    query: ListConversationsQuery = {},
    options?: RequestOptions,
  ): Promise<Paginated<Conversation>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/conversations`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return toPaginated<Conversation>(res.data);
  }

  async getMessagingSettings(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<MessagingSettings> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<MessagingSettings>({
      method: "GET",
      path: `/organizations/${orgId}/conversations/messaging-settings`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async updateMessagingSettings(
    input: UpdateMessagingSettingsInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<MessagingSettings> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<MessagingSettings>({
      method: "PATCH",
      path: `/organizations/${orgId}/conversations/messaging-settings`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async unreadCounts(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<UnreadCounts> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<UnreadCounts>({
      method: "GET",
      path: `/organizations/${orgId}/conversations/unread-counts`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async search(
    query: SearchConversationsQuery,
    options?: RequestOptions,
  ): Promise<Paginated<Conversation>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/conversations/search`,
      query: rest as Record<string, string | number | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return toPaginated<Conversation>(res.data);
  }

  async workload(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<ConversationWorkload> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<ConversationWorkload>({
      method: "GET",
      path: `/organizations/${orgId}/conversations/workload`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async getWorkloadSettings(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<WorkloadSettings> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<WorkloadSettings>({
      method: "GET",
      path: `/organizations/${orgId}/conversations/workload/settings`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async updateWorkloadSettings(
    input: UpdateWorkloadSettingsInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<WorkloadSettings> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<WorkloadSettings>({
      method: "PATCH",
      path: `/organizations/${orgId}/conversations/workload/settings`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async workloadByAgent(
    userId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<{ userId: string; openCount: number; capacity?: number }> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<{ userId: string; openCount: number; capacity?: number }>({
      method: "GET",
      path: `/organizations/${orgId}/conversations/workload/agent/${userId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async activityTrends(
    query: { orgId?: string; days?: number; metric?: string } = {},
    options?: RequestOptions,
  ): Promise<Array<{ day: string; value: number }>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Array<{ day: string; value: number }>>({
      method: "GET",
      path: `/organizations/${orgId}/conversations/activity-trends`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async activityHeatmap(
    query: { orgId?: string; days?: number; metric?: "volume" | "late" | "avgResponse" } = {},
    options?: RequestOptions,
  ): Promise<Array<{ dayOfWeek: number; hour: number; value: number }>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Array<{ dayOfWeek: number; hour: number; value: number }>>({
      method: "GET",
      path: `/organizations/${orgId}/conversations/activity-heatmap`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async bulkAssign(
    input: { conversationIds: string[]; userId: string | null; orgId?: string },
    options?: RequestOptions,
  ): Promise<{ updated: number }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ updated: number }>({
      method: "POST",
      path: `/organizations/${orgId}/conversations/bulk-assign`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Conversation> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Conversation>({
      method: "GET",
      path: `/organizations/${orgId}/conversations/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async listMessages(
    id: string,
    query: { orgId?: string; limit?: number; before?: string } = {},
    options?: RequestOptions,
  ): Promise<Paginated<Record<string, unknown>>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/conversations/${id}/messages`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return toPaginated<Record<string, unknown>>(res.data);
  }

  async setStatus(
    id: string,
    input: {
      status: "open" | "closed" | "snoozed";
      category?: string;
      resolutionOutcome?: string;
      orgId?: string;
    },
    options?: RequestOptions,
  ): Promise<Conversation> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Conversation>({
      method: "PATCH",
      path: `/organizations/${orgId}/conversations/${id}/status`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async markRead(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/conversations/${id}/read`,
      ...(options ? { options } : {}),
    });
  }

  async markUnread(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/conversations/${id}/unread`,
      ...(options ? { options } : {}),
    });
  }

  async sendTyping(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/conversations/${id}/typing`,
      ...(options ? { options } : {}),
    });
  }

  async assign(
    id: string,
    input: { userId: string | null; orgId?: string },
    options?: RequestOptions,
  ): Promise<Conversation> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Conversation>({
      method: "PATCH",
      path: `/organizations/${orgId}/conversations/${id}/assign`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async listMedia(
    id: string,
    query: {
      orgId?: string;
      category?: "image" | "video" | "audio" | "doc";
      limit?: number;
      before?: string;
    } = {},
    options?: RequestOptions,
  ): Promise<Array<Record<string, unknown>>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Array<Record<string, unknown>>>({
      method: "GET",
      path: `/organizations/${orgId}/conversations/${id}/media`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async mediaCounts(
    id: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<Record<string, number>> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Record<string, number>>({
      method: "GET",
      path: `/organizations/${orgId}/conversations/${id}/media/counts`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async listLinks(
    id: string,
    query: { orgId?: string; limit?: number; before?: string } = {},
    options?: RequestOptions,
  ): Promise<Array<Record<string, unknown>>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Array<Record<string, unknown>>>({
      method: "GET",
      path: `/organizations/${orgId}/conversations/${id}/links`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async categorize(
    id: string,
    input: {
      category?: "INQUIRY" | "SALE" | "SUPPORT" | "COMPLAINT" | "OTHER" | null;
      resolutionOutcome?: "RESOLVED" | "UNRESOLVED" | "PENDING_FOLLOWUP" | "AUTO_CLOSED" | null;
      orgId?: string;
    },
    options?: RequestOptions,
  ): Promise<Conversation> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Conversation>({
      method: "PATCH",
      path: `/organizations/${orgId}/conversations/${id}/categorize`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async requestHandoff(
    id: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<Conversation> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Conversation>({
      method: "POST",
      path: `/organizations/${orgId}/conversations/${id}/request-handoff`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async claim(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Conversation> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Conversation>({
      method: "POST",
      path: `/organizations/${orgId}/conversations/${id}/claim`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async snooze(
    id: string,
    input: { until: string | null; orgId?: string },
    options?: RequestOptions,
  ): Promise<Conversation> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Conversation>({
      method: "PATCH",
      path: `/organizations/${orgId}/conversations/${id}/snooze`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async pin(
    id: string,
    input: { pinned: boolean; orgId?: string },
    options?: RequestOptions,
  ): Promise<Conversation> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Conversation>({
      method: "PATCH",
      path: `/organizations/${orgId}/conversations/${id}/pin`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async addTag(
    id: string,
    input: { tagId: string; orgId?: string },
    options?: RequestOptions,
  ): Promise<{ added: boolean }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ added: boolean }>({
      method: "POST",
      path: `/organizations/${orgId}/conversations/${id}/tags`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async removeTag(
    id: string,
    tagId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/conversations/${id}/tags/${tagId}`,
      ...(options ? { options } : {}),
    });
  }
}
