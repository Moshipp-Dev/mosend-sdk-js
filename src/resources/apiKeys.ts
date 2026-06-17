import type {
  ApiKey,
  CreateApiKeyInput,
  CreateApiKeyResponse,
  UpdateApiKeyInput,
} from "../types/identity.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";

export class ApiKeysResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Paginated<ApiKey>> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/api-keys`,
      ...(options ? { options } : {}),
    });
    return toPaginated<ApiKey>(res.data);
  }

  async create(
    input: CreateApiKeyInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<CreateApiKeyResponse> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<CreateApiKeyResponse>({
      method: "POST",
      path: `/organizations/${orgId}/api-keys`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    apiKeyId: string,
    input: UpdateApiKeyInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<ApiKey> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<ApiKey>({
      method: "PATCH",
      path: `/organizations/${orgId}/api-keys/${apiKeyId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async revoke(apiKeyId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/api-keys/${apiKeyId}`,
      ...(options ? { options } : {}),
    });
  }
}
