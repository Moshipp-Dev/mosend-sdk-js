import type { BusinessProfile, UpdateBusinessProfileInput } from "../types/waba.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";
import { MosendValidationError } from "../core/errors.js";

export class ProfilesResource extends Resource {
  async retrieve(
    phoneId: string,
    scope: { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<BusinessProfile> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<BusinessProfile>({
      method: "GET",
      path: `/organizations/${orgId}/phone-numbers/${phoneId}/profile`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    phoneId: string,
    input: UpdateBusinessProfileInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<BusinessProfile> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<BusinessProfile>({
      method: "PUT",
      path: `/organizations/${orgId}/phone-numbers/${phoneId}/profile`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async uploadPicture(
    phoneId: string,
    input: { file: Blob | File; filename?: string; orgId?: string },
    options?: RequestOptions,
  ): Promise<BusinessProfile> {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError("FormData is not available in this runtime.");
    }
    const orgId = this.requireOrgId(input.orgId);
    const form = new FormData();
    const filename = input.filename ?? (input.file as File).name ?? "picture.jpg";
    form.append("file", input.file, filename);
    const res = await this.http.request<BusinessProfile>({
      method: "POST",
      path: `/organizations/${orgId}/phone-numbers/${phoneId}/profile/picture`,
      body: form,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
