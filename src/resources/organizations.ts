import type {
  CreateOrganizationInput,
  Organization,
  UpdateOrganizationInput,
} from "../types/identity.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class OrganizationsResource extends Resource {
  async list(options?: RequestOptions): Promise<Organization[]> {
    const res = await this.http.request<Organization[]>({
      method: "GET",
      path: `/organizations`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(input: CreateOrganizationInput, options?: RequestOptions): Promise<Organization> {
    const res = await this.http.request<Organization>({
      method: "POST",
      path: `/organizations`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async suggestSlug(name: string, options?: RequestOptions): Promise<{ slug: string }> {
    const res = await this.http.request<{ slug: string }>({
      method: "GET",
      path: `/organizations/slug-suggest`,
      query: { name },
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async isSlugAvailable(slug: string, options?: RequestOptions): Promise<{ available: boolean }> {
    const res = await this.http.request<{ available: boolean }>({
      method: "GET",
      path: `/organizations/slug-available`,
      query: { slug },
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(id: string, options?: RequestOptions): Promise<Organization> {
    const res = await this.http.request<Organization>({
      method: "GET",
      path: `/organizations/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateOrganizationInput,
    options?: RequestOptions,
  ): Promise<Organization> {
    const res = await this.http.request<Organization>({
      method: "PATCH",
      path: `/organizations/${id}`,
      body: input,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
