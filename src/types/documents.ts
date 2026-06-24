import type { ISODateString, UUID } from "./common.js";

export type DocumentVisibility = "ORG" | "PRIVATE";

export interface DocumentFolder {
  id: UUID;
  name: string;
  parentId: UUID | null;
  visibility: DocumentVisibility;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Document {
  id: UUID;
  name: string;
  mime: string;
  size: number;
  folderId: UUID | null;
  visibility: DocumentVisibility;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt?: ISODateString | null;
}

export interface DocumentStorageUsage {
  usedBytes: number;
  limitBytes: number;
  documentCount: number;
}

export interface DocumentViewUrl {
  url: string;
  expiresAt?: ISODateString;
}

export interface EditorStatus {
  enabled: boolean;
}

export interface CreateFolderInput {
  name: string;
  parentId?: UUID | null;
  visibility?: DocumentVisibility;
}

export interface ListDocumentsQuery {
  orgId?: string;
  folderId?: string;
  q?: string;
  type?: string;
}

export interface SendDocumentInput {
  conversationId: string;
  caption?: string;
}
