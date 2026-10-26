import type {
  ActualizarRecursoInput,
  AddExceptionInput,
  AgendaAvailability,
  AgendaCounts,
  AgendaIcsInfo,
  AgendaPreset,
  AgendaRecurso,
  AgendaSettings,
  AgendaSlots,
  AgendaStaffMember,
  AgregarAListaDeEsperaInput,
  AplicarPresetResult,
  AppointmentListItem,
  AppointmentStatus,
  AppointmentType,
  AppointmentWithStatus,
  AvailabilityException,
  AvailabilityRuleInput,
  BookAppointmentInput,
  BookedAppointment,
  CancelAppointmentInput,
  ChangedAppointment,
  CrearPaqueteInput,
  CreateAppointmentTypeInput,
  EncryptedFlowRequest,
  EntradaListaDeEspera,
  EntradaListaDeEsperaConContacto,
  EstadoListaDeEspera,
  GoogleCalendarCallbackQuery,
  GoogleCalendarStatus,
  PaqueteConSaldo,
  PaqueteDeSesiones,
  RecursoInput,
  ReporteDeAgenda,
  RescheduleAppointmentInput,
  ResumenDeCitasDelContacto,
  SendBookingFlowInput,
  SetAppointmentStatusInput,
  UpdateAgendaSettingsInput,
  UpdateAppointmentDetailsInput,
  UpdateAppointmentTypeInput,
  UpdateGoogleSyncInput,
  UpdatedAppointmentDetails,
} from "../types/agenda.js";
import type { Message } from "../types/messaging.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

type Scope = { orgId?: string };
type Query = Record<string, string | number | boolean | undefined>;

export interface AgendaStaffQuery {
  orgId?: string;
  /** Agenda de un profesional; sin él, la agenda general. */
  staffUserId?: string;
}

export interface GetSlotsQuery {
  orgId?: string;
  typeId: string;
  /** YYYY-MM-DD local de la org. */
  from?: string;
  days?: number;
  staffUserId?: string;
  seats?: number;
}

export interface ListAppointmentsQuery {
  orgId?: string;
  from?: string;
  to?: string;
  status?: Exclude<AppointmentStatus, "PENDING_PAYMENT">;
  contactId?: string;
  staffUserId?: string;
}

export interface ListWaitlistQuery {
  orgId?: string;
  estado?: EstadoListaDeEspera;
  contactId?: string;
}

export interface AgendaReportQuery {
  orgId?: string;
  /** YYYY-MM-DD; por defecto, los últimos 30 días. */
  desde?: string;
  hasta?: string;
}

export interface ListPackagesQuery {
  orgId?: string;
  contactId?: string;
}

/**
 * `/organizations/:orgId/agenda` — agenda de citas: configuración, servicios,
 * disponibilidad, días bloqueados, citas, recursos, paquetes, lista de espera,
 * reporte, feed ICS, Google Calendar y el Flow de reserva.
 */
