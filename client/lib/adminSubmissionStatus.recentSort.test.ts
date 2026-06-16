import { describe, expect, it } from "vitest"

import { sortOverviewRecentSubmissions } from "@/lib/adminSubmissionStatus"

describe("sortOverviewRecentSubmissions", () => {
  it("orders New before In Progress before Resolved", () => {
    const rows = sortOverviewRecentSubmissions([
      { id: "1", created_at: "2026-06-10T12:00:00.000Z", status: "Resolved" as const },
      { id: "2", created_at: "2026-06-09T12:00:00.000Z", status: "In Progress" as const },
      { id: "3", created_at: "2026-06-08T12:00:00.000Z", status: "New" as const },
    ])

    expect(rows.map((row) => row.status)).toEqual(["New", "In Progress", "Resolved"])
  })

  it("sorts newest first within the same status", () => {
    const rows = sortOverviewRecentSubmissions([
      { id: "1", created_at: "2026-06-01T12:00:00.000Z", status: "New" as const },
      { id: "2", created_at: "2026-06-05T12:00:00.000Z", status: "New" as const },
    ])

    expect(rows.map((row) => row.id)).toEqual(["2", "1"])
  })
})
