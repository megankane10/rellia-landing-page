import { useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import ScrollToTop from "@/components/ScrollToTop"
import RouteSeo from "@/components/RouteSeo"
import { AppRoutes, RouterShell } from "./AppRoutes"
import { AuthProvider } from "@/context/AuthContext"
import { VisualEditingOverlay } from "@/components/sanity/VisualEditingOverlay"



const queryClient = new QueryClient()

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

/** Auto-tracked SPA views; avoid manual route/path props (can mis-track or error on some paths). */
const VercelObservability = () => (
  <>
    <Analytics />
    <SpeedInsights />
  </>
)

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <RouterShell>
              <AppRoutes />
              <VisualEditingOverlay />
            </RouterShell>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
)

export default App
