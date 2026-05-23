import { useEffect, type ReactNode } from "react"
import { Routes, Route, Navigate, useParams } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import ScrollToTop from "@/components/ScrollToTop"
import RouteSeo from "@/components/RouteSeo"
import { PageSeoProvider } from "@/context/PageSeoContext"
import PageTransition from "@/components/PageTransition"
import Index from "./pages/Index"
import About from "./pages/About"
import FAQ from "./pages/FAQ"
import Careers from "./pages/CareersCms"
import Programs from "./pages/Programs"
import ProgramsQms from "./pages/ProgramsQms"
import ProgramsIgnitePitch from "./pages/programs/ProgramsIgnitePitch"
import ProgramsAdvanceDataroom from "./pages/programs/ProgramsAdvanceDataroom"
import ProgramsElevateCapital from "./pages/programs/ProgramsElevateCapital"
import ProgramsFirst50Users from "./pages/programs/ProgramsFirst50Users"
import ProgramsPrototypeLab from "./pages/programs/ProgramsPrototypeLab"
import ProgramsAdvisoryBoard from "./pages/programs/ProgramsAdvisoryBoard"
import ProgramsBrandStrategy from "./pages/programs/ProgramsBrandStrategy"
import ProgramsRegulatoryRoadmap from "./pages/programs/ProgramsRegulatoryRoadmap"
import Events from "./pages/Events"
import EventDetail from "./pages/EventDetail"
import Contact from "./pages/Contact"
import Apply from "./pages/Apply"
import Network from "./pages/Network"
import Founders from "./pages/network/Founders"
import Advisors from "./pages/network/Advisors"
import Investors from "./pages/network/Investors"
import Partners from "./pages/network/Partners"
import DiagnosticLanding from "./pages/DiagnosticLanding"
import DiagnosticSurvey from "./pages/DiagnosticSurvey"
import Payment from "./pages/Payment"
import ProgramsLayout from "./pages/programs/ProgramsLayout"
import Stories from "./pages/Stories"
import StoryPost from "./pages/StoryPost"
import Consulting from "./pages/Consulting"
import FoundersDirectory from "./pages/network/FoundersDirectory"
import FounderProfile from "./pages/network/FounderProfile"
import AdvisorsDirectory from "./pages/network/AdvisorsDirectory"
import AdvisorProfile from "./pages/network/AdvisorProfile"
import TermsofUse from "./pages/TermsofUse"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import CmsCatchAll from "./pages/CmsCatchAll"
import StudioRedirect from "./pages/StudioRedirect"
import IndustryPartnersDirectory from "./pages/IndustryPartnersDirectory"
import { ProtectedRoute } from "@/components/admin/ProtectedRoute"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminSignup from "./pages/admin/AdminSignup"
import AcceptInvite from "./pages/AcceptInvite"
import AdminShell from "./pages/admin/AdminShell"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminCompany from "./pages/admin/AdminCompany"
import AdminContactDetail from "./pages/admin/AdminContactDetail"

const RedirectFoundersDirectoryId = () => {
  const { id } = useParams<{ id: string }>()
  if (!id?.trim()) return <Navigate to="/founders/alumni" replace />
  return <Navigate to={`/founders/alumni/${encodeURIComponent(id)}`} replace />
}

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
    ensurePreconnect("https://fonts.googleapis.com")
    ensurePreconnect("https://fonts.gstatic.com")
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
  <PageSeoProvider>
    <PageTransition />
    <VercelObservability />
    <ThirdPartyPreloads />
    <ScrollToTop />
    {children}
    <RouteSeo />
  </PageSeoProvider>
)

export const AppRoutes = () => (
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
    <Route path="/founders/directory" element={<Navigate to="/founders/alumni" replace />} />
    <Route path="/founders/directory/:id" element={<RedirectFoundersDirectoryId />} />
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
    <Route path="/diagnostic-survey" element={<DiagnosticSurvey />} />
    <Route path="/survey" element={<Navigate to="/diagnostic-survey" replace />} />

    <Route path="/studio" element={<StudioRedirect />} />

    <Route path="/accept-invite" element={<AcceptInvite />} />

    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/signup" element={<AdminSignup />} />

    <Route path="/admin/dashboard" element={<Navigate to="/admin/overview" replace />} />
    <Route path="/admin/contacts" element={<Navigate to="/admin/submissions?tab=contact" replace />} />
    <Route path="/admin/diagnostics" element={<Navigate to="/admin/submissions?tab=diagnostic" replace />} />

    <Route path="/admin" element={<ProtectedRoute><AdminShell /></ProtectedRoute>}>
      <Route index element={<Navigate to="/admin/overview" replace />} />
      <Route path="contacts/:id" element={<AdminContactDetail />} />
      <Route path="companies/:id" element={<AdminCompany />} />
      <Route path="*" element={<AdminDashboard />} />
    </Route>

    <Route path="*" element={<CmsCatchAll />} />
  </Routes>
)
