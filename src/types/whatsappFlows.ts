import type { ISODateString, UUID } from "./common.js";

/** WhatsApp Flow (formulario nativo de Meta) registrado en Mosend. */
export interface WhatsappFlow {
  id: UUID;
  organizationId: UUID;
  wabaId: UUID;
  metaFlowId: string;
  name: string;
  /** DRAFT | PUBLISHED | DEPRECATED | BLOCKED | THROTTLED (lo que diga Meta). */
  status: string;
  categories: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Detalle con lo que reporta Meta: estado vigente, vista previa y errores de validación. */
export interface WhatsappFlowDetail extends WhatsappFlow {
  previewUrl: string | null;
  validationErrors: Array<Record<string, unknown>>;
}

export interface CreateWhatsappFlowInput {
  wabaId: UUID;
  /** Máx. 200 caracteres. */
  name: string;
  /** Categorías de Meta: SIGN_UP, SIGN_IN, APPOINTMENT_BOOKING, LEAD_GENERATION, CONTACT_US, CUSTOMER_SUPPORT, SURVEY, OTHER. */
  categories: string[];
  /** flow.json serializado. */
  flowJson?: string;
}

export interface UpdateWhatsappFlowInput {
  name?: string;
  categories?: string[];
}
