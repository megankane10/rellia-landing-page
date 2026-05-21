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
  getSiteUrl,
  isItemDetailPath,
  normalizePathname,
  resolveSocialOgImageUrl,
} from "@/config/seo"
import { AppRoutes, RouterShell } from "./AppRoutes"
import { PageSeoProvider } from "@/context/PageSeoContext"
import { DEFAULT_PROGRAMS_LANDING } from "@shared/cms/defaults"
import { findProgramsEventBySlug } from "@shared/cms/eventSlug"
import {
  getProgramsEventDisplayDateTime,
  getProgramsEventLocationLabel,
  shortenProgramsEventDateTime,
} from "@shared/cms/programsEventDisplay"
import { resolveEventHeaderImageSrc } from "@shared/cms/eventHeaderImage"
import {
  fetchEventBySlugForPrerender,
  fetchProgramBySlugForPrerender,
  fetchStoryBySlugForPrerender,
} from "@shared/cms/prerenderSanity"

const prerenderQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const helmetTitleText = (helmet: HelmetServerState | undefined): string | undefined => {
  const raw = helmet?.title?.toString()?.trim()
  if (!raw) return undefined
  return raw.replace(/<\/?title>/gi, "").trim() || undefined
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

const buildEventSeo = (
  event: Record<string, unknown>,
  slug: string,
  siteOrigin: string,
): ItemPrerenderSeo => {
  const title = typeof event.title === "string" ? event.title : "Event"
  const computedDateTime = getProgramsEventDisplayDateTime(event as never)
  const shortDateTime = shortenProgramsEventDateTime(computedDateTime)
  const locationLabel = getProgramsEventLocationLabel(event as never)
  const cmsImageSrc = typeof event.imageSrc === "string" ? event.imageSrc : undefined
  const imageSrc = resolveEventHeaderImageSrc(slug, cmsImageSrc) ?? cmsImageSrc

  return {
    title: clampMetaTitle(`${title} — Rellia Health`),
    description: clampMetaDescription(
      `${title}. ${shortDateTime || computedDateTime}. ${locationLabel}.`,
    ),
    ogImage: resolveSocialOgImageUrl(imageSrc, siteOrigin),
  }
}

const buildProgramSeo = (
  program: Record<string, unknown>,
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
  const imageSrc = typeof program.imageSrc === "string" ? program.imageSrc : undefined

  return {
    title: clampMetaTitle(`${title} — Rellia Health`),
    description: clampMetaDescription(description),
    ogImage: resolveSocialOgImageUrl(imageSrc, siteOrigin),
  }
}

const buildStorySeo = (
  story: { title: string; excerpt?: string; coverImageSrc?: string },
  siteOrigin: string,
): ItemPrerenderSeo => ({
  title: clampMetaTitle(`${story.title} — Rellia Health`),
  description: clampMetaDescription(
    story.excerpt?.trim() || "Stories and insights from Rellia Health.",
  ),
  ogImage: story.coverImageSrc?.trim()
    ? resolveSocialOgImageUrl(story.coverImageSrc, siteOrigin)
    : undefined,
})

const resolveItemPrerenderSeo = async (
  pathname: string,
  prefetched: {
    event?: Record<string, unknown> | null
    program?: Record<string, unknown> | null
    story?: Record<string, unknown> | null
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
    const program = prefetched.program
    if (program) return buildProgramSeo(program, pathname, siteOrigin)
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
          excerpt: typeof cms.excerpt === "string" ? cms.excerpt : undefined,
          coverImageSrc: typeof cms.coverImageSrc === "string" ? cms.coverImageSrc : undefined,
        },
        siteOrigin,
      )
    }
    const local = getStoryBySlug(slug)
    if (local) {
      return buildStorySeo(
        {
          title: local.title,
          excerpt: local.excerpt,
          coverImageSrc: local.coverImageSrc,
        },
        siteOrigin,
      )
    }
    return null
  }

  return null
}

const appendSocialMeta = (
  headElements: Set<string>,
  seo: ItemPrerenderSeo,
  pageUrl: string,
) => {
  headElements.add(`<meta property="og:type" content="website" />`)
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
    headElements.add(`<meta name="twitter:card" content="summary_large_image" />`)
    headElements.add(`<meta name="twitter:image" content="${escapeMetaAttr(seo.ogImage)}" />`)
  } else {
    headElements.add(`<meta name="twitter:card" content="summary" />`)
  }
}

export const prerender = async (data: { url: string }) => {
  const { parseLinks } = await import("vite-prerender-plugin/parse")
  const helmetContext: { helmet?: HelmetServerState | null } = {}

  const pathname = normalizePathname(new URL(data.url, "http://localhost").pathname)
  const siteOrigin = getSiteUrl()
  const pageUrl = `${siteOrigin}${pathname === "/" ? "" : pathname}`

  const prefetched: {
    event?: Record<string, unknown> | null
    program?: Record<string, unknown> | null
    story?: Record<string, unknown> | null
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
  const links = parseLinks(html)

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
