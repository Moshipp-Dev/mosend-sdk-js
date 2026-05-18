# CLAUDE.md — @moshipp/mosend-sdk

> Guía de proyecto para Claude Code. Este archivo es la fuente de verdad sobre **qué estamos construyendo**, **cómo lo construimos** y **qué convenciones seguimos**. Cualquier decisión nueva se refleja aquí.

---

## 1. Qué es este repo

Estamos construyendo **`@moshipp/mosend-sdk`**: el SDK oficial en TypeScript para la **API REST de Mosend** (`https://api.mosend.dev`, v0.9), distribuible vía npm.

Mosend es la plataforma de **Moshipp SAS** que orquesta WhatsApp Business Cloud, Web Chat, bot con IA, billing y webhooks. La API expone **258 endpoints en 55 módulos** documentados en https://developer.mosend.dev.

El paquete debe:

- Ser **isomorfo** (Node 18+ y navegadores modernos).
- Ofrecer **tipado completo** para request/response/errores.
- Reflejar la organización modular de la API (un sub-cliente por módulo).
- Manejar autenticación, paginación cursor, reintentos, idempotencia, rate-limit y firma de webhooks.
- No envolver de más: los nombres de campos y rutas deben mapear 1:1 con la API.

---

## 2. Decisiones técnicas (locked)

| Decisión | Elección | Motivo |
|---|---|---|
| Nombre npm | `@moshipp/mosend-sdk` | Scope oficial de Moshipp SAS |
| Lenguaje | TypeScript estricto, dual build CJS + ESM | Tipado fuerte + compatibilidad amplia |
| Cliente HTTP | `fetch` nativo (Node 18+ y browser) | Cero deps, isomorfo |
| Estructura | Resource clients (`client.messages.send(...)`) | Estilo Stripe/OpenAI, descubrible |
| Test runner | `vitest` | Rápido, ESM-first, fixtures simples |
| Build | `tsup` | Dual build sin config compleja |
| Lint/format | `eslint` + `prettier` | Estándar de mercado |
| Versionado | SemVer; preview `0.x` mientras API v0.9 | API aún no es 1.0 |
| Node mínimo | **>=18.17** | `fetch`, `AbortController`, Web Crypto disponibles |

**No usamos**: axios, node-fetch, ramda, lodash. Mantenemos `dependencies: {}` vacío si es viable.

---

## 3. Estructura de carpetas (objetivo)

