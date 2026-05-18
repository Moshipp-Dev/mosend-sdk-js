import type {
  CreateWhatsappLinkInput,
  UpdateWhatsappLinkInput,
  WhatsappLink,
  WhatsappLinkStats,
} from "../types/messaging.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export interface ListWhatsappLinksQuery {
  orgId?: string;
  phoneNumberId?: string;
  includeArchived?: boolean;
}

export class WhatsappLinksResource extends Resource {
  async list(
    query: ListWhatsappLinksQuery = {},
    options?: RequestOptions,
  ): Promise<WhatsappLink[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<WhatsappLink[]>({
      method: "GET",
      path: `/organizations/${orgId}/whatsapp-links`,
      query: rest as Record<string, string | boolean | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(
    input: CreateWhatsappLinkInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<WhatsappLink> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<WhatsappLink>({
      method: "POST",
      path: `/organizations/${orgId}/whatsapp-links`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<WhatsappLink> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<WhatsappLink>({
      method: "GET",
      path: `/organizations/${orgId}/whatsapp-links/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateWhatsappLinkInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<WhatsappLink> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<WhatsappLink>({
      method: "PATCH",
      path: `/organizations/${orgId}/whatsapp-links/${id}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/whatsapp-links/${id}`,
      ...(options ? { options } : {}),
    });
  }

  async stats(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<WhatsappLinkStats> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<WhatsappLinkStats>({
      method: "GET",
      path: `/organizations/${orgId}/whatsapp-links/${id}/stats`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async qr(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<{ url: string; svg?: string; png?: string }> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<{ url: string; svg?: string; png?: string }>({
      method: "GET",
      path: `/organizations/${orgId}/whatsapp-links/${id}/qr`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
