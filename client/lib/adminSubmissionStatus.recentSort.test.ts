import { describe, expect, it } from "vitest"

import { sortOverviewRecentSubmissions } from "@/lib/adminSubmissionStatus"

describe("sortOverviewRecentSubmissions", () => {
  it("orders newest submissions first regardless of status", () => {
    const rows = sortOverviewRecentSubmissions([
      { id: "1", created_at: "2026-06-08T12:00:00.000Z", status: "New" as const },
      { id: "2", created_at: "2026-06-10T12:00:00.000Z", status: "Resolved" as const },
      { id: "3", created_at: "2026-06-09T12:00:00.000Z", status: "In Progress" as const },
    ])

    expect(rows.map((row) => row.id)).toEqual(["2", "3", "1"])
  })

  it("sorts newest first within the same status", () => {
    const rows = sortOverviewRecentSubmissions([
      { id: "1", created_at: "2026-06-01T12:00:00.000Z", status: "New" as const },
      { id: "2", created_at: "2026-06-05T12:00:00.000Z", status: "New" as const },
    ])

    expect(rows.map((row) => row.id)).toEqual(["2", "1"])
  })
})
