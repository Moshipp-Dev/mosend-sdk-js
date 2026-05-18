import type { CreateCreditNoteInput, CreditNote } from "../types/billing.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export interface ListCreditNotesQuery {
  orgId?: string;
  limit?: number;
}

export class CreditNotesResource extends Resource {
  async create(input: CreateCreditNoteInput, options?: RequestOptions): Promise<CreditNote> {
    const res = await this.http.request<CreditNote>({
      method: "POST",
      path: `/admin/credit-notes`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async list(query: ListCreditNotesQuery = {}, options?: RequestOptions): Promise<CreditNote[]> {
    const res = await this.http.request<CreditNote[]>({
      method: "GET",
      path: `/admin/credit-notes`,
      query: query as Record<string, string | number | undefined>,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(id: string, options?: RequestOptions): Promise<CreditNote> {
    const res = await this.http.request<CreditNote>({
      method: "GET",
      path: `/admin/credit-notes/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async void(id: string, options?: RequestOptions): Promise<CreditNote> {
    const res = await this.http.request<CreditNote>({
      method: "POST",
      path: `/admin/credit-notes/${id}/void`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async pdf(id: string, options?: RequestOptions): Promise<{ url: string }> {
    const res = await this.http.request<{ url: string }>({
      method: "GET",
      path: `/admin/credit-notes/${id}/pdf`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async regeneratePdf(id: string, options?: RequestOptions): Promise<{ url: string }> {
    const res = await this.http.request<{ url: string }>({
      method: "POST",
      path: `/admin/credit-notes/${id}/regenerate-pdf`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
