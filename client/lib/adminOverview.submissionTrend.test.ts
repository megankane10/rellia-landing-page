import { describe, expect, it } from "vitest"

import { buildSubmissionTrend } from "@/lib/adminOverview"
import type { ContactRow } from "@/lib/adminSubmissions"

const dayStartIso = (daysAgo: number) => {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

describe("buildSubmissionTrend offset", () => {
  it("shifts the week window when offset increases", () => {
    const contacts = [{ created_at: dayStartIso(10), status: "New" as const }] as ContactRow[]
    const currentWeek = buildSubmissionTrend(contacts, [], "week", 0)
    const previousWeek = buildSubmissionTrend(contacts, [], "week", 1)

    expect(currentWeek.reduce((sum, row) => sum + row.contacts, 0)).toBe(0)
    expect(previousWeek.reduce((sum, row) => sum + row.contacts, 0)).toBe(1)
    expect(currentWeek.map((row) => row.dateKey)).not.toEqual(previousWeek.map((row) => row.dateKey))
  })

  it("uses different months when year offset changes", () => {
    const offset0 = buildSubmissionTrend([], [], "year", 0)
    const offset1 = buildSubmissionTrend([], [], "year", 1)

    expect(offset0[0]?.dateKey).not.toBe(offset1[0]?.dateKey)
    expect(offset0).toHaveLength(12)
    expect(offset1).toHaveLength(12)
  })
})
