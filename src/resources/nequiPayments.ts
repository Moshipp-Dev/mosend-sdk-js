import type {
  CreateNequiPushInput,
  CreateNequiQrInput,
  NequiEnabled,
  NequiPaymentCancelled,
  NequiPaymentState,
  NequiPushCreated,
  NequiQrCreated,
} from "../types/payments.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/billing/nequi` — pagar facturas o recargar saldo con Nequi (push o QR). */
export class NequiPaymentsResource extends Resource {
  private async call<T>(
    method: "GET" | "POST",
    orgId: string | undefined,
    sub: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const id = this.requireOrgId(orgId);
    const res = await this.http.request<T>({
      method,
      path: `/organizations/${id}/billing/nequi${sub}`,
      ...(body !== undefined ? { body } : {}),
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  enabled(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<NequiEnabled> {
    return this.call("GET", scope.orgId, "/enabled", undefined, options);
  }

  /** Nequi envía la solicitud de pago a la app del celular indicado. */
  createPush(
    input: CreateNequiPushInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<NequiPushCreated> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/push", body, options);
  }

  /** QR dinámico de Nequi por el monto. */
  createQr(
    input: CreateNequiQrInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<NequiQrCreated> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/qr", body, options);
  }

  /** Consulta en vivo a Nequi si el pago sigue pendiente. */
  status(
    paymentId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<NequiPaymentState> {
    return this.call("GET", scope.orgId, `/${paymentId}/status`, undefined, options);
  }

  cancel(
    paymentId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<NequiPaymentCancelled> {
    return this.call("POST", scope.orgId, `/${paymentId}/cancel`, undefined, options);
  }
}
