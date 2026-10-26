/**
 * Licencias digitales (`/organizations/{orgId}/license-delivery`): productos,
 * llaves, pedidos, cobros, bandeja de pagos, cuentas y llaves de transferencia.
 * Los cuerpos se espejan 1:1 con los DTOs del backend; las respuestas no están
 * documentadas en el contrato, por eso los métodos devuelven `T = unknown`.
 */

export interface ItemDeBandejaInput {
  id: string;
  origen: "BANCO" | "COMPROBANTE";
}

export interface AddLicenseKeysInput {
  /** Llaves a cargar al pool del producto. Se normalizan (trim) y se ignoran */
  keys: Array<string>;
  /** Variante destino de las llaves; omitir = pool general del producto. */
  variantId?: string;
}

export interface AnularCobroAgrupadoInput {
  motivo?: string;
}

export interface CreateDigitalProductInput {
  name: string;
  description?: string;
  sku?: string;
  /** Categoría libre para agrupar y filtrar en el panel. */
  category?: string;
  /** URLs con @IsUrl http/https: instructionsUrl alimenta un shortlink PÚBLICO */
  imageUrl?: string;
  /** Precio en centavos de la moneda (evita floats). */
  priceCents: number;
  /** Días que dura lo vendido, contados desde la ENTREGA. Omitir o `null` = */
  durationDays?: number | null;
  /** Si entra en el aviso de renovación. Hay cosas que se venden una vez. */
  renewalNoticeEnabled?: boolean;
  /** Moneda ISO-4217 (3 letras mayúsculas). Por defecto COP. */
  currency?: "COP" | "USD" | "MXN";
  instructionsUrl?: string;
  /** Modo de entrega: AUTOMATICA (entrega una llave del inventario), ASISTIDA */
  entregaModo?: "AUTOMATICA" | "ASISTIDA" | "CONSULTAR";
  /** Dato adicional a pedir al cliente para este producto (ej. "correo"). */
  datoAdicionalLabel?: string | null;
  /** Si ese dato es obligatorio antes de cerrar la venta. */
  datoAdicionalRequerido?: boolean;
  active?: boolean;
  /** IVA en las cotizaciones: si está activo se suma al precio. No cambia lo que se cobra al vender. */
  ivaActivo?: boolean;
  ivaPorcentaje?: number;
}

export interface BulkImportProductsInput {
  /** Productos a crear en lote (import Excel/CSV desde la UI). */
  products: Array<CreateDigitalProductInput>;
  /** Si un producto ya existe (por SKU o nombre), actualizarlo con lo que */
  actualizarExistentes?: boolean;
}

export interface BulkPriceListItemsInput {
  productIds: Array<string>;
  /** PORCENTAJE_DEL_BASE: valor = descuento (15 = 15 % menos). FIJO: centavos. */
  modo: "PORCENTAJE_DEL_BASE" | "COPIAR_BASE" | "FIJO" | "QUITAR";
  valor?: number;
  redondeo?: "PESO" | "CIEN" | "MIL";
  incluirVariantes?: boolean;
}

export interface BulkPriceProductsInput {
  /** PORCENTAJE: valor = +10 / -15. MONTO: centavos a sumar o restar. FIJO: precio en centavos. */
  modo: "PORCENTAJE" | "MONTO" | "FIJO";
  valor: number;
  redondeo?: "PESO" | "CIEN" | "MIL";
  /** Aplicar también a las variantes de esos productos. */
  incluirVariantes?: boolean;
  /** Solo calcular el antes/después, sin guardar. */
  soloVistaPrevia?: boolean;
  productIds: Array<string>;
}

export interface BulkProductIdsInput {
  productIds: Array<string>;
}

export interface BulkProductPatchInput {
  active?: boolean;
  entregaModo?: "AUTOMATICA" | "ASISTIDA" | "CONSULTAR";
  /** null = quitar la categoría. */
  category?: string | null;
  renewalNoticeEnabled?: boolean;
  /** null = no vence. */
  durationDays?: number | null;
  datoAdicionalLabel?: string | null;
  datoAdicionalRequerido?: boolean;
}

export interface BulkUpdateProductsInput {
  patch: BulkProductPatchInput;
  productIds: Array<string>;
}

