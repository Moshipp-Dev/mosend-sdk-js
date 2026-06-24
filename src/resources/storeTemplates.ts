import type {
  InstallStoreTemplateInput,
  StoreTemplateCatalogItem,
  StoreTemplateStatusItem,
  StoreTemplateStatusQuery,
  StoreTemplateVariable,
} from "../types/ecommerce.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class StoreTemplatesResource extends Resource {
  /** Catálogo de plantillas de e-commerce listas para instalar. */
  async catalog(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<StoreTemplateCatalogItem[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<StoreTemplateCatalogItem[]>({
      method: "GET",
      path: `/organizations/${orgId}/store-templates/catalog`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Variables disponibles para el editor de plantillas. */
  async variables(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<StoreTemplateVariable[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<StoreTemplateVariable[]>({
      method: "GET",
      path: `/organizations/${orgId}/store-templates/variables`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Estado de instalación/aprobación de cada plantilla del catálogo para una WABA. */
  async status(
    query: StoreTemplateStatusQuery = {},
    options?: RequestOptions,
  ): Promise<StoreTemplateStatusItem[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<StoreTemplateStatusItem[]>({
      method: "GET",
      path: `/organizations/${orgId}/store-templates/status`,
      query: rest as Record<string, string | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea una plantilla del catálogo en Meta (y opcionalmente el mapeo). */
  async install(
    input: InstallStoreTemplateInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/store-templates/install`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
