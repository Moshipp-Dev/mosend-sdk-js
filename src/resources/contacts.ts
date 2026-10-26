import type {
  Contact,
  ContactCrmFilter,
  ContactFilter,
  ContactNote,
  CreateContactInput,
  CreateContactNoteInput,
  ImportContactsCsvInput,
  ImportContactsResult,
  ImportPreview,
  NoteAttachment,
  UpdateContactInput,
  UpdateContactNoteInput,
} from "../types/messaging.js";
import type { Task } from "../types/tasks.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";
import { MosendValidationError } from "../core/errors.js";

/** Filtros del listado y de la exportación de contactos (incluye los del CRM). */
export interface ContactsFilterQuery extends ContactFilter, ContactCrmFilter {
  orgId?: string;
  /** ISO-8601: solo contactos creados desde esa fecha. */
  createdSince?: string;
}

export interface ListContactsQuery extends ContactsFilterQuery {
  page?: number;
  pageSize?: number;
}

/** Una fila de la exportación de contactos. */
export type ExportedContact = Record<string, unknown> & { id: string; waId?: string | null };

type QueryValue = string | number | boolean | undefined;

/** `campos` viaja como JSON en la query (`{"segmento":"VIP"}`). */
function filterToQuery(rest: Omit<ContactsFilterQuery, "orgId">): Record<string, QueryValue> {
  const { campos, ...plain } = rest;
  return {
    ...(plain as Record<string, QueryValue>),
    ...(campos && Object.keys(campos).length ? { campos: JSON.stringify(campos) } : {}),
  };
}

function csvForm(file: Blob | File, filename: string | undefined): FormData {
  if (typeof FormData === "undefined") {
    throw new MosendValidationError("FormData is not available in this runtime.");
  }
  const form = new FormData();
  form.append("file", file, filename ?? (file as File).name ?? "contacts.csv");
  return form;
}

export class ContactsResource extends Resource {
  async list(query: ListContactsQuery = {}, options?: RequestOptions): Promise<Paginated<Contact>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/contacts`,
      query: filterToQuery(rest),
      ...(options ? { options } : {}),
    });
    return toPaginated<Contact>(res.data);
  }

  /**
   * Todos los contactos que coinciden con los filtros (los mismos del
   * listado), sin paginar. `truncado` indica que se alcanzó el tope.
   */
  async export(
    query: ContactsFilterQuery = {},
    options?: RequestOptions,
  ): Promise<{ filas: ExportedContact[]; truncado: boolean }> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ filas: ExportedContact[]; truncado: boolean }>({
      method: "GET",
      path: `/organizations/${orgId}/contacts/export`,
      query: filterToQuery(rest),
      ...(options ? { options } : {}),
    });
    return res.data;
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

  /**
   * Importa contactos desde un CSV (multipart, campo `file`). `mapeo` dice a
   * qué destino va cada columna; sin él, las columnas se reconocen por nombre.
   * Usa `previewImport` para ver las columnas y el mapeo sugerido.
   */
  async import(
    input: ImportContactsCsvInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<ImportContactsResult> {
    const orgId = this.requireOrgId(input.orgId);
    const form = csvForm(input.file, input.filename);
    if (input.mapeo) form.append("mapeo", JSON.stringify(input.mapeo));
    const res = await this.http.request<ImportContactsResult>({
      method: "POST",
      path: `/organizations/${orgId}/contacts/import`,
      query: {
        defaultCountry: input.defaultCountry,
        defaultOptIn: input.defaultOptIn,
      },
      body: form,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Vista previa de un CSV: columnas, filas de muestra y mapeo sugerido. No guarda nada. */
  async previewImport(
    input: { file: Blob | File; filename?: string; orgId?: string },
    options?: RequestOptions,
  ): Promise<ImportPreview> {
    const orgId = this.requireOrgId(input.orgId);
    const res = await this.http.request<ImportPreview>({
      method: "POST",
      path: `/organizations/${orgId}/contacts/import/preview`,
      body: csvForm(input.file, input.filename),
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

  /**
   * Sube un archivo (máx. 10 MB) para adjuntarlo a una nota. Devuelve el
   * adjunto que se pasa en `adjuntos` al crear o editar la nota.
   */
  async uploadNoteAttachment(
    contactId: string,
    input: { file: Blob | File; filename?: string; orgId?: string },
    options?: RequestOptions,
  ): Promise<NoteAttachment> {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError("FormData is not available in this runtime.");
    }
    const orgId = this.requireOrgId(input.orgId);
    const form = new FormData();
    form.append("file", input.file, input.filename ?? (input.file as File).name ?? "adjunto");
    const res = await this.http.request<NoteAttachment>({
      method: "POST",
      path: `/organizations/${orgId}/contacts/${contactId}/notes/adjuntos`,
      body: form,
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
