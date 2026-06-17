import { createHttpClient, type FetchLike, type HttpClient, type RetryConfig } from "./core/http.js";
import type { MosendAuthError} from "./core/errors.js";
import { MosendApiError, MosendValidationError } from "./core/errors.js";
import { TokenManager } from "./core/tokenManager.js";
import type { AuthTokens } from "./types/identity.js";
import { AddonsResource } from "./resources/addons.js";
import { ApiKeysResource } from "./resources/apiKeys.js";
import { AuditResource } from "./resources/audit.js";
import { AuthResource } from "./resources/auth.js";
import { AutoRepliesResource } from "./resources/autoReplies.js";
import { BillingResource } from "./resources/billing.js";
import { BotConfigResource } from "./resources/botConfig.js";
import { BotEventsResource } from "./resources/botEvents.js";
import { BroadcastsResource } from "./resources/broadcasts.js";
import { ContactListsResource } from "./resources/contactLists.js";
import { ContactsResource } from "./resources/contacts.js";
import { ConversationsResource } from "./resources/conversations.js";
import { CreditNotesResource } from "./resources/creditNotes.js";
import { FlowsResource } from "./resources/flows.js";
import { HealthResource } from "./resources/health.js";
import { IntegrationsResource } from "./resources/integrations.js";
import { InvitationsResource } from "./resources/invitations.js";
import { InvoicesResource } from "./resources/invoices.js";
import { KnowledgeResource } from "./resources/knowledge.js";
import { LeadsResource } from "./resources/leads.js";
import { MediaResource } from "./resources/media.js";
import { MembershipsResource } from "./resources/memberships.js";
import { MercadoPagoResource } from "./resources/mercadoPago.js";
import { MessagesResource } from "./resources/messages.js";
import { NotificationsResource } from "./resources/notifications.js";
import { OptInsResource } from "./resources/optIns.js";
import { OrgAiProvidersResource } from "./resources/orgAiProviders.js";
import { OrganizationsResource } from "./resources/organizations.js";
import { PasskeysResource } from "./resources/passkeys.js";
import { PaymentMethodsResource } from "./resources/paymentMethods.js";
import { PermissionsResource } from "./resources/permissions.js";
import { PhoneNumbersResource } from "./resources/phoneNumbers.js";
import { PlanLimitsResource } from "./resources/planLimits.js";
import { PlansResource } from "./resources/plans.js";
import { PricingResource } from "./resources/pricing.js";
import { ProfilesResource } from "./resources/profiles.js";
import { PushResource } from "./resources/push.js";
import { QuickRepliesResource } from "./resources/quickReplies.js";
import { ReactionsResource } from "./resources/reactions.js";
import { ReportsResource } from "./resources/reports.js";
import { RolesResource } from "./resources/roles.js";
import { StickersResource } from "./resources/stickers.js";
import { TagsResource } from "./resources/tags.js";
import { TemplatesResource } from "./resources/templates.js";
import { TwoFactorResource } from "./resources/twoFactor.js";
import { UsageResource } from "./resources/usage.js";
import { UsersResource } from "./resources/users.js";
import { WabaResource } from "./resources/waba.js";
import { WalletAlertsResource } from "./resources/walletAlerts.js";
import { WalletResource } from "./resources/wallet.js";
import { WebChatPublicResource } from "./resources/webChatPublic.js";
import { WebChatResource } from "./resources/webChat.js";
import { WebhooksOutboundResource } from "./resources/webhooksOutbound.js";
import { WhatsappLinksResource } from "./resources/whatsappLinks.js";
import { TasksResource } from "./resources/tasks.js";
import { AiCreditsResource } from "./resources/aiCredits.js";
import { SystemNoticesResource } from "./resources/systemNotices.js";

export interface MosendClientOptions {
  apiKey?: string;
  accessToken?: string;
  /**
   * Initial JWT tokens. Enables auto-refresh: when accessToken is near
   * expiration the SDK calls POST /auth/refresh, persists the rotated pair,
   * and retries pending requests transparently.
   */
  tokens?: AuthTokens;
  /**
   * Fires every time the SDK refreshes the JWT pair. Persist the new tokens
   * in your own storage (DB, encrypted cookie, secure storage) so they survive
   * process restarts.
   */
  onTokenRefresh?: (tokens: AuthTokens) => Promise<void> | void;
  /**
   * Fires when the refresh token itself is rejected. Typical action: clear
   * local session and redirect the user to login.
   */
  onAuthFailure?: (error: MosendAuthError) => Promise<void> | void;
  /**
   * Milliseconds before expiry to trigger a proactive refresh. Default 30000.
   */
  refreshSkewMs?: number;
  orgId?: string;
  baseUrl?: string;
  timeout?: number;
  retries?: RetryConfig;
  fetch?: FetchLike;
  userAgent?: string;
  defaultHeaders?: Record<string, string>;
}

