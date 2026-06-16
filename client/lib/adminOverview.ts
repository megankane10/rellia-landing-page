import type { SubmissionStatus } from "@/lib/adminSubmissionStatus"
import {
  countRecentSubmissions,
  isActiveSubmissionStatus,
} from "@/lib/adminSubmissionStatus"
import type { CompanyProfileRow, ContactRow } from "@/lib/adminSubmissions"

export type SubmissionTrendPeriod = "week" | "month" | "year"

export type SubmissionSourceFilter = "all" | "web" | "survey"

export type DaySubmissionCount = {
  label: string
  dateKey: string
  contacts: number
  diagnostics: number
  total: number
}

const DAY_MS = 24 * 60 * 60 * 1000

const startOfDay = (date: Date): Date => {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

const localDayStartMs = (iso: string): number | null => {
  const parsed = new Date(iso)
  const time = parsed.getTime()
  if (!Number.isFinite(time)) return null
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()).getTime()
}

const isCreatedInLocalDayRange = (iso: string, rangeStart: Date, rangeEnd: Date): boolean => {
  const day = localDayStartMs(iso)
  if (day === null) return false
  return day >= rangeStart.getTime() && day < rangeEnd.getTime()
}

const countSubmissionsInRange = (
  contacts: ContactRow[],
  diagnostics: CompanyProfileRow[],
  rangeStart: Date,
  rangeEnd: Date,
) => {
  const inRange = (iso: string) => isCreatedInLocalDayRange(iso, rangeStart, rangeEnd)

  const contactCount = contacts.filter((row) => inRange(row.created_at)).length
  const diagnosticCount = diagnostics.filter((row) => inRange(row.created_at)).length

  return {
    contacts: contactCount,
    diagnostics: diagnosticCount,
    total: contactCount + diagnosticCount,
  }
}

export const getSubmissionTrendTitle = (period: SubmissionTrendPeriod): string => {
  if (period === "year") return "Monthly inbox submissions"
  return "Daily inbox submissions"
}

export type TodayInboxSnapshot = {
  contacts: number
  diagnostics: number
  total: number
}

export type TodaySnapshotSegment = {
  key: "contacts" | "diagnostics"
  count: number
  label: string
}

export const countInboxSubmissionsToday = (
  contacts: ContactRow[],
  diagnostics: CompanyProfileRow[],
): TodayInboxSnapshot => {
  const todayStart = startOfDay(new Date())
  const tomorrowStart = new Date(todayStart.getTime() + DAY_MS)
  return countSubmissionsInRange(contacts, diagnostics, todayStart, tomorrowStart)
}

export const buildTodaySnapshotSegments = (snapshot: TodayInboxSnapshot): TodaySnapshotSegment[] => {
  const segments: TodaySnapshotSegment[] = []
  if (snapshot.contacts > 0) {
    segments.push({
      key: "contacts",
      count: snapshot.contacts,
      label: snapshot.contacts === 1 ? "web form" : "web forms",
    })
  }
  if (snapshot.diagnostics > 0) {
    segments.push({
      key: "diagnostics",
      count: snapshot.diagnostics,
      label: snapshot.diagnostics === 1 ? "survey" : "surveys",
    })
  }
  return segments
}

export const formatTodaySnapshotMessage = (snapshot: TodayInboxSnapshot): string => {
  if (snapshot.total === 0) return "No new submissions"

  const segments = buildTodaySnapshotSegments(snapshot)
  if (segments.length === 1) {
    const [only] = segments
    return `${only.count} new ${only.label} today`
  }

  return `${snapshot.total} new submissions today`
}

