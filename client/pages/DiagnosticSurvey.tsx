import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Menu,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Calendar,
  Building2,
  Target,
  Sparkles,
  Search,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction";
import NetworkEyebrow from "@/components/network/NetworkEyebrow";
import RouteSeo from "@/components/RouteSeo";
import { useAdvisors } from "@/hooks/useCmsDocuments";
import { ADVISOR_DIRECTORY_SEED } from "@/data/advisorDirectory";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Option {
  label: string;
  desc: string;
  score: number;
}
interface Question {
  text: string;
  type: "confidence" | "progress" | "applicability" | "knowledge";
  options: Option[];
}
interface Section {
  id: string;
  icon: string;
  title: string;
  desc: string;
  questions: Question[];
}
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
}

type View = "intro" | "survey" | "submit" | "processing" | "report";

// ─── DATA MAP ────────────────────────────────────────────────────────────────

const DATA_MAP: Record<
  string,
  { mentor: string; program: string; programHref?: string }
> = {
  product_design: {
    mentor: "UX & Product Design",
    program: "Prototype Lab",
    programHref: "/programs/prototype-lab",
  },
  product_dev: {
    mentor: "Engineering",
    program: "Build Your QMS",
    programHref: "/programs/qms",
  },
  clinical: {
    mentor: "Clinical Affairs",
    program: "Regulatory Roadmap",
    programHref: "/programs/regulatory",
  },
  regulatory: {
    mentor: "Regulatory",
    program: "Regulatory Roadmap",
    programHref: "/programs/regulatory",
  },
  legal: {
    mentor: "Legal & Privacy",
    program: "Regulatory Roadmap",
    programHref: "/programs/regulatory",
  },
  ip: {
    mentor: "Intellectual Property",
    program: "Advance Dataroom",
    programHref: "/programs/dataroom",
  },
  reimbursement: {
    mentor: "Reimbursement",
    program: "Regulatory Roadmap",
    programHref: "/programs/regulatory",
  },
  fundraising: {
    mentor: "Fundraising",
    program: "Elevate Capital",
    programHref: "/programs/elevate-capital",
  },
  marketing: {
    mentor: "Marketing",
    program: "Brand Strategy",
    programHref: "/programs/brand",
  },
  gtm: {
    mentor: "Commercial Strategy",
    program: "First 50 Users",
    programHref: "/programs/first-50",
  },
  healthcare: {
    mentor: "Health Systems",
    program: "Advisory Board Match",
    programHref: "/programs/advisory-board-match",
  },
  customer_success: {
    mentor: "Customer Success",
    program: "First 50 Users",
    programHref: "/programs/first-50",
  },
  operations: {
    mentor: "Operations",
    program: "Ignite Pitch",
    programHref: "/programs/ignite-pitch",
  },
};

