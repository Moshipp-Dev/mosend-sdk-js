import type { ChangePasswordInput, UpdateUserInput, User } from "../types/identity.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class UsersResource extends Resource {
  async me(options?: RequestOptions): Promise<User> {
    const res = await this.http.request<User>({
      method: "GET",
      path: `/users/me`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async updateMe(input: UpdateUserInput, options?: RequestOptions): Promise<User> {
    const res = await this.http.request<User>({
      method: "PATCH",
      path: `/users/me`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async changePassword(input: ChangePasswordInput, options?: RequestOptions): Promise<void> {
    await this.http.request<unknown>({
      method: "POST",
      path: `/users/me/change-password`,
      body: input,
      ...(options ? { options } : {}),
    });
  }

  /** Envía un código OTP por WhatsApp para verificar el teléfono del usuario. Requiere sesión JWT. */
  async requestPhoneCode(options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/users/me/phone/request-code`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Confirma el código OTP y marca el teléfono como verificado. Requiere sesión JWT. */
  async verifyPhoneCode(input: { code: string }, options?: RequestOptions): Promise<unknown> {
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/users/me/phone/verify-code`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
