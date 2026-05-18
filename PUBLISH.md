# Publicar `@mosend/sdk` en npm

Esta guía explica cómo publicar una versión nueva. Asume que ya tenés cuenta de npm con acceso al scope `@mosend`.

## Prerrequisitos (una sola vez)

1. **Cuenta npm con scope `@mosend`** (organización o usuario):
   - Logueate localmente: `npm login`.
   - Verificá: `npm whoami`.
2. **(Opcional, recomendado) Habilitar 2FA** en tu cuenta npm.
3. **(Opcional) Configurar publishing automático desde GitHub**:
   - Settings → Secrets → `NPM_TOKEN` con un token con permisos de publish.
   - El workflow `.github/workflows/publish.yml` publica al crear un GitHub Release.

## Checklist por release

1. **Actualizá la versión** en `package.json` siguiendo SemVer:
   ```bash
   npm version patch    # 0.1.0 → 0.1.1 (bugfix)
   npm version minor    # 0.1.0 → 0.2.0 (feature, puede romper en 0.x)
   npm version major    # 0.1.0 → 1.0.0 (cuando la API REST llegue a 1.0)
   ```
   Eso crea un commit `vX.Y.Z` y un tag git. No los pushees todavía.

2. **Corré la pipeline local**:
   ```bash
   npm run typecheck
   npm test
   npm run build
   npm pack --dry-run    # revisá el contenido del tarball
   ```
   `prepublishOnly` ya ejecuta typecheck + test + build automáticamente al publicar — pero conviene correrlo manual antes.

3. **Publicación manual** (si no usás el workflow):
   ```bash
   npm publish --access public
   ```
   El flag `--access public` es obligatorio para scopes que no son privados.

4. **Publicación vía GitHub Release** (recomendado para auditar):
   ```bash
   git push origin main --tags
   ```
   Después en GitHub → Releases → "Draft a new release", elegí el tag `vX.Y.Z`, escribí changelog, publicá. El workflow `publish.yml` hace todo el resto con **npm provenance** activado (genera el badge de "Provenance" en npmjs.com).

5. **Verificá la publicación**:
   ```bash
   npm view @mosend/sdk versions --json
   npm view @mosend/sdk@latest
   ```

## Despublicar / deprecar

- **Despublicar** (solo dentro de las primeras 72 h y si nadie depende del paquete):
  ```bash
  npm unpublish @mosend/sdk@X.Y.Z
  ```
- **Deprecar** una versión (preferible): publicás una nueva sin marcar la anterior como rota, pero avisás:
  ```bash
  npm deprecate @mosend/sdk@X.Y.Z "Usar X.Y.Z+1 — fix de seguridad"
  ```

## Versionado

Mientras la API Mosend está en `v0.9`, este SDK queda en `0.x`. **Cada minor puede romper** hasta que la API alcance `1.0`. Documentá breaking changes en el cuerpo del GitHub Release.

## Provenance

El workflow `publish.yml` usa `--provenance` con `id-token: write`. Eso vincula la publicación al commit + workflow de GitHub Actions, dando trazabilidad criptográfica (badge "Provenance" en npmjs.com). No requiere config adicional.

## Pre-flight check rápido

```bash
npm run typecheck && npm test && npm run build && npm pack --dry-run
```

Si los 4 pasan, el release está listo.
