import type { ISODateString, UUID } from "./common.js";

export type BotMode = "OFF" | "RULES_ONLY" | "RULES_PLUS_AI_FALLBACK" | "AI_AGENT";

export interface BotConfig {
  id: UUID;
  phoneNumberId: UUID;
  mode: BotMode;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  classifierEnabled?: boolean;
  knowledgeTopK?: number;
  knowledgeMinSimilarity?: number;
  knowledgeTags?: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface UpsertBotConfigInput {
  mode: BotMode;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  classifierEnabled?: boolean;
  knowledgeTopK?: number;
  knowledgeMinSimilarity?: number;
  knowledgeTags?: string[];
}

export type AutoReplyTrigger = "KEYWORD" | "OUT_OF_HOURS" | "WELCOME" | "FALLBACK";
export type AutoReplyAction = "TEXT" | "TEMPLATE" | "FLOW" | "TRANSFER";

export interface AutoReply {
  id: UUID;
  phoneNumberId?: UUID;
  trigger: AutoReplyTrigger;
  keyword?: string;
  action: AutoReplyAction;
  text?: string;
  templateId?: UUID;
  flowId?: UUID;
  enabled?: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateAutoReplyInput {
  phoneNumberId?: UUID;
  trigger: AutoReplyTrigger;
  keyword?: string;
  action: AutoReplyAction;
  text?: string;
  templateId?: UUID;
  flowId?: UUID;
  enabled?: boolean;
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

export interface CreateFlowInput {
  name: string;
  description?: string;
  steps?: unknown[];
}

export type UpdateFlowInput = Partial<CreateFlowInput>;

export interface FlowTestRunInput {
  message: string;
  variables?: Record<string, unknown>;
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
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
}

export interface OrgAiProviderTestResult {
  ok: boolean;
  message?: string;
  lastTestedAt: ISODateString;
}

export interface HandoffWebhook {
  id: UUID;
  url: string;
  events: string[];
  active: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface UpsertHandoffWebhookInput {
  url: string;
  events: string[];
  active?: boolean;
}

export interface HandoffWebhookSecret {
  secret: string;
  rotatedAt: ISODateString;
}

export interface HandoffWebhookTestResult {
  ok: boolean;
  status?: number;
  responseBody?: string;
  durationMs?: number;
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
