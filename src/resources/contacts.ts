import type { Contact, CreateContactInput } from "../types/messaging.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";
import { iteratePages } from "../core/pagination.js";

export interface ListContactsQuery {
  orgId?: string;
  cursor?: string;
  limit?: number;
  search?: string;
  tagId?: string;
  optInStatus?: "OPTED_IN" | "OPTED_OUT" | "UNKNOWN";
}

export class ContactsResource extends Resource {
  async list(query: ListContactsQuery = {}, options?: RequestOptions): Promise<Paginated<Contact>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/contacts`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return toPaginated<Contact>(res.data);
  }

  iterate(query: ListContactsQuery = {}, options?: RequestOptions): AsyncIterableIterator<Contact> {
    return iteratePages<Contact, ListContactsQuery>(
      (params) => this.list(params, options),
      query,
    );
  }

  async create(input: CreateContactInput & { orgId?: string }, options?: RequestOptions): Promise<Contact> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Contact>({
      method: "POST",
      path: `/organizations/${orgId}/contacts`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(contactId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Contact> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Contact>({
      method: "GET",
      path: `/organizations/${orgId}/contacts/${contactId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    contactId: string,
    input: Partial<CreateContactInput> & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Contact> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Contact>({
      method: "PATCH",
      path: `/organizations/${orgId}/contacts/${contactId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(contactId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/contacts/${contactId}`,
      ...(options ? { options } : {}),
    });
  }

  async import(
    input: { contacts: CreateContactInput[]; orgId?: string },
    options?: RequestOptions,
  ): Promise<{ created: number; updated: number; failed: number }> {
    const orgId = this.requireOrgId(input.orgId);
    const res = await this.http.request<{ created: number; updated: number; failed: number }>({
      method: "POST",
      path: `/organizations/${orgId}/contacts/import`,
      body: { contacts: input.contacts },
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async bulkTag(
    input: { contactIds: string[]; tagId: string; orgId?: string },
    options?: RequestOptions,
  ): Promise<{ tagged: number }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ tagged: number }>({
      method: "POST",
      path: `/organizations/${orgId}/contacts/bulk-tag`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
