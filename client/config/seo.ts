import { DEFAULT_PROGRAMS_LANDING } from "../../shared/cms/defaults"
import { programsEventDetailPath } from "../../shared/cms/eventSlug"
import { STORIES } from "../content/stories"
import { FOUNDER_DIRECTORY } from "../data/founderDirectory"
import { ADVISOR_DIRECTORY_SEED } from "../data/advisorDirectory"

/** Base URL for canonical links, Open Graph, and JSON-LD. Override via `VITE_SITE_URL` in env. */
/** Trim for `<title>` — target ≤60 characters for SERP display. */
export const clampMetaTitle = (value: string, max = 60): string => {
  const trimmed = value.trim()
  if (trimmed.length <= max) return trimmed
  const slice = trimmed.slice(0, max)
  const lastSpace = slice.lastIndexOf(" ")
  if (lastSpace > max * 0.6) return `${slice.slice(0, lastSpace).trim()}…`
  return `${slice.trim()}…`
}

/** Trim for meta description — target ≤160 characters. */
export const clampMetaDescription = (value: string, max = 160): string => {
  const trimmed = value.trim()
  if (trimmed.length <= max) return trimmed
  const slice = trimmed.slice(0, max)
  const lastSpace = slice.lastIndexOf(" ")
  if (lastSpace > max * 0.65) return `${slice.slice(0, lastSpace).trim()}…`
  return `${slice.trim()}…`
}

export const getSiteUrl = (): string => {
  const raw = import.meta.env.VITE_SITE_URL as string | undefined
  if (raw && raw.trim().length > 0) {
    return raw.replace(/\/$/, "")
  }
  return "https://www.relliahealth.com"
}

/** Origin for share/copy URLs: current browser host in the client, configured site URL on the server. */
export const getShareOrigin = (): string => {
  if (typeof window !== "undefined") {
    const origin = window.location.origin?.trim()
    if (origin) return origin.replace(/\/$/, "")
  }
  return getSiteUrl()
}

export type RouteSeoConfig = {
  title: string
  description: string
  /** When false, emits robots noindex,nofollow and omits canonical */
  indexable: boolean
}

