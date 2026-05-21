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
  normalizePathname,
  toAbsoluteOgImageUrl,
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

const seoForPrerenderPath = (pathname: string) => {
  const base = getSeoForPathname(pathname)
  if (!pathname.startsWith("/events/") || pathname === "/events") return base

  const slug = pathname.slice("/events/".length)
  const match = findProgramsEventBySlug(slug, DEFAULT_PROGRAMS_LANDING)
  if (!match) return base

  const { _variant: _ignored, ...event } = match
  const computedDateTime = getProgramsEventDisplayDateTime(event)
  const shortDateTime = shortenProgramsEventDateTime(computedDateTime)
  const locationLabel = getProgramsEventLocationLabel(event)

  return {
    ...base,
    title: clampMetaTitle(`${event.title} — Rellia Health`),
    description: clampMetaDescription(
      `${event.title}. ${shortDateTime || computedDateTime}. ${locationLabel}.`,
    ),
    ogImage: event.imageSrc ? toAbsoluteOgImageUrl(event.imageSrc) : undefined,
  }
}

export const prerender = async (data: { url: string }) => {
  const { parseLinks } = await import("vite-prerender-plugin/parse")
  const helmetContext: { helmet?: HelmetServerState | null } = {}

  const pathname = normalizePathname(new URL(data.url, "http://localhost").pathname)
  const seo = seoForPrerenderPath(pathname)

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

  return {
    html,
    links: new Set(links),
    head: {
      lang: "en",
      title: seo.title || helmetTitleText(helmet ?? undefined),
      elements: headElements,
    },
  }
}
