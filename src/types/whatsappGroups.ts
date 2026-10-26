import type { ISODateString, UUID } from "./common.js";

export type WhatsappGroupJoinApprovalMode = "auto_approve" | "approval_required";

/** PENDIENTE (esperando el webhook) | ACTIVO | FALLIDO | ELIMINADO */
export type WhatsappGroupStatus = "PENDIENTE" | "ACTIVO" | "FALLIDO" | "ELIMINADO";

export interface WhatsappGroupParticipant {
  id: UUID;
  groupId: UUID;
  waId: string;
  contactId?: UUID | null;
  /** SOLICITADO | DENTRO | FUERA */
  estado: "SOLICITADO" | "DENTRO" | "FUERA";
  joinRequestId?: string | null;
  joinedAt?: ISODateString | null;
  removedAt?: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Grupo de WhatsApp creado desde un número de la organización. */
export interface WhatsappGroup {
  id: UUID;
  organizationId: UUID;
  phoneNumberId: UUID;
  /** Id del grupo en Meta. Null hasta que llega el webhook de creación. */
  metaGroupId: string | null;
  subject: string;
  description?: string | null;
  joinApprovalMode: WhatsappGroupJoinApprovalMode;
  inviteLink?: string | null;
  estado: WhatsappGroupStatus;
  errorMessage?: string | null;
  /** Hilo del inbox donde se leen y escriben los mensajes del grupo. */
  conversationId?: UUID | null;
  participants?: WhatsappGroupParticipant[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
  [key: string]: unknown;
}

export interface CreateWhatsappGroupInput {
  phoneNumberId: UUID;
  /** Máx. 128 caracteres. */
  subject: string;
  /** Máx. 2048 caracteres. */
  description?: string;
  joinApprovalMode?: WhatsappGroupJoinApprovalMode;
}

export interface WhatsappGroupJoinRequest {
  joinRequestId: string;
  waId: string;
  creadaEn: ISODateString | null;
}
