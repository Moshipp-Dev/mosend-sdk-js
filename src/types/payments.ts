import type { ISODateString, UUID } from "./common.js";

// Nequi, comprobantes Bre-B/QR y webhooks de pasarelas (Wompi, Mercado Pago).

export type NequiPaymentStatus = "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED";

export interface NequiEnabled {
  enabled: boolean;
}

export interface CreateNequiPushInput {
  /** Factura a pagar; omitir para recarga de saldo (requiere `amount`). */
  invoiceId?: UUID;
  /** Monto de la recarga (moneda de la org). Ignorado si hay `invoiceId`. */
  amount?: number;
  /** Celular Nequi del cliente (10 dígitos). */
  phoneNumber: string;
}

export interface CreateNequiQrInput {
  invoiceId?: UUID;
  amount?: number;
}

export interface NequiPushCreated {
  paymentId: UUID;
  copValue: number;
  trmRate: number | null;
}

export interface NequiQrCreated extends NequiPushCreated {
  qrValue: string;
}

export interface NequiPaymentState {
  paymentId: UUID;
  status: NequiPaymentStatus;
  invoiceId: UUID | null;
  copValue: number | null;
  trmRate: number | null;
}

export interface NequiPaymentCancelled {
  status: NequiPaymentStatus;
}

export type BrebInfo =
  | { enabled: false }
  | {
      enabled: true;
      key: string | null;
      holder: string | null;
      qrUrl: string | null;
      usdCopRate: number | null;
      rateCapturedAt: ISODateString | null;
    };

export interface PaymentReport {
  id: UUID;
  organizationId: UUID;
  invoiceId: UUID | null;
  /** Decimal serializado. */
  amount: string;
  currency: string;
  method: string;
  receiptKey: string;
  receiptMime: string;
  note: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewNote: string | null;
  reviewedByUserId: UUID | null;
  reviewedAt: ISODateString | null;
  createdByUserId: UUID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PaymentReportWithInvoice extends PaymentReport {
  invoice: { id: UUID; number: string } | null;
}

export interface CreatePaymentReportInput {
  /** Comprobante (campo multipart `receipt`). */
  receipt: Blob | File;
  filename?: string;
  /** Monto transferido (moneda de la factura o de la org). */
  amount: number;
  /** Factura a pagar; omitir para recarga de saldo. */
  invoiceId?: UUID;
  /** Referencia del cliente (titular, número de transacción…). */
  note?: string;
}

export interface SignedUrl {
  url: string;
}

/** Evento de Wompi tal como lo manda Wompi (la firma va dentro). */
export interface WompiEvent {
  event: string;
  data: Record<string, unknown>;
  signature?: { checksum?: string; properties?: string[] };
  timestamp?: number;
  environment?: string;
}

/** Cuerpo del IPN de Mercado Pago (MP manda además campos que no se usan). */
export interface MercadoPagoWebhookBody {
  type?: string;
  action?: string;
  data?: { id: string };
  [key: string]: unknown;
}

/** Respuesta de los webhooks de pasarela: 200 aunque el evento se descarte. */
export interface GatewayWebhookAck {
  ok?: boolean;
  reason?: string;
  [key: string]: unknown;
}
