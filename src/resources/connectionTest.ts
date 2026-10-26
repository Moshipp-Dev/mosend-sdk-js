import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/phone-numbers/:id/prueba-de-conexion` — prueba de ida y vuelta de un número. */
export class ConnectionTestResource extends Resource {
  /** Abre la prueba: devuelve el texto y el enlace para escribirle al número; al llegar, se responde solo. */
  async start(phoneNumberId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}/prueba-de-conexion`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Estado: esperando, recibido, respondido, fallo o vencida. */
  async status(
    phoneNumberId: string,
    codigo: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}/prueba-de-conexion/${codigo}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
