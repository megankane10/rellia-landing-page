import {
  getDirectoryExpertiseTags,
  getPrimaryDirectoryTag,
  type DirectoryFilterAssignment,
} from "@/lib/directoryFilterValues"

type AdvisorTagSource = {
  expertiseTags?: string[] | null
  directoryFilters?: DirectoryFilterAssignment[]
}

export const resolveAdvisorPrimaryTag = (advisor: AdvisorTagSource): string | undefined => {
  const fromProjection = getPrimaryDirectoryTag(
    Array.isArray(advisor.expertiseTags) ? advisor.expertiseTags : [],
  )
  if (fromProjection) return fromProjection

  return getPrimaryDirectoryTag(getDirectoryExpertiseTags(advisor.directoryFilters))
}
