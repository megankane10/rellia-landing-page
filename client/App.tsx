import { useEffect, useMemo } from "react"
import { ClientOnlyToasters } from "@/components/ClientOnlyToasters"
import { TooltipProvider } from "@/components/ui/tooltip"
import { HydrationBoundary, QueryClientProvider } from "@tanstack/react-query"
import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter } from "react-router-dom"
import ScrollToTop from "@/components/ScrollToTop"
import RouteSeo from "@/components/RouteSeo"
import { AppRoutes, RouterShell } from "./AppRoutes"
import { AuthProvider } from "@/context/AuthContext"
import { VisualEditingOverlay } from "@/components/sanity/VisualEditingOverlay"
import {
  createAppQueryClient,
  readDehydratedCmsQueryState,
} from "@/lib/cmsQueryHydration"

const queryClient = createAppQueryClient()
const dehydratedCmsState = readDehydratedCmsQueryState()

const ThirdPartyPreloads = () => {
  useEffect(() => {
    const ensurePreconnect = (href: string) => {
      const existing = document.querySelector<HTMLLinkElement>(`link[rel="preconnect"][href="${href}"]`)
      if (existing) return
      const link = document.createElement("link")
      link.rel = "preconnect"
      link.href = href
      document.head.appendChild(link)
    }

    ensurePreconnect("https://js.stripe.com")
    ensurePreconnect("https://server.fillout.com")

    const ensureScript = (src: string) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
      if (existing) return
      const script = document.createElement("script")
      script.src = src
      script.async = true
      document.body.appendChild(script)
    }

    // Fillout embed script used on program and careers flows
    ensureScript("https://server.fillout.com/embed/v1/")
  }, [])

  return null
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedCmsState}>
        <TooltipProvider>
          <ClientOnlyToasters />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
              <RouterShell>
                <AppRoutes />
                <VisualEditingOverlay />
              </RouterShell>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  </HelmetProvider>
)

export default App
