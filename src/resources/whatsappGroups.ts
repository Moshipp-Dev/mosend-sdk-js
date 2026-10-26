import type {
  CreateWhatsappGroupInput,
  WhatsappGroup,
  WhatsappGroupJoinRequest,
} from "../types/whatsappGroups.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

type Scope = { orgId?: string | undefined };
type Query = Record<string, string | number | boolean | null | undefined>;

/**
 * Grupos de WhatsApp creados desde un número de la organización. Rutas bajo
 * `/organizations/:orgId/whatsapp-groups`. La creación es asíncrona: el id
 * del grupo y el enlace llegan después por webhook (`estado` pasa de
 * PENDIENTE a ACTIVO o FALLIDO).
 */
export class WhatsappGroupsResource extends Resource {
  private async pedir<T>(
    method: "GET" | "POST" | "DELETE",
    scope: Scope,
    ruta: string,
    extra: { body?: unknown; query?: Query } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<T>({
      method,
      path: `/organizations/${orgId}/whatsapp-groups${ruta}`,
      ...(extra.body !== undefined ? { body: extra.body } : {}),
      ...(extra.query ? { query: extra.query } : {}),
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  list(params: { phoneNumberId?: string } & Scope = {}, options?: RequestOptions) {
    const { orgId, ...query } = params;
    return this.pedir<WhatsappGroup[]>("GET", { orgId }, "", { query }, options);
  }

  create(input: CreateWhatsappGroupInput & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<WhatsappGroup>("POST", { orgId }, "", { body }, options);
  }

  /** Un grupo con sus participantes. */
  get(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<WhatsappGroup>("GET", scope, `/${id}`, {}, options);
  }

  /** Elimina el grupo y saca a todos sus participantes. */
  delete(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<WhatsappGroup>("DELETE", scope, `/${id}`, {}, options);
  }

  /** Enlace de invitación vigente. */
  getInviteLink(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<{ inviteLink: string }>("GET", scope, `/${id}/invite-link`, {}, options);
  }

  /** Revoca el enlace anterior y genera uno nuevo. */
  resetInviteLink(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<{ inviteLink: string }>("POST", scope, `/${id}/invite-link`, {}, options);
  }

  /** Saca participantes (máx. 8 por llamada). Quien sale ya no puede volver por el enlace. */
  removeParticipants(id: string, input: { waIds: string[] } & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<{ sacados: number }>(
      "DELETE",
      { orgId },
      `/${id}/participants`,
      { body },
      options,
    );
  }

  /** Solicitudes de ingreso pendientes (grupos con `approval_required`). */
  listJoinRequests(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<WhatsappGroupJoinRequest[]>(
      "GET",
      scope,
      `/${id}/join-requests`,
      {},
      options,
    );
  }

  /** Aprueba o rechaza solicitudes de ingreso (máx. 50 por llamada). */
  resolveJoinRequests(
    id: string,
    input: { joinRequestIds: string[]; accion: "aprobar" | "rechazar" } & Scope,
    options?: RequestOptions,
  ) {
    const { orgId, ...body } = input;
    return this.pedir<{ resueltas: number; fallidas: number }>(
      "POST",
      { orgId },
      `/${id}/join-requests`,
      { body },
      options,
    );
  }
}
