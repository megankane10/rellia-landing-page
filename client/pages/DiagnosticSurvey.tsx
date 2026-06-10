import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Menu,
  X,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Calendar,
  Building2,
  Target,
  Sparkles,
  Printer,
  Users,
  Palette,
  Code2,
  Activity,
  ShieldCheck,
  Scale,
  FileText,
  DollarSign,
  TrendingUp,
  Megaphone,
  Compass,
  Heart,
  Briefcase,
  Clock,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction";
import RouteSeo from "@/components/RouteSeo";
import { useAdvisors, useDiagnosticSurveyContent } from "@/hooks/useCmsDocuments";
import { mergeDiagnosticSurveySections } from "@/lib/mergeDiagnosticSurvey";
import { ADVISOR_DIRECTORY_SEED, type AdvisorDirectoryFilter } from "@/data/advisorDirectory";
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { clearApiCsrfCache, getApiCsrfHeaders } from "@/lib/apiCsrf";
import { PROGRAM_META_BY_HREF } from "@/config/programMeta";
import FilteredListEmptyState from "@/components/FilteredListEmptyState";
import type { DiagnosticSurveySection } from "@/data/diagnosticSurveySections";

const SECTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  product_design: Palette,
  product_dev: Code2,
  clinical: Activity,
  regulatory: ShieldCheck,
  legal: Scale,
  ip: FileText,
  reimbursement: DollarSign,
  fundraising: TrendingUp,
  marketing: Megaphone,
  gtm: Compass,
  healthcare: Users,
  customer_success: Heart,
  operations: Briefcase,
};

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Section = DiagnosticSurveySection;
interface Answers {
  [secId: string]: { [qIdx: number]: number };
}
interface MemberInfo {
  name: string;
  company: string;
  stage: string;
  email: string;
  desc: string;
}

interface DiagResult {
  summary: string;
  top3_strengths: { category: string; score: number; note: string }[];
  top3_weaknesses: {
    category: string;
    score: number;
    priority: string;
    note: string;
  }[];
  recommendations: string[];
  mentor_areas_needed: string[];
  savedToSupabase?: boolean
}

type View = "intro" | "survey" | "submit" | "processing" | "report";

// ─── DATA MAP ────────────────────────────────────────────────────────────────

const DATA_MAP: Record<
  string,
  { mentor: string; program: string; programHref?: string; advisorSpecialty?: AdvisorDirectoryFilter }
