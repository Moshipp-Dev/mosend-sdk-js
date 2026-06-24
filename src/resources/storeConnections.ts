import type {
  CreateStoreConnectionInput,
  StoreConnection,
  StoreEventLogEntry,
  StoreEventMapping,
  UpdateStoreConnectionInput,
  UpsertStoreMappingInput,
} from "../types/ecommerce.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class StoreConnectionsResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<StoreConnection[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<StoreConnection[]>({
      method: "GET",
      path: `/organizations/${orgId}/store-connections`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea una conexión de tienda. El `ingestSecret` se devuelve una sola vez. */
  async create(
    input: CreateStoreConnectionInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<StoreConnection> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<StoreConnection>({
      method: "POST",
      path: `/organizations/${orgId}/store-connections`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateStoreConnectionInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<StoreConnection> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<StoreConnection>({
      method: "PATCH",
      path: `/organizations/${orgId}/store-connections/${id}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/store-connections/${id}`,
      ...(options ? { options } : {}),
    });
  }

  /** Rota el ingestSecret de la conexión (devuelve el nuevo secreto). */
  async rotateSecret(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<StoreConnection> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<StoreConnection>({
      method: "POST",
      path: `/organizations/${orgId}/store-connections/${id}/rotate-secret`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async listMappings(
    id: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<StoreEventMapping[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<StoreEventMapping[]>({
      method: "GET",
      path: `/organizations/${orgId}/store-connections/${id}/mappings`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea o actualiza el mapeo evento→plantilla de la conexión. */
  async upsertMapping(
    id: string,
    input: UpsertStoreMappingInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<StoreEventMapping> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<StoreEventMapping>({
      method: "POST",
      path: `/organizations/${orgId}/store-connections/${id}/mappings`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Log de eventos recibidos de la tienda. */
  async events(
    id: string,
    query: { orgId?: string; limit?: number } = {},
    options?: RequestOptions,
  ): Promise<StoreEventLogEntry[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<StoreEventLogEntry[]>({
      method: "GET",
      path: `/organizations/${orgId}/store-connections/${id}/events`,
      query: rest as Record<string, number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
