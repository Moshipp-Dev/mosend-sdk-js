import type {
  ActualizarCampoInput,
  ActualizarClienteInput,
  ActualizarEmpresaInput,
  CampoDelCliente,
  ClientesMasivoInput,
  ConfiguracionCrm,
  CrearCampoInput,
  CrearEmpresaInput,
  Empresa,
  LineaDeTiempo,
} from "../types/crm.js";
import type { Contact } from "../types/messaging.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

type Scope = { orgId?: string | undefined };
type Query = Record<string, string | number | boolean | null | undefined>;

/**
 * CRM — ficha del cliente (todos los planes): campos definidos, dueño,
 * empresa, etapa, línea de tiempo, empresas y duplicados.
 * Rutas bajo `/organizations/:orgId/crm`.
 */
export class CrmResource extends Resource {
  private async pedir<T>(
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    scope: Scope,
    ruta: string,
    extra: { body?: unknown; query?: Query } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method,
      path: `/organizations/${orgId}/crm${ruta}`,
      ...(extra.body !== undefined ? { body: extra.body } : {}),
      ...(extra.query ? { query: extra.query } : {}),
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ── Configuración ──
  getSettings(scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<ConfiguracionCrm>("GET", scope, "/configuracion", {}, options);
  }

  updateSettings(
    input: Partial<Omit<ConfiguracionCrm, "avanzado">> & Scope,
    options?: RequestOptions,
  ) {
    const { orgId, ...body } = input;
    return this.pedir<ConfiguracionCrm>("PUT", { orgId }, "/configuracion", { body }, options);
  }

  // ── Campos del cliente ──
  listFields(scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<CampoDelCliente[]>("GET", scope, "/campos", {}, options);
  }

  /** Atributos sueltos que ya usan los contactos y aún no son un campo. */
  suggestedFields(scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<{ clave: string; usos: number; ejemplo: string | null; delBot: boolean }[]>(
      "GET",
      scope,
      "/campos/sugeridos",
      {},
      options,
    );
  }

  createField(input: CrearCampoInput & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<CampoDelCliente>("POST", { orgId }, "/campos", { body }, options);
  }

  updateField(id: string, input: ActualizarCampoInput & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<CampoDelCliente>("PATCH", { orgId }, `/campos/${id}`, { body }, options);
  }

  /** Archiva el campo; los valores de los contactos se conservan. */
  archiveField(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<{ ok: true }>("DELETE", scope, `/campos/${id}`, {}, options);
  }

  /** Junta claves repetidas («Numero», «Número» → «telefono»). */
  mergeFieldKeys(input: { de: string[]; a: string } & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<{ contactos: number }>(
      "POST",
      { orgId },
      "/campos/unificar",
      { body },
      options,
    );
  }

  // ── Clientes ──
  updateClient(contactId: string, input: ActualizarClienteInput & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<Contact>("PATCH", { orgId }, `/clientes/${contactId}`, { body }, options);
  }

  bulkUpdateClients(input: ClientesMasivoInput & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<{ contactos: number }>(
      "POST",
      { orgId },
      "/clientes/masivo",
      { body },
      options,
    );
  }

  getProfile(contactId: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<Record<string, unknown>>(
      "GET",
      scope,
      `/clientes/${contactId}/ficha`,
      {},
      options,
    );
  }

  getTimeline(
    contactId: string,
    params: { antes?: string; limite?: number } & Scope = {},
    options?: RequestOptions,
  ) {
    const { orgId, ...query } = params;
    return this.pedir<LineaDeTiempo>(
      "GET",
      { orgId },
      `/clientes/${contactId}/linea-de-tiempo`,
      { query },
      options,
    );
  }

  // ── Empresas ──
  listCompanies(
    params: { q?: string; duenoUserId?: string; page?: number; pageSize?: number } & Scope = {},
    options?: RequestOptions,
  ) {
    const { orgId, ...query } = params;
    return this.pedir<{ items: Empresa[]; total: number; page: number; pageSize: number }>(
      "GET",
      { orgId },
      "/empresas",
      { query },
      options,
    );
  }

  getCompany(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<Empresa & Record<string, unknown>>(
      "GET",
      scope,
      `/empresas/${id}`,
      {},
      options,
    );
  }

  createCompany(input: CrearEmpresaInput & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<Empresa>("POST", { orgId }, "/empresas", { body }, options);
  }

  updateCompany(id: string, input: ActualizarEmpresaInput & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<Empresa>("PATCH", { orgId }, `/empresas/${id}`, { body }, options);
  }

  deleteCompany(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<{ ok: true }>("DELETE", scope, `/empresas/${id}`, {}, options);
  }

  /** Datos del NIT en la DIAN para prellenar (y si ya existe la empresa). */
  lookupNit(input: { nit: string } & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<Record<string, unknown>>(
      "POST",
      { orgId },
      "/empresas/consultar-nit",
      { body },
      options,
    );
  }

  addCompanyContacts(
    id: string,
    input: { contactIds: string[] } & Scope,
    options?: RequestOptions,
  ) {
    const { orgId, ...body } = input;
    return this.pedir<{ contactos: number }>(
      "POST",
      { orgId },
      `/empresas/${id}/contactos`,
      { body },
      options,
    );
  }

  removeCompanyContacts(
    id: string,
    input: { contactIds: string[] } & Scope,
    options?: RequestOptions,
  ) {
    const { orgId, ...body } = input;
    return this.pedir<{ contactos: number }>(
      "POST",
      { orgId },
      `/empresas/${id}/contactos/quitar`,
      { body },
      options,
    );
  }

  // ── Duplicados ──
  listDuplicates(scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<Record<string, unknown>[]>("GET", scope, "/duplicados", {}, options);
  }

  /** Pasa todo del duplicado al principal y borra el duplicado. */
  mergeContacts(
    input: { principalId: string; duplicadoId: string } & Scope,
    options?: RequestOptions,
  ) {
    const { orgId, ...body } = input;
    return this.pedir<{ ok: true; contactId: string }>(
      "POST",
      { orgId },
      "/duplicados/fusionar",
      { body },
      options,
    );
  }
}
