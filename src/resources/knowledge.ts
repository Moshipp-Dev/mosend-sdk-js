import type {
  KnowledgeDocument,
  UpdateKnowledgeTagsInput,
  UpdateKnowledgeTitleInput,
  UploadKnowledgeInput,
} from "../types/bot.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { MosendValidationError } from "../core/errors.js";

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
}
