import type {
  AcceptInvitationInput,
  CreateInvitationInput,
  Invitation,
  LoginResponse,
} from "../types/identity.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import type {
  AcceptSignupInput,
  ActivateAccountInput,
  BulkInvitationInput,
  PreregisterInput,
} from "../types/account.js";

export class InvitationsResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Invitation[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Invitation[]>({
      method: "GET",
      path: `/organizations/${orgId}/invitations`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(
    input: CreateInvitationInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Invitation> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Invitation>({
      method: "POST",
      path: `/organizations/${orgId}/invitations`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async revoke(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/invitations/${id}`,
      ...(options ? { options } : {}),
    });
  }

  async resend(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Invitation> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Invitation>({
      method: "POST",
      path: `/organizations/${orgId}/invitations/${id}/resend`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async accept(input: AcceptInvitationInput, options?: RequestOptions): Promise<{ organizationId: string; membershipId: string }> {
    const res = await this.http.request<{ organizationId: string; membershipId: string }>({
      method: "POST",
      path: `/invitations/accept`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Datos públicos de una invitación por token (org, rol, email, si ya tiene cuenta). Sin autenticación. */
  async lookup(token: string, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/invitations/lookup`,
      query: { token },
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Datos públicos de una activación por token (org, rol, email, nombre). Sin autenticación. */
  async activateLookup(token: string, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/invitations/activate-lookup`,
      query: { token },
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Acepta la invitación creando la cuenta en el mismo paso; devuelve una sesión lista para usar. */
  async acceptSignup(input: AcceptSignupInput, options?: RequestOptions): Promise<LoginResponse> {
    const res = await this.http.request<LoginResponse>({
      method: "POST",
      path: `/invitations/accept-signup`,
      body: input,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Activa una cuenta preregistrada definiendo su contraseña; devuelve una sesión lista para usar. */
  async activate(input: ActivateAccountInput, options?: RequestOptions): Promise<LoginResponse> {
    const res = await this.http.request<LoginResponse>({
      method: "POST",
      path: `/invitations/activate`,
      body: input,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Invita a varios correos con un mismo rol. Omite los que ya son miembros o ya tienen invitación pendiente. */
  async bulk(input: BulkInvitationInput & { orgId?: string }, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/invitations/bulk`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea las cuentas (pendientes) y membresías al invitar, ocupando asiento; cada agente solo define su contraseña. */
  async preregister(input: PreregisterInput & { orgId?: string }, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/invitations/preregister`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Regenera el enlace de activación de un miembro pendiente; con `notify` reenvía el correo. */
  async reactivate(membershipId: string, input: { notify?: boolean } & { orgId?: string }, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/invitations/activation/${membershipId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Genera un enlace de aceptación fresco (rota el token) sin enviar correo. Falla si ya fue aceptada. */
  async link(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/invitations/${id}/link`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
