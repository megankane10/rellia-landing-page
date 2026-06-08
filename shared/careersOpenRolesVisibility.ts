import type { CareersOpenRole, CareersPageContent } from "./cms/types"
import { CAREERS_OPEN_ROLES } from "./careersOpenRoles"

/** Legacy seeded role IDs — hidden on production if they still exist in an old dataset. */
export const PLACEHOLDER_OPEN_ROLE_IDS = new Set([
  "program-operations-manager",
  "community-events-coordinator",
])

export const normalizeOpenRole = (role: Partial<CareersOpenRole> & { id?: string; roleId?: string }) => {
  const id =
    (typeof role.id === "string" ? role.id : typeof role.roleId === "string" ? role.roleId : "").trim()
  return {
    id,
    title: typeof role.title === "string" ? role.title.trim() : "",
    location: typeof role.location === "string" ? role.location.trim() : "",
    employmentType: typeof role.employmentType === "string" ? role.employmentType.trim() : "",
    description: typeof role.description === "string" ? role.description.trim() : "",
    responsibilities: Array.isArray(role.responsibilities)
      ? role.responsibilities.filter((r): r is string => typeof r === "string" && r.trim() !== "")
      : [],
    linkedInApplyUrl:
      typeof role.linkedInApplyUrl === "string" ? role.linkedInApplyUrl.trim() : "",
  }
}

export const filterValidOpenRoles = (
  roles: Array<Partial<CareersOpenRole> & { id?: string; roleId?: string }> | undefined,
): CareersOpenRole[] =>
  (roles ?? [])
    .map(normalizeOpenRole)
    .filter(
      (role) =>
        role.id &&
        role.title &&
        role.location &&
        role.employmentType &&
        role.description &&
        role.responsibilities.length > 0 &&
        role.linkedInApplyUrl,
    )

export type ResolveOpenRolesOptions = {
  isProductionSite: boolean
  allowSeedFallbacks: boolean
  isSanityConfigured: boolean
}

/** Open roles on /careers — production hides seeded placeholder roles only. */
export const resolveCareersOpenRoles = (
  _page: Partial<CareersPageContent> | null | undefined,
  opts: ResolveOpenRolesOptions,
): CareersOpenRole[] => {
  let fromCms = filterValidOpenRoles(_page?.openRoles)

  if (opts.isProductionSite) {
    fromCms = fromCms.filter((role) => !PLACEHOLDER_OPEN_ROLE_IDS.has(role.id))
    return fromCms
  }

  if (fromCms.length > 0) return fromCms
  if (opts.isSanityConfigured && !opts.allowSeedFallbacks) return []
  if (!opts.allowSeedFallbacks) return []
  return [...CAREERS_OPEN_ROLES]
}

export const careersHasVisibleOpenRoles = (
  page: Partial<CareersPageContent> | null | undefined,
  opts: ResolveOpenRolesOptions,
): boolean => resolveCareersOpenRoles(page, opts).length > 0
