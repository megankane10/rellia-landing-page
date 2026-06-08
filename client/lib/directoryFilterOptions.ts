import type { DirectoryFilterGroup } from "@/hooks/useCmsDocuments"

const isCountryGroup = (group: DirectoryFilterGroup): boolean => {
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

export const getCountryFilterOptions = (
  groups: DirectoryFilterGroup[],
  entries: Array<{
    country?: string | string[]
    directoryFilters?: Array<{ groupId?: string; values?: string[] }>
  }>,
): Array<{ id: string; label: string }> => {
  const list = new Set<string>()

  const countryGroup = groups.find(isCountryGroup)
  if (countryGroup) {
    for (const opt of Array.isArray(countryGroup.options) ? countryGroup.options : []) {
      const label = (opt?.label ?? "").trim()
      if (label) list.add(label)
    }
    for (const entry of entries) {
      const assignments = Array.isArray(entry?.directoryFilters) ? entry.directoryFilters : []
      for (const assignment of assignments) {
        if ((assignment?.groupId ?? "").trim() !== countryGroup.id) continue
        for (const v of Array.isArray(assignment?.values) ? assignment.values : []) {
          const label = typeof v === "string" ? v.trim() : ""
          if (label) list.add(label)
        }
      }
    }
  }

  for (const entry of entries) {
    if (Array.isArray(entry.country)) {
      entry.country.forEach((ct) => {
        if (ct?.trim()) list.add(ct.trim())
      })
    } else if (typeof entry.country === "string" && entry.country.trim()) {
      list.add(entry.country.trim())
    }
  }

  return [
    { id: "all", label: "All Countries" },
    ...Array.from(list)
      .sort((a, b) => a.localeCompare(b))
      .map((ct) => ({ id: ct, label: ct })),
  ]
}

export const directoryGroupHasCountry = (groups: DirectoryFilterGroup[]): boolean =>
  groups.some(isCountryGroup)

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

/** Union CMS options, advisorFilter docs, and canonical labels (full expertise list). */
export const mergeExpertiseOptionLabels = (
  current: string[],
  advisorFilterLabels: string[],
  canonicalLabels: string[],
): string[] => {
  const merged = new Set<string>()
  for (const label of canonicalLabels) {
    const trimmed = label.trim()
    if (trimmed) merged.add(trimmed)
  }
  for (const label of advisorFilterLabels) {
    const trimmed = label.trim()
    if (trimmed) merged.add(trimmed)
  }
  for (const label of current) {
    const trimmed = label.trim()
    if (trimmed) merged.add(trimmed)
  }
  return Array.from(merged).sort((a, b) => a.localeCompare(b))
}
