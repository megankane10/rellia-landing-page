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
  const base =
    "font-medium px-2.5 py-1 text-xs rounded-full border font-urbanist"

  if (status === "Resolved") {
    return `${base} bg-emerald-50 text-emerald-700 border-emerald-200/70 hover:bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/70 dark:hover:bg-emerald-500/10`
  }
  if (status === "In Progress") {
    return `${base} bg-amber-50 text-amber-700 border-amber-200/70 hover:bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/70 dark:hover:bg-amber-500/10`
  }
  return `${base} bg-blue-50 text-blue-700 border-blue-200/70 hover:bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/70 dark:hover:bg-blue-500/10`
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

/** Human-readable relative time for admin activity (e.g. "Today", "3 days ago"). */
export const formatAdminRelativeAgo = (iso: string): string => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dayDiff = Math.round((startOfToday.getTime() - startOfDate.getTime()) / (24 * 60 * 60 * 1000))

  if (dayDiff <= 0) return "Today"
  if (dayDiff === 1) return "Yesterday"
  if (dayDiff < 7) return `${dayDiff} days ago`
  if (dayDiff < 30) {
    const weeks = Math.floor(dayDiff / 7)
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
  }
  const months = Math.floor(dayDiff / 30)
  return months === 1 ? "1 month ago" : `${months} months ago`
}

export const formatAdminDateWithWeekday = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
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
