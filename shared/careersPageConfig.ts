import { CAREERS_OPEN_ROLES } from "./careersOpenRoles"

/**
 * Careers page + navbar badge toggles.
 * - Volunteer ON: VOLUNTEER badge; Fillout embed + optional secondary CTA in Join band.
 * - Open roles ON (published + non-empty list): Open Roles section + HIRING badge; primary CTA → #open-roles when hiring is on.
 * - Both ON: HIRING + VOLUNTEER badges; Join band primary “See open roles”, secondary outline “Volunteer with us”.
 */
export const CAREERS_VOLUNTEER_ENABLED = true

/** When true and CAREERS_OPEN_ROLES is non-empty, show Open Roles section + HIRING badge. */
export const CAREERS_OPEN_ROLES_PUBLISHED = true

export const careersHasPublishedOpenRoles = (): boolean =>
  CAREERS_OPEN_ROLES_PUBLISHED && CAREERS_OPEN_ROLES.length > 0