export interface BuzonDeAvisosInput {
  /** Servidor IMAP (solo el dominio). */
  host?: string;
  port?: number;
  /** Usuario: la dirección del correo. */
  user?: string;
  /** Contraseña. Al editar, vacía = se conserva la guardada. */
  password?: string | null;
  tls?: boolean;
  /** Carpeta a la que mover los avisos ya registrados. */
  processedFolder?: string | null;
  /** Borrar los avisos ya registrados. */
  deleteAfterRead?: boolean;
  /** Llaves que avisan a este correo (reemplaza la lista). Una llave avisa a un solo correo. */
  llaveIds?: Array<string>;
}

export interface CambiarMedioDelPedidoInput {
  /** llave | transferencia | tarjeta | nequi | nequi_app | daviplata | binance | cuenta:<id> */
  medio: string;
  /** Número de la app de Nequi (10 dígitos) para `nequi_app`. */
  nequiPhone?: string;
  /** Mandarle al cliente los datos nuevos por el chat. */
  avisarCliente?: boolean;
}

export interface CompletarDatoAdicionalInput {
  valor: string;
}

export interface CompletarEntregaInput {
  /** Llaves que el asesor entrega a mano (una por elemento o por línea). Se */
  llaves?: Array<string>;
  /** Nota adicional para el cliente, después de la entrega. */
  mensaje?: string;
  /** false = registrar la llave sin escribirle al cliente. Default true. */
  notificar?: boolean;
}

export interface ConciliarCobroInput {
  cobroId: string;
}

export interface ConciliarPagoInput {
  orderId: string;
}

export interface ConfirmarPagoManualInput {
  /** Por dónde entró el dinero: `llave:<id>` o `cuenta:<id>`. El pedido pasa a ese medio; sin el dato se queda con el que tenía. */
  medio?: string;
  /** Captura del pago (id de un archivo subido a la organización). Queda como comprobante aprobado. */
  comprobanteMediaId?: string;
}

export interface CrearCobroAgrupadoInput {
  /** Contacto al que se le cobra. */
  contactId: string;
  /** Pedidos a incluir. Vacío = todos los que el cliente debe (fiados y esperando pago). */
  orderIds?: Array<string>;
  /** Chat por el que se envía el cobro. */
  conversationId?: string;
  /** A dónde paga: `llave:<id>` o `cuenta:<id>`. Vacío = la llave de la marca del número. */
  medio?: string;
}

export interface CrearCobroLibreInput {
  /** Contacto al que se le cobra. */
  contactId: string;
  /** Chat por el que se envía el cobro. */
  conversationId?: string;
  /** Qué se cobra («Hosting 12 meses midominio.com»). Con factura de Mosend puede ir vacío. */
  concepto?: string;
  /** Monto en centavos de peso colombiano. Con factura de Mosend, vacío = su saldo. */
  montoCents?: number;
  /** Factura de la plataforma Mosend que abona (solo la organización que opera Mosend). */
  invoiceId?: string;
  /** Marca que cobra, por encima de la del número (en un número que atiende varias marcas). Vacío = la del número. */
  perfilDeCobroId?: string;
}

export interface CreateCheckoutInput {
  /** Variante a vender (requerida si el producto tiene variantes). */
  variantId?: string;
  /** Cantidad de licencias a vender (1 a 50). Por defecto 1. */
  quantity?: number;
  /** Método de cobro. Por defecto NEQUI. */
  method?: "NEQUI" | "DAVIPLATA" | "TRANSFERENCIA" | "BINANCE" | "TARJETA";
  /** Teléfono Nequi del cliente (10 dígitos CO) — requerido para NEQUI. */
  nequiPhone?: string;
  /** A qué cuenta de banco transfiere. Vacío = la llave, si la hay. */
  transferAccountId?: string;
  /** Cédula del cliente — requerida para DAVIPLATA. */
  userLegalId?: string;
  userLegalIdType?: "CC" | "CE" | "NIT" | "PP" | "TI";
  customerEmail?: string;
  /** Código de cupón de descuento (opcional). */
  couponCode?: string;
  contactId?: string;
  /** Número emisor de WhatsApp para entregar la licencia. */
  phoneNumberId?: string;
  /** WhatsApp destino (waId, sin '+'). Por defecto 57 + Nequi. */
  recipientWaId?: string;
  /** Moneda con la que se le cobra a este cliente. */
  currency?: "COP" | "USD" | "MXN";
}

