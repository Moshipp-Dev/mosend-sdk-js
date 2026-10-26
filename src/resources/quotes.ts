import type {
  CambiarEstadoDeCotizacionInput,
  Cotizacion,
  CotizacionConLineas,
  CotizacionConvertida,
  CotizacionEnviada,
  CotizacionesContextoQuery,
  CotizacionResumen,
  DisponibilidadDeCotizaciones,
  EmpresasQueCotizan,
  EnlaceDeVistaDeCotizacion,
  EnviarCotizacionInput,
  GuardarCotizacionInput,
  ItemCotizable,
  ListarCotizacionesQuery,
  LogoDeEmisorSubido,
} from "../types/quotes.js";
import type { RequestOptions } from "../core/types.js";
import { MosendValidationError } from "../core/errors.js";
import { Resource } from "./base.js";

type Scope = { orgId?: string };
type Query = Record<string, string | number | boolean | undefined>;

/**
 * `/organizations/:orgId/cotizaciones` — cotizaciones en PDF (función de plan
 * `quotes`): borradores, envío por la conversación, estado y conversión en
 * pedido de Ventas.
 */
export class QuotesResource extends Resource {
  private async call<T>(
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    orgId: string | undefined,
    sub: string,
    extra: { body?: unknown; query?: Query } = {},
    options?: RequestOptions,
  ): Promise<T> {
    const id = this.requireOrgId(orgId);
    const res = await this.http.request<T>({
      method,
      path: `/organizations/${id}/cotizaciones${sub}`,
      ...(extra.body !== undefined ? { body: extra.body } : {}),
      ...(extra.query ? { query: extra.query } : {}),
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Si el plan incluye cotizaciones y si el PDF sale sin marca de agua. */
  availability(scope: Scope = {}, options?: RequestOptions): Promise<DisponibilidadDeCotizaciones> {
    return this.call("GET", scope.orgId, "/disponibilidad", {}, options);
  }

  companies(
    query: CotizacionesContextoQuery & Scope = {},
    options?: RequestOptions,
  ): Promise<EmpresasQueCotizan> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/empresas", { query: rest }, options);
  }

  /** Sube el logo de una empresa (PNG o JPG, hasta 2 MB). */
  uploadLogo(
    input: { file: Blob | File; filename?: string } & Scope,
    options?: RequestOptions,
  ): Promise<LogoDeEmisorSubido> {
    if (typeof FormData === "undefined") {
      throw new MosendValidationError("FormData is not available in this runtime.");
    }
    const form = new FormData();
    form.append("file", input.file, input.filename ?? (input.file as File).name ?? "logo");
    return this.call("POST", input.orgId, "/emisor/logo", { body: form }, options);
  }

  /** Productos de Ventas, licencias y servicios del bot que se pueden cotizar. */
  catalog(
    query: CotizacionesContextoQuery & Scope = {},
    options?: RequestOptions,
  ): Promise<ItemCotizable[]> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "/catalogo", { query: rest }, options);
  }

  list(
    query: ListarCotizacionesQuery & Scope = {},
    options?: RequestOptions,
  ): Promise<CotizacionResumen[]> {
    const { orgId, ...rest } = query;
    return this.call("GET", orgId, "", { query: rest }, options);
  }

  /** Crea un borrador. */
  create(
    input: GuardarCotizacionInput & Scope,
    options?: RequestOptions,
  ): Promise<CotizacionConLineas> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, "", { body }, options);
  }

  get(quoteId: string, scope: Scope = {}, options?: RequestOptions): Promise<CotizacionConLineas> {
    return this.call("GET", scope.orgId, `/${quoteId}`, {}, options);
  }

  /** Edita un borrador; una cotización enviada se duplica. */
  update(
    quoteId: string,
    input: GuardarCotizacionInput & Scope,
    options?: RequestOptions,
  ): Promise<CotizacionConLineas> {
    const { orgId, ...body } = input;
    return this.call("PUT", orgId, `/${quoteId}`, { body }, options);
  }

  /** Borra un borrador. */
  delete(quoteId: string, scope: Scope = {}, options?: RequestOptions): Promise<{ ok: true }> {
    return this.call("DELETE", scope.orgId, `/${quoteId}`, {}, options);
  }

  /** Los bytes del PDF. */
  async pdf(quoteId: string, scope: Scope = {}, options?: RequestOptions): Promise<ArrayBuffer> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<ArrayBuffer>({
      method: "GET",
      path: `/organizations/${orgId}/cotizaciones/${quoteId}/pdf`,
      responseType: "arrayBuffer",
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Enlaces firmados (10 minutos) para ver o descargar el PDF desde cualquier navegador. */
  viewLink(
    quoteId: string,
    scope: Scope = {},
    options?: RequestOptions,
  ): Promise<EnlaceDeVistaDeCotizacion> {
    return this.call("GET", scope.orgId, `/${quoteId}/enlace`, {}, options);
  }

  /** Envía la cotización por la conversación del cliente. */
  send(
    quoteId: string,
    input: EnviarCotizacionInput & Scope = {},
    options?: RequestOptions,
  ): Promise<CotizacionEnviada> {
    const { orgId, ...body } = input;
    return this.call("POST", orgId, `/${quoteId}/enviar`, { body }, options);
  }

  duplicate(
    quoteId: string,
    scope: Scope = {},
    options?: RequestOptions,
  ): Promise<CotizacionConLineas> {
    return this.call("POST", scope.orgId, `/${quoteId}/duplicar`, {}, options);
  }

  setStatus(
    quoteId: string,
    input: CambiarEstadoDeCotizacionInput & Scope,
    options?: RequestOptions,
  ): Promise<Cotizacion> {
    const { orgId, ...body } = input;
    return this.call("PATCH", orgId, `/${quoteId}/estado`, { body }, options);
  }

  /** Convierte la cotización en un pedido de Ventas (necesita el módulo de Ventas). */
  convert(
    quoteId: string,
    scope: Scope = {},
    options?: RequestOptions,
  ): Promise<CotizacionConvertida> {
    return this.call("POST", scope.orgId, `/${quoteId}/convertir`, {}, options);
  }

  /** `GET /cotizaciones/pdf/:token` (público): el PDF de una cotización enviada. */
  async publicPdf(token: string, options?: RequestOptions): Promise<ArrayBuffer> {
    const res = await this.http.request<ArrayBuffer>({
      method: "GET",
      path: `/cotizaciones/pdf/${encodeURIComponent(token)}`,
      responseType: "arrayBuffer",
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** `GET /cotizaciones/vista/:token` (público): el PDF por el enlace de `viewLink`. */
  async viewPdf(
    token: string,
    query: { descargar?: string } = {},
    options?: RequestOptions,
  ): Promise<ArrayBuffer> {
    const res = await this.http.request<ArrayBuffer>({
      method: "GET",
      path: `/cotizaciones/vista/${encodeURIComponent(token)}`,
      query: { ...query },
      responseType: "arrayBuffer",
      skipAuth: true,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