export const getSubmissionTrendRangeLabel = (
  period: SubmissionTrendPeriod,
  offset: number,
): string => {
  const now = startOfDay(new Date())

  if (period === "week") {
    const firstDay = new Date(now.getTime() - 6 * DAY_MS - offset * 7 * DAY_MS)
    const lastDay = new Date(now.getTime() - offset * 7 * DAY_MS)
    const formatOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
    const currentYear = now.getFullYear()
    const startYear = firstDay.getFullYear()
    const endYear = lastDay.getFullYear()
    const startYearStr = startYear !== currentYear ? `, ${startYear}` : ""
    const endYearStr = endYear !== currentYear ? `, ${endYear}` : ""
    return `${firstDay.toLocaleDateString("en-US", formatOptions)}${startYearStr} – ${lastDay.toLocaleDateString("en-US", formatOptions)}${endYearStr}`
  }

  if (period === "month") {
    const anchor = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    return anchor.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  return String(now.getFullYear() - offset)
}

export const buildSubmissionTrend = (
  contacts: ContactRow[],
  diagnostics: CompanyProfileRow[],
  period: SubmissionTrendPeriod,
  offset = 0,
): DaySubmissionCount[] => {
  if (period === "week") {
    return buildLastNDaysTrend(contacts, diagnostics, 7, offset)
  }

  const now = startOfDay(new Date())

  if (period === "month") {
    const anchor = new Date(now.getFullYear(), now.getMonth() - offset, 1)
    const year = anchor.getFullYear()
    const month = anchor.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const buckets: DaySubmissionCount[] = []

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dayStart = new Date(year, month, day)
      const dayEnd = new Date(year, month, day + 1)
      const counts = countSubmissionsInRange(contacts, diagnostics, dayStart, dayEnd)
      buckets.push({
        label: dayStart.toLocaleDateString("en-CA", { month: "short", day: "numeric" }),
        dateKey: dayStart.toISOString().slice(0, 10),
        ...counts,
      })
    }

    return buckets
  }

  const year = now.getFullYear() - offset
  const buckets: DaySubmissionCount[] = []

  for (let month = 0; month < 12; month += 1) {
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 1)
    const counts = countSubmissionsInRange(contacts, diagnostics, monthStart, monthEnd)
    buckets.push({
      label: monthStart.toLocaleDateString("en-CA", { month: "short" }),
      dateKey: `${year}-${String(month + 1).padStart(2, "0")}`,
      ...counts,
    })
  }

  return buckets
}

export const buildPreviewSubmissionTrend = (
  period: SubmissionTrendPeriod,
  offset = 0,
  sourceFilter: SubmissionSourceFilter = "all",
): DaySubmissionCount[] => {
  const contactSeeds = [
    12, 18, 14, 22, 19, 24, 17, 21, 16, 23, 20, 18, 25, 15, 19, 22, 17, 24, 21, 16, 20, 23, 18, 22,
    19, 25, 17, 21, 20, 24, 18,
  ]
  const diagnosticSeeds = [
    7, 11, 9, 14, 12, 16, 10, 13, 8, 15, 11, 14, 16, 9, 12, 15, 10, 14, 13, 11, 12, 16, 10, 14, 12, 15,
    9, 13, 11, 14, 12,
  ]

  return buildSubmissionTrend([], [], period, offset).map((bucket, index) => {
    const phase = index + offset * 2
    const wave = 0.5 + 0.5 * Math.sin(phase * 0.95)
    const wave2 = 0.5 + 0.5 * Math.cos(phase * 0.75 + 0.6)
    let contacts = Math.max(
      0,
      Math.round(contactSeeds[index % contactSeeds.length] * (0.55 + wave * 0.9)),
    )
    let diagnostics = Math.max(
      0,
      Math.round(diagnosticSeeds[(index + 3) % diagnosticSeeds.length] * (0.55 + wave2 * 0.9)),
    )

    if (sourceFilter === "web") diagnostics = 0
    if (sourceFilter === "survey") contacts = 0

    return {
      ...bucket,
      contacts,
      diagnostics,
      total: contacts + diagnostics,
    }
  })
}

