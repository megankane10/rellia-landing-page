import { useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import ScrollToTop from "@/components/ScrollToTop"
import RouteSeo from "@/components/RouteSeo"
import Index from "./pages/Index"
import About from "./pages/About"
import FAQ from "./pages/FAQ"
import ProgramsEvents from "./pages/ProgramsEvents"
import ProgramsQms from "./pages/ProgramsQms"
import NotFound from "./pages/NotFound"
import Contact from "./pages/Contact"
import Network from "./pages/Network"
import DiagnosticLanding from "./pages/DiagnosticLanding"
import DiagnosticSurvey from "./pages/DiagnosticSurvey"
import Payment from "./pages/Payment"
import TermsofUse from "./pages/TermsofUse"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import ProgramsLayout from "./pages/programs/ProgramsLayout"
import PlaceholderPage from "./pages/PlaceholderPage"



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

    ensurePreconnect("https://js-na3.hsforms.net")
    ensurePreconnect("https://js.hsforms.net")
    ensurePreconnect("https://server.fillout.com")

    const ensureScript = (src: string) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
      if (existing) return
      const script = document.createElement("script")
      script.src = src
      script.async = true
      document.body.appendChild(script)
    }

    // HubSpot embed script used on Contact page
    ensureScript("https://js-na3.hsforms.net/forms/embed/342926478.js")
    // Fillout embed script used on Network modals
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
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteSeo />
        <VercelObservability />
        <ThirdPartyPreloads />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Main Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/programs" element={<ProgramsLayout />}>
            <Route index element={<ProgramsEvents />} />
            <Route path="qms" element={<ProgramsQms />} />
          </Route>

          {/* Network — unified audience hub (founders / investors / advisors / partners) */}
          <Route path="/network" element={<Network />} />

          {/* Misc */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/membership" element={<Payment />} />
          <Route path="/diagnostics" element={<PlaceholderPage title="Diagnostics" />} />
          <Route
            path="/diagnosticSurvey"
            element={<PlaceholderPage title="Diagnostic survey" subtitle="This experience is coming soon." />}
          />

          {/* Legal */}
          <Route path="/terms" element={<TermsofUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Diagnostics — full flows on Additions (still under development) */}
          <Route path="/diagnostics" element={<DiagnosticLanding />} />
          <Route path="/diagnosticSurvey" element={<DiagnosticSurvey />} />

          {/* CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