> = {
  product_design: {
    mentor: "UX & Product Design",
    program: "Prototype Lab",
    programHref: "/programs/low-fidelity-prototype-lab",
    advisorSpecialty: "Product Design & UI/UX",
  },
  product_dev: {
    mentor: "Engineering",
    program: "Build Your QMS",
    programHref: "/programs/build-your-quality-management-system",
    advisorSpecialty: "Product Development",
  },
  clinical: {
    mentor: "Clinical Affairs",
    program: "Regulatory Roadmap",
    programHref: "/programs/regulatory-strategy-sprint",
    advisorSpecialty: "Clinical Evidence",
  },
  regulatory: {
    mentor: "Regulatory",
    program: "Regulatory Roadmap",
    programHref: "/programs/regulatory-strategy-sprint",
    advisorSpecialty: "Regulatory Strategy",
  },
  legal: {
    mentor: "Legal & Privacy",
    program: "Regulatory Roadmap",
    programHref: "/programs/regulatory-strategy-sprint",
    advisorSpecialty: "Legal & Privacy",
  },
  ip: {
    mentor: "Intellectual Property",
    program: "Advance Dataroom",
    programHref: "/programs/advance-data-room-deep-dive",
    advisorSpecialty: "IP Strategy",
  },
  reimbursement: {
    mentor: "Reimbursement",
    program: "Regulatory Roadmap",
    programHref: "/programs/regulatory-strategy-sprint",
    advisorSpecialty: "Reimbursement",
  },
  fundraising: {
    mentor: "Fundraising",
    program: "Elevate Capital",
    programHref: "/programs/elevate-healthcare-capital",
    advisorSpecialty: "Fundraising",
  },
  marketing: {
    mentor: "Marketing",
    program: "Brand Strategy",
    programHref: "/programs/design-your-brand-strategy",
    advisorSpecialty: "Marketing & Branding",
  },
  gtm: {
    mentor: "Commercial Strategy",
    program: "First 50 Users",
    programHref: "/programs/first-50-users-clinical-feedback-intensive",
    advisorSpecialty: "Go-To-Market",
  },
  healthcare: {
    mentor: "Health Systems",
    program: "Advisory Board Match",
    programHref: "/programs/advisory-board-match",
    advisorSpecialty: "Health System Navigation",
  },
  operations: {
    mentor: "Operations & Scaling",
    program: "Ignite Pitch",
    programHref: "/programs/ignite-pitch-foundations",
    advisorSpecialty: "Operations & Scaling",
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getSectionScore(
  secId: string,
  answers: Answers,
  sections: Section[],
): number | null {
  const sec = sections.find((s) => s.id === secId);
  if (!sec || !answers[secId] || !Object.keys(answers[secId]).length)
    return null;
  let sum = 0,
    count = 0;
  Object.entries(answers[secId]).forEach(([qi, oi]) => {
    const q = sec.questions[parseInt(qi)];
    if (q && q.options[oi] !== undefined) {
      sum += q.options[oi].score;
      count++;
    }
  });
  return count > 0 ? Math.round(sum / count) : null;
}

function scoreClass(s: number): string {
  if (s >= 70) return "text-green-600";
  if (s >= 40) return "text-amber-600";
  return "text-red-600";
}

function scoreBarClass(s: number): string {
  if (s >= 70) return "bg-green-600";
  if (s >= 40) return "bg-amber-600";
  return "bg-red-600";
}

const coerceStringList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string")
  if (typeof value === "string") return [value]
  return []
}

const validateMemberInfo = (info: MemberInfo, stagesList: string[] = STAGES): Record<string, string> => {
  const next: Record<string, string> = {}

  if (!info.name.trim()) next.name = "Name is required"
  if (!info.company.trim()) next.company = "Company name is required"

  const stage = info.stage.trim()
  if (!stage) {
    next.stage = "Stage is required"
  } else if (!stagesList.includes(stage)) {
    next.stage = "Select a valid stage"
  }

  const email = info.email.trim()
  if (!email) {
    next.email = "Email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    next.email = "Enter a valid email address"
  }

  if (!info.desc.trim()) next.desc = "Description is required"

  return next
}

const isMemberInfoValid = (info: MemberInfo, stagesList: string[] = STAGES): boolean =>
  Object.keys(validateMemberInfo(info, stagesList)).length === 0

const TYPE_LABELS: Record<string, string> = {
  confidence: "Confidence check",
  progress: "Progress check",
  applicability: "Applicability check",
  knowledge: "Knowledge check",
};

const STAGES = [
  "Idea / Discovery",
  "Prototype / MVP",
  "Pilot / Seed",
  "Early Growth (Series A+)",
  "Scale-up",
];

const LOCAL_STORAGE_KEY = "rellia:diagnosticSurvey:v1"

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = `
@keyframes ds-spin { to { transform: rotate(360deg); } }
.animate-ds-spin { animation: ds-spin 0.8s linear infinite; }
@keyframes ds-fade-in-up { 
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-ds-up { animation: ds-fade-in-up 0.3s ease-out forwards; }

@keyframes ds-timeline-fill {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
.ds-timeline-fill {
  transform-origin: bottom;
  animation: ds-timeline-fill 420ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
.ds-delay-0 { animation-delay: 120ms; }
.ds-delay-1 { animation-delay: 320ms; }
.ds-delay-2 { animation-delay: 520ms; }
.ds-delay-3 { animation-delay: 720ms; }

.diagnostic-print-only { display: none !important; }

@media print {
  @page {
    margin: 0.35cm 0.75cm 0.55cm;
    size: letter;
  }

  html, body {
    background: #fff !important;
    color: #111 !important;
    font-size: 9.5pt;
    height: auto !important;
    -webkit-print-color-adjust: economy;
    print-color-adjust: economy;
  }

  nav, footer, aside, .diagnostic-screen-only, .diagnostic-print-hide {
    display: none !important;
  }

  .diagnostic-page {
    padding-top: 0 !important;
    min-height: auto !important;
    background: #fff !important;
  }

  main {
    padding: 0 !important;
  }

  .diagnostic-print-only {
    display: block !important;
  }

  .diagnostic-print-letterhead {
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border-bottom: 1.5px solid #0d3540;
    padding-bottom: 0.25rem;
    margin-bottom: 0.2rem;
    page-break-after: avoid;
  }

  .diagnostic-print-letterhead img {
    height: 38px;
    width: auto;
    object-fit: contain;
  }

  .diagnostic-print-letterhead-title {
    font-family: "Host Grotesk", sans-serif;
    font-size: 13pt;
    font-weight: 400;
    line-height: 1.2;
    color: #0d3540 !important;
    text-align: right;
    letter-spacing: 0.03em;
  }

  .diagnostic-report {
    padding: 0 !important;
    margin: 0 !important;
    gap: 0.75rem !important;
    animation: none !important;
  }

  .diagnostic-report-header {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0.15rem;
    margin-top: 0;
    page-break-after: avoid;
  }

  .diagnostic-report-header h1 {
    color: #0d3540 !important;
    font-size: 16pt !important;
    font-weight: 700 !important;
    margin: 0 !important;
  }

  .diagnostic-report-meta {
    color: #444 !important;
    font-size: 8.5pt !important;
    margin-top: 0.15rem !important;
  }

  .diagnostic-report-summary {
    background: #fff !important;
    border: 1px solid #ccc !important;
    border-left: 3px solid #0d3540 !important;
    box-shadow: none !important;
    color: #111 !important;
    padding: 0.45rem 0.6rem !important;
    page-break-inside: avoid;
    margin-bottom: 0.75rem !important;
  }

  .diagnostic-report-summary p {
    color: #222 !important;
    font-size: 9.5pt !important;
    line-height: 1.35 !important;
    margin: 0 !important;
  }

  .diagnostic-report-summary img {
    display: none !important;
  }

  .diagnostic-report section {
    page-break-inside: auto;
    margin-bottom: 1.15rem;
    break-inside: auto;
  }

  .diagnostic-report .diagnostic-print-stack > section + section,
  .diagnostic-report .diagnostic-print-stack > .diagnostic-print-page-two {
    margin-top: 1.35rem !important;
  }

  .diagnostic-report section h2 {
    color: #0d3540 !important;
    font-size: 8pt !important;
    letter-spacing: 0.06em !important;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.3rem;
    margin-bottom: 0.6rem;
  }

  .diagnostic-report .diagnostic-section-note {
    display: none !important;
  }

  .diagnostic-report .diagnostic-card-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 0.45rem !important;
  }

  .diagnostic-report .diagnostic-card {
    background: #fff !important;
    border: 1px solid #bbb !important;
    box-shadow: none !important;
    border-radius: 4px !important;
    padding: 0.35rem 0.45rem !important;
    min-height: auto !important;
  }

  .diagnostic-report .diagnostic-card-strength {
    border-left: 2px solid #333 !important;
  }

  .diagnostic-report .diagnostic-card-gap {
    border-left: 2px solid #666 !important;
  }

  .diagnostic-report .diagnostic-card-badge {
    background: #eee !important;
    color: #111 !important;
    border: 1px solid #ccc !important;
    font-size: 7pt !important;
    padding: 0.05rem 0.3rem !important;
  }

  .diagnostic-report .diagnostic-card h3 {
    color: #111 !important;
    font-size: 8.5pt !important;
    margin-top: 0.15rem !important;
    line-height: 1.2 !important;
  }

  .diagnostic-report .diagnostic-breakdown-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 0.55rem !important;
  }

  .diagnostic-print-breakdown-section {
    page-break-after: always;
    margin-bottom: 0.5rem !important;
    padding-bottom: 0.5rem;
  }

  .diagnostic-print-page-two {
    page-break-before: always;
    padding-top: 0.5rem;
  }

  .diagnostic-print-page-two > section,
  .diagnostic-print-page-two > .diagnostic-print-programs {
    margin-bottom: 1.35rem !important;
    page-break-inside: avoid;
  }

  .diagnostic-print-page-two .diagnostic-roadmap-block,
  .diagnostic-print-page-two .diagnostic-membership-print {
    margin-bottom: 1.15rem !important;
  }

  .diagnostic-report .diagnostic-breakdown-item {
    background: #fff !important;
    border: 1px solid #bbb !important;
    box-shadow: none !important;
    padding: 0.55rem 0.65rem !important;
    border-radius: 6px !important;
    page-break-inside: avoid;
    min-height: 2.75rem;
  }

  .diagnostic-report .diagnostic-breakdown-item .diagnostic-score {
    color: #111 !important;
    font-weight: 700 !important;
    font-size: 8.5pt !important;
  }

  .diagnostic-report .diagnostic-breakdown-item .font-host-grotesk {
    font-size: 7.5pt !important;
    line-height: 1.15 !important;
  }

  .diagnostic-report .diagnostic-breakdown-bar {
    background: #e5e5e5 !important;
    height: 4px !important;
    margin-top: 0.35rem !important;
    border-radius: 999px !important;
  }

  .diagnostic-report .diagnostic-breakdown-bar-fill {
    background: #333 !important;
  }

  .diagnostic-report .diagnostic-roadmap-block,
  .diagnostic-report .diagnostic-membership-print {
    background: #fff !important;
    border: 1px solid #ccc !important;
    box-shadow: none !important;
    padding: 0.65rem 0.75rem !important;
    border-radius: 4px !important;
    page-break-inside: auto;
    margin-top: 0 !important;
  }

  .diagnostic-report .diagnostic-roadmap-block h2 {
    margin-bottom: 0.55rem !important;
  }

  .diagnostic-report .diagnostic-roadmap-step {
    display: flex !important;
    gap: 0.35rem !important;
    margin-bottom: 0.45rem !important;
  }

  .diagnostic-report .diagnostic-roadmap-num {
    background: #eee !important;
    color: #111 !important;
    border: 1px solid #bbb !important;
    box-shadow: none !important;
    width: 1rem !important;
    height: 1rem !important;
    font-size: 7pt !important;
    flex-shrink: 0 !important;
  }

  .diagnostic-report .diagnostic-roadmap-step p {
    color: #222 !important;
    font-size: 8.5pt !important;
    line-height: 1.3 !important;
    margin: 0 !important;
    padding-top: 0 !important;
  }

  .diagnostic-report .diagnostic-roadmap-step .diagnostic-roadmap-line {
    display: none !important;
  }

  .diagnostic-report .diagnostic-membership-print {
    border-left: 3px solid #0d3540 !important;
    margin-top: 0.25rem !important;
  }

  .diagnostic-report .diagnostic-membership-print h2 {
    border: none !important;
    font-size: 10pt !important;
    font-weight: 400 !important;
    color: #0d3540 !important;
    margin: 0 0 0.65rem !important;
    padding: 0 !important;
    line-height: 1.35 !important;
  }

  .diagnostic-report .diagnostic-membership-print p {
    color: #333 !important;
    font-size: 8.5pt !important;
    line-height: 1.45 !important;
    margin: 0 0 0.65rem !important;
  }

  .diagnostic-report .diagnostic-membership-print p:last-child {
    margin-bottom: 0 !important;
  }

  .diagnostic-report .diagnostic-membership-print a {
    color: #0d3540 !important;
    font-weight: 700 !important;
    text-decoration: underline !important;
  }

  .diagnostic-report .diagnostic-print-programs {
    margin-top: 0.35rem;
    margin-bottom: 0.75rem;
  }

  .diagnostic-report .diagnostic-print-programs li {
    font-size: 8.5pt;
    color: #222;
    margin-bottom: 0.25rem;
    line-height: 1.35;
  }

  .diagnostic-report .diagnostic-print-footer {
    border-top: 1px solid #ccc;
    margin-top: 0.75rem;
    padding-top: 0.45rem;
    font-size: 7pt;
    color: #666 !important;
    text-align: center;
    page-break-before: avoid;
  }

  .diagnostic-report .space-y-12 > :not([hidden]) ~ :not([hidden]) {
    margin-top: 1.35rem !important;
  }

  .diagnostic-report .space-y-6 > :not([hidden]) ~ :not([hidden]) {
    margin-top: 1rem !important;
  }

  .diagnostic-report .space-y-4 > :not([hidden]) ~ :not([hidden]) {
    margin-top: 0.75rem !important;
  }
}
`;

const DEFAULT_INTRO_TITLE = "How ready is your startup, really?"
const DEFAULT_INTRO_SUBTITLE = "Our diagnostic tool assesses your health tech startup across 12 critical domains. Get an automated report, personalized advisory board matches, and a program roadmap tailored to your gaps."
const DEFAULT_INTRO_JOURNEY_TITLE = "Your Diagnostic Journey"
const DEFAULT_INTRO_JOURNEY_STEPS = [
  { title: "Capture Your Context", description: "Tell us about your startup, stage, and mission.", icon: "Building2" },
  { title: "12-Domain Deep Dive", description: "15-minute assessment of your regulatory, clinical, and commercial readiness.", icon: "Target" },
  { title: "Personalized Growth Roadmap", description: "Immediate analysis of your top strengths and priority gaps.", icon: "Sparkles" },
  { title: "Advisory Board Match", description: "Personalized assignment of mentors based on your results.", icon: "Users" }
]
const DEFAULT_INTRO_WHAT_YOU_GET_TITLE = "What you’ll get"
const DEFAULT_INTRO_WHAT_YOU_GET_BULLETS = [
  "Top 3 strengths + gaps with priority level",
  "Concrete roadmap recommendations",
  "Advisor focus areas matched to your gaps"
]
const DEFAULT_INTRO_STARTUP_DETAILS_TITLE = "Tell us about your startup"
const DEFAULT_INTRO_START_BUTTON_LABEL = "Begin Assessment"

const DEFAULT_SUBMIT_TITLE = "Review, then generate your roadmap"
const DEFAULT_SUBMIT_SUBTITLE = "You’re about to submit your responses. After confirmation, we’ll generate your personalized readiness report."
const DEFAULT_SUBMIT_PROFILE_TITLE = "Your Assessment Profile"
const DEFAULT_SUBMIT_GENERATING_TITLE = "Generating Your Report"
const DEFAULT_SUBMIT_GENERATING_BODY = "We're assessing your results in order to assign you your personalized advisory board and recommended Rellia programs."
const DEFAULT_SUBMIT_GENERATING_BULLETS = [
  "Top 3 Gaps & Strengths",
  "Customized Recommendation Roadmap",
  "Assigned Advisory Board Matches",
  "Meeting Links for Advisors"
]
const DEFAULT_SUBMIT_DETAILS_TITLE = "Submission details"
const DEFAULT_SUBMIT_CONFIRM_BUTTON_LABEL = "Confirm & Generate Report"

const DEFAULT_PROCESSING_TITLE = "Personalizing your report"
const DEFAULT_PROCESSING_SUBTITLE = "We're assessing your results in order to assign you your personalized advisory board and program roadmap."
const DEFAULT_PROCESSING_STEPS = [
  "Analyzing section scores",
  "Mapping gaps to advisors",
  "Building your roadmap"
]

const DEFAULT_REPORT_HEADER_THANK_YOU = "Thanks - we've saved your diagnostic submission for {company}. Your next step is to focus on the lowest-scoring domains first, then reinforce what's already working so you can move faster with less risk."
const DEFAULT_REPORT_STRENGTHS_TITLE = "Top Strengths"
const DEFAULT_REPORT_GAPS_TITLE = "Priority Gaps"
const DEFAULT_REPORT_ROADMAP_TITLE = "Recommended Roadmap"
const DEFAULT_REPORT_FULL_BREAKDOWN_TITLE = "Full Readiness Breakdown"
const DEFAULT_REPORT_PROGRAMS_TITLE = "Program Matches"
const DEFAULT_REPORT_ADVISORS_TITLE = "Custom Advisory Board"
const DEFAULT_REPORT_MEMBERSHIP_CTA_TITLE = "Your personalized blueprint is waiting."
const DEFAULT_REPORT_MEMBERSHIP_CTA_BODY = "Join Rellia Health to unlock your custom advisory board, full gap analysis, and personalized actions - and accelerate your journey."
const DEFAULT_REPORT_MEMBERSHIP_CTA_BUTTON = "Apply for Membership"

const INTRO_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Target,
  Sparkles,
  Users,
};

