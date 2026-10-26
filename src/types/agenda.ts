import type { ISODateString, UUID } from "./common.js";

// Convenciones de la API: las fechas viajan como ISO; los `Decimal` de la base
// (`price`, `anticipoValor`) llegan como string ("50000.00").

export type AppointmentStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "CANCELLED"
  | "NO_SHOW"
  | "COMPLETED";
export type AppointmentModality = "PRESENCIAL" | "VIRTUAL" | "DOMICILIO";
export type AnticipoTipo = "PORCENTAJE" | "FIJO";
export type SlotIntervalMin = 5 | 10 | 15 | 20 | 30 | 45 | 60 | 90 | 120;
export type EstadoListaDeEspera = "ESPERANDO" | "OFRECIDA" | "AGENDADA" | "CANCELADA" | "VENCIDA";
export type AgendaPreset = "salon" | "spa" | "consultorio" | "asesoria" | "clases";
/** Cómo se avisó al cliente por WhatsApp tras reservar, cancelar o reprogramar. */
export type AvisoAlCliente = "SESION" | "PLANTILLA" | "SIN_PLANTILLA" | "SIN_CANAL" | "FALLO";

// ─── Configuración ───────────────────────────────────────────────────────────

export interface AgendaSettings {
  /** Ausente mientras la org no ha guardado su configuración. */
  id?: UUID;
  organizationId: UUID;
  enabled: boolean;
  minNoticeMin: number;
  maxAdvanceDays: number;
  reminderTemplateName: string | null;
  reminderTemplateLang: string | null;
  reminderHoursBefore: number;
  reminderPhoneNumberId: UUID | null;
  confirmTemplateName: string | null;
  confirmTemplateLang: string | null;
  rescheduleTemplateName: string | null;
  rescheduleTemplateLang: string | null;
  cancelTemplateName: string | null;
  cancelTemplateLang: string | null;
  icsToken: string | null;
  bookingFlowId: UUID | null;
  bloquearFestivos: boolean;
  paisFestivos: string;
  paginaPublica: boolean;
  paginaSlug: string | null;
  paginaPhoneNumberId: UUID | null;
  paginaMensaje: string | null;
  reminder2HoursBefore: number | null;
  reminder2TemplateName: string | null;
  reminder2TemplateLang: string | null;
  reminder3HoursBefore: number | null;
  reminder3TemplateName: string | null;
  reminder3TemplateLang: string | null;
  cancelarHastaHoras: number | null;
  noShowAutoHoras: number | null;
  esperaTemplateName: string | null;
  esperaTemplateLang: string | null;
  esperaMinutos: number;
  anticipoMinutos: number;
  anticipoTrasInasistencias: number | null;
  encuestaTrasCita: boolean;
  volverTemplateName: string | null;
  volverTemplateLang: string | null;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

/** Habilitar (`enabled: true`) requiere la función de plan `agenda`. */
export interface UpdateAgendaSettingsInput {
  enabled?: boolean;
  minNoticeMin?: number;
  maxAdvanceDays?: number;
  reminderTemplateName?: string | null;
  reminderTemplateLang?: string | null;
  confirmTemplateName?: string | null;
  confirmTemplateLang?: string | null;
  rescheduleTemplateName?: string | null;
  rescheduleTemplateLang?: string | null;
  cancelTemplateName?: string | null;
  cancelTemplateLang?: string | null;
  /** 0 = sin recordatorio, máx 72. */
  reminderHoursBefore?: number;
  reminderPhoneNumberId?: UUID | null;
  bookingFlowId?: UUID | null;
  bloquearFestivos?: boolean;
  paisFestivos?: "CO";
  paginaPublica?: boolean;
  /** app.mosend.dev/reservar/<paginaSlug> */
  paginaSlug?: string;
  paginaPhoneNumberId?: UUID | null;
  paginaMensaje?: string | null;
  reminder2HoursBefore?: number | null;
  reminder2TemplateName?: string | null;
  reminder2TemplateLang?: string | null;
  reminder3HoursBefore?: number | null;
  reminder3TemplateName?: string | null;
  reminder3TemplateLang?: string | null;
  cancelarHastaHoras?: number | null;
  noShowAutoHoras?: number | null;
  anticipoMinutos?: number;
  anticipoTrasInasistencias?: number | null;
  esperaTemplateName?: string | null;
  esperaTemplateLang?: string | null;
  esperaMinutos?: number;
  encuestaTrasCita?: boolean;
  volverTemplateName?: string | null;
  volverTemplateLang?: string | null;
}

export interface AgendaIcsInfo {
  enabled: boolean;
  url: string | null;
}

export interface AplicarPresetResult {
  preset: AgendaPreset;
  serviciosCreados: number;
  horarioCreado: boolean;
}

// ─── Servicios (tipos de cita) ───────────────────────────────────────────────

export interface PreguntaDelServicio {
  id: string;
  texto: string;
  tipo: "TEXTO" | "OPCION" | "SI_NO";
  opciones?: string[];
  obligatoria: boolean;
}

export interface AppointmentType {
  id: UUID;
  organizationId: UUID;
  name: string;
  description: string | null;
  durationMin: number;
  bufferMin: number;
  bufferBeforeMin: number;
  slotIntervalMin: number | null;
  /** Decimal serializado ("50000.00"). */
  price: string | null;
  currency: string | null;
  color: string | null;
  modality: AppointmentModality;
  location: string | null;
  meetingUrl: string | null;
  category: string | null;
  sortOrder: number;
  capacity: number;
  anticipoTipo: AnticipoTipo | null;
  /** Decimal serializado. */
  anticipoValor: string | null;
  preguntas: PreguntaDelServicio[] | null;
  volverEnDias: number | null;
  recursoId: UUID | null;
  staffUserId: UUID | null;
  staffUserIds: UUID[];
  active: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateAppointmentTypeInput {
  name: string;
  durationMin: number;
  /** Forma anterior a `staffUserIds` (un solo profesional). */
  staffUserId?: UUID;
  description?: string | null;
  bufferMin?: number;
  bufferBeforeMin?: number;
  /** null = duración + márgenes. */
  slotIntervalMin?: SlotIntervalMin | null;
  price?: number | null;
  /** ISO 4217; null = la moneda de la organización. */
  currency?: string | null;
  color?: string | null;
  modality?: AppointmentModality;
  location?: string | null;
  meetingUrl?: string | null;
  category?: string | null;
  sortOrder?: number;
  /** Cupos por horario; más de 1 requiere agenda_avanzada. */
  capacity?: number;
  anticipoTipo?: AnticipoTipo | null;
  anticipoValor?: number | null;
  /** Máximo 8 preguntas; null o [] = sin formulario. */
  preguntas?: PreguntaDelServicio[] | null;
  volverEnDias?: number | null;
  recursoId?: UUID | null;
  /** Vacío = agenda general. */
  staffUserIds?: UUID[];
}

export interface UpdateAppointmentTypeInput extends Partial<
  Omit<CreateAppointmentTypeInput, "staffUserId">
> {
  active?: boolean;
  /** `null` lo devuelve a la agenda general. */
  staffUserId?: UUID | null;
}

export interface ResumenDeCitasDelContacto {
  atendidas: number;
  inasistencias: number;
  canceladas: number;
  agendadas: number;
  proxima: { id: UUID; startAt: ISODateString; appointmentType: { name: string } } | null;
}

// ─── Recursos, paquetes y lista de espera ────────────────────────────────────

export interface AgendaRecurso {
  id: UUID;
  organizationId: UUID;
  nombre: string;
  cantidad: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface RecursoInput {
  nombre: string;
  cantidad?: number;
}

export type ActualizarRecursoInput = Partial<RecursoInput>;

export interface PaqueteDeSesiones {
  id: UUID;
  organizationId: UUID;
  contactId: UUID;
  appointmentTypeId: UUID | null;
  nombre: string;
  sesiones: number;
  usadas: number;
  venceAt: ISODateString | null;
  anuladoAt: ISODateString | null;
  createdByUserId: UUID | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PaqueteConSaldo extends PaqueteDeSesiones {
  agendadas: number;
  disponibles: number;
  vencido: boolean;
}

export interface CrearPaqueteInput {
  contactId: UUID;
  /** Vacío = sirve para cualquier servicio. */
  appointmentTypeId?: UUID;
  nombre: string;
  sesiones: number;
  /** Sesiones ya usadas (paquete que venía de antes). */
  usadas?: number;
  venceAt?: ISODateString;
}

export interface ContactoDeCita {
  id: UUID;
  name: string | null;
  profileName: string | null;
  waId: string;
}

export interface EntradaListaDeEspera {
  id: UUID;
  organizationId: UUID;
  appointmentTypeId: UUID;
  staffUserId: UUID | null;
  contactId: UUID;
  conversationId: UUID | null;
  phoneNumberId: UUID | null;
  desde: ISODateString;
  hasta: ISODateString;
  estado: EstadoListaDeEspera;
  reservaId: UUID | null;
  ofrecidaAt: ISODateString | null;
  appointmentId: UUID | null;
  notas: string | null;
  createdByUserId: UUID | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface EntradaListaDeEsperaConContacto extends EntradaListaDeEspera {
  contact: ContactoDeCita | null;
  servicio: string | null;
}

export interface AgregarAListaDeEsperaInput {
  contactId: UUID;
  typeId: UUID;
  /** Vacío = con quien esté libre. */
  staffUserId?: UUID;
  desde: string;
  hasta: string;
  notas?: string;
  conversationId?: UUID;
  phoneNumberId?: UUID;
}

// ─── Reporte ─────────────────────────────────────────────────────────────────

export interface ConteoDeCitas {
  citas: number;
  atendidas: number;
  inasistencias: number;
  canceladas: number;
}

export interface ReporteDeAgenda {
  desde: string;
  hasta: string;
  zonaHoraria: string;
  totales: ConteoDeCitas & { agendadas: number; esperandoAnticipo: number };
  tasaInasistencia: number | null;
  tasaCancelacion: number | null;
  ingresosEstimados: Array<{ moneda: string; total: number }>;
  anticipos: { cobrados: number; totalCop: number };
  clientes: { total: number; nuevos: number; recurrentes: number };
  porServicio: Array<ConteoDeCitas & { appointmentTypeId: UUID; servicio: string }>;
  /** `ocupacion` va de 0 a 1. */
  porProfesional: Array<
    ConteoDeCitas & { staffUserId: UUID | null; nombre: string; ocupacion: number | null }
  >;
  porOrigen: Array<{ origen: string; citas: number }>;
  porDia: Array<{ fecha: string; citas: number }>;
}

// ─── Profesionales, disponibilidad y días bloqueados ─────────────────────────

export interface AgendaStaffMember {
  userId: UUID;
  name: string | null;
  email: string;
  hasAvailability: boolean;
}

export interface AvailabilityRule {
  id: UUID;
  organizationId: UUID;
  staffUserId: UUID | null;
  weekday: number;
  startMinute: number;
  endMinute: number;
}

export interface AvailabilityRuleInput {
  /** 0 = domingo … 6 = sábado. */
  weekday: number;
  /** Minutos locales de la org (08:00 = 480). */
  startMinute: number;
  endMinute: number;
}

export interface AgendaAvailability {
  staffUserId: UUID | null;
  rules: AvailabilityRule[];
}

export interface AvailabilityException {
  id: UUID;
  organizationId: UUID;
  staffUserId: UUID | null;
  date: ISODateString;
  reason: string | null;
  startMinute: number | null;
  endMinute: number | null;
  createdAt: ISODateString;
}

export interface AddExceptionInput {
  /** Día local de la org, YYYY-MM-DD. */
  date: string;
  /** Último día de un rango (inclusive). */
  dateTo?: string;
  /** Franja bloqueada en minutos locales; sin ellos se bloquea el día entero. */
  startMinute?: number;
  endMinute?: number;
  reason?: string;
}

// ─── Horarios y citas ────────────────────────────────────────────────────────

export interface AgendaSlot {
  startAt: ISODateString;
  endAt: ISODateString;
  cuposLibres?: number;
  staffUserId: UUID | null;
}

export interface AgendaSlots {
  slots: AgendaSlot[];
  timezone: string;
}

export interface Appointment {
  id: UUID;
  organizationId: UUID;
  appointmentTypeId: UUID;
  contactId: UUID;
  conversationId: UUID | null;
  staffUserId: UUID | null;
  phoneNumberId: UUID | null;
  startAt: ISODateString;
  endAt: ISODateString;
  status: AppointmentStatus;
  notes: string | null;
  createdByUserId: UUID | null;
  cancelledAt: ISODateString | null;
  cancelReason: string | null;
  reminderSentAt: ISODateString | null;
  reminder2SentAt: ISODateString | null;
  reminder3SentAt: ISODateString | null;
  origen: string | null;
  seats: number;
  cobroId: UUID | null;
  anticipoCents: number | null;
  respuestas: Record<string, unknown> | null;
  invitacionVolverAt: ISODateString | null;
  serieId: UUID | null;
  paqueteId: UUID | null;
  direccion: string | null;
  reminderAttempts: number;
  confirmedByContactAt: ISODateString | null;
  googleEventId: string | null;
  meetingUrl: string | null;
  inviteEmail: string | null;
  inviteEmailRequestedAt: ISODateString | null;
  inviteSentAt: ISODateString | null;
  preAvisoAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface AppointmentWithRefs extends Appointment {
  appointmentType: { id: UUID; name: string };
  contact: ContactoDeCita;
}

export interface AppointmentListItem extends Appointment {
  appointmentType: { id: UUID; name: string; durationMin: number; color: string | null };
  contact: ContactoDeCita;
}

export interface BookedAppointment extends AppointmentWithRefs {
  /** null cuando la cita queda esperando el anticipo (`PENDING_PAYMENT`). */
  avisoWhatsapp: AvisoAlCliente | null;
  /** Solo en citas recurrentes (`repetir.veces > 1`). */
  serie?: { id: UUID; creadas: number; omitidas: ISODateString[] };
}

export interface ChangedAppointment extends AppointmentWithRefs {
  avisoWhatsapp: AvisoAlCliente;
}

export interface UpdatedAppointmentDetails extends AppointmentWithRefs {
  invitacionEnviada: boolean;
  avisoWhatsapp: AvisoAlCliente | null;
}

export interface AppointmentWithStatus extends Appointment {
  appointmentType: { id: UUID; name: string };
  contact: { id: UUID; name: string | null; waId: string };
}

export interface BookAppointmentInput {
  typeId: UUID;
  contactId: UUID;
  /** Inicio exacto de un slot devuelto por `getSlots` (ISO). */
  startAt: ISODateString;
  conversationId?: UUID;
  phoneNumberId?: UUID;
  notes?: string;
  /** Vacío = agenda general. */
  staffUserId?: UUID;
  /** Personas de la reserva (servicios con cupos). Default 1. */
  seats?: number;
  cobrarAnticipo?: boolean;
  /** Respuestas al formulario del servicio, por id de pregunta. */
  respuestas?: Record<string, unknown>;
  direccion?: string;
  sinPaquete?: boolean;
  repetir?: { cadaDias: 7 | 14 | 21 | 28 | 30; veces: number };
  meetingUrl?: string;
  inviteEmail?: string;
  pedirCorreo?: boolean;
}

export interface UpdateAppointmentDetailsInput {
  /** Cadena vacía = quitarlo. */
  meetingUrl?: string;
  /** Cadena vacía = quitarlo. */
  inviteEmail?: string;
  notes?: string;
}

export interface CancelAppointmentInput {
  reason?: string;
  /** Cancelar también las siguientes de la serie. */
  serie?: boolean;
}

export interface RescheduleAppointmentInput {
  startAt: ISODateString;
}

export interface SetAppointmentStatusInput {
  status: "NO_SHOW" | "COMPLETED";
}

export interface AgendaCounts {
  proximas: number;
  hoy: number;
  proxima: { startAt: ISODateString; servicio: string } | null;
}

// ─── Google Calendar ─────────────────────────────────────────────────────────

export interface GoogleCalendarStatus {
  available: boolean;
  connected: boolean;
  connection: {
    googleEmail: string;
    calendarId: string;
    pushEnabled: boolean;
    blockBusyEnabled: boolean;
    crearMeet: boolean;
    needsReconnect: boolean;
    createdAt: ISODateString;
  } | null;
}

export interface UpdateGoogleSyncInput {
  /** Citas de Mosend → eventos de Google. */
  pushEnabled?: boolean;
  /** "Ocupado" en Google bloquea horarios. */
  blockBusyEnabled?: boolean;
  crearMeet?: boolean;
}

export interface GoogleCalendarCallbackQuery {
  code?: string;
  state?: string;
  error?: string;
}

// ─── Flow de reserva ─────────────────────────────────────────────────────────

export interface SendBookingFlowInput {
  contactId: UUID;
  appointmentTypeId: UUID;
  conversationId?: UUID;
  phoneNumberId?: UUID;
}

/** Petición cifrada que Meta manda al endpoint de datos del Flow. */
export interface EncryptedFlowRequest {
  encrypted_flow_data: string;
  encrypted_aes_key: string;
  initial_vector: string;
}