export interface CreateLicenseCouponInput {
  code: string;
  discountType?: "PERCENT" | "FIXED";
  /** PERCENT: 1-100 ; FIXED: centavos a descontar. */
  discountValue: number;
  /** Acota a un producto; omitir = cualquiera. */
  productId?: string;
  active?: boolean;
  maxRedemptions?: number;
  /** ISO date; omitir = sin vencimiento. */
  expiresAt?: string;
}

export interface CreatePriceListInput {
  name: string;
  /** Etiquetas que activan la lista (por nombre, sin distinguir mayúsculas). */
  tagNames?: Array<string>;
  /** Descuento general sobre el precio de lista (0-100). */
  discountPercent?: number;
  /** Si varias listas coinciden, gana la de menor prioridad. */
  priority?: number;
  active?: boolean;
}

export interface CreateRenewalTemplateInput {
  /** WABA donde crearla. Obligatorio solo si la organización tiene varias. */
  wabaId?: string;
  /** Nombre de la plantilla en Meta (minúsculas y guiones bajos). */
  name?: string;
  language?: string;
  /** Texto del cuerpo, si se editó el sugerido. Debe conservar {{1}} {{2}} {{3}}. */
  bodyText?: string;
}

export interface CreateVariantInput {
  name: string;
  priceCents: number;
  /** Días que dura lo vendido, contados desde la ENTREGA. Omitir o `null` = */
  durationDays?: number | null;
  sortOrder?: number;
}

export interface CuentaDeTransferenciaInput {
  /** Cómo la ve el cliente en la lista. */
  label: string;
  /** Banco o entidad. */
  bankName?: string | null;
  /** Tipo de cuenta. */
  accountKind?: "AHORROS" | "CORRIENTE" | "NEQUI" | "LLAVE" | "OTRO";
  /** Número de cuenta, llave Bre-B o celular de Nequi. */
  accountNumber: string;
  /** Titular de la cuenta. */
  holder?: string | null;
  /** Documento del titular. */
  holderDoc?: string | null;
  /** Texto que acompaña a esta cuenta. */
  instructions?: string | null;
  /** MediaAsset del QR de esta cuenta. */
  qrMediaId?: string | null;
  /** Dominio que firma los correos de aviso de este banco, para conciliar (ej. notificacionesbancolombia.com). */
  senderDomain?: string | null;
  /** En qué moneda recibe esta cuenta (ISO 4217). Vacío = cualquiera. Solo se le ofrece a quien paga en esa moneda. */
  currency?: string | null;
  /** Si se le ofrece al cliente. */
  enabled?: boolean;
  /** Marcas (perfiles de cobro) que ofrecen esta cuenta. Vacío = todas: cuenta compartida. Sin enviar al crear = la marca principal. */
  perfilIds?: Array<string>;
  /** Llave cuyos avisos de pago confirman también los pagos a esta cuenta (la cuenta de banco que está detrás de la llave). null = se confirma con comprobante. */
  llaveAvisoId?: string | null;
}

export interface DescartarEnMasaInput {
  /** Qué descartar. Hasta 100 por llamada. */
  items: Array<ItemDeBandejaInput>;
  /** Por qué. En los comprobantes lo lee el cliente. */
  reason: string;
}

export interface DispatchInput {
  productId: string;
  /** Variante a entregar (si el producto tiene variantes). */
  variantId?: string;
  /** Cantidad de licencias a entregar (1 a 50). Por defecto 1. */
  quantity?: number;
}

