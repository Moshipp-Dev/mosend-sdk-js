import type {
  CreateOrganizationInput,
  Organization,
  UpdateOrganizationInput,
} from "../types/identity.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import type { SetAiLimitsInput } from "../types/account.js";

export class OrganizationsResource extends Resource {
  async list(options?: RequestOptions): Promise<Organization[]> {
    const res = await this.http.request<Organization[]>({
      method: "GET",
      path: `/organizations`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(input: CreateOrganizationInput, options?: RequestOptions): Promise<Organization> {
    const res = await this.http.request<Organization>({
      method: "POST",
      path: `/organizations`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async suggestSlug(name: string, options?: RequestOptions): Promise<{ slug: string }> {
    const res = await this.http.request<{ slug: string }>({
      method: "GET",
      path: `/organizations/slug-suggest`,
      query: { name },
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async isSlugAvailable(slug: string, options?: RequestOptions): Promise<{ available: boolean }> {
    const res = await this.http.request<{ available: boolean }>({
      method: "GET",
      path: `/organizations/slug-available`,
      query: { slug },
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(id: string, options?: RequestOptions): Promise<Organization> {
    const res = await this.http.request<Organization>({
      method: "GET",
      path: `/organizations/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateOrganizationInput,
    options?: RequestOptions,
  ): Promise<Organization> {
    const res = await this.http.request<Organization>({
      method: "PATCH",
      path: `/organizations/${id}`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Cupo del usuario para crear organizaciones. */
  async quota(options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/quota`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Motivo de la suspensión y facturas pendientes de pago. */
  async suspension(id: string, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${id}/suspension`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Estado del grupo de facturación de la organización. */
  async billingGroup(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/billing-group`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Compartir facturación: enlaza la org como hija de una matriz (solo owner). */
  async linkBillingGroup(input: { parentOrgId: string } & { orgId?: string }, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/billing-group/link`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Independiza la org de su matriz; pasa a plan free (solo owner). */
  async unlinkBillingGroup(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/billing-group/unlink`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Tope de gasto de IA de una organización del grupo (solo la matriz, solo el dueño). */
  async setAiLimits(targetOrgId: string, input: SetAiLimitsInput & { orgId?: string }, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "PATCH",
      path: `/organizations/${orgId}/billing-group/${targetOrgId}/ai-limits`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
