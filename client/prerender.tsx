import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router-dom/server"
import { HelmetProvider, type HelmetServerState } from "react-helmet-async"
import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getStoryBySlug } from "@/content/stories"
import {
  clampMetaDescription,
  clampMetaTitle,
  getSeoForPathname,
  getAdminOgImage,
  getDefaultOgImageUrl,
  getSiteUrl,
  isClientOnlyAuthPath,
  isItemDetailPath,
  normalizePathname,
  resolveShareOgImage,
  resolveSocialOgImage,
  buildAdvisorProfileSeoTitle,
  buildAlumniProfileSeoTitle,
  resolveProgramSocialMeta,
  RELLIA_SOCIAL_THEME_COLOR,
} from "@/config/seo"
import { ADVISOR_DIRECTORY_SEED } from "@/data/advisorDirectory"
import { FOUNDER_DIRECTORY } from "@/data/founderDirectory"
import { AppRoutes, RouterShell } from "./AppRoutes"
import { DEFAULT_PROGRAMS_LANDING, DEFAULT_QMS_PROGRAM, mergeQmsProgram } from "@shared/cms/defaults"
import {
  resolveEventCollectionSeo,
  resolveProgramCollectionSeo,
  resolveStoryCollectionSeo,
} from "@shared/cms/collectionSeo"
import { buildCareersRoleShareMeta, parseCareersRoleIdFromPathname } from "@shared/cms/careersRoleShare"
import type { CareersOpenRole, SeoContent } from "@shared/cms/types"
import { mergeCmsPageContent } from "@shared/cms/mergeCmsPageContent"
import { mergePageSeo } from "@/hooks/useApplyCmsSeo"
import type { PageSeoOverrides } from "@/context/PageSeoContext"
import { findProgramsEventBySlug } from "@shared/cms/eventSlug"
import { getProgramsEventLocationLabel } from "@shared/cms/programsEventDisplay"
import {
  defaultProgramRecordForSlug,
  resolveEventCardImageSrc,
} from "@shared/cms/itemCardImage"
import {
  fetchPageBySlugForPrerender,
} from "@shared/cms/prerenderSanity"
import { prefetchCmsQueriesForPathname } from "@shared/cms/prerenderPrefetch"
import {
  CMS_QUERY_STATE_SCRIPT_ID,
  serializeDehydratedCmsQueryState,
} from "@/lib/cmsQueryHydration"

const RESERVED_FIRST_SEGMENTS = new Set([
  "about",
  "faq",
  "careers",
  "events",
  "programs",
  "network",
  "apply",
  "consulting",
  "founders",
  "advisors",
  "investors",
  "industry-partners",
  "partners",
  "contact",
  "membership",
  "stories",
  "terms",
  "privacy",
  "policy",
  "diagnostics",
  "diagnostic-survey",
  "survey",
  "studio",
  "admin",
])

const getSingleSegmentSlug = (pathname: string): string => {
  const clean = pathname.trim().replace(/\/+$/, "")
  if (!clean || clean === "/") return ""
  const raw = clean.startsWith("/") ? clean.slice(1) : clean
  if (!raw || raw.includes("/")) return ""
  return raw
}

const prerenderQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Number.POSITIVE_INFINITY,
      gcTime: Number.POSITIVE_INFINITY,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})

const helmetTitleText = (helmet: HelmetServerState | undefined): string | undefined => {
  const raw = helmet?.title?.toString()?.trim()
  if (!raw) return undefined
  return raw.replace(/<title[^>]*>|<\/title>/gi, "").trim() || undefined
}

const escapeMetaAttr = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")

export type ItemPrerenderSeo = {
  title: string
  description: string
  ogImage?: string
  ogImageWidth?: number
  ogImageHeight?: number
}

const buildEventSeo = (
  event: Record<string, unknown>,
  slug: string,
  siteOrigin: string,
): ItemPrerenderSeo => {
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
  const ogSrc = imageSrc
  const ogImage = ogSrc ? resolveSocialOgImage(ogSrc, siteOrigin, { square: true }) : undefined
  return {
    title: clampMetaTitle(resolved.title),
    description: clampMetaDescription(resolved.description),
    ogImage: ogImage?.url,
    ogImageWidth: ogImage?.width,
    ogImageHeight: ogImage?.height,
  }
}

