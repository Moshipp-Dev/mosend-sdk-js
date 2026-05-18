/**
 * examples/webhook-server.ts
 *
 * Servidor HTTP nativo de Node que recibe webhooks de Mosend, valida la firma
 * HMAC SHA-256 y despacha por evento. Refleja la guía
 * https://developer.mosend.dev/webhooks-out
 *
 * Uso:
 *   MOSEND_WEBHOOK_SECRET=whsec_... npx tsx examples/webhook-server.ts
 *   # luego expone el puerto con ngrok / cloudflared y registrá el webhook
 *   # vía mosend.webhooksOutbound.create({ url, events: [...] })
 */
import http from "node:http";
import {
  parseWebhookEvent,
  MosendWebhookSignatureError,
  type MosendWebhookEvent,
} from "../src/index.js";

const secret = process.env.MOSEND_WEBHOOK_SECRET;
if (!secret) {
  console.error("Falta MOSEND_WEBHOOK_SECRET");
  process.exit(1);
}

const port = Number(process.env.PORT ?? 3000);

async function readRawBody(req: http.IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

function handle(event: MosendWebhookEvent) {
  switch (event.event) {
    case "message.new":
      console.warn(`[message.new] ${event.deliveryId} org=${event.organizationId}`);
      break;
    case "message.status":
      console.warn(`[message.status] ${JSON.stringify(event.data)}`);
      break;
    case "invoice.paid":
      console.warn(`[invoice.paid] ${event.deliveryId}`);
      break;
    default:
      console.warn(`[${event.event}] ${event.deliveryId}`);
  }
}

const server = http.createServer((req, res) => {
  void (async () => {
    if (req.method !== "POST" || req.url !== "/webhooks/mosend") {
      res.writeHead(404).end();
      return;
    }
    const raw = await readRawBody(req);
    const signature = req.headers["x-mosend-signature"];
    try {
      const event = parseWebhookEvent(
        raw,
        Array.isArray(signature) ? signature[0]! : signature ?? "",
        secret!,
      );
      handle(event);
      res.writeHead(200, { "content-type": "application/json" }).end('{"ok":true}');
    } catch (err) {
      if (err instanceof MosendWebhookSignatureError) {
        res.writeHead(401).end();
      } else {
        console.error("handler error", err);
        res.writeHead(500).end();
      }
    }
  })();
});

server.listen(port, () => {
  console.warn(`Listening on http://localhost:${port}/webhooks/mosend`);
});
