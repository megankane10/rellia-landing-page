import type { CareersOpenRole, CareersPageContent } from "./cms/types"
import { normalizeToPortableText } from "./cms/normalizePortableText"
import { portableTextToPlainText } from "./cms/portableTextPlain"
import { CAREERS_OPEN_ROLES } from "./careersOpenRoles"
import { buildMailtoHref, parseMailtoHref } from "./mailto"

/** Legacy seeded role IDs — hidden on production if they still exist in an old dataset. */
export const PLACEHOLDER_OPEN_ROLE_IDS = new Set([
  "program-operations-manager",
  "community-events-coordinator",
])

export const normalizeOpenRole = (role: Partial<CareersOpenRole> & { id?: string; roleId?: string }) => {
  const id =
    (typeof role.id === "string" ? role.id : typeof role.roleId === "string" ? role.roleId : "").trim()
  const label = typeof role.applyButtonLabel === "string" ? role.applyButtonLabel.trim() : ""
  const url = typeof role.applyButtonUrl === "string" ? role.applyButtonUrl.trim() : ""

  return {
    id,
    title: typeof role.title === "string" ? role.title.trim() : "",
    location: typeof role.location === "string" ? role.location.trim() : "",
    employmentType: typeof role.employmentType === "string" ? role.employmentType.trim() : "",
    description: normalizeToPortableText(role.description),
    responsibilities: Array.isArray(role.responsibilities)
      ? role.responsibilities.filter((r): r is string => typeof r === "string" && r.trim() !== "")
      : [],
    applyButtonLabel: label || undefined,
    applyButtonUrl: url || undefined,
  }
}

export const hasOpenRoleDescription = (description: CareersOpenRole["description"]): boolean =>
  Boolean(portableTextToPlainText(description))

export const hasOpenRoleApplyButton = (role: Pick<CareersOpenRole, "applyButtonLabel" | "applyButtonUrl">): boolean =>
  Boolean(role.applyButtonLabel?.trim() && role.applyButtonUrl?.trim())

export const isOpenRoleMailtoApplyUrl = (url: string | undefined): boolean =>
  typeof url === "string" && url.trim().toLowerCase().startsWith("mailto:")

export const resolveOpenRoleApplyHref = (
  role: Pick<CareersOpenRole, "applyButtonUrl" | "title">,
): string | undefined => {
  const url = typeof role.applyButtonUrl === "string" ? role.applyButtonUrl.trim() : ""
  if (!url) return undefined
  if (!isOpenRoleMailtoApplyUrl(url)) return url

  const parsed = parseMailtoHref(url)
  const email = parsed?.email ?? url.slice(7).split("?")[0]?.trim()
  if (!email) return url

  const subjectFromTitle = role.title.trim()
    ? `Application: ${role.title.trim()}`
    : parsed?.subject

  return buildMailtoHref(email, {
    subject: subjectFromTitle,
    body: parsed?.body,
  })
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
        hasOpenRoleDescription(role.description),
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