const buildProgramSeo = (
  program: Record<string, unknown>,
  slug: string,
  pathname: string,
  siteOrigin: string,
): ItemPrerenderSeo => {
  const routeSeo = getSeoForPathname(pathname)
  const routeTitle = routeSeo.title.replace(/ — Rellia Health$/, "").trim()
  const resolved = resolveProgramCollectionSeo({
    title: typeof program.title === "string" ? program.title : routeTitle || undefined,
    heroTitle: typeof program.heroTitle === "string" ? program.heroTitle : undefined,
    description: typeof program.description === "string" ? program.description : undefined,
    heroDescription:
      typeof program.heroDescription === "string" ? program.heroDescription : undefined,
    seo: (program.seo as SeoContent | null | undefined) ?? null,
    imageSrc: typeof program.imageSrc === "string" ? program.imageSrc : undefined,
  })
  const social = resolveProgramSocialMeta(
    {
      title: typeof program.title === "string" ? program.title : routeTitle || undefined,
      heroTitle: typeof program.heroTitle === "string" ? program.heroTitle : undefined,
      description: typeof program.description === "string" ? program.description : undefined,
      heroDescription:
        typeof program.heroDescription === "string" ? program.heroDescription : undefined,
      imageSrc: typeof program.imageSrc === "string" ? program.imageSrc : undefined,
      slug,
    },
    siteOrigin,
  )
  const ogSrc = resolved.ogImageUrl || social.ogImage?.url
  const ogImage = ogSrc
    ? resolveSocialOgImage(ogSrc, siteOrigin, { square: true }) ?? social.ogImage
    : social.ogImage
  return {
    title: clampMetaTitle(resolved.title),
    description: clampMetaDescription(resolved.description),
    ogImage: ogImage?.url,
    ogImageWidth: ogImage?.width,
    ogImageHeight: ogImage?.height,
  }
}

const buildCareersRoleSeo = (
  role: {
    title?: string
    location?: string
    employmentType?: string
    description?: unknown
    responsibilities?: string[]
  },
  heroImageSrc?: string,
): ItemPrerenderSeo => {
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
  const resolved = buildCareersRoleShareMeta(shareRole, { heroImageSrc })
  const ogSrc = resolved.ogImageUrl?.trim() || "/images/careers-img.jpg"
  const ogImage = resolveSocialOgImage(ogSrc, getSiteUrl(), { landscape: true })
  return {
    title: clampMetaTitle(resolved.title),
    description: clampMetaDescription(resolved.description),
    ogImage: ogImage?.url,
    ogImageWidth: ogImage?.width,
    ogImageHeight: ogImage?.height,
  }
}

const buildStorySeo = (
  story: {
    title: string
    tag?: string
    excerpt?: string
    coverImageSrc?: string
    seo?: SeoContent | null
  },
  siteOrigin: string,
): ItemPrerenderSeo => {
  const resolved = resolveStoryCollectionSeo({
    title: story.title,
    tag: story.tag,
    excerpt: story.excerpt,
    seo: story.seo,
    coverImageSrc: story.coverImageSrc,
  })
  const ogSrc = story.coverImageSrc?.trim()
  const ogImage = ogSrc
    ? resolveSocialOgImage(ogSrc, siteOrigin, { landscape: true }) ??
      resolveShareOgImage(undefined, { landscape: true })
    : resolveShareOgImage(undefined, { landscape: true })
  return {
    title: clampMetaTitle(resolved.title),
    description: clampMetaDescription(resolved.description),
    ogImage: ogImage.url,
    ogImageWidth: ogImage.width,
    ogImageHeight: ogImage.height,
  }
}

const buildAdvisorProfileSeo = (
  advisor: Record<string, unknown>,
  siteOrigin: string,
): ItemPrerenderSeo => {
  const name = typeof advisor.name === "string" ? advisor.name : "Advisor"
  const description =
    (typeof advisor.snapshot === "string" ? advisor.snapshot : "") ||
    (typeof advisor.focus === "string" ? advisor.focus : "") ||
    "Advisor profile in the Rellia Health mentor directory."
  const photoSrc = typeof advisor.photoSrc === "string" ? advisor.photoSrc : undefined

  const ogImage = resolveShareOgImage(photoSrc, { square: true })
  return {
    title: buildAdvisorProfileSeoTitle(name),
    description: clampMetaDescription(description),
    ogImage: ogImage.url,
    ogImageWidth: ogImage.width,
    ogImageHeight: ogImage.height,
  }
}

