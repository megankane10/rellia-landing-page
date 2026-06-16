import { describe, expect, it } from "vitest"

import { buildLastNDaysPendingTrend, getPendingSparklineYMax } from "@/lib/adminOverview"

const dayStartIso = (daysAgo: number) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

describe("buildLastNDaysPendingTrend", () => {
  it("counts active items across all days since creation", () => {
    const rows = [{ created_at: dayStartIso(10), status: "New" as const }]
    const trend = buildLastNDaysPendingTrend(rows, 7)
    expect(trend.every((n) => n === 1)).toBe(true)
  })

  it("shows history for legacy resolved rows without status_updated_at", () => {
    const rows = [
      { created_at: dayStartIso(5), status: "Resolved" as const, status_updated_at: null },
      { created_at: dayStartIso(3), status: "Resolved" as const, status_updated_at: null },
    ]
    const trend = buildLastNDaysPendingTrend(rows, 7)
    expect(trend.some((n) => n > 0)).toBe(true)
    expect(trend[trend.length - 1]).toBe(0)
    expect(trend.every((n) => n === 0)).toBe(false)
  })

  it("drops resolved items after status_updated_at", () => {
    const rows = [
      {
        created_at: dayStartIso(6),
        status: "Resolved" as const,
        status_updated_at: dayStartIso(1),
      },
    ]
    const trend = buildLastNDaysPendingTrend(rows, 7)
    expect(trend[trend.length - 1]).toBe(0)
    expect(trend.slice(0, -2).some((n) => n > 0)).toBe(true)
  })

  it("last bucket matches current pending when resolved today", () => {
    const rows = [
      {
        created_at: dayStartIso(3),
        status: "Resolved" as const,
        status_updated_at: new Date().toISOString(),
      },
    ]
    const trend = buildLastNDaysPendingTrend(rows, 7)
    expect(trend[trend.length - 1]).toBe(0)
    expect(trend.slice(0, -1).some((n) => n > 0)).toBe(true)
  })

  it("treats invalid status_updated_at like legacy resolved", () => {
    const rows = [
      { created_at: dayStartIso(4), status: "Resolved" as const, status_updated_at: "" },
    ]
    const trend = buildLastNDaysPendingTrend(rows, 7)
    expect(trend.slice(0, -1).some((n) => n > 0)).toBe(true)
    expect(trend[trend.length - 1]).toBe(0)
  })
})

describe("getPendingSparklineYMax", () => {
  it("uses a floor of 1 when the queue is cleared", () => {
    expect(getPendingSparklineYMax([0, 0, 0, 0, 0, 0, 0])).toBe(1)
  })

  it("adds headroom when pending is steady so the line is not pinned to the chart floor", () => {
    expect(getPendingSparklineYMax([1, 1, 1, 1, 1, 1, 1])).toBe(2)
  })

  it("scales to the max pending count when the queue changes over time", () => {
    expect(getPendingSparklineYMax([0, 0, 1, 2, 1, 3, 1])).toBe(3)
  })
})
