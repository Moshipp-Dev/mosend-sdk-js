import type {
  CreatePhoneNumberInput,
  PhoneNumber,
  RegisterPhoneInput,
  RequestRegistrationCodeInput,
  VerifyRegistrationCodeInput,
} from "../types/waba.js";
import type { Paginated, RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { toPaginated } from "../core/http.js";

/** Colores disponibles para distinguir el número en el inbox. */
export type PhoneNumberColor =
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose"
  | "indigo"
  | "teal"
  | "fuchsia"
  | "orange"
  | "lime"
  | "cyan"
  | "pink"
  | "slate";

export class PhoneNumbersResource extends Resource {
  async list(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<Paginated<PhoneNumber>> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/phone-numbers`,
      ...(options ? { options } : {}),
    });
    return toPaginated<PhoneNumber>(res.data);
  }

  async retrieve(phoneNumberId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<PhoneNumber> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<PhoneNumber>({
      method: "GET",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(
    input: CreatePhoneNumberInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<PhoneNumber> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<PhoneNumber>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Re-sincroniza los números desde Meta. */
  async sync(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<PhoneNumber[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<PhoneNumber[]>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/sync`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Archiva (soft-delete) un número. */
  async delete(phoneNumberId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}`,
      ...(options ? { options } : {}),
    });
  }

  async restore(phoneNumberId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<PhoneNumber> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<PhoneNumber>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}/restore`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Borrado definitivo (hard delete). */
  async purge(phoneNumberId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}/purge`,
      ...(options ? { options } : {}),
    });
  }

  async requestRegistrationCode(
    phoneId: string,
    input: RequestRegistrationCodeInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<void> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneId}/registration/request-code`,
      body,
      ...(options ? { options } : {}),
    });
  }

  async verifyRegistrationCode(
    phoneId: string,
    input: VerifyRegistrationCodeInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<void> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneId}/registration/verify-code`,
      body,
      ...(options ? { options } : {}),
    });
  }

  async register(
    phoneId: string,
    input: RegisterPhoneInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<void> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneId}/registration/register`,
      body,
      ...(options ? { options } : {}),
    });
  }

  /**
   * Reserva o cambia el username de negocio del número (WhatsApp usernames,
   * jun 2026). Meta responde status 'approved' | 'reserved'. Si el username
   * ya está en otro número del portfolio, reintenta con
   * transferAction: 'force_transfer' para moverlo.
   */
  async setUsername(
    phoneId: string,
    input: { username: string; transferAction?: "none" | "force_transfer"; orgId?: string },
    options?: RequestOptions,
  ): Promise<{ id: string; businessUsername: string; businessUsernameStatus: string }> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<{ id: string; businessUsername: string; businessUsernameStatus: string }>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneId}/username`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async deregister(phoneId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneId}/registration/deregister`,
      ...(options ? { options } : {}),
    });
  }

  /**
   * Cambia el color del número en el inbox (`null` vuelve al color
   * automático). Paleta: emerald, sky, violet, amber, rose, indigo, teal,
   * fuchsia, orange, lime, cyan, pink, slate.
   */
  async update(
    phoneNumberId: string,
    input: { color?: PhoneNumberColor | null; orgId?: string },
    options?: RequestOptions,
  ): Promise<PhoneNumber> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<PhoneNumber>({
      method: "PATCH",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Mensajes de servicio del mes por número, contra los 1.000 gratis de Meta. */
  async serviceUsage(
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<Record<string, unknown>> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Record<string, unknown>>({
      method: "GET",
      path: `/organizations/${orgId}/phone-numbers/service-usage`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Desconexiones y reconexiones del número, con su motivo. */
  async connectionHistory(
    phoneNumberId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<Record<string, unknown>> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Record<string, unknown>>({
      method: "GET",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}/historial-de-conexion`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Qué deja de funcionar si se archiva el número (agentes, flujos, enlaces…). */
  async archiveImpact(
    phoneNumberId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<Record<string, unknown>> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Record<string, unknown>>({
      method: "GET",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}/impacto-al-archivar`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /**
   * Coexistencia: pide a Meta los contactos y el historial de la app WhatsApp
   * Business (ventana de 24 h desde el registro, una sola vez).
   */
  async syncCoexistence(
    phoneNumberId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<Record<string, unknown>> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Record<string, unknown>>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}/coexistence/sync`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /**
   * Re-verifica el número contra Meta y sana la marca de desconexión si volvió
   * a responder; si no, indica rehacer la conexión.
   */
  async reconnect(
    phoneNumberId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<Record<string, unknown>> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<Record<string, unknown>>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneNumberId}/reconnect`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
