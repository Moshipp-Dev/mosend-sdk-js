import type {
  Passkey,
  PasskeyLoginOptions,
  PasskeyLoginVerifyResponse,
  PasskeyRegistrationOptions,
} from "../types/identity.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class PasskeysResource extends Resource {
  async registrationOptions(
    input: Record<string, unknown> = {},
    options?: RequestOptions,
  ): Promise<PasskeyRegistrationOptions> {
    const res = await this.http.request<PasskeyRegistrationOptions>({
      method: "POST",
      path: `/passkeys/registration/options`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async registrationVerify(
    input: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<Passkey> {
    const res = await this.http.request<Passkey>({
      method: "POST",
      path: `/passkeys/registration/verify`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async list(options?: RequestOptions): Promise<Passkey[]> {
    const res = await this.http.request<Passkey[]>({
      method: "GET",
      path: `/passkeys`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async rename(id: string, input: { name: string }, options?: RequestOptions): Promise<Passkey> {
    const res = await this.http.request<Passkey>({
      method: "PATCH",
      path: `/passkeys/${id}`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(id: string, options?: RequestOptions): Promise<void> {
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/passkeys/${id}`,
      ...(options ? { options } : {}),
    });
  }

  async loginOptions(
    input: { email?: string } = {},
    options?: RequestOptions,
  ): Promise<PasskeyLoginOptions> {
    const res = await this.http.request<PasskeyLoginOptions>({
      method: "POST",
      path: `/auth/passkey/login/options`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async loginVerify(
    input: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<PasskeyLoginVerifyResponse> {
    const res = await this.http.request<PasskeyLoginVerifyResponse>({
      method: "POST",
      path: `/auth/passkey/login/verify`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
