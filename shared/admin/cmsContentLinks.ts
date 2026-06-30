import { resolvePublicWebsiteUrl, resolveSiteOrigin } from "./notifyLinks"

export type CmsContentLinkRow = {
  _type: string
  _id: string
  slug?: string | null
  roleId?: string | null
}

/** Singleton documents — `_id` matches schema type and maps to a fixed route. */
const SINGLETON_PUBLIC_PATHS: Record<string, string> = {
  homePage: "/",
  aboutPage: "/about",
  faqPage: "/faq",
  careersPage: "/careers",
  programsLandingPage: "/programs",
  eventsLandingPage: "/events",
  contactPage: "/contact",
  applyPage: "/apply",
  paymentPage: "/membership",
  consultingPage: "/consulting",
  diagnosticLandingPage: "/startup-diagnostic",
  diagnosticSurveyContent: "/diagnostic-survey",
  termsPage: "/terms",
  privacyPage: "/privacy",
  storiesPage: "/stories",
  networkFoundersPage: "/founders",
  networkAdvisorsPage: "/advisors",
  networkInvestorsPage: "/investors",
  networkPartnersPage: "/industry-partners",
  networkAdvisorsDirectoryPage: "/advisors/directory",
  networkAlumniDirectoryPage: "/founders/alumni",
}

const trimSlug = (value?: string | null) =>
  typeof value === "string" ? value.trim() : ""

/** Relative public path for a CMS document, when one exists. */
export const publicPathForCmsContent = (row: CmsContentLinkRow): string | null => {
  const singletonPath = SINGLETON_PUBLIC_PATHS[row._type]
  if (singletonPath) return singletonPath

  const slug = trimSlug(row.slug)
  if (!slug) return null

  switch (row._type) {
    case "story":
      return `/stories/${slug}`
    case "event":
      return `/events/${slug}`
    case "program":
      return `/programs/${slug}`
    case "advisor":
      return `/advisors/directory/${slug}`
    case "alumniCompany":
      return `/founders/alumni/${slug}`
    case "page":
      return `/${slug}`
    case "openRole": {
      const anchor = trimSlug(row.roleId) || slug
      return `/careers#${anchor}`
    }
    default:
      return null
  }
}

export const publicWebsiteUrlForCmsContent = (row: CmsContentLinkRow): string | null => {
  const path = publicPathForCmsContent(row)
  if (!path) return null
  return `${resolvePublicWebsiteUrl()}${path}`
}

/** Absolute public URL for server-side notifications (always production origin). */
export const publicSiteUrlForCmsContent = (row: CmsContentLinkRow): string | null => {
  const path = publicPathForCmsContent(row)
  if (!path) return null
  return `${resolveSiteOrigin()}${path}`
}
