import { DEFAULT_PROGRAMS_LANDING } from "./defaults"
import { findProgramsEventBySlug } from "./eventSlug"

/** Inline description art — never use for the square header or og:image. */
const DESCRIPTION_ONLY_IMAGE_MARKERS = ["complianceevent-desc"]

export const isEventDescriptionOnlyImage = (src: string | undefined): boolean => {
  const normalized = (src ?? "").trim().toLowerCase()
  if (!normalized) return false
  return DESCRIPTION_ONLY_IMAGE_MARKERS.some((marker) => normalized.includes(marker))
}

/**
 * Canonical header image for event detail pages and social embeds.
 * Repo defaults win over CMS `image` so production (Sanity at build) matches preview.
 */
export const resolveEventHeaderImageSrc = (
  slug: string,
  cmsImageSrc?: string | null,
): string | undefined => {
  const trimmedSlug = slug.trim()
  const fallback = trimmedSlug
    ? findProgramsEventBySlug(trimmedSlug, DEFAULT_PROGRAMS_LANDING)
    : null
  const fallbackSrc = fallback?.imageSrc?.trim()
  if (fallbackSrc) return fallbackSrc

  const cmsSrc = cmsImageSrc?.trim()
  if (!cmsSrc || isEventDescriptionOnlyImage(cmsSrc)) return undefined
  return cmsSrc
}