export interface EditarCuentaDeTransferenciaInput {
  /** Cómo la ve el cliente en la lista. */
  label?: string;
  /** Banco o entidad. */
  bankName?: string | null;
  /** Tipo de cuenta. */
  accountKind?: "AHORROS" | "CORRIENTE" | "NEQUI" | "LLAVE" | "OTRO";
  /** Número de cuenta, llave Bre-B o celular de Nequi. */
  accountNumber?: string;
  /** Titular de la cuenta. */
  holder?: string | null;
  /** Documento del titular. */
  holderDoc?: string | null;
  /** Texto que acompaña a esta cuenta. */
  instructions?: string | null;
  /** MediaAsset del QR de esta cuenta. */
  qrMediaId?: string | null;
  /** Dominio que firma los correos de aviso de este banco, para conciliar (ej. notificacionesbancolombia.com). */
  senderDomain?: string | null;
  /** En qué moneda recibe esta cuenta (ISO 4217). Vacío = cualquiera. Solo se le ofrece a quien paga en esa moneda. */
  currency?: string | null;
  /** Si se le ofrece al cliente. */
  enabled?: boolean;
  /** Marcas (perfiles de cobro) que ofrecen esta cuenta. Vacío = todas: cuenta compartida. Sin enviar al crear = la marca principal. */
  perfilIds?: Array<string>;
  /** Llave cuyos avisos de pago confirman también los pagos a esta cuenta (la cuenta de banco que está detrás de la llave). null = se confirma con comprobante. */
  llaveAvisoId?: string | null;
}

export interface EditarLlaveDeCobroInput {
  /** Cómo se ve en el panel. */
  label?: string;
  /** Entidad de la llave: decide cómo se lee su aviso de pago. */
  entity?: "NEQUI" | "BANCOLOMBIA";
  /** La llave que se le da al cliente (@usuario, celular, correo). */
  key?: string;
  /** Titular que ve el cliente. */
  holder?: string | null;
  /** Texto que acompaña a la llave. */
  instructions?: string | null;
  /** Dominio que firma los avisos de pago de esta llave. Vacío = el de la entidad. */
  senderDomain?: string | null;
  /** Buzón de confianza que reenvía los avisos, si el intermediario rompe la firma del banco. */
  forwarderAddress?: string | null;
  /** Con la bandeja en «aprobar solo», si los pagos de esta llave se aprueban solos. Una llave nueva empieza en false (solo sugerir). */
  autoApprove?: boolean;
  /** Correo (buzón de avisos) al que llegan los avisos de pago de esta llave. null = ninguno: sus pagos no se confirman solos. */
  buzonId?: string | null;
}

export interface IgnorarPagoInput {
  nota?: string;
}

export interface LlaveDeCobroInput {
  /** Cómo se ve en el panel. */
  label: string;
  /** Entidad de la llave: decide cómo se lee su aviso de pago. */
  entity?: "NEQUI" | "BANCOLOMBIA";
  /** La llave que se le da al cliente (@usuario, celular, correo). */
  key: string;
  /** Titular que ve el cliente. */
  holder?: string | null;
  /** Texto que acompaña a la llave. */
  instructions?: string | null;
  /** Dominio que firma los avisos de pago de esta llave. Vacío = el de la entidad. */
  senderDomain?: string | null;
  /** Buzón de confianza que reenvía los avisos, si el intermediario rompe la firma del banco. */
  forwarderAddress?: string | null;
  /** Con la bandeja en «aprobar solo», si los pagos de esta llave se aprueban solos. Una llave nueva empieza en false (solo sugerir). */
  autoApprove?: boolean;
  /** Correo (buzón de avisos) al que llegan los avisos de pago de esta llave. null = ninguno: sus pagos no se confirman solos. */
  buzonId?: string | null;
}

export interface MarcarCobroPagadoInput {
  /** Pedidos que pagó. Vacío = todos. Si son algunos, se saldan esos, el cobro se anula y los demás quedan por cobrar. */
  orderIds?: Array<string>;
  /** Por dónde entró el dinero: `llave:<id>` o `cuenta:<id>`. Vacío = la llave del cobro. */
  medio?: string;
  /** Confirmarle al cliente «Recibimos tu pago». Por defecto sí. */
  avisar?: boolean;
}

