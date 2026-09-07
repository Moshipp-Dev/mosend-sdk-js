/**
 * AUTO-GENERADO por scripts/generate-types.mjs — NO EDITAR A MANO.
 *
 * Tipos del contrato de la API derivados de spec/openapi.json
 * (OpenAPI 3.0.0 · Mosend WB API 2.32.0).
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

export interface AddByFilterDto {
  q?: string;
  channel?: ("whatsapp" | "web" | "all");
  identifiedOnly?: boolean;
  tagId?: string;
  optInStatus?: ("UNKNOWN" | "OPTED_IN" | "OPTED_OUT");
  /** Prefijo numérico del país, p. ej. "57". */
  country?: string;
  language?: string;
  hasConversations?: boolean;
  lastActivityDaysGt?: number;
}

export interface AddByTagDto {
  tagIds: Array<string>;
}

export interface AddCardDto {
  token: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AddConversationTagDto {
  tagId: string;
}

export interface AddExceptionDto {
  /** Día local de la org, formato YYYY-MM-DD. */
  date: string;
  reason?: string;
}

export interface AddLicenseKeysDto {
  /** Llaves a cargar al pool del producto. Se normalizan (trim) y se ignoran duplicadas (dentro del lote y contra las ya existentes). */
  keys: Array<string>;
  /** Variante destino de las llaves; omitir = pool general del producto. */
  variantId?: string;
}

export interface AddMembersDto {
  contactIds: Array<string>;
}

export interface AddPhoneNumberDto {
  wabaId: string;
  cc: string;
  phoneNumber: string;
  verifiedName: string;
}

export interface AddonChangeDto {
  addonType: ("SEAT" | "WABA" | "STORAGE_BLOCK" | "ORGANIZATION");
  /** Cantidad OBJETIVO (absoluta), no el delta. 0 = quitar todos. */
  quantity: number;
}

export interface AdjustBalanceDto {
  amountUsd: number;
  note: string;
}

export interface AdjustWalletDto {
  delta: number;
  reason: string;
}

export interface AdminCreateOrganizationDto {
  name: string;
  slug: string;
  billingEmail: string;
  country?: string;
  currency?: string;
  timezone?: string;
  ownerEmail: string;
  ownerName: string;
  ownerPhone?: string;
}

export interface AdminDeleteNowDto {
  confirmOrgName: string;
  reason?: string;
}

export interface AdminRenameOrganizationDto {
  /** Mismas reglas que cuando la crea su dueño (2–80). */
  name: string;
}

export interface AdminSetAddonDto {
  addonType: ("SEAT" | "WABA" | "STORAGE_BLOCK");
  /** Cantidad objetivo absoluta. */
  quantity: number;
}

export interface AdminSetExtraOrganizationsDto {
  /** Cantidad objetivo absoluta de organizaciones extra. */
  count: number;
}

export interface AdminSetOrgCurrencyDto {
  currency: ("USD" | "COP");
}

export interface AdminSetUserEmailDto {
  email: string;
}

export interface AdminSuspendOrgDto {
  reason: string;
}

export interface AssignConversationDto {
  /** Usuario al que se asigna; null la libera. */
  userId: string | null;
}

export interface AvailabilityRuleDto {
  weekday: number;
  startMinute: number;
  endMinute: number;
}

export interface BookAppointmentDto {
  typeId: string;
  contactId: string;
  /** Inicio exacto de un slot devuelto por GET slots (ISO). */
  startAt: string;
  conversationId?: string;
  phoneNumberId?: string;
  notes?: string;
  /** Profesional con el que se reserva. Vacío = agenda general. */
  staffUserId?: string;
}

export interface BulkAssignConversationsDto {
  conversationIds: Array<string>;
  /** Usuario destino; null libera las conversaciones. */
  userId: string | null;
}

export interface BulkDeleteContactsDto {
  contactIds: Array<string>;
}

export interface BulkImportProductsDto {
  /** Productos a crear en lote (import Excel/CSV desde la UI). */
  products: Array<CreateDigitalProductDto>;
}

export interface BulkInvitationDto {
  emails: Array<string>;
  roleId: string;
  wabaIds?: Array<string>;
}

export interface CallbackDto {
  sessionId: string;
  code: string;
  /** Solo en el flujo por REDIRECCIÓN (móvil). Meta exige que el `redirect_uri` del intercambio sea idéntico al que se usó al pedir el código; si se manda cuando el flujo fue el del SDK de JavaScript, Meta rechaza el intercambio. Por eso viaja aquí en vez de deducirse. */
  redirectUri?: string;
  sessionInfo?: SdkSessionInfoDto;
  /** True si el frontend invocó FB.login con extras.setup.coexistence=true. Marca el PhoneNumber resultante como `coexistenceMode=true` para que el UI muestre badge "Coexistencia con app móvil" y para futuras decisiones (ej. no marcar como leído si Meta avisa que la app móvil ya respondió). */
  coexistence?: boolean;
}

export interface CancelAppointmentDto {
  reason?: string;
}

export interface CarouselCardDto {
  headerType: ("image" | "video");
  headerLink: string;
  bodyText?: string;
  ctaUrl?: CtaUrlDto;
  quickReplies?: Array<QuickReplyDto>;
}

export interface CartItemDto {
  productId: string;
  /** Requerida si el producto tiene variantes. */
  variantId?: string | null;
  quantity?: number;
  /** Precio unitario (centavos) fijado a mano; reemplaza el de lista. */
  unitPriceCents?: number;
}

export interface CelebrationEnabledDto {
  start?: boolean;
  end?: boolean;
  lunchOut?: boolean;
  lunchIn?: boolean;
}

export interface CelebrationPhrasesDto {
  start?: Array<string>;
  end?: Array<string>;
  lunchOut?: Array<string>;
  lunchIn?: Array<string>;
}

export interface CelebrationSettingsDto {
  enabled?: CelebrationEnabledDto;
  phrases?: CelebrationPhrasesDto;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeStatusDto {
  status: ("ONLINE" | "LUNCH" | "BREAK" | "MEETING" | "TRAINING");
}

export interface ChannelsDto {
  push?: boolean;
  inApp?: boolean;
  email?: boolean;
}

export interface CommerceSettingsDto {
  /** Habilitar el carrito de compras en las conversaciones. */
  isCartEnabled?: boolean;
  /** Hacer visible el catálogo en el perfil del negocio. */
  isCatalogVisible?: boolean;
}

export interface CompletarEntregaDto {
  mensaje?: string;
}

export interface CompleteImportDto {
  wabaMetaIds: Array<string>;
  phoneMetaIds?: Array<string>;
}

export interface CompleteTaskDto {
  completed: boolean;
}

export interface ConciliarPagoDto {
  orderId: string;
}

export interface ConfiguradorDto {
  mensajes: Array<TurnoDto>;
  /** Instrucciones que la persona tiene EN PANTALLA, aunque no las haya guardado. Sin esto el configurador partía de la versión del servidor y proponía encima de un texto que ya no era el que se estaba editando. */
  instrucciones?: string;
}

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

export interface CreateAppointmentTypeDto {
  name: string;
  description?: string;
  durationMin: number;
  bufferMin?: number;
}

export interface CreateAutoReplyDto {
  name: string;
  trigger: ("KEYWORD" | "OUT_OF_HOURS" | "WELCOME" | "FALLBACK");
  keywordMatchMode?: ("EXACT" | "CONTAINS" | "STARTS_WITH" | "REGEX");
  keywords?: Array<string>;
  actionType: ("SEND_TEXT" | "SEND_IMAGE" | "SEND_TEMPLATE" | "START_FLOW" | "TRANSFER_TO_HUMAN");
  textBody?: string;
  /** Imagen de la librería del bot, para actionType=SEND_IMAGE. */
  imageId?: string;
  templateId?: string;
  flowId?: string;
  phoneNumberId?: string;
  priority?: number;
  enabled?: boolean;
  cooldownSeconds?: number;
  /** Ventana de renovación en horas (solo aplica a WELCOME / OUT_OF_HOURS). null = usar default del dispatcher; 0 = sin ventana (siempre dispara). */
  renewAfterHours?: number;
  /** Si true, además de la acción marca la conv para asesor humano (handoff). */
  alsoHandoff?: boolean;
}

export interface CreateBillingProfileDto {
  /** Contacto dueño (opcional: null = tercero/empresa suelta). */
  contactId?: string;
  legalName: string;
  docNumber: string;
  dv?: number;
  email?: string;
  phone?: string;
  address?: string;
  municipalityId?: number;
  typeDocumentId?: number;
  typeOrganizationId?: number;
  typeRegimeId?: number;
  typeLiabilityId?: number;
  isDefault?: boolean;
}

export interface CreateBotAgentDto {
  /** Canales (ids de número, reales o virtuales de web chat / Instagram) en los que atiende el agente. Vacío = todos los canales de la organización. */
  phoneNumberIds?: Array<string>;
  /** Documentos de la memoria que este agente consulta (ids). Vacío = toda la biblioteca. */
  knowledgeDocIds?: Array<string>;
  /** Atajo legado de un solo canal; usa phoneNumberIds. */
  phoneNumberId?: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  enabled?: boolean;
  sortOrder?: number;
  provider?: ("anthropic" | "openai" | "openrouter" | "groq" | "meta");
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  enabledTools?: Array<("transfer_to_human" | "set_contact_attribute" | "end_conversation" | "enviar_botones")>;
  enabledCapabilities?: Array<("sell_licenses" | "book_appointment" | "crear_pedido" | "whmcs_support" | "buscar_dominios" | "send_images")>;
  routeTags?: Array<string>;
  knowledgeTags?: Array<string>;
  knowledgeTopK?: number;
  knowledgeMinSimilarity?: number;
}

export interface CreateBotFlowDto {
  name: string;
  description?: string;
  wabaId: string;
  phoneNumberId?: string;
  triggerType?: ("KEYWORD" | "INTENT" | "MANUAL" | "AUTO_REPLY" | "WELCOME");
  triggerConfig?: Record<string, unknown>;
}

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
  /** Email al visitante cuando el agente responde y él ya no está en la página. */
  offlineReplyEmailEnabled?: boolean;
  botEnabled?: boolean;
  enabled?: boolean;
  /** Modo de color del widget: 'light' | 'dark' | 'auto'. */
  theme?: ("light" | "dark" | "auto");
}

export interface CreateCheckoutDto {
  /** Variante a vender (requerida si el producto tiene variantes). */
  variantId?: string;
  /** Cantidad de licencias a vender (1 a 50). Por defecto 1. */
  quantity?: number;
  /** Método de cobro. Por defecto NEQUI. TRANSFERENCIA = el cliente transfiere el monto exacto a la llave y el pago se confirma aparte; no pasa por pasarela. */
  method?: ("NEQUI" | "DAVIPLATA" | "TRANSFERENCIA");
  /** Teléfono Nequi del cliente (10 dígitos CO) — requerido para NEQUI. */
  nequiPhone?: string;
  /** Cédula del cliente — requerida para DAVIPLATA. */
  userLegalId?: string;
  userLegalIdType?: ("CC" | "CE" | "NIT" | "PP" | "TI");
  customerEmail?: string;
  /** Código de cupón de descuento (opcional). */
  couponCode?: string;
  contactId?: string;
  /** Número emisor de WhatsApp para entregar la licencia. */
  phoneNumberId?: string;
  /** WhatsApp destino (waId, sin '+'). Por defecto 57 + Nequi. */
  recipientWaId?: string;
}

export interface CreateConectorDto {
  type: ("WHMCS" | "PLESK" | "CPANEL" | "WORDPRESS" | "WOOCOMMERCE" | "HTTP");
  name: string;
  baseUrl: string;
  /** Identifier de la API Credential de WHMCS (permisos mínimos de lectura). */
  authId?: string;
  authSecret?: string;
  enabled?: boolean;
  enabledActions?: Array<string>;
  /** Solo type HTTP: acciones curadas por el dueño (el servicio las valida). */
  customActions?: Array<Record<string, unknown>>;
}

export interface CreateContactListDto {
  name: string;
  description?: string;
  /** Color en hexadecimal (#RRGGBB). */
  color?: string;
}

export interface CreateCouponDto {
  code: string;
  name?: string;
  description?: string;
  type: ("PERCENT" | "FIXED");
  /** Para PERCENT: valor entre 0 y 1 (0.10 = 10%). Para FIXED: monto en `currency`. */
  value: number;
  currency?: string;
  maxRedemptions?: number;
  maxPerOrg?: number;
  validFrom?: string;
  validUntil?: string;
  applicablePlans?: Array<string>;
  appliesToInterval?: ("MONTHLY" | "YEARLY");
}

export interface CreateCreditNoteDto {
  invoiceId: string;
  /** Código de discrepancia DIAN, tal cual el catálogo oficial: 1=Devolución parcial, 2=Anulación de factura, 3=Rebaja o descuento, 4=Ajuste de precio, 5=Otros. Default 2 (anulación). El catálogo llega hasta el 5. El proveedor valida `between:1,6` pero luego busca el 6 en su tabla con `findOrFail` fuera del try/catch: un 6 devuelve 500 y deja la nota en ERROR, con la factura imposible de anular sin forzar. */
  discrepancyCode?: number;
  /** Motivo visible en la nota. */
  reason?: string;
  /** Confirma emitir aunque un intento anterior quedara sin confirmar (el usuario ya verificó en el proveedor que no salió). Evita la doble NC. */
  force?: boolean;
}

export interface CreateCreditNoteRequestDto {
  organizationId: string;
  invoiceId?: string;
  amount: number;
  currency: string;
  reason: string;
  applyToWallet: boolean;
}

export interface CreateDigitalProductDto {
  name: string;
  description?: string;
  sku?: string;
  /** Categoría libre para agrupar y filtrar en el panel. */
  category?: string;
  /** URLs con @IsUrl http/https: instructionsUrl alimenta un shortlink PÚBLICO en el dominio de la plataforma — sin validar era un open redirect. */
  imageUrl?: string;
  /** Precio en centavos de la moneda (evita floats). */
  priceCents: number;
  /** Días que dura lo vendido, contados desde la ENTREGA. Omitir o `null` = no vence (licencia perpetua), que es como se ha comportado siempre. */
  durationDays?: number | null;
  /** Si entra en el aviso de renovación. Hay cosas que se venden una vez. */
  renewalNoticeEnabled?: boolean;
  /** Moneda ISO-4217 (3 letras mayúsculas). Por defecto COP. */
  currency?: string;
  instructionsUrl?: string;
  /** Modo de entrega: AUTOMATICA (entrega una llave del inventario), ASISTIDA (venta automática, la entrega un asesor; no usa inventario) o CONSULTAR (si no hay stock no dice "agotado": deriva a un asesor para reconfirmar). */
  entregaModo?: ("AUTOMATICA" | "ASISTIDA" | "CONSULTAR");
  /** Dato adicional a pedir al cliente para este producto (ej. "correo"). */
  datoAdicionalLabel?: string | null;
  /** Si ese dato es obligatorio antes de cerrar la venta. */
  datoAdicionalRequerido?: boolean;
  active?: boolean;
}

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

export interface CreateLeadDto {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  source?: string;
  utm?: Record<string, unknown>;
}

export interface CreateLeaveDto {
  agentUserId: string;
  type: ("VACATION" | "SICK" | "PERMISSION" | "UNPAID" | "OTHER");
  startDate: string;
  /** Inclusivo: una novedad de un solo día lleva la misma fecha en ambos. */
  endDate: string;
  note?: string;
}

export interface CreateLicenseCouponDto {
  code: string;
  discountType?: ("PERCENT" | "FIXED");
  /** PERCENT: 1-100 ; FIXED: centavos a descontar. */
  discountValue: number;
  /** Acota a un producto; omitir = cualquiera. */
  productId?: string;
  active?: boolean;
  maxRedemptions?: number;
  /** ISO date; omitir = sin vencimiento. */
  expiresAt?: string;
}

export interface CreateLicenseInvoiceDraftDto {
  customerOrderId: string;
}

export interface CreateLinkDto {
  /** Número conectado (Cloud API). Excluyente con externalPhone. */
  phoneNumberId?: string;
  /** Número externo en formato internacional (cualquier WhatsApp, sin WABA). Se normaliza a solo dígitos. Excluyente con phoneNumberId. */
  externalPhone?: string;
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

export interface CreateManualInvoiceDto {
  /** Líneas libres. Puede ir vacío si hay planCoverage (que genera la suya). */
  lines: Array<ManualInvoiceLineDto>;
  planCoverage?: ManualInvoicePlanCoverageDto;
  /** ISSUED = por cobrar (entra a dunning); PAID = ya pagada por fuera. */
  status: ("ISSUED" | "PAID");
  /** Aplicar el IVA configurado en la org. Default true. */
  applyOrgTax?: boolean;
  currency?: string;
  /** Enviar el email de emitida/pagada al billingEmail. Default true. */
  sendEmail?: boolean;
  /** Nota interna (audit): referencia de transferencia, acuerdo, etc. */
  note?: string;
}

export interface CreateNequiPushDto {
  /** Factura a pagar. Omitir para recarga de saldo (requiere amount). */
  invoiceId?: string;
  /** Monto de la recarga (moneda de la org). Ignorado si hay invoiceId. */
  amount?: number;
  /** Celular Nequi del cliente (10 dígitos). */
  phoneNumber: string;
}

export interface CreateNequiQrDto {
  invoiceId?: string;
  amount?: number;
}

export interface CreateNoteDto {
  body: string;
  pinned?: boolean;
}

export interface CreateOrganizationDto {
  name: string;
  slug: string;
  billingEmail: string;
  country?: string;
  currency?: string;
  timezone?: string;
  planSlug?: string;
  billingInterval?: ("MONTHLY" | "YEARLY");
  billingParentId?: string;
}

export interface CreateOutboundDto {
  url: string;
  events: Array<string>;
  /** Si no se pasa, el service auto-detecta a partir de la URL (Teams si es webhook.office.com etc., GENERIC en cualquier otro caso). */
  format?: ("GENERIC" | "TEAMS");
  /** Solo relevante si `events` incluye 'conversation.unanswered'. Min 1 para evitar spam (sub-minuto el cron no lo respeta) y Max 1440 (24h) como sanity check. */
  unansweredThresholdMinutes?: number;
  /** Restricción opcional por phone-number. Vacío/ausente = el hook recibe eventos de TODOS los números (default). Si trae UUIDs, sólo recibe los de esos números. */
  phoneNumberIds?: Array<string>;
  /** Solo relevante si `events` incluye 'agent.status_changed'. Qué estados de jornada notificar. Vacío/ausente = todas las transiciones. */
  agentStatuses?: Array<("ONLINE" | "LUNCH" | "BREAK" | "MEETING" | "TRAINING" | "ENDED")>;
}

export interface CreatePaymentReportDto {
  /** Monto transferido (en la moneda de la factura o de la org). */
  amount: number;
  /** Factura a pagar. Omitir para recarga de saldo. */
  invoiceId?: string;
  /** Referencia del cliente (titular que pagó, número de transacción, etc). */
  note?: string;
}

export interface CreatePlanDto {
  slug: string;
  name: string;
  description?: string;
  isPublic?: boolean;
  isActive?: boolean;
  trialDays?: number;
  sortOrder?: number;
  includedSeats?: number | null;
  includedWabas?: number | null;
  includedConversations?: number | null;
  includedContacts?: number | null;
  includedTemplates?: number | null;
  includedLinks?: number | null;
  includedStorageMiB?: number | null;
  billingModel?: ("SUBSCRIPTION" | "USAGE");
  usageConfig?: Record<string, unknown> | null;
}

export interface CreatePriceListDto {
  name: string;
  /** Etiquetas que activan la lista (por nombre, sin distinguir mayúsculas). */
  tagNames?: Array<string>;
  /** Descuento general sobre el precio de lista (0-100). */
  discountPercent?: number;
  /** Si varias listas coinciden, gana la de menor prioridad. */
  priority?: number;
  active?: boolean;
}

export interface CreatePricingRuleDto {
  country: string;
  category: ("marketing" | "utility" | "authentication" | "service");
  currency: string;
  /** Unidad de cobro: CONVERSATION (CBP clásico, default) o MESSAGE (PMP). */
  unit?: ("CONVERSATION" | "MESSAGE");
  metaCost: number;
  markupPercent: number;
  effectiveFrom?: string;
}

export interface CreateQuickReplyDto {
  /** Atajo con el que se invoca (p. ej. «/saludo»). */
  shortcut: string;
  title: string;
  /** Texto que se inserta en el mensaje. */
  body: string;
}

export interface CreateRechargeDto {
  amount: number;
  currency: string;
  returnTo?: string;
}

export interface CreateRenewalTemplateDto {
  /** WABA donde crearla. Obligatorio solo si la organización tiene varias. */
  wabaId?: string;
  /** Nombre de la plantilla en Meta (minúsculas y guiones bajos). */
  name?: string;
  language?: string;
  /** Texto del cuerpo, si se editó el sugerido. Debe conservar {{1}} {{2}} {{3}}. */
  bodyText?: string;
}

export interface CreateSalesOrderDto {
  contactId?: string;
  conversationId?: string;
  /** Cliente de la venta (perfil de facturación). Se preselecciona al facturar. */
  billingProfileId?: string;
  channel?: ("WHATSAPP" | "WEB" | "INSTAGRAM" | "STORE" | "MANUAL");
  currency?: string;
  notes?: string;
  items: Array<CreateSalesOrderItemDto>;
}

export interface CreateSalesOrderItemDto {
  /** Producto del catálogo (opcional: se permiten ítems libres). */
  productId?: string;
  /** Descripción (requerida si no hay productId). */
  description?: string;
  /** Tope defensivo: junto al de precio evita desbordar Int4 en los totales. */
  quantity: number;
  /** Precio unitario en centavos (requerido si no hay productId; si se envía con productId, pisa el precio del catálogo). */
  unitPriceCents?: number;
  /** IVA % (si no se envía, se toma del producto, o 0 para ítem libre). */
  taxRate?: number;
}

export interface CreateSalesProductDto {
  name: string;
  sku?: string;
  description?: string;
  /** Precio unitario en centavos (evita floats). */
  priceCents: number;
  /** Moneda ISO-4217 (3 letras mayúsculas). Por defecto COP. */
  currency?: string;
  /** IVA en porcentaje entero (0–100; típicamente 19, 5 o 0). */
  taxRate?: number;
  /** Código de unidad de medida DIAN (ej. "94"=unidad). */
  unitCode?: string;
  imageMediaId?: string;
  active?: boolean;
}

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

export interface CreateSignupLinkDto {
  wabaId: string;
  /** Texto de la pantalla de consentimiento que Meta muestra al abrir el link. */
  signupMessage: string;
  /** Mensaje que recibe el usuario al aceptar. Admite {{promo_code}}. */
  confirmationMessage: string;
  privacyPolicyUrl: string;
  websiteUrl?: string;
  promoCode?: string;
  /** Apodo interno; no lo ven los usuarios de WhatsApp. */
  displayName?: string;
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

export interface CreateTagDto {
  name: string;
  color?: string;
}

export interface CreateTaskDto {
  contactId: string;
  conversationId?: string;
  assignedToUserId?: string | null;
  title: string;
  description?: string;
  dueAt: string;
}

export interface CreateTemplateDto {
  wabaId: string;
  name: string;
  language: string;
  category: ("MARKETING" | "UTILITY" | "AUTHENTICATION");
  components: Array<TemplateComponentDto>;
}

export interface CreateVariantDto {
  name: string;
  priceCents: number;
  /** Días que dura lo vendido, contados desde la ENTREGA. Omitir o `null` = no vence (licencia perpetua), que es como se ha comportado siempre. */
  durationDays?: number | null;
  sortOrder?: number;
}

export interface CtaUrlDto {
  displayText: string;
  url: string;
}

export interface DisableDto {
  token: string;
}

export interface DispatchDto {
  productId: string;
  /** Variante a entregar (si el producto tiene variantes). */
  variantId?: string;
  /** Cantidad de licencias a entregar (1 a 50). Por defecto 1. */
  quantity?: number;
}

export interface EditMessageDto {
  body: string;
}

export interface EjecutarAccionDto {
  actionKey: string;
  /** Parámetros de la acción; el servidor valida contra el catálogo. */
  params?: Record<string, unknown>;
}

export interface EnableNumberDto {
  waId: string;
  note?: string;
}

export interface EndJornadaDto {
  note?: string;
}

export interface EventsDto {
  shiftStart?: boolean;
  lunchStart?: boolean;
  lunchEnd?: boolean;
  shiftEnd?: boolean;
}

export interface ForgotPasswordDto {
  email: string;
  captchaToken?: string;
}

export interface GenerateInvoiceDto {
  orderId: string;
  /** Empresa emisora desde la que se factura. Sin esto, la predeterminada. */
  configId?: string;
  /** A quién facturar (opcional: si no, el perfil por defecto del contacto). */
  billingProfileId?: string;
  /** Override de forma/medio de pago para ESTA factura (si no, el de la config). */
  paymentFormId?: number;
  paymentMethodId?: number;
}

export interface HolidayItemDto {
  date: string;
  name: string;
  /** Festivo pagado: acredita las horas del turno. Por defecto sí. */
  paid?: boolean;
}

export interface IgnorarPagoDto {
  nota?: string;
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

export interface InstallSolutionDto {
  wabaId?: string;
}

export interface InstallStoreTemplateDto {
  /** Opcional: si se pasa connectionId, la WABA se deriva de su número. */
  wabaId?: string;
  catalogKey: string;
  language?: string;
  name?: string;
  /** Si se pasa, además del template se crea el mapeo evento→plantilla. */
  connectionId?: string;
  bodyText?: string;
  bodyExample?: Array<string>;
  headerText?: string;
  headerExample?: string;
  footer?: string;
  /** { "1": "customer.name", "header": "store.name" } */
  variableMap?: Record<string, unknown>;
}

export interface InviteStaffDto {
  email: string;
  name?: string;
  role: ("SUPERADMIN" | "AGENT");
}

export interface InvoiceLicenseOrderDto {
  /** Venta de licencia ya PAGADA/ENTREGADA a facturar. */
  customerOrderId: string;
  /** A quién facturar. Si no viene, se usan los datos fiscales de abajo. */
  billingProfileId?: string;
  /** Datos fiscales que dio el cliente al pedir la factura. */
  legalName?: string;
  docNumber?: string;
  dv?: number;
  email?: string;
  address?: string;
  typeDocumentId?: number;
  typeOrganizationId?: number;
  typeRegimeId?: number;
  typeLiabilityId?: number;
  paymentFormId?: number;
  paymentMethodId?: number;
  /** Líneas EDITADAS desde el Facturador (revisión antes de emitir): si vienen, la factura se arma con estas (con su IVA por línea) en vez de derivarlas de la venta. Cada línea = descripción + cantidad + precio + IVA%. */
  items?: Array<CreateSalesOrderItemDto>;
  /** Notas/observaciones de la factura (opcional). */
  notes?: string;
}

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

export interface ManualCartItemDto {
  productId: string;
  variantId?: string | null;
  quantity?: number;
  unitPriceCents?: number;
}

export interface ManualInvoiceLineDto {
  description: string;
  quantity?: number;
  unitCost?: number;
  /** Total de la línea (puede ser negativo para descuentos). */
  total: number;
}

export interface ManualInvoicePlanCoverageDto {
  planId: string;
  interval: ("MONTHLY" | "YEARLY");
  /** Inicio de la cobertura (ISO date). El fin se deriva: +1 mes / +1 año. */
  startAt: string;
  /** Monto negociado de la cobertura (reemplaza el precio de lista). */
  amount: number;
  /** Alinear el ciclo de la org: asigna el plan (si es distinto), pone billingInterval=YEARLY y corre nextPlanRenewalAt al FIN de la cobertura (el cierre no re-cobra el año ya pagado). Solo válido con interval YEARLY. Default true. */
  applyToOrg?: boolean;
}

export interface MarkInvoicePaidDto {
  amount: number;
  description?: string;
}

export interface MoveDocumentDto {
  folderId: string | null;
}

export interface NoteDto {
  title?: string;
  content?: string;
  tags?: Array<string>;
  /** Clave de la pregunta sin respuesta que esta nota cubre (viene de insights). */
  resolvesQuestionKey?: string;
}

export type Object = Record<string, unknown>;

export interface PasskeyRegistrationVerifyDto {
  /** Nombre con el que el usuario reconoce la passkey («Mi iPhone»). */
  name: string;
  /** Respuesta de WebAuthn tal como la devuelve el navegador o la app. */
  response: Record<string, unknown>;
}

export interface PersistentMenuItemDto {
  title: string;
  /** `postback` (registra lo que tocó el usuario) o `web_url` (abre un enlace). */
  type: ("postback" | "web_url");
  /** URL si type=web_url; payload/slug si type=postback. */
  value: string;
}

export interface PrecioDeProductoDto {
  periodo: string;
  valorCents: number;
}

export interface PrecioDto {
  periodo: string;
  valorCents: number;
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

export interface PreviewPlanChangeDto {
  /** Slug del plan al que se quiere cambiar. */
  toPlanSlug: string;
  couponCode?: string;
}

export interface ProbarDto {
  mensajes: Array<TurnoDePruebaDto>;
  /** Instrucciones a probar sin haberlas guardado todavía. */
  instrucciones?: string;
}

export interface ProductSectionDto {
  title: string;
  productRetailerIds: Array<string>;
}

export interface ProductoDeTiendaDto {
  externalId: string;
  categoria: string;
  nombre: string;
  descripcion?: string;
  notas?: string;
  moneda?: string;
  urlContratacion?: string;
  stock?: number;
  activo?: boolean;
  precios: Array<PrecioDeProductoDto>;
}

export interface PurgePhoneNumberDto {
  /** Debe venir en true para confirmar el borrado definitivo. */
  confirm?: boolean;
}

export interface PurgeWabaDto {
  /** Debe venir en true para confirmar el borrado definitivo. */
  confirm?: boolean;
}

export interface QuickReplyDto {
  id: string;
  title: string;
}

export interface ReactivateDto {
  /** Si true, además de devolver el enlace, reenvía el correo de activación. */
  notify?: boolean;
}

export interface RechargePackDto {
  amountUsd: number;
  bonusUsd: number;
}

export interface RecordOptInDto {
  type: ("IN" | "OUT");
  source?: string;
  channel?: string;
  payload?: Record<string, unknown>;
}

export interface RedeemCouponDto {
  code: string;
  planSlug?: string;
}

export interface RefreshDto {
  /** Refresh token. OPCIONAL tras M10: las sesiones migradas lo envían por la cookie HttpOnly `mosend_rt`, no en el body. Se conserva opcional para las sesiones legacy que aún lo tienen en localStorage (transición). */
  refreshToken?: string;
}

export interface RefundOrderDto {
  /** Motivo del reembolso (trazabilidad). */
  reason?: string;
}

export interface RegisterDeviceDto {
  token: string;
  platform: ("IOS" | "ANDROID");
  appVersion?: string;
}

export interface RegisterDto {
  pin: string;
}

export interface RegistrarVentaManualDto {
  productId: string;
  variantId?: string;
  quantity?: number;
  /** ¿Entregar ya la licencia? */
  entregar: boolean;
  /** ¿El cliente ya pagó? (false = fiado / por cobrar). */
  pagado: boolean;
  /** Precio unitario a facturar en centavos (override del asesor: descuento u otro acuerdo). Si se omite, se usa el de la lista. */
  unitPriceCents?: number;
  /** ¿Enviar al cliente el mensaje "gracias por tu compra"? Por defecto sí. */
  notify?: boolean;
}

export interface RejectDeletionDto {
  /** Notas internas del staff sobre por qué se rechaza. */
  notes?: string;
}

export interface RemoveByFilterDto {
  q?: string;
  channel?: ("whatsapp" | "web" | "all");
  identifiedOnly?: boolean;
  tagId?: string;
  optInStatus?: ("UNKNOWN" | "OPTED_IN" | "OPTED_OUT");
  /** Prefijo numérico del país, p. ej. "57". */
  country?: string;
  language?: string;
  hasConversations?: boolean;
  lastActivityDaysGt?: number;
}

export interface RemoveMembersDto {
  contactIds: Array<string>;
}

export interface RenameDto {
  name: string;
}

export interface RenamePasskeyDto {
  name: string;
}

export interface ReorderItemsDto {
  /** Ids de los items en el nuevo orden. */
  itemIds: Array<string>;
}

export interface ReplaceLicenseKeyDto {
  /** 'inventory' (por defecto): saca la nueva del pool disponible. 'manual': usa la llave pegada en `replacementValue`. */
  source?: ("inventory" | "manual");
  /** Llave nueva a mano (obligatoria si source='manual'). */
  replacementValue?: string;
  /** Motivo del reemplazo (trazabilidad; ej. "no activó"). */
  reason?: string;
  /** Enviar al cliente el aviso de cambio de llave. Por defecto true. */
  notify?: boolean;
}

export interface ReprocessPaymentDto {
  paymentId: string;
}

export interface RequestCodeDto {
  waId: string;
}

export interface RequestDeletionDto {
  /** Nombre EXACTO de la organización, como confirmación. Debe coincidir. */
  confirmOrgName: string;
  /** Motivo opcional de la baja (para feedback interno). */
  reason?: string;
}

export interface RequestHandoffDto {
  /** Se acepta por compatibilidad; el origen queda registrado como «api». */
  reason?: string;
  /** Texto libre para el registro y el webhook («cliente pidió hablar con ventas»). */
  detail?: string;
}

export interface RequestRegistrationCodeDto {
  method: ("SMS" | "VOICE");
  language: string;
}

export interface RescheduleAppointmentDto {
  /** Nuevo inicio (ISO); debe ser un slot disponible del mismo tipo de cita. */
  startAt: string;
}

export interface ResendOtpDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface RotateDto {
  oldEndpoint: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface SdkSessionInfoDto {
  business_id?: string;
  waba_id?: string;
  phone_number_id?: string;
}

export interface SearchKnowledgeDto {
  query: string;
  /** Cuántos chunks devolver (1-20, default 5). */
  topK?: number;
  /** Filtrar a docs que tengan alguno de estos tags. */
  tags?: Array<string>;
  /** Umbral de similitud coseno 0-1 (default 0.3). */
  minSimilarity?: number;
}

export interface SellCartToConversationDto {
  items: Array<CartItemDto>;
  method?: ("NEQUI" | "TRANSFERENCIA");
  nequiPhone?: string;
  customerEmail?: string;
  /** Solo Bre-B: entrega ya (fiado) y concilia el cobro después. */
  entregarYa?: boolean;
  /** ¿Enviar el mensaje "gracias por tu compra"? Por defecto sí. */
  notify?: boolean;
}

export interface SellToConversationDto {
  productId: string;
  /** Variante a vender (requerida si el producto tiene variantes). */
  variantId?: string;
  /** Cantidad de licencias a vender (1 a 50). Por defecto 1. */
  quantity?: number;
  method?: ("NEQUI" | "DAVIPLATA" | "TRANSFERENCIA");
  nequiPhone?: string;
  userLegalId?: string;
  userLegalIdType?: ("CC" | "CE" | "NIT" | "PP" | "TI");
  customerEmail?: string;
  couponCode?: string;
  /** Solo Bre-B (TRANSFERENCIA): entrega la licencia YA (fiado) y deja el cobro pendiente; el conciliador lo marca pagado cuando entra la transferencia. */
  entregarYa?: boolean;
  /** ¿Enviar al cliente el mensaje "gracias por tu compra"? Por defecto sí. */
  notify?: boolean;
  /** Precio unitario (centavos) fijado a mano por el asesor: reemplaza el de lista/etiqueta y es lo que se cobra. Omitir = precio de lista. */
  unitPriceCents?: number;
}

export interface SendBookingFlowDto {
  contactId: string;
  appointmentTypeId: string;
  conversationId?: string;
  phoneNumberId?: string;
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
  kind: ("list" | "cta_url" | "location_request" | "request_contact_info");
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
  phoneNumberId: string;
  /** Número del destinatario en E.164. Aceptamos con o sin `+` para ser tolerantes con integraciones que usen formato internacional clásico (`+573001234567`) — la normalización quita el `+` antes de validar para que toda la app maneje un único formato (`573001234567`). Sin esto, un mismo número enviado a veces con `+` y a veces sin él creaba contactos y conversaciones duplicados (cada uno con `waId` distinto en la BD). El `@Matches` final exige que después de la normalización solo queden dígitos. */
  to: string;
  type: ("text" | "template" | "image" | "video" | "audio" | "document" | "sticker" | "location" | "contacts" | "interactive" | "reaction");
  /** Payload Meta-passthrough. Modo "experto": el cliente arma manualmente la estructura completa según WhatsApp Cloud API (`{ name, language, components: [...] }` para templates, `{ body }` para text, etc). Para `type === 'template'`, ahora es OPCIONAL. Si no se provee, hay que mandar `templateId` o `templateName` + `variables` y Mosend arma el payload internamente. Para los demás `type`, sigue siendo requerido. */
  payload?: Record<string, unknown>;
  /** Modo simplificado para `type === 'template'`. UUID de la plantilla en Mosend (no el `metaTemplateId`). Útil cuando el cliente ya tiene la plantilla creada desde el dashboard y solo quiere enviarla. */
  templateId?: string;
  /** Alternativa a `templateId`: nombre de la plantilla aprobada en Meta. Cuando hay varias plantillas con el mismo nombre en distintos idiomas, Meta resuelve por `templateLanguage`. Para WABAs con múltiples WABAs, se resuelve a partir del `phoneNumberId`. */
  templateName?: string;
  /** Código de idioma para `templateName`. Default = idioma de la primera plantilla aprobada con ese nombre en la WABA del phoneNumberId. */
  templateLanguage?: string;
  /** Variables que rellenan los `{{N}}` de la plantilla. Dos shapes posibles: - Array: solo body posicional → `["Juan", "12345"]` rellena `{{1}}` con "Juan" y `{{2}}` con "12345". - Objeto: para plantillas con header media o botones URL dinámicos: `{ body: ["Juan"], header: { type: "image", link: "..." }, buttons: [{ index: 0, value: "ord-456" }] }` El backend valida que el conteo de variables coincida con la plantilla. */
  variables?: Record<string, unknown>;
  clientId?: string;
  /** Si se envía como respuesta a otro mensaje (cita visible en WhatsApp del destinatario), pasar aquí el UUID del Message original. El backend resuelve su `metaMessageId` y lo manda a Meta como `context.message_id`. */
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

export interface SendStickerDto {
  phoneNumberId: string;
  to: string;
  replyToMessageId?: string;
}

export interface ServicioDto {
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
  precios?: Array<PrecioDto>;
}

export interface SetAppointmentStatusDto {
  status: ("NO_SHOW" | "COMPLETED");
}

export interface SetAutoPayDto {
  enabled: boolean;
  methodId?: string;
}

export interface SetAvailabilityDto {
  /** Reemplaza TODAS las reglas de la agenda general (staffUserId null). */
  rules: Array<AvailabilityRuleDto>;
}

export interface SetCaptchaDto {
  /** true = desactivar el captcha globalmente; false = reactivarlo. */
  disabled: boolean;
}

export interface SetConversationAgentDto {
  /** Agente del bot que atiende; null deja decidir al enrutador. */
  agentId: string | null;
}

export interface SetIntervalDto {
  interval: ("MONTHLY" | "YEARLY");
}

export interface SetOrderExpirationDto {
  expiresAt?: string | null;
}

export interface SetOvertimeDto {
  enabled: boolean;
}

export interface SetPaidAddonDto {
  enabled: boolean;
}

export interface SetPinnedDto {
  pinned: boolean;
}

export interface SetPriceListItemDto {
  productId: string;
  variantId?: string | null;
  priceCents?: number | null;
}

export interface SetReactionDto {
  /** Emoji unicode para reaccionar al mensaje. Si está vacío se interpreta como remover la reacción. */
  emoji: string;
}

export interface SetRoleDto {
  roleId: string;
}

export interface SetRolePermissionsDto {
  /** Claves de permiso (ver GET /permissions). Reemplaza el conjunto completo. */
  permissions?: Array<string>;
}

export interface SetSalesAddonsDto {
  salesBilling?: boolean;
  einvoicing?: boolean;
}

export interface SetSuspendedDto {
  suspended: boolean;
  /** Motivo opcional (solo al suspender). */
  reason?: string;
}

export interface SetUsernameDto {
  /** Formato de username de negocio de Meta: letras/números/punto/guion bajo. */
  username: string;
  /** 'force_transfer' lo mueve desde otro número del portfolio (error 147005 sin él). */
  transferAction?: Record<string, unknown>;
}

export interface SetWabaScopeDto {
  wabaIds: Array<string>;
}

export interface SetWorkModeDto {
  workMode: ("FIXED" | "HOURLY");
}

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

export interface SincronizarCatalogoDto {
  productos: Array<ProductoDeTiendaDto>;
}

export interface SnoozeConversationDto {
  /** Fecha ISO hasta la que se pospone. null = reactivar ahora. */
  until?: string | null;
  /** Motivo del snooze (visible al reabrirse). */
  note?: string;
}

export interface StepUp2faDto {
  code: string;
}

export interface SubmitOtpDto {
  /** Código OTP que le llegó al cliente por SMS (Daviplata). */
  code: string;
}

export interface SubscribeDto {
  endpoint: string;
  p256dh: string;
  auth: string;
}

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

export interface TestRunDto {
  messages?: Array<string>;
}

export interface TestSendDto {
  /** E.164 (con o sin '+'); se normaliza al enviar. */
  toPhone: string;
}

export interface TurnoDePruebaDto {
  rol: ("user" | "assistant");
  texto: string;
}

export interface TurnoDto {
  rol: ("user" | "assistant");
  texto: string;
}

export interface UnregisterDeviceDto {
  token: string;
}

export interface UnsubscribeDto {
  endpoint: string;
}

export interface UpdateAgendaSettingsDto {
  enabled?: boolean;
  minNoticeMin?: number;
  maxAdvanceDays?: number;
  /** Plantilla aprobada para el recordatorio. Convención de variables: {{1}} = nombre del contacto, {{2}} = fecha y hora local de la cita. */
  reminderTemplateName?: string | null;
  reminderTemplateLang?: string | null;
  /** Horas antes de la cita (0 = sin recordatorio, máx 72). */
  reminderHoursBefore?: number;
  reminderPhoneNumberId?: string | null;
  /** WhatsAppFlow (local) publicado para reserva con date-picker nativo. */
  bookingFlowId?: string | null;
}

export interface UpdateAiProviderDto {
  label?: string;
  enabled?: boolean;
  apiKey?: string | null;
  defaultModel?: string | null;
  intentModel?: string | null;
  whisperModel?: string | null;
  priorityOrder?: number;
  markupPercent?: number | null;
  notes?: string | null;
}

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

export interface UpdateAppointmentTypeDto {
  name?: string;
  description?: string | null;
  durationMin?: number;
  bufferMin?: number;
  active?: boolean;
}

export interface UpdateAttendanceSettingsDto {
  enabled?: boolean;
  autoCloseEnabled?: boolean;
  inactivityMinutes?: number;
  closeAtShiftEnd?: boolean;
  requireJornadaForInbox?: boolean;
  allowOvertime?: boolean;
  requireActiveToAttend?: boolean;
  workedCounting?: ("wall-clock" | "within-shift");
  /** `start-day` (jornada entera al día que empezó) o `split-by-day`. */
  dayAttribution?: ("start-day" | "split-by-day");
  /** Minutos de gracia antes de contar tardanza. */
  lateGraceMin?: number;
  /** Minutos de gracia antes de contar salida temprana. */
  earlyLeaveGraceMin?: number;
  /** Minutos mínimos trabajados para que un día con turno no cuente como falta. */
  absenceMinWorkedMin?: number;
  /** Forma del período de nómina para los atajos de corte. */
  payrollPeriod?: ("semimonthly" | "rolling-15" | "monthly");
  /** Incluir la jornada en curso (parcial) en los informes. */
  includeOpenSessions?: boolean;
  /** Celebración de los hitos de la jornada (frases + explosión). */
  celebrations?: unknown;
}

export interface UpdateAuthPolicyDto {
  maxSessionsPerUser: number;
}

export interface UpdateAutoReplyDto {
  name?: string;
  trigger?: ("KEYWORD" | "OUT_OF_HOURS" | "WELCOME" | "FALLBACK");
  keywordMatchMode?: ("EXACT" | "CONTAINS" | "STARTS_WITH" | "REGEX");
  keywords?: Array<string>;
  actionType?: ("SEND_TEXT" | "SEND_IMAGE" | "SEND_TEMPLATE" | "START_FLOW" | "TRANSFER_TO_HUMAN");
  textBody?: string;
  /** Imagen de la librería del bot, para actionType=SEND_IMAGE. */
  imageId?: string;
  templateId?: string;
  flowId?: string;
  phoneNumberId?: string;
  priority?: number;
  enabled?: boolean;
  cooldownSeconds?: number;
  /** Ventana de renovación en horas (solo aplica a WELCOME / OUT_OF_HOURS). null = usar default del dispatcher; 0 = sin ventana (siempre dispara). */
  renewAfterHours?: number;
  /** Si true, además de la acción marca la conv para asesor humano (handoff). */
  alsoHandoff?: boolean;
}

export interface UpdateBillingConfigDto {
  billingCycleDay?: number | null;
  markupOverride?: number | null;
  /** Impuesto sobre el subtotal (0.19 = IVA 19%). null/0 = sin impuesto. */
  taxPercent?: number | null;
  /** Plazo de pago en días (null = usar el default global). */
  dueDays?: number | null;
  /** Días de gracia tras vencer antes del corte (null = default global). */
  suspendAfterDays?: number | null;
  /** Ciclo de la suscripción del plan: MONTHLY (default) o YEARLY. */
  billingInterval?: ("MONTHLY" | "YEARLY");
  /** Fecha de la próxima renovación anual (solo YEARLY). ISO date. */
  nextPlanRenewalAt?: string | null;
  /** Org de cortesía: no se le emiten facturas (ni plan ni consumo). */
  billingExempt?: boolean;
}

export interface UpdateBillingProfileDto {
  legalName?: string;
  docNumber?: string;
  dv?: number | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  municipalityId?: number | null;
  typeDocumentId?: number;
  typeOrganizationId?: number;
  typeRegimeId?: number;
  typeLiabilityId?: number;
  isDefault?: boolean;
}

export interface UpdateBotAgentDto {
  /** Canales (ids de número, reales o virtuales de web chat / Instagram) en los que atiende el agente. Vacío = todos los canales de la organización. */
  phoneNumberIds?: Array<string>;
  /** Documentos de la memoria que este agente consulta (ids). Vacío = toda la biblioteca. */
  knowledgeDocIds?: Array<string>;
  /** Atajo legado de un solo canal; usa phoneNumberIds. */
  phoneNumberId?: string;
  name?: string;
  description?: string;
  isDefault?: boolean;
  enabled?: boolean;
  sortOrder?: number;
  provider?: ("anthropic" | "openai" | "openrouter" | "groq" | "meta");
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  enabledTools?: Array<("transfer_to_human" | "set_contact_attribute" | "end_conversation" | "enviar_botones")>;
  enabledCapabilities?: Array<("sell_licenses" | "book_appointment" | "crear_pedido" | "whmcs_support" | "buscar_dominios" | "send_images")>;
  routeTags?: Array<string>;
  knowledgeTags?: Array<string>;
  knowledgeTopK?: number;
  knowledgeMinSimilarity?: number;
}

export interface UpdateBotImageDto {
  label?: string;
  caption?: string;
}

export interface UpdateChannelDto {
  name?: string;
  /** Color de marca en hex (#rgb o #rrggbb). Se validaba solo como "texto", así que cualquier cadena se guardaba sin queja y la pantalla la mostraba rota. El widget ya desinfecta antes de pintar, así que esto no era explotable — pero sí una forma silenciosa de dejar el canal mal configurado. */
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
  /** Mensaje para la PAUSA entre dos tramos del mismo día (el mediodía). Si se deja vacío se usa `offlineMessage`. La columna existía en la base desde su migración pero no la aceptaba ningún endpoint, así que no había forma de escribirla: a la hora del almuerzo el visitante leía el mismo mensaje que a medianoche. */
  offlineMessageLunch?: string | null;
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

export interface UpdateCollectionConfigDto {
  dueDays?: number;
  reminderDays?: number;
  warningDays?: number;
  finalDays?: number;
  suspendAfterDays?: number;
  /** Días ANTES del vencimiento en que se recuerda que la factura está por vencer. 0 = sin aviso previo. Los demás plazos cuentan desde que ya venció. */
  preDueDays?: number;
  /** Día de corte GLOBAL del ciclo (1–28). Aplica a las orgs sin override. */
  billingCycleDay?: number;
  /** Intervalo GLOBAL por defecto. */
  billingInterval?: ("MONTHLY" | "YEARLY");
  /** Día del mes (1–28) en que se factura el PLAN separado del consumo. null = modo clásico (plan dentro del cierre del periodo). */
  planBillingDay?: number | null;
  /** Plazo de pago de la factura de plan (0 = vence el día de cobro). */
  planDueDays?: number;
  /** Días de ANTICIPO sobre el día de cobro. 0 = se emite el mismo día. El vencimiento no se mueve, así que con día de cobro 21 y anticipo 6 la factura sale el 15 y vence el 21 — el cliente gana plazo, no lo pierde. */
  planIssueLeadDays?: number;
  /** TRM fijada a mano (1 USD = X COP). Manda sobre la que captura el cron desde la Superfinanciera. `null` vuelve a la oficial. El tope no es decorativo: un cero o un número disparatado convertiría mal TODAS las facturas en pesos de ese cierre. */
  fxUsdCopManual?: number | null;
}

export interface UpdateConectorDto {
  name?: string;
  baseUrl?: string;
  /** Cadena vacía = borrar la credencial guardada. */
  authId?: string;
  authSecret?: string;
  enabled?: boolean;
  enabledActions?: Array<string>;
  customActions?: Array<Record<string, unknown>>;
}

export interface UpdateContactDto {
  name?: string;
  language?: string;
  attributes?: Record<string, unknown>;
  optInStatus?: Record<string, unknown>;
  /** Si true, el bot no le responde nada (exclusión total, solo conversacional). */
  botExcluded?: boolean;
}

export interface UpdateCouponDto {
  name?: string;
  description?: string;
  type?: ("PERCENT" | "FIXED");
  value?: number;
  currency?: string;
  maxRedemptions?: number;
  maxPerOrg?: number;
  validFrom?: string;
  validUntil?: string;
  isActive?: boolean;
  applicablePlans?: Array<string>;
  appliesToInterval?: ("MONTHLY" | "YEARLY");
}

export interface UpdateDigitalProductDto {
  name?: string;
  description?: string | null;
  sku?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  priceCents?: number;
  /** Días que dura lo vendido, contados desde la ENTREGA. Omitir o `null` = no vence (licencia perpetua), que es como se ha comportado siempre. */
  durationDays?: number | null;
  /** Si entra en el aviso de renovación. */
  renewalNoticeEnabled?: boolean;
  currency?: string;
  instructionsUrl?: string | null;
  entregaModo?: ("AUTOMATICA" | "ASISTIDA" | "CONSULTAR");
  datoAdicionalLabel?: string | null;
  datoAdicionalRequerido?: boolean;
  active?: boolean;
}

export interface UpdateEInvoicingConfigDto {
  /** Empresa emisora a editar. Sin esto se edita la predeterminada, o se crea la primera — que es el flujo de una org con una sola empresa. */
  configId?: string;
  /** Nombre visible de la emisora ("Mosend SAS"). */
  name?: string;
  /** Convierte esta emisora en la predeterminada de la org. */
  isDefault?: boolean;
  /** Solo https. El host además se valida contra la allowlist en el service (anti-SSRF: este valor termina en un fetch con el Bearer del emisor). */
  baseUrl?: string;
  /** Token apidian en claro (se cifra); '' lo borra. */
  apiKey?: string;
  idSoftware?: string;
  /** Resolución DIAN elegida (ResolutionNumber). '' la limpia. */
  resolutionNumber?: string;
  environment?: ("habilitacion" | "produccion");
  establishmentName?: string;
  establishmentAddress?: string;
  /** El proveedor valida `numeric|digits_between:7,10` y un "+57 320 555 1234" tumba TODAS las emisiones con un 422. Se acepta cualquier formato y el servicio se queda con los dígitos: rechazarlo dejaba a las orgs con un teléfono legado sin poder guardar nada más. */
  establishmentPhone?: string;
  /** NIT del emisor en el proveedor (solo dígitos, sin DV). Se usa para armar la ruta de descarga del PDF: /invoice/{nit}/{archivo}. */
  emitterNit?: string;
  establishmentEmail?: string;
  /** null lo borra (la factura vuelve al establecimiento de Diaxpi). `@Min(1)` porque un 0 es falsy: se colaba como "sin municipio" y devolvía al proveedor a su default (Cali), justo lo que el respaldo evita. */
  establishmentMunicipalityId?: number | null;
  /** Forma de pago DIAN por defecto (1=Contado, 2=Crédito). El proveedor NO lo valida cuando llega como objeto: un id inexistente revienta en 500. */
  paymentFormId?: (1 | 2);
  /** Medio de pago DIAN por defecto (10=Efectivo, 42=Consignación, …). */
  paymentMethodId?: number;
  sendByEmail?: boolean;
  enabled?: boolean;
  /** Prefijo de la resolución de Nota Crédito en el proveedor (default "NC"). '' vuelve al default. */
  creditNotePrefix?: string;
}

export interface UpdateFlowDto {
  name?: string;
  description?: string;
  enabled?: boolean;
  triggerType?: ("KEYWORD" | "INTENT" | "MANUAL" | "AUTO_REPLY" | "WELCOME");
  triggerConfig?: Record<string, unknown>;
  phoneNumberId?: string | null;
  json?: Record<string, unknown>;
}

export interface UpdateFlowJsonDto {
  flowJson: string;
}

export interface UpdateFlowMetaDto {
  name?: string;
  categories?: Array<string>;
}

export interface UpdateGoogleSyncDto {
  /** Citas de Mosend → eventos de Google. */
  pushEnabled?: boolean;
  /** "Ocupado" en Google bloquea horarios. */
  blockBusyEnabled?: boolean;
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

export interface UpdateLicenseCouponDto {
  code?: string;
  discountType?: ("PERCENT" | "FIXED");
  discountValue?: number;
  productId?: string | null;
  active?: boolean;
  maxRedemptions?: number | null;
  expiresAt?: string | null;
}

export interface UpdateLicenseDeliverySettingsDto {
  enabled?: boolean;
  wompiEnv?: ("test" | "prod");
  wompiPublicKey?: string | null;
  /** Se recibe en claro y se guarda cifrada. Enviar '' para borrar. */
  wompiPrivateKey?: string | null;
  wompiEventsSecret?: string | null;
  wompiIntegritySecret?: string | null;
  /** Plantilla de entrega fuera de 24h. {{1}}=producto {{2}}=llave {{3}}=link. */
  deliveryTemplateName?: string | null;
  deliveryTemplateLang?: string | null;
  /** Mensaje de entrega (sesión) configurable. Variables: {producto} {llave} {link}. */
  deliveryMessage?: string | null;
  /** Mensaje al reemplazar una llave. Variables: {producto} {llave} {link}. */
  replacementMessage?: string | null;
  /** Cobrar por transferencia a una llave (Bre-B / Nequi), sin pasarela. */
  transferEnabled?: boolean;
  /** Llave Bre-B (@usuario, correo, celular) o número Nequi que recibe. */
  transferKey?: string | null;
  /** Titular de la cuenta; se le muestra al cliente antes de que transfiera. */
  transferHolder?: string | null;
  /** Texto libre que acompaña a la llave en el mensaje al cliente. */
  transferInstructions?: string | null;
  /** Código de control para identificar la orden cuando hay colisión: se cobra el neto si está libre, y si no, se baja de a un peso. */
  transferAmountCode?: boolean;
  /** Horas que la orden espera la transferencia antes de expirar (1 a 168). */
  transferExpiryHours?: number;
  /** Vender también lo que no tiene existencias (lo cierra un asesor). */
  transferSellWithoutStock?: boolean;
  /** Bandeja donde caen las notificaciones del banco. */
  inboxHost?: string | null;
  inboxPort?: number;
  inboxUser?: string | null;
  /** Se recibe en claro y se guarda cifrada. Enviar '' para borrar. */
  inboxPassword?: string | null;
  inboxTls?: boolean;
  /** Dominio que debe haber FIRMADO el correo para darlo por bueno. */
  inboxSenderDomain?: string;
  /** Buzón desde el que se reenvía (p. ej. `alguien@outlook.com`). Vacío = solo vale la firma del banco. Baja el listón: ver el docblock en el esquema. */
  inboxForwarderAddress?: string | null;
  /** Carpeta a la que mover los correos ya registrados (p. ej. `Procesados`). Vacío = se quedan en la bandeja de entrada. */
  inboxProcessedFolder?: string | null;
  /** true = eliminar los correos ya registrados tras leerlos (no llenar la bandeja) en vez de moverlos a una carpeta. */
  inboxDeleteAfterRead?: boolean;
  /** OFF = no se lee · SUGGEST = propone · AUTO = aprueba y entrega. */
  inboxMode?: ("OFF" | "SUGGEST" | "AUTO");
  /** Horas hacia atrás en las que se busca un pago para una orden (1 a 168). */
  matchWindowHours?: number;
  /** Umbral de stock bajo (0 = sin alerta). */
  lowStockThreshold?: number;
  /** Máximo de licencias por cliente en la ventana (0 = sin límite). */
  maxPerCustomer?: number;
  /** Ventana (días) del límite por cliente. */
  maxPerCustomerDays?: number;
  /** Avisar al cliente antes de que se le venza la licencia. */
  renewalEnabled?: boolean;
  /** Días de antelación del primer aviso (1 a 90). */
  renewalDaysBefore?: number;
  /** Segundo aviso el mismo día del vencimiento. */
  renewalSecondNotice?: boolean;
  /** Avisar solo dentro del horario de atención de la organización. */
  renewalOnlyBusinessHours?: boolean;
  /** Número emisor del aviso para las ventas que no guardan el suyo. */
  renewalPhoneNumberId?: string | null;
  /** Qué hacer cuando el cliente dice que sí. */
  renewalOnYes?: ("HANDOFF" | "BOT" | "TAG");
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

export interface UpdateMyPreferencesDto {
  /** Pestaña con la que abre el panel de información del contacto en el inbox. */
  contactPanelDefaultTab?: ("info" | "notes" | "tasks" | "gallery");
}

export interface UpdateNoteDto {
  body?: string;
  pinned?: boolean;
}

export interface UpdateOrderStatusDto {
  status: Record<string, unknown>;
}

export interface UpdateOrganizationDto {
  name?: string;
  billingEmail?: string;
  country?: string;
  timezone?: string;
  businessHoursSchedule?: Record<string, unknown> | null;
  optOutEnabled?: boolean;
  optOutKeywords?: Array<string>;
}

export interface UpdateOutboundDto {
  url?: string;
  events?: Array<string>;
  format?: ("GENERIC" | "TEAMS");
  active?: boolean;
  unansweredThresholdMinutes?: number;
  phoneNumberIds?: Array<string>;
  agentStatuses?: Array<("ONLINE" | "LUNCH" | "BREAK" | "MEETING" | "TRAINING" | "ENDED")>;
}

export interface UpdatePlanDto {
  name?: string;
  description?: string;
  includedSeats?: number | null;
  includedWabas?: number | null;
  includedConversations?: number | null;
  includedContacts?: number | null;
  includedTemplates?: number | null;
  includedLinks?: number | null;
  includedStorageMiB?: number | null;
  includedOrganizations?: number | null;
  perSeatExtraPrice?: number;
  perWabaExtraPrice?: number;
  perOrganizationExtraPrice?: number;
  storageBlockGiB?: number | null;
  perStorageBlockPrice?: number;
  /** Tarifa fija mensual del módulo de entrega de licencias (add-on). */
  licenseDeliveryFee?: number;
  features?: Record<string, unknown>;
  trialDays?: number;
  isPublic?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  outboundMessagesPerMinute?: number | null;
  broadcastsPerDay?: number | null;
  bullPriority?: number;
  apiRequestsPerMinute?: number | null;
  mediaUploadsPerMinute?: number | null;
  billingModel?: ("SUBSCRIPTION" | "USAGE");
  usageConfig?: Record<string, unknown> | null;
}

export interface UpdatePolicyDto {
  enabled?: boolean;
  signupCreditUsd?: number;
  lowBalanceThresholdUsd?: number;
  softDailyLimitUsd?: number;
  rechargePacks?: Array<RechargePackDto>;
  minCustomRechargeUsd?: number;
}

export interface UpdatePriceListDto {
  name?: string;
  tagNames?: Array<string>;
  discountPercent?: number;
  priority?: number;
  active?: boolean;
}

export interface UpdatePricingRuleDto {
  metaCost?: number;
  markupPercent?: number;
}

export interface UpdatePublicPriceListDto {
  slug?: string;
  title?: string;
  active?: boolean;
  senderPhoneNumberId?: string | null;
  otpTemplateId?: string | null;
  sessionDays?: number;
  showOutOfStock?: boolean;
  /** Qué precio mostrar: 'contact' (por etiqueta del visitante), 'fixed' (una lista fija para todos), 'base' (solo precios normales). */
  priceSource?: ("contact" | "fixed" | "base");
  /** Lista fija a mostrar cuando priceSource = 'fixed' (null para limpiar). */
  fixedPriceListId?: string | null;
  /** Mostrar el precio base tachado junto al de la lista (el "otro precio"). */
  showBaseComparison?: boolean;
}

export interface UpdateQuickReplyDto {
  shortcut?: string;
  title?: string;
  body?: string;
}

export interface UpdateRoadmapItemDto {
  status?: ("IDEA" | "PLANNED" | "BUILDING" | "BETA" | "LIVE" | "DROPPED");
  notes?: string;
  priority?: number;
  targetQuarter?: string | null;
}

export interface UpdateSalesOrderStatusDto {
  status: ("DRAFT" | "CONFIRMED" | "PAID" | "FULFILLED" | "CANCELLED");
}

export interface UpdateSalesProductDto {
  name?: string;
  sku?: string | null;
  description?: string | null;
  priceCents?: number;
  currency?: string;
  taxRate?: number;
  unitCode?: string | null;
  imageMediaId?: string | null;
  active?: boolean;
}

export interface UpdateShiftRemindersDto {
  enabled?: boolean;
  channels?: ChannelsDto;
  events?: EventsDto;
  shiftStartLeadMin?: number;
  shiftEndLeadMin?: number;
}

export interface UpdateSignupLinkDto {
  status?: ("ACTIVE" | "DISABLED");
  signupMessage?: string;
  confirmationMessage?: string;
  promoCode?: string;
  displayName?: string;
  websiteUrl?: string;
}

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

export interface UpdateStaffDto {
  role?: ("SUPERADMIN" | "AGENT");
  active?: boolean;
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

export interface UpdateTagDto {
  name?: string;
  color?: string;
}

export interface UpdateTagsDto {
  tags: Array<string>;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string | null;
  dueAt?: string;
  assignedToUserId?: string | null;
}

export interface UpdateTeamGoalsDto {
  weeklyConversationsCreated?: number | null;
  weeklyConversationsClosed?: number | null;
  weeklyMessagesOut?: number | null;
  closureRateTarget?: number | null;
  resolutionRateTarget?: number | null;
}

export interface UpdateTemplateDto {
  components: Array<TemplateComponentDto>;
}

export interface UpdateTitleDto {
  title: string;
}

export interface UpdateUserDto {
  name?: string;
  locale?: string;
  email?: string;
  phone?: string;
}

export interface UpdateVariantDto {
  name?: string;
  priceCents?: number;
  /** Días que dura lo vendido, contados desde la ENTREGA. Omitir o `null` = no vence (licencia perpetua), que es como se ha comportado siempre. */
  durationDays?: number | null;
  active?: boolean;
  sortOrder?: number;
}

export interface UploadBotImageDto {
  /** Nombre corto con el que el agente identifica la imagen. */
  label?: string;
  caption?: string;
}

export interface UploadOptsDto {
  title?: string;
  /** Lista de tags separados por coma (viene como string en multipart). */
  tags?: string;
}

export interface UpsertBotConfigDto {
  enabled?: boolean;
  mode?: ("OFF" | "RULES_ONLY" | "RULES_PLUS_AI_FALLBACK" | "AI_AGENT");
  /** OBSOLETO: ya no descarta mensajes entrantes. Se acepta para no romper clientes viejos, pero no tiene efecto. Ver los dos campos siguientes. */
  cooldownSeconds?: number;
  /** Segundos de silencio antes de responder, para agrupar los mensajes seguidos de una persona en un solo turno. 0 = responder de inmediato. */
  debounceSeconds?: number;
  /** Tope de respuestas del bot a un mismo contacto dentro de la ventana; al superarlo pasa a humano. 0 = sin tope. */
  maxRepliesPerWindow?: number;
  replyWindowMinutes?: number;
  /** Minutos tras terminar un flujo en los que el bot no vuelve a arrancarlo, para que el cliente no lo reinicie sin querer. 0 = sin gracia. Conviene bajarlo si los flujos terminan preguntando algo: durante esos minutos, quien conteste lo que se le preguntó no recibe respuesta. */
  postFlowGraceMin?: number;
  disclosureMessage?: string;
  humanHandoffKeywords?: Array<string>;
  /** Texto que el bot envía al cliente cuando dispara handoff (tool del agente, keyword, regla o flujo). String vacío = no enviar nada. */
  handoffMessage?: string;
  aiEnabled?: boolean;
  /** Cuál proveedor IA usa el agente conversacional. Null = anthropic (compat con configs previas). */
  aiProvider?: ("anthropic" | "openai" | "openrouter" | "groq" | "meta");
  aiModel?: string;
  aiSystemPrompt?: string;
  aiTemperature?: number;
  aiMaxTokens?: number;
  intentClassifierEnabled?: boolean;
  knowledgeTopK?: number;
  knowledgeMinSimilarity?: number;
  knowledgeTags?: Array<string>;
  welcomeEnabled?: boolean;
  outOfHoursEnabled?: boolean;
  fallbackEnabled?: boolean;
  outOfHoursSchedule?: Record<string, unknown>;
  outOfHoursTaskEnabled?: boolean;
  /** Admite {apertura}. Vacío = no avisar al cliente. */
  outOfHoursTaskMessage?: string;
  outOfHoursTaskGraceMin?: number;
  followUpEnabled?: boolean;
  followUpAfterMin?: number;
  followUpCloseAfterMin?: number;
  followUpMode?: ("AI" | "TEXT");
  followUpMessage?: string;
  /** Vacío = cerrar sin despedida. */
  followUpCloseMessage?: string;
}

export interface UpsertContactDto {
  waId: string;
  name?: string;
  language?: string;
  attributes?: Record<string, unknown>;
}

export interface UpsertHolidaysDto {
  items: Array<HolidayItemDto>;
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
  /** ID del workspace de Anthropic (formato "wrkspc_..."). Requerido para keys identity-linked de Claude; se envía como header `anthropic-workspace-id`. Null o '' para borrarlo. Sólo aplica al proveedor anthropic. */
  workspaceId?: string | null;
}

export interface UpsertPlanPriceDto {
  currency: ("USD" | "COP");
  interval: ("MONTHLY" | "YEARLY");
  amount: number;
  /** Precio promocional. Si se envía (≥0), ES el precio que se cobra; `amount` queda como precio de lista. Enviar `null` para limpiar la promo. */
  promoAmount?: number | null;
  promoLabel?: string | null;
}

export interface UpsertProfileDto {
  address?: string;
  description?: string;
  email?: string;
  vertical?: ("AUTOMOTIVE" | "BEAUTY" | "APPAREL" | "EDU" | "ENTERTAIN" | "EVENT_PLAN" | "FINANCE" | "GROCERY" | "GOVT" | "HOTEL" | "HEALTH" | "NONPROFIT" | "PROF_SERVICES" | "RETAIL" | "TRAVEL" | "RESTAURANT" | "OTHER");
  websites?: Array<string>;
}

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

export interface UrlSourceDto {
  url: string;
  title?: string;
  tags?: Array<string>;
  /** Cada cuántas horas volver a leer la página; sin valor = solo a mano. */
  syncEveryHours?: number;
}

export interface ValidateEInvoicingDto {
  /** Token en claro a probar; si se omite, usa el guardado. */
  apiKey?: string;
  idSoftware?: string;
  baseUrl?: string;
}

export interface VentaManualCarritoDto {
  items: Array<ManualCartItemDto>;
  /** ¿Entregar ya las licencias? */
  entregar: boolean;
  /** ¿El cliente ya pagó? (false = fiado / por cobrar). */
  pagado: boolean;
  /** ¿Enviar el mensaje "gracias por tu compra"? Por defecto sí. */
  notify?: boolean;
}

export interface VerifyCodeDto {
  waId: string;
  code: string;
}

export interface VerifyDto {
  token: string;
}

export interface VerifyEmailDto {
  token: string;
}

export interface VerifyPhoneCodeDto {
  code: string;
}

export interface VerifyRegistrationCodeDto {
  code: string;
}

export interface VisibilityDto {
  visibility: ("ORG" | "PRIVATE");
}

export interface WebChatSendMessageDto {
  /** Tipo de mensaje. Si no se especifica, default 'text'. */
  type?: ("text" | "image" | "video" | "audio" | "document");
  /** Texto del mensaje (requerido si type='text'; opcional como caption en otros). */
  body?: string;
  /** Id del MediaAsset previamente subido vía /web-chat/media. Requerido cuando type != 'text'. */
  mediaAssetId?: string;
  /** UUID del Message al que el agente responde (cita visible en widget). */
  replyToMessageId?: string;
}


/*
 * NOTAS
 * - 296 schemas generados desde components.schemas.
 * - El export OpenAPI no incluye schemas de respuesta ni los `@Body() {...}`
 *   inline; esos tipos siguen escritos a mano en src/types/.
 * - SendMessageDto existe en dos módulos (messages y web-chat); Swagger colapsa
 *   uno solo. El messages.SendMessageInput del SDK se mantiene a mano contra el
 *   DTO fuente real.
 */
