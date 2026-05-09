import { DEFAULT_PROGRAMS_LANDING } from "../../shared/cms/defaults"
import { programsEventDetailPath } from "../../shared/cms/eventSlug"
import { FOUNDER_DIRECTORY } from "../data/founderDirectory"
import { ADVISOR_DIRECTORY_SEED } from "../data/advisorDirectory"

/** Base URL for canonical links, Open Graph, and JSON-LD. Override via `VITE_SITE_URL` in env. */
export const getSiteUrl = (): string => {
  const raw = import.meta.env.VITE_SITE_URL as string | undefined
  if (raw && raw.trim().length > 0) {
    return raw.replace(/\/$/, "")
  }
  return "https://www.relliahealth.com"
}

export type RouteSeoConfig = {
  title: string
  description: string
  /** When false, emits robots noindex,nofollow and omits canonical */
  indexable: boolean
}

export const ROUTE_SEO: Record<string, RouteSeoConfig> = {
  "/": {
    title: "Rellia Health — You are the future of health tech.",
    description:
      "Rellia Health connects founders, clinicians, and health systems to build the future of care. Join our network, explore programs, and move healthcare forward together.",
    indexable: true,
  },
  "/about": {
    title: "About — Rellia Health",
    description:
      "Learn how Rellia Health brings together operators, investors, and clinical leaders to scale solutions that matter for patients and health systems.",
    indexable: true,
  },
  "/faq": {
    title: "FAQ — Rellia Health",
    description:
      "Answers to common questions about Rellia Health programs, membership, events, and how we work with founders and partners.",
    indexable: true,
  },
  "/careers": {
    title: "Careers — Rellia Health",
    description:
      "Explore open roles at Rellia Health. Join a mission-driven team connecting health tech founders with clinicians, advisors, and investors.",
    indexable: true,
  },
  "/events": {
    title: "Events — Rellia Health",
    description:
      "Register for upcoming Rellia Health events on Luma and explore past event pages. Practical sessions for builders in health tech.",
    indexable: true,
  },
  "/programs": {
    title: "Programs & Events — Rellia Health",
    description:
      "Explore Rellia Health programs and events designed to help healthcare builders learn, connect, and grow with the right stakeholders.",
    indexable: true,
  },
  "/programs/build-your-quality-management-system": {
    title: "Quality Management System (QMS) Program — Rellia Health",
    description:
      "Build a lean, scalable QMS for ISO 13485, MDSAP, and FDA compliance. Expert guidance for medtech and digital health founders.",
    indexable: true,
  },
  "/programs/ignite-pitch-foundations": {
    title: "Ignite: Pitch Foundations — Rellia Health",
    description:
      "Master fundraising essentials. Craft your first pitch deck and presentation with expert feedback to build investor confidence.",
    indexable: true,
  },
  "/programs/advance-data-room-deep-dive": {
    title: "Advance: Data Room Deep Dive — Rellia Health",
    description:
      "Navigate due diligence and data room management. Practical tools and tips for early-stage founders raising capital.",
    indexable: true,
  },
  "/programs/elevate-healthcare-capital": {
    title: "Elevate: Healthcare Capital — Rellia Health",
    description:
      "Refine your fundraising strategy for health tech. Upgrade your pitch to meet the technical and clinical expectations of healthcare investors.",
    indexable: true,
  },
  "/programs/first-50-users-clinical-feedback-intensive": {
    title: "First 50 Users: Clinical Feedback Intensive — Rellia Health",
    description:
      "Validate your product with Rellia's clinician network. Gain IRB guidance and professional feedback to bridge the gap from prototype to clinical use.",
    indexable: true,
  },
  "/programs/low-fidelity-prototype-lab": {
    title: "Low-Fidelity Prototype Lab — Rellia Health",
    description:
      "Transform your vision into a functional prototype. Connect with vetted development firms and testing experts to build your proof of concept.",
    indexable: true,
  },
  "/programs/advisory-board-match": {
    title: "Advisory Board Match — Rellia Health",
    description:
      "Recruit ideal experts for your startup. Rellia provides matchmaking, equity benchmarking, and legal frameworks for productive advisory relationships.",
    indexable: true,
  },
  "/programs/design-your-brand-strategy": {
    title: "Design Your Brand Strategy — Rellia Health",
    description:
      "Develop a professional brand identity that earns trust from clinicians and investors. Includes sprints for website, UI, and sales collateral.",
    indexable: true,
  },
  "/programs/regulatory-roadmap": {
    title: "Regulatory Roadmap — Rellia Health",
    description:
      "Map your regulatory path across FDA, Health Canada, and EU MDR. Leave with a documented strategy for investor due diligence.",
    indexable: true,
  },
  "/programs/build-your-qms": {
    title: "QMS Program — Rellia Health",
    description: "This page has moved to /programs/build-your-quality-management-system.",
    indexable: false,
  },
  "/programs/qms": {
    title: "QMS Program — Rellia Health",
    description: "This page has moved to /programs/build-your-quality-management-system.",
    indexable: false,
  },
  "/network": {
    title: "Network — Rellia Health",
    description:
      "Join the Rellia Health network of founders, investors, advisors, and partners building the next generation of healthcare companies.",
    indexable: true,
  },
  "/apply": {
    title: "Apply — Rellia Health",
    description:
      "Apply to join the Rellia Network. Built for founders, advisors, investors, and industry partners shaping the future of health.",
    indexable: true,
  },
  "/founders": {
    title: "Founders — Rellia Health Network",
    description:
      "The home for health tech founders: membership pathway, programs, advisor access, and directories—built for operators scaling in healthcare.",
    indexable: true,
  },
  "/founders/directory": {
    title: "Founder directory — Rellia Health",
    description:
      "Browse representative health tech companies in the Rellia portfolio network—stage tags and profiles for founder discovery.",
    indexable: true,
  },
  "/consulting": {
    title: "Founder consulting — Rellia Health",
    description:
      "One-to-one and scoped consulting for health tech founders—regulatory, clinical, commercial, and narrative depth beyond community rhythm.",
    indexable: true,
  },
  "/advisors": {
    title: "Advisors — Rellia Health Network",
    description:
      "Mentor health tech founders with flexible 1–3 hour engagements—benefits, criteria, and how to join Rellia as an advisor.",
    indexable: true,
  },
  "/advisors/directory": {
    title: "Advisor directory — Rellia Health",
    description:
      "Search and filter Rellia advisors by expertise—operators, clinicians, and specialists who mentor serious health tech founders.",
    indexable: true,
  },
  "/investors": {
    title: "Investors — Rellia Health Network",
    description:
      "Benefits of Rellia-backed startups, thesis-aware pitch formats, and partner pathways for funds and angel groups.",
    indexable: true,
  },
  "/industry-partners": {
    title: "Industry Partners — Rellia Health Network",
    description:
      "Sponsor programs, join directories, and partner with Rellia—including GetProven vendor marketplace benefits for portfolios.",
    indexable: true,
  },
  "/industry-partners/directory": {
    title: "Industry Partners Directory — Rellia Health",
    description:
      "Opens the Rellia Health Resources vendor directory on GetProven (external). Bookmark-friendly redirect from rellia.health.",
    indexable: false,
  },
  "/partners": {
    title: "Partners — Rellia Health Network",
    description:
      "This page has moved to /industry-partners. For partners: reach health tech founders with programs, resources, and trusted community-driven introductions.",
    indexable: false,
  },
  "/contact": {
    title: "Contact — Rellia Health",
    description:
      "Get in touch with Rellia Health about partnerships, programs, or press. We respond to serious inquiries from builders and collaborators.",
    indexable: true,
  },
  "/stories": {
    title: "News & Updates — Rellia Health",
    description:
      "The latest founder spotlights, industry insights, & program updates. Stay current with the people and ideas shaping the future of health.",
    indexable: true,
  },
  "/membership": {
    title: "Membership — Rellia Health",
    description:
      "Complete your Rellia Health membership checkout securely. Manage your plan and access member benefits.",
    indexable: false,
  },
  "/terms": {
    title: "Terms of use — Rellia Health",
    description:
      "Terms of use for the Rellia Health website and services. Please read before using our site or programs.",
    indexable: true,
  },
  "/privacy": {
    title: "Privacy policy — Rellia Health",
    description:
      "How Rellia Health collects, uses, and protects personal information when you use our website and services.",
    indexable: true,
  },
  "/diagnostics": {
    title: "Startup Diagnostic — Rellia Health",
    description:
      "Benchmark your health tech startup across 13 domains. Get a personalized gap analysis, AI-powered report, and advisory board matching.",
    indexable: true,
  },
  "/diagnostic-survey": {
    title: "Startup Diagnostic Assessment — Rellia Health",
    description:
      "Complete the Rellia Health diagnostic survey to receive your readiness report and personalized advisory board matches.",
    indexable: true,
  },
}