```
.
├── CLAUDE.md                ← este archivo
├── README.md                ← introducción usuario final (escribir después del primer release)
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── src/
│   ├── index.ts             ← export público: MosendClient, tipos, errores, helpers
│   ├── client.ts            ← clase MosendClient (orquesta resources)
│   ├── core/
│   │   ├── http.ts          ← wrapper fetch con auth, retries, idempotencia, rate-limit
│   │   ├── errors.ts        ← jerarquía MosendError → MosendApiError / MosendNetworkError / ...
│   │   ├── pagination.ts    ← AsyncIterable<T> sobre cursor opaco
│   │   ├── webhooks.ts      ← verifyWebhookSignature(body, signature, secret)
│   │   ├── types.ts         ← ApiEnvelope<T>, ApiTimestamp, common DTO primitives
│   │   └── auth.ts          ← detección JWT vs API key (mk_live_/mk_test_)
│   ├── resources/           ← un archivo por módulo (55 archivos)
│   │   ├── auth.ts          ← /auth/* (signup, login, refresh, logout, passwords, impersonate)
│   │   ├── users.ts
│   │   ├── organizations.ts
│   │   ├── memberships.ts
│   │   ├── roles.ts
│   │   ├── permissions.ts
│   │   ├── invitations.ts
│   │   ├── twoFactor.ts
│   │   ├── passkeys.ts
│   │   ├── apiKeys.ts
│   │   ├── conversations.ts
│   │   ├── messages.ts
│   │   ├── reactions.ts
│   │   ├── stickers.ts
│   │   ├── templates.ts
│   │   ├── contacts.ts
│   │   ├── contactLists.ts
│   │   ├── tags.ts
│   │   ├── optIns.ts
│   │   ├── quickReplies.ts
│   │   ├── broadcasts.ts
│   │   ├── whatsappLinks.ts
│   │   ├── waba.ts
│   │   ├── phoneNumbers.ts
│   │   ├── profiles.ts
│   │   ├── botConfig.ts
│   │   ├── autoReplies.ts
│   │   ├── botEvents.ts
│   │   ├── flows.ts
│   │   ├── orgAiProviders.ts
│   │   ├── handoffWebhook.ts
│   │   ├── webChat.ts
│   │   ├── webChatPublic.ts
│   │   ├── knowledge.ts
│   │   ├── plans.ts
│   │   ├── planLimits.ts
│   │   ├── billing.ts
│   │   ├── addons.ts
│   │   ├── invoices.ts
│   │   ├── wallet.ts
│   │   ├── walletAlerts.ts
│   │   ├── mercadoPago.ts
│   │   ├── paymentMethods.ts
│   │   ├── creditNotes.ts
│   │   ├── pricing.ts
│   │   ├── usage.ts
│   │   ├── webhooksOutbound.ts
│   │   ├── audit.ts
│   │   ├── health.ts
│   │   ├── reports.ts
│   │   ├── notifications.ts
│   │   ├── push.ts
│   │   ├── leads.ts
│   │   ├── integrations.ts
│   │   └── media.ts
│   └── types/               ← types compartidos por módulo (Message, Contact, Template, ...)
│       ├── common.ts
│       ├── messaging.ts
│       ├── identity.ts
│       ├── waba.ts
│       ├── bot.ts
│       ├── webChat.ts
│       ├── billing.ts
│       └── webhooks.ts
├── test/
│   ├── client.test.ts
│   ├── webhooks.test.ts
│   └── resources/*.test.ts  ← un archivo por resource
└── examples/
    ├── send-template.ts     ← refleja /enviar-plantilla
    ├── broadcast.ts         ← refleja /enviar-broadcast
    └── webhook-server.ts    ← validación HMAC + dispatcher de eventos
```

---

## 4. Modelo de la API que cubrimos

### 4.1 Base y envelope

- **Base URL**: `https://api.mosend.dev`. No hay versionado en el path — cambios disruptivos se anuncian en `/changelog`.
- **Envelope de éxito**: `{ data: <T>, timestamp: "ISO-8601" }`. El SDK desempaqueta `data` y expone `timestamp` solo en `RawResponse` opcional.
- **Errors**: `{ statusCode, error, message, timestamp, path }`. Cuando el origen es Meta Graph: `error: "MetaGraphError"` con `code` y `subcode` extra.

### 4.2 Multi-tenancy

Casi toda ruta vive bajo `/organizations/:orgId/...`. El cliente acepta `orgId` por método **o** como default al instanciar:

```ts
const mosend = new MosendClient({ apiKey: "mk_live_...", orgId: "<uuid>" });
await mosend.messages.send({ phoneNumberId, to, type: "text", payload: { body: "hi" } });
// equivalente a explicit:
await mosend.messages.send({ orgId: "<uuid>", phoneNumberId, to, ... });
```

### 4.3 Autenticación

Dos modos. El SDK acepta ambos y los routea automáticamente:

- **API key** (server-to-server). Formato `mk_live_<prefix>.<secret>` o `mk_test_...`. Se envía en `X-Api-Key` (preferido) o `Authorization: Bearer`. El backend distingue por prefijo, así que basta con setear `apiKey` en el constructor.
- **Bearer JWT** (sesión interactiva). Obtenido vía `auth.login()` → `{ accessToken, refreshToken, expiresIn: 900 }`. Refrescar con `auth.refresh()`. El SDK provee `MosendClient.withTokens(...)` y refresh automático si pasamos `refreshToken`.

