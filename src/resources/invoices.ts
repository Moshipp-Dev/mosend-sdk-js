import type { Invoice, InvoicePdfResponse } from "../types/billing.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class InvoicesResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Invoice[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Invoice[]>({
      method: "GET",
      path: `/organizations/${orgId}/invoices`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Invoice> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Invoice>({
      method: "GET",
      path: `/organizations/${orgId}/invoices/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async pdf(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<InvoicePdfResponse> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<InvoicePdfResponse>({
      method: "GET",
      path: `/organizations/${orgId}/invoices/${id}/pdf`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
