import type { DirectoryFilterGroup } from "@/hooks/useCmsDocuments"
import {
  getDirectoryBusinessModels,
  getDirectoryCountries,
  getDirectoryExpertiseTags,
  getDirectorySpecialties,
  type DirectoryFilterAssignment,
} from "@/lib/directoryFilterValues"

export const isCountryGroup = (group: DirectoryFilterGroup): boolean => {
  const id = (group.id ?? "").toLowerCase()
  const title = (group.title ?? "").toLowerCase()
  return (
    id === "country" ||
    id === "countries" ||
    title === "country" ||
    title === "countries"
  )
}

const countryGroupPriority = (group: DirectoryFilterGroup): number => {
  const id = (group.id ?? "").toLowerCase()
  const title = (group.title ?? "").toLowerCase()
  if (id === "country" || title === "country") return 0
  if (id === "countries" || title === "countries") return 1
  return 2
}

const expertiseGroupPriority = (group: DirectoryFilterGroup): number => {
  const id = (group.id ?? "").toLowerCase()
  const title = (group.title ?? "").toLowerCase()
  if (id === "expertise" || title === "expertise") return 0
  if (title === "specialty" || title === "specialties" || id.includes("specialt")) return 1
  return 2
}

/** Keep a single Country and single Expertise/Specialty group when Sanity has legacy duplicates. */
export const dedupeDirectoryFilterGroups = (
  groups: DirectoryFilterGroup[],
): DirectoryFilterGroup[] => {
  const countryGroups = groups.filter(isCountryGroup)
  const expertiseGroups = groups.filter(isExpertiseGroup)
  const preferredCountry =
    countryGroups.length > 0
      ? [...countryGroups].sort(
          (a, b) => countryGroupPriority(a) - countryGroupPriority(b),
        )[0]
      : undefined
  const preferredExpertise =
    expertiseGroups.length > 0
      ? [...expertiseGroups].sort(
          (a, b) => expertiseGroupPriority(a) - expertiseGroupPriority(b),
        )[0]
      : undefined

  return groups.filter((group) => {
    if (isCountryGroup(group)) {
      return preferredCountry?.id === group.id
    }
    if (isExpertiseGroup(group)) {
      return preferredExpertise?.id === group.id
    }
    return true
  })
}

export const getDirectoryGroupOptionLabels = (
  groups: DirectoryFilterGroup[],
  entries: Array<{ directoryFilters?: Array<{ groupId?: string; values?: string[] }> }>,
): Map<string, string[]> => {
  const optionsByGroupId = new Map<string, string[]>()

  for (const group of groups) {
    const base = new Set<string>()
    for (const opt of Array.isArray(group.options) ? group.options : []) {
      const label = (opt?.label ?? "").trim()
      if (label) base.add(label)
    }
    optionsByGroupId.set(group.id, Array.from(base))
  }

  for (const entry of entries) {
    const assignments = Array.isArray(entry?.directoryFilters) ? entry.directoryFilters : []
    for (const assignment of assignments) {
      const groupId = (assignment?.groupId ?? "").trim()
      if (!groupId) continue
      if (!optionsByGroupId.has(groupId)) optionsByGroupId.set(groupId, [])
      const current = new Set(optionsByGroupId.get(groupId) ?? [])
      for (const v of Array.isArray(assignment?.values) ? assignment.values : []) {
        const label = typeof v === "string" ? v.trim() : ""
        if (label) current.add(label)
      }
      optionsByGroupId.set(groupId, Array.from(current))
    }
  }

  for (const [groupId, opts] of optionsByGroupId.entries()) {
    optionsByGroupId.set(groupId, opts.sort((a, b) => a.localeCompare(b)))
  }

  return optionsByGroupId
}

export const directoryGroupHasCountry = (groups: DirectoryFilterGroup[]): boolean =>
  groups.some(isCountryGroup)

const isSpecialtyGroup = (group: DirectoryFilterGroup): boolean => {
  const id = (group.id ?? "").toLowerCase()
  const title = (group.title ?? "").toLowerCase()
  return (
    title === "specialty" ||
    title === "specialties" ||
    id === "specialty" ||
    id.includes("specialty")
  )
}

const isBusinessModelGroup = (group: DirectoryFilterGroup): boolean => {
  const id = (group.id ?? "").toLowerCase()
  const title = (group.title ?? "").toLowerCase()
  return title === "business model" || id.includes("business-model")
}

