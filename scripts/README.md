# Generador de tipos del contrato (anti-drift)

`scripts/generate-types.mjs` deriva los tipos del contrato de la API desde el
**OpenAPI del backend** y los emite en `src/generated/api-types.ts`. Sirven como
**fuente de verdad** para los `*Input` escritos a mano del SDK y como **guardia
de drift** en CI: si el backend cambia un DTO y el SDK no se actualiza, el diff
del archivo generado lo evidencia.

## Archivos

- `spec/openapi.json` — copia vendorizada del export del backend
  (`pnpm openapi:export` en `mosend-wb-backend`). Es el contrato congelado contra
  el que se genera y testea (CI no tiene acceso al backend).
- `src/generated/api-types.ts` — **autogenerado, no editar**. Una interfaz por
  cada `components.schemas` del OpenAPI. Está ignorado por ESLint y no se publica
  al bundle (no lo importa `src/index.ts`); solo es referencia/typecheck.

## Comandos

```bash
npm run gen          # regenera src/generated/api-types.ts desde spec/openapi.json
npm run gen:check    # falla (exit 1) si el generado no coincide con el spec  → corre en CI
```

## Flujo cuando el backend cambia

1. En `mosend-wb-backend`: `pnpm openapi:export`.
2. Copiar el resultado: `cp ../mosend-wb-backend/openapi.json spec/openapi.json`.
3. `npm run gen`.
4. Revisar el **git diff de `src/generated/api-types.ts`** → eso es exactamente
   lo que cambió en el contrato del backend.
5. Ajustar los `*Input` afectados en `src/types/` y los resources, y commitear
   spec + generado juntos.

## Limitaciones (del export, no del generador)

- El backend **no documenta schemas de respuesta** (Nest no los emite sin
  `@ApiResponse`) → solo cubrimos request DTOs.
- DTOs definidos inline (`@Body() body: {...}`) no aparecen como schema con
  nombre → se generan como `Record<string, unknown>` y se mantienen a mano.
- Colisión de nombres: `SendMessageDto` existe en `messages` y `web-chat`;
  Swagger colapsa uno. El `messages.SendMessageInput` del SDK se valida a mano
  contra el DTO fuente real.

Por eso el archivo generado es una **referencia y guardia de drift**, no un
reemplazo total de los tipos a mano.
