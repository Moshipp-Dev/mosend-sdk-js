import type { ISODateString, UUID } from "./common.js";

export interface Plan {
  slug: string;
  name: string;
  priceMonthly?: number;
  currency?: string;
  features?: string[];
  conversationsIncluded?: number;
  seatsIncluded?: number;
  wabasIncluded?: number;
  [key: string]: unknown;
}

export interface PlanQuote {
  slug: string;
  basePrice: number;
  discount?: number;
  total: number;
  currency: string;
  couponApplied?: string;
}

export interface PreviewPlanChangeInput {
  targetSlug: string;
  coupon?: string;
}

export interface PreviewPlanChangeResponse {
  prorated: number;
  newPrice: number;
  walletDelta: number;
  effectiveDate: ISODateString;
  [key: string]: unknown;
}

export interface ChangePlanInput {
  targetSlug: string;
  coupon?: string;
}

export interface PlanLimits {
  plan: { slug: string; name: string };
  conversations: { used: number; included: number };
  seats: { used: number; included: number };
  wabas: { used: number; included: number };
  [key: string]: unknown;
}

export interface BillingPeriod {
  id: UUID;
  startedAt: ISODateString;
  endedAt: ISODateString;
  totalAmount: number;
  invoiceId?: UUID;
  [key: string]: unknown;
}

export interface BillingUsage {
  period: { startedAt: ISODateString; endedAt: ISODateString };
  conversations: number;
  templatesSent: number;
  estimatedAmount: number;
  [key: string]: unknown;
}

export interface EstimatedNextCharge {
  amount: number;
  currency: string;
  breakdown?: Array<{ label: string; amount: number }>;
}

export interface CouponInput {
  code: string;
}

export interface CouponValidation {
  valid: boolean;
  code: string;
  discount?: number;
  message?: string;
}

export interface Addon {
  slug: string;
  name: string;
  unitPrice: number;
  currentQuantity: number;
  unit?: string;
}

export interface AddonChangeInput {
  slug: string;
  quantity: number;
}

export interface AddonPreview {
  delta: number;
  newMonthly: number;
  walletDelta: number;
}

export interface Invoice {
  id: UUID;
  number: string;
  status: "ISSUED" | "PAID" | "OVERDUE" | "VOID";
  amount: number;
  currency: string;
  issuedAt: ISODateString;
  paidAt?: ISODateString;
  dueAt?: ISODateString;
  pdfUrl?: string;
}

export interface InvoicePdfResponse {
  url: string;
  expiresAt?: ISODateString;
}

export interface Wallet {
  balance: number;
  currency: string;
  lowBalanceAlert?: number;
}

export interface WalletTransaction {
  id: UUID;
  type: "RECHARGE" | "DEBIT" | "REFUND" | "BONUS";
  amount: number;
  currency: string;
  description?: string;
  createdAt: ISODateString;
}

export interface WalletAlertSettings {
  lowBalanceThreshold?: number;
  emailEnabled?: boolean;
  [key: string]: unknown;
}

export interface RechargeWalletInput {
  amount: number;
  currency?: string;
  paymentMethodId?: UUID;
}

export interface RechargeWalletResponse {
  initPoint?: string;
  preferenceId?: string;
  status?: string;
  [key: string]: unknown;
}

export interface PaymentMethod {
  id: UUID;
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
  createdAt: ISODateString;
}

export interface AddPaymentMethodInput {
  token: string;
  setDefault?: boolean;
}

export interface BillingPreferences {
  autoPayEnabled: boolean;
  defaultPaymentMethodId?: UUID;
  [key: string]: unknown;
}

export interface SetAutoPayInput {
  enabled: boolean;
}

export interface CreditNote {
  id: UUID;
  number: string;
  invoiceId: UUID;
  organizationId: UUID;
  amount: number;
  reason?: string;
  status: "ISSUED" | "VOID";
  createdAt: ISODateString;
  pdfUrl?: string;
}

export interface CreateCreditNoteInput {
  invoiceId: UUID;
  amount: number;
  reason?: string;
}

export interface Pricing {
  currency: string;
  conversation: Record<string, number>;
  [key: string]: unknown;
}

export interface DailyUsage {
  metric: string;
  series: Array<{ day: ISODateString; value: number }>;
}
