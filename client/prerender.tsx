import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router-dom/server"
import { HelmetProvider, type HelmetServerState } from "react-helmet-async"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getStoryBySlug } from "@/content/stories"
import {
  clampMetaDescription,
  clampMetaTitle,
  getSeoForPathname,
  getDefaultOgImageUrl,
  getSiteUrl,
  isClientOnlyAuthPath,
  isItemDetailPath,
  normalizePathname,
  resolveShareOgImageUrl,
  resolveSocialOgImageUrl,
  buildAdvisorProfileSeoTitle,
  buildAlumniProfileSeoTitle,
} from "@/config/seo"
import { ADVISOR_DIRECTORY_SEED } from "@/data/advisorDirectory"
import { FOUNDER_DIRECTORY } from "@/data/founderDirectory"
import { AppRoutes, RouterShell } from "./AppRoutes"
import { PageSeoProvider } from "@/context/PageSeoContext"
import { DEFAULT_PROGRAMS_LANDING } from "@shared/cms/defaults"
import { buildDefaultStorySeoTitle } from "@shared/cms/storySeo"
import { findProgramsEventBySlug } from "@shared/cms/eventSlug"
import {
  getProgramsEventDisplayDateTime,
  getProgramsEventLocationLabel,
  shortenProgramsEventDateTime,
} from "@shared/cms/programsEventDisplay"
import {
  defaultProgramRecordForSlug,
  resolveEventCardImageSrc,
  resolveProgramCardImageSrc,
} from "@shared/cms/itemCardImage"
import {
  fetchAdvisorsForPrerender,
  fetchAlumniCompaniesForPrerender,
  fetchDirectoryFilterGroupsForPrerender,
  fetchEventBySlugForPrerender,
  fetchEventsForPrerender,
  fetchPageBySlugForPrerender,
  fetchProgramBySlugForPrerender,
  fetchStoryBySlugForPrerender,
  fetchPaymentPageForPrerender,
  fetchProgramsLandingForPrerender,
  fetchProgramsForPrerender,
} from "@shared/cms/prerenderSanity"

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
    queries: { retry: false },
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
}

function portableTextToPlainText(blocks: any): string {
  if (!blocks) return ""
  if (typeof blocks === "string") return blocks
  if (!Array.isArray(blocks)) return ""
  return blocks
    .map((block) => {
      if (!block || typeof block !== "object") return ""
      if (block.children && Array.isArray(block.children)) {
        return block.children.map((child: any) => (child && typeof child === "object" ? child.text || "" : "")).join("")
      }
      return ""
    })
    .filter(Boolean)
    .join(" ")
}

const buildEventSeo = (
  event: Record<string, unknown>,
  slug: string,
  siteOrigin: string,
): ItemPrerenderSeo => {
  const title = typeof event.title === "string" ? event.title : "Event"
  const computedDateTime = getProgramsEventDisplayDateTime(event as never)
  const shortDateTime = shortenProgramsEventDateTime(computedDateTime)
  const cmsImageSrc = typeof event.imageSrc === "string" ? event.imageSrc : undefined
  const imageSrc = resolveEventCardImageSrc(slug, cmsImageSrc)

  const descText = (() => {
    if (event.eventDescription) {
      if (typeof event.eventDescription === "string") return event.eventDescription
      if (Array.isArray(event.eventDescription)) {
        const text = portableTextToPlainText(event.eventDescription)
        if (text.trim()) return text.trim()
      }
    }
    if (event.detailBody) {
      if (typeof event.detailBody === "string") return event.detailBody
      if (Array.isArray(event.detailBody)) {
        const text = portableTextToPlainText(event.detailBody)
        if (text.trim()) return text.trim()
      }
    }
    return ""
  })()

  const eventDate = shortDateTime || computedDateTime
  const finalDesc = descText
    ? `${eventDate} · ${descText}`
    : eventDate

  return {
    title: clampMetaTitle(title),
    description: clampMetaDescription(finalDesc),
    ogImage: imageSrc
      ? resolveSocialOgImageUrl(imageSrc, siteOrigin, { square: true })
      : undefined,
  }
}

