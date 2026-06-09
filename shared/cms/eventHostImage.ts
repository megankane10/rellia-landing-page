import type { ProgramsEventCard } from "./types"

/** Default host portrait for Rellia-branded or company-hosted events without a custom host image. */
export const RELLIA_FAVICON_HOST_IMAGE = "/images/favicon-192.png"

/**
 * Events that should show the Rellia icon as the host portrait instead of
 * testimonial headshots or other inferred speaker avatars.
 */
export const EVENT_FAVICON_HOST_SLUGS = new Set([
  "leadership-under-pressure",
  "set-your-stage",
  "clinician-connect-primary-care",
  "investor-readiness-how-vcs-evaluate-startups",
  "why-healthcare-says-no-to-your-ai",
])

export const eventUsesRelliaFaviconHost = (slug: string | undefined): boolean =>
  Boolean(slug?.trim() && EVENT_FAVICON_HOST_SLUGS.has(slug.trim()))

export const isUsableEventHostImageSrc = (src: string | undefined | null): src is string => {
  const trimmed = src?.trim()
  return Boolean(trimmed)
}

type EventSpeakerParts = { speaker: string; company: string }

const parseEventSpeakerParts = (person: string | undefined): EventSpeakerParts => {
  const raw = (person ?? "").trim()
  if (!raw) return { speaker: "", company: "" }

  const separators = [" • ", " · ", " | ", " — ", " - ", ", "]
  const matched = separators.find((sep) => raw.includes(sep))
  if (!matched) return { speaker: raw, company: "" }

  const [speakerRaw, ...rest] = raw.split(matched)
  const speaker = (speakerRaw ?? "").trim()
  const company = rest.join(matched).trim()
  return { speaker, company }
}

const RELLIA_HEALTH_SPEAKER_RE = /rellia\s*health/i
const COMPANY_EVENT_HOST_RE = /company\s+event/i

const DR_SABINA_NAGPAL_SPEAKER_RE = /dr\.?\s*sabina|sabina.*nagpal/i
const MAZHAR_TESTIMONIAL_PORTRAIT = "/images/testimonials-MazharS.jpeg"

const BRENTON_HILL_SPEAKER_RE = /brenton\s*hill/i
const BRENTON_HILL_EVENT_PORTRAIT = "/images/testimonials-nickS.jpeg"

const AI_COLLECTIVE_HOST_RE = /ai\s*collective/i
const AI_COLLECTIVE_HOST_LOGO = "/images/logo-aicollective.jpg"

const ERIC_HAYWOOD_SPEAKER_RE = /eric\s*haywood/i
const INTERSYSTEMS_VENTURES_RE = /intersystems\s*ventures/i
const ERIC_HAYWOOD_HOST_PORTRAIT = "/images/host-erik.png"

/**
 * Resolved host portrait for event cards and detail pages.
 * CMS `hostImage` wins when set; otherwise named-host overrides, then the Rellia icon.
 */
export const resolveEventHostImageSrc = (event: ProgramsEventCard): string => {
  if (isUsableEventHostImageSrc(event.hostImageSrc)) {
    return event.hostImageSrc.trim()
  }

  const slug = event.slug?.trim()
  if (slug && EVENT_FAVICON_HOST_SLUGS.has(slug)) {
    return RELLIA_FAVICON_HOST_IMAGE
  }

  const parts = parseEventSpeakerParts(event.person)
  const speaker = (parts.speaker || (event.person ?? "").trim()).trim()
  const company = parts.company.trim()
  const personRaw = (event.person ?? "").trim()

  if (
    RELLIA_HEALTH_SPEAKER_RE.test(speaker) ||
    RELLIA_HEALTH_SPEAKER_RE.test(company) ||
    RELLIA_HEALTH_SPEAKER_RE.test(personRaw) ||
    COMPANY_EVENT_HOST_RE.test(company) ||
    COMPANY_EVENT_HOST_RE.test(personRaw)
  ) {
    return RELLIA_FAVICON_HOST_IMAGE
  }

  const isDrSabinaNagpalEvent =
    (DR_SABINA_NAGPAL_SPEAKER_RE.test(speaker) && /\bNagpal\b/i.test(speaker)) ||
    DR_SABINA_NAGPAL_SPEAKER_RE.test(personRaw)
  if (isDrSabinaNagpalEvent) {
    return MAZHAR_TESTIMONIAL_PORTRAIT
  }

  const isBrentonHillEvent =
    BRENTON_HILL_SPEAKER_RE.test(speaker) || BRENTON_HILL_SPEAKER_RE.test(personRaw)
  if (isBrentonHillEvent) {
    return BRENTON_HILL_EVENT_PORTRAIT
  }

  const isAiCollectiveHost =
    event.slug === "ai-healthcare-compliance" ||
    AI_COLLECTIVE_HOST_RE.test(speaker) ||
    AI_COLLECTIVE_HOST_RE.test(company) ||
    AI_COLLECTIVE_HOST_RE.test(personRaw)
  if (isAiCollectiveHost) {
    return AI_COLLECTIVE_HOST_LOGO
  }

  if (
    ERIC_HAYWOOD_SPEAKER_RE.test(speaker) ||
    ERIC_HAYWOOD_SPEAKER_RE.test(personRaw) ||
    INTERSYSTEMS_VENTURES_RE.test(company) ||
    INTERSYSTEMS_VENTURES_RE.test(personRaw)
  ) {
    return ERIC_HAYWOOD_HOST_PORTRAIT
  }

  return RELLIA_FAVICON_HOST_IMAGE
}