// ─── QUESTION DATA ───────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    id: "product_design",
    icon: "✦",
    title: "Product Design & UI/UX",
    desc: "How well do you understand who you're building for and whether your product actually works for them?",
    questions: [
      {
        text: "How well do you understand the real-world workflow your product replaces or disrupts?",
        type: "confidence",
        options: [
          {
            label: "We haven't mapped this yet",
            desc: "Still focused on building the product itself",
            score: 0,
          },
          {
            label: "We have a general sense of it",
            desc: "Based on assumptions or desk research",
            score: 33,
          },
          {
            label: "We've mapped it with input from users",
            desc: "We've observed or interviewed people in that workflow",
            score: 67,
          },
          {
            label: "We know it deeply",
            desc: "Every handoff, pain point, and workaround — in detail",
            score: 100,
          },
        ],
      },
      {
        text: "What's the current state of your usability testing?",
        type: "progress",
        options: [
          {
            label: "We haven't done any yet",
            desc: "Testing is on the roadmap but hasn't happened",
            score: 0,
          },
          {
            label: "We've done informal testing",
            desc: "Friends, colleagues, or a couple of early users",
            score: 33,
          },
          {
            label: "We've tested with real target users",
            desc: "People who match our intended user profile",
            score: 67,
          },
          {
            label: "We test regularly and act on findings",
            desc: "Usability is an ongoing part of our development cycle",
            score: 100,
          },
        ],
      },
      {
        text: "Have you separately interviewed your primary user, economic buyer, and decision-maker?",
        type: "knowledge",
        options: [
          {
            label: "I'm not sure these are different people for us",
            desc: "We haven't thought through these roles yet",
            score: 0,
          },
          {
            label: "We've only spoken to one of these groups",
            desc: "Usually the end user, not the buyer or approver",
            score: 25,
          },
          {
            label: "We've spoken to two of the three",
            desc: "Some gaps remain in our stakeholder understanding",
            score: 67,
          },
          {
            label: "Yes — all three, and we understand each perspective",
            desc: "We know how their priorities align and conflict",
            score: 100,
          },
        ],
      },
      {
        text: "Do you have documented usability requirements separate from functional requirements?",
        type: "progress",
        options: [
          {
            label: "No — we don't have formal requirements yet",
            desc: "Everything is still informal",
            score: 0,
          },
          {
            label: "We have functional requirements but not usability ones",
            desc: "We know what it needs to do, not how it needs to feel",
            score: 33,
          },
          {
            label: "We're working on this",
            desc: "Partially documented or in progress",
            score: 67,
          },
          {
            label: "Yes — both documented and maintained",
            desc: "We treat usability as a first-class requirement",
            score: 100,
          },
        ],
      },
      {
        text: "How independently can a new user onboard with your product today?",
        type: "confidence",
        options: [
          {
            label: "They can't — we walk everyone through it",
            desc: "Onboarding requires our direct involvement",
            score: 0,
          },
          {
            label: "They can start but often get stuck",
            desc: "We get a lot of the same questions",
            score: 33,
          },
          {
            label: "Most users can onboard without help",
            desc: "Occasional edge cases need support",
            score: 67,
          },
          {
            label: "Fully self-serve — and we've validated this",
            desc: "We've watched real users onboard without guidance",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "product_dev",
    icon: "◈",
    title: "Product Development",
    desc: "How structured and traceable is your development process?",
    questions: [
      {
        text: "What's the current state of your product requirements documentation?",
        type: "progress",
        options: [
          {
            label: "It's all in our heads right now",
            desc: "Nothing formally written down",
            score: 0,
          },
          {
            label: "We have informal notes or a shared doc",
            desc: "Not structured, but something exists",
            score: 33,
          },
          {
            label:
              "We have defined requirements, but they lag behind what we've built",
            desc: "Documentation isn't always current",
            score: 67,
          },
          {
            label: "Requirements are documented, versioned, and up to date",
            desc: "We maintain them as a living reference",
            score: 100,
          },
        ],
      },
      {
        text: "How well does your version control connect requirements, code, and testing?",
        type: "progress",
        options: [
          {
            label: "We don't have version control in place yet",
            desc: "No formal process connecting these three",
            score: 0,
          },
          {
            label: "We use version control for code only",
            desc: "Requirements and tests aren't connected",
            score: 33,
          },
          {
            label: "We're working toward a connected system",
            desc: "Improving but still some gaps",
            score: 67,
          },
          {
            label: "All three are versioned and traceable to each other",
            desc: "Any feature can be traced from requirement to test result",
            score: 100,
          },
        ],
      },
      {
        text: "How do you manage changes to requirements once development has started?",
        type: "knowledge",
        options: [
          {
            label: "We just talk about them and update the code",
            desc: "Informal change management",
            score: 0,
          },
          {
            label: "We update docs but don't always track the why",
            desc: "Documentation updates without rationale",
            score: 33,
          },
          {
            label: "We have a process but it's occasionally bypassed",
            desc: "Formal process exists but lacks discipline",
            score: 67,
          },
          {
            label: "Formal change control — impacts are assessed before coding",
            desc: "Changes are deliberate and documented",
            score: 100,
          },
        ],
      },
      {
        text: "How do you ensure that all requirements have been tested before a release?",
        type: "progress",
        options: [
          {
            label: "We test what we think is important",
            desc: "Ad-hoc testing approach",
            score: 0,
          },
          {
            label: "We have a checklist of major features",
            desc: "High-level validation",
            score: 33,
          },
          {
            label: "We map tests to requirements manually",
            desc: "Better coverage but prone to error",
            score: 67,
          },
          {
            label: "Full traceability matrix from requirements to test results",
            desc: "Complete confidence in coverage",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "clinical",
    icon: "✚",
    title: "Clinical Evidence",
    desc: "Is your product's value grounded in clinical reality?",
    questions: [
      {
        text: "How clearly have you defined the clinical endpoints your product aims to impact?",
        type: "confidence",
        options: [
          {
            label: "We have a general idea but nothing specific",
            desc: "End-goals are vague",
            score: 0,
          },
          {
            label: "We know our main goal but haven't defined metrics",
            desc: "Directional but not measurable",
            score: 33,
          },
          {
            label: "We have specific, measurable clinical endpoints defined",
            desc: "Clear metrics for success",
            score: 67,
          },
          {
            label: "Endpoints are defined and validated with clinical experts",
            desc: "Rigorous, expert-backed targets",
            score: 100,
          },
        ],
      },
      {
        text: "What is your plan for clinical validation?",
        type: "progress",
        options: [
          {
            label: "We haven't started planning this yet",
            desc: "Validation is a future concern",
            score: 0,
          },
          {
            label: "We know we need a study but don't have a protocol",
            desc: "Concept exists without a plan",
            score: 33,
          },
          {
            label: "We have a draft clinical evaluation plan (CEP)",
            desc: "Planning is underway",
            score: 67,
          },
          {
            label: "Protocol is finalised and we're preparing for execution",
            desc: "Ready to begin formal validation",
            score: 100,
          },
        ],
      },
      {
        text: "How well does your current product data support your clinical claims?",
        type: "confidence",
        options: [
          {
            label: "We haven't collected data for claims yet",
            desc: "No evidence base yet",
            score: 0,
          },
          {
            label: "We have some pilot data but it's limited",
            desc: "Early signal only",
            score: 33,
          },
          {
            label: "We have strong pilot or real-world data",
            desc: "Good evidence for our claims",
            score: 67,
          },
          {
            label: "We have peer-reviewed or pivotal study data",
            desc: "Decision-grade evidence",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "regulatory",
    icon: "◎",
    title: "Regulatory Strategy",
    desc: "Do you have a clear path through the regulatory maze?",
    questions: [
      {
        text: "How certain are you of your product's regulatory classification?",
        type: "confidence",
        options: [
          {
            label: "We haven't looked into this yet",
            desc: "Regulatory status is unknown",
            score: 0,
          },
          {
            label: "We have an idea but haven't confirmed it",
            desc: "Internal assumption only",
            score: 33,
          },
          {
            label: "We've had an initial assessment by an expert",
            desc: "Professional opinion obtained",
            score: 67,
          },
          {
            label: "We have formal confirmation or a very clear path",
            desc: "Classification is certain",
            score: 100,
          },
        ],
      },
      {
        text: "What is the status of your Quality Management System (QMS)?",
        type: "progress",
        options: [
          {
            label: "We don't have a QMS yet",
            desc: "No formal quality structure",
            score: 0,
          },
          {
            label: "We have some SOPs but not a full system",
            desc: "Fragmented quality processes",
            score: 33,
          },
          {
            label: "QMS is mostly implemented and we're using it",
            desc: "Operational quality system",
            score: 67,
          },
          {
            label: "Full QMS implemented and ready for audit/certification",
            desc: "Audit-ready quality system",
            score: 100,
          },
        ],
      },
      {
        text: "How well is your technical file/documentation structured for submission?",
        type: "progress",
        options: [
          {
            label: "We haven't started the technical file",
            desc: "No submission materials ready",
            score: 0,
          },
          {
            label: "We have some parts ready but it's messy",
            desc: "Incomplete and unorganised",
            score: 33,
          },
          {
            label: "The file is mostly complete and structured",
            desc: "Solid foundation for submission",
            score: 67,
          },
          {
            label: "Submission-ready technical file with full traceability",
            desc: "Complete and professional documentation",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "legal",
    icon: "⚖",
    title: "Legal & Privacy",
    desc: "Are you protecting your company and your users' data?",
    questions: [
      {
        text: "How robust is your data privacy and security framework?",
        type: "confidence",
        options: [
          {
            label: "We haven't formalised this yet",
            desc: "Security is ad-hoc",
            score: 0,
          },
          {
            label: "We have basic policies in place",
            desc: "Compliance is surface-level",
            score: 33,
          },
          {
            label: "We are compliant with major standards (HIPAA, GDPR, etc.)",
            desc: "Formal compliance achieved",
            score: 67,
          },
          {
            label: "Privacy-by-design and regular third-party audits",
            desc: "Security is a core competency",
            score: 100,
          },
        ],
      },
      {
        text: "Are your core contracts (Employment, IP, Founders) fully executed?",
        type: "progress",
        options: [
          {
            label: "Some are missing or incomplete",
            desc: "Legal loose ends remain",
            score: 0,
          },
          {
            label: "Most are done but a few remain",
            desc: "Nearly there",
            score: 67,
          },
          {
            label: "All core contracts are fully executed and filed",
            desc: "Clean legal foundation",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "ip",
    icon: "℗",
    title: "IP Strategy",
    desc: "Have you protected what makes you unique?",
    questions: [
      {
        text: "What is the status of your patent or IP protection strategy?",
        type: "progress",
        options: [
          {
            label: "We haven't filed anything yet",
            desc: "IP is currently unprotected",
            score: 0,
          },
          {
            label: "We have filed provisionals",
            desc: "Initial protection secured",
            score: 33,
          },
          {
            label: "We have a clear IP roadmap and multiple filings",
            desc: "Strategic IP portfolio",
            score: 67,
          },
          {
            label: "Granted patents or a very strong, defensible position",
            desc: "IP is a major asset",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "reimbursement",
    icon: "$",
    title: "Reimbursement",
    desc: "How will you actually get paid?",
    questions: [
      {
        text: "How clearly have you identified your primary reimbursement pathway?",
        type: "confidence",
        options: [
          {
            label: "We haven't figured this out yet",
            desc: "Revenue model is uncertain",
            score: 0,
          },
          {
            label: "We have a few potential paths but no clear winner",
            desc: "Exploring options",
            score: 33,
          },
          {
            label: "We have a clear, primary pathway identified",
            desc: "Targeted reimbursement model",
            score: 67,
          },
          {
            label: "Pathway is validated with payers or experts",
            desc: "Proven route to revenue",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "fundraising",
    icon: "▲",
    title: "Fundraising",
    desc: "Are you ready for the scrutiny of healthcare investors?",
    questions: [
      {
        text: "How complete is your investor dataroom?",
        type: "progress",
        options: [
          {
            label: "We don't have a dataroom yet",
            desc: "No materials prepared for due diligence",
            score: 0,
          },
          {
            label: "Basic deck and some docs are ready",
            desc: "Initial materials only",
            score: 33,
          },
          {
            label: "Comprehensive dataroom is nearly complete",
            desc: "Most diligence items covered",
            score: 67,
          },
          {
            label:
              "Full, audit-ready dataroom with all healthcare-specific items",
            desc: "Ready for deep-dive diligence today",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "marketing",
    icon: "◈",
    title: "Marketing & Branding",
    desc: "Does your brand resonate with healthcare stakeholders?",
    questions: [
      {
        text: "How well-defined is your brand positioning in the healthcare market?",
        type: "confidence",
        options: [
          {
            label: "We have a logo but no clear positioning",
            desc: "Branding is surface-level",
            score: 0,
          },
          {
            label: "We have a value prop but it's generic",
            desc: "Not specific enough for healthcare",
            score: 33,
          },
          {
            label: "Positioning is specific to our key stakeholders",
            desc: "Resonant branding",
            score: 67,
          },
          {
            label: "Positioning is validated and consistently applied",
            desc: "Brand is a differentiator",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "gtm",
    icon: "⚑",
    title: "Go-To-Market",
    desc: "How will you reach and win your first customers?",
    questions: [
      {
        text: "How specific is your target customer profile (Ideal Customer Profile)?",
        type: "confidence",
        options: [
          {
            label: 'We target "hospitals" or "doctors" generally',
            desc: "Too broad to be actionable",
            score: 0,
          },
          {
            label: "We've narrowed it down to a specific department/role",
            desc: "Better focus",
            score: 33,
          },
          {
            label: "We have a detailed ICP including pain points and budget",
            desc: "Highly targeted",
            score: 67,
          },
          {
            label: "ICP is validated by initial sales or deep discovery",
            desc: "We know exactly who we're selling to",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "healthcare",
    icon: "⚙",
    title: "Health System Navigation",
    desc: "Do you understand the complexity of institutional sales?",
    questions: [
      {
        text: "How well do you understand the procurement process of your target customers?",
        type: "knowledge",
        options: [
          {
            label: "We don't know how they buy yet",
            desc: "Sales process is a black box",
            score: 0,
          },
          {
            label: "We have a high-level sense of it",
            desc: "General understanding",
            score: 33,
          },
          {
            label: "We've mapped the decision-makers and timeline",
            desc: "Detailed sales map",
            score: 67,
          },
          {
            label: "We've navigated it at least once or have expert guidance",
            desc: "Proven ability to close",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "customer_success",
    icon: "♡",
    title: "Customer Success",
    desc: "How do you ensure users stay and grow with you?",
    questions: [
      {
        text: "What metrics are you using to measure product success for your users?",
        type: "confidence",
        options: [
          {
            label: "We aren't tracking success metrics yet",
            desc: "User impact is unmeasured",
            score: 0,
          },
          {
            label: "We track basic usage/engagement",
            desc: "Measuring activity, not value",
            score: 33,
          },
          {
            label: "We track metrics that align with user value",
            desc: "Measuring what matters to users",
            score: 67,
          },
          {
            label: "Metrics are tied to ROI or clinical outcomes",
            desc: "Demonstrable value for the customer",
            score: 100,
          },
        ],
      },
    ],
  },
  {
    id: "operations",
    icon: "▣",
    title: "Operations & Scaling",
    desc: "Whether your business can actually grow without breaking.",
    questions: [
      {
        text: "How aware are you of the manual processes in your business that won't scale?",
        type: "confidence",
        options: [
          {
            label: "We haven't thought about this systematically",
            desc: "Scaling constraints haven't been mapped",
            score: 0,
          },
          {
            label:
              "We're aware of some bottlenecks but haven't documented them",
            desc: "We know things will need to change but haven't planned it",
            score: 33,
          },
          {
            label: "We've identified key manual processes and have a plan",
            desc: "Automation or delegation paths are being worked on",
            score: 67,
          },
          {
            label:
              "We've already addressed scaling bottlenecks or are actively doing so",
            desc: "Operations are being built for scale proactively",
            score: 100,
          },
        ],
      },
      {
        text: "How clearly have you defined the roles you need in the next 12 months?",
        type: "progress",
        options: [
          {
            label: "We haven't thought ahead to next year's team needs",
            desc: "Hiring plans are reactive rather than planned",
            score: 0,
          },
          {
            label:
              "We know we'll need to hire but haven't defined specific roles",
            desc: "Headcount growth is vague",
            score: 33,
          },
          {
            label: "We've defined priority roles and roughly when we need them",
            desc: "A hiring roadmap exists",
            score: 67,
          },
          {
            label:
              "Hiring plans are specific, budgeted, and tied to our growth model",
            desc: "We know exactly who we need and when",
            score: 100,
          },
        ],
      },
      {
        text: "How well do you understand your unit economics — now and at scale?",
        type: "confidence",
        options: [
          {
            label: "We haven't modelled our unit economics yet",
            desc: "CAC, LTV, margins are undefined",
            score: 0,
          },
          {
            label: "Rough estimates but we don't trust the numbers yet",
            desc: "Modelled but not grounded in real data",
            score: 33,
          },
          {
            label:
              "We understand our current unit economics and have a scaling model",
            desc: "Numbers are based on real experience",
            score: 67,
          },
          {
            label:
              "Unit economics are well understood, stress-tested, and improving",
            desc: "We can articulate exactly how the model gets better at scale",
            score: 100,
          },
        ],
      },
    ],
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getSectionScore(secId: string, answers: Answers): number | null {
  const sec = SECTIONS.find((s) => s.id === secId);
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

const validateMemberInfo = (info: MemberInfo): Record<string, string> => {
  const next: Record<string, string> = {}

  if (!info.name.trim()) next.name = "Name is required"
  if (!info.company.trim()) next.company = "Company name is required"

  const email = info.email.trim()
  if (!email) {
    next.email = "Email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    next.email = "Enter a valid email address"
  }

  if (!info.desc.trim()) next.desc = "Description is required"

  return next
}

const isMemberInfoValid = (info: MemberInfo): boolean =>
  Object.keys(validateMemberInfo(info)).length === 0

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

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = `
@keyframes ds-spin { to { transform: rotate(360deg); } }
.animate-ds-spin { animation: ds-spin 0.8s linear infinite; }
@keyframes ds-fade-in-up { 
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-ds-up { animation: ds-fade-in-up 0.3s ease-out forwards; }
`;

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
    stage: STAGES[0],
    email: "",
    desc: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [diagResult, setDiagResult] = useState<DiagResult | null>(null);
  const [procStep, setProcStep] = useState(0);

  // CMS Hooks
  const { data: cmsAdvisors } = useAdvisors();

  const advisors = useMemo(() => {
    return cmsAdvisors && cmsAdvisors.length > 0
      ? cmsAdvisors
      : ADVISOR_DIRECTORY_SEED;
  }, [cmsAdvisors]);

  const completedSections = SECTIONS.filter(
    (s) =>
      answers[s.id] && Object.keys(answers[s.id]).length === s.questions.length,
  ).length;
  const progress = Math.round((completedSections / SECTIONS.length) * 100);
  const totalQs = SECTIONS.reduce((a, s) => a + s.questions.length, 0);
  const answeredGlobal = SECTIONS.reduce(
    (a, s) => a + Object.keys(answers[s.id] ?? {}).length,
    0,
  );

  const sec = SECTIONS[currentSection];
  const secAnswers = answers[sec?.id ?? ""] ?? {};
  const currentQ = sec?.questions[currentQIdx];
  const selectedOpt =
    secAnswers[currentQIdx] !== undefined ? secAnswers[currentQIdx] : -1;

  const goToSection = (i: number) => {
    if (!isMemberInfoValid(memberInfo)) {
      setErrors(validateMemberInfo(memberInfo))
      setView("intro")
      return
    }
    setCurrentSection(i);
    setCurrentQIdx(0);
    setView("survey");
  };
  const goToIntro = () => setView("intro");
  const startSurvey = () => {
    const newErrors = validateMemberInfo(memberInfo)
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
      } else if (currentSection < SECTIONS.length - 1) {
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
    const scores: string[] = SECTIONS.map((s) => {
      const sc = getSectionScore(s.id, answers) ?? 0;
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
      const res = await fetch("/api/diagnostic-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const report = await (async () => {
        try {
          return await res.json()
        } catch {
          const text = await res.text().catch(() => "")
          return { error: "NON_JSON_RESPONSE", message: text }
        }
      })()

      if (!res.ok) {
        // Detailed error for admins
        if (
          report.error === "MISSING_ENV_VARS" ||
          report.error === "SANITY_ERROR"
        ) {
          throw new Error(
            `ADMIN_CONFIG_ERROR: ${report.message || "Check SANITY_WRITE_TOKEN"}`,
          );
        }
        throw new Error(report.message || "API failed");
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

      const isAdminError = err.message.includes("ADMIN_CONFIG_ERROR");

      setDiagResult({
        summary: isAdminError
          ? `[ADMIN ERROR] ${err.message}. Please ensure SANITY_WRITE_TOKEN is correctly set in your environment variables.`
          : `We encountered an issue generating your report, but here is your basic assessment. Based on your inputs, ${memberInfo.company} has specific opportunities for growth in several domains.`,
        top3_strengths: [
          {
            category: "Assessment Complete",
            score: 100,
            note: "You have successfully mapped your startup across 13 domains.",
          },
        ],
        top3_weaknesses: [
          {
            category: "Review Needed",
            score: 30,
            priority: "High",
            note: "Consider a 1:1 session with a Rellia advisor to dive deeper into your results.",
          },
        ],
        recommendations: [
          "Schedule a discovery call with Rellia",
          "Review your lowest scoring sections",
        ],
        mentor_areas_needed: ["General Strategy"],
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
        const combined =
          (a.focus || []).join(" ").toLowerCase() +
          " " +
          (a.industries || []).join(" ").toLowerCase();
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
        const section = SECTIONS.find((s) => s.title === cat);
        return section ? DATA_MAP[section.id] : null;
      })
      .filter(Boolean);
  }, [diagResult]);

  return (
    <div className="min-h-screen bg-rellia-cream font-host-grotesk text-rellia-teal selection:bg-rellia-mint/30 selection:text-rellia-teal pt-[72px] md:pt-[86px]">
      <style>{css}</style>
      <Navbar />
      <RouteSeo
        title="Startup Diagnostic | Rellia Health"
        description="Assess your health tech startup across 13 domains and get a personalized advisory board and program roadmap."
      />

      <div className="relative flex min-h-[calc(100vh-72px)] md:min-h-[calc(100vh-86px)]">
        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="sticky top-[86px] hidden h-[calc(100vh-86px)] w-72 flex-col border-r border-rellia-teal/10 bg-white/50 backdrop-blur-md lg:flex">
          <div className="flex flex-col gap-6 p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-rellia-teal/50">
                <span>Progress</span>
                <span>
                  {completedSections} / {SECTIONS.length}
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
                {SECTIONS.map((s, i) => {
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
        <main className="flex-1 overflow-hidden">
          {/* MOBILE SUB-HEADER (Sticky Progress with Drawer) */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-rellia-teal/10 bg-rellia-cream/80 px-4 py-3 backdrop-blur-md lg:hidden">
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-rellia-teal/60">
                <span>
                  {view === "survey"
                    ? `Section ${currentSection + 1}`
                    : view.toUpperCase()}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-rellia-teal/10">
                <div
                  className="h-full bg-rellia-teal transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <Drawer>
              <DrawerTrigger asChild>
                <button className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-rellia-teal text-white shadow-md active:scale-95">
                  <Menu className="h-5 w-5" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-rellia-cream border-t border-rellia-teal/10">
                <DrawerHeader>
                  <DrawerTitle className="font-host-grotesk font-bold text-rellia-teal">
                    Assessment Navigation
                  </DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-12 overflow-y-auto max-h-[70vh]">
                  <nav className="space-y-2">
                    <DrawerClose asChild>
                      <button
                        onClick={goToIntro}
                        className={`flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all ${view === "intro" ? "bg-rellia-teal text-white" : "bg-rellia-teal/5"}`}
                      >
                        <span className="font-semibold">Introduction</span>
                      </button>
                    </DrawerClose>

                    <div className="py-2 text-[10px] font-bold uppercase tracking-widest text-rellia-teal/40">
                      Sections
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {SECTIONS.map((s, i) => {
                        const done =
                          answers[s.id] &&
                          Object.keys(answers[s.id]).length ===
                            s.questions.length;
                        const active =
                          view === "survey" && i === currentSection;
                        return (
                          <DrawerClose key={s.id} asChild>
                            <button
                              onClick={() => goToSection(i)}
                              className={`flex items-center gap-4 rounded-xl p-4 text-left transition-all ${active ? "bg-rellia-teal text-white shadow-lg" : "bg-white border border-rellia-teal/10"}`}
                            >
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-white/20" : done ? "bg-green-100 text-green-700" : "bg-rellia-teal/5"}`}
                              >
                                {done && !active ? "✓" : i + 1}
                              </div>
                              <span className="font-medium">{s.title}</span>
                            </button>
                          </DrawerClose>
                        );
                      })}
                    </div>

                    <DrawerClose asChild>
                      <button
                        onClick={goToSubmit}
                        className={`mt-4 flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all ${view === "submit" ? "bg-rellia-teal text-white" : "bg-rellia-teal/5"}`}
                      >
                        <span className="font-semibold">Review & Submit</span>
                      </button>
                    </DrawerClose>

                    <DrawerClose asChild>
                      <button
                        onClick={() => setView("report")}
                        className={`mt-4 flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all ${view === "report" ? "bg-rellia-teal text-white" : "bg-rellia-teal/5"}`}
                      >
                        <span className="font-semibold">
                          Personalized Roadmap
                        </span>
                      </button>
                    </DrawerClose>
                  </nav>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          <div className="mx-auto flex h-full max-w-5xl flex-col px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16">
            {/* ── INTRO VIEW ── */}
            {view === "intro" && (
              <div className="animate-ds-up flex flex-col gap-10">
                <div className="space-y-6">
                  <NetworkEyebrow label="Startup Diagnostic" tone="onLight" />
                  <h1 className="font-host-grotesk text-4xl font-bold leading-[1.1] tracking-tight text-rellia-teal md:text-6xl">
                    How ready is your startup,{" "}
                    <span className="italic">really?</span>
                  </h1>
                  <p className="font-urbanist text-lg leading-relaxed text-rellia-teal/70 md:text-xl">
                    Our diagnostic tool assesses your health tech startup across
                    13 critical domains. Get an automated report, personalized
                    advisory board matches, and a program roadmap tailored to
                    your gaps.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-rellia-teal/10 bg-white p-8 shadow-sm">
                      <h3 className="mb-8 text-xs font-bold uppercase tracking-widest text-rellia-teal">
                        Your Diagnostic Journey
                      </h3>
                      <div className="space-y-6">
                        {[
                          {
                            icon: Building2,
                            t: "Capture Your Context",
                            d: "Tell us about your startup, stage, and mission.",
                          },
                          {
                            icon: Target,
                            t: "13-Domain Deep Dive",
                            d: "15-minute assessment of your regulatory, clinical, and commercial readiness.",
                          },
                          {
                            icon: Sparkles,
                            t: "Personalized Growth Roadmap",
                            d: "Immediate analysis of your top strengths and priority gaps.",
                          },
                          {
                            icon: Users,
                            t: "Advisory Board Match",
                            d: "Personalized assignment of mentors based on your results.",
                          },
                        ].map((item, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rellia-teal/5 text-rellia-teal">
                              <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm">{item.t}</h4>
                              <p className="text-xs text-rellia-teal/60">
                                {item.d}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-rellia-teal/10 bg-white p-8 shadow-sm flex flex-col h-full">
                    <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-rellia-teal">
                      Tell us about your startup
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
                          <select
                            className="w-full rounded-xl border border-rellia-teal/10 bg-rellia-cream/30 p-3 text-sm focus:border-rellia-teal focus:bg-white focus:outline-none appearance-none"
                            value={memberInfo.stage}
                            onChange={(e) =>
                              setMemberInfo((p) => ({
                                ...p,
                                stage: e.target.value,
                              }))
                            }
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
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
                      className="w-full justify-center shadow-lg transition-transform active:scale-[0.98] py-4 mt-8"
                      onClick={startSurvey}
                    >
                      Begin Assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </RelliaAction>
                  </div>
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
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    {[
                      {
                        label: "Introduction",
                        step: "intro",
                        active: false,
                        done: true,
                      },
                      {
                        label: "Assessment",
                        step: "survey",
                        active: true,
                        done: false,
                      },
                      {
                        label: "Results",
                        step: "report",
                        active: false,
                        done: false,
                      },
                    ].map((s, i) => (
                      <div key={s.label} className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                            s.active
                              ? "bg-rellia-teal text-white"
                              : s.done
                                ? "bg-green-100 text-green-700"
                                : "bg-rellia-teal/5 text-rellia-teal/30",
                          )}
                        >
                          {s.done ? "✓" : i + 1}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-widest",
                            s.active
                              ? "text-rellia-teal"
                              : "text-rellia-teal/30",
                          )}
                        >
                          {s.label}
                        </span>
                        {i < 2 && (
                          <ChevronRight className="h-3 w-3 text-rellia-teal/10" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rellia-teal text-white text-xl">
                      {sec.icon}
                    </span>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-rellia-teal/40">
                        Section {currentSection + 1}
                      </div>
                      <h2 className="font-host-grotesk text-2xl font-bold text-rellia-teal md:text-3xl">
                        {sec.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-rellia-teal/60">{sec.desc}</p>
                </div>

                <div className="rounded-[32px] border border-rellia-teal/5 bg-white p-8 shadow-xl md:p-12">
                  <div className="mb-6 inline-flex rounded-lg bg-rellia-teal/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-rellia-teal/60">
                    {TYPE_LABELS[currentQ.type]}
                  </div>
                  <h3 className="mb-10 font-host-grotesk text-xl font-semibold leading-relaxed text-rellia-teal md:text-2xl">
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
                          SECTIONS[currentSection - 1].questions.length - 1,
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
                      else if (currentSection < SECTIONS.length - 1)
                        goToSection(currentSection + 1);
                      else goToSubmit();
                    }}
                    className="flex h-12 items-center gap-2 rounded-full bg-rellia-teal px-8 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                  >
                    {currentSection === SECTIONS.length - 1 &&
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
                  <div className="text-[10px] font-bold uppercase tracking-widest text-rellia-teal/40">
                    Confirm submission
                  </div>
                  <h2 className="font-host-grotesk text-3xl font-bold text-rellia-teal md:text-5xl">
                    Review, then generate your roadmap
                  </h2>
                  <p className="max-w-xl text-rellia-teal/60">
                    You’re about to submit your responses. After confirmation, we’ll generate your report and save your submission in the Rellia CMS.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 items-stretch">
                  <div className="rounded-[32px] border border-rellia-teal/10 bg-white p-8 shadow-sm flex flex-col h-full">
                    <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-rellia-teal/40">
                      Your Assessment Profile
                    </h3>
                    <div className="space-y-2 flex-1">
                      {SECTIONS.map((s) => {
                        const sc = getSectionScore(s.id, answers);
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
                        Generating Your Report
                      </h3>
                      <p className="text-sm text-rellia-teal/70 leading-relaxed mb-6">
                        We're assessing your results in order to assign you your
                        personalized advisory board and recommended Rellia
                        programs.
                      </p>
                      <div className="space-y-3">
                        {[
                          "Top 3 Gaps & Strengths",
                          "Customized Recommendation Roadmap",
                          "Assigned Advisory Board Matches",
                          "Meeting Links for Advisors",
                        ].map((l) => (
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
                      <h4 className="text-xs font-bold uppercase tracking-widest text-rellia-teal/40">
                        Submission details
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
                      asChild
                      variant="mintTealFill"
                      size="comfortable"
                      className="w-full justify-center shadow-xl transition-all hover:scale-[1.02] active:scale-95 py-7 text-xl"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const nextErrors = validateMemberInfo(memberInfo)
                          if (Object.keys(nextErrors).length > 0) {
                            setErrors(nextErrors)
                            setView("intro")
                            return
                          }
                          submitSurvey()
                        }}
                      >
                        Confirm & Generate Report
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
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
                  Personalizing your report
                </h2>
                <p className="mb-12 max-w-md text-rellia-teal/60">
                  We're assessing your results in order to assign you your
                  personalized advisory board and program roadmap.
                </p>

                <div className="w-full max-w-xs space-y-4">
                  {[
                    { l: "Analyzing section scores", s: procStep >= 0 },
                    { l: "Mapping gaps to advisors", s: procStep >= 1 },
                    { l: "Building your roadmap", s: procStep >= 2 },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 text-left transition-all duration-500"
                    >
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${step.s ? "bg-green-500" : "bg-rellia-teal/10 animate-pulse"}`}
                      />
                      <span
                        className={`text-sm font-medium ${step.s ? "text-rellia-teal" : "text-rellia-teal/20"}`}
                      >
                        {step.l}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── REPORT VIEW ── */}
            {view === "report" && diagResult && (
              <div className="animate-ds-up flex flex-col gap-12 pb-20">
                <div className="space-y-6">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-rellia-teal/40">
                        Diagnostic Report
                      </div>
                      <h1 className="font-host-grotesk text-4xl font-bold text-rellia-teal md:text-5xl">
                        {memberInfo.company}
                      </h1>
                    </div>
                    <div className="text-sm font-medium text-rellia-teal/40">
                      {memberInfo.stage} ·{" "}
                      {new Date().toLocaleDateString("en-CA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="rounded-[32px] border border-rellia-teal/5 bg-white p-8 shadow-sm md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Sparkles className="h-24 w-24 text-rellia-teal" />
                    </div>
                    <p className="font-urbanist text-xl leading-relaxed text-rellia-teal/80 md:text-2xl relative z-10">
                      {diagResult.summary}
                    </p>
                  </div>
                </div>

                <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
                  <div className="space-y-16">
                    {/* Strengths & Gaps */}
                    <div className="grid gap-8 md:grid-cols-2 items-stretch">
                      <div className="space-y-6 flex flex-col h-full">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-green-600 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Top Strengths
                        </h3>
                        <div className="space-y-3 flex-1">
                          {(diagResult.top3_strengths ?? []).map((s, i) => (
                            <div
                              key={i}
                              className="rounded-2xl border border-green-100 bg-green-50/50 p-5 h-[calc(33.33%-8px)] flex flex-col justify-center"
                            >
                              <h4 className="font-bold text-sm text-green-800">
                                {s.category}
                              </h4>
                              <p className="text-xs text-green-700/70 mt-1 line-clamp-2">
                                {s.note}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6 flex flex-col h-full">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-red-600 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Priority Gaps
                        </h3>
                        <div className="space-y-3 flex-1">
                          {(diagResult.top3_weaknesses ?? []).map((w, i) => (
                            <div
                              key={i}
                              className="rounded-2xl border border-red-100 bg-red-50/50 p-5 h-[calc(33.33%-8px)] flex flex-col justify-center"
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm text-red-800">
                                  {w.category}
                                </h4>
                                <span className="text-[9px] font-bold uppercase bg-red-100 px-1.5 py-0.5 rounded text-red-600">
                                  {w.priority}
                                </span>
                              </div>
                              <p className="text-xs text-red-700/70 mt-1 line-clamp-2">
                                {w.note}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section Analysis Chart-ish */}
                    <div className="space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-rellia-teal/40">
                        Full Readiness Breakdown
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {SECTIONS.map((s) => {
                          const sc = getSectionScore(s.id, answers) ?? 0;
                          return (
                            <div
                              key={s.id}
                              className="group rounded-2xl border border-rellia-teal/5 bg-white p-5 shadow-sm transition-all"
                            >
                              <div className="mb-3 flex items-center justify-between">
                                <span className="text-xs font-bold text-rellia-teal/80">
                                  {s.title}
                                </span>
                                <span
                                  className={`text-sm font-black ${scoreClass(sc)}`}
                                >
                                  {sc}%
                                </span>
                              </div>
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-rellia-teal/5">
                                <div
                                  className={`h-full transition-all duration-1000 ${scoreBarClass(sc)}`}
                                  style={{ width: `${sc}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Assigned Advisory Board */}
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-rellia-teal/40">
                          Your Assigned Advisory Board
                        </h3>
                        <Link
                          to="/advisors/directory"
                          className="text-[10px] font-bold uppercase tracking-widest text-rellia-teal/60 hover:text-rellia-teal transition-colors"
                        >
                          View All Advisors →
                        </Link>
                      </div>
                      <div className="grid gap-6 md:grid-cols-3">
                        {recommendedAdvisors.map((advisor, i) => (
                          <div
                            key={i}
                            className="group relative rounded-3xl border border-rellia-teal/10 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                          >
                            <div className="mb-4 relative h-32 w-full overflow-hidden rounded-2xl bg-rellia-cream">
                              {advisor.photoSrc ? (
                                <img
                                  src={advisor.photoSrc}
                                  alt={advisor.name}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-rellia-teal/20">
                                  <Users className="h-12 w-12" />
                                </div>
                              )}
                            </div>
                            <h4 className="font-bold text-rellia-teal leading-tight">
                              {advisor.name}
                            </h4>
                            <p className="text-[10px] text-rellia-teal/50 font-bold uppercase tracking-wider mb-2">
                              {advisor.role} @ {advisor.organization}
                            </p>
                            <p className="mb-4 line-clamp-2 h-8 text-xs text-rellia-teal/70">
                              {typeof advisor.focus === "string"
                                ? advisor.focus
                                : (advisor.focus ?? []).join(" · ")}
                            </p>

                            <RelliaAction
                              asChild
                              variant="mintTealFill"
                              size="compact"
                              className="w-full justify-center py-2 text-[10px] uppercase tracking-widest"
                            >
                              <a
                                href={
                                  advisor.linkedInUrl ||
                                  advisor.websiteUrl ||
                                  "#"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Calendar className="h-3 w-3 mr-2" />
                                Schedule Meeting
                              </a>
                            </RelliaAction>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Recommendations */}
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-rellia-teal/40">
                        Recommended Roadmap
                      </h3>
                      <div className="space-y-4">
                        {diagResult.recommendations.map((r, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rellia-teal text-white text-[10px] font-bold">
                              {i + 1}
                            </div>
                            <p className="text-sm font-medium leading-snug text-rellia-teal/80">
                              {r}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-rellia-teal/40">
                        Rellia Program Matches
                      </h3>
                      <div className="space-y-4">
                        {recommendedPrograms.map((prog, i) => (
                          <Link
                            key={i}
                            to={prog?.programHref || "/programs"}
                            className="group flex items-center justify-between rounded-2xl border border-rellia-teal/10 bg-white p-4 transition-all hover:bg-rellia-teal hover:text-white"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-rellia-mint group-hover:bg-white" />
                              <span className="text-sm font-bold">
                                {prog?.program}
                              </span>
                            </div>
                            <ChevronRight className="h-4 w-4 opacity-30 group-hover:opacity-100" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[32px] bg-rellia-teal p-8 text-white shadow-2xl relative overflow-hidden">
                      <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-rellia-mint/20 rounded-full blur-2xl" />
                      <h3 className="mb-4 font-host-grotesk text-xl font-bold leading-tight relative z-10">
                        Accelerate your journey
                      </h3>
                      <p className="mb-8 text-sm leading-relaxed text-white/70 relative z-10">
                        Join Rellia Health to unlock full access to your
                        assigned advisory board and all recommended programs.
                      </p>
                      <RelliaAction
                        asChild
                        variant="mintTealFill"
                        size="comfortable"
                        className="w-full justify-center transition-transform active:scale-95 relative z-10"
                      >
                        <Link to="/apply">
                          Apply for Membership
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </RelliaAction>
                    </div>

                    <div className="text-center pt-4">
                      <button
                        onClick={() => window.print()}
                        className="text-[10px] font-bold uppercase tracking-widest text-rellia-teal/40 hover:text-rellia-teal transition-colors flex items-center justify-center gap-2 mx-auto"
                      >
                        <Search className="h-3 w-3" />
                        Print Report Summary
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
