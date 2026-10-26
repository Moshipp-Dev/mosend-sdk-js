import type {
  Contact,
  ContactFilter,
  ContactList,
  ContactListSmartFilter,
  ImportContactsCsvInput,
  ImportContactsResult,
} from "../types/messaging.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";
import { MosendValidationError } from "../core/errors.js";

export interface ListContactListsQuery {
  orgId?: string;
  cursor?: string;
  limit?: number;
  search?: string;
}

export interface CreateContactListInput {
  name: string;
  description?: string;
  /** Hexadecimal `#RRGGBB`. */
  color?: string;
  /**
   * Lista inteligente: el filtro de contactos (etapa, duenoUserId, empresaId,
   * tagId, campos, compraEnDias, sinCompraDias, gastoMin, puntajeMin,
   * lastActivityDaysGt…). Sus miembros se calculan al usarla.
   */
  smartFilter?: ContactListSmartFilter;
  orgId?: string;
}

export interface UpdateContactListInput {
  name?: string;
  description?: string | null;
  color?: string;
  /** `null` = deja de ser inteligente. */
  smartFilter?: ContactListSmartFilter | null;
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
    input: UpdateContactListInput,
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
    query: { orgId?: string; page?: number; pageSize?: number } = {},
    options?: RequestOptions,
  ): Promise<Contact[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Contact[]>({
      method: "GET",
      path: `/organizations/${orgId}/contact-lists/${listId}/members`,
      query: rest,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Quita varios contactos de la lista (máx. 1000 por petición). */
  async removeMembers(
    listId: string,
    input: { contactIds: string[]; orgId?: string },
    options?: RequestOptions,
  ): Promise<{ removed: number }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ removed: number }>({
      method: "DELETE",
      path: `/organizations/${orgId}/contact-lists/${listId}/members`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Quita de la lista los miembros que coinciden con el filtro. */
  async removeByFilter(
    listId: string,
    input: ContactFilter & { orgId?: string },
    options?: RequestOptions,
  ): Promise<{ matched: number; removed: number }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ matched: number; removed: number }>({
      method: "POST",
      path: `/organizations/${orgId}/contact-lists/${listId}/remove-by-filter`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Vacía la lista: quita todos sus miembros. La lista se conserva. */
  async clear(
    listId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<{ removed: number }> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<{ removed: number }>({
      method: "POST",
      path: `/organizations/${orgId}/contact-lists/${listId}/clear`,
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

  /** Agrega a la lista los contactos que coinciden con el filtro. */
  async addByFilter(
    listId: string,
    input: ContactFilter & { orgId?: string },
    options?: RequestOptions,
  ): Promise<{ matched: number; added: number }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ matched: number; added: number }>({
      method: "POST",
      path: `/organizations/${orgId}/contact-lists/${listId}/add-by-filter`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /**
   * Importa un CSV de contactos y los deja dentro de esta lista (multipart,
   * campo `file`). Mismo `mapeo` que `contacts.import`.
   */
  async import(
    listId: string,
    input: ImportContactsCsvInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<ImportContactsResult & { matched: number; added: number }> {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError("FormData is not available in this runtime.");
    }
    const orgId = this.requireOrgId(input.orgId);
    const form = new FormData();
    form.append("file", input.file, input.filename ?? (input.file as File).name ?? "contacts.csv");
    if (input.mapeo) form.append("mapeo", JSON.stringify(input.mapeo));
    const res = await this.http.request<ImportContactsResult & { matched: number; added: number }>({
      method: "POST",
      path: `/organizations/${orgId}/contact-lists/${listId}/import`,
      query: {
        defaultCountry: input.defaultCountry,
        defaultOptIn: input.defaultOptIn,
      },
      body: form,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
