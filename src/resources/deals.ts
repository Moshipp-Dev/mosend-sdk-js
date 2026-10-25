import type {
  ActualizarOportunidadInput,
  AutomatizacionCrm,
  Cadencia,
  CrearAutomatizacionInput,
  CrearCadenciaInput,
  CrearOportunidadInput,
  Embudo,
  EstadoDeOportunidad,
  EtapaDeEmbudo,
  Oportunidad,
  Tablero,
} from "../types/crm.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

type Scope = { orgId?: string | undefined };
type Query = Record<string, string | number | boolean | null | undefined>;

/**
 * CRM avanzado (función de plan `crm_avanzado`): embudos, oportunidades,
 * cadencias de seguimiento y automatizaciones.
 */
export class DealsResource extends Resource {
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

  // ── Embudos ──
  listPipelines(scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<Embudo[]>("GET", scope, "/embudos", {}, options);
  }

  createPipeline(
    input: {
      nombre: string;
      porDefecto?: boolean;
      automatico?: boolean;
      motivosDePerdida?: string[];
      conEtapasPorDefecto?: boolean;
    } & Scope,
    options?: RequestOptions,
  ) {
    const { orgId, ...body } = input;
    return this.pedir<Embudo>("POST", { orgId }, "/embudos", { body }, options);
  }

  updatePipeline(
    id: string,
    input: Partial<{
      nombre: string;
      porDefecto: boolean;
      automatico: boolean;
      motivosDePerdida: string[];
      orden: number;
    }> &
      Scope,
    options?: RequestOptions,
  ) {
    const { orgId, ...body } = input;
    return this.pedir<Embudo>("PATCH", { orgId }, `/embudos/${id}`, { body }, options);
  }

  archivePipeline(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<{ ok: true }>("DELETE", scope, `/embudos/${id}`, {}, options);
  }

  createStage(
    pipelineId: string,
    input: Partial<Omit<EtapaDeEmbudo, "id" | "embudoId">> & { nombre: string } & Scope,
    options?: RequestOptions,
  ) {
    const { orgId, ...body } = input;
    return this.pedir<EtapaDeEmbudo>(
      "POST",
      { orgId },
      `/embudos/${pipelineId}/etapas`,
      { body },
      options,
    );
  }

  reorderStages(
    pipelineId: string,
    input: { etapaIds: string[] } & Scope,
    options?: RequestOptions,
  ) {
    const { orgId, ...body } = input;
    return this.pedir<Embudo>(
      "PUT",
      { orgId },
      `/embudos/${pipelineId}/etapas/orden`,
      { body },
      options,
    );
  }

  updateStage(
    stageId: string,
    input: Partial<Omit<EtapaDeEmbudo, "id" | "embudoId" | "orden">> & Scope,
    options?: RequestOptions,
  ) {
    const { orgId, ...body } = input;
    return this.pedir<EtapaDeEmbudo>("PATCH", { orgId }, `/etapas/${stageId}`, { body }, options);
  }

  /** Si la etapa tiene oportunidades, `moverA` dice a dónde pasan. */
  deleteStage(stageId: string, params: { moverA?: string } & Scope = {}, options?: RequestOptions) {
    const { orgId, ...query } = params;
    return this.pedir<{ ok: true; movidas: number }>(
      "DELETE",
      { orgId },
      `/etapas/${stageId}`,
      { query },
      options,
    );
  }

  // ── Oportunidades ──
  board(
    params: {
      embudoId?: string;
      duenoUserId?: string;
      origen?: string;
      q?: string;
      diasCerradas?: number;
    } & Scope = {},
    options?: RequestOptions,
  ) {
    const { orgId, ...query } = params;
    return this.pedir<Tablero>("GET", { orgId }, "/oportunidades/tablero", { query }, options);
  }

