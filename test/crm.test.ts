import { describe, expect, it } from "vitest";
import { MosendClient } from "../src/index.js";
import { createMockFetch } from "./helpers/mockFetch.js";

const ORG_ID = "11111111-1111-1111-1111-111111111111";
const API_KEY = "mk_live_abcd1234.secret";

function client() {
  const { fetch, requests } = createMockFetch(() => ({
    status: 200,
    body: { data: {}, timestamp: "" },
  }));
  const mosend = new MosendClient({ apiKey: API_KEY, orgId: ORG_ID, fetch });
  return { mosend, requests };
}

describe("CRM — paths verificados vs backend", () => {
  it("crm.updateClient → PATCH .../crm/clientes/:id con dueño, etapa y campos", async () => {
    const { mosend, requests } = client();
    await mosend.crm.updateClient("c-1", {
      duenoUserId: null,
      etapa: "CLIENTE",
      campos: { segmento: "VIP" },
    });
    expect(requests[0]!.method).toBe("PATCH");
    expect(requests[0]!.url.endsWith(`/organizations/${ORG_ID}/crm/clientes/c-1`)).toBe(true);
    expect(JSON.parse(requests[0]!.body!)).toEqual({
      duenoUserId: null,
      etapa: "CLIENTE",
      campos: { segmento: "VIP" },
    });
  });

  it("crm.getTimeline → GET .../linea-de-tiempo con el cursor", async () => {
    const { mosend, requests } = client();
    await mosend.crm.getTimeline("c-1", { antes: "2026-10-25T00:00:00.000Z", limite: 20 });
    expect(requests[0]!.url).toContain(`/crm/clientes/c-1/linea-de-tiempo?`);
    expect(requests[0]!.url).toContain("limite=20");
  });

  it("crm.createCompany y lookupNit", async () => {
    const { mosend, requests } = client();
    await mosend.crm.createCompany({ nombre: "Moshipp SAS", nit: "901675933" });
    await mosend.crm.lookupNit({ nit: "901675933" });
    expect(requests[0]!.url.endsWith(`/crm/empresas`)).toBe(true);
    expect(requests[1]!.url.endsWith(`/crm/empresas/consultar-nit`)).toBe(true);
  });

  it("deals.board, move y lose", async () => {
    const { mosend, requests } = client();
    await mosend.deals.board({ embudoId: "e-1" });
    await mosend.deals.move("op-1", { etapaId: "s-3" });
    await mosend.deals.lose("op-1", { motivo: "Precio" });
    expect(requests[0]!.url).toContain(`/crm/oportunidades/tablero?embudoId=e-1`);
    expect(requests[1]!.url.endsWith(`/crm/oportunidades/op-1/mover`)).toBe(true);
    expect(JSON.parse(requests[2]!.body!)).toEqual({ motivo: "Precio" });
  });

  it("deals.enroll y createAutomation", async () => {
    const { mosend, requests } = client();
    await mosend.deals.enroll("cad-1", { contactIds: ["c-1"] });
    await mosend.deals.createAutomation({
      nombre: "Bienvenida",
      disparador: "contacto.etapa",
      condiciones: { etapa: "CLIENTE" },
      acciones: [{ tipo: "crear_tarea", titulo: "Llamar" }],
    });
    expect(requests[0]!.url.endsWith(`/crm/cadencias/cad-1/inscribir`)).toBe(true);
    expect(requests[1]!.url.endsWith(`/crm/automatizaciones`)).toBe(true);
  });
});
