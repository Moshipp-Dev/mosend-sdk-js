import type { ISODateString, UUID } from "./common.js";

export interface SolutionPackSummary {
  slug: string;
  name: string;
  description?: string;
  category?: string;
  [key: string]: unknown;
}

export interface SolutionPack extends SolutionPackSummary {
  flow?: Record<string, unknown>;
  templates?: Record<string, unknown>[];
}

export interface SolutionInstall {
  id: UUID;
  slug: string;
  installedAt: ISODateString;
  [key: string]: unknown;
}

export interface InstallSolutionInput {
  wabaId?: UUID;
}
