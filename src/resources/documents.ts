import type {
  CreateFolderInput,
  Document,
  DocumentFolder,
  DocumentStorageUsage,
  DocumentViewUrl,
  DocumentVisibility,
  EditorStatus,
  ListDocumentsQuery,
  SendDocumentInput,
} from "../types/documents.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { MosendValidationError } from "../core/errors.js";

export interface UploadDocumentInput {
  file: Blob | File;
  filename?: string;
  name?: string;
  folderId?: string;
  visibility?: DocumentVisibility;
  orgId?: string;
}

export class DocumentsResource extends Resource {
  async editorStatus(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<EditorStatus> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<EditorStatus>({
      method: "GET",
      path: `/organizations/${orgId}/documents/editor/status`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Carpetas ──────────────────────────────────────────────────────────

  async listFolders(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<DocumentFolder[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<DocumentFolder[]>({
      method: "GET",
      path: `/organizations/${orgId}/documents/folders`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async createFolder(
    input: CreateFolderInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<DocumentFolder> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<DocumentFolder>({
      method: "POST",
      path: `/organizations/${orgId}/documents/folders`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async setFolderVisibility(
    folderId: string,
    input: { visibility: DocumentVisibility; orgId?: string },
    options?: RequestOptions,
  ): Promise<DocumentFolder> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<DocumentFolder>({
      method: "PATCH",
      path: `/organizations/${orgId}/documents/folders/${folderId}/visibility`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async renameFolder(
    folderId: string,
    input: { name: string; orgId?: string },
    options?: RequestOptions,
  ): Promise<DocumentFolder> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<DocumentFolder>({
      method: "PATCH",
      path: `/organizations/${orgId}/documents/folders/${folderId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async deleteFolder(folderId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/documents/folders/${folderId}`,
      ...(options ? { options } : {}),
    });
  }

  // ─── Documentos ────────────────────────────────────────────────────────

  async list(query: ListDocumentsQuery = {}, options?: RequestOptions): Promise<Document[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Document[]>({
      method: "GET",
      path: `/organizations/${orgId}/documents`,
      query: rest as Record<string, string | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async listTrash(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Document[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Document[]>({
      method: "GET",
      path: `/organizations/${orgId}/documents/trash`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async storage(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<DocumentStorageUsage> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<DocumentStorageUsage>({
      method: "GET",
      path: `/organizations/${orgId}/documents/storage`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async saveFromMessage(
    input: { messageId: string; orgId?: string },
    options?: RequestOptions,
  ): Promise<Document> {
    const orgId = this.requireOrgId(input.orgId);
    const res = await this.http.request<Document>({
      method: "POST",
      path: `/organizations/${orgId}/documents/from-message`,
      body: { messageId: input.messageId },
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async upload(input: UploadDocumentInput, options?: RequestOptions): Promise<Document> {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError("FormData is not available in this runtime.");
    }
    const orgId = this.requireOrgId(input.orgId);
    const form = new FormData();
    const filename = input.filename ?? (input.file as File).name ?? "document";
    form.append("file", input.file, filename);
    if (input.name !== undefined) form.append("name", input.name);
    if (input.visibility !== undefined) form.append("visibility", input.visibility);
    const query: Record<string, string | undefined> = {};
    if (input.folderId !== undefined) query["folderId"] = input.folderId;
    const res = await this.http.request<Document>({
      method: "POST",
      path: `/organizations/${orgId}/documents`,
      body: form,
      query,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async setVisibility(
    docId: string,
    input: { visibility: DocumentVisibility; orgId?: string },
    options?: RequestOptions,
  ): Promise<Document> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Document>({
      method: "PATCH",
      path: `/organizations/${orgId}/documents/${docId}/visibility`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async viewUrl(docId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<DocumentViewUrl> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<DocumentViewUrl>({
      method: "GET",
      path: `/organizations/${orgId}/documents/${docId}/view`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async rename(
    docId: string,
    input: { name: string; orgId?: string },
    options?: RequestOptions,
  ): Promise<Document> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Document>({
      method: "PATCH",
      path: `/organizations/${orgId}/documents/${docId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async move(
    docId: string,
    input: { folderId: string | null; orgId?: string },
    options?: RequestOptions,
  ): Promise<Document> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Document>({
      method: "PATCH",
      path: `/organizations/${orgId}/documents/${docId}/move`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async send(
    docId: string,
    input: SendDocumentInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/documents/${docId}/send`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async restore(docId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Document> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Document>({
      method: "POST",
      path: `/organizations/${orgId}/documents/${docId}/restore`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Borrado suave: manda el documento a la papelera. */
  async delete(docId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/documents/${docId}`,
      ...(options ? { options } : {}),
    });
  }

  /** Borrado definitivo (purge). */
  async purge(docId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/documents/${docId}/purge`,
      ...(options ? { options } : {}),
    });
  }
}
