import { DEFAULT_PROGRAMS_LANDING } from "../../shared/cms/defaults"
import { programsEventDetailPath } from "../../shared/cms/eventSlug"

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

const ROUTE_SEO: Record<string, RouteSeoConfig> = {
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
  "/programs/build-your-qms": {
    title: "QMS Program — Rellia Health",
    description:
      "Quality Management System (QMS) support for medtech and digital health teams navigating design controls, documentation, and regulatory readiness.",
    indexable: true,
  },
  "/programs/qms": {
    title: "QMS Program — Rellia Health",
    description:
      "This page has moved to /programs/build-your-qms.",
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
    title: "Diagnostics — Rellia Health",
    description:
      "Diagnostics resources from Rellia Health. This experience is coming soon.",
    indexable: false,
  },
  "/diagnosticSurvey": {
    title: "Diagnostic survey — Rellia Health",
    description:
      "Rellia Health diagnostic survey. This experience is coming soon.",
    indexable: false,
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
