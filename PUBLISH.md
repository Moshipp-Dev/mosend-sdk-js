# Publicar `@moshipp/mosend-sdk` en npm

Esta guía explica cómo publicar una versión nueva. Asume que ya tenés cuenta de npm con acceso al scope `@moshipp`.

## Prerrequisitos (una sola vez)

1. **Cuenta npm con scope `@moshipp`** (organización o usuario):
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
   npm view @moshipp/mosend-sdk versions --json
   npm view @moshipp/mosend-sdk@latest
   ```

## 2FA con passkey — cómo publicar en la práctica

> Contexto real (release v1.1.0, 2026-07-24): la cuenta npm `devmoshipp` usa **passkey (WebAuthn)** como 2FA, no una app de códigos TOTP. Eso cambia el flujo de publicación.

Con passkey **no existe código de 6 dígitos**, así que `npm publish --otp=...` no aplica. Y `npm publish` a secas falla con `EOTP` en cualquier shell **no interactiva** (Claude Code, scripts, CI) porque npm no puede abrir el navegador para pedir la passkey.

Opciones, en orden de preferencia:

1. **Terminal interactiva** (Terminal.app / iTerm): correr `npm publish --access public` normal. npm detecta la TTY, abre el navegador y autorizás con la passkey.

2. **Token granular** (para Claude Code, scripts o CI):
   - Generarlo en npmjs.com → Access Tokens → *Granular Access Token*, permiso **Read and write** sobre `@moshipp/mosend-sdk` (o el scope `@moshipp`), con *bypass 2FA for writes* habilitado.
   - Publicar pasándolo como config de una sola vez (no queda en disco):
     ```bash
     npm publish --access public "--//registry.npmjs.org/:_authToken=$NPM_TOKEN"
     ```
   - **Nunca** pegar el token en chats ni commitearlo. Si se expone, revocarlo de inmediato en npmjs.com y generar otro.
   - El mismo token sirve como secreto `NPM_TOKEN` en GitHub para que `publish.yml` publique solo (con provenance) al crear un Release — la vía recomendada a futuro.

### Gotchas vistos en releases reales

- `npm login` **no** exime el 2FA de escritura: aunque `npm whoami` funcione, `publish` sigue pidiendo passkey/token.
- Si el bump de versión vino de un commit remoto (no de `npm version`), revisá que `package-lock.json` tenga la misma versión (`npm install` lo sincroniza) y que **exista el tag** `vX.Y.Z` — crearlo y pushearlo a mano:
  ```bash
  git tag vX.Y.Z && git push origin main --tags
  ```
- npm normaliza `repository.url` al publicar y avisa con un warning; se corrige de una vez con `npm pkg fix` (cosmético, no bloquea).
- `prepublishOnly` (typecheck + tests + build) corre siempre antes de subir y tarda ~15 s.

## Despublicar / deprecar

- **Despublicar** (solo dentro de las primeras 72 h y si nadie depende del paquete):
  ```bash
  npm unpublish @moshipp/mosend-sdk@X.Y.Z
  ```
- **Deprecar** una versión (preferible): publicás una nueva sin marcar la anterior como rota, pero avisás:
  ```bash
  npm deprecate @moshipp/mosend-sdk@X.Y.Z "Usar X.Y.Z+1 — fix de seguridad"
  ```

## Versionado

Desde `v1.0.0` (2026) el SDK sigue SemVer estable: **major** para breaking changes, **minor** para features, **patch** para fixes. Documentá breaking changes en el cuerpo del GitHub Release.

## Provenance

El workflow `publish.yml` usa `--provenance` con `id-token: write`. Eso vincula la publicación al commit + workflow de GitHub Actions, dando trazabilidad criptográfica (badge "Provenance" en npmjs.com). No requiere config adicional.

## Pre-flight check rápido

```bash
npm run typecheck && npm test && npm run build && npm pack --dry-run
```

Si los 4 pasan, el release está listo.
