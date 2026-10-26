import type {
  BotAgent,
  ConfiguradorInput,
  CreateBotAgentInput,
  DateRangeQuery,
  ProbadorInput,
  UpdateBotAgentInput,
} from "../types/botAgents.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

/** `/organizations/:orgId/bot/agents` — agentes especializados del bot, su configurador y su probador. */
export class BotAgentsResource extends Resource {
  async list(query: { orgId?: string; phoneNumberId?: string } = {}, options?: RequestOptions): Promise<BotAgent[]> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<BotAgent[]>({
      method: "GET",
      path: `/organizations/${orgId}/bot/agents`,
      query: rest,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async create(input: CreateBotAgentInput & { orgId?: string }, options?: RequestOptions): Promise<BotAgent> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<BotAgent>({
      method: "POST",
      path: `/organizations/${orgId}/bot/agents`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Catálogo de capacidades activables por agente. */
  async capabilities(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/bot/agents/capabilities`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Proveedores de IA con sus modelos elegibles y si tienen clave configurada. */
  async modelos(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/bot/agents/modelos`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Rendimiento por agente (conversaciones, traspasos, ventas, citas, costo…). */
  async stats(query: DateRangeQuery & { orgId?: string } = {}, options?: RequestOptions): Promise<unknown> {
    const { orgId: scopedOrgId, ...rest } = query;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "GET",
      path: `/organizations/${orgId}/bot/agents/stats`,
      query: rest,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async retrieve(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<BotAgent> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<BotAgent>({
      method: "GET",
      path: `/organizations/${orgId}/bot/agents/${id}`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async update(
    id: string,
    input: UpdateBotAgentInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<BotAgent> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<BotAgent>({
      method: "PATCH",
      path: `/organizations/${orgId}/bot/agents/${id}`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  async delete(id: string, scope: { orgId?: string } = {}, options?: RequestOptions): Promise<void> {
    const orgId = this.requireOrgId(scope.orgId);
    await this.http.request<void>({
      method: "DELETE",
      path: `/organizations/${orgId}/bot/agents/${id}`,
      ...(options ? { options } : {}),
    });
  }

  /** Conversa con el configurador para ajustar las instrucciones del agente. Solo propone: no guarda nada. */
  async configurador(
    agentId: string,
    input: ConfiguradorInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/bot/agents/${agentId}/configurador`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Prueba el agente sin enviar nada al cliente: devuelve lo que respondería y qué herramientas usaría. */
  async probador(
    agentId: string,
    input: ProbadorInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<unknown> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<unknown>({
      method: "POST",
      path: `/organizations/${orgId}/bot/agents/${agentId}/probador`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