const getDirectoryFilterValuesForGroup = (
  assignments: DirectoryFilterAssignment[] | undefined,
  groupId: string,
): string[] => {
  const normalizedGroupId = groupId.trim()
  if (!normalizedGroupId) return []
  const values = new Set<string>()
  for (const assignment of Array.isArray(assignments) ? assignments : []) {
    if ((assignment.groupId ?? "").trim() !== normalizedGroupId) continue
    for (const value of Array.isArray(assignment.values) ? assignment.values : []) {
      const trimmed = typeof value === "string" ? value.trim() : ""
      if (trimmed) values.add(trimmed)
    }
  }
  return Array.from(values)
}

const getUnifiedGroupValues = (
  group: DirectoryFilterGroup,
  entry: {
    directoryFilters?: DirectoryFilterAssignment[]
    countries?: string[]
    specialtyTags?: string[]
    businessModels?: string[]
    expertiseTags?: string[]
  },
): string[] => {
  const fromGroupId = getDirectoryFilterValuesForGroup(entry.directoryFilters, group.id ?? "")
  if (fromGroupId.length > 0) return fromGroupId

  const assignments = entry.directoryFilters
  if (isCountryGroup(group)) {
    const fromAssignments = getDirectoryCountries(assignments)
    return fromAssignments.length > 0 ? fromAssignments : (entry.countries ?? [])
  }
  if (isSpecialtyGroup(group)) {
    const fromAssignments = getDirectorySpecialties(assignments)
    return fromAssignments.length > 0 ? fromAssignments : (entry.specialtyTags ?? [])
  }
  if (isBusinessModelGroup(group)) {
    const fromAssignments = getDirectoryBusinessModels(assignments)
    return fromAssignments.length > 0 ? fromAssignments : (entry.businessModels ?? [])
  }
  if (isExpertiseGroup(group)) {
    const fromAssignments = getDirectoryExpertiseTags(assignments)
    return fromAssignments.length > 0 ? fromAssignments : (entry.expertiseTags ?? [])
  }
  return []
}

/** Match a directory filter dropdown value against CMS directory filter assignments. */
export const matchesDirectoryFilterSelection = (
  group: DirectoryFilterGroup,
  selected: string,
  entry: {
    directoryFilters?: DirectoryFilterAssignment[]
    countries?: string[]
    specialtyTags?: string[]
    businessModels?: string[]
    expertiseTags?: string[]
  },
): boolean => {
  const normalizedSelected = selected.trim().toLowerCase()
  if (!normalizedSelected || normalizedSelected === "all") return true

  return getUnifiedGroupValues(group, entry).some(
    (value) => value.trim().toLowerCase() === normalizedSelected,
  )
}

export const isExpertiseGroup = (group: DirectoryFilterGroup): boolean => {
  const id = (group.id ?? "").toLowerCase()
  const title = (group.title ?? "").toLowerCase()
  return (
    id === "expertise" ||
    id.includes("expertise") ||
    title === "expertise" ||
    title.includes("expertise") ||
    title === "specialty" ||
    title.includes("specialty")
  )
}

export const findExpertiseGroup = (
  groups: DirectoryFilterGroup[],
): DirectoryFilterGroup | undefined => groups.find(isExpertiseGroup)

export const isAdvisorDirectoryFilterGroup = (group: DirectoryFilterGroup): boolean =>
  isCountryGroup(group) || isExpertiseGroup(group)

export const filterAdvisorDirectoryGroups = (
  groups: DirectoryFilterGroup[],
): DirectoryFilterGroup[] =>
  dedupeDirectoryFilterGroups(groups.filter(isAdvisorDirectoryFilterGroup))

export const filterFounderDirectoryGroups = (
  groups: DirectoryFilterGroup[],
): DirectoryFilterGroup[] => {
  const allowed = (group: DirectoryFilterGroup): boolean => {
    const id = (group.id ?? "").toLowerCase()
    const title = (group.title ?? "").toLowerCase()
    return (
      isCountryGroup(group) ||
      title === "specialty" ||
      title === "specialties" ||
      id.includes("specialty") ||
      title === "business model" ||
      id.includes("business-model")
    )
  }
  return dedupeDirectoryFilterGroups(groups.filter(allowed))
}