  list(
    params: {
      embudoId?: string;
      estado?: EstadoDeOportunidad;
      contactId?: string;
      empresaId?: string;
      duenoUserId?: string;
      origen?: string;
      q?: string;
      page?: number;
      pageSize?: number;
    } & Scope = {},
    options?: RequestOptions,
  ) {
    const { orgId, ...query } = params;
    return this.pedir<{ items: Oportunidad[]; total: number; page: number; pageSize: number }>(
      "GET",
      { orgId },
      "/oportunidades",
      { query },
      options,
    );
  }

  get(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<Oportunidad & Record<string, unknown>>(
      "GET",
      scope,
      `/oportunidades/${id}`,
      {},
      options,
    );
  }

  create(input: CrearOportunidadInput & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<Oportunidad>("POST", { orgId }, "/oportunidades", { body }, options);
  }

  update(id: string, input: ActualizarOportunidadInput & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<Oportunidad>("PATCH", { orgId }, `/oportunidades/${id}`, { body }, options);
  }

  move(
    id: string,
    input: { etapaId: string; motivoDePerdida?: string } & Scope,
    options?: RequestOptions,
  ) {
    const { orgId, ...body } = input;
    return this.pedir<Oportunidad>(
      "POST",
      { orgId },
      `/oportunidades/${id}/mover`,
      { body },
      options,
    );
  }

  win(id: string, input: { monto?: number } & Scope = {}, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<Oportunidad>(
      "POST",
      { orgId },
      `/oportunidades/${id}/ganar`,
      { body },
      options,
    );
  }

  lose(id: string, input: { motivo: string } & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<Oportunidad>(
      "POST",
      { orgId },
      `/oportunidades/${id}/perder`,
      { body },
      options,
    );
  }

  reopen(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<Oportunidad>(
      "POST",
      scope,
      `/oportunidades/${id}/reabrir`,
      { body: {} },
      options,
    );
  }

  delete(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<{ ok: true }>("DELETE", scope, `/oportunidades/${id}`, {}, options);
  }

  // ── Cadencias ──
  listSequences(scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<Cadencia[]>("GET", scope, "/cadencias", {}, options);
  }

  createSequence(input: CrearCadenciaInput & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<Cadencia>("POST", { orgId }, "/cadencias", { body }, options);
  }

  updateSequence(id: string, input: Partial<CrearCadenciaInput> & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<Cadencia>("PATCH", { orgId }, `/cadencias/${id}`, { body }, options);
  }

  deleteSequence(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<{ ok: true }>("DELETE", scope, `/cadencias/${id}`, {}, options);
  }

  sequenceEnrollments(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<Record<string, unknown>[]>(
      "GET",
      scope,
      `/cadencias/${id}/inscritos`,
      {},
      options,
    );
  }

  enroll(
    id: string,
    input: { contactIds: string[]; oportunidadId?: string } & Scope,
    options?: RequestOptions,
  ) {
    const { orgId, ...body } = input;
    return this.pedir<{ inscritos: number; saltados: number }>(
      "POST",
      { orgId },
      `/cadencias/${id}/inscribir`,
      { body },
      options,
    );
  }

  stopEnrollment(enrollmentId: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<{ ok: true }>(
      "POST",
      scope,
      `/inscripciones/${enrollmentId}/detener`,
      { body: {} },
      options,
    );
  }

  // ── Automatizaciones ──
  listAutomations(scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<AutomatizacionCrm[]>("GET", scope, "/automatizaciones", {}, options);
  }

  createAutomation(input: CrearAutomatizacionInput & Scope, options?: RequestOptions) {
    const { orgId, ...body } = input;
    return this.pedir<AutomatizacionCrm>("POST", { orgId }, "/automatizaciones", { body }, options);
  }

  updateAutomation(
    id: string,
    input: Partial<CrearAutomatizacionInput> & Scope,
    options?: RequestOptions,
  ) {
    const { orgId, ...body } = input;
    return this.pedir<AutomatizacionCrm>(
      "PATCH",
      { orgId },
      `/automatizaciones/${id}`,
      { body },
      options,
    );
  }

  deleteAutomation(id: string, scope: Scope = {}, options?: RequestOptions) {
    return this.pedir<{ ok: true }>("DELETE", scope, `/automatizaciones/${id}`, {}, options);
  }
}
