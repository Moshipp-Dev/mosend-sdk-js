/**
 * examples/send-template.ts
 *
 * Refleja la guía oficial https://developer.mosend.dev/enviar-plantilla
 *
 * Uso:
 *   MOSEND_API_KEY=mk_live_... \
 *   MOSEND_ORG_ID=<uuid> \
 *   MOSEND_PHONE_ID=<uuid> \
 *   MOSEND_TEMPLATE_ID=<uuid> \
 *   MOSEND_TO=573001234567 \
 *   npx tsx examples/send-template.ts
 */
import { MosendClient, MosendApiError } from "../src/index.js";

const {
  MOSEND_API_KEY,
  MOSEND_ORG_ID,
  MOSEND_PHONE_ID,
  MOSEND_TEMPLATE_ID,
  MOSEND_TO,
} = process.env;

if (!MOSEND_API_KEY || !MOSEND_ORG_ID || !MOSEND_PHONE_ID || !MOSEND_TEMPLATE_ID || !MOSEND_TO) {
  console.error(
    "Faltan variables de entorno. Necesarias: MOSEND_API_KEY, MOSEND_ORG_ID, MOSEND_PHONE_ID, MOSEND_TEMPLATE_ID, MOSEND_TO",
  );
  process.exit(1);
}

const mosend = new MosendClient({
  apiKey: MOSEND_API_KEY,
  orgId: MOSEND_ORG_ID,
});

async function main() {
  const approved = await mosend.templates.list({ status: "APPROVED", limit: 5 });
  console.warn(`Plantillas aprobadas: ${approved.data.length}`);

  const msg = await mosend.messages.send(
    {
      phoneNumberId: MOSEND_PHONE_ID!,
      to: MOSEND_TO!,
      type: "template",
      templateId: MOSEND_TEMPLATE_ID!,
      variables: ["Juan", "FAC-2026-0042"],
    },
    { idempotencyKey: `send-template-${MOSEND_TO}-${Date.now()}` },
  );

  console.warn("Enviado:", { id: msg.id, status: msg.status, conversationId: msg.conversationId });
}

main().catch((err: unknown) => {
  if (err instanceof MosendApiError) {
    console.error(
      `[${err.status} ${err.code}] ${err.message}`,
      err.metaCode ? `(meta=${err.metaCode}/${err.metaSubcode ?? "-"})` : "",
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});
