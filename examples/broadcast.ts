/**
 * examples/broadcast.ts
 *
 * Refleja la guía oficial https://developer.mosend.dev/enviar-broadcast
 *
 * Uso:
 *   MOSEND_API_KEY=mk_live_... \
 *   MOSEND_ORG_ID=<uuid> \
 *   MOSEND_PHONE_ID=<uuid> \
 *   MOSEND_TEMPLATE_ID=<uuid> \
 *   npx tsx examples/broadcast.ts
 */
import { MosendClient, MosendApiError } from "../src/index.js";

const {
  MOSEND_API_KEY,
  MOSEND_ORG_ID,
  MOSEND_PHONE_ID,
  MOSEND_TEMPLATE_ID,
} = process.env;

if (!MOSEND_API_KEY || !MOSEND_ORG_ID || !MOSEND_PHONE_ID || !MOSEND_TEMPLATE_ID) {
  console.error(
    "Faltan variables: MOSEND_API_KEY, MOSEND_ORG_ID, MOSEND_PHONE_ID, MOSEND_TEMPLATE_ID",
  );
  process.exit(1);
}

const mosend = new MosendClient({
  apiKey: MOSEND_API_KEY,
  orgId: MOSEND_ORG_ID,
});

async function main() {
  const list = await mosend.contactLists.create({
    name: `Demo broadcast ${new Date().toISOString().slice(0, 10)}`,
    description: "Lista efímera creada desde examples/broadcast.ts",
  });
  console.warn("Lista creada:", list.id);

  const contact = await mosend.contacts.create({
    waId: "573001234567",
    name: "Demo Juan",
    optInStatus: "OPTED_IN",
  });
  await mosend.contactLists.addMembers(list.id, { contactIds: [contact.id] });

  const broadcast = await mosend.broadcasts.create({
    name: "Demo Q1 promo",
    phoneNumberId: MOSEND_PHONE_ID!,
    templateId: MOSEND_TEMPLATE_ID!,
    templateLanguage: "es_CO",
    listId: list.id,
    templateVariables: {
      body: ["Juan"],
    },
  });
  console.warn("Broadcast creado:", broadcast.id, "estado:", broadcast.status);

  const result = await mosend.broadcasts.send(broadcast.id);
  console.warn("Resultado:", result);

  const detail = await mosend.broadcasts.retrieve(broadcast.id);
  console.warn(
    `Status final ${detail.status}: ${detail.sentCount}/${detail.totalRecipients} enviados, ${detail.failedCount} fallidos`,
  );
}

main().catch((err: unknown) => {
  if (err instanceof MosendApiError) {
    console.error(`[${err.status} ${err.code}] ${err.message}`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