const buildAlumniProfileSeo = (
  company: Record<string, unknown>,
  siteOrigin: string,
): ItemPrerenderSeo => {
  const name =
    (typeof company.logoName === "string" ? company.logoName : "") ||
    (typeof company.name === "string" ? company.name : "Alumni company")
  const description =
    (typeof company.shortDescription === "string" ? company.shortDescription : "") ||
    "Alumni company profile in the Rellia Health founder network."
  const logoSrc = typeof company.logoSrc === "string" ? company.logoSrc : undefined

  const ogImage = resolveShareOgImage(logoSrc)
  return {
    title: buildAlumniProfileSeoTitle(name),
    description: clampMetaDescription(description),
    ogImage: ogImage.url,
    ogImageWidth: ogImage.width,
    ogImageHeight: ogImage.height,
  }
}

const resolveItemPrerenderSeo = async (
  pathname: string,
  prefetched: {
    event?: Record<string, unknown> | null
    program?: Record<string, unknown> | null
    story?: Record<string, unknown> | null
    advisor?: Record<string, unknown> | null
    alumni?: Record<string, unknown> | null
    careersRole?: Record<string, unknown> | null
    careersPageHeroImageSrc?: string | null
  },
): Promise<ItemPrerenderSeo | null> => {
  const siteOrigin = getSiteUrl()

  if (pathname.startsWith("/careers/roles/")) {
    const roleId = parseCareersRoleIdFromPathname(pathname)
    if (!roleId) return null
    const role = prefetched.careersRole
    if (!role || typeof role.title !== "string") return null
    const careersHero =
      typeof prefetched.careersPageHeroImageSrc === "string"
        ? prefetched.careersPageHeroImageSrc
        : undefined
    return buildCareersRoleSeo(role, careersHero)
  }

  if (pathname.startsWith("/events/") && pathname !== "/events") {
    const slug = pathname.slice("/events/".length)
    const event =
      prefetched.event ??
      (() => {
        const match = findProgramsEventBySlug(slug, DEFAULT_PROGRAMS_LANDING)
        if (!match) return null
        const { _variant: _ignored, ...rest } = match
        return rest as Record<string, unknown>
      })()
    if (!event) return null
    return buildEventSeo(event, slug, siteOrigin)
  }

  if (pathname.startsWith("/programs/") && pathname !== "/programs") {
    const slug = pathname.slice("/programs/".length)
    const program =
      prefetched.program ?? defaultProgramRecordForSlug(slug)
    if (program) return buildProgramSeo(program, slug, pathname, siteOrigin)
    const routeSeo = getSeoForPathname(pathname)
    if (routeSeo.title !== "Page not found — Rellia Health") {
      return {
        title: routeSeo.title,
        description: routeSeo.description,
        ogImage: undefined,
      }
    }
    return null
  }

  if (pathname.startsWith("/stories/") && pathname !== "/stories") {
    const slug = pathname.slice("/stories/".length)
    const cms = prefetched.story
    if (cms && typeof cms.title === "string") {
      return buildStorySeo(
        {
          title: cms.title,
          tag: typeof cms.tag === "string" ? cms.tag : undefined,
          excerpt: typeof cms.excerpt === "string" ? cms.excerpt : undefined,
          coverImageSrc: typeof cms.coverImageSrc === "string" ? cms.coverImageSrc : undefined,
          seo: (cms as { seo?: SeoContent | null }).seo,
        },
        siteOrigin,
      )
    }
    const local = getStoryBySlug(slug)
    if (local) {
      return buildStorySeo(
        {
          title: local.title,
          tag: local.tag,
          excerpt: local.excerpt,
          coverImageSrc: local.coverImageSrc,
        },
        siteOrigin,
      )
    }
    return null
  }

  if (pathname.startsWith("/advisors/directory/") && pathname !== "/advisors/directory") {
    const id = pathname.slice("/advisors/directory/".length)
    const advisor =
      prefetched.advisor ??
      ADVISOR_DIRECTORY_SEED.find((entry) => entry.id === id) ??
      null
    if (!advisor) return null
    return buildAdvisorProfileSeo(advisor as Record<string, unknown>, siteOrigin)
  }

  if (pathname.startsWith("/founders/alumni/") && pathname !== "/founders/alumni") {
    const id = pathname.slice("/founders/alumni/".length)
    const company =
      prefetched.alumni ??
      FOUNDER_DIRECTORY.find((entry) => entry.id === id) ??
      null
    if (!company) return null
    return buildAlumniProfileSeo(company as Record<string, unknown>, siteOrigin)
  }

  return null
}

