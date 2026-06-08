/** Production marketing site (www) — no draft/seed fallbacks. */
export const isStrictProductionSite = (): boolean => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname.toLowerCase()
    return host === "relliahealth.com" || host === "www.relliahealth.com"
  }
  return isProductionDataset()
}

/** Preview/staging host (Vercel default preview URL). */
export const isAdditionsPreviewSite = (): boolean => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname.toLowerCase()
    return host === "relliahealth.vercel.app"
  }
  return !isProductionDataset()
}

const isProductionDataset = (): boolean =>
  (import.meta.env.VITE_SANITY_DATASET ?? "").trim().toLowerCase() === "production"

/**
 * True when static seed data (directories, stories, careers, default events) may be shown.
 * Gated by CMS dataset and hostname only — not by git branch.
 */
export const allowCmsSeedFallbacks = (): boolean => {
  if (isProductionDataset()) return false
  if (typeof window !== "undefined") {
    if (isStrictProductionSite()) return false
    return true
  }
  return true
}