export const ROUTE_SEO: Record<string, RouteSeoConfig> = {
  "/": {
    title: "Accelerating Digital Health — Rellia Health",
    description:
      "Rellia Health connects founders, clinicians, and health systems to build the future of care. Join our network and explore programs.",
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
    title: "Programs — Rellia Health",
    description:
      "Explore Rellia Health programs designed to help healthcare builders learn, connect, and grow with the right stakeholders.",
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
  "/programs/regulatory-strategy-sprint": {
    title: "Regulatory Strategy Sprint — Rellia Health",
    description:
      "Map your regulatory path across FDA, Health Canada, and EU MDR. Leave with a documented strategy for investor due diligence.",
    indexable: true,
  },
  "/programs/regulatory-roadmap": {
    title: "Regulatory Strategy Sprint — Rellia Health",
    description: "This page has moved to /programs/regulatory-strategy-sprint.",
    indexable: false,
  },
  "/programs/build-your-qms": {
    title: "QMS Program — Rellia Health",
    description: "This page has moved to /programs/build-your-quality-management-system.",
    indexable: false,
  },
  "/programs/qms": {
    title: "QMS Program — Rellia Health",
    description:
      "This page has moved to /programs/build-your-qms.",
    indexable: false,
  },
  "/network": {
    title: "Network — Rellia Health",
    description: "This page has moved to /founders.",
    indexable: false,
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
  "/founders/alumni": {
    title: "Alumni directory — Rellia Health",
    description:
      "Browse health tech companies in the Rellia alumni network—stage tags and profiles for founder discovery.",
    indexable: true,
  },
  "/founders/directory": {
    title: "Founder directory — Rellia Health",
    description: "This page has moved to /founders/alumni.",
    indexable: false,
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
    title: "Stories — Rellia Health",
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
  "/startup-diagnostic": {
    title: "Startup Diagnostic — Rellia Health",
    description:
      "Benchmark your health tech startup across 12 critical domains. Get an instant readiness score, personalized gap analysis, and advisory board matching.",
    indexable: true,
  },
  "/diagnostic-survey": {
    title: "Startup Diagnostic Assessment — Rellia Health",
    description:
      "Complete the Rellia Health diagnostic survey to receive your readiness report and personalized advisory board matches.",
    indexable: true,
  },
  "/admin/login": {
    title: "Sign In — Admin",
    description:
      "Sign in to the Rellia Health admin portal to review diagnostic survey submissions and internal reports.",
    indexable: false,
  },
  "/admin/signup": {
    title: "Create account — admin",
    description:
      "Create a Rellia Health admin account when signup is enabled. Internal access for diagnostic submission review.",
    indexable: false,
  },
  "/accept-invite": {
    title: "Accept Invitation — Admin",
    description:
      "Accept your Rellia Health admin invitation and set a password to access the internal dashboard.",
    indexable: false,
  },
  "/admin/auth/callback": {
    title: "Authentication — Admin",
    description: "Completing admin authentication for the Rellia Health dashboard.",
    indexable: false,
  },
  "/admin/set-password": {
    title: "Set Password — Admin",
    description: "Choose a password to finish setting up your Rellia Health admin account.",
    indexable: false,
  },
  "/admin/inbox": {
    title: "Inbox — Admin",
    description: "Review contact form, investor, and diagnostic submissions in the Rellia Health admin dashboard.",
    indexable: false,
  },
  "/admin/overview": {
    title: "Overview — Admin",
    description: "Review contact form, investor, and diagnostic submissions in the Rellia Health admin dashboard.",
    indexable: false,
  },
  "/admin/submissions": {
    title: "Inbox — Admin",
    description: "Review contact form, investor, and diagnostic submissions in the Rellia Health admin dashboard.",
    indexable: false,
  },
  "/admin/team": {
    title: "Team — Admin",
    description: "Manage admin users with access to the Rellia Health internal dashboard.",
    indexable: false,
  },
  "/admin/drafts": {
    title: "Sanity Drafts — Admin",
    description: "Unpublished Sanity CMS drafts awaiting review in the Rellia Health admin dashboard.",
    indexable: false,
  },
  "/admin/content": {
    title: "Sanity Drafts — Admin",
    description: "Unpublished Sanity CMS drafts awaiting review in the Rellia Health admin dashboard.",
    indexable: false,
  },
  "/admin/help": {
    title: "Help — Admin",
    description: "Tools, documentation, and environment guidance for Rellia Health dashboard administrators.",
    indexable: false,
  },
  "/admin/resources": {
    title: "Help — Admin",
    description: "Tools, documentation, and environment guidance for Rellia Health dashboard administrators.",
    indexable: false,
  },
  "/admin/dashboard": {
    title: "Dashboard — Admin",
    description:
      "Rellia Health admin dashboard for diagnostic submissions, company profiles, and operational review.",
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

/** Item detail routes (event, program, advisor, alumni) that should use per-item OG images. */
export const isDirectoryItemPath = (pathname: string): boolean => {
  const key = normalizePathname(pathname)
  if (key.startsWith("/events/") && key !== "/events") return true
  if (key.startsWith("/programs/") && key !== "/programs") return true
  if (key.startsWith("/advisors/directory/") && key !== "/advisors/directory") return true
  if (key.startsWith("/founders/alumni/") && key !== "/founders/alumni") return true
  return false
}

/** Routes where the page sets its own Helmet (events, programs, stories, directory profiles). */
export const isItemDetailPath = (pathname: string): boolean => {
  const key = normalizePathname(pathname)
  if (key.startsWith("/stories/") && key !== "/stories") return true
  return isDirectoryItemPath(key)
}

export const buildAdvisorProfileSeoTitle = (name: string): string =>
  clampMetaTitle(`${name.trim()} — Advisors`)

export const buildAlumniProfileSeoTitle = (name: string): string =>
  clampMetaTitle(`${name.trim()} — Founders`)

export const shouldUseDefaultOgImage = (pathname: string): boolean =>
  normalizePathname(pathname) === "/"

/** Marketing routes with dedicated static OG artwork (all other routes: title + description only). */
const STATIC_OG_IMAGE_BY_ROUTE: Record<string, string> = {
  "/": "/ogimage.png",
  "/founders": "/founders-ogimage.png",
  "/advisors": "/advisors-ogimage.png",
  "/investors": "/investors-ogimage.png",
  "/industry-partners": "/industrypartners-ogimage.png",
}

/** Routes that supply og:image from page context (e.g. first alumni company logo). */
export const allowsPageContextOgImage = (pathname: string): boolean =>
  normalizePathname(pathname) === "/founders/alumni"

export const isStaticOgImageRoute = (pathname: string): boolean => {
  const key = normalizePathname(pathname)
  return key in STATIC_OG_IMAGE_BY_ROUTE || shouldUseDefaultOgImage(key)
}

export const allowsRouteSeoOgImage = (pathname: string): boolean =>
  isStaticOgImageRoute(pathname) || allowsPageContextOgImage(pathname)

export const getStaticOgImageForPathname = (pathname: string): string | undefined => {
  const key = normalizePathname(pathname)
  const src = STATIC_OG_IMAGE_BY_ROUTE[key]
  if (!src) return undefined
  return resolveSocialOgImageUrl(src, getSiteUrl())
}

export const toAbsoluteOgImageUrl = (src: string, base = getSiteUrl()): string => {
  const trimmed = src.trim()
  if (!trimmed) return ""
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (!trimmed.startsWith("/")) return `${base}/${trimmed}`
  return `${base}${trimmed}`
}

export const buildPageUrl = (pathname: string): string => {
  const path = normalizePathname(pathname)
  const origin = getShareOrigin()
  return `${origin}${path === "/" ? "" : path}`
}

/** Social crawlers (LinkedIn, Slack, etc.) do not reliably support AVIF for og:image. */
const SOCIAL_OG_IMAGE_FALLBACKS: Record<string, string> = {
  "/images/aiHealthcareCompliance.avif": "/images/aiHealthcareCompliance.jpg",
  "/images/complianceevent-desc.jpeg": "/images/aiHealthcareCompliance.jpg",
}

export type SocialOgImageOptions = {
  /** Crop Sanity (and similar) assets to a square for event/program card previews. */
  square?: boolean
}

const withSanitySocialImage = (url: string, square: boolean): string => {
  if (!url.includes("cdn.sanity.io")) return url
  try {
    const parsed = new URL(url)
    if (!parsed.searchParams.has("fm")) {
      parsed.searchParams.set("fm", "jpg")
    }
    parsed.searchParams.set("auto", "format")
    if (square) {
      parsed.searchParams.set("w", "1200")
      parsed.searchParams.set("h", "1200")
      parsed.searchParams.set("fit", "crop")
      parsed.searchParams.set("crop", "center")
    } else if (!parsed.searchParams.has("w")) {
      parsed.searchParams.set("w", "1200")
    }
    return parsed.toString()
  } catch {
    return url
  }
}

export const resolveSocialOgImageUrl = (
  src: string | undefined,
  origin = getShareOrigin(),
  options: SocialOgImageOptions = {},
): string | undefined => {
  const trimmed = src?.trim()
  if (!trimmed) return undefined

  const pathOnly = trimmed.startsWith("http")
    ? (() => {
        try {
          return new URL(trimmed).pathname
        } catch {
          return trimmed
        }
      })()
    : trimmed

  let resolved = SOCIAL_OG_IMAGE_FALLBACKS[pathOnly] ?? trimmed

  if (/\.avif($|\?)/i.test(resolved) && !SOCIAL_OG_IMAGE_FALLBACKS[pathOnly]) {
    const jpgPath = pathOnly.replace(/\.avif$/i, ".jpg")
    resolved = SOCIAL_OG_IMAGE_FALLBACKS[jpgPath] ?? jpgPath
  }

  const square = Boolean(options.square)

  if (/^https?:\/\//i.test(resolved)) {
    return withSanitySocialImage(resolved, square)
  }

  const absolute = toAbsoluteOgImageUrl(resolved, origin)
  if (!absolute) return undefined

  const withVersion = (() => {
    if (/^https?:\/\//i.test(absolute) && absolute.includes("cdn.sanity.io")) {
      return absolute
    }
    const version = (
      (import.meta as unknown as { env?: Record<string, unknown> })?.env
        ?.VITE_OG_IMAGE_VERSION as string | undefined
    )?.trim()
    if (!version) return absolute
    const joiner = absolute.includes("?") ? "&" : "?"
    return `${absolute}${joiner}v=${encodeURIComponent(version)}`
  })()

  return withSanitySocialImage(withVersion, square)
}

/** Absolute OG image for share embeds; falls back to site default when source is missing. */
export const resolveShareOgImageUrl = (
  src: string | undefined,
  options: SocialOgImageOptions = {},
): string => resolveSocialOgImageUrl(src, getShareOrigin(), options) ?? getDefaultOgImageUrl()

const EVENT_DETAIL_SEO: RouteSeoConfig = {
  title: "Event — Rellia Health",
  description:
    "Event details, location, and registration for Rellia Health sessions. Explore upcoming and past programs.",
  indexable: true,
}

const ADMIN_AREA_SEO: RouteSeoConfig = {
  title: "Admin — Rellia Health",
  description:
    "Rellia Health internal admin area for diagnostic and operational review. Not indexed for search.",
  indexable: false,
}

/** Static app routes that should appear in sitemap.xml (indexable only). */
export const getIndexableStaticPaths = (): string[] =>
  Object.entries(ROUTE_SEO)
    .filter(([, config]) => config.indexable)
    .map(([path]) => normalizePathname(path))
    .sort((a, b) => a.localeCompare(b))

export const getSeoForPathname = (pathname: string): RouteSeoConfig => {
  const key = normalizePathname(pathname)
  if (key.startsWith("/events/") && key !== "/events") {
    return EVENT_DETAIL_SEO
  }
  if (key.startsWith("/admin") || key === "/accept-invite") {
    return ROUTE_SEO[key] ?? ADMIN_AREA_SEO
  }
  return ROUTE_SEO[key] ?? NOT_FOUND_SEO
}

const PROGRAMS_EVENT_PRERENDER_PATHS = [
  ...DEFAULT_PROGRAMS_LANDING.upcomingEvents.map(programsEventDetailPath),
  ...DEFAULT_PROGRAMS_LANDING.pastEvents.map(programsEventDetailPath),
]

const isMainBranchBuild = (): boolean => {
  const ref = (
    typeof process !== "undefined"
      ? process.env?.VERCEL_GIT_COMMIT_REF
      : (import.meta as unknown as { env?: Record<string, unknown> })?.env?.VITE_VERCEL_GIT_COMMIT_REF as string | undefined
  ) ?? ""
  return ref.trim().toLowerCase() === "main"
}

export const STORY_PRERENDER_PATHS: string[] = isMainBranchBuild()
  ? []
  : STORIES.map((story) => `/stories/${story.slug}`)

const SEED_DIRECTORY_PRERENDER_PATHS: string[] = isMainBranchBuild()
  ? []
  : [
      ...FOUNDER_DIRECTORY.map((f) => `/founders/alumni/${f.id}`),
      ...ADVISOR_DIRECTORY_SEED.map((a) => `/advisors/directory/${a.id}`),
    ]

/** Auth/admin routes use AuthProvider client-side only — SEO via RouteSeo, not prerender. */
export const isClientOnlyAuthPath = (pathname: string): boolean => {
  const key = normalizePathname(pathname)
  return key.startsWith("/admin") || key === "/accept-invite"
}

/** @deprecated Use isClientOnlyAuthPath */
export const isAdminPrerenderPath = isClientOnlyAuthPath

/** Paths emitted as static HTML at build time (see `client/prerender.tsx`). */
export const PRERENDER_PATHS: string[] = [
  "/",
  ...Object.keys(ROUTE_SEO).filter((p) => p !== "/" && !isClientOnlyAuthPath(p)),
  ...PROGRAMS_EVENT_PRERENDER_PATHS,
  ...STORY_PRERENDER_PATHS,
  ...SEED_DIRECTORY_PRERENDER_PATHS,
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
