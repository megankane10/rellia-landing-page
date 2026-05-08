import type { SanityQueryId } from "@shared/cms/sanityQueryRegistry"

export const getSanityProjectId = (): string =>
  import.meta.env.VITE_SANITY_PROJECT_ID || ""

export const getSanityDataset = (): string =>
  import.meta.env.VITE_SANITY_DATASET || ""

const isProductionHostname = (): boolean => {
  if (typeof window === "undefined") return false
  const host = window.location.hostname.toLowerCase()
  return host === "relliahealth.com" || host === "www.relliahealth.com"
}

export const isSanityConfigured = (): boolean => {
  if (import.meta.env.VITE_DISABLE_CMS === "true") return false
  // Keep production frozen on hardcoded content unless explicitly enabled.
  if (isProductionHostname() && import.meta.env.VITE_ENABLE_CMS_ON_PROD !== "true") return false
  return Boolean(
    import.meta.env.VITE_SANITY_PROJECT_ID &&
      import.meta.env.VITE_SANITY_DATASET,
  )
}

const allowSanityProxyFetch = (): boolean => {
  if (typeof window === "undefined") return false
  if (import.meta.env.VITE_DISABLE_CMS === "true") return false
  if (isSanityConfigured()) return true
  const embedded = window.self !== window.top
  const previewCookie =
    typeof document !== "undefined" &&
    typeof document.cookie === "string" &&
    document.cookie.includes("sanity-preview-perspective=")
  return embedded || previewCookie
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

    const res = await fetch("/api/sanity/query", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ queryId, params: params ?? {} }),
    })
    if (!res.ok) return null
    const json = (await res.json()) as { data?: T }
    return json.data ?? null
  } catch {
    return null
  }
}
