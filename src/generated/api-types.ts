/**
 * AUTO-GENERADO por scripts/generate-types.mjs — NO EDITAR A MANO.
 *
 * Tipos del contrato de la API derivados de spec/openapi.json
 * (OpenAPI 3.0.0 · Mosend WB API 0.9.0).
 *
 * Son la fuente de verdad de los request DTOs del backend. Comparar los
 * `*Input` del SDK contra estos para evitar drift. Regenerar con `npm run gen`.
 */

export interface AcceptInvitationDto {
  token: string;
}

export interface AddCardDto {
  token: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export type AddPhoneNumberDto = Record<string, unknown>;

export type AddonChangeDto = Record<string, unknown>;

export type AdjustBalanceDto = Record<string, unknown>;

export interface AdjustWalletDto {
  delta: number;
  reason: string;
}

export type AdminSetAddonDto = Record<string, unknown>;

export interface CallbackDto {
  sessionId: string;
  code: string;
  sessionInfo?: SdkSessionInfoDto;
  /** True si el frontend invocó FB.login con extras.setup.coexistence=true. Marca el PhoneNumber resultante como `coexistenceMode=true` para que el UI muestre badge "Coexistencia con app móvil" y para futuras decisiones (ej. no marcar como leído si Meta avisa que la app móvil ya respondió). */
  coexistence?: boolean;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface CompleteImportDto {
  wabaMetaIds: Array<string>;
  phoneMetaIds?: Array<string>;
}

export type CompleteTaskDto = Record<string, unknown>;

export interface ConnectInstagramDto {
  /** `code` devuelto por el OAuth de Instagram al volver del redirect. */
  code: string;
  /** `state` que devolvimos en `initiate` (CSRF / routing). */
  state?: string;
}

export interface ConnectTestNumberDto {
  wabaId: string;
  phoneNumberId: string;
  accessToken: string;
  wabaName?: string;
}

export interface ConversationToolsDto {
  /** Preguntas frecuentes (máx 4) que IG muestra a usuarios nuevos. */
  iceBreakers?: Array<string>;
  /** Ítems del menú persistente (máx 5). */
  persistentMenu?: Array<PersistentMenuItemDto>;
}

export interface CreateApiKeyDto {
  name: string;
  scopes?: Array<string>;
  /** Restricción opcional a un subconjunto de phone-numbers de la org. Vacío o ausente = la key opera sobre TODOS los phone-numbers (default). Si trae UUIDs, la key SOLO puede enviar/leer de esos números. */
  phoneNumberIds?: Array<string>;
}

export type CreateAutoReplyDto = Record<string, unknown>;

export interface CreateChannelDto {
  name: string;
  color?: string;
  welcomeMessage?: string;
  allowedDomains?: Array<string>;
  precaptureEnabled?: boolean;
  requireEmailUpfront?: boolean;
  botEnabled?: boolean;
  enabled?: boolean;
}

export type CreateCouponDto = Record<string, unknown>;

export type CreateCreditNoteDto = Record<string, unknown>;

export type CreateFlowDto = Record<string, unknown>;

export interface CreateFolderDto {
  name: string;
  parentId?: string | null;
  visibility?: ("ORG" | "PRIVATE");
}

export interface CreateInvitationDto {
  email: string;
  roleId: string;
}

export interface CreateItemDto {
  type: ("WHATSAPP" | "EXTERNAL" | "CALL" | "EMAIL" | "LOCATION");
  title: string;
  subtitle?: string;
  icon?: string;
  /** Config según type: WHATSAPP → { whatsAppLinkId } | { phoneNumberId, prefilledMessage? } EXTERNAL → { url } CALL → { phone } EMAIL → { email } LOCATION → { url } */
  config: Record<string, unknown>;
}

export type CreateLeadDto = Record<string, unknown>;

export interface CreateLinkDto {
  phoneNumberId: string;
  name: string;
  campaignTag?: string;
  prefilledMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateLinkPageDto {
  /** Handle público único global. [a-z0-9_] 3-30. */
  handle: string;
  displayName: string;
  bio?: string;
  /** Tema visual libre: { preset, accentColor, buttonStyle, ... }. */
  theme?: Record<string, unknown>;
}

export type CreateNoteDto = Record<string, unknown>;

export interface CreateOrganizationDto {
  name: string;
  slug: string;
  billingEmail: string;
  country?: string;
  currency?: string;
  timezone?: string;
}

export type CreateOutboundDto = Record<string, unknown>;

export type CreatePricingRuleDto = Record<string, unknown>;

export type CreateRechargeDto = Record<string, unknown>;

export interface CreateSessionDto {
  visitorId: string;
  mode: ("anonymous" | "identified" | "verify-otp" | "host-identified");
  name?: string;
  email?: string;
  phone?: string;
  otp?: string;
  userId?: string;
  /** HMAC-SHA256 hex de `userId || email`, firmado con `WebChatChannel.identitySecret`. */
  hash?: string;
  /** Atributos custom del host (plan, role, etc.) — van a visitor.metadata.host. */
  attributes?: Record<string, unknown>;
  departmentId?: string;
  /** Respuestas del prechat dinámico: { fieldId: value }. */
  prechat?: Record<string, unknown>;
  /** Datos del navegador / contexto. */
  url?: string;
  referer?: string;
  title?: string;
  lang?: string;
  utm?: {
      source?: string;
      medium?: string;
      campaign?: string;
      term?: string;
      content?: string;
    };
}

export interface CreateStoreConnectionDto {
  platform: Record<string, unknown>;
  name: string;
  phoneNumberId: string;
  storeDomain?: string;
}

export interface CreateSystemNoticeDto {
  severity: ("INFO" | "WARNING" | "CRITICAL");
  title: string;
  body?: string;
  linkUrl?: string;
  linkLabel?: string;
  active?: boolean;
  dismissible?: boolean;
  startsAt?: string;
  endsAt?: string;
}

export type CreateTagDto = Record<string, unknown>;

export type CreateTaskDto = Record<string, unknown>;

export interface CreateTemplateDto {
  wabaId: string;
  name: string;
  language: string;
  category: ("MARKETING" | "UTILITY" | "AUTHENTICATION");
  components: Array<TemplateComponentDto>;
}

export type EditMessageDto = Record<string, unknown>;

export interface ForgotPasswordDto {
  email: string;
  captchaToken?: string;
}

export interface ImpersonateRedeemDto {
  token: string;
}

export interface IngestEventDto {
  eventType: Record<string, unknown>;
  externalEventId?: string;
  payload: Record<string, unknown>;
}

export interface InitiateSignupDto {
  organizationId: string;
}

export interface InstallIntegrationDto {
  slug: string;
  config?: Record<string, unknown>;
}

export type InstallSolutionDto = Record<string, unknown>;

export type InstallStoreTemplateDto = Record<string, unknown>;

export interface LinkEmailDto {
  email: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
  twoFactorCode?: string;
  captchaToken?: string;
}

export interface MarkInvoicePaidDto {
  amount: number;
  description?: string;
}

export interface MoveDocumentDto {
  folderId: string | null;
}

export interface PersistentMenuItemDto {
  title: string;
  /** `postback` (registra lo que tocó el usuario) o `web_url` (abre un enlace). */
  type: ("postback" | "web_url");
  /** URL si type=web_url; payload/slug si type=postback. */
  value: string;
}

export type RecordOptInDto = Record<string, unknown>;

export type RedeemCouponDto = Record<string, unknown>;

export interface RefreshDto {
  refreshToken: string;
}

export type RegisterDto = Record<string, unknown>;

export interface RenameDto {
  name: string;
}

export interface ReorderItemsDto {
  /** Ids de los items en el nuevo orden. */
  itemIds: Array<string>;
}

export type ReprocessPaymentDto = Record<string, unknown>;

export type RequestCodeDto = Record<string, unknown>;

export interface ResendOtpDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export type RotateDto = Record<string, unknown>;

export interface SdkSessionInfoDto {
  business_id?: string;
  waba_id?: string;
  phone_number_id?: string;
}

export interface SendDocumentDto {
  conversationId: string;
  caption?: string;
}

export interface SendMessageDto {
  /** Tipo de mensaje. Si no se especifica, default 'text'. */
  type?: ("text" | "image" | "video" | "audio" | "document");
  /** Texto del mensaje (requerido si type='text'; opcional como caption en otros). */
  body?: string;
  /** Id del MediaAsset previamente subido vía /web-chat/media. Requerido cuando type != 'text'. */
  mediaAssetId?: string;
  /** UUID del Message al que el agente responde (cita visible en widget). */
  replyToMessageId?: string;
}

export type SendStickerDto = Record<string, unknown>;

export interface SetAutoPayDto {
  enabled: boolean;
  methodId?: string;
}

export interface SetCaptchaDto {
  /** true = desactivar el captcha globalmente; false = reactivarlo. */
  disabled: boolean;
}

export interface SetReactionDto {
  /** Emoji unicode para reaccionar al mensaje. Si está vacío se interpreta como remover la reacción. */
  emoji: string;
}

export type SetRoleDto = Record<string, unknown>;

export type SetWabaScopeDto = Record<string, unknown>;

export interface SignupDto {
  email: string;
  password: string;
  name: string;
  captchaToken?: string;
}

export interface StepUp2faDto {
  code: string;
}

export type SubscribeDto = Record<string, unknown>;

export interface TemplateButtonDto {
  type: string;
  text?: string;
  url?: string;
  phone_number?: string;
  example?: Array<string>;
  flow_id?: string;
  flow_action?: string;
  flow_name?: string;
  navigate_screen?: string;
  flow_json?: Record<string, unknown>;
  /** Sub-tipo del botón OTP (plantillas AUTHENTICATION): COPY_CODE | ONE_TAP | ZERO_TAP — exigido por Meta cuando type='OTP'. */
  otp_type?: string;
  autofill_text?: string;
  supported_apps?: string;
  package_name?: string;
  signature_hash?: string;
  copy_code_text?: string;
  catalog_action?: string;
  zero_tap_terms_accepted?: boolean;
}

export interface TemplateCardDto {
  components: Array<TemplateComponentDto>;
}

export interface TemplateComponentDto {
  type: string;
  format?: string;
  text?: string;
  example?: Record<string, unknown>;
  buttons?: Array<TemplateButtonDto>;
  /** Tarjetas del carrusel (cuando type=CAROUSEL). */
  cards?: Array<TemplateCardDto>;
  limited_time_offer?: {
      text?: string;
      has_expiration?: boolean;
    };
  has_expiration?: boolean;
  add_security_recommendation?: string;
  code_expiration_minutes?: string;
}

export type TestRunDto = Record<string, unknown>;

export type UnsubscribeDto = Record<string, unknown>;

export interface UpdateAlertSettingsDto {
  /** Umbral de saldo bajo en la moneda del wallet. Si está set y el saldo cae al o por debajo, el cron envía una alerta. `null` desactiva la alerta. */
  lowBalanceThreshold?: number | null;
  /** Activa/desactiva auto-recarga. Para activar, requiere `autoRechargeAmount` > 0, `autoRechargeCurrency` (3 chars), y que la org tenga `autoPayMethodId` (tarjeta default registrada). */
  autoRechargeEnabled?: boolean;
  /** Monto a cobrar a la tarjeta default cada vez que se dispara la auto-recarga. */
  autoRechargeAmount?: number | null;
  /** Moneda ISO-4217 de 3 chars (USD, COP, MXN, ...). */
  autoRechargeCurrency?: string | null;
}

export interface UpdateApiKeyDto {
  name?: string;
  scopes?: Array<string>;
  phoneNumberIds?: Array<string>;
}

export interface UpdateAuthPolicyDto {
  maxSessionsPerUser: number;
}

export type UpdateAutoReplyDto = Record<string, unknown>;

export interface UpdateBillingConfigDto {
  billingCycleDay?: (1 | 15);
  markupOverride?: number | null;
}

export interface UpdateChannelDto {
  name?: string;
  color?: string;
  welcomeMessage?: string;
  allowedDomains?: Array<string>;
  precaptureEnabled?: boolean;
  requireEmailUpfront?: boolean;
  botEnabled?: boolean;
  enabled?: boolean;
  /** Si true, exige firma HMAC al recibir identidad pasada por el host site. */
  identityRequired?: boolean;
  operatingHours?: Record<string, unknown> | null;
  offlineAction?: Record<string, unknown>;
  offlineMessage?: string | null;
  prechatFields?: Array<Record<string, unknown>> | null;
  departments?: Array<Record<string, unknown>> | null;
  proactiveTriggers?: Array<Record<string, unknown>> | null;
  linkEmailBannerEnabled?: boolean;
}

export interface UpdateContactDto {
  name?: string;
  language?: string;
  attributes?: Record<string, unknown>;
  optInStatus?: Record<string, unknown>;
}

export type UpdateCouponDto = Record<string, unknown>;

export type UpdateFlowDto = Record<string, unknown>;

export interface UpdateInstallationDto {
  config?: Record<string, unknown>;
  enabled?: boolean;
}

export interface UpdateItemDto {
  title?: string;
  subtitle?: string;
  icon?: string;
  config?: Record<string, unknown>;
  isActive?: boolean;
}

export interface UpdateLinkDto {
  name?: string;
  campaignTag?: string;
  prefilledMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateLinkPageDto {
  handle?: string;
  displayName?: string;
  bio?: string;
  theme?: Record<string, unknown>;
  isPublished?: boolean;
  /** id de MediaAsset (IMAGE) o null para quitar la portada. */
  coverMediaId?: string | null;
  /** id de MediaAsset (IMAGE) o null para quitar la foto de perfil. */
  avatarMediaId?: string | null;
}

export type UpdateNoteDto = Record<string, unknown>;

export interface UpdateOrganizationDto {
  name?: string;
  billingEmail?: string;
  country?: string;
  currency?: string;
  timezone?: string;
  businessHoursSchedule?: Record<string, unknown> | null;
  optOutEnabled?: boolean;
  optOutKeywords?: Array<string>;
}

export type UpdateOutboundDto = Record<string, unknown>;

export type UpdatePlanDto = Record<string, unknown>;

export type UpdatePolicyDto = Record<string, unknown>;

export type UpdatePricingRuleDto = Record<string, unknown>;

export interface UpdateStoreConnectionDto {
  name?: string;
  phoneNumberId?: string;
  storeDomain?: string;
  status?: Record<string, unknown>;
}

export interface UpdateSystemNoticeDto {
  severity?: ("INFO" | "WARNING" | "CRITICAL");
  title?: string;
  body?: string;
  linkUrl?: string;
  linkLabel?: string;
  active?: boolean;
  dismissible?: boolean;
  startsAt?: string;
  endsAt?: string;
}

export type UpdateTagsDto = Record<string, unknown>;

export type UpdateTaskDto = Record<string, unknown>;

export type UpdateTeamGoalsDto = Record<string, unknown>;

export interface UpdateTemplateDto {
  components: Array<TemplateComponentDto>;
}

export type UpdateTitleDto = Record<string, unknown>;

export interface UpdateUserDto {
  name?: string;
  locale?: string;
}

export type UploadOptsDto = Record<string, unknown>;

export type UpsertBotConfigDto = Record<string, unknown>;

export interface UpsertContactDto {
  waId: string;
  name?: string;
  language?: string;
  attributes?: Record<string, unknown>;
}

export interface UpsertMappingDto {
  eventType: Record<string, unknown>;
  enabled?: boolean;
  templateId?: string;
  languageCode?: string;
  variableMap?: Record<string, unknown>;
  delayMinutes?: number;
}

export interface UpsertOrgAiProviderDto {
  /** Key en plaintext. Opcional al actualizar (mantiene la actual si no se pasa). */
  apiKey?: string | null;
  enabled?: boolean;
  /** Override del modelo default. Null o '' para borrar el override. */
  defaultModel?: string | null;
}

export type UpsertPlanPriceDto = Record<string, unknown>;

export type UpsertProfileDto = Record<string, unknown>;

export type VerifyCodeDto = Record<string, unknown>;

export type VerifyDto = Record<string, unknown>;

export interface VerifyEmailDto {
  token: string;
}

export interface VisibilityDto {
  visibility: ("ORG" | "PRIVATE");
}


/*
 * NOTAS
 * - 116 schemas generados desde components.schemas.
 * - El export OpenAPI no incluye schemas de respuesta ni los `@Body() {...}`
 *   inline; esos tipos siguen escritos a mano en src/types/.
 * - SendMessageDto existe en dos módulos (messages y web-chat); Swagger colapsa
 *   uno solo. El messages.SendMessageInput del SDK se mantiene a mano contra el
 *   DTO fuente real.
 */
