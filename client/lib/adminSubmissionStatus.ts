export type SubmissionStatus = "New" | "In Progress" | "Resolved"

export const SUBMISSION_STATUS_OPTIONS: SubmissionStatus[] = [
  "New",
  "In Progress",
  "Resolved",
]

export const isActiveSubmissionStatus = (status: SubmissionStatus | null | undefined): boolean => {
  const value = status ?? "New"
  return value === "New" || value === "In Progress"
}

export const statusBadgeClass = (status: SubmissionStatus) => {
  if (status === "Resolved") return "bg-emerald-50 text-emerald-800 border-emerald-200"
  if (status === "In Progress") return "bg-amber-50 text-amber-900 border-amber-200"
  return "bg-sky-50 text-sky-900 border-sky-200"
}

export const formatAdminDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

export const formatAdminDateLong = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

export const countRecentSubmissions = <T extends { created_at: string }>(
  rows: T[],
  withinDays = 7,
): number => {
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000
  return rows.filter((row) => new Date(row.created_at).getTime() >= cutoff).length
}

export type StatusFilterValue = SubmissionStatus | "all"

export const countByStatusFilter = <T extends { status?: SubmissionStatus | null }>(
  rows: T[],
): Record<StatusFilterValue, number> => {
  const counts: Record<StatusFilterValue, number> = {
    all: rows.length,
    New: 0,
    "In Progress": 0,
    Resolved: 0,
  }

  for (const row of rows) {
    const status = (row.status ?? "New") as SubmissionStatus
    counts[status] += 1
  }

  return counts
}

export const matchesStatusFilter = <T extends { status?: SubmissionStatus | null }>(
  row: T,
  filter: StatusFilterValue,
): boolean => {
  if (filter === "all") return true
  return (row.status ?? "New") === filter
}