const DUMMY_HEADSHOTS = [
  "/images/samd.jpg",
  "/images/ibukun.jpg",
  "/images/team-megankane.jpg",
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function DiagnosticSurvey() {
  const [view, setView] = useState<View>("intro");
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);
  const [transitioning, setTransitioning] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [memberInfo, setMemberInfo] = useState<MemberInfo>({
    name: "",
    company: "",
    stage: "",
    email: "",
    desc: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [diagResult, setDiagResult] = useState<DiagResult | null>(null);
  const [procStep, setProcStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as {
        memberInfo?: MemberInfo
        answers?: Answers
        diagResult?: DiagResult
        savedAt?: string
      }

      if (parsed.memberInfo) setMemberInfo(parsed.memberInfo)
      if (parsed.answers) setAnswers(parsed.answers)
      if (parsed.diagResult) {
        setDiagResult(parsed.diagResult)
        setView("report")
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!diagResult) return
    try {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          memberInfo,
          answers,
          diagResult,
          savedAt: new Date().toISOString(),
        }),
      )
    } catch {
      // ignore
    }
  }, [answers, diagResult, memberInfo])

  // CMS Hooks
  const { data: cmsAdvisors } = useAdvisors();

  const advisors = useMemo(() => {
    if (cmsAdvisors && cmsAdvisors.length > 0) return cmsAdvisors
    return allowCmsSeedFallbacks() ? ADVISOR_DIRECTORY_SEED : []
  }, [cmsAdvisors]);

  const { data: surveyCms } = useDiagnosticSurveyContent()
  const sections = useMemo(
    () => mergeDiagnosticSurveySections(surveyCms ?? undefined),
    [surveyCms],
  )

  const stages = useMemo(() => {
    if (surveyCms?.stages && surveyCms.stages.length > 0) {
      return surveyCms.stages
    }
    return STAGES
  }, [surveyCms])

  // Set default stage when stages load from Sanity, but don't overwrite restored localStorage values
  useEffect(() => {
    if (stages.length > 0 && !memberInfo.stage) {
      setMemberInfo((prev) => ({
        ...prev,
        stage: prev.stage || stages[0],
      }))
    }
  }, [stages, memberInfo.stage])

  const introTitle = surveyCms?.introTitle || DEFAULT_INTRO_TITLE;
  const introSubtitle = surveyCms?.introSubtitle || DEFAULT_INTRO_SUBTITLE;
  const introJourneyTitle = surveyCms?.introJourneyTitle || DEFAULT_INTRO_JOURNEY_TITLE;
  const introJourneySteps = useMemo(() => {
    if (surveyCms?.introJourneySteps && surveyCms.introJourneySteps.length > 0) {
      return surveyCms.introJourneySteps.map((step) => {
        const IconComponent = (step.icon ? INTRO_ICON_MAP[step.icon] : null) || Target;
        return {
          icon: IconComponent,
          t: step.title,
          d: step.description,
        };
      });
    }
    return DEFAULT_INTRO_JOURNEY_STEPS.map((step) => ({
      icon: (INTRO_ICON_MAP[step.icon] || Target),
      t: step.title,
      d: step.description,
    }));
  }, [surveyCms]);
  const introWhatYouGetTitle = surveyCms?.introWhatYouGetTitle || DEFAULT_INTRO_WHAT_YOU_GET_TITLE;
  const introWhatYouGetBullets = surveyCms?.introWhatYouGetBullets || DEFAULT_INTRO_WHAT_YOU_GET_BULLETS;
  const introStartupDetailsTitle = surveyCms?.introStartupDetailsTitle || DEFAULT_INTRO_STARTUP_DETAILS_TITLE;
  const introStartButtonLabel = surveyCms?.introStartButtonLabel || DEFAULT_INTRO_START_BUTTON_LABEL;

  const submitTitle = surveyCms?.submitTitle || DEFAULT_SUBMIT_TITLE;
  const submitSubtitle = surveyCms?.submitSubtitle || DEFAULT_SUBMIT_SUBTITLE;
  const submitProfileTitle = surveyCms?.submitProfileTitle || DEFAULT_SUBMIT_PROFILE_TITLE;
  const submitGeneratingTitle = surveyCms?.submitGeneratingTitle || DEFAULT_SUBMIT_GENERATING_TITLE;
  const submitGeneratingBody = surveyCms?.submitGeneratingBody || DEFAULT_SUBMIT_GENERATING_BODY;
  const submitGeneratingBullets = surveyCms?.submitGeneratingBullets || DEFAULT_SUBMIT_GENERATING_BULLETS;
  const submitDetailsTitle = surveyCms?.submitDetailsTitle || DEFAULT_SUBMIT_DETAILS_TITLE;
  const submitConfirmButtonLabel = surveyCms?.submitConfirmButtonLabel || DEFAULT_SUBMIT_CONFIRM_BUTTON_LABEL;

  const processingTitle = surveyCms?.processingTitle || DEFAULT_PROCESSING_TITLE;
  const processingSubtitle = surveyCms?.processingSubtitle || DEFAULT_PROCESSING_SUBTITLE;
  const processingSteps = surveyCms?.processingSteps || DEFAULT_PROCESSING_STEPS;

  const completedSections = sections.filter(
    (s) =>
      answers[s.id] && Object.keys(answers[s.id]).length === s.questions.length,
  ).length;
  const progress = Math.round((completedSections / sections.length) * 100);
  const totalQs = sections.reduce((a, s) => a + s.questions.length, 0);
  const answeredGlobal = sections.reduce(
    (a, s) => a + Object.keys(answers[s.id] ?? {}).length,
    0,
  );

  const sec = sections[currentSection];
  const secAnswers = answers[sec?.id ?? ""] ?? {};
  const currentQ = sec?.questions[currentQIdx];
  const selectedOpt =
    secAnswers[currentQIdx] !== undefined ? secAnswers[currentQIdx] : -1;

  const goToSection = (i: number) => {
    if (!isMemberInfoValid(memberInfo, stages)) {
      setErrors(validateMemberInfo(memberInfo, stages))
      setView("intro")
      return
    }
    setCurrentSection(i);
    setCurrentQIdx(0);
    setView("survey");
  };
  const goToIntro = () => setView("intro");
  const startSurvey = () => {
    const newErrors = validateMemberInfo(memberInfo, stages)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({});
    setCurrentSection(0);
    setCurrentQIdx(0);
    setView("survey");
  };
  const goToSubmit = () => setView("submit");

  const selectAnswer = (optIdx: number) => {
    if (transitioning) return;
    setAnswers((prev) => ({
      ...prev,
      [sec.id]: { ...(prev[sec.id] || {}), [currentQIdx]: optIdx },
    }));
    setTransitioning(true);
    setTimeout(() => {
      if (currentQIdx < sec.questions.length - 1) {
        setCurrentQIdx((i) => i + 1);
      } else if (currentSection < sections.length - 1) {
        setCurrentSection((i) => i + 1);
        setCurrentQIdx(0);
      } else {
        setView("submit");
      }
      setTransitioning(false);
    }, 320);
  };

  const submitSurvey = async () => {
    setView("processing");
    setProcStep(0);

    // Prepare data for API
    const scores: string[] = sections.map((s) => {
      const sc = getSectionScore(s.id, answers, sections) ?? 0;
      return `${s.title}: ${sc}%`;
    });

    const payload = {
      name: memberInfo.name,
      email: memberInfo.email,
      company: memberInfo.company,
      stage: memberInfo.stage,
      desc: memberInfo.desc,
      sectionScoresMarkdown: scores.join("\n"),
      rawAnswers: answers,
    };

    const safeCoerceDiagResult = (value: unknown): DiagResult | null => {
      if (!value || typeof value !== "object") return null

      const v = value as Partial<DiagResult>
      if (typeof v.summary !== "string") return null

      const strengths = Array.isArray(v.top3_strengths) ? v.top3_strengths : []
      const weaknesses = Array.isArray(v.top3_weaknesses) ? v.top3_weaknesses : []
      const recommendations = Array.isArray(v.recommendations) ? v.recommendations : []
      const mentorAreas = Array.isArray(v.mentor_areas_needed) ? v.mentor_areas_needed : []

      return {
        summary: v.summary,
        top3_strengths: strengths.filter(Boolean) as DiagResult["top3_strengths"],
        top3_weaknesses: weaknesses.filter(Boolean) as DiagResult["top3_weaknesses"],
        recommendations: recommendations.filter((x): x is string => typeof x === "string"),
        mentor_areas_needed: mentorAreas.filter((x): x is string => typeof x === "string"),
      }
    }

    try {
      setProcStep(1);
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 25_000)

      const postDiag = async () => {
        const csrf = await getApiCsrfHeaders()
        return fetch("/api/diagnostic-report", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json", ...csrf },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
      }
      let res = await postDiag().finally(() => window.clearTimeout(timeout))
      if (res.status === 403) {
        const j = (await res.clone().json().catch(() => ({}))) as {
          code?: string;
        };
        if (j.code === "CSRF") {
          clearApiCsrfCache();
          res = await postDiag();
        }
      }

      const report = await (async () => {
        try {
          return await res.json()
        } catch {
          const text = await res.text().catch(() => "")
          return { error: "NON_JSON_RESPONSE", message: text }
        }
      })()

      if (!res.ok) {
        if (report.error === "SANITY_ERROR") {
          throw new Error(
            `ADMIN_CONFIG_ERROR: ${report.message || "Check SANITY_WRITE_TOKEN"}`,
          );
        }
        const baseMessage =
          report.message ||
          report.error ||
          `Request failed (${res.status}${res.statusText ? ` ${res.statusText}` : ""})`

        const details =
          import.meta.env.DEV && report.details
            ? `\n\nDetails:\n${JSON.stringify(report.details, null, 2)}`
            : ""

        throw new Error(`${baseMessage}${details}`)
      }

      setProcStep(2);
      const nextResult = safeCoerceDiagResult(report)
      if (!nextResult) {
        throw new Error("API returned unexpected report shape")
      }
      setDiagResult(nextResult);

      await new Promise((r) => setTimeout(r, 800));
      setView("report");
    } catch (err: any) {
      console.error("Report generation failed:", err);

      const parsedScores = scores
        .map((line) => {
          const match = line.match(/^(.+?)\s*:\s*(\d{1,3})%?$/);
          if (!match) return null;
          const category = match[1]?.trim() || "";
          const score = Number(match[2]);
          if (!category || !Number.isFinite(score)) return null;
          return { category, score: Math.max(0, Math.min(100, score)) };
        })
        .filter((x): x is { category: string; score: number } => Boolean(x));

      const toPriority = (score: number) => {
        if (score < 40) return "Critical";
        if (score < 70) return "High";
        return "Medium";
      };

      const topStrengths = [...parsedScores]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      const topWeaknesses = [...parsedScores]
        .sort((a, b) => a.score - b.score)
        .slice(0, 3);

      setDiagResult({
        summary: `We encountered a brief issue connecting to our servers, but here is your assessment for ${memberInfo.company}. Focus on your lowest-scoring domains first, then reinforce what's already working.`,
        top3_strengths: topStrengths.map((s) => ({
          category: s.category,
          score: s.score,
          note: "Above-average readiness compared to your other domains.",
        })),
        top3_weaknesses: topWeaknesses.map((s) => ({
          category: s.category,
          score: s.score,
          priority: toPriority(s.score),
          note: "This is a likely bottleneck—tighten it before scaling execution or diligence.",
        })),
        recommendations: [
          "Pick one domain to fix this week and define a concrete deliverable.",
          "Validate your assumptions with 2–3 targeted conversations.",
          "Turn the lowest-scoring domain into a short 30–60 day plan with owners and milestones.",
        ],
        mentor_areas_needed: topWeaknesses.map((w) => w.category),
      });
      setView("report");
    }
  };

  // Advisory Board Matching Logic
  const recommendedAdvisors = useMemo(() => {
    if (!diagResult) return [];
    const weakAreas = diagResult.mentor_areas_needed || [];

    // Simple matching: check if advisor's focus or industries include the weak areas
    const matches = advisors
      .filter((a) => {
        const focus = coerceStringList((a as any).focus)
        const industries = coerceStringList((a as any).industries)
        const combined = `${focus.join(" ")} ${industries.join(" ")}`.toLowerCase()
        return weakAreas.some((area) => combined.includes(area.toLowerCase()));
      })
      .slice(0, 3);

    // If not enough matches, pick some prominent ones
    if (matches.length < 3) {
      const ids = new Set(matches.map((m) => m.id));
      const remaining = advisors
        .filter((a) => !ids.has(a.id))
        .slice(0, 3 - matches.length);
      return [...matches, ...remaining];
    }
    return matches;
  }, [diagResult, advisors]);

  const recommendedPrograms = useMemo(() => {
    if (!diagResult) return [];
    const weakSections = diagResult.top3_weaknesses.map((w) => w.category);

    return weakSections
      .map((cat) => {
        const section = sections.find((s) => s.title === cat);
        return section ? DATA_MAP[section.id] : null;
      })
      .filter(Boolean);
  }, [diagResult, sections]);

  return (
    <div className="diagnostic-page min-h-screen bg-rellia-cream font-host-grotesk text-rellia-teal selection:bg-rellia-mint/30 selection:text-rellia-teal pt-[72px] md:pt-[86px]">
      <style>{css}</style>
      <div className="diagnostic-screen-only">
        <Navbar />
      </div>
      <RouteSeo
        title="Startup Diagnostic | Rellia Health"
        description="Assess your health tech startup across 12 domains and get a personalized advisory board and program roadmap."
      />

      <div className="relative grid items-start lg:grid-cols-[18rem_1fr]">
        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="diagnostic-screen-only sticky top-[72px] z-20 hidden max-h-[calc(100vh-72px)] w-72 shrink-0 flex-col self-start overflow-y-auto rounded-b-3xl border-r border-rellia-teal/10 bg-white/50 backdrop-blur-md md:top-[86px] md:max-h-[calc(100vh-86px)] lg:flex">
          <div className="flex flex-col gap-6 p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-rellia-teal/50">
                <span>Progress</span>
                <span>
                  {completedSections} / {sections.length}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-rellia-teal/5">
                <div
                  className="h-full bg-rellia-teal transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={goToIntro}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${view === "intro" ? "bg-rellia-teal text-white shadow-md" : "text-rellia-teal/60 hover:bg-rellia-teal/5 hover:text-rellia-teal"}`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${view === "intro" ? "border-white/30 bg-white/10" : "border-rellia-teal/10"}`}
                >
                  →
                </div>
                <span className="font-medium">Introduction</span>
              </button>

              <div className="my-4 h-px bg-rellia-teal/5" />

              <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-rellia-teal/40">
                Assessment Sections
              </div>

              <div className="space-y-1">
                {sections.map((s, i) => {
                  const done =
                    answers[s.id] &&
                    Object.keys(answers[s.id]).length === s.questions.length;
                  const active = view === "survey" && i === currentSection;
                  return (
                    <button
                      key={s.id}
                      onClick={() => goToSection(i)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${active ? "bg-rellia-teal text-white shadow-md" : done ? "text-rellia-teal/70 hover:bg-rellia-teal/5" : "text-rellia-teal/50 hover:bg-rellia-teal/5 hover:text-rellia-teal"}`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] ${active ? "border-white/30 bg-white/10" : done ? "border-green-500/30 bg-green-50 text-green-600" : "border-rellia-teal/10"}`}
                      >
                        {done && !active ? "✓" : i + 1}
                      </div>
                      <span
                        className={`truncate font-medium ${active ? "text-white" : ""}`}
                      >
                        {s.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="my-4 h-px bg-rellia-teal/5" />

              <button
                onClick={goToSubmit}
                disabled={answeredGlobal < totalQs * 0.5}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${view === "submit" ? "bg-rellia-teal text-white shadow-md" : "text-rellia-teal/50 hover:bg-rellia-teal/5 hover:text-rellia-teal"} disabled:opacity-40`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${view === "submit" ? "border-white/30 bg-white/10" : "border-rellia-teal/10"}`}
                >
                  ✓
                </div>
                <span className="font-medium">Review & Submit</span>
              </button>

              <div className="my-4 h-px bg-rellia-teal/5" />

              <button
                disabled={!diagResult}
                onClick={() => setView("report")}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${view === "report" ? "bg-rellia-teal text-white shadow-md" : diagResult ? "text-rellia-teal/70 hover:bg-rellia-teal/5" : "text-rellia-teal/20 pointer-events-none"}`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${view === "report" ? "border-white/30 bg-white/10" : "border-rellia-teal/10"}`}
                >
                  ★
                </div>
                <span className="font-medium">Personalized Roadmap</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <main className="min-w-0">
          {/* MOBILE SUB-HEADER */}
          <div className="diagnostic-screen-only sticky top-[72px] z-[60] border-b border-rellia-teal/10 bg-rellia-cream/90 backdrop-blur-md md:top-[86px] lg:hidden">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex flex-1 flex-col justify-center gap-1">
                <div className="h-1 overflow-hidden rounded-full bg-rellia-teal/10">
                  <div
                    className="h-full bg-rellia-teal transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-rellia-teal/60">
                  <span>
                    {view === "survey"
                      ? sec?.title ?? "Assessment"
                      : view === "intro"
                        ? "Introduction"
                        : view === "submit"
                          ? "Review"
                          : view === "processing"
                            ? "Generating report"
                            : "Roadmap"}
                  </span>
                  <span>{progress}%</span>
                </div>
              </div>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-rellia-mint text-rellia-teal shadow-md active:scale-95 transition-all"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* INLINE MOBILE MENU */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden bg-rellia-cream border-t border-rellia-teal/5 shadow-xl"
                >
                  <div className="px-4 py-6 max-h-[70vh] overflow-y-auto">
                    <nav className="space-y-2">
                      <button
                        onClick={() => {
                          goToIntro();
                          setMobileMenuOpen(false);
                        }}
                        className={`flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all ${view === "intro" ? "bg-rellia-teal text-white" : "bg-rellia-teal/5"}`}
                      >
                        <span className="font-semibold">Introduction</span>
                      </button>

                      <div className="py-2 text-[10px] font-bold uppercase tracking-widest text-rellia-teal/40">
                        Sections
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {sections.map((s, i) => {
                          const done =
                            answers[s.id] &&
                            Object.keys(answers[s.id]).length ===
                              s.questions.length;
                          const active =
                            view === "survey" && i === currentSection;
                          return (
                            <button
                              key={s.id}
                              onClick={() => {
                                goToSection(i);
                                setMobileMenuOpen(false);
                              }}
                              className={`flex items-center gap-4 rounded-xl p-4 text-left transition-all ${active ? "bg-rellia-teal text-white shadow-lg" : "bg-white border border-rellia-teal/10"}`}
                            >
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-white/20" : done ? "bg-green-100 text-green-700" : "bg-rellia-teal/5"}`}
                              >
                                {done && !active ? "✓" : i + 1}
                              </div>
                              <span className="font-medium">{s.title}</span>
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          goToSubmit();
                          setMobileMenuOpen(false);
                        }}
                        className={`mt-4 flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all ${view === "submit" ? "bg-rellia-teal text-white" : "bg-rellia-teal/5"}`}
                      >
                        <span className="font-semibold">Review & Submit</span>
                      </button>

                      <button
                        onClick={() => {
                          setView("report");
                          setMobileMenuOpen(false);
                        }}
                        className={`mt-4 flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all ${view === "report" ? "bg-rellia-teal text-white" : "bg-rellia-teal/5"}`}
                      >
                        <span className="font-semibold">
                          Personalized Roadmap
                        </span>
                      </button>
                    </nav>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mx-auto flex max-w-5xl flex-col px-4 pb-8 pt-6 md:px-8 md:pb-12 md:pt-8 lg:px-12 lg:py-16">
            {/* ── INTRO VIEW ── */}
            {view === "intro" && (
              <div className="animate-ds-up flex flex-col gap-10">
                <div className="space-y-6">
                  <h1 className="font-host-grotesk text-4xl font-bold leading-[1.1] tracking-tight text-black md:text-6xl">
                    {introTitle === DEFAULT_INTRO_TITLE ? (
                      <>
                        How ready is your startup, <span className="italic text-rellia-teal">really?</span>
                      </>
                    ) : (
                      introTitle
                    )}
                  </h1>
                  <p className="font-urbanist text-lg leading-relaxed text-rellia-teal/70 md:text-xl">
                    {introSubtitle}
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:items-stretch">
                  <div className="space-y-6 flex flex-col h-full">
                    <div className="rounded-3xl border border-rellia-teal/10 bg-white p-8 shadow-sm flex-1 flex flex-col justify-between h-full">
                      <div>
                        <h3 className="mb-8 text-xs font-bold uppercase tracking-widest text-rellia-teal">
                          {introJourneyTitle}
                        </h3>
                        <div className="space-y-8">
                          {introJourneySteps.map((item, i) => (
                            <div key={i} className="relative flex gap-4">
                              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rellia-teal/20 bg-rellia-teal text-rellia-mint">
                                <span
                                  className={cn(
                                    "pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-full bg-rellia-mint/25",
                                    "ds-timeline-fill",
                                    i === 0 && "ds-delay-0",
                                    i === 1 && "ds-delay-1",
                                    i === 2 && "ds-delay-2",
                                    i === 3 && "ds-delay-3",
                                  )}
                                />
                                <item.icon className="h-5 w-5" />
                              </div>

                              <div className="min-w-0 pt-0.5">
                                <h4 className="font-bold text-sm text-rellia-teal">
                                  {item.t}
                                </h4>
                                <p className="text-xs text-rellia-teal/60 leading-relaxed">
                                  {item.d}
                                </p>
                              </div>

                              {i < 3 && (
                                <div className="pointer-events-none absolute left-[22px] top-12 h-[36px] w-px bg-rellia-teal" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-10 rounded-2xl border border-rellia-teal/5 bg-rellia-cream/20 p-5">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-rellia-teal/50">
                          {introWhatYouGetTitle}
                        </div>
                        <div className="mt-3 space-y-2">
                          {introWhatYouGetBullets.map((line) => (
                            <div key={line} className="flex items-start gap-3 text-xs text-black">
                              <div className="mt-1.5 h-2 w-2 rounded-full bg-rellia-mint" />
                              <span className="leading-relaxed">{line}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-rellia-teal/10 bg-white p-8 shadow-sm flex flex-col h-full">
                    <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-rellia-teal">
                      {introStartupDetailsTitle}
                    </h3>
                    <div className="space-y-4 flex-1">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-rellia-teal/50">
                          Your Name
                        </label>
                        <input
                          className={cn(
                            "w-full rounded-xl border p-3 text-sm focus:bg-white focus:outline-none transition-all",
                            errors.name
                              ? "border-red-500 bg-red-50"
                              : "border-rellia-teal/10 bg-rellia-cream/30 focus:border-rellia-teal",
                          )}
                          placeholder="First and last name"
                          value={memberInfo.name}
                          onChange={(e) =>
                            setMemberInfo((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                        autoComplete="name"
                        />
                        {errors.name && (
                          <p className="text-[10px] text-red-500 font-bold">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-rellia-teal/50">
                            Company Name
                          </label>
                          <input
                            className={cn(
                              "w-full rounded-xl border p-3 text-sm focus:bg-white focus:outline-none transition-all",
                              errors.company
                                ? "border-red-500 bg-red-50"
                                : "border-rellia-teal/10 bg-rellia-cream/30 focus:border-rellia-teal",
                            )}
                            placeholder="Startup name"
                            value={memberInfo.company}
                            onChange={(e) =>
                              setMemberInfo((p) => ({
                                ...p,
                                company: e.target.value,
                              }))
                            }
                            autoComplete="organization"
                          />
                          {errors.company && (
                            <p className="text-[10px] text-red-500 font-bold">
                              {errors.company}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-rellia-teal/50">
                            Current Stage
                          </label>
                          <div className="relative">
                            <select
                              className={cn(
                                "w-full rounded-xl border bg-rellia-cream/30 p-3 pr-10 text-sm focus:bg-white focus:outline-none appearance-none transition-all",
                                errors.stage
                                  ? "border-red-500 bg-red-50 focus:border-red-500"
                                  : "border-rellia-teal/10 focus:border-rellia-teal",
                              )}
                              value={memberInfo.stage}
                              onChange={(e) =>
                                setMemberInfo((p) => ({
                                  ...p,
                                  stage: e.target.value,
                                }))
                              }
                            >
                              {stages.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rellia-teal/40" />
                          </div>
                          {errors.stage && (
                            <p className="text-[10px] text-red-500 font-bold">
                              {errors.stage}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-rellia-teal/50">
                          Work Email
                        </label>
                        <input
                          className={cn(
                            "w-full rounded-xl border p-3 text-sm focus:bg-white focus:outline-none transition-all",
                            errors.email
                              ? "border-red-500 bg-red-50"
                              : "border-rellia-teal/10 bg-rellia-cream/30 focus:border-rellia-teal",
                          )}
                          type="email"
                          placeholder="founder@company.com"
                          value={memberInfo.email}
                          onChange={(e) =>
                            setMemberInfo((p) => ({
                              ...p,
                              email: e.target.value,
                            }))
                          }
                          inputMode="email"
                          autoComplete="email"
                        />
                        {errors.email && (
                          <p className="text-[10px] text-red-500 font-bold">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-rellia-teal/50">
                          What are you building?
                        </label>
                        <textarea
                          className={cn(
                            "w-full h-24 rounded-xl border p-3 text-sm focus:bg-white focus:outline-none resize-none transition-all",
                            errors.desc
                              ? "border-red-500 bg-red-50"
                              : "border-rellia-teal/10 bg-rellia-cream/30 focus:border-rellia-teal",
                          )}
                          placeholder="Brief description of your product and mission..."
                          value={memberInfo.desc}
                          onChange={(e) =>
                            setMemberInfo((p) => ({
                              ...p,
                              desc: e.target.value,
                            }))
                          }
                          maxLength={1200}
                        />
                        {errors.desc && (
                          <p className="text-[10px] text-red-500 font-bold">
                            {errors.desc}
                          </p>
                        )}
                      </div>
                    </div>

                    <RelliaAction
                      type="button"
                      variant="mintTealFill"
                      size="comfortable"
                      className="w-full justify-center shadow-lg transition-transform active:scale-[0.98] py-4 mt-6"
                      onClick={startSurvey}
                    >
                      {introStartButtonLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </RelliaAction>
                  </div>
                </div>

                <div className="mt-8 flex justify-center lg:justify-start">
                  <Link
                    to="/startup-diagnostic"
                    className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:text-rellia-teal/80 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Learn more about how it works
                  </Link>
                </div>
              </div>
            )}

            {/* ── SURVEY VIEW ── */}
            {view === "survey" && sec && currentQ && (
              <div
                key={`${currentSection}-${currentQIdx}`}
                className="animate-ds-up flex flex-col gap-8 md:gap-12"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rellia-mint text-rellia-teal">
                      {(() => {
                        const IconComponent = SECTION_ICONS[sec.id];
                        return IconComponent ? <IconComponent className="h-5 w-5" /> : sec.icon;
                      })()}
                    </span>
                    <div>
                      <h2 className="font-host-grotesk text-2xl font-bold text-rellia-teal md:text-3xl">
                        {sec.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-rellia-teal/60">{sec.desc}</p>
                </div>

                <div className="rounded-[28px] border border-rellia-teal/5 bg-white p-6 px-8 shadow-xl md:py-8 md:px-14">
                  <h3 className="mb-6 font-host-grotesk text-xl font-semibold leading-relaxed text-rellia-teal md:text-2xl">
                    {currentQ.text}
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {currentQ.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => selectAnswer(oi)}
                        disabled={transitioning}
                        className={`group relative flex flex-col items-start gap-4 rounded-2xl border-2 p-6 text-left transition-all duration-300 ${selectedOpt === oi ? "border-rellia-teal bg-rellia-teal text-white shadow-xl ring-4 ring-rellia-teal/10" : "border-rellia-teal/5 bg-rellia-cream/20 hover:border-rellia-teal/20 hover:bg-white hover:shadow-md"}`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold transition-colors ${selectedOpt === oi ? "bg-white/20 text-white" : "bg-rellia-teal/5 text-rellia-teal/40 group-hover:bg-rellia-teal/10 group-hover:text-rellia-teal"}`}
                        >
                          {selectedOpt === oi ? (
                            <CheckCircle2 className="h-6 w-6" />
                          ) : (
                            String.fromCharCode(65 + oi)
                          )}
                        </div>
                        <div className="space-y-1">
                          <div
                            className={`font-bold leading-tight ${selectedOpt === oi ? "text-white" : "text-rellia-teal"}`}
                          >
                            {opt.label}
                          </div>
                          {opt.desc && (
                            <div
                              className={`text-xs leading-relaxed ${selectedOpt === oi ? "text-white/70" : "text-rellia-teal/50"}`}
                            >
                              {opt.desc}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => {
                      if (currentQIdx > 0) setCurrentQIdx((i) => i - 1);
                      else if (currentSection > 0) {
                        setCurrentSection((i) => i - 1);
                        setCurrentQIdx(
                          sections[currentSection - 1].questions.length - 1,
                        );
                      } else goToIntro();
                    }}
                    className="flex h-12 items-center gap-2 rounded-full px-6 font-semibold text-rellia-teal/50 transition-all hover:bg-rellia-teal/5 hover:text-rellia-teal"
                  >
                    ← Back
                  </button>
                  <div className="hidden text-xs font-bold uppercase tracking-widest text-rellia-teal/30 md:block">
                    {answeredGlobal} / {totalQs} answered
                  </div>
                  <button
                    onClick={() => {
                      if (currentQIdx < sec.questions.length - 1)
                        setCurrentQIdx((i) => i + 1);
                      else if (currentSection < sections.length - 1)
                        goToSection(currentSection + 1);
                      else goToSubmit();
                    }}
                    className="flex h-12 items-center gap-2 rounded-full bg-rellia-teal px-8 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                  >
                    {currentSection === sections.length - 1 &&
                    currentQIdx === sec.questions.length - 1
                      ? "Finish →"
                      : "Skip →"}
                  </button>
                </div>
              </div>
            )}

            {/* ── SUBMIT VIEW ── */}
            {view === "submit" && (
              <div className="animate-ds-up flex flex-col gap-10">
                <div className="space-y-4">
                  <h2 className="font-host-grotesk text-3xl font-bold text-rellia-teal md:text-5xl">
                    {submitTitle}
                  </h2>
                  <p className="w-full text-rellia-teal/60">
                    {submitSubtitle}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 items-stretch">
                  <div className="rounded-[32px] border border-rellia-teal/10 bg-white p-8 shadow-sm flex flex-col h-full">
                    <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-rellia-teal">
                      {submitProfileTitle}
                    </h3>
                    <div className="space-y-2 flex-1">
                      {sections.map((s) => {
                        const sc = getSectionScore(s.id, answers, sections);
                        return (
                          <div
                            key={s.id}
                            className="flex items-center justify-between rounded-xl bg-rellia-cream/20 px-4 py-2 text-xs"
                          >
                            <span className="font-medium text-rellia-teal/80">
                              {s.title}
                            </span>
                            <span
                              className={`font-bold ${sc === null ? "text-rellia-teal/20" : scoreClass(sc)}`}
                            >
                              {sc !== null ? `${sc}%` : "—"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 h-full">
                    <div className="rounded-[32px] border border-rellia-teal/10 bg-rellia-mint/10 p-8 flex-1 flex flex-col justify-center">
                      <h3 className="mb-4 font-host-grotesk text-xl font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-rellia-teal" />
                        {submitGeneratingTitle}
                      </h3>
                      <p className="text-sm text-rellia-teal/70 leading-relaxed mb-6">
                        {submitGeneratingBody}
                      </p>
                      <div className="space-y-3">
                        {submitGeneratingBullets.map((l) => (
                          <div
                            key={l}
                            className="flex items-center gap-2 text-xs font-medium text-rellia-teal/80"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-rellia-teal" />
                            {l}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-rellia-teal/10 bg-white p-6">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-rellia-teal">
                        {submitDetailsTitle}
                      </h4>
                      <div className="mt-4 space-y-2 text-sm text-rellia-teal/70">
                        <p>
                          <span className="font-bold text-rellia-teal">Name:</span> {memberInfo.name}
                        </p>
                        <p>
                          <span className="font-bold text-rellia-teal">Email:</span> {memberInfo.email}
                        </p>
                        <p>
                          <span className="font-bold text-rellia-teal">Company:</span> {memberInfo.company}
                        </p>
                        <p>
                          <span className="font-bold text-rellia-teal">Stage:</span> {memberInfo.stage}
                        </p>
                      </div>
                    </div>

                    <RelliaAction
                      type="button"
                      variant="mintTealFill"
                      size="comfortable"
                      className="w-full justify-center shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                      onClick={() => {
                        const nextErrors = validateMemberInfo(memberInfo, stages)
                        if (Object.keys(nextErrors).length > 0) {
                          setErrors(nextErrors)
                          setView("intro")
                          return
                        }
                        submitSurvey()
                      }}
                    >
                      {submitConfirmButtonLabel}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </RelliaAction>
                  </div>
                </div>
              </div>
            )}

            {/* ── PROCESSING VIEW ── */}
            {view === "processing" && (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="animate-ds-spin mb-10 h-16 w-16 rounded-full border-4 border-rellia-teal/10 border-t-rellia-teal" />
                <h2 className="mb-4 font-host-grotesk text-3xl font-bold">
                  {processingTitle}
                </h2>
                <p className="mb-12 max-w-md text-rellia-teal/60">
                  {processingSubtitle}
                </p>

                <div className="w-full max-w-xs space-y-4">
                  {processingSteps.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 text-left transition-all duration-500"
                    >
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${procStep >= i ? "bg-green-500" : "bg-rellia-teal/10 animate-pulse"}`}
                      />
                      <span
                        className={`text-sm font-medium ${procStep >= i ? "text-rellia-teal" : "text-rellia-teal/20"}`}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── REPORT VIEW ── */}
            {view === "report" && diagResult && (() => {
              const thankYouText = (surveyCms?.reportHeaderThankYou || DEFAULT_REPORT_HEADER_THANK_YOU)
                .replace(/\{company\}/gi, memberInfo.company)
              const membershipTitle = surveyCms?.reportMembershipCtaTitle || DEFAULT_REPORT_MEMBERSHIP_CTA_TITLE
              const membershipBody = surveyCms?.reportMembershipCtaBody || DEFAULT_REPORT_MEMBERSHIP_CTA_BODY
              const reportDate = new Date().toLocaleDateString("en-CA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })

              const handlePrintReport = () => {
                window.print()
              }

              return (
                <div id="diagnostic-report" className="diagnostic-report animate-ds-up flex flex-col gap-12 pb-12">
                  <div className="diagnostic-print-only diagnostic-print-letterhead">
                    <img src="/images/logo-rellia-filled.webp" alt="Rellia Health" />
                    <div className="diagnostic-print-letterhead-title">STARTUP DIAGNOSTIC REPORT</div>
                  </div>

                  <div className="diagnostic-print-only diagnostic-report-header">
                    <h1>{memberInfo.company}</h1>
                    <div className="diagnostic-report-meta">
                      {memberInfo.stage} · {reportDate} · {memberInfo.name}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="diagnostic-screen-only flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                      <div>
                        <h1 className="font-host-grotesk text-4xl font-bold text-rellia-teal md:text-5xl">
                          {memberInfo.company}
                        </h1>
                        <div className="mt-2 text-sm font-medium text-rellia-teal/45">
                          {memberInfo.stage} · {reportDate}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              window.localStorage.removeItem(LOCAL_STORAGE_KEY)
                            } catch {
                              // ignore
                            }
                            setDiagResult(null)
                            setView("intro")
                          }}
                          className="group inline-flex items-center gap-1.5 text-sm font-bold text-rellia-teal"
                        >
                          <span className="group-hover:underline">Start over</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>

                    <div className="diagnostic-report-summary rounded-[32px] bg-gradient-to-br from-[#0d3540] via-rellia-teal to-[#144853] p-8 shadow-md md:p-10 relative overflow-hidden text-white">
                      <div className="diagnostic-screen-only absolute -right-8 -bottom-8 opacity-10 pointer-events-none select-none z-0">
                        <img
                          src="/images/hologram-logo.png"
                          alt=""
                          className="w-48 h-48 md:w-64 md:h-64 object-contain"
                        />
                      </div>
                      <p className="font-urbanist text-xl leading-relaxed text-white/90 md:text-2xl relative z-10">
                        {thankYouText}
                      </p>
                    </div>
                  </div>

                  <div className="diagnostic-print-stack space-y-12">
                    {/* Strengths */}
                    <section className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-green-700 flex items-center gap-2">
                          <CheckCircle2 className="diagnostic-screen-only h-4 w-4" />
                          {surveyCms?.reportStrengthsTitle || DEFAULT_REPORT_STRENGTHS_TITLE}
                        </h2>
                        <span className="diagnostic-section-note text-xs font-urbanist font-medium text-black text-left sm:text-right">
                          Above-average readiness compared to your other domains.
                        </span>
                      </div>
                      <div className="diagnostic-card-grid grid gap-4 sm:grid-cols-3">
                        {(diagResult.top3_strengths ?? []).map((s, i) => (
                          <div
                            key={i}
                            className="diagnostic-card diagnostic-card-strength rounded-3xl border border-green-100 bg-green-50/50 p-6 shadow-sm flex flex-col justify-center min-h-[92px]"
                          >
                            <div className="flex flex-col items-start gap-2">
                              <div className="diagnostic-card-badge shrink-0 rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-700">
                                {s.score}%
                              </div>
                              <h3 className="font-host-grotesk text-lg font-bold tracking-tight text-green-900">
                                {s.category}
                              </h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Weaknesses */}
                    <section className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-red-700 flex items-center gap-2">
                          <AlertTriangle className="diagnostic-screen-only h-4 w-4" />
                          {surveyCms?.reportGapsTitle || DEFAULT_REPORT_GAPS_TITLE}
                        </h2>
                        <span className="diagnostic-section-note text-xs font-urbanist font-medium text-black text-left sm:text-right">
                          Likely bottlenecks—tighten these before scaling execution or diligence.
                        </span>
                      </div>
                      <div className="diagnostic-card-grid grid gap-4 sm:grid-cols-3">
                        {(diagResult.top3_weaknesses ?? []).map((w, i) => (
                          <div
                            key={i}
                            className="diagnostic-card diagnostic-card-gap rounded-3xl border border-red-100 bg-red-50/50 p-6 shadow-sm flex flex-col justify-center min-h-[92px]"
                          >
                            <div className="flex flex-col items-start gap-2">
                              <div className="diagnostic-card-badge shrink-0 rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-700">
                                {w.priority}
                              </div>
                              <h3 className="font-host-grotesk text-lg font-bold tracking-tight text-red-900">
                                {w.category}
                              </h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Full readiness breakdown (Detailed Assessment) */}
                    <section className="diagnostic-print-breakdown-section space-y-4">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-rellia-teal">
                        {surveyCms?.reportFullBreakdownTitle || DEFAULT_REPORT_FULL_BREAKDOWN_TITLE}
                      </h2>
                      <div className="diagnostic-breakdown-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sections.map((s) => {
                          const sc = getSectionScore(s.id, answers, sections) ?? 0;
                          return (
                            <div
                              key={s.id}
                              className="diagnostic-breakdown-item rounded-3xl border border-rellia-teal/10 bg-white p-6 shadow-sm"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0 flex-1 font-host-grotesk text-base font-bold text-rellia-teal">
                                  {s.title}
                                </div>
                                <div className={cn("diagnostic-score text-base font-black shrink-0", scoreClass(sc))}>
                                  {sc}%
                                </div>
                              </div>
                              <div className="diagnostic-breakdown-bar mt-4 h-1.5 w-full overflow-hidden rounded-full bg-rellia-teal/5">
                                <div
                                  className={cn("diagnostic-breakdown-bar-fill h-full transition-all duration-1000", scoreBarClass(sc))}
                                  style={{ width: `${sc}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    <div className="diagnostic-print-page-two space-y-12">
                    {/* Roadmap + Program Matches */}
                    <section className="grid gap-6 md:grid-cols-2 items-stretch">
                      {/* Roadmap action block */}
                      <div className="diagnostic-roadmap-block rounded-[32px] border border-rellia-teal/10 bg-white p-8 shadow-sm flex flex-col h-full">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-rellia-teal">
                          {surveyCms?.reportRoadmapTitle || DEFAULT_REPORT_ROADMAP_TITLE}
                        </h2>
                        <div className="mt-6 flex flex-col gap-8 flex-1">
                          {diagResult.recommendations.map((r, i) => (
                            <div key={i} className="diagnostic-roadmap-step flex gap-4 relative z-10 items-start">
                              <div className="relative flex flex-col items-center self-stretch">
                                <div className="diagnostic-roadmap-num flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rellia-mint text-rellia-teal text-xs font-black shadow-sm z-10">
                                  {i + 1}
                                </div>
                                {i < diagResult.recommendations.length - 1 && (
                                  <div className="diagnostic-roadmap-line absolute top-4 left-4 w-[2px] h-[calc(100%+2rem)] -translate-x-1/2 bg-rellia-mint z-0" />
                                )}
                              </div>
                              <p className="font-urbanist text-sm font-medium leading-relaxed text-rellia-teal/80 pt-1.5">
                                {r}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Suggested programs block */}
                      <div className="diagnostic-print-hide rounded-[32px] border border-rellia-teal/10 bg-white p-8 shadow-sm flex flex-col h-full">
                        <div className="flex items-center justify-between gap-4">
                          <h2 className="text-xs font-bold uppercase tracking-widest text-rellia-teal">
                            {surveyCms?.reportProgramsTitle || DEFAULT_REPORT_PROGRAMS_TITLE}
                          </h2>
                          <Link
                            to="/programs"
                            className="text-[10px] font-bold uppercase tracking-widest text-rellia-teal/60 hover:text-rellia-teal transition-colors"
                          >
                            View all programs →
                          </Link>
                        </div>

                        <div className="mt-6 grid gap-4">
                          {recommendedPrograms.map((prog, i) => {
                            const href = prog?.programHref || "/programs"
                            const meta = PROGRAM_META_BY_HREF[href]
                            return (
                              <Link
                                key={i}
                                to={href}
                                className="group flex items-center justify-between gap-4 rounded-3xl border border-rellia-teal/5 bg-rellia-cream/10 px-5 py-4 transition-[transform,box-shadow] hover:shadow-md hover:-translate-y-[1px]"
                              >
                                <div className="flex items-center gap-4 min-w-0">
                                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-rellia-teal/10 bg-rellia-cream">
                                    {meta?.imageSrc ? (
                                      <img
                                        src={meta.imageSrc}
                                        alt={meta.imageAlt || meta.title}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="h-full w-full" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-host-grotesk text-sm font-bold tracking-tight text-black">
                                      {meta?.title || prog?.program || "Program"}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rellia-teal/5 group-hover:bg-rellia-teal/10 transition-colors">
                                  <ChevronRight className="h-4 w-4 text-rellia-teal/40 group-hover:text-rellia-teal/70 transition-colors" />
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </section>

                    <section className="diagnostic-print-only diagnostic-print-programs">
                      <h2>{surveyCms?.reportProgramsTitle || DEFAULT_REPORT_PROGRAMS_TITLE}</h2>
                      <ul>
                        {recommendedPrograms.map((prog, i) => {
                          const href = prog?.programHref || "/programs"
                          const meta = PROGRAM_META_BY_HREF[href]
                          return (
                            <li key={i}>
                              {meta?.title || prog?.program || "Program"} — relliahealth.com{href}
                            </li>
                          )
                        })}
                      </ul>
                    </section>

                    {/* Custom Advisory Board (LinkedIn-style locked) + Membership CTA */}
                    <section className="grid gap-6 md:grid-cols-2 items-stretch">
                      {/* LinkedIn-style Advisors block */}
                      <div className="diagnostic-print-hide rounded-[32px] border border-rellia-teal/10 bg-white p-8 shadow-sm flex flex-col h-full">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-rellia-teal">
                          {surveyCms?.reportAdvisorsTitle || DEFAULT_REPORT_ADVISORS_TITLE}
                        </h2>
                        <p className="mt-2 text-xs leading-relaxed text-rellia-teal/60">
                          Matches based on your top 3 priorities. Join Rellia Health to unlock direct access.
                        </p>
                        <div className="mt-6 flex flex-col gap-4 flex-1">
                          {diagResult.top3_weaknesses.map((w, i) => {
                            const dummyPhoto = DUMMY_HEADSHOTS[i % DUMMY_HEADSHOTS.length];
                            const categoryTitle = w.category;
                            
                            // Derive specialized advisor title
                            let advisorTitle = `${categoryTitle} Advisor`;
                            if (categoryTitle.toLowerCase().includes("ip") || categoryTitle.toLowerCase().includes("intellectual")) {
                              advisorTitle = "IP Strategy Advisor";
                            } else if (categoryTitle.toLowerCase().includes("regulatory")) {
                              advisorTitle = "Regulatory Strategy Advisor";
                            } else if (categoryTitle.toLowerCase().includes("clinical")) {
                              advisorTitle = "Clinical Evidence Advisor";
                            } else if (categoryTitle.toLowerCase().includes("design")) {
                              advisorTitle = "UX & Product Design Advisor";
                            } else if (categoryTitle.toLowerCase().includes("dev") || categoryTitle.toLowerCase().includes("engineering")) {
                              advisorTitle = "Quality Systems Specialist";
                            } else if (categoryTitle.toLowerCase().includes("reimbursement")) {
                              advisorTitle = "Reimbursement Strategy Advisor";
                            } else if (categoryTitle.toLowerCase().includes("fundraising")) {
                              advisorTitle = "Healthcare Investor / Partner";
                            }
                            
                            return (
                              <div
                                key={i}
                                className="group flex items-center justify-between gap-4 rounded-3xl border border-rellia-teal/5 bg-rellia-cream/10 px-5 py-4"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-rellia-teal/10">
                                    <img
                                      src={dummyPhoto}
                                      alt="Blurred Advisor Match"
                                      className="h-full w-full object-cover filter blur-[5px] scale-110"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="blur-[3px] select-none text-sm font-bold text-rellia-teal/80">
                                        Advisor Name
                                      </span>
                                      <span className="shrink-0 rounded bg-rellia-mint/20 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-rellia-teal/70">
                                        Vetted
                                      </span>
                                    </div>
                                    <div className="mt-0.5 text-xs font-semibold text-rellia-teal/70">
                                      {advisorTitle}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rellia-teal/5">
                                  <Lock className="h-4 w-4 text-rellia-teal/40" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Join the membership CTA block */}
                      <div className="diagnostic-print-hide rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-end min-h-[420px]">
                        <img
                          src={surveyCms?.reportMembershipCtaImageSrc || "https://images.pexels.com/photos/3783725/pexels-photo-3783725.jpeg?auto=compress&cs=tinysrgb&w=1200"}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div
                          aria-hidden
                          className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-[#0d3540] via-[#0d3540]/90 to-transparent z-0"
                        />
                        <div className="relative z-10 space-y-5">
                          <div>
                            <h2 className="font-host-grotesk text-xl md:text-2xl font-normal leading-snug text-white">
                              {membershipTitle}
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-white/80">
                              {membershipBody}
                            </p>
                          </div>
                          <RelliaAction
                            asChild
                            variant="heroSolidOnTeal"
                            size="comfortable"
                            className="w-full justify-center transition-transform active:scale-95 relative z-10 mt-0"
                          >
                            <Link to="/apply">
                              {surveyCms?.reportMembershipCtaButton || DEFAULT_REPORT_MEMBERSHIP_CTA_BUTTON}
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </RelliaAction>
                        </div>
                      </div>
                    </section>

                    <section className="diagnostic-print-only diagnostic-membership-print">
                      <h2>{membershipTitle}</h2>
                      <p>{membershipBody}</p>
                      <p>
                        This summary report covers your top strengths, priority gaps, and high-level roadmap.
                        Join Rellia Health membership to unlock your full gap analysis, custom advisory board matches,
                        and personalized action plan.
                      </p>
                      <p>
                        Apply at{" "}
                        <a href="https://www.relliahealth.com/apply">relliahealth.com/apply</a>
                      </p>
                    </section>
                    </div>

                    <div className="diagnostic-print-only diagnostic-print-footer">
                      Rellia Health · Startup Diagnostic · Generated {reportDate} · relliahealth.com
                    </div>

                    <div className="diagnostic-screen-only pt-2 text-center">
                      <RelliaAction
                        type="button"
                        variant="outlineOnWhite"
                        size="comfortable"
                        className="mx-auto w-full max-w-md justify-center border-rellia-teal/20"
                        onClick={handlePrintReport}
                      >
                        <Printer className="mr-2 h-5 w-5" />
                        Print / Save as PDF
                      </RelliaAction>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </main>
      </div>

      <div className="diagnostic-screen-only relative z-30 mt-16 md:mt-20">
        <Footer />
      </div>
    </div>
  );
}
