# @mosend/sdk

> SDK oficial en TypeScript para la **API REST de Mosend** — WhatsApp Business, Web Chat, Bot con IA, Billing y Webhooks.

[![npm](https://img.shields.io/npm/v/%40mosend%2Fsdk.svg)](https://www.npmjs.com/package/@mosend/sdk)
[![types](https://img.shields.io/badge/types-TypeScript-blue.svg)](#)
[![runtime](https://img.shields.io/badge/node-%E2%89%A518.17-brightgreen.svg)](#)

- **258 endpoints en 55 módulos** organizados como resource clients (`mosend.messages.send(...)`).
- **Isomorfo**: corre en Node 18+ y navegadores modernos sobre `fetch` nativo.
- **Cero dependencias** en runtime.
- **Tipado estricto** end-to-end (request, response, errores tipados por código HTTP).
- **HMAC SHA-256** para webhooks salientes con `timingSafeEqual`.
- Paginación cursor con `AsyncIterable`, idempotencia, rate-limit, retries opt-in.

Documentación oficial de la API: **<https://developer.mosend.dev>**.

---

## Instalación

```bash
npm install @mosend/sdk
# o
pnpm add @mosend/sdk
# o
yarn add @mosend/sdk
```

Requisitos: **Node ≥ 18.17** (necesitamos `fetch`, `AbortController` y Web Crypto nativos) o cualquier navegador moderno.

---

## Quickstart

```ts
import { MosendClient } from "@mosend/sdk";

const mosend = new MosendClient({
  apiKey: process.env.MOSEND_API_KEY!,   // mk_live_<prefix>.<secret>
  orgId: process.env.MOSEND_ORG_ID!,     // UUID de tu organización
});

// Enviar un mensaje de texto
const msg = await mosend.messages.send({
  phoneNumberId: "<phone_uuid>",
  to: "+573000000000",
  type: "text",
  payload: { body: "Hola desde Mosend" },
});

console.log(msg.id, msg.status);
```

> Obtené tu API key desde el dashboard: **Configuración → Integraciones → API Keys**. El secreto se muestra **una sola vez**; copialo en ese momento.

---

## Autenticación

El SDK acepta dos esquemas y elige el header correcto automáticamente:

```ts
// Server-to-server con API key (recomendado)
new MosendClient({ apiKey: "mk_live_abcd.secret" });  // → X-Api-Key

// Sesión interactiva con JWT
new MosendClient({ accessToken: "<jwt>" });           // → Authorization: Bearer
```

Login interactivo y refresh de tokens:

```ts
const { user, tokens } = await mosend.auth.login({
  email: "info@empresa.com",
  password: "...",
  twoFactorCode: "123456", // si el usuario tiene 2FA
});

mosend.setAccessToken(tokens.accessToken);

// Más tarde…
const fresh = await mosend.auth.refresh({ refreshToken: tokens.refreshToken });
mosend.setAccessToken(fresh.accessToken);
```

---

## Resources disponibles (55)

El SDK cubre **toda** la API documentada en `https://developer.mosend.dev` — 258 endpoints en 55 módulos. Todos los base paths fueron verificados contra la doc oficial.

### Identidad y organización

`mosend.auth` · `mosend.users` · `mosend.organizations` · `mosend.memberships` · `mosend.roles` · `mosend.permissions` · `mosend.invitations` · `mosend.twoFactor` · `mosend.passkeys` · `mosend.apiKeys`

### Mensajería

`mosend.conversations` · `mosend.messages` · `mosend.reactions` · `mosend.stickers` · `mosend.templates` · `mosend.contacts` · `mosend.contactLists` · `mosend.tags` · `mosend.optIns` · `mosend.quickReplies` · `mosend.broadcasts` · `mosend.whatsappLinks`

### WhatsApp Business

`mosend.waba` · `mosend.phoneNumbers` · `mosend.profiles`

### Bot

`mosend.botConfig` · `mosend.autoReplies` · `mosend.botEvents` · `mosend.flows` · `mosend.orgAiProviders` · `mosend.handoffWebhook` · `mosend.knowledge`

### Web Chat

`mosend.webChat` · `mosend.webChatPublic`

### Billing

`mosend.plans` · `mosend.planLimits` · `mosend.billing` · `mosend.addons` · `mosend.invoices` · `mosend.wallet` · `mosend.walletAlerts` · `mosend.mercadoPago` · `mosend.paymentMethods` · `mosend.creditNotes` · `mosend.pricing` · `mosend.usage`

### Webhooks y eventos

`mosend.webhooksOutbound`

### Otros

`mosend.audit` · `mosend.health` · `mosend.reports` · `mosend.notifications` · `mosend.push` · `mosend.leads` · `mosend.integrations` · `mosend.media`

Ver el mapa detallado con todos los base paths y notas en [`CLAUDE.md`](./CLAUDE.md).

---

## Enviar una plantilla

```ts
// Refleja https://developer.mosend.dev/enviar-plantilla
await mosend.messages.send(
  {
    phoneNumberId: "<phone_uuid>",
    to: "573001234567",
    type: "template",
    templateId: "<template_uuid>",
    variables: ["Juan", "FAC-2026-0042"],
  },
  { idempotencyKey: "order-42-greeting" },
);
```

Variables con header media y botón URL dinámico:

```ts
await mosend.messages.send({
  phoneNumberId, to, type: "template", templateId,
  variables: {
    body: ["Juan", "FAC-2026-0042"],
    header: { type: "image", link: "https://clientes.tu-empresa.com/factura.png" },
    buttons: [{ index: 0, value: "456789" }],
  },
});
```

---

## Enviar un broadcast

```ts
// Refleja https://developer.mosend.dev/enviar-broadcast
const list = await mosend.contactLists.create({
  name: "Clientes Q1",
  description: "Compradores ene-mar 2026",
});
await mosend.contactLists.addMembers(list.id, { contactIds: [...] });

const broadcast = await mosend.broadcasts.create({
  name: "Anuncio promo Q1",
  phoneNumberId: "<phone_uuid>",
  templateId: "<template_uuid>",
  templateLanguage: "es_CO",
  listId: list.id,
});

const result = await mosend.broadcasts.send(broadcast.id);
console.log(`${result.sent}/${result.total} enviados, ${result.failed} fallidos`);
```

---

## Webhooks salientes

Mosend dispara `POST` a tu URL con header `X-Mosend-Signature: sha256=<hex>`. Validá la firma con el secreto que recibís al crear el webhook.

```ts
import { parseWebhookEvent, MosendWebhookSignatureError } from "@mosend/sdk";

app.post("/webhooks/mosend", express.raw({ type: "application/json" }), (req, res) => {
  try {
    const event = parseWebhookEvent(
      req.body,                              // Buffer crudo, NO el JSON parseado
      req.header("x-mosend-signature"),
      process.env.MOSEND_WEBHOOK_SECRET!,
    );
    switch (event.event) {
      case "message.new":     /* ... */ break;
      case "message.status":  /* ... */ break;
      case "invoice.paid":    /* ... */ break;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    if (err instanceof MosendWebhookSignatureError) res.status(401).end();
    else throw err;
  }
});
```

**Importante**: la firma se calcula sobre el **body crudo**, no sobre el JSON serializado por tu framework. Usá `express.raw()` o equivalente. Reintentos exponenciales: hasta 8 intentos (~30 min). Deduplicá por `event.deliveryId`.

Eventos disponibles: `message.new`, `message.status`, `conversation.opened`, `conversation.closed`, `conversation.assigned`, `template.status`, `phone.quality`, `invoice.issued`, `invoice.paid`, `invoice.overdue`, `wallet.recharged`.

---

## Paginación

Toda lista grande devuelve `{ data, pageInfo: { endCursor, hasNextPage } }`. Dos APIs disponibles:

```ts
// Página manual
const page1 = await mosend.contacts.list({ limit: 50 });
const page2 = await mosend.contacts.list({ limit: 50, cursor: page1.pageInfo.endCursor! });

// AsyncIterable — itera todas las páginas automáticamente
for await (const contact of mosend.contacts.iterate({ limit: 100 })) {
  console.log(contact.waId);
}
```

---

## Manejo de errores

Todos los errores extienden de `MosendError`. Los HTTP llegan mapeados por status:

```ts
import {
  MosendApiError,
  MosendAuthError,
  MosendBadRequestError,
  MosendForbiddenError,
  MosendNotFoundError,
  MosendRateLimitError,
  MosendUnprocessableError,
  MosendNetworkError,
} from "@mosend/sdk";

try {
  await mosend.messages.send({ /* ... */ });
} catch (err) {
  if (err instanceof MosendRateLimitError) {
    console.warn(`Rate limit, retry in ${err.retryAfterSec}s`);
  } else if (err instanceof MosendBadRequestError) {
    console.error("Validación falló:", err.message);
  } else if (err instanceof MosendApiError) {
    console.error(`[${err.status}] ${err.message}`, err.metaCode);
  } else if (err instanceof MosendNetworkError) {
    console.error("Network:", err.message);
  } else {
    throw err;
  }
}
```

Mapa completo de status → clase:

| Status | Clase |
|---|---|
| 400 | `MosendBadRequestError` |
| 401 | `MosendAuthError` |
| 402 | `MosendPaymentRequiredError` |
| 403 | `MosendForbiddenError` |
| 404 | `MosendNotFoundError` |
| 409 | `MosendConflictError` |
| 422 | `MosendUnprocessableError` |
| 429 | `MosendRateLimitError` (con `retryAfterSec`) |
| 5xx | `MosendServerError` |

Cuando el origen es Meta Graph, el error trae `metaCode` y `metaSubcode` adicionales.

---

## Idempotencia

Operaciones críticas aceptan `idempotencyKey` por opciones. Si reenviás la misma key, el backend no duplica el efecto:

```ts
await mosend.messages.send(
  { /* ... */ },
  { idempotencyKey: `order-${orderId}-greeting` },
);
```

---

## Rate limiting y retries

Las respuestas exponen `X-RateLimit-Limit`, `-Remaining` y `-Reset`. Ante un `429` lanzamos `MosendRateLimitError` con `retryAfterSec`.

Reintentos automáticos son **opt-in**:

```ts
new MosendClient({
  apiKey,
  retries: { max: 3, on: [429, 502, 503], baseDelayMs: 250 },
});
```

---

## Configuración avanzada

```ts
new MosendClient({
  apiKey: process.env.MOSEND_API_KEY!,
  orgId: process.env.MOSEND_ORG_ID,
  baseUrl: "https://api.mosend.dev",     // override para sandbox/staging
  timeout: 30_000,                       // ms
  retries: { max: 3, on: [429, 502, 503] },
  fetch: globalThis.fetch,               // inyectable (edge runtimes, tests)
  userAgent: "my-app/1.0",
  defaultHeaders: { "X-Trace-Id": "..." },
});
```

---

## Ejemplos ejecutables

En [`examples/`](./examples) hay scripts listos para correr con `npx tsx`:

- [`examples/send-template.ts`](./examples/send-template.ts) — envío 1-a-1 de plantilla con variables.
- [`examples/broadcast.ts`](./examples/broadcast.ts) — alta de lista, contactos y broadcast end-to-end.
- [`examples/webhook-server.ts`](./examples/webhook-server.ts) — servidor HTTP nativo con verificación HMAC.

---

## Desarrollo local

```bash
git clone https://github.com/Moshipp-Dev/mosend-sdk-js
cd mosend-sdk-js
npm install
npm test           # vitest
npm run typecheck  # tsc --noEmit
npm run build      # tsup → dist/ (ESM + CJS + d.ts)
```

---

## Roadmap

El paquete está en **`0.x`** mientras la API REST está en **v0.9**. Cada minor puede romper hasta que la API llegue a 1.0.

Próximos hitos:

- Auto-refresh de JWT con un `tokenStore` pluggable.
- Helpers de OAuth/Embedded Signup para Meta.
- Adapter para edge runtimes específicos (Cloudflare Workers, Deno).
- Sintetizar DTOs reales cuando la doc oficial actualice los samples genéricos por shapes definitivos.

---

## Licencia

MIT © Moshipp SAS — <https://mosend.dev>
