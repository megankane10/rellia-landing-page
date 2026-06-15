import { QueryClient, type DehydratedState } from "@tanstack/react-query"

export const CMS_QUERY_STATE_SCRIPT_ID = "__RELLIA_CMS_QUERY_STATE__"

const CMS_QUERY_STALE_MS = 15 * 1000

export const createAppQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CMS_QUERY_STALE_MS,
      },
    },
  })

export const readDehydratedCmsQueryState = (): DehydratedState | undefined => {
  if (typeof document === "undefined") return undefined

  const script = document.getElementById(CMS_QUERY_STATE_SCRIPT_ID)
  if (!script?.textContent?.trim()) return undefined

  try {
    return JSON.parse(script.textContent) as DehydratedState
  } catch {
    return undefined
  }
}

export const serializeDehydratedCmsQueryState = (state: DehydratedState): string =>
  JSON.stringify(state).replace(/</g, "\\u003c")
