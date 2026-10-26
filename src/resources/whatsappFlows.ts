import type {
  CreateWhatsappFlowInput,
  UpdateWhatsappFlowInput,
  WhatsappFlow,
  WhatsappFlowDetail,
} from "../types/whatsappFlows.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

type Scope = { orgId?: string | undefined };
type Query = Record<string, string | number | boolean | null | undefined>;

/**
 * WhatsApp Flows (formularios nativos de Meta) de la organización.
 * Rutas bajo `/organizations/:orgId/whatsapp-flows`. Para enviarlos a un
 * contacto: `messages.sendFlow`.
 */
export class WhatsappFlowsResource extends Resource {
  private async pedir<T>(
    method: "GET" | "POST" | "PATCH" | "DELETE",
    scope: Scope,
    ruta: string,
    extra: { body?: unknown; query?: Query } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method,
      path: `/organizations/${orgId}/whatsapp-flows${ruta}`,
      ...(extra.body !== undefined ? { body: extra.body } : {}),
      ...(extra.query ? { query: extra.query } : {}),
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  list(params: { wabaId?: string } & Scope = {}, options?: RequestOptions) {
    const { orgId, ...query } = params;
    return this.pedir<WhatsappFlow[]>("GET", { orgId }, "", { query }, options);
  }

  /** Crea el Flow en Meta (opcionalmente con su flow.json). */
  create(input: CreateWhatsappFlowInput & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<WhatsappFlow>("POST", { orgId }, "", { body }, options);
  }

  /** Reconcilia los Flows locales con los que tiene Meta para esa WABA. */
  sync(wabaId: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<{ flows: number }>("POST", scope, `/sync/${wabaId}`, {}, options);
  }

  /** Detalle + estado, vista previa y errores de validación de Meta. */
  get(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<WhatsappFlowDetail>("GET", scope, `/${id}`, {}, options);
  }

  /** Reemplaza el contenido (flow.json serializado) del Flow. */
  updateJson(id: string, input: { flowJson: string } & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<Record<string, unknown>>(
      "PATCH",
      { orgId },
      `/${id}/json`,
      { body },
      options,
    );
  }

  /** Cambia nombre o categorías. */
  update(id: string, input: UpdateWhatsappFlowInput & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<WhatsappFlow>("PATCH", { orgId }, `/${id}`, { body }, options);
  }

  publish(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<WhatsappFlow>("POST", scope, `/${id}/publish`, {}, options);
  }

  /** Marca el Flow como obsoleto (un Flow publicado no se puede borrar). */
  deprecate(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<WhatsappFlow>("POST", scope, `/${id}/deprecate`, {}, options);
  }

  /** Borra un Flow en borrador. */
  delete(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<{ deleted: boolean }>("DELETE", scope, `/${id}`, {}, options);
  }
}