const buildProgramSeo = (
  program: Record<string, unknown>,
  slug: string,
  pathname: string,
  siteOrigin: string,
): ItemPrerenderSeo => {
  const title =
    (typeof program.title === "string" ? program.title : "") ||
    getSeoForPathname(pathname).title.replace(/ — Rellia Health$/, "")
  const description =
    (typeof program.heroDescription === "string" ? program.heroDescription : "") ||
    (typeof program.description === "string" ? program.description : "") ||
    getSeoForPathname(pathname).description
  const cmsImageSrc = typeof program.imageSrc === "string" ? program.imageSrc : undefined
  const imageSrc = resolveProgramCardImageSrc(slug, cmsImageSrc)

  return {
    title: clampMetaTitle(`${title} — Rellia Health`),
    description: clampMetaDescription(description),
    ogImage: imageSrc
      ? resolveSocialOgImageUrl(imageSrc, siteOrigin, { square: true })
      : undefined,
  }
}

const buildStorySeo = (
  story: {
    title: string
    tag?: string
    excerpt?: string
    coverImageSrc?: string
    seo?: {
      metaTitle?: string
      ogTitle?: string
      metaDescription?: string
      ogDescription?: string
      ogImageUrl?: string
    } | null
  },
  siteOrigin: string,
): ItemPrerenderSeo => {
  const seo = story.seo
  const title = clampMetaTitle(
    seo?.metaTitle?.trim() ||
      seo?.ogTitle?.trim() ||
      buildDefaultStorySeoTitle(story.title, story.tag),
  )
  const description = clampMetaDescription(
    seo?.metaDescription?.trim() ||
      seo?.ogDescription?.trim() ||
      story.excerpt?.trim() ||
      "Stories and insights from Rellia Health.",
  )
  const ogSrc = seo?.ogImageUrl?.trim() || story.coverImageSrc?.trim()
  return {
    title,
    description,
    ogImage: ogSrc
      ? resolveSocialOgImageUrl(ogSrc, siteOrigin) ?? getDefaultOgImageUrl()
      : getDefaultOgImageUrl(),
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

  return {
    title: buildAdvisorProfileSeoTitle(name),
    description: clampMetaDescription(description),
    ogImage: resolveShareOgImageUrl(photoSrc),
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

  return {
    title: buildAlumniProfileSeoTitle(name),
    description: clampMetaDescription(description),
    ogImage: resolveShareOgImageUrl(logoSrc),
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
  },
): Promise<ItemPrerenderSeo | null> => {
  const siteOrigin = getSiteUrl()

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
          seo: (cms as { seo?: Record<string, unknown> | null }).seo as
            | {
                metaTitle?: string
                ogTitle?: string
                metaDescription?: string
                ogDescription?: string
                ogImageUrl?: string
              }
            | null
            | undefined,
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
    const isStory = pageUrl.includes("/stories/")
    const height = isStory ? "630" : "1200"
    headElements.add(`<meta property="og:image" content="${escapeMetaAttr(seo.ogImage)}" />`)
    headElements.add(`<meta property="og:image:width" content="1200" />`)
    headElements.add(`<meta property="og:image:height" content="${height}" />`)
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
    return {
      html: "",
      links: new Set<string>(),
      head: {
        lang: "en",
        title: routeSeo.title,
        elements: new Set([
          `<meta name="description" content="${escapeMetaAttr(routeSeo.description)}" />`,
          `<meta name="robots" content="noindex, nofollow" />`,
        ]),
      },
    }
  }

  const siteOrigin = getSiteUrl()
  const pageUrl = `${siteOrigin}${pathname === "/" ? "" : pathname}`

  const prefetched: {
    event?: Record<string, unknown> | null
    program?: Record<string, unknown> | null
    story?: Record<string, unknown> | null
    advisor?: Record<string, unknown> | null
    alumni?: Record<string, unknown> | null
  } = {}

  if (pathname.startsWith("/events/") && pathname !== "/events") {
    const slug = pathname.slice("/events/".length)
    prefetched.event = await fetchEventBySlugForPrerender(slug)
    if (prefetched.event) {
      await prerenderQueryClient.prefetchQuery({
        queryKey: ["cms", "event", slug],
        queryFn: async () => prefetched.event,
      })
    }
  }

  if (pathname.startsWith("/programs/") && pathname !== "/programs") {
    const slug = pathname.slice("/programs/".length)
    prefetched.program = await fetchProgramBySlugForPrerender(slug)
    if (prefetched.program) {
      await prerenderQueryClient.prefetchQuery({
        queryKey: ["cms", "program", slug],
        queryFn: async () => prefetched.program,
      })
    }
  }

  if (pathname.startsWith("/stories/") && pathname !== "/stories") {
    const slug = pathname.slice("/stories/".length)
    prefetched.story = await fetchStoryBySlugForPrerender(slug)
    if (prefetched.story) {
      await prerenderQueryClient.prefetchQuery({
        queryKey: ["cms", "story", slug],
        queryFn: async () => prefetched.story,
      })
    }
  }

  if (pathname.startsWith("/advisors/directory/") && pathname !== "/advisors/directory") {
    const id = pathname.slice("/advisors/directory/".length)
    const advisors = await fetchAdvisorsForPrerender()
    prefetched.advisor =
      advisors.find((entry) => String(entry.id ?? "") === id) ??
      (ADVISOR_DIRECTORY_SEED.find((entry) => entry.id === id) as Record<string, unknown> | undefined) ??
      null
    await prerenderQueryClient.prefetchQuery({
      queryKey: ["cms", "advisors"],
      queryFn: async () => advisors,
    })
  }

  if (pathname.startsWith("/founders/alumni/") && pathname !== "/founders/alumni") {
    const id = pathname.slice("/founders/alumni/".length)
    const companies = await fetchAlumniCompaniesForPrerender()
    prefetched.alumni =
      companies.find((entry) => String(entry.id ?? "") === id) ??
      (FOUNDER_DIRECTORY.find((entry) => entry.id === id) as Record<string, unknown> | undefined) ??
      null
    await prerenderQueryClient.prefetchQuery({
      queryKey: ["cms", "alumniCompanies"],
      queryFn: async () => companies,
    })
  }

  if (pathname === "/events") {
    const events = await fetchEventsForPrerender()
    await prerenderQueryClient.prefetchQuery({
      queryKey: ["cms", "events"],
      queryFn: async () => events,
    })
  }

  if (pathname === "/advisors/directory") {
    const [advisors, filterGroups] = await Promise.all([
      fetchAdvisorsForPrerender(),
      fetchDirectoryFilterGroupsForPrerender(),
    ])
    await prerenderQueryClient.prefetchQuery({
      queryKey: ["cms", "advisors"],
      queryFn: async () => advisors,
    })
    await prerenderQueryClient.prefetchQuery({
      queryKey: ["cms", "directoryFilterGroups"],
      queryFn: async () => filterGroups,
    })
  }

  if (pathname === "/founders/alumni") {
    const [companies, filterGroups] = await Promise.all([
      fetchAlumniCompaniesForPrerender(),
      fetchDirectoryFilterGroupsForPrerender(),
    ])
    await prerenderQueryClient.prefetchQuery({
      queryKey: ["cms", "alumniCompanies"],
      queryFn: async () => companies,
    })
    await prerenderQueryClient.prefetchQuery({
      queryKey: ["cms", "directoryFilterGroups"],
      queryFn: async () => filterGroups,
    })
  }

  if (pathname === "/membership") {
    const paymentPage = await fetchPaymentPageForPrerender()
    await prerenderQueryClient.prefetchQuery({
      queryKey: ["cms", "paymentPage"],
      queryFn: async () => paymentPage,
    })
  }

  if (pathname === "/programs") {
    const [landing, list] = await Promise.all([
      fetchProgramsLandingForPrerender(),
      fetchProgramsForPrerender(),
    ])
    await prerenderQueryClient.prefetchQuery({
      queryKey: ["cms", "programsLanding"],
      queryFn: async () => landing,
    })
    await prerenderQueryClient.prefetchQuery({
      queryKey: ["cms", "programs"],
      queryFn: async () => list,
    })
  }

  const cmsPageSlug = getSingleSegmentSlug(pathname)
  if (cmsPageSlug && !RESERVED_FIRST_SEGMENTS.has(cmsPageSlug.toLowerCase())) {
    const page = await fetchPageBySlugForPrerender(cmsPageSlug)
    await prerenderQueryClient.prefetchQuery({
      queryKey: ["cms", "page", cmsPageSlug],
      queryFn: async () => page,
    })
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
            <PageSeoProvider>
              <RouterShell>
                <AppRoutes />
              </RouterShell>
            </PageSeoProvider>
          </StaticRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )

  const html = renderToString(app)
  const links = filterDiscoveredLinks(parseLinks(html))

  const headElements = new Set<string>()
  const helmet = helmetContext.helmet
  if (helmet) {
    const extra = [helmet.meta.toString(), helmet.link.toString(), helmet.script.toString(), helmet.style.toString()].filter(
      (s) => s && s.trim().length > 0,
    )
    for (const chunk of extra) {
      headElements.add(chunk)
    }
  }

  const documentTitle =
    itemSeo?.title || helmetTitleText(helmet ?? undefined) || routeSeo.title

  if (itemSeo) {
    appendSocialMeta(headElements, itemSeo, pageUrl)
  }

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
