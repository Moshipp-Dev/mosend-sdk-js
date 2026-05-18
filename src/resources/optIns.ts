import type { CreateOptInInput, OptIn } from "../types/messaging.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class OptInsResource extends Resource {
  async list(
    contactId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<OptIn[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<OptIn[]>({
      method: "GET",
      path: `/organizations/${orgId}/contacts/${contactId}/opt-ins`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(
    contactId: string,
    input: CreateOptInInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<OptIn> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<OptIn>({
      method: "POST",
      path: `/organizations/${orgId}/contacts/${contactId}/opt-ins`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
