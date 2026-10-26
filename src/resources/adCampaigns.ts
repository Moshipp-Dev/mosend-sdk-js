import type { UpdateAdCampaignInput } from "../types/account.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/ad-campaigns` — anuncios Click-to-WhatsApp que han traído conversaciones. */
export class AdCampaignsResource extends Resource {
  /** Anuncios que han traído conversaciones, con lo que han vendido. */
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown[]>({
      method: "GET",
      path: `/organizations/${orgId}/ad-campaigns`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Dice qué significa un anuncio: qué vende, quién atiende, qué etiqueta. */
  async update(
    id: string,
    input: UpdateAdCampaignInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "PATCH",
      path: `/organizations/${orgId}/ad-campaigns/${id}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Quiénes llegaron por el anuncio y siguen sin comprar, con su ventana gratis de Meta. */
  async porSeguir(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/ad-campaigns/${id}/por-seguir`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