export class MosendClient {
  readonly addons: AddonsResource;
  readonly apiKeys: ApiKeysResource;
  readonly audit: AuditResource;
  readonly auth: AuthResource;
  readonly autoReplies: AutoRepliesResource;
  readonly billing: BillingResource;
  readonly botConfig: BotConfigResource;
  readonly botEvents: BotEventsResource;
  readonly broadcasts: BroadcastsResource;
  readonly contactLists: ContactListsResource;
  readonly contacts: ContactsResource;
  readonly conversations: ConversationsResource;
  readonly creditNotes: CreditNotesResource;
  readonly flows: FlowsResource;
  readonly health: HealthResource;
  readonly integrations: IntegrationsResource;
  readonly invitations: InvitationsResource;
  readonly invoices: InvoicesResource;
  readonly knowledge: KnowledgeResource;
  readonly leads: LeadsResource;
  readonly media: MediaResource;
  readonly memberships: MembershipsResource;
  readonly mercadoPago: MercadoPagoResource;
  readonly messages: MessagesResource;
  readonly notifications: NotificationsResource;
  readonly optIns: OptInsResource;
  readonly orgAiProviders: OrgAiProvidersResource;
  readonly organizations: OrganizationsResource;
  readonly passkeys: PasskeysResource;
  readonly paymentMethods: PaymentMethodsResource;
  readonly permissions: PermissionsResource;
  readonly phoneNumbers: PhoneNumbersResource;
  readonly planLimits: PlanLimitsResource;
  readonly plans: PlansResource;
  readonly pricing: PricingResource;
  readonly profiles: ProfilesResource;
  readonly push: PushResource;
  readonly quickReplies: QuickRepliesResource;
  readonly reactions: ReactionsResource;
  readonly reports: ReportsResource;
  readonly roles: RolesResource;
  readonly stickers: StickersResource;
  readonly tags: TagsResource;
  readonly templates: TemplatesResource;
  readonly twoFactor: TwoFactorResource;
  readonly usage: UsageResource;
  readonly users: UsersResource;
  readonly waba: WabaResource;
  readonly wallet: WalletResource;
  readonly walletAlerts: WalletAlertsResource;
  readonly webChat: WebChatResource;
  readonly webChatPublic: WebChatPublicResource;
  readonly webhooksOutbound: WebhooksOutboundResource;
  readonly whatsappLinks: WhatsappLinksResource;
  readonly tasks: TasksResource;
  readonly aiCredits: AiCreditsResource;
  readonly systemNotices: SystemNoticesResource;

  private readonly http: HttpClient;
  private tokenManager: TokenManager | undefined;