export interface PerfilDeCobroInput {
  /** Nombre de la marca («Moshipp»). */
  nombre?: string;
  /** Llave con la que cobra la marca. null = no cobra por llave. La marca principal cobra con la llave activa de la organización. */
  llaveId?: string | null;
  /** Qué pasa cuando se paga un cobro libre: TAREA (tarea para el equipo) o FACTURA_MOSEND (abona a la factura de la plataforma; solo la organización que opera Mosend). */
  alPagar?: "TAREA" | "FACTURA_MOSEND";
  /** Si la marca ofrece la pasarela (Wompi). */
  aceptaWompi?: boolean;
  /** Si la marca ofrece Binance. */
  aceptaBinance?: boolean;
  /** Números que atiende la marca (reemplaza la lista). Los que se quitan vuelven a la principal. */
  phoneNumberIds?: Array<string>;
  /** Orden en que el asistente ofrece los medios cuando el cliente no pide uno: `llave`, `cuenta:<id>`, `wompi`, `tarjeta`, `binance`. Lo que falte va al final. */
  ordenDeMedios?: Array<string>;
  wompiEnv?: "test" | "prod";
  /** Wompi propio: llave pública. */
  wompiPublicKey?: string | null;
  /** Wompi propio: llave privada. */
  wompiPrivateKey?: string | null;
  /** Wompi propio: secreto de eventos. */
  wompiEventsSecret?: string | null;
  /** Wompi propio: secreto de integridad. */
  wompiIntegritySecret?: string | null;
}

export interface CartItemInput {
  productId: string;
  /** Requerida si el producto tiene variantes. */
  variantId?: string | null;
  quantity?: number;
  /** Precio unitario (centavos) fijado a mano; reemplaza el de lista. */
  unitPriceCents?: number;
  /** Dato adicional que pide el producto (ej. el correo de la cuenta). */
  datoAdicional?: string;
}

export interface PreviewCarritoInput {
  items: Array<CartItemInput>;
  currency?: "COP" | "USD" | "MXN";
}

export interface ReasignarPagoInput {
  /** Pedido que se queda con el pago. */
  orderId: string;
  /** Por qué se movió; queda en el pago y en la auditoría. */
  nota?: string;
}

export interface RechazarComprobanteInput {
  /** Por qué se rechaza. El cliente lo va a leer. */
  reason: string;
}

export interface RefundOrderInput {
  /** Motivo del reembolso (trazabilidad). */
  reason?: string;
}

export interface RegistrarPagoConjuntoInput {
  /** Pedidos que pagó (al menos dos). */
  orderIds: Array<string>;
  /** Por dónde pagó: `llave:<id>` o `cuenta:<id>`. Vacío = la llave de la marca. */
  medio?: string;
  /** Confirmarle al cliente «Recibimos tu pago». Por defecto no. */
  avisar?: boolean;
  contactId: string;
  conversationId?: string;
}

export interface RegistrarVentaManualInput {
  productId: string;
  variantId?: string;
  quantity?: number;
  /** ¿Entregar ya la licencia? */
  entregar: boolean;
  /** ¿El cliente ya pagó? (false = fiado / por cobrar). */
  pagado: boolean;
  /** Precio unitario a facturar en centavos (override del asesor: descuento u */
  unitPriceCents?: number;
  /** Dato adicional que pide el producto (ej. el correo de la cuenta). */
  datoAdicional?: string;
  /** «Lo pido después»: deja pendiente el dato obligatorio que falte. */
  datoAdicionalDespues?: boolean;
  /** ¿Enviar al cliente el mensaje "gracias por tu compra"? Por defecto sí. */
  notify?: boolean;
  /** Moneda con la que se le cobra a este cliente. */
  currency?: "COP" | "USD" | "MXN";
  /** Ya pagó: por dónde entró el dinero. `llave` (la de la marca del número), */
  medio?: string;
}

export interface ReordenarCuentasInput {
  /** Todas las cuentas de la organización, en el orden deseado. */
  ids: Array<string>;
}

export interface ReplaceLicenseKeyInput {
  /** 'inventory' (por defecto): saca la nueva del pool disponible. 'manual': */
  source?: "inventory" | "manual";
  /** Llave nueva a mano (obligatoria si source='manual'). */
  replacementValue?: string;
  /** Motivo del reemplazo (trazabilidad; ej. "no activó"). */
  reason?: string;
  /** Enviar al cliente el aviso de cambio de llave. Por defecto true. */
  notify?: boolean;
}

export interface RevisarComprobanteInput {
  /** Nota interna de quien revisa. */
  note?: string | null;
}