export const buildLastNDaysCountByDay = (
  timestamps: Array<string | null | undefined>,
  days = 7,
  offsetWeeks = 0,
): number[] => {
  const validTimestamps = timestamps.filter((value): value is string => Boolean(value))
  const buckets: number[] = []
  const now = startOfDay(new Date())
  const startOffset = offsetWeeks * 7 * DAY_MS

  for (let i = days - 1; i >= 0; i -= 1) {
    const dayStart = new Date(now.getTime() - i * DAY_MS - startOffset)
    const dayEnd = new Date(dayStart.getTime() + DAY_MS)

    const inRange = (iso: string) => {
      const t = new Date(iso).getTime()
      return t >= dayStart.getTime() && t < dayEnd.getTime()
    }

    buckets.push(validTimestamps.filter(inRange).length)
  }

  return buckets
}

/** Daily pending queue size (last N days, oldest → newest). Today = pending now; past days = at day end. */
export const buildLastNDaysPendingTrend = <
  T extends { created_at: string; status?: SubmissionStatus | null; status_updated_at?: string | null },
>(
  rows: T[],
  days = 7,
): number[] => {
  const buckets: number[] = []
  const todayStart = startOfDay(new Date())

  for (let i = days - 1; i >= 0; i -= 1) {
    const dayEndExclusive = new Date(todayStart.getTime() - i * DAY_MS + DAY_MS)
    const isToday = i === 0

    const pendingOnDay = isToday
      ? countPendingNow(rows)
      : rows.filter((row) => wasPendingAtDayEnd(row, dayEndExclusive)).length

    buckets.push(pendingOnDay)
  }

  return buckets
}

const countPendingNow = <T extends { status?: SubmissionStatus | null }>(rows: T[]) =>
  rows.filter((row) => isActiveSubmissionStatus((row.status ?? "New") as SubmissionStatus)).length

const todayStartMs = (): number => startOfDay(new Date()).getTime()

const leftQueueAtMs = (statusUpdatedAt?: string | null): number => {
  if (!statusUpdatedAt) return todayStartMs()
  const t = new Date(statusUpdatedAt).getTime()
  return Number.isFinite(t) ? t : todayStartMs()
}

const wasPendingAtDayEnd = (
  row: { created_at: string; status?: SubmissionStatus | null; status_updated_at?: string | null },
  dayEndExclusive: Date,
): boolean => {
  const createdAt = new Date(row.created_at).getTime()
  const dayEnd = dayEndExclusive.getTime()
  if (!Number.isFinite(createdAt) || createdAt >= dayEnd) return false

  const status = (row.status ?? "New") as SubmissionStatus

  if (isActiveSubmissionStatus(status)) return true

  return leftQueueAtMs(row.status_updated_at) >= dayEnd
}

/** Demo sparkline ending at `currentPending` — wavy, not a smooth ramp. */
export const buildPreviewPendingSparkline = (currentPending: number, days = 7): number[] => {
  if (currentPending <= 0) {
    const cleared = [4, 5, 6, 5, 4, 2, 0]
    return cleared.slice(-days)
  }

  const wave = [0.62, 0.88, 0.72, 0.95, 0.78, 0.9, 1].slice(-days)

  return wave.map((factor, index) => {
    if (index === wave.length - 1) return currentPending
    return Math.max(1, Math.round(currentPending * factor))
  })
}

export const buildLastNDaysTrend = (
  contacts: ContactRow[],
  diagnostics: CompanyProfileRow[],
  days = 7,
  offsetWeeks = 0,
): DaySubmissionCount[] => {
  const buckets: DaySubmissionCount[] = []
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const startOffset = offsetWeeks * 7 * DAY_MS

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = new Date(now.getTime() - i * DAY_MS - startOffset)
    const dayEnd = new Date(dayStart.getTime() + DAY_MS)
    const dateKey = dayStart.toISOString().slice(0, 10)
    const label = dayStart.toLocaleDateString("en-CA", { month: "short", day: "numeric" })

    const inRange = (iso: string) => isCreatedInLocalDayRange(iso, dayStart, dayEnd)

    const contactCount = contacts.filter((row) => inRange(row.created_at)).length
    const diagnosticCount = diagnostics.filter((row) => inRange(row.created_at)).length

    buckets.push({
      label,
      dateKey,
      contacts: contactCount,
      diagnostics: diagnosticCount,
      total: contactCount + diagnosticCount,
    })
  }

  return buckets
}