  constructor(options: MosendClientOptions = {}) {
    this.http = createHttpClient({
      ...(options.apiKey !== undefined ? { apiKey: options.apiKey } : {}),
      ...(options.accessToken !== undefined ? { accessToken: options.accessToken } : {}),
      baseUrl: options.baseUrl ?? "https://api.mosend.dev",
      timeoutMs: options.timeout ?? 30_000,
      retries: options.retries ?? null,
      fetch: options.fetch ?? globalThis.fetch,
      userAgent: options.userAgent ?? "moshipp-mosend-sdk/1.0.0",
      defaultHeaders: options.defaultHeaders ?? {},
    });

    if (options.tokens) {
      const tm = new TokenManager({
        initialTokens: options.tokens,
        ...(options.refreshSkewMs !== undefined ? { refreshSkewMs: options.refreshSkewMs } : {}),
        ...(options.onTokenRefresh ? { onTokenRefresh: options.onTokenRefresh } : {}),
        ...(options.onAuthFailure ? { onAuthFailure: options.onAuthFailure } : {}),
        refresh: async (refreshToken: string): Promise<AuthTokens> => {
          // skipAuth: true → HttpClient does not consult the TokenManager for
          // this call (no recursion) and does not auto-retry on 401 (a 401
          // here means the refresh token itself is rejected).
          const res = await this.http.request<AuthTokens>({
            method: "POST",
            path: "/auth/refresh",
            body: { refreshToken },
            skipAuth: true,
          });
          return res.data;
        },
      });
      this.tokenManager = tm;
      this.http.setTokenManager(tm);
    }

    const ctx = { http: this.http, defaultOrgId: options.orgId };
    this.addons = new AddonsResource(ctx);
    this.apiKeys = new ApiKeysResource(ctx);
    this.audit = new AuditResource(ctx);
    this.auth = new AuthResource(ctx);
    this.autoReplies = new AutoRepliesResource(ctx);
    this.billing = new BillingResource(ctx);
    this.botConfig = new BotConfigResource(ctx);
    this.botEvents = new BotEventsResource(ctx);
    this.broadcasts = new BroadcastsResource(ctx);
    this.contactLists = new ContactListsResource(ctx);
    this.contacts = new ContactsResource(ctx);
    this.conversations = new ConversationsResource(ctx);
    this.creditNotes = new CreditNotesResource(ctx);
    this.flows = new FlowsResource(ctx);
    this.health = new HealthResource(ctx);
    this.integrations = new IntegrationsResource(ctx);
    this.invitations = new InvitationsResource(ctx);
    this.invoices = new InvoicesResource(ctx);
    this.knowledge = new KnowledgeResource(ctx);
    this.leads = new LeadsResource(ctx);
    this.media = new MediaResource(ctx);
    this.memberships = new MembershipsResource(ctx);
    this.mercadoPago = new MercadoPagoResource(ctx);
    this.messages = new MessagesResource(ctx);
    this.notifications = new NotificationsResource(ctx);
    this.optIns = new OptInsResource(ctx);
    this.orgAiProviders = new OrgAiProvidersResource(ctx);
    this.organizations = new OrganizationsResource(ctx);
    this.passkeys = new PasskeysResource(ctx);
    this.paymentMethods = new PaymentMethodsResource(ctx);
    this.permissions = new PermissionsResource(ctx);
    this.phoneNumbers = new PhoneNumbersResource(ctx);
    this.planLimits = new PlanLimitsResource(ctx);
    this.plans = new PlansResource(ctx);
    this.pricing = new PricingResource(ctx);
    this.profiles = new ProfilesResource(ctx);
    this.push = new PushResource(ctx);
    this.quickReplies = new QuickRepliesResource(ctx);
    this.reactions = new ReactionsResource(ctx);
    this.reports = new ReportsResource(ctx);
    this.roles = new RolesResource(ctx);
    this.stickers = new StickersResource(ctx);
    this.tags = new TagsResource(ctx);
    this.templates = new TemplatesResource(ctx);
    this.twoFactor = new TwoFactorResource(ctx);
    this.usage = new UsageResource(ctx);
    this.users = new UsersResource(ctx);
    this.waba = new WabaResource(ctx);
    this.wallet = new WalletResource(ctx);
    this.walletAlerts = new WalletAlertsResource(ctx);
    this.webChat = new WebChatResource(ctx);
    this.webChatPublic = new WebChatPublicResource(ctx);
    this.webhooksOutbound = new WebhooksOutboundResource(ctx);
    this.whatsappLinks = new WhatsappLinksResource(ctx);
    this.tasks = new TasksResource(ctx);
    this.aiCredits = new AiCreditsResource(ctx);
    this.systemNotices = new SystemNoticesResource(ctx);
  }

  setAccessToken(token: string | undefined): void {
    this.http.setAccessToken(token);
  }

  setApiKey(key: string | undefined): void {
    this.http.setApiKey(key);
  }

  /**
   * Replace the JWT pair at runtime (e.g. after a fresh login). Calling this
   * with `null` clears the in-memory tokens.
   */
  setTokens(tokens: AuthTokens | null): void {
    if (!this.tokenManager) {
      throw new MosendValidationError(
        "Cannot setTokens() because the client was created without `tokens` in its options. Pass an initial AuthTokens object on construction.",
      );
    }
    this.tokenManager.setTokens(tokens);
  }

  /**
   * Returns the current in-memory tokens, or null if none are set. The
   * accessToken returned here may be on the verge of expiry — use it for
   * inspection / persistence only, the SDK always reads the freshest value
   * before sending a request.
   */
  getTokens(): { accessToken: string; refreshToken: string; expiresAt: number } | null {
    return this.tokenManager?.getTokensSnapshot() ?? null;
  }

  /**
   * Force an immediate refresh, even if the current accessToken would still
   * pass the proactive expiry check. Useful right after a sensitive operation
   * that revokes the previous tokens server-side.
   */
  async refreshNow(): Promise<void> {
    if (!this.tokenManager) {
      throw new MosendValidationError(
        "Cannot refreshNow() because the client was created without `tokens` in its options.",
      );
    }
    await this.tokenManager.refresh();
  }
}

// MosendApiError is re-exported by src/index.ts; the import above is for the
// implementation detail above (refresh function recursion guard).
void MosendApiError;

