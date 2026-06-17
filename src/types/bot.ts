import type { ISODateString, UUID } from "./common.js";

export type BotMode = "OFF" | "RULES_ONLY" | "RULES_PLUS_AI_FALLBACK" | "AI_AGENT";

export type AiProvider = "anthropic" | "openai" | "openrouter" | "groq";

export interface BotConfig {
  id: UUID;
  phoneNumberId: UUID;
  enabled?: boolean;
  mode?: BotMode;
  cooldownSeconds?: number;
  disclosureMessage?: string;
  humanHandoffKeywords?: string[];
  handoffMessage?: string;
  aiEnabled?: boolean;
  aiProvider?: AiProvider;
  aiModel?: string;
  aiSystemPrompt?: string;
  aiTemperature?: number;
  aiMaxTokens?: number;
  intentClassifierEnabled?: boolean;
  welcomeEnabled?: boolean;
  outOfHoursEnabled?: boolean;
  fallbackEnabled?: boolean;
  outOfHoursSchedule?: Record<string, unknown>;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface UpsertBotConfigInput {
  enabled?: boolean;
  mode?: BotMode;
  cooldownSeconds?: number;
  disclosureMessage?: string;
  humanHandoffKeywords?: string[];
  handoffMessage?: string;
  aiEnabled?: boolean;
  aiProvider?: AiProvider;
  aiModel?: string;
  aiSystemPrompt?: string;
  aiTemperature?: number;
  aiMaxTokens?: number;
  intentClassifierEnabled?: boolean;
  welcomeEnabled?: boolean;
  outOfHoursEnabled?: boolean;
  fallbackEnabled?: boolean;
  outOfHoursSchedule?: Record<string, unknown>;
}

export type AutoReplyTrigger = "KEYWORD" | "OUT_OF_HOURS" | "WELCOME" | "FALLBACK";
export type AutoReplyAction = "SEND_TEXT" | "SEND_TEMPLATE" | "START_FLOW" | "TRANSFER_TO_HUMAN";
export type KeywordMatchMode = "EXACT" | "CONTAINS" | "STARTS_WITH" | "REGEX";

export interface AutoReply {
  id: UUID;
  phoneNumberId?: UUID;
  name: string;
  trigger: AutoReplyTrigger;
  keywordMatchMode?: KeywordMatchMode;
  keywords?: string[];
  actionType: AutoReplyAction;
  textBody?: string;
  templateId?: UUID;
  flowId?: UUID;
  priority?: number;
  enabled?: boolean;
  cooldownSeconds?: number;
  renewAfterHours?: number;
  alsoHandoff?: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateAutoReplyInput {
  name: string;
  trigger: AutoReplyTrigger;
  keywordMatchMode?: KeywordMatchMode;
  keywords?: string[];
  actionType: AutoReplyAction;
  textBody?: string;
  templateId?: UUID;
  flowId?: UUID;
  phoneNumberId?: UUID;
  priority?: number;
  enabled?: boolean;
  cooldownSeconds?: number;
  renewAfterHours?: number;
  alsoHandoff?: boolean;
}

export type UpdateAutoReplyInput = Partial<CreateAutoReplyInput>;

export interface BotEvent {
  id: UUID;
  phoneNumberId: UUID;
  contactId?: UUID;
  conversationId?: UUID;
  trigger: string;
  matched?: string;
  action?: string;
  durationMs?: number;
  createdAt: ISODateString;
}

export interface Flow {
  id: UUID;
  name: string;
  description?: string;
  steps: unknown[];
  published?: boolean;
  publishedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type FlowTriggerType = "KEYWORD" | "INTENT" | "MANUAL" | "AUTO_REPLY";

export interface CreateFlowInput {
  name: string;
  description?: string;
  wabaId: UUID;
  phoneNumberId?: UUID;
  triggerType?: FlowTriggerType;
  triggerConfig?: Record<string, unknown>;
}

export interface UpdateFlowInput {
  name?: string;
  description?: string;
  enabled?: boolean;
  triggerType?: FlowTriggerType;
  triggerConfig?: Record<string, unknown>;
  phoneNumberId?: string | null;
  /** Definición completa del flow (nodos/edges) — reemplaza el JSON guardado. */
  json?: unknown;
}

export interface FlowTestRunInput {
  /** Mensajes simulados del usuario, en orden. */
  messages?: string[];
}

export interface FlowTestRunResult {
  steps: Array<{
    stepId?: string;
    type: string;
    output: unknown;
  }>;
  finalVariables?: Record<string, unknown>;
}

export type AiProviderName = "anthropic" | "openai" | "openrouter" | "groq";

export interface OrgAiProvider {
  provider: AiProviderName;
  configured: boolean;
  lastTestedAt?: ISODateString;
  lastTestError?: string | null;
  models?: string[];
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface UpsertOrgAiProviderInput {
  apiKey?: string;
  enabled?: boolean;
  defaultModel?: string;
}

export interface OrgAiProviderTestResult {
  ok: boolean;
  message?: string;
  lastTestedAt: ISODateString;
}

export type KnowledgeDocStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

export interface KnowledgeDocument {
  id: UUID;
  title: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  tags: string[];
  status: KnowledgeDocStatus;
  chunkCount?: number;
  errorMessage?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface UploadKnowledgeInput {
  file: Blob | File;
  filename?: string;
  title?: string;
  tags?: string[];
}

export interface UpdateKnowledgeTitleInput {
  title: string;
}

export interface UpdateKnowledgeTagsInput {
  tags: string[];
}

export interface AiCreditSummary {
  enabled: boolean;
  balance: number;
  currency: string;
  lowThreshold: number;
  softDailyLimit: number;
  totalSpent30d: number;
  totalCalls30d: number;
  breakdown30d: Array<{ mode: string; amount: number; calls: number }>;
  rechargePacks: Array<{ amountUsd: number; bonusUsd: number }>;
  minCustomRechargeUsd: number;
}

export interface AiCreditTransaction {
  id: UUID;
  type: string;
  amount: number;
  balanceAfter: number;
  source?: string;
  reference?: string;
  description?: string;
  createdAt: ISODateString;
}

export interface EffectiveAiProvider {
  provider: AiProvider;
  label: string;
  source: "byok" | "mosend" | "none";
  model: string | null;
}
