import type {
  CatalogConnectResult,
  CatalogProduct,
  CatalogSyncResult,
  CommerceSettings,
  UpdateCommerceSettingsInput,
} from "../types/orders.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/catalog` — catálogo de Meta Commerce conectado a la WABA. */
export class CatalogsResource extends Resource {
  /** Detecta el catálogo de la WABA, lo guarda y sincroniza sus productos. */
  async connect(
    wabaId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<CatalogConnectResult> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<CatalogConnectResult>({
      method: "POST",
      path: `/organizations/${orgId}/catalog/waba/${wabaId}/connect`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async sync(
    wabaId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<CatalogSyncResult> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<CatalogSyncResult>({
      method: "POST",
      path: `/organizations/${orgId}/catalog/waba/${wabaId}/sync`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Productos cacheados del catálogo. */
  async listProducts(
    query: { catalogId?: string; orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<CatalogProduct[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<CatalogProduct[]>({
      method: "GET",
      path: `/organizations/${orgId}/catalog/products`,
      query: rest,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async getCommerceSettings(
    query: { phoneNumberId: string; orgId?: string },
    options?: RequestOptions,
  ): Promise<CommerceSettings> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<CommerceSettings>({
      method: "GET",
      path: `/organizations/${orgId}/catalog/commerce-settings`,
      query: rest,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Devuelve la respuesta de Meta tal cual (`{ success }`). */
  async updateCommerceSettings(
    input: UpdateCommerceSettingsInput & { phoneNumberId: string; orgId?: string },
    options?: RequestOptions,
  ): Promise<{ success?: boolean }> {
    const { orgId: scopedOrgId, phoneNumberId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ success?: boolean }>({
      method: "PATCH",
      path: `/organizations/${orgId}/catalog/commerce-settings`,
      query: { phoneNumberId },
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
