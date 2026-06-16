import { lazy, Suspense } from "react"
import { Routes, Route, Navigate, useParams, useLocation } from "react-router-dom"
import { ProtectedRoute } from "@/components/admin/ProtectedRoute"
import { isAdminShellRoute } from "@/lib/adminNav"

const Index = lazy(() => import("./pages/Index"))
const About = lazy(() => import("./pages/About"))
const FAQ = lazy(() => import("./pages/FAQ"))
const Careers = lazy(() => import("./pages/CareersCms"))
const CareersRoleDetail = lazy(() => import("./pages/CareersRoleDetail"))
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
const IndustryPartnersDirectory = lazy(() => import("./pages/IndustryPartnersDirectory"))
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"))
const AdminSignup = lazy(() => import("./pages/admin/AdminSignup"))
const AcceptInvite = lazy(() => import("./pages/AcceptInvite"))
const AdminAuthCallback = lazy(() => import("./pages/admin/AdminAuthCallback"))
const AdminSetPassword = lazy(() => import("./pages/admin/AdminSetPassword"))
const AdminShell = lazy(() => import("./pages/admin/AdminShell"))
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"))
const AdminCompany = lazy(() => import("./pages/admin/AdminCompany"))
const AdminContactDetail = lazy(() => import("./pages/admin/AdminContactDetail"))

const RedirectFoundersDirectoryId = () => {
  const { id } = useParams<{ id: string }>()
  if (!id?.trim()) return <Navigate to="/founders/alumni" replace />
  return <Navigate to={`/founders/alumni/${encodeURIComponent(id)}`} replace />
}

export const AppRoutesClient = () => {
  const location = useLocation()
  const routesKey = isAdminShellRoute(location.pathname) ? "/admin" : location.pathname

  return (
    <Suspense fallback={null}>
      <Routes location={location} key={routesKey}>
        <Route path="/" element={<Index />} />

        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/roles/:roleId" element={<CareersRoleDetail />} />
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

        <Route path="/network" element={<Navigate to="/founders" replace />} />
        <Route path="/blog" element={<Navigate to="/stories" replace />} />
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

        <Route path="/startup-diagnostic" element={<DiagnosticLanding />} />
        <Route path="/diagnostics" element={<Navigate to="/startup-diagnostic" replace />} />
        <Route path="/diagnostic-survey" element={<DiagnosticSurvey />} />
        <Route path="/survey" element={<Navigate to="/diagnostic-survey" replace />} />

        <Route path="/studio" element={<StudioRedirect />} />

        <Route path="/accept-invite" element={<AcceptInvite />} />
        <Route path="/admin/auth/callback" element={<AdminAuthCallback />} />
        <Route path="/admin/set-password" element={<AdminSetPassword />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        <Route path="/admin/dashboard" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/admin/submissions" element={<Navigate to="/admin/inbox" replace />} />
        <Route path="/admin/contacts" element={<Navigate to="/admin/inbox?tab=contact" replace />} />
        <Route path="/admin/diagnostics" element={<Navigate to="/admin/inbox?tab=diagnostic" replace />} />
        <Route path="/admin/content" element={<Navigate to="/admin/drafts" replace />} />
        <Route path="/admin/resources" element={<Navigate to="/admin/help" replace />} />

        <Route path="/admin" element={<ProtectedRoute><AdminShell /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="contacts/:id" element={<AdminContactDetail />} />
          <Route path="companies/:id" element={<AdminCompany />} />
          <Route path="*" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<CmsCatchAll />} />
      </Routes>
    </Suspense>
  )
}