**Scopes** (cuando la key se crea con `scopes: [...]`): `conversations:read|write`, `messages:send|read`, `contacts:read|write`, `templates:read|write`, `phone-numbers:read|write`, `waba:read|write`, `webhooks:read|write`, `billing:read|write`, `integrations:read|write`. Si la key se creó con `scopes: []` tiene acceso total.

### 4.4 Errores

Jerarquía en `src/core/errors.ts`:

```
MosendError (base)
├── MosendApiError              ← respuesta 4xx/5xx con body de error
│   ├── MosendBadRequestError   ← 400
│   ├── MosendAuthError         ← 401
│   ├── MosendPaymentRequired   ← 402
│   ├── MosendForbiddenError    ← 403
│   ├── MosendNotFoundError     ← 404
│   ├── MosendConflictError     ← 409
│   ├── MosendUnprocessable     ← 422
│   ├── MosendRateLimitError    ← 429 (expone retryAfterSec)
│   └── MosendServerError       ← 5xx
├── MosendNetworkError          ← fetch falló, timeout, abort
├── MosendWebhookSignatureError ← HMAC inválido en verifyWebhookSignature
└── MosendValidationError       ← validación local en SDK
```

Errores Meta Graph se envuelven en `MosendApiError` con `cause.metaCode`, `cause.metaSubcode`.

### 4.5 Idempotencia

Operaciones críticas (`messages.send`, `broadcasts.send`, `wallet.recharge`, etc.) aceptan `idempotencyKey: string`. El SDK lo envía como header `Idempotency-Key`. Si se pasa el mismo valor dos veces, el backend no duplica el efecto.

### 4.6 Rate limiting

Cada respuesta trae `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`. El SDK expone los tres en `RawResponse` y, ante un `429`, lanza `MosendRateLimitError` con `retryAfterSec` derivado del header `Reset`. Reintentos automáticos son **opt-in** vía `MosendClient({ retries: { max: 3, on: [429, 502, 503] } })`.

### 4.7 Paginación

Cursor opaco (no offsets). El SDK provee dos APIs por listado:

```ts
// 1. Página manual
const { data, pageInfo } = await mosend.contacts.list({ limit: 50 });
const next = await mosend.contacts.list({ limit: 50, cursor: pageInfo.endCursor });

// 2. AsyncIterable (recomendado)
for await (const contact of mosend.contacts.iterate({ limit: 100 })) { /* ... */ }
```

### 4.8 Webhooks

Mosend dispara `POST` a tu URL con `X-Mosend-Signature: sha256=<hex>` calculado sobre el **body crudo**. Reintentos exponenciales hasta 8 veces (~30 min).

El SDK expone:

```ts
import { verifyWebhookSignature, type WebhookEvent } from "@moshipp/mosend-sdk";

// en el handler HTTP
const rawBody = await readRawBody(req);
const sig = req.headers["x-mosend-signature"];
if (!verifyWebhookSignature(rawBody, sig, process.env.MOSEND_WEBHOOK_SECRET)) {
  return res.status(401).end();
}
const event = JSON.parse(rawBody) as WebhookEvent;
// event.event: "message.new" | "message.status" | "conversation.opened" | ...
```

**Eventos soportados** (typed discriminated union por `event`):
`message.new`, `message.status`, `conversation.opened`, `conversation.closed`, `conversation.assigned`, `template.status`, `phone.quality`, `invoice.issued`, `invoice.paid`, `invoice.overdue`, `wallet.recharged`.

Cada delivery trae `deliveryId` — el consumidor debe deduplicar (la verificación HMAC no implica que sea la primera entrega).

---

## 5. Mapa completo de módulos → resource clients

