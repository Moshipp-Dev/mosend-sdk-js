import type { LoginInput, LoginResponse, SignupInput, AuthTokens } from "../types/identity.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

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

  async logout(options?: RequestOptions): Promise<void> {
    await this.http.request<unknown>({
      method: "POST",
      path: `/auth/logout`,
      ...(options ? { options } : {}),
    });
  }

  async forgotPassword(input: { email: string }, options?: RequestOptions): Promise<void> {
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
}
