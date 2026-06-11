import type { CareersOpenRole } from "./types"
import { resolveCareersRoleSeo } from "./collectionSeo"

export const CAREERS_ROLE_QUERY_PARAM = "role"

const careersRolePathPrefix = "/careers/roles/"

export const careersRoleDetailPath = (roleId: string): string => {
  const id = roleId.trim()
  if (!id) return "/careers"
  return `${careersRolePathPrefix}${encodeURIComponent(id)}`
}

export const isCareersRoleDetailPath = (pathname: string): boolean => {
  const path = pathname.trim().replace(/\/+$/, "") || "/"
  if (!path.startsWith(careersRolePathPrefix)) return false
  const id = path.slice(careersRolePathPrefix.length).trim()
  return id.length > 0
}

export const parseCareersRoleIdFromPathname = (pathname: string): string | undefined => {
  const path = pathname.trim().replace(/\/+$/, "") || "/"
  if (!path.startsWith(careersRolePathPrefix)) return undefined
  const raw = path.slice(careersRolePathPrefix.length).trim()
  if (!raw) return undefined
  try {
    return decodeURIComponent(raw).trim() || undefined
  } catch {
    return raw || undefined
  }
}

export type CareersRoleLinkInput = {
  roleIdParam?: string | null
  search?: string
  hash?: string
}

/** Resolve role anchor from `/careers/roles/:id`, `?role=`, or `#id` (legacy). */
export const resolveLinkedCareersRoleId = ({
  roleIdParam,
  search = "",
  hash = "",
}: CareersRoleLinkInput): string | undefined => {
  const fromParam = roleIdParam?.trim()
  if (fromParam) return fromParam

  try {
    const roleFromQuery = new URLSearchParams(
      search.startsWith("?") ? search.slice(1) : search,
    ).get(CAREERS_ROLE_QUERY_PARAM)
    if (roleFromQuery?.trim()) return roleFromQuery.trim()
  } catch {
    // ignore malformed search
  }

  const hashId = hash.replace(/^#/, "").trim()
  if (hashId && hashId !== "open-roles" && hashId !== "life-at-rellia" && hashId !== "careers-volunteer") {
    return hashId
  }

  return undefined
}

export const findCareersOpenRoleById = (
  roles: CareersOpenRole[],
  roleId: string | undefined,
): CareersOpenRole | undefined => {
  const id = roleId?.trim()
  if (!id) return undefined
  return roles.find((role) => role.id === id)
}

export const CAREERS_ROLE_SHARE_OG_FALLBACK = "/images/careers-img.jpg"

export const buildCareersRoleShareMeta = (
  role: CareersOpenRole,
  options?: { heroImageSrc?: string },
) => ({
  ...resolveCareersRoleSeo(role),
  ogImageUrl: options?.heroImageSrc?.trim() || CAREERS_ROLE_SHARE_OG_FALLBACK,
})