> Cada celda es **`client.<resource>`** con su base path y número de endpoints. **Todos los paths fueron verificados contra developer.mosend.dev** (2026-05-18). Los paths del sidebar a veces difieren del base path real — esta tabla refleja el real.

### Identidad y org (41 endpoints) — verificado

| Resource | Base path | Endpoints | Notas |
|---|---|---|---|
| `auth` | `/auth` | 7 | público — signup/login/refresh/logout/forgot/reset/impersonate-redeem |
| `users` | `/users` | 3 | me, updateMe, change-password |
| `organizations` | `/organizations` | 6 | incluye slug-suggest y slug-available |
| `memberships` | `/organizations/:orgId/memberships` | 5 | setRole vía PATCH; waba-scope vía PUT |
| `roles` | `/organizations/:orgId/roles` | 1 | solo lectura; built-in: owner/admin/agente/observer |
| `permissions` | `/permissions` | 1 | catálogo global, sin org |
| `invitations` | mixto: `/organizations/:orgId/invitations` + `/invitations/accept` | 5 | accept fuera del scope de org |
| `twoFactor` | `/two-factor` | 3 | enroll, verify, disable |
| `passkeys` | mixto: `/passkeys/*` + `/auth/passkey/login/*` | 7 | login options/verify son **públicos** |
| `apiKeys` | `/organizations/:orgId/api-keys` | 3 | secret visible 1 sola vez en create |

### Mensajería (83 endpoints) — verificado

| Resource | Base path | Endpoints |
|---|---|---|
| `conversations` | `/organizations/:orgId/conversations` | 24 (incluye search, workload, activity-trends, bulk-assign, tags por conv, etc.) |
| `messages` | `/organizations/:orgId/messages` | 6 |
| `reactions` | `/organizations/:orgId/messages/:messageId/reactions` | 2 (PUT/DELETE upsert) |
| `stickers` | `/organizations/:orgId/stickers` | 5 (upload es multipart) |
| `templates` | `/organizations/:orgId/templates` | 6 |
| `contacts` | `/organizations/:orgId/contacts` | 9 |
| `contactLists` | `/organizations/:orgId/contact-lists` | 9 |
| `tags` | `/organizations/:orgId/tags` | 3 |
| `optIns` | `/organizations/:orgId/contacts/:contactId/opt-ins` | 2 (anidados en contact) |
| `quickReplies` | `/organizations/:orgId/quick-replies` | 5 |
| `broadcasts` | `/organizations/:orgId/broadcasts` | 5 |
| `whatsappLinks` | `/organizations/:orgId/whatsapp-links` | 7 (incluye stats y qr) |

### WhatsApp Business (16 endpoints) — verificado

| Resource | Base path | Endpoints |
|---|---|---|
| `waba` | `/organizations/:orgId/waba` | 6 (delete=archive, purge=hard delete) |
| `phoneNumbers` | `/organizations/:orgId/phone-numbers` | 7 |
| `profiles` | `/organizations/:orgId/phone-numbers/:phoneId/profile` | 3 (picture es multipart) |

### Bot (27 endpoints) — verificado contra developer.mosend.dev

| Resource | Base path | Endpoints |
|---|---|---|
| `botConfig` | `/organizations/:orgId/bot/config` | 4 |
| `autoReplies` | `/organizations/:orgId/bot/auto-replies` | 4 |
| `botEvents` | `/organizations/:orgId/bot/events` | 1 |
| `flows` | `/organizations/:orgId/bot/flows` | 9 |
| `orgAiProviders` | `/organizations/:orgId/bot/ai-providers` | 4 |
| `handoffWebhook` | `/organizations/:orgId/integrations/handoff-webhook` | 5 |

### Web Chat (15 endpoints) — verificado

