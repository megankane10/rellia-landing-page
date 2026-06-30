import { buildCareersRoleShareMeta, parseCareersRoleIdFromPathname } from "./careersRoleShare"
import {
  resolveEventCollectionSeo,
  resolveProgramCollectionSeo,
  resolveStoryCollectionSeo,
} from "./collectionSeo"
import { findProgramsEventBySlug } from "./eventSlug"
import { resolveEventCardImageSrc, defaultProgramRecordForSlug } from "./itemCardImage"
import { portableTextToPlainText } from "./portableTextPlain"
import type { CareersOpenRole, SeoContent } from "./types"

export type ItemDetailSeo = {
  title: string
  description: string
  ogImageSrc?: string
  ogImageLandscape?: boolean
  ogImageContain?: boolean
  ogType?: "website" | "article"
}

const clampMetaTitle = (title: string, max = 70): string => {
  const trimmed = title.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1).trim()}…`
}

const clampMetaDescription = (description: string, max = 160): string => {
  const trimmed = description.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1).trim()}…`
}

const pickSeoTitle = (seo?: SeoContent | null): string | undefined =>
  seo?.metaTitle?.trim() || seo?.ogTitle?.trim() || undefined

const pickSeoDescription = (seo?: SeoContent | null): string | undefined =>
  seo?.metaDescription?.trim() || seo?.ogDescription?.trim() || undefined

export const buildAdvisorProfileSeoTitle = (name: string): string =>
  clampMetaTitle(`${name.trim()} — Advisors`)

export const buildAlumniProfileSeoTitle = (name: string): string =>
  clampMetaTitle(`${name.trim()} — Founders`)

export const resolveAlumniProfileSeo = (input: {
  name: string
  shortDescription?: string
  tagline?: string
  logoSrc?: string
  seo?: SeoContent | null
}): ItemDetailSeo => {
  const name = input.name.trim() || "Alumni company"
  const title = pickSeoTitle(input.seo) || buildAlumniProfileSeoTitle(name)
  const description =
    pickSeoDescription(input.seo) ||
    input.shortDescription?.trim() ||
    input.tagline?.trim() ||
    "Alumni company profile in the Rellia Health founder network."

  return {
    title,
    description: clampMetaDescription(description),
    ogImageSrc: input.logoSrc?.trim() || undefined,
    ogImageLandscape: true,
    ogImageContain: true,
  }
}

export const resolveAdvisorProfileSeo = (input: {
  name: string
  snapshot?: string
  focus?: string
  bio?: unknown
  photoSrc?: string
  seo?: SeoContent | null
}): ItemDetailSeo => {
  const name = input.name.trim() || "Advisor"
  const bioText =
    (typeof input.snapshot === "string" && input.snapshot.trim()) ||
    (typeof input.focus === "string" && input.focus.trim()) ||
    portableTextToPlainText(input.bio) ||
    "Advisor profile in the Rellia Health mentor directory."

  const title = pickSeoTitle(input.seo) || buildAdvisorProfileSeoTitle(name)
  const description = pickSeoDescription(input.seo) || bioText

  return {
    title,
    description: clampMetaDescription(description),
    ogImageSrc: input.photoSrc?.trim() || undefined,
    ogImageLandscape: true,
  }
}

export const buildEventItemSeo = (
  event: Record<string, unknown>,
  slug: string,
): ItemDetailSeo => {
  const cmsImageSrc = typeof event.imageSrc === "string" ? event.imageSrc : undefined
  const imageSrc = resolveEventCardImageSrc(slug, cmsImageSrc)
  const resolved = resolveEventCollectionSeo({
    title: typeof event.title === "string" ? event.title : "Event",
    eventDescription: event.eventDescription as never,
    detailBody: event.detailBody as never,
    startsAt: typeof event.startsAt === "string" ? event.startsAt : undefined,
    endsAt: typeof event.endsAt === "string" ? event.endsAt : undefined,
    dateTime: typeof event.dateTime === "string" ? event.dateTime : undefined,
    seo: (event.seo as SeoContent | null | undefined) ?? null,
    imageSrc,
  })

  return {
    title: clampMetaTitle(resolved.title),
    description: clampMetaDescription(resolved.description),
    ogImageSrc: imageSrc?.trim() || undefined,
    ogImageLandscape: true,
  }
}

export const buildProgramItemSeo = (
  program: Record<string, unknown>,
  slug: string,
  routeTitle?: string,
): ItemDetailSeo => {
  const resolved = resolveProgramCollectionSeo({
    title: typeof program.title === "string" ? program.title : routeTitle || undefined,
    heroTitle: typeof program.heroTitle === "string" ? program.heroTitle : undefined,
    description: typeof program.description === "string" ? program.description : undefined,
    heroDescription:
      typeof program.heroDescription === "string" ? program.heroDescription : undefined,
    seo: (program.seo as SeoContent | null | undefined) ?? null,
    imageSrc: typeof program.imageSrc === "string" ? program.imageSrc : undefined,
  })

  const ogSrc =
    resolved.ogImageUrl?.trim() ||
    (typeof program.imageSrc === "string" ? program.imageSrc.trim() : undefined)

  return {
    title: clampMetaTitle(resolved.title),
    description: clampMetaDescription(resolved.description),
    ogImageSrc: ogSrc || undefined,
    ogImageLandscape: true,
  }
}

