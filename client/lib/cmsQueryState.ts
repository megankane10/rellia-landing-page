import type { UseQueryResult } from "@tanstack/react-query"
import { isSanityConfigured } from "@/lib/sanity"

type CmsQuerySnapshot = Pick<
  UseQueryResult<unknown>,
  "isPending" | "isFetching" | "isLoading" | "data" | "isFetched"
>

/** True while the first CMS payload for this query is not ready yet. */
export const isCmsQueryLoading = (query: CmsQuerySnapshot): boolean => {
  if (query.isPending || query.isLoading) return true
  if (!query.isFetched && query.isFetching) return true
  if (query.data === undefined && query.isFetching) return true
  return false
}

/** Only show empty / 404 UI after Sanity has responded for this query. */
export const shouldShowCmsEmptyState = (
  query: Pick<UseQueryResult<unknown>, "isFetched" | "isError">,
): boolean => query.isFetched && !query.isError

export const isAnyCmsQueryLoading = (...queries: CmsQuerySnapshot[]): boolean =>
  queries.some(isCmsQueryLoading)

/** Avoid flashing an empty list while a refetch is in flight (e.g. stale [] cache). */
export const isCmsListAwaitingData = (
  query: Pick<UseQueryResult<unknown[]>, "isFetching" | "data">,
): boolean => query.isFetching && (Array.isArray(query.data) ? query.data.length === 0 : true)

/** Wait for the first Sanity fetch before rendering hardcoded merge defaults. */
export const isCmsPageContentReady = (
  query: Pick<UseQueryResult<unknown>, "isFetched">,
): boolean => !isSanityConfigured() || query.isFetched
