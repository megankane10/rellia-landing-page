/** Production marketing site (www) — no draft/seed fallbacks. */
export const isStrictProductionSite = (): boolean => {
  if (typeof window === "undefined") return isMainBranchBuild()
  const host = window.location.hostname.toLowerCase()
  return host === "relliahealth.com" || host === "www.relliahealth.com"
}

/** Additions preview host — draft seed content allowed. */
export const isAdditionsPreviewSite = (): boolean => {
  if (typeof window === "undefined") return !isMainBranchBuild()
  const host = window.location.hostname.toLowerCase()
  return host === "relliahealth.vercel.app"
}

/** True when static seed data (directories, stories, careers roles) may be shown. */
export const allowCmsSeedFallbacks = (): boolean => {
  if (typeof window !== "undefined") {
    if (isStrictProductionSite()) return false
    if (isAdditionsPreviewSite()) return true
    if (import.meta.env.DEV) return true
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