export const buildCareersRoleItemSeo = (role: {
  title?: string
  location?: string
  employmentType?: string
  description?: unknown
  responsibilities?: string[]
}): ItemDetailSeo => {
  const shareRole: CareersOpenRole = {
    id: "",
    title: typeof role.title === "string" ? role.title : "Open role",
    location: typeof role.location === "string" ? role.location : "",
    employmentType: typeof role.employmentType === "string" ? role.employmentType : "",
    description: Array.isArray(role.description) ? role.description : null,
    responsibilities: Array.isArray(role.responsibilities)
      ? role.responsibilities.filter((line): line is string => typeof line === "string")
      : [],
  }
  const resolved = buildCareersRoleShareMeta(shareRole)

  return {
    title: clampMetaTitle(resolved.title),
    description: clampMetaDescription(resolved.description),
    ogImageSrc: resolved.ogImageUrl?.trim() || undefined,
    ogImageLandscape: true,
  }
}

export const buildStoryItemSeo = (story: {
  title: string
  tag?: string
  excerpt?: string
  coverImageSrc?: string
  seo?: SeoContent | null
}): ItemDetailSeo => {
  const resolved = resolveStoryCollectionSeo({
    title: story.title,
    tag: story.tag,
    excerpt: story.excerpt,
    seo: story.seo,
    coverImageSrc: story.coverImageSrc,
  })

  return {
    title: clampMetaTitle(resolved.title),
    description: clampMetaDescription(resolved.description),
    ogImageSrc: story.coverImageSrc?.trim() || undefined,
    ogImageLandscape: true,
    ogType: "article",
  }
}

export const isItemDetailPathname = (pathname: string): boolean => {
  const key = pathname.replace(/\/+$/, "") || "/"
  if (key.startsWith("/stories/") && key !== "/stories") return true
  if (key.startsWith("/careers/roles/") && key.length > "/careers/roles/".length) return true
  if (key.startsWith("/events/") && key !== "/events") return true
  if (key.startsWith("/programs/") && key !== "/programs") return true
  if (key.startsWith("/advisors/directory/") && key !== "/advisors/directory") return true
  if (key.startsWith("/founders/alumni/") && key !== "/founders/alumni") return true
  return false
}

export type ItemDetailSeoPrefetch = {
  event?: Record<string, unknown> | null
  program?: Record<string, unknown> | null
  story?: Record<string, unknown> | null
  advisor?: Record<string, unknown> | null
  alumni?: Record<string, unknown> | null
  careersRole?: Record<string, unknown> | null
}

export const resolveItemDetailSeoForPath = (
  pathname: string,
  prefetched: ItemDetailSeoPrefetch,
  options?: { programRouteTitle?: string },
): ItemDetailSeo | null => {
  const key = pathname.replace(/\/+$/, "") || "/"

  if (key.startsWith("/careers/roles/")) {
    const roleId = parseCareersRoleIdFromPathname(key)
    if (!roleId) return null
    const role = prefetched.careersRole
    if (!role || typeof role.title !== "string") return null
    return buildCareersRoleItemSeo(role)
  }

  if (key.startsWith("/events/") && key !== "/events") {
    const slug = key.slice("/events/".length)
    const event = prefetched.event
    if (!event) return null
    return buildEventItemSeo(event, slug)
  }

  if (key.startsWith("/programs/") && key !== "/programs") {
    const slug = key.slice("/programs/".length)
    const program = prefetched.program ?? defaultProgramRecordForSlug(slug)
    if (!program) return null
    return buildProgramItemSeo(program, slug, options?.programRouteTitle)
  }

  if (key.startsWith("/stories/") && key !== "/stories") {
    const cms = prefetched.story
    if (!cms || typeof cms.title !== "string") return null
    return buildStoryItemSeo({
      title: cms.title,
      tag: typeof cms.tag === "string" ? cms.tag : undefined,
      excerpt: typeof cms.excerpt === "string" ? cms.excerpt : undefined,
      coverImageSrc: typeof cms.coverImageSrc === "string" ? cms.coverImageSrc : undefined,
      seo: (cms as { seo?: SeoContent | null }).seo,
    })
  }

  if (key.startsWith("/advisors/directory/") && key !== "/advisors/directory") {
    const advisor = prefetched.advisor
    if (!advisor) return null
    const name = typeof advisor.name === "string" ? advisor.name : "Advisor"
    return resolveAdvisorProfileSeo({
      name,
      snapshot: typeof advisor.snapshot === "string" ? advisor.snapshot : undefined,
      focus: typeof advisor.focus === "string" ? advisor.focus : undefined,
      bio: advisor.bio,
      photoSrc: typeof advisor.photoSrc === "string" ? advisor.photoSrc : undefined,
      seo: (advisor as { seo?: SeoContent | null }).seo,
    })
  }

  if (key.startsWith("/founders/alumni/") && key !== "/founders/alumni") {
    const company = prefetched.alumni
    if (!company) return null
    const name =
      (typeof company.name === "string" ? company.name : "") ||
      (typeof company.logoName === "string" ? company.logoName : "") ||
      "Alumni company"
    return resolveAlumniProfileSeo({
      name,
      shortDescription:
        typeof company.shortDescription === "string" ? company.shortDescription : undefined,
      tagline: typeof company.tagline === "string" ? company.tagline : undefined,
      logoSrc: typeof company.logoSrc === "string" ? company.logoSrc : undefined,
      seo: (company as { seo?: SeoContent | null }).seo,
    })
  }

  return null
}

export const findProgramsEventRecord = (
  slug: string,
  programsLanding: Parameters<typeof findProgramsEventBySlug>[1],
): Record<string, unknown> | null => {
  const match = findProgramsEventBySlug(slug, programsLanding)
  if (!match) return null
  const { _variant: _ignored, ...rest } = match
  return rest as Record<string, unknown>
}
