type AdvisorTagSource = {
  primaryExpertise?: string | null
  filter?: string | null
  directoryFilters?: Array<{ groupId?: string; values?: string[]; groupTitle?: string }>
}

export const resolveAdvisorPrimaryTag = (advisor: AdvisorTagSource): string | undefined => {
  const explicit = advisor.primaryExpertise?.trim()
  if (explicit) return explicit

  const legacy = advisor.filter?.trim()
  if (legacy) return legacy

  const assignments = Array.isArray(advisor.directoryFilters) ? advisor.directoryFilters : []
  const expertiseValues = assignments.flatMap((assignment) => {
    const title = (assignment.groupTitle ?? "").toLowerCase()
    const isExpertise =
      title === "expertise" ||
      title.includes("expertise") ||
      title === "specialty" ||
      title.includes("specialt")
    if (!isExpertise) return []
    return Array.isArray(assignment.values) ? assignment.values.filter(Boolean) : []
  })
  if (expertiseValues[0]) return expertiseValues[0]

  return undefined
}
