import type { SanityQueryId } from "@shared/cms/sanityQueryRegistry"
import { clearApiCsrfCache, getApiCsrfHeaders } from "@/lib/apiCsrf"

export const getSanityProjectId = (): string =>
  import.meta.env.VITE_SANITY_PROJECT_ID || ""

export const getSanityDataset = (): string =>
  import.meta.env.VITE_SANITY_DATASET || ""

export const isProductionHostname = (): boolean => {
  if (typeof window === "undefined") return false
  const host = window.location.hostname.toLowerCase()
  return host === "relliahealth.com" || host === "www.relliahealth.com"
}

export const isSanityConfigured = (): boolean => {
  if (import.meta.env.VITE_DISABLE_CMS === "true") return false
  return Boolean(
    import.meta.env.VITE_SANITY_PROJECT_ID &&
      import.meta.env.VITE_SANITY_DATASET,
  )
}

const allowSanityProxyFetch = (): boolean => {
  if (typeof window === "undefined") return false
  if (import.meta.env.VITE_DISABLE_CMS === "true") return false
  if (isSanityConfigured()) return true
  // Presentation iframe: draft cookie is HttpOnly (not visible to document.cookie)
  if (window.self !== window.top) return true
  return false
}

/**
 * All CMS reads go through `POST /api/sanity/query` with a whitelisted `queryId` (no raw GROQ from the browser).
 */
export const sanityFetch = async <T>(
  queryId: SanityQueryId,
  params?: Record<string, unknown>,
): Promise<T | null> => {
  try {
    if (!allowSanityProxyFetch()) return null

    const run = async () => {
      const csrf = await getApiCsrfHeaders()
      return fetch("/api/sanity/query", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json", ...csrf },
        body: JSON.stringify({ queryId, params: params ?? {} }),
      })
    }

    let res = await run()
    if (res.status === 403) {
      const errBody = (await res.json().catch(() => ({}))) as { code?: string }
      if (errBody.code === "CSRF") {
        clearApiCsrfCache()
        res = await run()
      }
    }
    if (!res.ok) return null
    const json = (await res.json()) as { data?: T }
    return json.data ?? null
  } catch {
    return null
  }
}
