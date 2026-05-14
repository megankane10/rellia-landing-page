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
    title: "QMS Program — Rellia Health",
    description:
      "Quality Management System (QMS) support for medtech and digital health teams navigating design controls, documentation, and regulatory readiness.",
    indexable: true,
  },
  "/programs/build-your-qms": {
    title: "QMS Program — Rellia Health",
    description:
      "This page has moved to /programs/build-your-quality-management-system.",
    indexable: false,
  },
  "/programs/qms": {
    title: "QMS Program — Rellia Health",
    description:
      "This page has moved to /programs/build-your-quality-management-system.",
    indexable: false,
  },
  "/programs/ignite-pitch-foundations": {
    title: "Ignite Pitch Foundations — Rellia Health",
    description:
      "Build a compelling investor pitch with expert coaching and real-time feedback from healthcare operators and investors.",
    indexable: true,
  },
  "/programs/advance-data-room-deep-dive": {
    title: "Advance Data Room Deep Dive — Rellia Health",
    description:
      "Prepare your data room for due diligence with structured guidance on financial models, IP strategy, and investor-ready documentation.",
    indexable: true,
  },
  "/programs/elevate-healthcare-capital": {
    title: "Elevate Healthcare Capital — Rellia Health",
    description:
      "Navigate healthcare fundraising with expert guidance on term sheets, investor relations, and capital strategy.",
    indexable: true,
  },
  "/programs/first-50-users-clinical-feedback-intensive": {
    title: "First 50 Users — Rellia Health",
    description:
      "Recruit your first clinical users and gather structured feedback to validate your health tech product with real-world evidence.",
    indexable: true,
  },
  "/programs/low-fidelity-prototype-lab": {
    title: "Prototype Lab — Rellia Health",
    description:
      "Build and test low-fidelity prototypes with clinical end-users to validate your health tech concept before full development.",
    indexable: true,
  },
  "/programs/advisory-board-match": {
    title: "Advisory Board Match — Rellia Health",
    description:
      "Get matched with vetted clinical and industry advisors who can accelerate your health tech company's growth.",
    indexable: true,
  },
  "/programs/design-your-brand-strategy": {
    title: "Brand Strategy — Rellia Health",
    description:
      "Design a brand strategy that resonates with healthcare buyers, clinicians, and patients through expert-led workshops.",
    indexable: true,
  },
  "/programs/regulatory-roadmap": {
    title: "Regulatory Strategy Sprint — Rellia Health",
    description:
      "Map your regulatory pathway with expert guidance on FDA submissions, CE marking, and compliance strategy.",
    indexable: true,
  },
  "/events/:slug": {
    title: "Event Details — Rellia Health",
    description: "Learn more about this Rellia Health event and register to join the session.",
    indexable: true,
  },
  "/network": {
    title: "Network — Rellia Health",
    description:
      "Join the Rellia Health network of founders, investors, advisors, and partners building the next generation of healthcare companies.",
    indexable: true,
  },
  "/founders": {
    title: "Founders — Rellia Health Network",
    description:
      "For health tech founders: launch sooner, scale smarter, and get support from operators, clinicians, and investors.",
    indexable: true,
  },
  "/advisors": {
    title: "Advisors — Rellia Health Network",
    description:
      "For advisors and mentors: support serious health tech founders through structured, high-impact engagements.",
    indexable: true,
  },
  "/investors": {
    title: "Investors — Rellia Health Network",
    description:
      "For investors: meet vetted, operator-coached health tech founders and get early access to teams worth your time.",
    indexable: true,
  },
  "/industry-partners": {
    title: "Industry Partners — Rellia Health Network",
    description:
      "For partners: reach health tech founders with programs, resources, and trusted community-driven introductions.",
    indexable: true,
  },
  "/industry-partners/directory": {
    title: "Industry Partners Directory — Rellia Health",
    description:
      "Browse a curated directory of vetted industry partners and resources recommended by Rellia.",
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

export const getSeoForPathname = (pathname: string): RouteSeoConfig => {
  const key = normalizePathname(pathname)
  return ROUTE_SEO[key] ?? NOT_FOUND_SEO
}

/** Paths emitted as static HTML at build time (see `client/prerender.tsx`). */
export const PRERENDER_PATHS: string[] = [
  "/",
  ...Object.keys(ROUTE_SEO).filter((p) => p !== "/"),
]

export const getDefaultOgImageUrl = (): string => {
  const ogImageVersion = ((import.meta as unknown as { env?: Record<string, unknown> })?.env
    ?.VITE_OG_IMAGE_VERSION as string | undefined)?.trim()
  const base = `${getSiteUrl()}/ogimage.png`
  if (!ogImageVersion) return base
  return `${base}?v=${encodeURIComponent(ogImageVersion)}`
}

export const getDefaultOgImageAlt = (): string => {
  return "Rellia Health Network -- The expertise you need. The support you deserve."
}
