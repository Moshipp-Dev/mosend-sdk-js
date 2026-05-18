import type {
  InstallIntegrationInput,
  Integration,
  IntegrationCatalogItem,
  UpdateIntegrationInput,
} from "../types/misc.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class IntegrationsResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Integration[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Integration[]>({
      method: "GET",
      path: `/organizations/${orgId}/integrations`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async catalog(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<IntegrationCatalogItem[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<IntegrationCatalogItem[]>({
      method: "GET",
      path: `/organizations/${orgId}/integrations/catalog`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async catalogItem(
    integrationId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<IntegrationCatalogItem> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<IntegrationCatalogItem>({
      method: "GET",
      path: `/organizations/${orgId}/integrations/catalog/${integrationId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async install(
    input: InstallIntegrationInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Integration> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Integration>({
      method: "POST",
      path: `/organizations/${orgId}/integrations/install`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    integrationId: string,
    input: UpdateIntegrationInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Integration> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Integration>({
      method: "PATCH",
      path: `/organizations/${orgId}/integrations/catalog/${integrationId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async uninstall(
    integrationId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/integrations/catalog/${integrationId}`,
      ...(options ? { options } : {}),
    });
  }
}
