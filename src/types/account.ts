// Cuenta, equipo y operación: sesiones, registro con OTP, invitaciones,
// grupo de facturación, eliminación de la cuenta, jornada/novedades,
// encuestas, anuncios, límite de mensajes, OAuth y vistas de staff.

export interface AuthSession {
  id: string;
  /** Navegador/sistema deducidos del user-agent. */
  device: Record<string, unknown>;
  ip: string | null;
  location: string | null;
  geoCountryCode: string | null;
  lastActivityAt: string;
  expiresAt: string;
  /** La sesión desde la que se hizo la consulta. */
  current: boolean;
}

export interface SignupRequestCodeInput {
  email: string;
  password: string;
  name: string;
  phone: string;
  captchaToken?: string;
}

export interface SignupResendCodeInput {
  email: string;
  phone: string;
}

export interface SignupVerifyCodeInput {
  email: string;
  phone: string;
  code: string;
}

export interface RequestDeletionInput {
  /** Nombre exacto de la organización, como confirmación. */
  confirmOrgName: string;
  reason?: string;
}

export interface AcceptSignupInput {
  token: string;
  name: string;
  password: string;
}

export interface ActivateAccountInput {
  token: string;
  password: string;
}

export interface BulkInvitationInput {
  emails: string[];
  roleId: string;
  wabaIds?: string[];
}

export interface PreregisterInput {
  members: { email: string; name?: string }[];
  roleId: string;
  wabaIds?: string[];
}

export interface SetSuspensionInput {
  suspended: boolean;
  reason?: string;
}

export interface UpdateMyPreferencesInput {
  contactPanelDefaultTab?: "info" | "notes" | "tasks" | "gallery";
}

export interface SetAiLimitsInput {
  dailyUsd?: number;
  monthlyUsd?: number;
}

export interface RegisterDeviceInput {
  token: string;
  platform: "IOS" | "ANDROID";
  appVersion?: string;
}

export type WorkMode = "FIXED" | "HOURLY";

export interface OrgHoliday {
  id: string;
  organizationId: string;
  date: string;
  name: string;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HolidayItem {
  /** YYYY-MM-DD */
  date: string;
  name: string;
  /** Festivo pagado: acredita las horas del turno. Por defecto sí. */
  paid?: boolean;
}

export type LeaveType = "VACATION" | "SICK" | "PERMISSION" | "UNPAID" | "OTHER";

export interface AgentLeave {
  id: string;
  organizationId: string;
  agentUserId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  note: string | null;
  createdByUserId: string | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface CreateLeaveInput {
  agentUserId: string;
  type: LeaveType;
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD */
  endDate: string;
  note?: string;
}

export interface SurveyQuestion {
  text: string;
  options: string[];
}

export interface UpdateSurveyConfigInput {
  active?: boolean;
  delayMinutes?: number;
  audience?: "ALL" | "HUMAN" | "BOT";
  cooldownDays?: number;
  questions?: SurveyQuestion[];
  askComment?: boolean;
  commentQuestion?: string;
  thanksMessage?: string;
  answerTimeoutHours?: number;
  phoneNumberIds?: string[];
}

export interface UpdateAdCampaignInput {
  queOfrece?: string;
  productIds?: string[];
  botAgentId?: string;
  tagId?: string;
  mensajeInicial?: string;
  activo?: boolean;
}

export interface TeamSeriesQuery {
  from?: string;
  to?: string;
  granularity?: "day" | "week" | "month";
  compare?: boolean;
  channel?: "WHATSAPP" | "WEB" | "INSTAGRAM";
}

export interface SalesReportQuery {
  desde?: string;
  hasta?: string;
  agrupar?: "dia" | "semana" | "mes";
  moneda?: string;
  perfilId?: string;
  phoneNumberId?: string;
  agentId?: string;
  userId?: string;
  productId?: string;
  anuncioId?: string;
}

export interface UpdateAiCreditPolicyInput {
  enabled?: boolean;
  signupCreditUsd?: number;
  lowBalanceThresholdUsd?: number;
  softDailyLimitUsd?: number;
  rechargePacks?: { amountUsd: number; bonusUsd: number }[];
  minCustomRechargeUsd?: number;
}

export interface AdjustAiCreditsInput {
  amountUsd: number;
  note: string;
}

export interface WabaUsageQuery {
  days?: number;
  desde?: string;
  hasta?: string;
}

export interface OAuthDecisionInput {
  /** `true` permite; `false` devuelve `access_denied` a la aplicación. */
  approve: boolean;
  /** Organización sobre la que se concede el acceso (obligatoria al aprobar). */
  organizationId?: string;
}

/** Cuerpo de `POST /oauth/token` con los nombres del estándar (RFC 6749). */
export interface OAuthTokenRequestInput {
  grant_type: "authorization_code" | "refresh_token";
  code?: string;
  redirect_uri?: string;
  code_verifier?: string;
  refresh_token?: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token: string;
  scope: string;
}

/** Cuerpo de `POST /oauth/revoke` (RFC 7009) y `POST /oauth/introspect` (RFC 7662). */
export interface OAuthTokenReferenceInput {
  token: string;
  token_type_hint?: "access_token" | "refresh_token";
  client_id?: string;
  client_secret?: string;
}

export interface OAuthAuthorizeQuery {
  response_type: "code";
  client_id: string;
  redirect_uri: string;
  scope: string;
  state: string;
  code_challenge: string;
  code_challenge_method: "S256";
  prompt?: "none" | "consent" | "login";
}
