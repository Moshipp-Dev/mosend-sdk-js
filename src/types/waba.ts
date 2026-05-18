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
  about?: string;
  address?: string;
  description?: string;
  email?: string;
  websites?: string[];
  vertical?: string;
}
