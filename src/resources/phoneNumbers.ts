import type { PhoneNumber } from "../types/waba.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";

export class PhoneNumbersResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Paginated<PhoneNumber>> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/phone-numbers`,
      ...(options ? { options } : {}),
    });
    return toPaginated<PhoneNumber>(res.data);
  }

  async retrieve(phoneNumberId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<PhoneNumber> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<PhoneNumber>({
      method: "GET",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
