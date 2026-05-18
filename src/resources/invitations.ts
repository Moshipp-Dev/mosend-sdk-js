import type {
  AcceptInvitationInput,
  CreateInvitationInput,
  Invitation,
} from "../types/identity.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

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
}
