/**
 * AUTO-GENERADO por scripts/generate-types.mjs — NO EDITAR A MANO.
 *
 * Tipos del contrato de la API derivados de spec/openapi.json
 * (OpenAPI 3.0.0 · Mosend WB API 1.0.0).
 *
 * Son la fuente de verdad de los request DTOs del backend. Comparar los
 * `*Input` del SDK contra estos para evitar drift. Regenerar con `npm run gen`.
 */

export interface AcceptInvitationDto {
  token: string;
}

export interface AcceptSignupDto {
  token: string;
  name: string;
  password: string;
}

export interface ActivateDto {
  token: string;
  password: string;
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

export type AdminCreateOrganizationDto = Record<string, unknown>;

export type AdminSetAddonDto = Record<string, unknown>;

export type AdminSetExtraOrganizationsDto = Record<string, unknown>;

export interface BulkInvitationDto {
  emails: Array<string>;
  roleId: string;
  wabaIds?: Array<string>;
}

export interface CallbackDto {
  sessionId: string;
  code: string;
  sessionInfo?: SdkSessionInfoDto;
  /** True si el frontend invocó FB.login con extras.setup.coexistence=true. Marca el PhoneNumber resultante como `coexistenceMode=true` para que el UI muestre badge "Coexistencia con app móvil" y para futuras decisiones (ej. no marcar como leído si Meta avisa que la app móvil ya respondió). */
  coexistence?: boolean;
}

export interface CarouselCardDto {
  headerType: ("image" | "video");
  headerLink: string;
  bodyText?: string;
  ctaUrl?: CtaUrlDto;
  quickReplies?: Array<QuickReplyDto>;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeStatusDto {
  status: ("ONLINE" | "LUNCH" | "BREAK" | "MEETING" | "TRAINING");
}

export interface CommerceSettingsDto {
  /** Habilitar el carrito de compras en las conversaciones. */
  isCartEnabled?: boolean;
  /** Hacer visible el catálogo en el perfil del negocio. */
  isCatalogVisible?: boolean;
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

export interface ContactEntity {
  /** Identificador único del contacto (UUID). */
  id: string;
  /** Identificador del canal. Para WhatsApp es el número en E.164 sin "+" (p.ej. 573001112233). Para el chat web es "webchat:{visitorId}". */
  waId: string;
  /** Nombre del contacto (editable por el agente). Null si no se ha definido. */
  name?: Record<string, unknown> | null;
  /** Email del contacto. Llega principalmente vía identify del widget de chat web. No es único dentro de la org. Null si no se conoce. */
  email?: Record<string, unknown> | null;
  /** Nombre de perfil reportado por la plataforma (WhatsApp/Instagram). Null si no aplica. */
  profileName?: Record<string, unknown> | null;
  /** Código de idioma del contacto (ISO, p.ej. "es", "en", "pt-BR"). Null si no se conoce. */
  language?: Record<string, unknown> | null;
  /** Atributos personalizados del contacto como objeto clave/valor. Objeto vacío {} cuando no hay atributos. */
  attributes: Record<string, unknown>;
  /** Estado de opt-in (consentimiento) del contacto. */
  optInStatus: ("UNKNOWN" | "OPTED_IN" | "OPTED_OUT");
  /** Fecha/hora de la última actividad del contacto (último mensaje IN/OUT), en ISO 8601. Null si nunca ha tenido actividad. */
  lastSeenAt?: string | null;
  /** Fecha/hora de creación del contacto, en ISO 8601. */
  createdAt: string;
  /** URL pública de la foto de perfil del contacto; Instagram (cacheada en S3/CDN) o avatar del chat web; null si no hay. */
  avatarUrl?: string | null;
}

export interface ConversationToolsDto {
  /** Preguntas frecuentes (máx 4) que IG muestra a usuarios nuevos. */
  iceBreakers?: Array<string>;
  /** Ítems del menú persistente (máx 5). */
  persistentMenu?: Array<PersistentMenuItemDto>;
}

export interface CorrectSessionDto {
  /** Nuevo instante de cierre (epoch en milisegundos). */
  endedAt: number;
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
  prechatFields?: Array<Record<string, unknown>> | null;
  typingIndicatorEnabled?: boolean;
  readReceiptEnabled?: boolean;
  voiceNotesEnabled?: boolean;
  botEnabled?: boolean;
  enabled?: boolean;
  /** Modo de color del widget: 'light' | 'dark' | 'auto'. */
  theme?: ("light" | "dark" | "auto");
}

export type CreateCouponDto = Record<string, unknown>;

export type CreateCreditNoteDto = Record<string, unknown>;

export interface CreateFlowDto {
  wabaId: string;
  name: string;
  categories: Array<string>;
  /** flow.json serializado (opcional al crear; se puede subir después). */
  flowJson?: string;
}

export interface CreateFolderDto {
  name: string;
  parentId?: string | null;
  visibility?: ("ORG" | "PRIVATE");
}

export interface CreateInvitationDto {
  email: string;
  roleId: string;
  /** WABAs a las que se scopeará al aceptar. Vacío/omitido = acceso a todas. */
  wabaIds?: Array<string>;
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
  billingParentId?: string;
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
  /** Foto del visitante que el sitio host puede pasar por identify (p.ej. data-user-avatar). Se cachea en S3 y se expone en el inbox. */
  avatarUrl?: string;
  otp?: string;
  /** El visitante confirmó "dejar mensaje de todos modos" fuera de horario. Solo surte efecto si el canal usa offlineAction = MESSAGE_ALLOW. */
  acceptOffline?: boolean;
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

export interface CtaUrlDto {
  displayText: string;
  url: string;
}

export type DisableDto = Record<string, unknown>;

export type EditMessageDto = Record<string, unknown>;

export interface EndJornadaDto {
  note?: string;
}

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

export interface LinkBillingGroupDto {
  parentOrgId: string;
}

export interface LinkEmailDto {
  email: string;
  name?: string;
}

export interface ListRowDto {
  id: string;
  title: string;
  description?: string;
}

export interface ListSectionDto {
  title?: string;
  rows: Array<ListRowDto>;
}

export interface LoginDto {
  email: string;
  password: string;
  twoFactorCode?: string;
  captchaToken?: string;
}

export interface LogoutDto {
  refreshToken?: string;
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

export interface PreregisterDto {
  members: Array<PreregisterMemberDto>;
  roleId: string;
  wabaIds?: Array<string>;
}

export interface PreregisterMemberDto {
  email: string;
  /** Nombre del agente. Si se omite, se deriva del correo. */
  name?: string;
}

export interface ProductSectionDto {
  title: string;
  productRetailerIds: Array<string>;
}

export interface QuickReplyDto {
  id: string;
  title: string;
}

export interface ReactivateDto {
  /** Si true, además de devolver el enlace, reenvía el correo de activación. */
  notify?: boolean;
}

export type RecordOptInDto = Record<string, unknown>;

export type RedeemCouponDto = Record<string, unknown>;

export interface RefreshDto {
  /** Refresh token. OPCIONAL tras M10: las sesiones migradas lo envían por la cookie HttpOnly `mosend_rt`, no en el body. Se conserva opcional para las sesiones legacy que aún lo tienen en localStorage (transición). */
  refreshToken?: string;
}

export type RegisterDeviceDto = Record<string, unknown>;

export type RegisterDto = Record<string, unknown>;

export interface RejectDeletionDto {
  /** Notas internas del staff sobre por qué se rechaza. */
  notes?: string;
}

export interface RenameDto {
  name: string;
}

export interface ReorderItemsDto {
  /** Ids de los items en el nuevo orden. */
  itemIds: Array<string>;
}

export type ReprocessPaymentDto = Record<string, unknown>;

export type RequestCodeDto = Record<string, unknown>;

export interface RequestDeletionDto {
  /** Nombre EXACTO de la organización, como confirmación. Debe coincidir. */
  confirmOrgName: string;
  /** Motivo opcional de la baja (para feedback interno). */
  reason?: string;
}

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

export interface SendCarouselDto {
  phoneNumberId: string;
  to: string;
  bodyText: string;
  cards: Array<CarouselCardDto>;
  replyToMessageId?: string;
}

export interface SendDocumentDto {
  conversationId: string;
  caption?: string;
}

export interface SendFlowDto {
  phoneNumberId: string;
  to: string;
  /** Id local del WhatsAppFlow (nuestra tabla). */
  flowId: string;
  bodyText: string;
  ctaText: string;
  headerText?: string;
  footerText?: string;
  screen?: string;
  data?: Record<string, unknown>;
  flowAction?: ("navigate" | "data_exchange");
  replyToMessageId?: string;
}

export interface SendInteractiveDto {
  phoneNumberId: string;
  to: string;
  kind: ("list" | "cta_url" | "location_request");
  bodyText?: string;
  headerText?: string;
  footerText?: string;
  buttonText?: string;
  sections?: Array<ListSectionDto>;
  displayText?: string;
  url?: string;
  replyToMessageId?: string;
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

export interface SendProductDto {
  phoneNumberId: string;
  to: string;
  /** ID del catálogo conectado a la WABA. */
  catalogId: string;
  bodyText?: string;
  footerText?: string;
  headerText?: string;
  /** SPM: un solo producto. */
  productRetailerId?: string;
  /** MPM (simple): lista plana de SKUs → una sección. */
  products?: Array<string>;
  /** MPM (con secciones): título + SKUs por sección. */
  sections?: Array<ProductSectionDto>;
  /** Catalog message: muestra el catálogo completo. */
  catalogMessage?: boolean;
  thumbnailProductRetailerId?: string;
  /** Cita a otro mensaje (context). */
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

export interface SetOvertimeDto {
  enabled: boolean;
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

export interface SignupRequestCodeDto {
  email: string;
  password: string;
  name: string;
  phone: string;
  captchaToken?: string;
}

export interface SignupResendCodeDto {
  email: string;
  phone: string;
}

export interface SignupVerifyCodeDto {
  email: string;
  phone: string;
  code: string;
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

export interface TestSendDto {
  /** E.164 (con o sin '+'); se normaliza al enviar. */
  toPhone: string;
}

export type UnregisterDeviceDto = Record<string, unknown>;

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

export interface UpdateAttendanceSettingsDto {
  enabled?: boolean;
  autoCloseEnabled?: boolean;
  inactivityMinutes?: number;
  closeAtShiftEnd?: boolean;
  requireJornadaForInbox?: boolean;
  allowOvertime?: boolean;
  requireActiveToAttend?: boolean;
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
  typingIndicatorEnabled?: boolean;
  readReceiptEnabled?: boolean;
  /** Notas de voz en el widget (botón de micrófono). */
  voiceNotesEnabled?: boolean;
  botEnabled?: boolean;
  /** Aviso por correo al visitante cuando el agente responde estando él offline. */
  offlineReplyEmailEnabled?: boolean;
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
  bubblePosition?: ("left" | "right");
  /** Distancia desde abajo en px (null = default del widget: 24/16). */
  bubbleOffsetBottom?: number | null;
  /** Distancia lateral en px desde el borde del lado elegido (null = default). */
  bubbleOffsetX?: number | null;
  theme?: ("light" | "dark" | "auto");
}

export interface UpdateContactDto {
  name?: string;
  language?: string;
  attributes?: Record<string, unknown>;
  optInStatus?: Record<string, unknown>;
}

export type UpdateCouponDto = Record<string, unknown>;

export type UpdateFlowDto = Record<string, unknown>;

export interface UpdateFlowJsonDto {
  flowJson: string;
}

export interface UpdateFlowMetaDto {
  name?: string;
  categories?: Array<string>;
}

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

export interface UpdateOrderStatusDto {
  status: Record<string, unknown>;
}

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

export type UpdateShiftRemindersDto = Record<string, unknown>;

export interface UpdateSignupVerificationDto {
  enabled?: boolean;
  verifyTiming?: ("before" | "after");
  requireEmailVerification?: boolean;
  phoneUnique?: boolean;
  scope?: ("self_service" | "all");
  senderOrgId?: string | null;
  senderPhoneNumberId?: string | null;
  templateId?: string | null;
  otpLength?: number;
  otpTtlSeconds?: number;
  maxAttempts?: number;
  resendCooldownSeconds?: number;
}

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

export type UpdateTagDto = Record<string, unknown>;

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
  email?: string;
  phone?: string;
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

export interface UpsertScheduleDto {
  isoYear: number;
  isoWeek: number;
  /** Matriz por día en TZ de la org: { "mon": ["09:00-13:00","14:00-18:00"], ... }. */
  days: Record<string, unknown>;
  /** Almuerzo fijo por día (informativo): { "mon": "13:00-14:00", ... }. */
  lunch?: Record<string, unknown>;
  /** Copiar el mismo horario a las próximas N semanas (turnos estables). */
  copyToWeeks?: number;
}

export type VerifyCodeDto = Record<string, unknown>;

export type VerifyDto = Record<string, unknown>;

export interface VerifyEmailDto {
  token: string;
}

export interface VerifyPhoneCodeDto {
  code: string;
}

export interface VisibilityDto {
  visibility: ("ORG" | "PRIVATE");
}


/*
 * NOTAS
 * - 160 schemas generados desde components.schemas.
 * - El export OpenAPI no incluye schemas de respuesta ni los `@Body() {...}`
 *   inline; esos tipos siguen escritos a mano en src/types/.
 * - SendMessageDto existe en dos módulos (messages y web-chat); Swagger colapsa
 *   uno solo. El messages.SendMessageInput del SDK se mantiene a mano contra el
 *   DTO fuente real.
 */
