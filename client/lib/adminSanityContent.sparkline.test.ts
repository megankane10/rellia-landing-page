import { describe, expect, it } from "vitest"

import { buildCmsEditsSparkline, type SanityRecentEditRow } from "@/lib/adminSanityContent"

const dayStartIso = (daysAgo: number, hour = 12) => {
  const d = new Date()
  d.setHours(hour, 0, 0, 0)
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

const row = (daysAgo: number, hour = 12, id = "doc"): SanityRecentEditRow => ({
  _id: `${id}-${daysAgo}-${hour}`,
  _type: "page",
  _updatedAt: dayStartIso(daysAgo, hour),
})

describe("buildCmsEditsSparkline", () => {
  it("places today's publishes in the last bucket", () => {
    const sparkline = buildCmsEditsSparkline([row(0, 9), row(0, 15, "doc-b")], 7)

    expect(sparkline[sparkline.length - 1]).toBe(2)
    expect(sparkline.slice(0, -1).every((count) => count === 0)).toBe(true)
  })

  it("counts multiple same-day publishes together in the last bucket", () => {
    const sparkline = buildCmsEditsSparkline(
      [row(30), row(10), row(0, 8), row(0, 16, "doc-b")],
      7,
    )

    expect(sparkline[sparkline.length - 1]).toBe(2)
  })

  it("rolls pre-window history into the first bucket", () => {
    const sparkline = buildCmsEditsSparkline([row(30), row(20), row(0)], 7)

    expect(sparkline[0]).toBe(2)
    expect(sparkline[sparkline.length - 1]).toBe(1)
  })
})