export interface SellCartToConversationInput {
  items: Array<CartItemInput>;
  /** «Lo pido después»: deja pendiente el dato obligatorio que falte. */
  datoAdicionalDespues?: boolean;
  method?: "NEQUI" | "TRANSFERENCIA";
  nequiPhone?: string;
  /** A qué cuenta de banco transfiere. Vacío = la llave, si la hay. */
  transferAccountId?: string;
  customerEmail?: string;
  /** Solo Bre-B: entrega ya (fiado) y concilia el cobro después. */
  entregarYa?: boolean;
  /** Fiado: ¿enviarle ya cómo pagar? Por defecto sí. */
  enviarCobro?: boolean;
  /** ¿Enviar el mensaje "gracias por tu compra"? Por defecto sí. */
  notify?: boolean;
  /** Moneda con la que se le cobra a este cliente. */
  currency?: "COP" | "USD" | "MXN";
}

export interface SellToConversationInput {
  productId: string;
  /** Variante a vender (requerida si el producto tiene variantes). */
  variantId?: string;
  /** Cantidad de licencias a vender (1 a 50). Por defecto 1. */
  quantity?: number;
  method?: "NEQUI" | "DAVIPLATA" | "TRANSFERENCIA" | "BINANCE" | "TARJETA";
  nequiPhone?: string;
  /** A qué cuenta de banco transfiere. Vacío = la llave, si la hay. */
  transferAccountId?: string;
  userLegalId?: string;
  userLegalIdType?: "CC" | "CE" | "NIT" | "PP" | "TI";
  customerEmail?: string;
  couponCode?: string;
  /** Dato adicional que pide el producto (ej. el correo de la cuenta). */
  datoAdicional?: string;
  /** «Lo pido después»: deja pendiente el dato obligatorio que falte. */
  datoAdicionalDespues?: boolean;
  /** Solo Bre-B (TRANSFERENCIA): entrega la licencia YA (fiado) y deja el cobro */
  entregarYa?: boolean;
  /** Fiado: ¿enviarle ya cómo pagar (llave o cuenta y monto)? Por defecto sí. */
  enviarCobro?: boolean;
  /** ¿Enviar al cliente el mensaje "gracias por tu compra"? Por defecto sí. */
  notify?: boolean;
  /** Precio unitario (centavos) fijado a mano por el asesor: reemplaza el de */
  unitPriceCents?: number;
  /** Moneda con la que se le cobra a este cliente. Omitir = la que toque por */
  currency?: "COP" | "USD" | "MXN";
}

export interface SetOrderExpirationInput {
  expiresAt?: string | null;
}

export interface SetPaidAddonInput {
  enabled: boolean;
}

export interface SetPriceListItemInput {
  productId: string;
  variantId?: string | null;
  priceCents?: number | null;
}

export interface PrecioEnMonedaInput {
  currency: "COP" | "USD" | "MXN";
  priceCents: number;
  /** null / omitido = el precio del producto; con valor, el de esa variante. */
  variantId?: string | null;
}

export interface SetProductPricesInput {
  precios: Array<PrecioEnMonedaInput>;
}

export interface SubmitOtpInput {
  /** Código OTP que le llegó al cliente por SMS (Daviplata). */
  code: string;
}

export interface UpdateDigitalProductInput {
  name?: string;
  description?: string | null;
  sku?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  priceCents?: number;
  /** Días que dura lo vendido, contados desde la ENTREGA. Omitir o `null` = */
  durationDays?: number | null;
  /** Si entra en el aviso de renovación. */
  renewalNoticeEnabled?: boolean;
  currency?: "COP" | "USD" | "MXN";
  instructionsUrl?: string | null;
  entregaModo?: "AUTOMATICA" | "ASISTIDA" | "CONSULTAR";
  datoAdicionalLabel?: string | null;
  datoAdicionalRequerido?: boolean;
  active?: boolean;
  /** IVA en las cotizaciones: si está activo se suma al precio. No cambia lo que se cobra al vender. */
  ivaActivo?: boolean;
  ivaPorcentaje?: number;
}

