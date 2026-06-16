/** Production marketing site (www) — no draft/seed fallbacks. */
export const isStrictProductionSite = (): boolean => {
  return isProductionDataset()
}

const isProductionDataset = (): boolean =>
  (import.meta.env.VITE_SANITY_DATASET ?? "").trim().toLowerCase() === "production"

/**
 * True when static seed data (directories, stories, careers, default events) may be shown.
 * Allowed only for local dev with a non-production dataset — never on www.
 */
export const allowCmsSeedFallbacks = (): boolean => {
  if (isProductionDataset()) return false
  return true
}