const appendSocialMeta = (
  headElements: Set<string>,
  seo: ItemPrerenderSeo,
  pageUrl: string,
) => {
  headElements.add(`<meta name="theme-color" content="${RELLIA_SOCIAL_THEME_COLOR}" />`)
  headElements.add(`<meta property="og:type" content="website" />`)
  headElements.add(`<meta property="og:site_name" content="Rellia Health" />`)
  headElements.add(`<meta property="og:locale" content="en_US" />`)
  headElements.add(`<meta property="og:title" content="${escapeMetaAttr(seo.title)}" />`)
  headElements.add(
    `<meta property="og:description" content="${escapeMetaAttr(seo.description)}" />`,
  )
  headElements.add(`<meta property="og:url" content="${escapeMetaAttr(pageUrl)}" />`)
  headElements.add(`<meta name="description" content="${escapeMetaAttr(seo.description)}" />`)
  headElements.add(`<meta name="twitter:title" content="${escapeMetaAttr(seo.title)}" />`)
  headElements.add(
    `<meta name="twitter:description" content="${escapeMetaAttr(seo.description)}" />`,
  )
  if (seo.ogImage) {
    headElements.add(`<meta property="og:image" content="${escapeMetaAttr(seo.ogImage)}" />`)
    if (typeof seo.ogImageWidth === "number" && typeof seo.ogImageHeight === "number") {
      headElements.add(`<meta property="og:image:width" content="${seo.ogImageWidth}" />`)
      headElements.add(`<meta property="og:image:height" content="${seo.ogImageHeight}" />`)
    }
    headElements.add(`<meta name="twitter:card" content="summary_large_image" />`)
    headElements.add(`<meta name="twitter:image" content="${escapeMetaAttr(seo.ogImage)}" />`)
  } else {
    headElements.add(`<meta name="twitter:card" content="summary" />`)
  }
}

const filterDiscoveredLinks = (links: Set<string> | string[]): Set<string> => {
  const filtered = new Set<string>()
  for (const link of links) {
    try {
      const path = normalizePathname(new URL(link, "http://localhost").pathname)
      if (isClientOnlyAuthPath(path)) continue
      filtered.add(link)
    } catch {
      filtered.add(link)
    }
  }
  return filtered
}