export interface UpdateLicenseCouponInput {
  code?: string;
  discountType?: "PERCENT" | "FIXED";
  discountValue?: number;
  productId?: string | null;
  active?: boolean;
  maxRedemptions?: number | null;
  expiresAt?: string | null;
}

export interface UpdateLicenseDeliverySettingsInput {
  enabled?: boolean;
  wompiEnv?: "test" | "prod";
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
  /** Cobro por pasarela (Nequi push y Daviplata). Apagarlo no borra las */
  wompiEnabled?: boolean;
  /** Ofrece el pago con tarjeta por el enlace de Wompi (Web Checkout). Requiere */
  wompiTarjetaEnabled?: boolean;
  /** Llave Bre-B (@usuario, correo, celular) o número Nequi que recibe. */
  transferKey?: string | null;
  /** Titular de la cuenta; se le muestra al cliente antes de que transfiera. */
  transferHolder?: string | null;
  /** Texto libre que acompaña a la llave en el mensaje al cliente. */
  transferInstructions?: string | null;
  /** Código de control para identificar la orden cuando hay colisión: se */
  transferAmountCode?: boolean;
  /** Reenvíos de licencia que el bot puede hacer al mismo cliente por día. 0 = solo una persona. */
  resendLimitPerDay?: number;
  /** MANUAL = los revisa una persona. AUTO = se aprueba si el monto declarado */
  receiptMode?: "MANUAL" | "AUTO" | "IA";
  /** Con qué IA se leen los comprobantes en modo IA. MOSEND = Gemini Flash con */
  receiptAiSource?: "MOSEND" | "PROPIA";
  /** Solo PROPIA: proveedor configurado por el cliente (gemini, openai…). */
  receiptAiProvider?: string | null;
  /** Solo PROPIA: modelo. Vacío = el predeterminado de ese proveedor. */
  receiptAiModel?: string | null;
  /** Modo IA: desde este monto (centavos) el comprobante lo revisa una persona */
  receiptAiMaxCents?: number | null;
  /** Horas que la orden espera la transferencia antes de expirar (1 a 168). */
  transferExpiryHours?: number;
  /** Plantilla aprobada para enviar un cobro agrupado con la ventana de 24 h */
  cobroTemplateName?: string | null;
  cobroTemplateLang?: string | null;
  /** Vender también lo que no tiene existencias (lo cierra un asesor). */
  transferSellWithoutStock?: boolean;
  /** Moneda con la que la organización le vende a SUS clientes. */
  sellingCurrency?: "COP" | "USD" | "MXN";
  /** Margen sobre la tasa oficial al convertir a otra moneda, en porcentaje. */
  fxMarginPercent?: number;
  /** Bandeja donde caen las notificaciones del banco. */
  inboxHost?: string | null;
  inboxPort?: number;
  inboxUser?: string | null;
  /** Se recibe en claro y se guarda cifrada. Enviar '' para borrar. */
  inboxPassword?: string | null;
  inboxTls?: boolean;
  /** Dominio que debe haber FIRMADO el correo para darlo por bueno. */
  inboxSenderDomain?: string;
  /** Buzón desde el que se reenvía (p. ej. `alguien@outlook.com`). Vacío = solo */
  inboxForwarderAddress?: string | null;
  /** Carpeta a la que mover los correos ya registrados (p. ej. `Procesados`). */
  inboxProcessedFolder?: string | null;
  /** true = eliminar los correos ya registrados tras leerlos (no llenar la */
  inboxDeleteAfterRead?: boolean;
  /** OFF = no se lee · SUGGEST = propone · AUTO = aprueba y entrega. */
  inboxMode?: "OFF" | "SUGGEST" | "AUTO";
  /** Horas hacia atrás en las que se busca un pago para una orden (1 a 168). */
  matchWindowHours?: number;
  binanceEnabled?: boolean;
  /** Alias o correo de Binance Pay que se le muestra al cliente. No es secreto. */
  binancePayId?: string | null;
  /** Clave y secreto de API. Se envían solo al cambiarlos; vacío = conservar el */
  binanceApiKey?: string | null;
  binanceApiSecret?: string | null;
  /** Moneda del cobro (la estable en dólares, por defecto). */
  binanceAsset?: string;
  /** Horas que el pedido espera el pago antes de liberar las llaves (1 a 168). */
  binanceExpiryHours?: number;
  /** Nombre de los medios sin cuenta propia en reportes y webhooks. Vacío o */
  nombreBinance?: string | null;
  nombreNequiPasarela?: string | null;
  nombreDaviplataPasarela?: string | null;
  nombreTarjetaPasarela?: string | null;
  /** OFF = no se lee · SUGGEST = propone · AUTO = confirma y entrega. */
  binanceMode?: "OFF" | "SUGGEST" | "AUTO";
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
  renewalOnYes?: "HANDOFF" | "BOT" | "TAG";
}

