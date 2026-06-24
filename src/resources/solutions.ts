import type {
  InstallSolutionInput,
  SolutionInstall,
  SolutionPack,
  SolutionPackSummary,
} from "../types/solutions.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class SolutionsResource extends Resource {
  /** Catálogo de soluciones verticales (requiere usuario logueado, sin orgId). */
  async list(options?: RequestOptions): Promise<SolutionPackSummary[]> {
    const res = await this.http.request<SolutionPackSummary[]>({
      method: "GET",
      path: `/solutions`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Detalle completo de un pack por slug (incluye flow + plantillas). */
  async retrieve(slug: string, options?: RequestOptions): Promise<SolutionPack> {
    const res = await this.http.request<SolutionPack>({
      method: "GET",
      path: `/solutions/${slug}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Soluciones instaladas en la organización. */
  async listInstalled(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<SolutionInstall[]> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<SolutionInstall[]>({
      method: "GET",
      path: `/organizations/${orgId}/solutions`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async install(
    slug: string,
    input: InstallSolutionInput & { orgId?: string } = {},
    options?: RequestOptions,
  ): Promise<SolutionInstall> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<SolutionInstall>({
      method: "POST",
      path: `/organizations/${orgId}/solutions/${slug}/install`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async uninstall(slug: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/solutions/${slug}`,
      ...(options ? { options } : {}),
    });
  }
}