export const prerender = async (data: { url: string }) => {
  const { parseLinks } = await import("vite-prerender-plugin/parse")
  const helmetContext: { helmet?: HelmetServerState | null } = {}

  const pathname = normalizePathname(new URL(data.url, "http://localhost").pathname)

  if (isClientOnlyAuthPath(pathname)) {
    const routeSeo = getSeoForPathname(pathname)
    const adminOg = getAdminOgImage()
    const pageUrl = `${getSiteUrl()}${pathname === "/" ? "" : pathname}`
    const headElements = new Set<string>([
      `<meta name="robots" content="noindex, nofollow" />`,
    ])
    appendSocialMeta(
      headElements,
      {
        title: routeSeo.title,
        description: routeSeo.description,
        ogImage: adminOg?.url,
        ogImageWidth: adminOg?.width,
        ogImageHeight: adminOg?.height,
      },
      pageUrl,
    )
    return {
      html: "",
      links: new Set<string>(),
      head: {
        lang: "en",
        title: routeSeo.title,
        elements: headElements,
      },
    }
  }

  const siteOrigin = getSiteUrl()
  const pageUrl = `${siteOrigin}${pathname === "/" ? "" : pathname}`

  prerenderQueryClient.clear()

  const prefetchMeta = await prefetchCmsQueriesForPathname(prerenderQueryClient, pathname)

  const prefetched: {
    event?: Record<string, unknown> | null
    program?: Record<string, unknown> | null
    story?: Record<string, unknown> | null
    advisor?: Record<string, unknown> | null
    alumni?: Record<string, unknown> | null
    careersRole?: Record<string, unknown> | null
    careersPageHeroImageSrc?: string | null
  } = {
    careersRole: prefetchMeta.careersRole ?? null,
    careersPageHeroImageSrc: prefetchMeta.careersPageHeroImageSrc ?? null,
  }

  if (pathname.startsWith("/events/") && pathname !== "/events") {
    const slug = pathname.slice("/events/".length)
    prefetched.event =
      (prerenderQueryClient.getQueryData(["cms", "event", slug]) as
        | Record<string, unknown>
        | undefined) ?? null
  }

  if (pathname.startsWith("/programs/") && pathname !== "/programs") {
    const slug = pathname.slice("/programs/".length)
    prefetched.program =
      (prerenderQueryClient.getQueryData(["cms", "program", slug]) as
        | Record<string, unknown>
        | undefined) ?? null
  }

  if (pathname.startsWith("/stories/") && pathname !== "/stories") {
    const slug = pathname.slice("/stories/".length)
    prefetched.story =
      (prerenderQueryClient.getQueryData(["cms", "story", slug]) as
        | Record<string, unknown>
        | undefined) ?? null
  }

  if (pathname.startsWith("/advisors/directory/") && pathname !== "/advisors/directory") {
    const id = pathname.slice("/advisors/directory/".length)
    const advisors =
      (prerenderQueryClient.getQueryData(["cms", "advisors"]) as Record<string, unknown>[]) ?? []
    prefetched.advisor =
      advisors.find((entry) => String(entry.id ?? "") === id) ??
      (ADVISOR_DIRECTORY_SEED.find((entry) => entry.id === id) as
        | Record<string, unknown>
        | undefined) ??
      null
  }

  if (pathname.startsWith("/founders/alumni/") && pathname !== "/founders/alumni") {
    const id = pathname.slice("/founders/alumni/".length)
    const companies =
      (prerenderQueryClient.getQueryData(["cms", "alumniCompanies"]) as Record<string, unknown>[]) ??
      []
    prefetched.alumni =
      companies.find((entry) => String(entry.id ?? "") === id) ??
      (FOUNDER_DIRECTORY.find((entry) => entry.id === id) as Record<string, unknown> | undefined) ??
      null
  }

  let cmsPageInitialSeo: PageSeoOverrides | undefined
  const cmsPageSlug = getSingleSegmentSlug(pathname)
  if (cmsPageSlug && !RESERVED_FIRST_SEGMENTS.has(cmsPageSlug.toLowerCase())) {
    const page = mergeCmsPageContent(await fetchPageBySlugForPrerender(cmsPageSlug))
    if (page) {
      prerenderQueryClient.setQueryData(["cms", "page", cmsPageSlug], page)
      cmsPageInitialSeo = mergePageSeo(page.seo, {
        title: page.seo?.metaTitle?.trim()
          ? undefined
          : page.title
            ? `${page.title} — Rellia Health`
            : undefined,
        noIndex: typeof page.seo?.noIndex === "boolean" ? undefined : false,
      })
    } else {
      prerenderQueryClient.setQueryData(["cms", "page", cmsPageSlug], null)
    }
  }

  const itemSeo = isItemDetailPath(pathname)
    ? await resolveItemPrerenderSeo(pathname, prefetched)
    : null
  const routeSeo = getSeoForPathname(pathname)

  const app = (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={prerenderQueryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <StaticRouter location={data.url}>
            <RouterShell initialPageSeo={cmsPageInitialSeo}>
              <AppRoutes />
            </RouterShell>
          </StaticRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )

  const html = renderToString(app)
  const links = filterDiscoveredLinks(parseLinks(html))

  const dehydratedCmsState = dehydrate(prerenderQueryClient)

  const headElements = new Set<string>()
  const helmet = helmetContext.helmet

  headElements.add(
    `<script id="${CMS_QUERY_STATE_SCRIPT_ID}" type="application/json">${serializeDehydratedCmsQueryState(dehydratedCmsState)}</script>`,
  )

  if (itemSeo) {
    appendSocialMeta(headElements, itemSeo, pageUrl)
  }

  if (helmet) {
    const helmetChunks = itemSeo
      ? [helmet.link.toString(), helmet.script.toString(), helmet.style.toString()]
      : [
          helmet.meta.toString(),
          helmet.link.toString(),
          helmet.script.toString(),
          helmet.style.toString(),
        ]
    const extra = helmetChunks.filter((s) => s && s.trim().length > 0)
    for (const chunk of extra) {
      headElements.add(chunk)
    }
  }

  const documentTitle =
    itemSeo?.title || helmetTitleText(helmet ?? undefined) || routeSeo.title

  return {
    html,
    links: new Set(links),
    head: {
      lang: "en",
      title: documentTitle,
      elements: headElements,
    },
  }
}