| Resource | Base path | Endpoints | Notas |
|---|---|---|---|
| `webChat` | mixto: `/organizations/:orgId/web-chat/channels/*` + `/organizations/:orgId/conversations/:convId/web-chat/*` | 9 | media es multipart; identity-secret es HMAC visible 1 sola vez |
| `webChatPublic` | `/web-chat/:token` | 6 | **público** — consumido por el widget desde el navegador; HMAC opcional si el canal lo exige |

### Bot · IA (7 endpoints) — verificado

| Resource | Base path | Endpoints | Notas |
|---|---|---|---|
| `knowledge` | `/organizations/:orgId/bot/knowledge` | 7 | RAG: docs, chunks, embeddings, reproceso. `upload` es **multipart/form-data** (campos: `file`, `title?`, `tags?` separadas por coma) |

### Billing (39 endpoints) — verificado

| Resource | Base path | Endpoints | Notas |
|---|---|---|---|
| `plans` | `/plans` + `/plans/organizations/:orgId/*` | 6 | GET /plans y /plans/:slug son **públicos** |
| `planLimits` | `/organizations/:orgId/plan-limits` | 1 | |
| `billing` | `/organizations/:orgId/billing` | 5 | periods, usage, estimated-next-charge, coupons validate/redeem |
| `addons` | `/organizations/:orgId/billing/addons` | 3 | sub-path de billing, **NO** `/addons` |
| `invoices` | `/organizations/:orgId/invoices` | 3 |
| `wallet` | `/organizations/:orgId/wallet` | 2 | transactions con paginación cursor |
| `walletAlerts` | `/organizations/:orgId/billing/alert-settings` | 2 | **NO** `/wallet-alerts` — sidebar engañoso |
| `mercadoPago` | rutas dispersas: `/wallet/recharge`, `/billing/invoices/:id/pay`, `/webhooks/mercado-pago` | 3 | webhook MP es público; el SDK solo expone recharge y payInvoice |
| `paymentMethods` | `/organizations/:orgId/billing/*` | 6 | payment-methods + preferences + auto-pay en el mismo controller |
| `creditNotes` | `/admin/credit-notes` | 6 | **staff-only**, sin scope de org |
| `pricing` | `/pricing` | 1 | requiere bearer |
| `usage` | `/organizations/:orgId/usage/daily` | 1 |

### Webhooks y eventos (4 endpoints)

| Resource | Base path | Endpoints |
|---|---|---|
| `webhooksOutbound` | `/organizations/:orgId/webhooks-outbound` | 4 | CRUD + `/:id/deliveries` |

### Otros (26 endpoints) — verificado

| Resource | Base path | Endpoints | Notas |
|---|---|---|---|
| `audit` | mixto: `/organizations/:orgId/audit` + `/admin/audit` | 4 | export requiere permission `audit_advanced` |
| `health` | `/health` | 3 | live, ready, status — **públicos** |
| `reports` | `/organizations/:orgId/reports` | 3 | summary, messaging, billing |
| `notifications` | `/notifications` | 2 | per-user, **sin** orgId |
| `push` | `/push` | 5 | VAPID web push, sin orgId |
| `leads` | `/public/leads` | 1 | **público** — form marketing |
| `integrations` | `/organizations/:orgId/integrations` + `/integrations/catalog/*` | 6 | doc inconsistente: update/delete cuelgan de catalog |
| `media` | `/organizations/:orgId/media` | 2 | solo lectura — upload vive en otros módulos (stickers, profile picture, web-chat media) |

---

## 6. Convenciones de código

### 6.1 Naming

- **Archivos**: camelCase singular o plural según el módulo de la API (`messages.ts`, `webhooksOutbound.ts`).
- **Tipos**: PascalCase (`Message`, `SendMessageInput`, `BroadcastSummary`).
- **Métodos del resource**: verbos descriptivos. Mapeo recomendado:
  - `GET /resource` → `.list()` (devuelve `{ data, pageInfo }`) o `.iterate()` (AsyncIterable).
  - `GET /resource/:id` → `.retrieve(id)` o `.get(id)`.
  - `POST /resource` → `.create(input)`.
  - `PATCH /resource/:id` → `.update(id, input)`.
  - `DELETE /resource/:id` → `.delete(id)`.
  - Acciones no-CRUD usan el nombre del path: `POST /broadcasts/:id/send` → `.send(id)`, `POST /broadcasts/:id/cancel` → `.cancel(id)`.

