/** Base URL for canonical links, Open Graph, and JSON-LD. Override via `VITE_SITE_URL` in env. */
export const getSiteUrl = (): string => {
  const raw = import.meta.env.VITE_SITE_URL as string | undefined
  if (raw && raw.trim().length > 0) {
    return raw.replace(/\/$/, "")
  }
  return "https://relliahealth.com"
}

export type RouteSeoConfig = {
  title: string
  description: string
  /** When false, emits robots noindex,nofollow and omits canonical */
  indexable: boolean
}

const ROUTE_SEO: Record<string, RouteSeoConfig> = {
  "/": {
    title: "Rellia Health — You are the future of healthcare",
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
  "/programs": {
    title: "Programs & Events — Rellia Health",
    description:
      "Explore Rellia Health programs and events designed to help healthcare builders learn, connect, and grow with the right stakeholders.",
    indexable: true,
  },
  "/programs/qms": {
    title: "QMS Program — Rellia Health",
    description:
      "Quality Management System (QMS) support for medtech and digital health teams navigating design controls, documentation, and regulatory readiness.",
    indexable: true,
  },
  "/network": {
    title: "Network — Rellia Health",
    description:
      "Join the Rellia Health network of founders, investors, advisors, and partners building the next generation of healthcare companies.",
    indexable: true,
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
  "/blog": {
    title: "Blog — Rellia Health",
    description:
      "Stories and updates from Rellia Health. This section is coming soon.",
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

export const getDefaultOgImageUrl = (): string => {
  return `${getSiteUrl()}/ogimage.png`
}

export const getDefaultOgImageAlt = (): string => {
  return "Rellia Health Network -- The expertise you need. The support you deserve."
}
