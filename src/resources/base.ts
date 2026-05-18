import type { HttpClient } from "../core/http.js";
import { MosendValidationError } from "../core/errors.js";

export interface ResourceContext {
  http: HttpClient;
  defaultOrgId: string | undefined;
}

export abstract class Resource {
  protected readonly http: HttpClient;
  protected readonly defaultOrgId: string | undefined;

  constructor(ctx: ResourceContext) {
    this.http = ctx.http;
    this.defaultOrgId = ctx.defaultOrgId;
  }

  protected requireOrgId(orgId: string | undefined): string {
    const id = orgId ?? this.defaultOrgId;
    if (!id) {
      throw new MosendValidationError(
        "orgId is required: pass it per call or set MosendClient({ orgId }).",
      );
    }
    return id;
  }
}