export type StatusBreakdown = { status: SubmissionStatus; count: number }[]

export type StageChartRow = {
  name: string
  value: number
  pct: number
  fill: string
}

export const buildStageChartFromDiagnostics = (
  diagnostics: CompanyProfileRow[],
  colors: string[],
): StageChartRow[] => {
  const counts: Record<string, number> = {}
  for (const row of diagnostics) {
    const stage = row.stage || "Not Specified"
    counts[stage] = (counts[stage] || 0) + 1
  }

  const total = Object.values(counts).reduce((sum, value) => sum + value, 0)
  return Object.entries(counts).map(([stage, count], index) => ({
    name: stage,
    value: count,
    pct: total > 0 ? Math.round((count / total) * 100) : 0,
    fill: colors[index % colors.length],
  }))
}

export const buildStatusBreakdown = (
  contacts: ContactRow[],
  diagnostics: CompanyProfileRow[],
): StatusBreakdown => {
  const counts: Record<SubmissionStatus, number> = {
    New: 0,
    "In Progress": 0,
    Resolved: 0,
  }

  for (const row of [...contacts, ...diagnostics]) {
    const status = (row.status ?? "New") as SubmissionStatus
    counts[status] += 1
  }

  return (["New", "In Progress", "Resolved"] as const).map((status) => ({
    status,
    count: counts[status],
  }))
}

export const countUnresolved = (contacts: ContactRow[], diagnostics: CompanyProfileRow[]) =>
  [...contacts, ...diagnostics].filter((row) =>
    isActiveSubmissionStatus(row.status as SubmissionStatus | null),
  ).length

export const countNewSubmissions = (contacts: ContactRow[], diagnostics: CompanyProfileRow[]) =>
  [...contacts, ...diagnostics].filter((row) => (row.status ?? "New") === "New").length

export const countRecentAll = (contacts: ContactRow[], diagnostics: CompanyProfileRow[], withinDays = 7) =>
  countRecentSubmissions(contacts, withinDays) + countRecentSubmissions(diagnostics, withinDays)

export const countSubmissionsBetweenDays = (
  contacts: ContactRow[],
  diagnostics: CompanyProfileRow[],
  startDaysAgo: number,
  endDaysAgo: number,
) => {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  const start = now - startDaysAgo * dayMs
  const end = now - endDaysAgo * dayMs

  const inWindow = (iso: string) => {
    const t = new Date(iso).getTime()
    return t >= start && t < end
  }

  return (
    contacts.filter((row) => inWindow(row.created_at)).length +
    diagnostics.filter((row) => inWindow(row.created_at)).length
  )
}

export const percentChange = (current: number, previous: number): number | null => {
  if (previous === 0) {
    if (current === 0) return null
    return 100
  }
  return Math.round(((current - previous) / previous) * 100)
}

export const formatPercentChange = (value: number | null): string => {
  if (value === null) return "—"
  if (value > 0) return `+${value}%`
  return `${value}%`
}

export const welcomeBackTitle = (displayName: string, email?: string | null): string => {
  const raw = displayName.trim() || email?.split("@")[0]?.trim() || "there"
  const first = raw.split(/\s+/)[0] ?? raw
  return `Welcome back, ${first} — here's your overview`
}

export const greetingForUser = (displayName: string, email?: string | null): string => {
  const hour = new Date().getHours()
  const time =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  const raw = displayName.trim() || email?.split("@")[0]?.trim() || "there"
  const first = raw.split(/\s+/)[0] ?? raw
  return `${time}, ${first}`
}
