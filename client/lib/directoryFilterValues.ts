export type DirectoryFilterAssignment = {
  groupId?: string
  groupTitle?: string
  values?: string[]
}

const normalizeKey = (value: string): string => value.trim().toLowerCase()

const matchesGroup = (
  assignment: DirectoryFilterAssignment,
  predicate: (groupId: string, groupTitle: string) => boolean,
): boolean => {
  const groupId = normalizeKey(assignment.groupId ?? "")
  const groupTitle = normalizeKey(assignment.groupTitle ?? "")
  return predicate(groupId, groupTitle)
}

export const isCountryGroupKey = (groupId: string, groupTitle: string): boolean =>
  groupId === "country" ||
  groupId === "countries" ||
  groupTitle === "country" ||
  groupTitle === "countries"

export const isSpecialtyGroupKey = (groupId: string, groupTitle: string): boolean =>
  groupId === "specialty" ||
  groupId === "specialties" ||
  groupId.includes("specialty") ||
  groupTitle === "specialty" ||
  groupTitle === "specialties" ||
  groupTitle.includes("specialt")

export const isBusinessModelGroupKey = (groupId: string, groupTitle: string): boolean =>
  groupId.includes("business-model") ||
  groupTitle === "business model" ||
  groupTitle.includes("business model")

export const isExpertiseGroupKey = (groupId: string, groupTitle: string): boolean =>
  groupId === "expertise" ||
  groupId.includes("expertise") ||
  groupTitle === "expertise" ||
  groupTitle.includes("expertise") ||
  isSpecialtyGroupKey(groupId, groupTitle)

export const getDirectoryFilterValues = (
  assignments: DirectoryFilterAssignment[] | undefined,
  predicate: (groupId: string, groupTitle: string) => boolean,
): string[] => {
  const values = new Set<string>()
  for (const assignment of Array.isArray(assignments) ? assignments : []) {
    if (!matchesGroup(assignment, predicate)) continue
    for (const value of Array.isArray(assignment.values) ? assignment.values : []) {
      const trimmed = typeof value === "string" ? value.trim() : ""
      if (trimmed) values.add(trimmed)
    }
  }
  return Array.from(values)
}

export const getDirectoryCountries = (
  assignments: DirectoryFilterAssignment[] | undefined,
): string[] => getDirectoryFilterValues(assignments, isCountryGroupKey)

export const getDirectorySpecialties = (
  assignments: DirectoryFilterAssignment[] | undefined,
): string[] => getDirectoryFilterValues(assignments, isSpecialtyGroupKey)

export const getDirectoryBusinessModels = (
  assignments: DirectoryFilterAssignment[] | undefined,
): string[] => getDirectoryFilterValues(assignments, isBusinessModelGroupKey)

export const getDirectoryExpertiseTags = (
  assignments: DirectoryFilterAssignment[] | undefined,
): string[] => getDirectoryFilterValues(assignments, isExpertiseGroupKey)

export const getPrimaryDirectoryTag = (tags: string[]): string | undefined =>
  tags.map((tag) => tag.trim()).find(Boolean)
