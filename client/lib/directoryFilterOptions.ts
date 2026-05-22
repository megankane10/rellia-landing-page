import type { DirectoryFilterGroup } from "@/hooks/useCmsDocuments"

const isCountryGroup = (group: DirectoryFilterGroup): boolean => {
  const id = (group.id ?? "").toLowerCase()
  const title = (group.title ?? "").toLowerCase()
  return id === "country" || id.includes("country") || title === "country" || title.includes("country")
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
