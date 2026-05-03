import type { ProgramsEventCard, ProgramsLandingContent } from "@shared/cms/types"

const slugifySegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

/** URL path segment for `/events/:slug` (stable; optional explicit `slug` in CMS). */
export const getProgramsEventSlug = (event: ProgramsEventCard): string => {
  const explicit = event.slug?.trim()
  if (explicit) {
    const s = slugifySegment(explicit)
    if (s) return s
  }
  const combined = `${event.title} ${event.dateTime}`
  let s = slugifySegment(combined)
  if (!s) s = "event"
  if (s.length > 96) s = s.slice(0, 96).replace(/-$/, "")
  return s
}

export const programsEventDetailPath = (event: ProgramsEventCard) =>
  `/events/${getProgramsEventSlug(event)}`

export type ProgramsEventWithVariant = ProgramsEventCard & { _variant: "upcoming" | "past" }

export const findProgramsEventBySlug = (
  slug: string,
  landing: ProgramsLandingContent,
): ProgramsEventWithVariant | null => {
  const decoded = decodeURIComponent(slug).trim().toLowerCase()
  if (!decoded) return null

  const matchIn = (list: ProgramsEventCard[], variant: "upcoming" | "past") => {
    for (const event of list) {
      if (getProgramsEventSlug(event).toLowerCase() === decoded) {
        return { ...event, _variant: variant }
      }
    }
    return null
  }

  return (
    matchIn(landing.upcomingEvents, "upcoming") ??
    matchIn(landing.pastEvents, "past") ??
    null
  )
}
