import type { SendStickerInput, Sticker } from "../types/messaging.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { MosendValidationError } from "../core/errors.js";

export interface UploadStickerInput {
  file: Blob | File;
  filename?: string;
  orgId?: string;
}

export class StickersResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Sticker[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Sticker[]>({
      method: "GET",
      path: `/organizations/${orgId}/stickers`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async upload(input: UploadStickerInput, options?: RequestOptions): Promise<Sticker> {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError("FormData is not available in this runtime.");
    }
    const orgId = this.requireOrgId(input.orgId);
    const form = new FormData();
    const filename = input.filename ?? (input.file as File).name ?? "sticker.webp";
    form.append("file", input.file, filename);
    const res = await this.http.request<Sticker>({
      method: "POST",
      path: `/organizations/${orgId}/stickers/upload`,
      body: form,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async fromMessage(
    messageId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<Sticker> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Sticker>({
      method: "POST",
      path: `/organizations/${orgId}/stickers/from-message/${messageId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async send(
    stickerId: string,
    input: SendStickerInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<{ messageId: string }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ messageId: string }>({
      method: "POST",
      path: `/organizations/${orgId}/stickers/${stickerId}/send`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(stickerId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/stickers/${stickerId}`,
      ...(options ? { options } : {}),
    });
  }
}
