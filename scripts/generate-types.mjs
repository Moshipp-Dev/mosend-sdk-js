#!/usr/bin/env node
/**
 * Generador de tipos del contrato de la API a partir del OpenAPI del backend.
 *
 * Lee `spec/openapi.json` (copia vendorizada del export del backend) y emite
 * `src/generated/api-types.ts`: una interfaz TypeScript por cada schema de
 * `components.schemas` (los DTOs de request del backend, generados por
 * class-validator + @nestjs/swagger).
 *
 * Estos tipos son la FUENTE DE VERDAD del contrato; sirven como referencia para
 * los `*Input` escritos a mano del SDK y como guardia de drift en CI.
 *
 * Uso:
 *   node scripts/generate-types.mjs           # escribe el archivo
 *   node scripts/generate-types.mjs --check    # falla si el archivo está desactualizado
 *
 * Para refrescar tras un cambio del backend:
 *   1. copiar el nuevo openapi.json a spec/openapi.json
 *   2. npm run gen
 *   3. revisar el git diff de src/generated/api-types.ts → eso es lo que cambió
 *      en el backend; ajustar los `*Input` del SDK en consecuencia.
 *
 * Limitaciones conocidas del export (no del generador):
 *   - El backend no documenta schemas de RESPUESTA (Nest no los emite sin
 *     @ApiResponse) → solo cubrimos request DTOs.
 *   - Algunos controllers usan `@Body() body: {...}` inline → no aparecen como
 *     schema con nombre; esos DTOs no se generan (quedan a mano en el SDK).
 *   - Colisión de nombres: si dos clases comparten nombre (p.ej. SendMessageDto
 *     en messages y web-chat) Swagger colapsa una sola → el tipo generado puede
 *     no representar a ambas. Ver NOTAS al pie del archivo generado.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SPEC_PATH = join(ROOT, "spec", "openapi.json");
const OUT_PATH = join(ROOT, "src", "generated", "api-types.ts");

const spec = JSON.parse(readFileSync(SPEC_PATH, "utf8"));
const schemas = spec.components?.schemas ?? {};

/** Nombre de un $ref → identificador del schema. */
function refName(ref) {
  return ref.split("/").pop();
}

/** Convierte un schema JSON en una expresión de tipo TypeScript. */
function tsType(schema, depth = 0) {
  if (!schema || typeof schema !== "object") return "unknown";
  if (schema.$ref) return refName(schema.$ref);

  const nullable = schema.nullable === true ? " | null" : "";

  if (Array.isArray(schema.enum)) {
    const lits = schema.enum
      .map((v) => (typeof v === "string" ? JSON.stringify(v) : String(v)))
      .join(" | ");
    return `(${lits})${nullable}`;
  }

  switch (schema.type) {
    case "string":
      return `string${nullable}`;
    case "integer":
    case "number":
      return `number${nullable}`;
    case "boolean":
      return `boolean${nullable}`;
    case "array":
      return `Array<${tsType(schema.items, depth + 1)}>${nullable}`;
    case "object": {
      if (schema.properties) return `${objectBody(schema, depth + 1)}${nullable}`;
      // objeto libre (sin propiedades declaradas)
      return `Record<string, unknown>${nullable}`;
    }
    default:
      // sin `type`: puede ser un objeto con properties igualmente
      if (schema.properties) return `${objectBody(schema, depth + 1)}${nullable}`;
      return `unknown${nullable}`;
  }
}

/** Cuerpo `{ k: T; ... }` de un schema objeto, indentado según `depth`. */
function objectBody(schema, depth) {
  const required = new Set(schema.required ?? []);
  const pad = "  ".repeat(depth);
  const padInner = "  ".repeat(depth + 1);
  const props = Object.entries(schema.properties ?? {});
  if (props.length === 0) return "Record<string, unknown>";
  const lines = props.map(([key, propSchema]) => {
    const optional = required.has(key) ? "" : "?";
    const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
    const doc = propSchema?.description
      ? `${padInner}/** ${String(propSchema.description).replace(/\s+/g, " ").trim()} */\n`
      : "";
    return `${doc}${padInner}${safeKey}${optional}: ${tsType(propSchema, depth + 1)};`;
  });
  return `{\n${lines.join("\n")}\n${pad}}`;
}

function emitSchema(name, schema) {
  // enum a nivel raíz → type alias de unión
  if (Array.isArray(schema.enum) && schema.type === "string") {
    const lits = schema.enum.map((v) => JSON.stringify(v)).join(" | ");
    return `export type ${name} = ${lits};`;
  }
  // objeto con properties declaradas → interface
  if (schema.properties && Object.keys(schema.properties).length > 0) {
    return `export interface ${name} ${objectBody(schema, 0)}`;
  }
  // objeto sin properties (DTO inline que el export no introspeccionó) → alias
  if (schema.type === "object") {
    return `export type ${name} = Record<string, unknown>;`;
  }
  // cualquier otra cosa → type alias
  return `export type ${name} = ${tsType(schema, 0)};`;
}

const names = Object.keys(schemas).sort();
const collisions = []; // informativo; el export ya colapsó duplicados

const header = `/**
 * AUTO-GENERADO por scripts/generate-types.mjs — NO EDITAR A MANO.
 *
 * Tipos del contrato de la API derivados de spec/openapi.json
 * (OpenAPI ${spec.openapi ?? "?"} · ${spec.info?.title ?? "API"} ${spec.info?.version ?? ""}).
 *
 * Son la fuente de verdad de los request DTOs del backend. Comparar los
 * \`*Input\` del SDK contra estos para evitar drift. Regenerar con \`npm run gen\`.
 */
`;

const body = names.map((n) => emitSchema(n, schemas[n])).join("\n\n");

const notes = `

/*
 * NOTAS
 * - ${names.length} schemas generados desde components.schemas.
 * - El export OpenAPI no incluye schemas de respuesta ni los \`@Body() {...}\`
 *   inline; esos tipos siguen escritos a mano en src/types/.
 * - SendMessageDto existe en dos módulos (messages y web-chat); Swagger colapsa
 *   uno solo. El messages.SendMessageInput del SDK se mantiene a mano contra el
 *   DTO fuente real.
 */
`;

const output = `${header}\n${body}\n${notes}`;

const check = process.argv.includes("--check");
if (check) {
  let current = "";
  try {
    current = readFileSync(OUT_PATH, "utf8");
  } catch {
    current = "";
  }
  if (current.trim() !== output.trim()) {
    console.error(
      "✗ src/generated/api-types.ts está desactualizado respecto a spec/openapi.json.\n" +
        "  Ejecutá `npm run gen` y commiteá el resultado.",
    );
    process.exit(1);
  }
  console.log(`✓ api-types.ts al día (${names.length} schemas).`);
} else {
  writeFileSync(OUT_PATH, output);
  console.log(`✓ src/generated/api-types.ts ← ${names.length} schemas`);
  if (collisions.length) console.log(`  (colisiones informadas: ${collisions.join(", ")})`);
}
