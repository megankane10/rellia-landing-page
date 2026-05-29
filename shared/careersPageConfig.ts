import { CAREERS_OPEN_ROLES } from "./careersOpenRoles"

const isProductionMarketingHost = (): boolean => {
  if (typeof window === "undefined") return false
  const host = window.location.hostname.toLowerCase()
  return host === "relliahealth.com" || host === "www.relliahealth.com"
}

/**
 * Careers page + navbar badge toggles.
 * - Volunteer ON: VOLUNTEER badge; Fillout embed + optional secondary CTA in Join band.
 * - Open roles ON (published + non-empty list): Open Roles section + HIRING badge; primary CTA → #open-roles when hiring is on.
 * - Both ON: HIRING + VOLUNTEER badges; Join band primary “See open roles”, secondary outline “Volunteer with us”.
 */
export const CAREERS_VOLUNTEER_ENABLED = true

/** Placeholder roles in code — only for preview/Vercel when CMS has no roles yet. */
export const CAREERS_OPEN_ROLES_PUBLISHED = true

export const careersHasPublishedOpenRoles = (): boolean => {
  if (isProductionMarketingHost()) return false
  return CAREERS_OPEN_ROLES_PUBLISHED && CAREERS_OPEN_ROLES.length > 0
}
