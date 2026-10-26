import type {
  Conector,
  CreateConectorInput,
  EjecutarAccionInput,
  UpdateConectorInput,
} from "../types/botAgents.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/conectores` — sistemas externos (WHMCS, cPanel, WooCommerce…) que usa el bot. */
export class ConnectorsResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Conector[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Conector[]>({
      method: "GET",
      path: `/organizations/${orgId}/conectores`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Crea un conector; las credenciales se guardan cifradas y no vuelven en las respuestas. */
  async create(input: CreateConectorInput & { orgId?: string }, options?: RequestOptions): Promise<Conector> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Conector>({
      method: "POST",
      path: `/organizations/${orgId}/conectores`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Catálogo cerrado de acciones por tipo de conector, con su nivel de riesgo. */
  async catalog(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/conectores/catalogo`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    conectorId: string,
    input: UpdateConectorInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Conector> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Conector>({
      method: "PATCH",
      path: `/organizations/${orgId}/conectores/${conectorId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(conectorId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<void>({
      method: "DELETE",
      path: `/organizations/${orgId}/conectores/${conectorId}`,
      ...(options ? { options } : {}),
    });
  }

  /** Prueba la conexión con una llamada de lectura inocua. */
  async test(conectorId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/conectores/${conectorId}/probar`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Ejecuta una acción de lectura del catálogo. */
  async execute(
    conectorId: string,
    input: EjecutarAccionInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/conectores/${conectorId}/ejecutar`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Acciones sensibles que el bot pidió y esperan aprobación de una persona. */
  async listApprovals(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown[]>({
      method: "GET",
      path: `/organizations/${orgId}/conectores/aprobaciones`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Aprueba y EJECUTA la acción sensible; el cliente recibe aviso en su chat. */
  async approve(accionId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/conectores/aprobaciones/${accionId}/aprobar`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Rechaza la acción sensible; el cliente recibe aviso y espera a un asesor. */
  async reject(accionId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/conectores/aprobaciones/${accionId}/rechazar`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
