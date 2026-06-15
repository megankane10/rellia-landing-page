export type ProgramAvailabilityInput = {
  status?: string | null
}

const normalizeProgramStatus = (status?: string | null): string =>
  status?.trim().toLowerCase() ?? ""

export const isProgramWaitlist = (program: ProgramAvailabilityInput): boolean => {
  const status = normalizeProgramStatus(program.status)
  if (status === "available" || status === "upcoming") return false
  return status === "waitlist"
}

export const isProgramUpcoming = (program: ProgramAvailabilityInput): boolean =>
  normalizeProgramStatus(program.status) === "upcoming"

export const isProgramAvailable = (
  program: ProgramAvailabilityInput & { href?: string | null },
): boolean => {
  const status = normalizeProgramStatus(program.status)
  if (status === "hidden" || status === "waitlist") return false
  if (!program.href?.trim()) return false
  return !isProgramWaitlist(program)
}