const NOT_FOUND_SEO: RouteSeoConfig = {
  title: "Page not found — Rellia Health",
  description:
    "The page you are looking for does not exist or has moved. Return to Rellia Health to explore our network and programs.",
  indexable: false,
}

export const normalizePathname = (pathname: string): string => {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1)
  }
  return pathname || "/"
}

const EVENT_DETAIL_SEO: RouteSeoConfig = {
  title: "Event — Rellia Health",
  description:
    "Event details, location, and registration for Rellia Health sessions. Explore upcoming and past programs.",
  indexable: true,
}

export const getSeoForPathname = (pathname: string): RouteSeoConfig => {
  const key = normalizePathname(pathname)
  if (key.startsWith("/events/") && key !== "/events") {
    return EVENT_DETAIL_SEO
  }
  return ROUTE_SEO[key] ?? NOT_FOUND_SEO
}

const PROGRAMS_EVENT_PRERENDER_PATHS = [
  ...DEFAULT_PROGRAMS_LANDING.upcomingEvents.map(programsEventDetailPath),
  ...DEFAULT_PROGRAMS_LANDING.pastEvents.map(programsEventDetailPath),
]

/** Paths emitted as static HTML at build time (see `client/prerender.tsx`). */
export const PRERENDER_PATHS: string[] = [
  "/",
  ...Object.keys(ROUTE_SEO).filter((p) => p !== "/"),
  ...PROGRAMS_EVENT_PRERENDER_PATHS,
  ...FOUNDER_DIRECTORY.map((f) => `/founders/directory/${f.id}`),
  ...ADVISOR_DIRECTORY_SEED.map((a) => `/advisors/directory/${a.id}`),
]

export const getDefaultOgImageUrl = (): string => {
  const ogImageVersion = ((import.meta as unknown as { env?: Record<string, unknown> })?.env
    ?.VITE_OG_IMAGE_VERSION as string | undefined)?.trim()
  const base = `${getSiteUrl()}/ogimage.png`
  if (!ogImageVersion) return base
  return `${base}?v=${encodeURIComponent(ogImageVersion)}`
}

export const getStoriesOgImageUrl = (): string => {
  const ogImageVersion = ((import.meta as unknown as { env?: Record<string, unknown> })?.env
    ?.VITE_OG_IMAGE_VERSION as string | undefined)?.trim()
  const base = `${getSiteUrl()}/stories-ogimage.png`
  if (!ogImageVersion) return base
  return `${base}?v=${encodeURIComponent(ogImageVersion)}`
}

export const getDefaultOgImageAlt = (): string => {
  return "Rellia Health Network -- The expertise you need. The support you deserve."
}
