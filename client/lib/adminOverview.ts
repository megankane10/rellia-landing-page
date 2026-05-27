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

export const buildLastNDaysTrend = (
  contacts: ContactRow[],
  diagnostics: CompanyProfileRow[],
  days = 7,
): DaySubmissionCount[] => {
  const buckets: DaySubmissionCount[] = []
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = new Date(now.getTime() - i * DAY_MS)
    const dayEnd = new Date(dayStart.getTime() + DAY_MS)
    const dateKey = dayStart.toISOString().slice(0, 10)
    const label = dayStart.toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" })

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

export const greetingForUser = (displayName: string, email?: string | null): string => {
  const hour = new Date().getHours()
  const time =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  const raw = displayName.trim() || email?.split("@")[0]?.trim() || "there"
  const first = raw.split(/\s+/)[0] ?? raw
  return `${time}, ${first}`
}
