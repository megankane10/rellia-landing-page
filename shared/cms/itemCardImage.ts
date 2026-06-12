import { DEFAULT_PROGRAMS_LANDING } from "./defaults"
import { findProgramsEventBySlug } from "./eventSlug"

/** Inline description art — never use for card, header, or og:image. */
const DESCRIPTION_ONLY_IMAGE_MARKERS = ["complianceevent-desc"]

export const isEventDescriptionOnlyImage = (src: string | undefined): boolean => {
  const normalized = (src ?? "").trim().toLowerCase()
  if (!normalized) return false
  return DESCRIPTION_ONLY_IMAGE_MARKERS.some((marker) => normalized.includes(marker))
}

/** Square header / card image for an event (same source on /events, detail, and OG). */
export const resolveEventCardImageSrc = (
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

const findDefaultProgramBySlug = (slug: string) => {
  const key = slug.trim().toLowerCase()
  if (!key) return undefined
  return DEFAULT_PROGRAMS_LANDING.programs.find((program) => {
    const href = (program.href ?? "").trim()
    if (!href.startsWith("/programs/")) return false
    return href.slice("/programs/".length).toLowerCase() === key
  })
}

/** Header / card image for a program detail page and OG (matches program cards). */
export const resolveProgramCardImageSrc = (
  slug: string,
  cmsImageSrc?: string | null,
  routeHeroImageSrc?: string | null,
): string | undefined => {
  const cmsSrc = cmsImageSrc?.trim()
  if (cmsSrc) return cmsSrc

  const routeSrc = routeHeroImageSrc?.trim()
  if (routeSrc) return routeSrc

  const defaultSrc = findDefaultProgramBySlug(slug)?.imageSrc?.trim()
  if (defaultSrc) return defaultSrc

  return undefined
}

export const defaultProgramRecordForSlug = (
  slug: string,
): Record<string, unknown> | null => {
  const program = findDefaultProgramBySlug(slug)
  if (!program) return null
  return {
    title: program.title,
    description: program.description,
    imageSrc: program.imageSrc,
    href: program.href,
  }
}
