import type { MediaItem, MediaUrl } from "../types/misc.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class MediaResource extends Resource {
  async retrieve(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<MediaItem> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<MediaItem>({
      method: "GET",
      path: `/organizations/${orgId}/media/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async getUrl(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<MediaUrl> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<MediaUrl>({
      method: "GET",
      path: `/organizations/${orgId}/media/${id}/url`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
