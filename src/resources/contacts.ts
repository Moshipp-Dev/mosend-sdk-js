import type {
  Contact,
  ContactNote,
  CreateContactInput,
  CreateContactNoteInput,
  UpdateContactInput,
  UpdateContactNoteInput,
} from "../types/messaging.js";
import type { Task } from "../types/tasks.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";

export interface ListContactsQuery {
  orgId?: string;
  page?: number;
  pageSize?: number;
  q?: string;
  tagId?: string;
  channel?: "whatsapp" | "web" | "all";
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

  async *iterate(
    query: ListContactsQuery = {},
    options?: RequestOptions,
  ): AsyncIterableIterator<Contact> {
    // Contactos pagina por offset (`page`/`pageSize`), no por cursor: iteramos
    // incrementando la página hasta recibir una página incompleta.
    const pageSize = query.pageSize ?? 50;
    let page = query.page ?? 1;
    for (;;) {
      const { data } = await this.list({ ...query, page, pageSize }, options);
      for (const contact of data) yield contact;
      if (data.length < pageSize) break;
      page += 1;
    }
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
    input: UpdateContactInput & { orgId?: string },
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

  async bulkDelete(
    input: { contactIds: string[]; orgId?: string },
    options?: RequestOptions,
  ): Promise<{ deleted: number }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ deleted: number }>({
      method: "POST",
      path: `/organizations/${orgId}/contacts/bulk-delete`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async bulkSetOptInStatus(
    input: {
      contactIds: string[];
      status: "UNKNOWN" | "OPTED_IN" | "OPTED_OUT";
      orgId?: string;
    },
    options?: RequestOptions,
  ): Promise<{ updated: number }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ updated: number }>({
      method: "POST",
      path: `/organizations/${orgId}/contacts/bulk-opt-in-status`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async listNotes(
    contactId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<ContactNote[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<ContactNote[]>({
      method: "GET",
      path: `/organizations/${orgId}/contacts/${contactId}/notes`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async addNote(
    contactId: string,
    input: CreateContactNoteInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<ContactNote> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<ContactNote>({
      method: "POST",
      path: `/organizations/${orgId}/contacts/${contactId}/notes`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async updateNote(
    contactId: string,
    noteId: string,
    input: UpdateContactNoteInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<ContactNote> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<ContactNote>({
      method: "PATCH",
      path: `/organizations/${orgId}/contacts/${contactId}/notes/${noteId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async deleteNote(
    contactId: string,
    noteId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/contacts/${contactId}/notes/${noteId}`,
      ...(options ? { options } : {}),
    });
  }

  async listTasks(
    contactId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<Task[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Task[]>({
      method: "GET",
      path: `/organizations/${orgId}/contacts/${contactId}/tasks`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
