import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router-dom/server"
import { HelmetProvider, type HelmetServerState } from "react-helmet-async"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  clampMetaDescription,
  clampMetaTitle,
  getSeoForPathname,
  getSiteUrl,
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
import { fetchEventBySlugForPrerender } from "@shared/cms/prerenderSanity"

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

type PrerenderEventSeo = {
  title: string
  description: string
  ogImage?: string
}

const buildEventSeoFromRecord = (event: Record<string, unknown>): PrerenderEventSeo => {
  const title = typeof event.title === "string" ? event.title : "Event"
  const computedDateTime = getProgramsEventDisplayDateTime(event as never)
  const shortDateTime = shortenProgramsEventDateTime(computedDateTime)
  const locationLabel = getProgramsEventLocationLabel(event as never)
  const imageSrc = typeof event.imageSrc === "string" ? event.imageSrc : undefined
  const siteOrigin = getSiteUrl()

  return {
    title: clampMetaTitle(`${title} — Rellia Health`),
    description: clampMetaDescription(
      `${title}. ${shortDateTime || computedDateTime}. ${locationLabel}.`,
    ),
    ogImage: resolveSocialOgImageUrl(imageSrc, siteOrigin),
  }
}

const seoForPrerenderPath = (
  pathname: string,
  cmsEvent?: Record<string, unknown> | null,
): PrerenderEventSeo | ReturnType<typeof getSeoForPathname> => {
  const base = getSeoForPathname(pathname)
  if (!pathname.startsWith("/events/") || pathname === "/events") return base

  const slug = pathname.slice("/events/".length)
  const event =
    cmsEvent ??
    (() => {
      const match = findProgramsEventBySlug(slug, DEFAULT_PROGRAMS_LANDING)
      if (!match) return null
      const { _variant: _ignored, ...rest } = match
      return rest as Record<string, unknown>
    })()

  if (!event) return base
  return buildEventSeoFromRecord(event)
}

const appendSocialMeta = (
  headElements: Set<string>,
  seo: { title: string; description: string; ogImage?: string },
  pageUrl: string,
) => {
  headElements.add(`<meta property="og:title" content="${escapeMetaAttr(seo.title)}" />`)
  headElements.add(
    `<meta property="og:description" content="${escapeMetaAttr(seo.description)}" />`,
  )
  headElements.add(`<meta property="og:url" content="${escapeMetaAttr(pageUrl)}" />`)
  headElements.add(`<meta name="twitter:title" content="${escapeMetaAttr(seo.title)}" />`)
  headElements.add(
    `<meta name="twitter:description" content="${escapeMetaAttr(seo.description)}" />`,
  )
  if (seo.ogImage) {
    headElements.add(`<meta property="og:image" content="${escapeMetaAttr(seo.ogImage)}" />`)
    headElements.add(`<meta name="twitter:card" content="summary_large_image" />`)
    headElements.add(`<meta name="twitter:image" content="${escapeMetaAttr(seo.ogImage)}" />`)
  }
}

export const prerender = async (data: { url: string }) => {
  const { parseLinks } = await import("vite-prerender-plugin/parse")
  const helmetContext: { helmet?: HelmetServerState | null } = {}

  const pathname = normalizePathname(new URL(data.url, "http://localhost").pathname)
  const siteOrigin = getSiteUrl()
  const pageUrl = `${siteOrigin}${pathname === "/" ? "" : pathname}`

  let cmsEvent: Record<string, unknown> | null = null
  if (pathname.startsWith("/events/") && pathname !== "/events") {
    const slug = pathname.slice("/events/".length)
    cmsEvent = await fetchEventBySlugForPrerender(slug)
    if (cmsEvent) {
      await prerenderQueryClient.prefetchQuery({
        queryKey: ["cms", "event", slug],
        queryFn: async () => cmsEvent,
      })
    }
  }

  const seo = seoForPrerenderPath(pathname, cmsEvent)

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
    ("title" in seo ? seo.title : undefined) ||
    helmetTitleText(helmet ?? undefined) ||
    getSeoForPathname(pathname).title

  const helmetMeta = helmet?.meta?.toString() ?? ""
  if (pathname.startsWith("/events/") && pathname !== "/events" && "title" in seo) {
    const needsOgImage = Boolean(seo.ogImage) && !helmetMeta.includes('property="og:image"')
    const needsOgTitle = !helmetMeta.includes('property="og:title"')
    if (needsOgImage || needsOgTitle) {
      appendSocialMeta(headElements, seo, pageUrl)
    }
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
