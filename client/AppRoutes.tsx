import { useEffect, type ReactNode } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import ScrollToTop from "@/components/ScrollToTop"
import RouteSeo from "@/components/RouteSeo"
import PageTransition from "@/components/PageTransition"
import Index from "./pages/Index"
import About from "./pages/About"
import FAQ from "./pages/FAQ"
import Careers from "./pages/CareersCms"
import ProgramsEvents from "./pages/ProgramsEvents"
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
import IndustryPartnersDirectory from "./pages/IndustryPartnersDirectory"
import Consulting from "./pages/Consulting"
import FoundersDirectory from "./pages/network/FoundersDirectory"
import FounderProfile from "./pages/network/FounderProfile"
import AdvisorsDirectory from "./pages/network/AdvisorsDirectory"
import AdvisorProfile from "./pages/network/AdvisorProfile"
import PlaceholderPage from "./pages/PlaceholderPage"
import CmsCatchAll from "./pages/CmsCatchAll"

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
  <Routes>
    <Route path="/" element={<Index />} />

    <Route path="/about" element={<About />} />
    <Route path="/faq" element={<FAQ />} />
    <Route path="/careers" element={<Careers />} />
    <Route path="/events" element={<Events />} />
    <Route path="/events/:slug" element={<EventDetail />} />
    <Route path="/programs" element={<ProgramsLayout />}>
      <Route index element={<ProgramsEvents />} />
      <Route path="build-your-qms" element={<ProgramsQms />} />
      <Route path="qms" element={<Navigate to="/programs/build-your-qms" replace />} />
      <Route path="ignite-pitch-foundations" element={<ProgramsIgnitePitch />} />
      <Route path="advance-data-room" element={<ProgramsAdvanceDataroom />} />
      <Route path="elevate-healthcare-capital" element={<ProgramsElevateCapital />} />
      <Route path="first-50-users" element={<ProgramsFirst50Users />} />
      <Route path="prototype-lab" element={<ProgramsPrototypeLab />} />
      <Route path="advisory-board-match" element={<ProgramsAdvisoryBoard />} />
      <Route path="design-your-brand" element={<ProgramsBrandStrategy />} />
      <Route path="regulatory-roadmap" element={<ProgramsRegulatoryRoadmap />} />
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

    {/* Dedicated role pages live at /founders, /advisors, /investors, /partners */}
    <Route path="/industry-partners/directory" element={<IndustryPartnersDirectory />} />

    <Route path="/diagnostics" element={<DiagnosticLanding />} />
    <Route path="/diagnostic-survey" element={<DiagnosticSurvey />} />
    <Route path="/survey" element={<Navigate to="/diagnostic-survey" replace />} />

    <Route path="*" element={<CmsCatchAll />} />
  </Routes>
)
