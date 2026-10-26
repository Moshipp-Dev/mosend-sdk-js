import type {
  BrebInfo,
  CreatePaymentReportInput,
  PaymentReport,
  PaymentReportWithInvoice,
  SignedUrl,
} from "../types/payments.js";
import type { RequestOptions } from "../core/types.js";
import { MosendValidationError } from "../core/errors.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/billing/payment-reports` — pagos por transferencia Bre-B/QR con comprobante. */
export class PaymentReportsResource extends Resource {
  /** Llave Bre-B / QR de cobro de Mosend. */
  async brebInfo(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<BrebInfo> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<BrebInfo>({
      method: "GET",
      path: `/organizations/${orgId}/billing/payment-reports/breb-info`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Reporta un pago (multipart: `receipt` + monto) contra una factura o como recarga de saldo. */
  async create(
    input: CreatePaymentReportInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<PaymentReport> {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError("FormData is not available in this runtime.");
    }
    const orgId = this.requireOrgId(input.orgId);
    const form = new FormData();
    form.append(
      "receipt",
      input.receipt,
      input.filename ?? (input.receipt as File).name ?? "comprobante",
    );
    form.append("amount", String(input.amount));
    if (input.invoiceId !== undefined) form.append("invoiceId", input.invoiceId);
    if (input.note !== undefined) form.append("note", input.note);
    const res = await this.http.request<PaymentReport>({
      method: "POST",
      path: `/organizations/${orgId}/billing/payment-reports`,
      body: form,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async list(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<PaymentReportWithInvoice[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<PaymentReportWithInvoice[]>({
      method: "GET",
      path: `/organizations/${orgId}/billing/payment-reports`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** URL firmada (10 minutos) del comprobante. */
  async receiptUrl(
    reportId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<SignedUrl> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<SignedUrl>({
      method: "GET",
      path: `/organizations/${orgId}/billing/payment-reports/${reportId}/receipt`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
