import { cn } from "@/lib/utils"

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

/** Overview recent lists: newest submissions first. */
export const sortOverviewRecentSubmissions = <
  T extends { created_at: string; status?: SubmissionStatus | null },
>(
  rows: T[],
  limit = 5,
): T[] =>
  [...rows]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)

/** Persist status change time for pending-over-time charts */
export const submissionStatusUpdatePayload = (status: SubmissionStatus) => ({
  status,
  status_updated_at: new Date().toISOString(),
})

const SUBMISSION_STATUS_CHIP_BASE =
  "inline-flex shrink-0 items-center rounded-full border font-urbanist text-sm font-semibold"

const SUBMISSION_STATUS_CHIP_COLORS_LIGHT: Record<SubmissionStatus, string> = {
  New: "bg-blue-50 text-blue-700 border-blue-200/70",
  "In Progress": "bg-orange-50 text-orange-700 border-orange-200/70",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
}

/** Portaled popovers — explicit low-opacity fills on dark surfaces */
const SUBMISSION_STATUS_CHIP_COLORS_DARK: Record<SubmissionStatus, string> = {
  New: "bg-blue-500/10 text-blue-400 border-blue-500/40",
  "In Progress": "bg-orange-500/10 text-orange-400 border-orange-500/40",
  Resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/40",
}

const SUBMISSION_STATUS_CHIP_COLORS: Record<SubmissionStatus, string> = {
  New: `${SUBMISSION_STATUS_CHIP_COLORS_LIGHT.New} dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/40`,
  "In Progress":
    `${SUBMISSION_STATUS_CHIP_COLORS_LIGHT["In Progress"]} dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/40`,
  Resolved:
    `${SUBMISSION_STATUS_CHIP_COLORS_LIGHT.Resolved} dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/40`,
}

const statusFocusRingClass = (status: SubmissionStatus) => {
  if (status === "Resolved") return "focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-500/40"
  if (status === "In Progress") return "focus-visible:ring-orange-200 dark:focus-visible:ring-orange-500/40"
  return "focus-visible:ring-blue-200 dark:focus-visible:ring-blue-500/40"
}

const statusActiveRingClass = (status: SubmissionStatus) => {
  if (status === "Resolved") return "ring-emerald-200/90 dark:ring-emerald-500/45"
  if (status === "In Progress") return "ring-orange-200/90 dark:ring-orange-500/45"
  return "ring-blue-200/90 dark:ring-blue-500/45"
}

const statusCountBadgeClass = (status: SubmissionStatus, strong: boolean) => {
  if (status === "Resolved") {
    return strong
      ? "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
      : "bg-emerald-100/60 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
  }
  if (status === "In Progress") {
    return strong
      ? "bg-orange-100/80 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300"
      : "bg-orange-100/60 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400"
  }
  return strong
    ? "bg-blue-100/80 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300"
    : "bg-blue-100/60 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
}

export const statusBadgeClass = (status: SubmissionStatus) =>
  cn(SUBMISSION_STATUS_CHIP_BASE, "px-3 py-1", SUBMISSION_STATUS_CHIP_COLORS[status])

/** Status chips inside portaled admin popovers (no `.dark` ancestor). */
export const statusBadgeClassForTheme = (status: SubmissionStatus, theme: "light" | "dark") =>
  cn(
    SUBMISSION_STATUS_CHIP_BASE,
    "px-3 py-1",
    theme === "dark" ? SUBMISSION_STATUS_CHIP_COLORS_DARK[status] : SUBMISSION_STATUS_CHIP_COLORS_LIGHT[status],
  )

/** Inbox / list status filter pills — each option uses its status colour. */
export const statusFilterButtonClass = (status: StatusFilterValue, isActive: boolean) => {
  const base = cn(
    "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-3 font-urbanist text-sm font-semibold transition-[color,box-shadow,opacity] duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  )

  if (status === "all") {
    return cn(
      base,
      "focus-visible:ring-rellia-teal/25 dark:focus-visible:ring-rellia-mint/30",
      isActive
        ? "border-border bg-muted/90 text-foreground ring-2 ring-rellia-teal/15 dark:border-slate-600 dark:bg-slate-700/70 dark:text-white dark:ring-rellia-mint/25"
        : "border-border bg-card text-muted-foreground hover:bg-muted/50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800",
    )
  }

  return cn(
    base,
    SUBMISSION_STATUS_CHIP_COLORS[status],
    statusFocusRingClass(status),
    isActive ? cn("ring-2", statusActiveRingClass(status)) : "opacity-85 hover:opacity-100",
  )
}

export const statusFilterCountBadgeClass = (status: StatusFilterValue, isActive: boolean) => {
  const countBase = "rounded-full px-1.5 py-0.5 text-xs font-medium"

  if (status === "all") {
    return cn(
      countBase,
      isActive
        ? "bg-black/10 text-foreground dark:bg-white/15 dark:text-white"
        : "bg-black/5 text-muted-foreground dark:bg-white/8 dark:text-slate-400",
    )
  }

  return cn(countBase, statusCountBadgeClass(status, isActive))
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

/** Minute-level relative time for dashboard presence (e.g. "Just now", "12 min ago"). */
export const formatAdminActivityAgo = (iso: string): string => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""

  const diffMs = Date.now() - date.getTime()
  if (diffMs < 0) return "Just now"

  const minutes = Math.floor(diffMs / (60 * 1000))
  if (minutes < 1) return "Just now"
  if (minutes < 60) return minutes === 1 ? "1 min ago" : `${minutes} min ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours === 1 ? "1 hr ago" : `${hours} hr ago`

  return formatAdminRelativeAgo(iso)
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
