import type { RechargeWalletInput, RechargeWalletResponse } from "../types/billing.js";
import type { GatewayWebhookAck, MercadoPagoWebhookBody } from "../types/payments.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class MercadoPagoResource extends Resource {
  async rechargeWallet(
    input: RechargeWalletInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<RechargeWalletResponse> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<RechargeWalletResponse>({
      method: "POST",
      path: `/organizations/${orgId}/wallet/recharge`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async payInvoice(
    invoiceId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<RechargeWalletResponse> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<RechargeWalletResponse>({
      method: "POST",
      path: `/organizations/${orgId}/billing/invoices/${invoiceId}/pay`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /**
   * `POST /webhooks/mercado-pago` (público): webhook IPN de Mercado Pago. Lo
   * llama MP de servidor a servidor; sirve para reenviar a Mosend una
   * notificación recibida en otro lado. La firma va en las cabeceras
   * `x-signature` y `x-request-id` (pásalas en `options.headers`).
   */
  async webhook(
    body: MercadoPagoWebhookBody,
    query: { type?: string; id?: string } = {},
    options?: RequestOptions,
  ): Promise<GatewayWebhookAck> {
    const res = await this.http.request<GatewayWebhookAck>({
      method: "POST",
      path: "/webhooks/mercado-pago",
      body,
      query: { ...query },
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
