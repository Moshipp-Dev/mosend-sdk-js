import type {
  CreateSignupLinkInput,
  SignupLink,
  UpdateSignupLinkInput,
} from "../types/messaging.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/**
 * Enlaces de suscripción (In-App Signup de Meta): deep links
 * `wa.me/<tel>/signup/<id>` con opt-in verificado. Al aceptar, el usuario
 * recibe el mensaje de confirmación (admite `{{promo_code}}`) y queda en la
 * messaging customer base de la WABA. No hay delete — se desactivan con
 * `update(id, { status: "DISABLED" })` y se pueden reactivar.
 */
export class SignupLinksResource extends Resource {
  async list(
    query: { orgId?: string; wabaId?: string } = {},
    options?: RequestOptions,
  ): Promise<SignupLink[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<SignupLink[]>({
      method: "GET",
      path: `/organizations/${orgId}/signup-links`,
      query: rest as Record<string, string | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(
    input: CreateSignupLinkInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<SignupLink> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<SignupLink>({
      method: "POST",
      path: `/organizations/${orgId}/signup-links`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(
    id: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<SignupLink> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<SignupLink>({
      method: "GET",
      path: `/organizations/${orgId}/signup-links/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateSignupLinkInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<SignupLink> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<SignupLink>({
      method: "PATCH",
      path: `/organizations/${orgId}/signup-links/${id}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Azúcar: desactiva el enlace (los clics muestran error hasta reactivar). */
  disable(
    id: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<SignupLink> {
    return this.update(id, { ...scope, status: "DISABLED" }, options);
  }

  /** Azúcar: reactiva un enlace desactivado. */
  enable(
    id: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<SignupLink> {
    return this.update(id, { ...scope, status: "ACTIVE" }, options);
  }
}