export interface UpdatePriceListInput {
  name?: string;
  tagNames?: Array<string>;
  discountPercent?: number;
  priority?: number;
  active?: boolean;
}

export interface UpdateVariantInput {
  name?: string;
  priceCents?: number;
  /** Días que dura lo vendido, contados desde la ENTREGA. Omitir o `null` = */
  durationDays?: number | null;
  active?: boolean;
  sortOrder?: number;
}

export interface ManualCartItemInput {
  productId: string;
  variantId?: string | null;
  quantity?: number;
  unitPriceCents?: number;
  /** Dato adicional que pide el producto (ej. el correo de la cuenta). */
  datoAdicional?: string;
}

export interface VentaManualCarritoInput {
  items: Array<ManualCartItemInput>;
  /** «Lo pido después»: deja pendiente el dato obligatorio que falte. */
  datoAdicionalDespues?: boolean;
  /** ¿Entregar ya las licencias? */
  entregar: boolean;
  /** ¿El cliente ya pagó? (false = fiado / por cobrar). */
  pagado: boolean;
  /** ¿Enviar el mensaje "gracias por tu compra"? Por defecto sí. */
  notify?: boolean;
  /** Moneda con la que se le cobra a este cliente. */
  currency?: "COP" | "USD" | "MXN";
  /** Ya pagó: por dónde entró el dinero. `llave` (la de la marca del número), */
  medio?: string;
}

// ─── Query params ───────────────────────────────────────────────────────────

/** Número de WhatsApp a revisar; omitir = la organización. */
export interface SellingReadinessQuery {
  phoneNumberId?: string;
}

/** Rango: `days` hacia atrás, o `desde`/`hasta` (YYYY-MM-DD). */
export interface LicenseAnalyticsQuery {
  days?: number | string;
  desde?: string;
  hasta?: string;
}

/** Con conversación/contacto, los precios salen resueltos para ese cliente (listas de precios). */
export interface ListDigitalProductsQuery {
  conversationId?: string;
  contactId?: string;
}

export interface ListLicenseKeysQuery {
  status?: "AVAILABLE" | "RESERVED" | "DELIVERED" | "REVOKED";
}

export interface ListExpirationsQuery {
  days?: number | string;
  includeExpired?: boolean | string;
}

export interface ListLicenseOrdersQuery {
  status?:
    | "PENDING_PAYMENT"
    | "PAID"
    | "DELIVERED"
    | "FAILED"
    | "EXPIRED"
    | "CANCELLED"
    | "REFUNDED";
  /** Máximo de filas (1 a 500). */
  limit?: number;
  contactId?: string;
  conversationId?: string;
}

export interface PaymentsInboxQuery {
  origen?: "BANCO" | "COMPROBANTE";
  estado?: string;
  desde?: string;
  hasta?: string;
  /** Búsqueda libre. */
  q?: string;
  limit?: number | string;
  offset?: number | string;
}

export interface ContactIdQuery {
  contactId: string;
}

export interface ListGroupedChargesQuery {
  contactId?: string;
  status?: "PENDIENTE" | "PAGADO" | "ANULADO" | "VENCIDO";
}

/** Rango: `dias` hacia atrás, o `desde`/`hasta` (YYYY-MM-DD). */
export interface RangeQuery {
  dias?: number;
  desde?: string;
  hasta?: string;
}

export interface ListPendingReceiptsQuery {
  limit?: number | string;
}

/** Archivo a subir (campo multipart `file`). */
export interface UploadLicenseDeliveryFileInput {
  file: Blob | File;
  filename?: string;
  orgId?: string;
}
