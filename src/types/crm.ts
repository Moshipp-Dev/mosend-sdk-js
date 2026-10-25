import type { ISODateString, UUID } from "./common.js";

/** Etapa de vida del cliente. La mueven las compras y la inactividad. */
export type EtapaDelCliente = "PROSPECTO" | "CLIENTE" | "RECURRENTE" | "INACTIVO";

export type TipoDeCampo =
  | "TEXTO"
  | "NUMERO"
  | "FECHA"
  | "LISTA"
  | "SI_NO"
  | "CORREO"
  | "TELEFONO"
  | "URL";

/** Campo definido del cliente. Su valor vive en `contact.attributes[clave]`. */
export interface CampoDelCliente {
  id: UUID;
  clave: string;
  etiqueta: string;
  tipo: TipoDeCampo;
  opciones: string[];
  obligatorio: boolean;
  enTabla: boolean;
  enFicha: boolean;
  orden: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CrearCampoInput {
  etiqueta: string;
  /** Si no viene, sale de la etiqueta («Segmento» → «segmento»). */
  clave?: string;
  tipo?: TipoDeCampo;
  opciones?: string[];
  obligatorio?: boolean;
  enTabla?: boolean;
  enFicha?: boolean;
  orden?: number;
}

export type ActualizarCampoInput = Partial<Omit<CrearCampoInput, "clave">>;

export interface ActualizarClienteInput {
  /** null = sin dueño. */
  duenoUserId?: UUID | null;
  /** null = sin empresa. */
  empresaId?: UUID | null;
  etapa?: EtapaDelCliente;
  /** Se mezclan con los que ya tiene; null o "" borra la clave. */
  campos?: Record<string, unknown>;
}

export interface ClientesMasivoInput {
  contactIds: UUID[];
  duenoUserId?: UUID | null;
  empresaId?: UUID | null;
  etapa?: EtapaDelCliente;
}

export interface EventoDeLaFicha {
  id: string;
  tipo: string;
  fecha: ISODateString;
  titulo: string;
  detalle?: string | null;
  enlace?: { tipo: string; id: string } | null;
  actorUserId?: UUID | null;
}

export interface LineaDeTiempo {
  eventos: EventoDeLaFicha[];
  /** Cursor para la página siguiente (`antes`), o null si no hay más. */
  siguiente: ISODateString | null;
}

export interface Empresa {
  id: UUID;
  nombre: string;
  nit: string | null;
  dv: number | null;
  sector: string | null;
  ciudad: string | null;
  sitioWeb: string | null;
  telefono: string | null;
  correo: string | null;
  duenoUserId: UUID | null;
  notas: string | null;
  atributos: Record<string, unknown>;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CrearEmpresaInput {
  nombre: string;
  /** Con o sin dígito de verificación. */
  nit?: string;
  sector?: string;
  ciudad?: string;
  sitioWeb?: string;
  telefono?: string;
  correo?: string;
  duenoUserId?: UUID;
  notas?: string;
  atributos?: Record<string, unknown>;
}

export type ActualizarEmpresaInput = Partial<Omit<CrearEmpresaInput, "duenoUserId">> & {
  duenoUserId?: UUID | null;
};

export interface ConfiguracionCrm {
  diasParaInactivo: number;
  diasSinActividad: number;
  asignacionDeDueno: "NINGUNO" | "ROTATIVO" | "PRIMERO_QUE_RESPONDE";
  asignarEntre: UUID[];
  /** La org tiene embudo, cadencias y automatizaciones (`crm_avanzado`). */
  avanzado: boolean;
}

export type TipoDeEtapa = "ABIERTA" | "GANADA" | "PERDIDA";
export type EstadoDeOportunidad = "ABIERTA" | "GANADA" | "PERDIDA";

export interface EtapaDeEmbudo {
  id: UUID;
  embudoId: UUID;
  nombre: string;
  orden: number;
  probabilidad: number;
  tipo: TipoDeEtapa;
  clave: "NUEVO" | "CONTACTADO" | "REUNION" | "COTIZADO" | "NEGOCIACION" | null;
  color: string;
}

export interface Embudo {
  id: UUID;
  nombre: string;
  porDefecto: boolean;
  automatico: boolean;
  motivosDePerdida: string[];
  orden: number;
  etapas: EtapaDeEmbudo[];
}

export interface Oportunidad {
  id: UUID;
  embudoId: UUID;
  etapaId: UUID;
  titulo: string;
  contactId: UUID | null;
  empresaId: UUID | null;
  duenoUserId: UUID | null;
  /** Decimal serializado como texto. */
  monto: string | number;
  moneda: string;
  cierreEsperadoAt: ISODateString | null;
  origen: string;
  estado: EstadoDeOportunidad;
  motivoDePerdida: string | null;
  ganadaAt: ISODateString | null;
  perdidaAt: ISODateString | null;
  ultimaActividadAt: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CrearOportunidadInput {
  titulo: string;
  embudoId?: UUID;
  etapaId?: UUID;
  contactId?: UUID;
  empresaId?: UUID;
  duenoUserId?: UUID;
  monto?: number;
  moneda?: string;
  cierreEsperadoAt?: ISODateString;
  conversationId?: UUID;
}

export interface ActualizarOportunidadInput {
  titulo?: string;
  contactId?: UUID | null;
  empresaId?: UUID | null;
  duenoUserId?: UUID | null;
  monto?: number;
  moneda?: string;
  cierreEsperadoAt?: ISODateString | null;
}

export interface Tablero {
  embudo: { id: UUID; nombre: string; motivosDePerdida: string[] };
  etapas: (EtapaDeEmbudo & {
    oportunidades: Oportunidad[];
    totales: { cantidad: number; monto: number; ponderado: number };
  })[];
  totales: { abiertas: number; valorAbierto: number; ponderado: number };
}

export interface PasoDeCadencia {
  dias: number;
  plantilla: string;
  idioma?: string;
  /** Admiten {{nombre}}, {{empresa}}, {{dueno}} y {{oportunidad}}. */
  variables?: string[];
}

export interface Cadencia {
  id: UUID;
  nombre: string;
  phoneNumberId: UUID;
  pasos: PasoDeCadencia[];
  detenerAlResponder: boolean;
  activa: boolean;
  inscritos?: Record<string, number>;
}

export interface CrearCadenciaInput {
  nombre: string;
  phoneNumberId: UUID;
  pasos: PasoDeCadencia[];
  detenerAlResponder?: boolean;
  activa?: boolean;
}

export type DisparadorDeAutomatizacion =
  | "contacto.creado"
  | "contacto.etapa"
  | "contacto.etiquetado"
  | "oportunidad.creada"
  | "oportunidad.etapa"
  | "oportunidad.ganada"
  | "oportunidad.perdida";

export interface AutomatizacionCrm {
  id: UUID;
  nombre: string;
  disparador: DisparadorDeAutomatizacion;
  condiciones: Record<string, unknown>;
  acciones: Record<string, unknown>[];
  activa: boolean;
  ejecuciones: number;
  ultimaEjecucionAt: ISODateString | null;
  ultimoError: string | null;
}

export interface CrearAutomatizacionInput {
  nombre: string;
  disparador: DisparadorDeAutomatizacion;
  condiciones?: Record<string, unknown>;
  /** [{ tipo: "crear_tarea", titulo, enDias }, { tipo: "notificar", mensaje }, …] */
  acciones: Record<string, unknown>[];
  activa?: boolean;
}
