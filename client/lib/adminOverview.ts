import type { SubmissionStatus } from "@/lib/adminSubmissionStatus"
import {
  countRecentSubmissions,
  isActiveSubmissionStatus,
} from "@/lib/adminSubmissionStatus"
import type { CompanyProfileRow, ContactRow } from "@/lib/adminSubmissions"

export type DaySubmissionCount = {
  label: string
  dateKey: string
  contacts: number
  diagnostics: number
  total: number
}

const DAY_MS = 24 * 60 * 60 * 1000

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

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

    const inRange = (iso: string) => {
      const t = new Date(iso).getTime()
      return t >= dayStart.getTime() && t < dayEnd.getTime()
    }

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
  return `Welcome back, ${first}`
}

export const greetingForUser = (displayName: string, email?: string | null): string => {
  const hour = new Date().getHours()
  const time =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  const raw = displayName.trim() || email?.split("@")[0]?.trim() || "there"
  const first = raw.split(/\s+/)[0] ?? raw
  return `${time}, ${first}`
}
