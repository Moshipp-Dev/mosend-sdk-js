import type { LoginInput, LoginResponse, SignupInput, AuthTokens } from "../types/identity.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import type {
  AuthSession,
  SignupRequestCodeInput,
  SignupResendCodeInput,
  SignupVerifyCodeInput,
} from "../types/account.js";

export class AuthResource extends Resource {
  async login(input: LoginInput, options?: RequestOptions): Promise<LoginResponse> {
    const res = await this.http.request<LoginResponse>({
      method: "POST",
      path: `/auth/login`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async signup(input: SignupInput, options?: RequestOptions): Promise<LoginResponse> {
    const res = await this.http.request<LoginResponse>({
      method: "POST",
      path: `/auth/signup`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async refresh(input: { refreshToken: string }, options?: RequestOptions): Promise<AuthTokens> {
    const res = await this.http.request<AuthTokens>({
      method: "POST",
      path: `/auth/refresh`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async logout(input: { refreshToken: string }, options?: RequestOptions): Promise<void> {
    await this.http.request<unknown>({
      method: "POST",
      path: `/auth/logout`,
      body: input,
      ...(options ? { options } : {}),
    });
  }

  async forgotPassword(
    input: { email: string; captchaToken?: string },
    options?: RequestOptions,
  ): Promise<void> {
    await this.http.request<unknown>({
      method: "POST",
      path: `/auth/forgot-password`,
      body: input,
      ...(options ? { options } : {}),
    });
  }

  async resetPassword(input: { token: string; password: string }, options?: RequestOptions): Promise<void> {
    await this.http.request<unknown>({
      method: "POST",
      path: `/auth/reset-password`,
      body: input,
      ...(options ? { options } : {}),
    });
  }

  /** ¿El captcha está deshabilitado globalmente? (público) */
  async captchaStatus(options?: RequestOptions): Promise<{ disabled: boolean }> {
    const res = await this.http.request<{ disabled: boolean }>({
      method: "GET",
      path: `/auth/captcha-status`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Estado de los factores MFA del usuario actual. */
  async factorStatus(options?: RequestOptions): Promise<Record<string, unknown>> {
    const res = await this.http.request<Record<string, unknown>>({
      method: "GET",
      path: `/auth/factor-status`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Step-up con código 2FA (re-confirma identidad para operaciones sensibles). */
  async stepUp2fa(input: { code: string }, options?: RequestOptions): Promise<AuthTokens> {
    const res = await this.http.request<AuthTokens>({
      method: "POST",
      path: `/auth/step-up/2fa`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async verifyEmail(input: { token: string }, options?: RequestOptions): Promise<{ ok: boolean }> {
    const res = await this.http.request<{ ok: boolean }>({
      method: "POST",
      path: `/auth/verify-email`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async resendVerification(options?: RequestOptions): Promise<{ ok: boolean }> {
    const res = await this.http.request<{ ok: boolean }>({
      method: "POST",
      path: `/auth/resend-verification`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Canjea un token de impersonación de staff por una sesión. (público) */
  async impersonateRedeem(input: { token: string }, options?: RequestOptions): Promise<LoginResponse> {
    const res = await this.http.request<LoginResponse>({
      method: "POST",
      path: `/auth/impersonate-redeem`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Opciones WebAuthn para step-up con passkey. */
  async stepUpPasskeyOptions(options?: RequestOptions): Promise<Record<string, unknown>> {
    const res = await this.http.request<Record<string, unknown>>({
      method: "POST",
      path: `/auth/step-up/passkey/options`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async stepUpPasskeyVerify(
    input: { challengeKey: string; response: Record<string, unknown> },
    options?: RequestOptions,
  ): Promise<AuthTokens> {
    const res = await this.http.request<AuthTokens>({
      method: "POST",
      path: `/auth/step-up/passkey/verify`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Sesiones activas del usuario (una por dispositivo), marcando la actual. Requiere sesión JWT del panel. */
  async listSessions(options?: RequestOptions): Promise<{ sessions: AuthSession[] }> {
    const res = await this.http.request<{ sessions: AuthSession[] }>({
      method: "GET",
      path: `/auth/me/sessions`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Cierra las demás sesiones del usuario y conserva la actual. Requiere sesión JWT del panel. */
  async closeOtherSessions(options?: RequestOptions): Promise<{ closed: number }> {
    const res = await this.http.request<{ closed: number }>({
      method: "DELETE",
      path: `/auth/me/sessions`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Cierra una sesión propia (revoca toda su cadena de refresh). Requiere sesión JWT del panel. */
  async closeSession(id: string, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "DELETE",
      path: `/auth/me/sessions/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Flags públicos del registro (verificación de teléfono / correo). */
  async signupConfig(options?: RequestOptions): Promise<Record<string, unknown>> {
    const res = await this.http.request<Record<string, unknown>>({
      method: "GET",
      path: `/auth/signup/config`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Registro con teléfono verificado, paso 1: envía el código OTP por WhatsApp. */
  async signupRequestCode(input: SignupRequestCodeInput, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/auth/signup/request-code`,
      body: input,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Reenvía el código OTP del registro pendiente. */
  async signupResendCode(input: SignupResendCodeInput, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/auth/signup/resend-code`,
      body: input,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Registro, paso 2: verifica el código, crea la cuenta y emite tokens. */
  async signupVerifyCode(input: SignupVerifyCodeInput, options?: RequestOptions): Promise<LoginResponse> {
    const res = await this.http.request<LoginResponse>({
      method: "POST",
      path: `/auth/signup/verify-code`,
      body: input,
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
