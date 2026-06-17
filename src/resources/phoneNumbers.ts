import type {
  CreatePhoneNumberInput,
  PhoneNumber,
  RegisterPhoneInput,
  RequestRegistrationCodeInput,
  VerifyRegistrationCodeInput,
} from "../types/waba.js";
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

  async create(
    input: CreatePhoneNumberInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<PhoneNumber> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<PhoneNumber>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Re-sincroniza los números desde Meta. */
  async sync(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<PhoneNumber[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<PhoneNumber[]>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/sync`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Archiva (soft-delete) un número. */
  async delete(phoneNumberId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}`,
      ...(options ? { options } : {}),
    });
  }

  async restore(phoneNumberId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<PhoneNumber> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<PhoneNumber>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}/restore`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Borrado definitivo (hard delete). */
  async purge(phoneNumberId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}/purge`,
      ...(options ? { options } : {}),
    });
  }

  async requestRegistrationCode(
    phoneId: string,
    input: RequestRegistrationCodeInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<void> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneId}/registration/request-code`,
      body,
      ...(options ? { options } : {}),
    });
  }

  async verifyRegistrationCode(
    phoneId: string,
    input: VerifyRegistrationCodeInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<void> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneId}/registration/verify-code`,
      body,
      ...(options ? { options } : {}),
    });
  }

  async register(
    phoneId: string,
    input: RegisterPhoneInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<void> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneId}/registration/register`,
      body,
      ...(options ? { options } : {}),
    });
  }

  async deregister(phoneId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneId}/registration/deregister`,
      ...(options ? { options } : {}),
    });
  }
}
