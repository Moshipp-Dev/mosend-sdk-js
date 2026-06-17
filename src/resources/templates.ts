import type {
  CreateTemplateInput,
  Template,
  UpdateTemplateInput,
} from "../types/messaging.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";
import { iteratePages } from "../core/pagination.js";
import { MosendValidationError } from "../core/errors.js";

export interface ListTemplatesQuery {
  orgId?: string;
  cursor?: string;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "DISABLED";
  category?: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  language?: string;
}

export class TemplatesResource extends Resource {
  async list(query: ListTemplatesQuery = {}, options?: RequestOptions): Promise<Paginated<Template>> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/templates`,
      query: rest as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return toPaginated<Template>(res.data);
  }

  iterate(query: ListTemplatesQuery = {}, options?: RequestOptions): AsyncIterableIterator<Template> {
    return iteratePages<Template, ListTemplatesQuery>(
      (params) => this.list(params, options),
      query,
    );
  }

  async retrieve(templateId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Template> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Template>({
      method: "GET",
      path: `/organizations/${orgId}/templates/${templateId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(
    input: CreateTemplateInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Template> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Template>({
      method: "POST",
      path: `/organizations/${orgId}/templates`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Solo el array `components` es editable en una plantilla aprobada. */
  async update(
    templateId: string,
    input: UpdateTemplateInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Template> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Template>({
      method: "PATCH",
      path: `/organizations/${orgId}/templates/${templateId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(templateId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/templates/${templateId}`,
      ...(options ? { options } : {}),
    });
  }

  /** Re-sincroniza el estado de las plantillas desde Meta. */
  async sync(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Template[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Template[]>({
      method: "POST",
      path: `/organizations/${orgId}/templates/sync`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /**
   * Sube el media de cabecera (imagen/video/PDF) y devuelve el `header_handle`
   * que se usa en el ejemplo del componente HEADER al crear la plantilla.
   */
  async uploadHeaderMedia(
    input: { file: Blob | File; filename?: string; orgId?: string },
    options?: RequestOptions,
  ): Promise<{ header_handle: string }> {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError("FormData is not available in this runtime.");
    }
    const orgId = this.requireOrgId(input.orgId);
    const form = new FormData();
    const filename = input.filename ?? (input.file as File).name ?? "header";
    form.append("file", input.file, filename);
    const res = await this.http.request<{ header_handle: string }>({
      method: "POST",
      path: `/organizations/${orgId}/templates/upload-header-media`,
      body: form,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