export class AgendaResource extends Resource {
  private async call<T>(
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    orgId: string | undefined,
    sub: string,
    extra: { body?: unknown; query?: Query } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const id = this.requireOrgId(orgId);
    const res = await this.http.request<T>({
      method,
      path: `/organizations/${id}/agenda${sub}`,
      ...(extra.body !== undefined ? { body: extra.body } : {}),
      ...(extra.query ? { query: extra.query } : {}),
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Configuración ────────────────────────────────────────────────────────

  getSettings(scope: Scope = {}, options?: RequestOptions): Promise<AgendaSettings> {
    return this.call("GET", scope.orgId, "/settings", {}, options);
  }

  updateSettings(
    input: UpdateAgendaSettingsInput & Scope,
    options?: RequestOptions,
  ): Promise<AgendaSettings> {
    const { orgId, ...body } = input;
    return this.call("PATCH", orgId, "/settings", { body }, options);
  }

  applyPreset(
    input: { tipo: AgendaPreset } & Scope,
    options?: RequestOptions,
  ): Promise<AplicarPresetResult> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/preset", { body }, options);
  }

  // ─── Feed ICS ─────────────────────────────────────────────────────────────

  getIcs(scope: Scope = {}, options?: RequestOptions): Promise<AgendaIcsInfo> {
    return this.call("GET", scope.orgId, "/ics", {}, options);
  }

  /** Rotar revoca las suscripciones previas. */
  rotateIcs(scope: Scope = {}, options?: RequestOptions): Promise<AgendaIcsInfo> {
    return this.call("POST", scope.orgId, "/ics/rotate", {}, options);
  }

  revokeIcs(scope: Scope = {}, options?: RequestOptions): Promise<AgendaIcsInfo> {
    return this.call("DELETE", scope.orgId, "/ics", {}, options);
  }

  /** `GET /public/agenda/:token/calendar.ics` (público): el texto iCalendar del feed. */
  async icsFeed(token: string, options?: RequestOptions): Promise<string> {
    const res = await this.http.request<string>({
      method: "GET",
      path: `/public/agenda/${encodeURIComponent(token)}/calendar.ics`,
      responseType: "text",
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Servicios (tipos de cita) ────────────────────────────────────────────

  listTypes(scope: Scope = {}, options?: RequestOptions): Promise<AppointmentType[]> {
    return this.call("GET", scope.orgId, "/types", {}, options);
  }

  createType(
    input: CreateAppointmentTypeInput & Scope,
    options?: RequestOptions,
  ): Promise<AppointmentType> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/types", { body }, options);
  }

  updateType(
    typeId: string,
    input: UpdateAppointmentTypeInput & Scope,
    options?: RequestOptions,
  ): Promise<AppointmentType> {
    const { orgId, ...body } = input;
    return this.call("PATCH", orgId, `/types/${typeId}`, { body }, options);
  }

  contactSummary(
    contactId: string,
    scope: Scope = {},
    options?: RequestOptions,
  ): Promise<ResumenDeCitasDelContacto> {
    return this.call("GET", scope.orgId, `/contacts/${contactId}/resumen`, {}, options);
  }

  // ─── Recursos compartidos ─────────────────────────────────────────────────

  listResources(scope: Scope = {}, options?: RequestOptions): Promise<AgendaRecurso[]> {
    return this.call("GET", scope.orgId, "/recursos", {}, options);
  }

  createResource(input: RecursoInput & Scope, options?: RequestOptions): Promise<AgendaRecurso> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/recursos", { body }, options);
  }

  updateResource(
    resourceId: string,
    input: ActualizarRecursoInput & Scope,
    options?: RequestOptions,
  ): Promise<AgendaRecurso> {
    const { orgId, ...body } = input;
    return this.call("PATCH", orgId, `/recursos/${resourceId}`, { body }, options);
  }

  /** Los servicios que lo usaban quedan sin recurso. */
  deleteResource(resourceId: string, scope: Scope = {}, options?: RequestOptions): Promise<void> {
    return this.call("DELETE", scope.orgId, `/recursos/${resourceId}`, {}, options);
  }

  // ─── Paquetes de sesiones ─────────────────────────────────────────────────

  listPackages(
    query: ListPackagesQuery = {},
    options?: RequestOptions,
  ): Promise<PaqueteConSaldo[]> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/paquetes", { query: rest }, options);
  }

  createPackage(
    input: CrearPaqueteInput & Scope,
    options?: RequestOptions,
  ): Promise<PaqueteDeSesiones> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/paquetes", { body }, options);
  }

  /** Anula el paquete. */
  voidPackage(packageId: string, scope: Scope = {}, options?: RequestOptions): Promise<void> {
    return this.call("DELETE", scope.orgId, `/paquetes/${packageId}`, {}, options);
  }

  // ─── Reporte y lista de espera ────────────────────────────────────────────

  report(query: AgendaReportQuery = {}, options?: RequestOptions): Promise<ReporteDeAgenda> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/reporte", { query: rest }, options);
  }

