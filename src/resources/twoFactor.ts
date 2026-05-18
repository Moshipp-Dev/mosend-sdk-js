import type { TwoFactorEnrollResponse, TwoFactorVerifyInput } from "../types/identity.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class TwoFactorResource extends Resource {
  async enroll(options?: RequestOptions): Promise<TwoFactorEnrollResponse> {
    const res = await this.http.request<TwoFactorEnrollResponse>({
      method: "POST",
      path: `/two-factor/enroll`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async verify(input: TwoFactorVerifyInput, options?: RequestOptions): Promise<{ enabled: boolean; recoveryCodes?: string[] }> {
    const res = await this.http.request<{ enabled: boolean; recoveryCodes?: string[] }>({
      method: "POST",
      path: `/two-factor/verify`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async disable(options?: RequestOptions): Promise<void> {
    await this.http.request<unknown>({
      method: "POST",
      path: `/two-factor/disable`,
      ...(options ? { options } : {}),
    });
  }
}
