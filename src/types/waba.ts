import type { ISODateString, UUID } from "./common.js";

export interface PhoneNumber {
  id: UUID;
  metaPhoneNumberId: string;
  displayPhoneNumber: string;
  verifiedName?: string;
  qualityRating?: "GREEN" | "YELLOW" | "RED" | "UNKNOWN";
  status?: string;
  createdAt: ISODateString;
}

export interface CreatePhoneNumberInput {
  wabaId: UUID;
  /** Código de país, solo dígitos (1–4). */
  cc: string;
  /** Número sin código de país, solo dígitos (4–14). */
  phoneNumber: string;
  verifiedName: string;
}

export interface RequestRegistrationCodeInput {
  method: "SMS" | "VOICE";
  language?: string;
}

export interface VerifyRegistrationCodeInput {
  code: string;
}

export interface RegisterPhoneInput {
  /** PIN de 6 dígitos (two-step verification). */
  pin: string;
}

export interface Waba {
  id: UUID;
  metaWabaId: string;
  name?: string;
  archived?: boolean;
  archivedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface BusinessProfile {
  about?: string;
  address?: string;
  description?: string;
  email?: string;
  websites?: string[];
  vertical?: string;
  profilePictureUrl?: string;
}

export interface UpdateBusinessProfileInput {
  address?: string;
  description?: string;
  email?: string;
  websites?: string[];
  vertical?: string;
}
