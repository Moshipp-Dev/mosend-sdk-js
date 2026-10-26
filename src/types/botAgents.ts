// Agentes de bot y lo que cuelga de ellos: imágenes, catálogo de servicios,
// configurador, probador, resumen/salud del bot y conectores externos.

export type BotAgentProvider = "anthropic" | "openai" | "openrouter" | "groq" | "meta" | "gemini" | "xai";

export type RitmoDeRespuesta = "INSTANTANEO" | "NATURAL" | "PAUSADO";

export type BotAgentTool =
  | "transfer_to_human"
  | "set_contact_attribute"
  | "end_conversation"
  | "enviar_botones"
  | "enviar_lista"
  | "enviar_boton_enlace";

export type BotAgentCapability =
  | "mosend_planes"
  | "mosend_cuenta"
  | "sell_licenses"
  | "cobro_libre"
  | "book_appointment"
  | "crear_pedido"
  | "pedidos_web"
  | "whmcs_support"
  | "buscar_dominios"
  | "catalogo_servicios"
  | "cotizar"
  | "send_images";

export interface BotAgent {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  ritmoDeRespuesta: RitmoDeRespuesta | null;
  enabled: boolean;
  sortOrder: number;
  provider: BotAgentProvider | null;
  model: string | null;
  systemPrompt: string | null;
  temperature: number;
  maxTokens: number;
  enabledTools: BotAgentTool[];
  interactiveMessages: boolean;
  maxImagesPerDay: number;
  maxDocumentsPerDay: number;
  enabledCapabilities: BotAgentCapability[];
  routeTags: string[];
  perfilDeCobroId: string | null;
  knowledgeTags: string[];
  knowledgeTopK: number;
  knowledgeMinSimilarity: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface UpdateBotAgentInput {
  phoneNumberIds?: string[];
  knowledgeDocIds?: string[];
  /** Legado: un solo número. Preferir `phoneNumberIds`. */
  phoneNumberId?: string;
  perfilDeCobroId?: string;
  knowledgeTags?: string[];
  name?: string;
  description?: string;
  isDefault?: boolean;
  ritmoDeRespuesta?: RitmoDeRespuesta;
  enabled?: boolean;
  sortOrder?: number;
  provider?: BotAgentProvider;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  enabledTools?: BotAgentTool[];
  interactiveMessages?: boolean;
  maxImagesPerDay?: number;
  maxDocumentsPerDay?: number;
  enabledCapabilities?: BotAgentCapability[];
  routeTags?: string[];
  knowledgeTopK?: number;
  knowledgeMinSimilarity?: number;
}

export interface CreateBotAgentInput extends UpdateBotAgentInput {
  name: string;
}

/** Rango de fechas común de los informes: `dias` hacia atrás, o `desde`/`hasta` (YYYY-MM-DD). */
export interface DateRangeQuery {
  dias?: number;
  desde?: string;
  hasta?: string;
}

export interface ConversationTurn {
  rol: "user" | "assistant";
  texto: string;
}

export interface ConfiguradorInput {
  mensajes: ConversationTurn[];
  /** Instrucciones actuales del agente (si se están editando sin guardar). */
  instrucciones?: string;
}

export interface ProbadorInput {
  mensajes: ConversationTurn[];
  instrucciones?: string;
}

export interface BotImage {
  id: string;
  label: string | null;
  caption: string | null;
  [key: string]: unknown;
}

export interface UploadBotImageInput {
  file: Blob;
  filename?: string;
  label?: string;
  caption?: string;
}

export interface UpdateBotImageInput {
  label?: string;
  caption?: string;
}

export interface ServicioPrecio {
  periodo: string;
  valorCents: number;
}

export interface ServicioDelBot {
  id: string;
  organizationId: string;
  categoria: string;
  nombre: string;
  descripcion: string | null;
  precios: ServicioPrecio[];
  moneda: string;
  urlContratacion: string | null;
  notas: string | null;
  activo: boolean;
  orden: number;
  mostrarPrecio: boolean;
  mostrarSinStock: boolean;
  stock: number | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface ServicioInput {
  categoria?: string;
  nombre?: string;
  descripcion?: string;
  notas?: string;
  moneda?: string;
  urlContratacion?: string;
  activo?: boolean;
  mostrarPrecio?: boolean;
  mostrarSinStock?: boolean;
  orden?: number;
  precios?: ServicioPrecio[];
}

export type ConectorType = "WHMCS" | "PLESK" | "CPANEL" | "WORDPRESS" | "WOOCOMMERCE" | "MS365" | "HTTP";

export interface Conector {
  id: string;
  type: ConectorType;
  name: string;
  baseUrl: string;
  enabled: boolean;
  enabledActions: string[];
  phoneNumberIds: string[];
  [key: string]: unknown;
}

export interface UpdateConectorInput {
  name?: string;
  baseUrl?: string;
  authId?: string;
  authSecret?: string;
  enabled?: boolean;
  enabledActions?: string[];
  phoneNumberIds?: string[];
  paymentInstructions?: string;
  paymentGateway?: string;
  customActions?: Record<string, unknown>[];
}

export interface CreateConectorInput extends Omit<UpdateConectorInput, "name" | "baseUrl"> {
  type: ConectorType;
  name: string;
  baseUrl: string;
}

export interface EjecutarAccionInput {
  actionKey: string;
  params?: Record<string, unknown>;
}

export interface KnowledgeNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
  /** Clave de una pregunta sin respuesta de `insights` que esta nota resuelve. */
  resolvesQuestionKey?: string;
  agentIds?: string[];
  compartido?: boolean;
}

export interface KnowledgeUrlSourceInput {
  url: string;
  title?: string;
  tags?: string[];
  syncEveryHours?: number;
  agentIds?: string[];
  compartido?: boolean;
}

export interface KnowledgeSearchInput {
  query: string;
  topK?: number;
  tags?: string[];
  minSimilarity?: number;
  agentId?: string;
}

export interface KnowledgeAssignmentInput {
  agentIds: string[];
  compartido: boolean;
}
