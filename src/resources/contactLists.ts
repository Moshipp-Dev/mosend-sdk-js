import type { Contact, ContactList } from "../types/messaging.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";

export interface ListContactListsQuery {
  orgId?: string;
  cursor?: string;
  limit?: number;
  search?: string;
}

export interface CreateContactListInput {
  name: string;
  description?: string;
  color?: string;
  orgId?: string;
}

export class ContactListsResource extends Resource {
  async list(query: ListContactListsQuery = {}, options?: RequestOptions): Promise<Paginated<ContactList>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/contact-lists`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return toPaginated<ContactList>(res.data);
  }

  async create(input: CreateContactListInput, options?: RequestOptions): Promise<ContactList> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<ContactList>({
      method: "POST",
      path: `/organizations/${orgId}/contact-lists`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(listId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<ContactList> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<ContactList>({
      method: "GET",
      path: `/organizations/${orgId}/contact-lists/${listId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    listId: string,
    input: Partial<CreateContactListInput> & { orgId?: string },
    options?: RequestOptions,
  ): Promise<ContactList> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<ContactList>({
      method: "PATCH",
      path: `/organizations/${orgId}/contact-lists/${listId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(listId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/contact-lists/${listId}`,
      ...(options ? { options } : {}),
    });
  }

  async listMembers(
    listId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<Contact[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Contact[]>({
      method: "GET",
      path: `/organizations/${orgId}/contact-lists/${listId}/members`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async addMembers(
    listId: string,
    input: { contactIds: string[]; orgId?: string },
    options?: RequestOptions,
  ): Promise<{ added: number; alreadyMembers: number }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ added: number; alreadyMembers: number }>({
      method: "POST",
      path: `/organizations/${orgId}/contact-lists/${listId}/members`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async removeMember(
    listId: string,
    contactId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<{ removed: number }> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<{ removed: number }>({
      method: "DELETE",
      path: `/organizations/${orgId}/contact-lists/${listId}/members/${contactId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async addByTag(
    listId: string,
    input: { tagIds: string[]; orgId?: string },
    options?: RequestOptions,
  ): Promise<{ added: number; alreadyMembers: number }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ added: number; alreadyMembers: number }>({
      method: "POST",
      path: `/organizations/${orgId}/contact-lists/${listId}/add-by-tag`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
