import type { Paginated } from "./types.js";

export type PageFetcher<T, P extends { cursor?: string }> = (params: P) => Promise<Paginated<T>>;

export async function* iteratePages<T, P extends { cursor?: string }>(
  fetcher: PageFetcher<T, P>,
  params: P,
): AsyncIterableIterator<T> {
  let cursor: string | undefined;
  let safety = 0;
  do {
    const page: Paginated<T> = await fetcher(
      cursor === undefined ? params : ({ ...params, cursor } as P),
    );
    for (const item of page.data) yield item;
    cursor =
      page.pageInfo.hasNextPage && page.pageInfo.endCursor ? page.pageInfo.endCursor : undefined;
    safety += 1;
    if (safety > 10_000) {
      throw new Error("iteratePages: safety limit exceeded (10000 pages)");
    }
  } while (cursor !== undefined);
}
