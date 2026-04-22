import { useEffect, type ReactNode } from "react"
import { Routes, Route } from "react-router-dom"
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
import Stories from "./pages/Stories"
import StoryPost from "./pages/StoryPost"
import PlaceholderPage from "./pages/PlaceholderPage"

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

    ensureScript("https://server.fillout.com/embed/v1/")
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
    <Route path="/programs" element={<ProgramsLayout />}>
      <Route index element={<ProgramsEvents />} />
      <Route path="qms" element={<ProgramsQms />} />
    </Route>

    <Route path="/network" element={<Network />} />
    <Route
      path="/network/founders"
      element={<PlaceholderPage title="Founders" subtitle="The Founders network page is coming soon." />}
    />
    <Route
      path="/network/advisors"
      element={<PlaceholderPage title="Advisors" subtitle="The Advisors network page is coming soon." />}
    />
    <Route
      path="/network/investors"
      element={<PlaceholderPage title="Investors" subtitle="The Investors network page is coming soon." />}
    />
    <Route
      path="/network/partners"
      element={<PlaceholderPage title="Partners" subtitle="The Partners network page is coming soon." />}
    />

    <Route path="/contact" element={<Contact />} />
    <Route path="/membership" element={<Payment />} />
    <Route path="/stories" element={<Stories />} />
    <Route path="/stories/:slug" element={<StoryPost />} />

    <Route
      path="/paths/founders"
      element={<PlaceholderPage title="Founders" subtitle="A dedicated page for founders is coming soon." />}
    />
    <Route
      path="/paths/advisors"
      element={<PlaceholderPage title="Advisors" subtitle="A dedicated page for advisors is coming soon." />}
    />
    <Route
      path="/paths/investors"
      element={<PlaceholderPage title="Investors" subtitle="A dedicated page for investors is coming soon." />}
    />
    <Route
      path="/paths/partners"
      element={<PlaceholderPage title="Industry partners" subtitle="A dedicated page for industry partners is coming soon." />}
    />

    <Route path="/terms" element={<TermsofUse />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />

    <Route path="/diagnostics" element={<DiagnosticLanding />} />
    <Route path="/diagnosticSurvey" element={<DiagnosticSurvey />} />

    <Route path="*" element={<NotFound />} />
  </Routes>
)
