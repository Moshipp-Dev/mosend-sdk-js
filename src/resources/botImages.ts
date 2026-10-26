import type { BotImage, UpdateBotImageInput, UploadBotImageInput } from "../types/botAgents.js";
import type { RequestOptions } from "../core/types.js";
import { MosendValidationError } from "../core/errors.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/bot/images` — librería de imágenes que el bot puede enviar. */
export class BotImagesResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<BotImage[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<BotImage[]>({
      method: "GET",
      path: `/organizations/${orgId}/bot/images`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Sube una imagen (multipart: `file`, `label?`, `caption?`). */
  async upload(input: UploadBotImageInput & { orgId?: string }, options?: RequestOptions): Promise<BotImage> {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError(
        "FormData is not available in this runtime. Use Node 18+ or pass a fetch implementation that includes it.",
      );
    }
    const orgId = this.requireOrgId(input.orgId);
    const form = new FormData();
    form.append("file", input.file, input.filename ?? (input.file as File).name ?? "image");
    if (input.label !== undefined) form.append("label", input.label);
    if (input.caption !== undefined) form.append("caption", input.caption);
    const res = await this.http.request<BotImage>({
      method: "POST",
      path: `/organizations/${orgId}/bot/images`,
      body: form,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateBotImageInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<BotImage> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<BotImage>({
      method: "PATCH",
      path: `/organizations/${orgId}/bot/images/${id}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /**
   * Quita la imagen de la librería. El archivo se conserva porque los mensajes
   * ya enviados lo referencian. `forzar` la quita aunque un agente la use.
   */
  async delete(
    id: string,
    query: { orgId?: string; forzar?: boolean } = {},
    options?: RequestOptions,
  ): Promise<unknown> {
    const orgId = this.requireOrgId(query.orgId);
    const res = await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/bot/images/${id}`,
      query: query.forzar ? { forzar: "true" } : {},
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
