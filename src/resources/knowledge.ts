import type {
  KnowledgeDocument,
  UpdateKnowledgeTagsInput,
  UpdateKnowledgeTitleInput,
  UploadKnowledgeInput,
} from "../types/bot.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { MosendValidationError } from "../core/errors.js";
import type {
  DateRangeQuery,
  KnowledgeAssignmentInput,
  KnowledgeNoteInput,
  KnowledgeSearchInput,
  KnowledgeUrlSourceInput,
} from "../types/botAgents.js";

export class KnowledgeResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<KnowledgeDocument[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<KnowledgeDocument[]>({
      method: "GET",
      path: `/organizations/${orgId}/bot/knowledge`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(
    id: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<KnowledgeDocument> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<KnowledgeDocument>({
      method: "GET",
      path: `/organizations/${orgId}/bot/knowledge/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async upload(
    input: UploadKnowledgeInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<KnowledgeDocument> {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError(
        "FormData is not available in this runtime. Use Node 18+ or pass a fetch implementation that includes it.",
      );
    }
    const orgId = this.requireOrgId(input.orgId);
    const form = new FormData();
    const filename = input.filename ?? (input.file as File).name ?? "document";
    form.append("file", input.file, filename);
    if (input.title) form.append("title", input.title);
    if (input.tags && input.tags.length > 0) form.append("tags", input.tags.join(","));

    const res = await this.http.request<KnowledgeDocument>({
      method: "POST",
      path: `/organizations/${orgId}/bot/knowledge`,
      body: form,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async updateTitle(
    id: string,
    input: UpdateKnowledgeTitleInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<KnowledgeDocument> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<KnowledgeDocument>({
      method: "PATCH",
      path: `/organizations/${orgId}/bot/knowledge/${id}/title`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async updateTags(
    id: string,
    input: UpdateKnowledgeTagsInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<KnowledgeDocument> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<KnowledgeDocument>({
      method: "PATCH",
      path: `/organizations/${orgId}/bot/knowledge/${id}/tags`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async reprocess(
    id: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<KnowledgeDocument> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<KnowledgeDocument>({
      method: "POST",
      path: `/organizations/${orgId}/bot/knowledge/${id}/reprocess`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/bot/knowledge/${id}`,
      ...(options ? { options } : {}),
    });
  }

  /** Qué buscó el bot en la memoria: consultas, tasa de respuesta, preguntas sin respuesta, uso por agente y documento. */
  async insights(query: DateRangeQuery & { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/bot/knowledge/insights`,
      query: rest,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Búsqueda semántica (RAG): el mismo retrieval que usa el bot IA. */
  async search(input: KnowledgeSearchInput & { orgId?: string }, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/bot/knowledge/search`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea una nota escrita en el panel; se procesa como un documento. */
  async createNote(input: KnowledgeNoteInput & { orgId?: string }, options?: RequestOptions): Promise<KnowledgeDocument> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<KnowledgeDocument>({
      method: "POST",
      path: `/organizations/${orgId}/bot/knowledge/notes`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Edita una nota; si cambia el texto se vuelve a procesar. */
  async updateNote(id: string, input: KnowledgeNoteInput & { orgId?: string }, options?: RequestOptions): Promise<KnowledgeDocument> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<KnowledgeDocument>({
      method: "PATCH",
      path: `/organizations/${orgId}/bot/knowledge/notes/${id}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Importa una página web pública; con `syncEveryHours` se vuelve a leer periódicamente. */
  async createFromUrl(input: KnowledgeUrlSourceInput & { orgId?: string }, options?: RequestOptions): Promise<KnowledgeDocument> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<KnowledgeDocument>({
      method: "POST",
      path: `/organizations/${orgId}/bot/knowledge/url`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Qué agentes leen el documento, o si lo leen todos (`compartido`). */
  async updateAgents(id: string, input: KnowledgeAssignmentInput & { orgId?: string }, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "PATCH",
      path: `/organizations/${orgId}/bot/knowledge/${id}/agentes`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