### 6.2 Tipado

- `tsconfig` con `"strict": true`, `"noUncheckedIndexedAccess": true`, `"exactOptionalPropertyTypes": true`.
- Para enums de la API usamos **string literal unions** (`type MessageType = "text" | "image" | ...`), no `enum`. Más amigables con `JSON.parse` y tree-shaking.
- DTOs request: sufijo `Input` (`SendMessageInput`). DTOs response: sin sufijo, el nombre del recurso (`Message`).
- Campos opacos de Meta (`metaMessageId`, `wabaId`, etc.) van como `string` (no UUID).

### 6.3 Errores

- Nunca tragar errores: si `fetch` falla, relanzar `MosendNetworkError`. Si el body de error no parsea, relanzar `MosendApiError` con `body: rawText`.
- `Promise.reject` con objetos `Error`, jamás strings.
- En `verifyWebhookSignature` usamos `crypto.timingSafeEqual` (Node) o `crypto.subtle` (browser) — nunca comparación de strings.

### 6.4 Comentarios

Por defecto **no** escribimos comentarios. Solo cuando el _por qué_ no es evidente: un workaround para un bug específico de Meta, un campo deprecado que mantenemos por compat, una decisión contraintuitiva. Sin JSDoc decorativo. Los nombres y los tipos cuentan la historia.

### 6.5 Tests

- `vitest` con `msw` (mock service worker) para mockear HTTP. Cero llamadas reales en CI.
- Cada resource tiene su `*.test.ts` cubriendo: happy path, error 4xx típico, paginación si aplica.
- `core/webhooks.test.ts` con vectores fijos (body + secret → firma esperada) para detectar regresiones de seguridad.
- Cobertura objetivo: 80% statements, 100% en `core/`.

---

## 7. Convención del cliente (API pública)

```ts
import { MosendClient } from "@moshipp/mosend-sdk";

const mosend = new MosendClient({
  apiKey: process.env.MOSEND_API_KEY!,           // mk_live_<prefix>.<secret>
  orgId: process.env.MOSEND_ORG_ID,              // opcional, default para multi-tenant paths
  baseUrl: "https://api.mosend.dev",             // override para sandbox/testing
  timeout: 30_000,                               // ms
  retries: { max: 3, on: [429, 502, 503] },      // opt-in
  fetch: globalThis.fetch,                       // inyectable para tests/edge runtimes
});

// Enviar texto
const msg = await mosend.messages.send({
  phoneNumberId: "<uuid>",
  to: "+573000000000",
  type: "text",
  payload: { body: "Hola desde Mosend" },
}, { idempotencyKey: "order-42-greeting" });

// Listar conversaciones (paginadas)
for await (const conv of mosend.conversations.iterate({ status: "OPEN" })) {
  console.log(conv.id);
}

// Broadcast
const bc = await mosend.broadcasts.create({ name: "...", phoneNumberId, templateId, listId });
await mosend.broadcasts.send(bc.id);
```

---

## 8. Plan de implementación — estado actual

✅ **Scaffold** (`package.json`, `tsconfig`, `tsup`, `vitest`, ESLint+Prettier).
✅ **Core** (`src/core/`): `http.ts` (con soporte multipart), `errors.ts`, `auth.ts`, `pagination.ts`, `webhooks.ts`, `types.ts`. Tests dedicados.
✅ **Cliente raíz** (`src/client.ts` + `src/index.ts`): 55 resources expuestos.
✅ **55 resources** cubriendo los 258 endpoints documentados (todos los base paths verificados contra developer.mosend.dev).
✅ **Examples**: `send-template.ts`, `broadcast.ts`, `webhook-server.ts`.
✅ **README** orientado al usuario final.
✅ **Tests**: 55 tests en 5 archivos, todos verdes. typecheck + build verdes.
✅ **Pre-publish**: LICENSE MIT, .npmignore, `npm pack --dry-run` validado.

