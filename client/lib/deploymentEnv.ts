/** Production marketing site (www) — no draft/seed fallbacks. */
export const isStrictProductionSite = (): boolean => {
  if (typeof window === "undefined") return isMainBranchBuild()
  const host = window.location.hostname.toLowerCase()
  return host === "relliahealth.com" || host === "www.relliahealth.com"
}

/** Additions preview host — draft seed content allowed when dataset is preview. */
export const isAdditionsPreviewSite = (): boolean => {
  if (typeof window === "undefined") return !isMainBranchBuild()
  const host = window.location.hostname.toLowerCase()
  return host === "relliahealth.vercel.app"
}

const isProductionDataset = (): boolean =>
  (import.meta.env.VITE_SANITY_DATASET ?? "").trim().toLowerCase() === "production"

/**
 * True when static seed data (directories, stories, careers, default events) may be shown.
 * Never on production dataset — www must reflect Sanity production only (or empty), not code defaults.
 */
export const allowCmsSeedFallbacks = (): boolean => {
  if (isProductionDataset()) return false
  if (isMainBranchBuild()) return false

  if (typeof window !== "undefined") {
    if (isStrictProductionSite()) return false
    if (isAdditionsPreviewSite()) return true
    if (import.meta.env.DEV) return true
    const ref = String(import.meta.env.VITE_VERCEL_GIT_COMMIT_REF ?? "").trim().toLowerCase()
    if (ref === "main") return false
    return !isStrictProductionSite()
  }
  return !isMainBranchBuild()
}

const isMainBranchBuild = (): boolean => {
  const ref = String(import.meta.env.VITE_VERCEL_GIT_COMMIT_REF ?? "")
    .trim()
    .toLowerCase()
  return ref === "main"
}
