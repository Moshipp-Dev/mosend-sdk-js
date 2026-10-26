import type { ISODateString, UUID } from "./common.js";

export type EstadoDeCotizacion =
  | "BORRADOR"
  | "ENVIADA"
  | "ACEPTADA"
  | "RECHAZADA"
  | "VENCIDA"
  | "CONVERTIDA";
export type OrigenDeLineaDeCotizacion = "PRODUCTO" | "LICENCIA" | "SERVICIO" | "LIBRE";
export type MonedaDeCotizacion = "COP" | "USD" | "MXN";

export interface DisponibilidadDeCotizaciones {
  disponible: boolean;
  sinMarcaDeAgua: boolean;
}

export interface EmpresaQueCotiza {
  empresaId: UUID;
  nombre: string;
  razonSocial: string;
  nit: string | null;
  predeterminada: boolean;
  /** Si ya tiene datos de emisor. */
  configurado: boolean;
  marcas: Array<{ id: UUID; nombre: string }>;
}

export interface EmpresasQueCotizan {
  empresas: EmpresaQueCotiza[];
  /** La que se propone para la conversación. */
  sugerida: UUID | null;
}

export interface CotizacionesContextoQuery {
  conversationId?: UUID;
  contactId?: UUID;
}

export interface ItemCotizable {
  origen: Exclude<OrigenDeLineaDeCotizacion, "LIBRE">;
  origenId: string;
  varianteId: string | null;
  nombre: string;
  detalle: string | null;
  categoria: string;
  precioUnitarioCents: number;
  moneda: string;
  ivaPorcentaje: number;
}

export interface EmisorDeCotizacion {
  razonSocial: string;
  nit: string | null;
  direccion: string | null;
  ciudad: string | null;
  telefono: string | null;
  correo: string | null;
  sitioWeb: string | null;
  logoMediaId: UUID | null;
}

export interface Cotizacion {
  id: UUID;
  organizationId: UUID;
  numero: number;
  contactId: UUID | null;
  conversationId: UUID | null;
  perfilDeCobroId: UUID | null;
  empresaId: UUID | null;
  estado: EstadoDeCotizacion;
  moneda: string;
  fecha: ISODateString;
  validaHasta: ISODateString | null;
  emisor: EmisorDeCotizacion;
  clienteNombre: string;
  clienteDocumento: string | null;
  clienteCorreo: string | null;
  clienteTelefono: string | null;
  clienteDireccion: string | null;
  formasDePago: string | null;
  condiciones: string | null;
  notas: string | null;
  subtotalCents: number;
  descuentoCents: number;
  ivaCents: number;
  totalCents: number;
  pdfMediaId: UUID | null;
  pdfShareToken: string | null;
  enviadaAt: ISODateString | null;
  aceptadaAt: ISODateString | null;
  rechazadaAt: ISODateString | null;
  salesOrderId: UUID | null;
  createdByUserId: UUID | null;
  /** PANEL | BOT */
  origen: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface LineaDeCotizacion {
  id: UUID;
  cotizacionId: UUID;
  posicion: number;
  origen: OrigenDeLineaDeCotizacion;
  origenId: string | null;
  varianteId: string | null;
  descripcion: string;
  detalle: string | null;
  cantidad: number;
  precioUnitarioCents: number;
  descuentoPorcentaje: number;
  ivaPorcentaje: number;
  brutoCents: number;
  descuentoCents: number;
  ivaCents: number;
  totalCents: number;
}

export interface CotizacionConLineas extends Cotizacion {
  lineas: LineaDeCotizacion[];
}

export interface CotizacionResumen {
  id: UUID;
  numero: number;
  estado: EstadoDeCotizacion;
  moneda: string;
  fecha: ISODateString;
  validaHasta: ISODateString | null;
  clienteNombre: string;
  totalCents: number;
  contactId: UUID | null;
  conversationId: UUID | null;
  perfilDeCobroId: UUID | null;
  empresaId: UUID | null;
  enviadaAt: ISODateString | null;
  salesOrderId: UUID | null;
  origen: string;
  _count: { lineas: number };
}

export interface ListarCotizacionesQuery {
  contactId?: UUID;
  conversationId?: UUID;
  estado?: EstadoDeCotizacion;
  empresa?: string;
}

export interface LineaDeCotizacionInput {
  origen: OrigenDeLineaDeCotizacion;
  /** Producto, licencia o servicio de origen (no en las libres). */
  origenId?: string;
  varianteId?: string;
  descripcion: string;
  detalle?: string;
  cantidad: number;
  /** Precio unitario SIN IVA, en centavos. */
  precioUnitarioCents: number;
  descuentoPorcentaje?: number;
  ivaPorcentaje?: number;
}

export interface GuardarCotizacionInput {
  contactId?: UUID;
  conversationId?: UUID;
  /** Perfil de facturación del cliente («facturar a»). */
  billingProfileId?: UUID;
  /** Marca que emite; null = los datos de la organización. */
  perfilDeCobroId?: UUID | null;
  /** Empresa que emite; manda sobre `perfilDeCobroId`. */
  empresaId?: UUID | null;
  moneda?: MonedaDeCotizacion;
  /** null o 0 = sin vigencia. */
  vigenciaDias?: number | null;
  clienteNombre?: string;
  clienteDocumento?: string;
  clienteCorreo?: string;
  clienteTelefono?: string;
  clienteDireccion?: string;
  formasDePago?: string;
  condiciones?: string;
  notas?: string;
  lineas: LineaDeCotizacionInput[];
}

export interface EnlaceDeVistaDeCotizacion {
  /** URL firmada (10 minutos) para ver el PDF. */
  ver: string;
  /** URL firmada (10 minutos) para descargarlo. */
  descargar: string;
}

export interface EnviarCotizacionInput {
  /** Texto que acompaña al PDF; si no, uno con el número y el total. */
  mensaje?: string;
}

export interface CotizacionEnviada {
  enviada: true;
  messageId: UUID | null;
  conversationId: UUID;
}

export interface CambiarEstadoDeCotizacionInput {
  estado: "ACEPTADA" | "RECHAZADA";
}

export interface CotizacionConvertida {
  pedidoId: UUID;
  numero: number;
}

export interface LogoDeEmisorSubido {
  logoMediaId: UUID;
}