  /** Sin `estado`, lista las que esperan o tienen un horario ofrecido. */
  listWaitlist(
    query: ListWaitlistQuery = {},
    options?: RequestOptions,
  ): Promise<EntradaListaDeEsperaConContacto[]> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/lista-de-espera", { query: rest }, options);
  }

  addToWaitlist(
    input: AgregarAListaDeEsperaInput & Scope,
    options?: RequestOptions,
  ): Promise<EntradaListaDeEspera> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/lista-de-espera", { body }, options);
  }

  removeFromWaitlist(entryId: string, scope: Scope = {}, options?: RequestOptions): Promise<void> {
    return this.call("DELETE", scope.orgId, `/lista-de-espera/${entryId}`, {}, options);
  }

  // ─── Profesionales, disponibilidad y días bloqueados ──────────────────────

  listStaff(scope: Scope = {}, options?: RequestOptions): Promise<AgendaStaffMember[]> {
    return this.call("GET", scope.orgId, "/staff", {}, options);
  }

  getAvailability(
    query: AgendaStaffQuery = {},
    options?: RequestOptions,
  ): Promise<AgendaAvailability> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/availability", { query: rest }, options);
  }

  /** Reemplaza el set completo de reglas semanales (de la agenda general o del profesional). */
  setAvailability(
    input: { rules: AvailabilityRuleInput[] } & AgendaStaffQuery,
    options?: RequestOptions,
  ): Promise<AgendaAvailability> {
    const { orgId, staffUserId, ...body } = input;
    return this.call("PUT", orgId, "/availability", { body, query: { staffUserId } }, options);
  }

  listExceptions(
    query: AgendaStaffQuery = {},
    options?: RequestOptions,
  ): Promise<AvailabilityException[]> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/exceptions", { query: rest }, options);
  }

  addException(
    input: AddExceptionInput & AgendaStaffQuery,
    options?: RequestOptions,
  ): Promise<AvailabilityException & { creadas: number }> {
    const { orgId, staffUserId, ...body } = input;
    return this.call("POST", orgId, "/exceptions", { body, query: { staffUserId } }, options);
  }

  /** Responde 204. */
  removeException(exceptionId: string, scope: Scope = {}, options?: RequestOptions): Promise<void> {
    return this.call("DELETE", scope.orgId, `/exceptions/${exceptionId}`, {}, options);
  }

  // ─── Horarios y citas ─────────────────────────────────────────────────────

  getSlots(query: GetSlotsQuery, options?: RequestOptions): Promise<AgendaSlots> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/slots", { query: rest }, options);
  }

  listAppointments(
    query: ListAppointmentsQuery = {},
    options?: RequestOptions,
  ): Promise<AppointmentListItem[]> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/appointments", { query: rest }, options);
  }

  /** Reserva un slot exacto de `getSlots`. 409 si ya no está disponible. */
  book(input: BookAppointmentInput & Scope, options?: RequestOptions): Promise<BookedAppointment> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/appointments", { body }, options);
  }

  /** Si cambia el enlace o el correo, se le reenvía la invitación al cliente. */
  updateAppointment(
    appointmentId: string,
    input: UpdateAppointmentDetailsInput & Scope,
    options?: RequestOptions,
  ): Promise<UpdatedAppointmentDetails> {
    const { orgId, ...body } = input;
    return this.call("PATCH", orgId, `/appointments/${appointmentId}`, { body }, options);
  }

  cancel(
    appointmentId: string,
    input: CancelAppointmentInput & Scope = {},
    options?: RequestOptions,
  ): Promise<ChangedAppointment> {
    const { orgId, ...body } = input;
    return this.call("PATCH", orgId, `/appointments/${appointmentId}/cancel`, { body }, options);
  }

  reschedule(
    appointmentId: string,
    input: RescheduleAppointmentInput & Scope,
    options?: RequestOptions,
  ): Promise<ChangedAppointment> {
    const { orgId, ...body } = input;
    return this.call(
      "PATCH",
      orgId,
      `/appointments/${appointmentId}/reschedule`,
      { body },
      options,
    );
  }

  setStatus(
    appointmentId: string,
    input: SetAppointmentStatusInput & Scope,
    options?: RequestOptions,
  ): Promise<AppointmentWithStatus> {
    const { orgId, ...body } = input;
    return this.call("PATCH", orgId, `/appointments/${appointmentId}/status`, { body }, options);
  }

  /** Le pide al cliente por WhatsApp el correo para mandarle la invitación. */
  requestEmail(
    appointmentId: string,
    scope: Scope = {},
    options?: RequestOptions,
  ): Promise<{ ok: true }> {
    return this.call(
      "POST",
      scope.orgId,
      `/appointments/${appointmentId}/pedir-correo`,
      {},
      options,
    );
  }

  counts(scope: Scope = {}, options?: RequestOptions): Promise<AgendaCounts> {
    return this.call("GET", scope.orgId, "/counts", {}, options);
  }

  // ─── Google Calendar ──────────────────────────────────────────────────────

  googleStatus(scope: Scope = {}, options?: RequestOptions): Promise<GoogleCalendarStatus> {
    return this.call("GET", scope.orgId, "/google/status", {}, options);
  }

  /** URL de consentimiento OAuth para conectar Google. */
  googleConnect(scope: Scope = {}, options?: RequestOptions): Promise<{ url: string }> {
    return this.call("GET", scope.orgId, "/google/connect", {}, options);
  }

  updateGoogle(
    input: UpdateGoogleSyncInput & Scope,
    options?: RequestOptions,
  ): Promise<GoogleCalendarStatus> {
    const { orgId, ...body } = input;
    return this.call("PATCH", orgId, "/google", { body }, options);
  }

  disconnectGoogle(scope: Scope = {}, options?: RequestOptions): Promise<{ connected: false }> {
    return this.call("DELETE", scope.orgId, "/google", {}, options);
  }

  /**
   * `GET /agenda/google/callback` (público). Destino del consentimiento OAuth
   * de Google: lo abre el navegador, no una integración. La API responde con
   * una redirección al panel (`/dashboard/agenda?google=connected|error`);
   * `fetch` la sigue y aquí llega el cuerpo final como texto.
   */
  async googleCallback(
    query: GoogleCalendarCallbackQuery,
    options?: RequestOptions,
  ): Promise<string> {
    const res = await this.http.request<string>({
      method: "GET",
      path: "/agenda/google/callback",
      query: { ...query },
      responseType: "text",
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  // ─── Flow de reserva (WhatsApp Flows) ─────────────────────────────────────

  /** Envía al contacto el Flow de reserva con date-picker nativo. Devuelve el mensaje enviado. */
  sendBookingFlow(input: SendBookingFlowInput & Scope, options?: RequestOptions): Promise<Message> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "/booking-flow/send", { body }, options);
  }

  /**
   * `POST /agenda/flow/data` (público): endpoint de datos que llama Meta con la
   * petición cifrada del Flow. Devuelve la respuesta cifrada (base64) en texto.
   */
  async bookingFlowData(input: EncryptedFlowRequest, options?: RequestOptions): Promise<string> {
    const res = await this.http.request<string>({
      method: "POST",
      path: "/agenda/flow/data",
      body: input,
      responseType: "text",
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