### Lo que quedaría a futuro

- CI: GitHub Actions con matrix Node 18/20/22.
- Auto-refresh de JWT con `tokenStore` pluggable.
- Helpers de OAuth/Embedded Signup para Meta.
- Adapter para edge runtimes específicos (Cloudflare Workers, Deno).
- Sintetizar los DTOs reales cuando la doc actualice los samples genéricos (`{ name, description }`) por shapes verdaderos.

---

## 9. Trabajando con esta documentación

- La fuente canónica de cada endpoint sigue siendo `https://developer.mosend.dev`. Cuando agregues un resource, abre la página `/api/<modulo>` correspondiente y refleja los métodos, paths y DTOs **exactamente como aparecen ahí**. Los **base paths del sidebar pueden ser distintos al `/<slug>` de la URL** — siempre verificá con la página real (ej. botConfig vive en `/bot/config`, no `/bot-config`; handoffWebhook en `/integrations/handoff-webhook`, no `/handoff-webhook`).
- El portal indica `Source: mosend-wb-backend/src/modules/<modulo>/...controller.ts`. No tenemos acceso al backend, pero los nombres de los DTOs (`SendMessageDto`, `EditMessageDto`, etc.) sirven como guía para nombrar nuestros tipos `*Input`.
- Si el portal documenta un body como `{ "name": "string", "description": "string" }` y eso claramente no corresponde al recurso (es un fallback genérico), inferí los campos reales desde las **guías** (`/enviar-plantilla`, `/enviar-broadcast`, `/auth`, `/webhooks-out`, `/bot/knowledge`) que sí muestran ejemplos válidos.
- Para endpoints `upload` (multipart), usá `FormData` y pasalo como `body` al `HttpClient` — el wrapper detecta `instanceof FormData` y no setea `Content-Type` para que `fetch` agregue el boundary correcto.

---

## 10. Cosas que NO hacemos

- No envolvemos respuestas en clases con métodos (`.save()`, `.refresh()`); devolvemos POJOs tipados. Stripe ya probó que las clases mutables generan más bugs que valor.
- No implementamos un cache local de recursos. Cualquier consumidor que lo necesite lo hace por fuera.
- No abstraemos Meta Graph errors a `enum` propio: pasamos `metaCode/metaSubcode` raw y dejamos que el caller decida. La traducción accionable la hace el backend en `errorTitle`.
- No exponemos `axios` ni el objeto `Request`/`Response` interno. La unidad pública es el método del resource.
- No publicamos `0.x` con SemVer "estable": cada minor puede romper hasta que la API misma llegue a 1.0.

---

## 11. Referencia rápida de URLs del portal

- Home: https://developer.mosend.dev
- Autenticación: https://developer.mosend.dev/auth
- URL base y envelope: https://developer.mosend.dev/url-base
- Errores y rate-limit: https://developer.mosend.dev/errors
- Quickstart plantilla: https://developer.mosend.dev/enviar-plantilla
- Quickstart broadcast: https://developer.mosend.dev/enviar-broadcast
- Webhooks salientes: https://developer.mosend.dev/webhooks-out
- Changelog: https://developer.mosend.dev/changelog
- Identidad widget Web Chat: https://developer.mosend.dev/widget/identity
- Knowledge base (RAG): https://developer.mosend.dev/bot/knowledge
- Plantillas OTP: https://developer.mosend.dev/templates/otp
- Cada módulo: `https://developer.mosend.dev/api/<slug>` (ver tabla de §5).
