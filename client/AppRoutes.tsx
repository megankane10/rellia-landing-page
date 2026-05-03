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
import Careers from "./pages/Careers"
import ProgramsEvents from "./pages/ProgramsEvents"
import ProgramsQms from "./pages/ProgramsQms"
import Events from "./pages/Events"
import EventDetail from "./pages/EventDetail"
import NotFound from "./pages/NotFound"
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
import TermsofUse from "./pages/TermsofUse"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import ProgramsLayout from "./pages/programs/ProgramsLayout"
import Stories from "./pages/Stories"
import StoryPost from "./pages/StoryPost"
import IndustryPartnersDirectory from "./pages/IndustryPartnersDirectory"
import Consulting from "./pages/Consulting"
import FoundersDirectory from "./pages/network/FoundersDirectory"
import AdvisorsDirectory from "./pages/network/AdvisorsDirectory"

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
    </Route>

    <Route path="/network" element={<Network />} />
    <Route path="/apply" element={<Apply />} />
    <Route path="/consulting" element={<Consulting />} />
    <Route path="/founders" element={<Founders />} />
    <Route path="/founders/directory" element={<FoundersDirectory />} />
    <Route path="/advisors" element={<Advisors />} />
    <Route path="/advisors/directory" element={<AdvisorsDirectory />} />
    <Route path="/investors" element={<Investors />} />
    <Route path="/industry-partners" element={<Partners />} />
    <Route path="/partners" element={<Navigate to="/industry-partners" replace />} />

    <Route path="/contact" element={<Contact />} />
    <Route path="/membership" element={<Payment />} />
    <Route path="/stories" element={<Stories />} />
    <Route path="/stories/:slug" element={<StoryPost />} />

    {/* Dedicated role pages live at /founders, /advisors, /investors, /partners */}
    <Route path="/industry-partners/directory" element={<IndustryPartnersDirectory />} />

    <Route path="/terms" element={<TermsofUse />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />

    <Route path="/diagnostics" element={<DiagnosticLanding />} />
    <Route path="/diagnosticSurvey" element={<DiagnosticSurvey />} />

    <Route path="*" element={<NotFound />} />
  </Routes>
)
