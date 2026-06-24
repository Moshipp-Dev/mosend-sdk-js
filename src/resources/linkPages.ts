import type {
  CreateLinkPageInput,
  CreateLinkPageItemInput,
  LinkPage,
  LinkPageItem,
  UpdateLinkPageInput,
  UpdateLinkPageItemInput,
} from "../types/linkPages.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { MosendValidationError } from "../core/errors.js";

export interface UploadLinkPageImageInput {
  file: Blob | File;
  filename?: string;
  orgId?: string;
}

export class LinkPagesResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<LinkPage[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<LinkPage[]>({
      method: "GET",
      path: `/organizations/${orgId}/link-pages`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async listArchived(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<LinkPage[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<LinkPage[]>({
      method: "GET",
      path: `/organizations/${orgId}/link-pages/archived`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<LinkPage> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<LinkPage>({
      method: "GET",
      path: `/organizations/${orgId}/link-pages/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(
    input: CreateLinkPageInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<LinkPage> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<LinkPage>({
      method: "POST",
      path: `/organizations/${orgId}/link-pages`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateLinkPageInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<LinkPage> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<LinkPage>({
      method: "PATCH",
      path: `/organizations/${orgId}/link-pages/${id}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Toggle de archivado (soft-delete reversible). */
  async archive(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<LinkPage> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<LinkPage>({
      method: "DELETE",
      path: `/organizations/${orgId}/link-pages/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async restore(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<LinkPage> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<LinkPage>({
      method: "POST",
      path: `/organizations/${orgId}/link-pages/${id}/restore`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async uploadCover(
    id: string,
    input: UploadLinkPageImageInput,
    options?: RequestOptions,
  ): Promise<LinkPage> {
    return this.uploadImage(id, "cover", input, options);
  }

  async uploadAvatar(
    id: string,
    input: UploadLinkPageImageInput,
    options?: RequestOptions,
  ): Promise<LinkPage> {
    return this.uploadImage(id, "avatar", input, options);
  }

  private async uploadImage(
    id: string,
    slot: "cover" | "avatar",
    input: UploadLinkPageImageInput,
    options?: RequestOptions,
  ): Promise<LinkPage> {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError("FormData is not available in this runtime.");
    }
    const orgId = this.requireOrgId(input.orgId);
    const form = new FormData();
    const filename = input.filename ?? (input.file as File).name ?? `${slot}.png`;
    form.append("file", input.file, filename);
    const res = await this.http.request<LinkPage>({
      method: "POST",
      path: `/organizations/${orgId}/link-pages/${id}/${slot}`,
      body: form,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Items ───────────────────────────────────────────────────────────────

  async addItem(
    pageId: string,
    input: CreateLinkPageItemInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<LinkPageItem> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<LinkPageItem>({
      method: "POST",
      path: `/organizations/${orgId}/link-pages/${pageId}/items`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async reorderItems(
    pageId: string,
    input: { itemIds: string[]; orgId?: string },
    options?: RequestOptions,
  ): Promise<LinkPage> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<LinkPage>({
      method: "PATCH",
      path: `/organizations/${orgId}/link-pages/${pageId}/items/reorder`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async updateItem(
    pageId: string,
    itemId: string,
    input: UpdateLinkPageItemInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<LinkPageItem> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<LinkPageItem>({
      method: "PATCH",
      path: `/organizations/${orgId}/link-pages/${pageId}/items/${itemId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async deleteItem(
    pageId: string,
    itemId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/link-pages/${pageId}/items/${itemId}`,
      ...(options ? { options } : {}),
    });
  }
}
