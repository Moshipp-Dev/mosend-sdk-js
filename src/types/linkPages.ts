import type { ISODateString, UUID } from "./common.js";

export type LinkPageItemType = "WHATSAPP" | "EXTERNAL" | "CALL" | "EMAIL" | "LOCATION";

export interface LinkPageItem {
  id: UUID;
  type: LinkPageItemType;
  title: string;
  subtitle?: string | null;
  icon?: string | null;
  config: Record<string, unknown>;
  isActive: boolean;
  position: number;
}

export interface LinkPage {
  id: UUID;
  handle: string;
  displayName: string;
  bio?: string | null;
  theme?: Record<string, unknown> | null;
  isPublished: boolean;
  coverMediaId?: UUID | null;
  avatarMediaId?: UUID | null;
  items?: LinkPageItem[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
  archivedAt?: ISODateString | null;
}

export interface CreateLinkPageInput {
  handle: string;
  displayName: string;
  bio?: string;
  theme?: Record<string, unknown>;
}

export interface UpdateLinkPageInput {
  handle?: string;
  displayName?: string;
  bio?: string;
  theme?: Record<string, unknown>;
  isPublished?: boolean;
  coverMediaId?: UUID | null;
  avatarMediaId?: UUID | null;
}

export interface CreateLinkPageItemInput {
  type: LinkPageItemType;
  title: string;
  subtitle?: string;
  icon?: string;
  config: Record<string, unknown>;
}

export interface UpdateLinkPageItemInput {
  title?: string;
  subtitle?: string;
  icon?: string;
  config?: Record<string, unknown>;
  isActive?: boolean;
}
