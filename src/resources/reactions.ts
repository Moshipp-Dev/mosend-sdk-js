import type { Reaction, SetReactionInput } from "../types/messaging.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class ReactionsResource extends Resource {
  async set(
    messageId: string,
    input: SetReactionInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<Reaction> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<Reaction>({
      method: "PUT",
      path: `/organizations/${orgId}/messages/${messageId}/reactions`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async remove(messageId: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<unknown>({
      method: "DELETE",
      path: `/organizations/${orgId}/messages/${messageId}/reactions`,
      ...(options ? { options } : {}),
    });
  }
}
