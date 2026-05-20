import { lazy, Suspense, useEffect, type ReactNode } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import ScrollToTop from "@/components/ScrollToTop"
import RouteSeo from "@/components/RouteSeo"
import PageTransition from "@/components/PageTransition"
import RouteSuspenseFallback from "@/components/RouteSuspenseFallback"

/** Home stays eager for fastest first paint / LCP on `/`. */
import Index from "./pages/Index"

const About = lazy(() => import("./pages/About"))
const FAQ = lazy(() => import("./pages/FAQ"))
const Careers = lazy(() => import("./pages/CareersCms"))
const Programs = lazy(() => import("./pages/Programs"))
const ProgramsQms = lazy(() => import("./pages/ProgramsQms"))
const ProgramsIgnitePitch = lazy(() => import("./pages/programs/ProgramsIgnitePitch"))
const ProgramsAdvanceDataroom = lazy(() => import("./pages/programs/ProgramsAdvanceDataroom"))
const ProgramsElevateCapital = lazy(() => import("./pages/programs/ProgramsElevateCapital"))
const ProgramsFirst50Users = lazy(() => import("./pages/programs/ProgramsFirst50Users"))
const ProgramsPrototypeLab = lazy(() => import("./pages/programs/ProgramsPrototypeLab"))
const ProgramsAdvisoryBoard = lazy(() => import("./pages/programs/ProgramsAdvisoryBoard"))
const ProgramsBrandStrategy = lazy(() => import("./pages/programs/ProgramsBrandStrategy"))
const ProgramsRegulatoryRoadmap = lazy(() => import("./pages/programs/ProgramsRegulatoryRoadmap"))
const Events = lazy(() => import("./pages/Events"))
const EventDetail = lazy(() => import("./pages/EventDetail"))
const Contact = lazy(() => import("./pages/Contact"))
const Apply = lazy(() => import("./pages/Apply"))
const Network = lazy(() => import("./pages/Network"))
const Founders = lazy(() => import("./pages/network/Founders"))
const Advisors = lazy(() => import("./pages/network/Advisors"))
const Investors = lazy(() => import("./pages/network/Investors"))
const Partners = lazy(() => import("./pages/network/Partners"))
const DiagnosticLanding = lazy(() => import("./pages/DiagnosticLanding"))
const DiagnosticSurvey = lazy(() => import("./pages/DiagnosticSurvey"))
const Payment = lazy(() => import("./pages/Payment"))
const ProgramsLayout = lazy(() => import("./pages/programs/ProgramsLayout"))
const Stories = lazy(() => import("./pages/Stories"))
const StoryPost = lazy(() => import("./pages/StoryPost"))
const Consulting = lazy(() => import("./pages/Consulting"))
const FoundersDirectory = lazy(() => import("./pages/network/FoundersDirectory"))
const FounderProfile = lazy(() => import("./pages/network/FounderProfile"))
const AdvisorsDirectory = lazy(() => import("./pages/network/AdvisorsDirectory"))
const AdvisorProfile = lazy(() => import("./pages/network/AdvisorProfile"))
const TermsofUse = lazy(() => import("./pages/TermsofUse"))
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"))
const CmsCatchAll = lazy(() => import("./pages/CmsCatchAll"))
const StudioRedirect = lazy(() => import("./pages/StudioRedirect"))
const PlaceholderPage = lazy(() => import("./pages/PlaceholderPage"))
const IndustryPartnersDirectory = lazy(() => import("./pages/IndustryPartnersDirectory"))
import { isProductionHostname } from "@/lib/sanity"

/** 
 * Gating logic:
 * - main (production): Show placeholder pages (Coming Soon).
 * - additions (dev/preview): Show all pages like originally.
 */
const showPlaceholder = isProductionHostname()

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
    ensurePreconnect("https://embed.fillout.com")
  }, [])

  return null
}

const VercelObservability = () => (
  <>
    <Analytics />
    <SpeedInsights />
  </>
)

export const RouterShell = ({ children }: { children: ReactNode }) => (
  <>
    <PageTransition />
    <RouteSeo />
    <VercelObservability />
    <ThirdPartyPreloads />
    <ScrollToTop />
    {children}
  </>
)

export const AppRoutes = () => (
  <Suspense fallback={<RouteSuspenseFallback />}>
    <Routes>
      <Route path="/" element={<Index />} />

      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/careers" element={<Careers />} />
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
        <Route path="regulatory-strategy-sprint" element={<ProgramsRegulatoryRoadmap />} />
        <Route path="regulatory-roadmap" element={<Navigate to="/programs/regulatory-strategy-sprint" replace />} />
      </Route>

      <Route path="/network" element={<Network />} />
      <Route path="/apply" element={<Apply />} />
      <Route path="/consulting" element={<Consulting />} />
      <Route path="/founders" element={<Founders />} />
      <Route path="/founders/alumni" element={<FoundersDirectory />} />
      <Route path="/founders/alumni/:id" element={<FounderProfile />} />
      <Route path="/advisors" element={<Advisors />} />
      <Route path="/advisors/directory" element={<AdvisorsDirectory />} />
      <Route path="/advisors/directory/:id" element={<AdvisorProfile />} />
      <Route path="/investors" element={<Investors />} />
      <Route path="/industry-partners" element={<Partners />} />
      <Route path="/partners" element={<Navigate to="/industry-partners" replace />} />

      <Route path="/contact" element={<Contact />} />
      <Route path="/membership" element={<Payment />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/stories/:slug" element={<StoryPost />} />

      <Route path="/terms" element={<TermsofUse />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/policy" element={<Navigate to="/privacy" replace />} />

      <Route path="/industry-partners/directory" element={<IndustryPartnersDirectory />} />

      <Route path="/diagnostics" element={<DiagnosticLanding />} />
      <Route path="/diagnostic-survey" element={showPlaceholder ? <PlaceholderPage title="Diagnostic Survey" subtitle="Coming Soon" /> : <DiagnosticSurvey />} />
      <Route path="/survey" element={<Navigate to="/diagnostic-survey" replace />} />

      <Route path="/studio" element={<StudioRedirect />} />

      <Route path="*" element={<CmsCatchAll />} />
    </Routes>
  </Suspense>
)
