import type { SeoContent } from "./types"
import { portableTextToPlainText } from "./portableTextPlain"
import {
  getProgramsEventDisplayDateTime,
  shortenProgramsEventDateTime,
} from "./programsEventDisplay"

export const buildDefaultStorySeoTitle = (storyTitle: string, tag?: string): string => {
  const title = storyTitle.trim()
  const category = tag?.trim()
  if (!title) return category || "Rellia Health"
  if (!category) return title
  return `${title} — ${category}`
}

export const buildDefaultEventSeoTitle = (eventTitle: string): string => {
  const title = eventTitle.trim()
  if (!title) return "Events — Rellia Health"
  return `${title} - Events`
}

export const buildDefaultProgramSeoTitle = (programName: string): string =>
  `${programName.trim() || "Program"} — Rellia Health`

const pickSeoTitle = (seo?: SeoContent | null): string | undefined =>
  seo?.metaTitle?.trim() || seo?.ogTitle?.trim() || undefined

const pickSeoDescription = (seo?: SeoContent | null): string | undefined =>
  seo?.metaDescription?.trim() || seo?.ogDescription?.trim() || undefined

export type ResolvedCollectionSeo = {
  title: string
  description: string
  ogImageUrl?: string
}

export const resolveStoryCollectionSeo = (input: {
  title: string
  tag?: string
  excerpt?: string
  seo?: SeoContent | null
  coverImageSrc?: string
  fallbackDescription?: string
}): ResolvedCollectionSeo => {
  const title =
    pickSeoTitle(input.seo) ||
    buildDefaultStorySeoTitle(input.title, input.tag)

  const description =
    pickSeoDescription(input.seo) ||
    input.excerpt?.trim() ||
    input.fallbackDescription?.trim() ||
    "Stories and insights from Rellia Health."

  const ogImageUrl = input.seo?.ogImageUrl?.trim() || input.coverImageSrc?.trim() || undefined

  return { title, description, ogImageUrl }
}

export const resolveEventCollectionSeo = (input: {
  title: string
  eventDescription?: unknown
  detailBody?: unknown
  startsAt?: string
  endsAt?: string
  dateTime?: string
  seo?: SeoContent | null
  imageSrc?: string
}): ResolvedCollectionSeo => {
  const computedDateTime = getProgramsEventDisplayDateTime(input as never)
  const shortDateTime = shortenProgramsEventDateTime(computedDateTime)

  const descText = (() => {
    const fromEventDescription = portableTextToPlainText(input.eventDescription)
    if (fromEventDescription) return fromEventDescription
    return portableTextToPlainText(input.detailBody)
  })()

  const eventDate = shortDateTime || computedDateTime
  const defaultDescription = descText
    ? eventDate
      ? `${eventDate} · ${descText}`
      : descText
    : eventDate || "Upcoming events from Rellia Health."

  const title = pickSeoTitle(input.seo) || buildDefaultEventSeoTitle(input.title)
  const description = pickSeoDescription(input.seo) || defaultDescription
  const ogImageUrl = input.seo?.ogImageUrl?.trim() || input.imageSrc?.trim() || undefined

  return { title, description, ogImageUrl }
}

export const resolveProgramCollectionSeo = (input: {
  title?: string | null
  heroTitle?: string | null
  description?: string | null
  heroDescription?: string | null
  seo?: SeoContent | null
  fallbackDescription?: string
}): ResolvedCollectionSeo => {
  const programName = (input.title?.trim() || input.heroTitle?.trim() || "Program").trim()
  const defaultDescription =
    input.heroDescription?.trim() ||
    input.description?.trim() ||
    input.fallbackDescription?.trim() ||
    "Explore this Rellia Health program for healthcare founders and operators."

  const title = pickSeoTitle(input.seo) || buildDefaultProgramSeoTitle(programName)
  const description = pickSeoDescription(input.seo) || defaultDescription

  return { title, description, ogImageUrl: input.seo?.ogImageUrl?.trim() || undefined }
}

export const buildDefaultCareersRoleSeoTitle = (roleTitle: string): string => {
  const title = roleTitle.trim()
  if (!title) return "Careers — Rellia Health"
  return `${title} — Rellia Health Careers`
}

const careersRoleDescriptionSnippet = (description: unknown): string => {
  const compact = portableTextToPlainText(description).replace(/\s+/g, " ").trim()
  if (!compact) return ""
  const sentenceEnd = compact.search(/[.!?](\s|$)/)
  if (sentenceEnd > 40 && sentenceEnd < 180) {
    return compact.slice(0, sentenceEnd + 1).trim()
  }
  return compact.length > 160 ? `${compact.slice(0, 157).trim()}…` : compact
}

export const resolveCareersRoleSeo = (input: {
  title: string
  location?: string
  employmentType?: string
  description?: unknown
}): ResolvedCollectionSeo => {
  const roleTitle = input.title.trim() || "Open role"
  const location = input.location?.trim()
  const employmentType = input.employmentType?.trim()
  const snippet = careersRoleDescriptionSnippet(input.description)

  const metaParts = [roleTitle]
  if (location) metaParts.push(location)
  if (employmentType) metaParts.push(employmentType)

  const roleContext = [location, employmentType].filter(Boolean).join(" · ")

  const description = snippet
    ? roleContext
      ? `${roleContext}. ${snippet}`
      : snippet
    : `Join Rellia Health as ${metaParts.join(" · ")}. View responsibilities and apply on our careers page.`

  return {
    title: buildDefaultCareersRoleSeoTitle(roleTitle),
    description,
  }
}

/** Sanity patch paths cleared so collection SEO auto-syncs from content fields. */
export const COLLECTION_SEO_TEXT_UNSET_PATHS = [
  "seo.title",
  "seo.description",
  "seo.metaTitle",
  "seo.metaDescription",
  "seo.ogTitle",
  "seo.ogDescription",
  "seo.openGraph.title",
  "seo.openGraph.description",
  "seo.twitter.title",
  "seo.twitter.description",
] as const
