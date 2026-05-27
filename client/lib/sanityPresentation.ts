/** Hosted Studio URL used for stega / visual editing comlink. */
export const getSanityStudioUrl = (): string =>
  (import.meta.env.VITE_SANITY_STUDIO_URL || "https://relliahealth.sanity.studio").replace(
    /\/$/,
    "",
  )

/** True when the marketing site runs inside Sanity Presentation’s preview iframe. */
export const isSanityPresentationIframe = (): boolean => {
  if (typeof window === "undefined") return false
  if (window.self !== window.top) return true

  try {
    const params = new URLSearchParams(window.location.search)
    if (
      params.has("sanity-preview-secret") ||
      params.has("sanity-preview-perspective-secret")
    ) {
      return true
    }
  } catch {
    /* ignore */
  }

  return false
}

export const isSanityPresentationPreview = (): boolean => isSanityPresentationIframe()
