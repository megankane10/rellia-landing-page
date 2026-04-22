import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router-dom/server"
import { HelmetProvider, type HelmetServerState } from "react-helmet-async"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { normalizePathname, getSeoForPathname } from "@/config/seo"
import { AppRoutes, RouterShell } from "./AppRoutes"

const prerenderQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

export const prerender = async (data: { url: string }) => {
  const { parseLinks } = await import("vite-prerender-plugin/parse")
  const helmetContext: { helmet?: HelmetServerState | null } = {}

  const pathname = normalizePathname(new URL(data.url, "http://localhost").pathname)
  const seo = getSeoForPathname(pathname)

  const app = (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={prerenderQueryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <StaticRouter location={data.url}>
            <RouterShell>
              <AppRoutes />
            </RouterShell>
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
      title: seo.title,
      elements: headElements,
    },
  }
}
