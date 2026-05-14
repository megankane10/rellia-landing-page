import { lazy, Suspense, useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import ScrollToTop from "@/components/ScrollToTop"
import RouteSeo from "@/components/RouteSeo"
import Index from "./pages/Index"
import About from "./pages/About"
import FAQ from "./pages/FAQ"
import Events from "./pages/Events"
import NotFound from "./pages/NotFound"
import Contact from "./pages/Contact"
import Network from "./pages/Network"
import Payment from "./pages/Payment"
import TermsofUse from "./pages/TermsofUse"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import PlaceholderPage from "./pages/PlaceholderPage"

/* Programs & Events — lazy-loaded from Additions sync */
const Programs = lazy(() => import("./pages/Programs"))
const ProgramsQms = lazy(() => import("./pages/ProgramsQms"))
const ProgramsLayout = lazy(() => import("./pages/programs/ProgramsLayout"))
const ProgramsIgnitePitch = lazy(() => import("./pages/programs/ProgramsIgnitePitch"))
const ProgramsAdvanceDataroom = lazy(() => import("./pages/programs/ProgramsAdvanceDataroom"))
const ProgramsElevateCapital = lazy(() => import("./pages/programs/ProgramsElevateCapital"))
const ProgramsFirst50Users = lazy(() => import("./pages/programs/ProgramsFirst50Users"))
const ProgramsPrototypeLab = lazy(() => import("./pages/programs/ProgramsPrototypeLab"))
const ProgramsAdvisoryBoard = lazy(() => import("./pages/programs/ProgramsAdvisoryBoard"))
const ProgramsBrandStrategy = lazy(() => import("./pages/programs/ProgramsBrandStrategy"))
const ProgramsRegulatoryRoadmap = lazy(() => import("./pages/programs/ProgramsRegulatoryRoadmap"))
const EventDetail = lazy(() => import("./pages/EventDetail"))

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

    // Contact + Network load HubSpot Forms v2 via `hbspt.forms.create` when needed (SPA-safe).
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
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-rellia-teal border-t-transparent" /></div>}>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Main Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/programs" element={<ProgramsLayout />}>
              <Route index element={<Programs />} />
              <Route path="build-your-quality-management-system" element={<ProgramsQms />} />
              <Route path="build-your-qms" element={<Navigate to="/programs/build-your-quality-management-system" replace />} />
              <Route path="qms" element={<Navigate to="/programs/build-your-quality-management-system" replace />} />
              <Route path="ignite-pitch-foundations" element={<ProgramsIgnitePitch />} />
              <Route path="advance-data-room-deep-dive" element={<ProgramsAdvanceDataroom />} />
              <Route path="advance-data-room" element={<Navigate to="/programs/advance-data-room-deep-dive" replace />} />
              <Route path="elevate-healthcare-capital" element={<ProgramsElevateCapital />} />
              <Route path="first-50-users-clinical-feedback-intensive" element={<ProgramsFirst50Users />} />
              <Route path="first-50-users" element={<Navigate to="/programs/first-50-users-clinical-feedback-intensive" replace />} />
              <Route path="low-fidelity-prototype-lab" element={<ProgramsPrototypeLab />} />
              <Route path="prototype-lab" element={<Navigate to="/programs/low-fidelity-prototype-lab" replace />} />
              <Route path="advisory-board-match" element={<ProgramsAdvisoryBoard />} />
              <Route path="design-your-brand-strategy" element={<ProgramsBrandStrategy />} />
              <Route path="design-your-brand" element={<Navigate to="/programs/design-your-brand-strategy" replace />} />
              <Route path="regulatory-roadmap" element={<ProgramsRegulatoryRoadmap />} />
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

            {/* CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
