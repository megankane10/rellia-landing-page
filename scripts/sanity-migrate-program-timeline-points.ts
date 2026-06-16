/**
 * Migrates program timeline week points to the new `programTimelinePoint` object array.
 *
 * This is required because Sanity arrays cannot mix primitive `string` items with object items.
 * We previously allowed string bullets + heading objects; Studio deploy requires object-only.
 *
 * Usage:
 *   pnpm tsx scripts/sanity-migrate-program-timeline-points.ts
 *   SANITY_API_DATASET=production pnpm tsx scripts/sanity-migrate-program-timeline-points.ts
 */
import { createClient } from "@sanity/client"
import "./loadEnv"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

type TimelinePoint =
  | string
  | { _type?: "programTimelineHeading"; text?: unknown }
  | { _type?: "programTimelinePoint"; kind?: unknown; text?: unknown; _key?: unknown }

type ProgramRow = {
  _id: string
  title?: string
  timelineSteps?: Array<{
    _key?: string
    title?: string
    weeks?: Array<{
      _key?: string
      heading?: string
      points?: TimelinePoint[]
    }>
  }>
}

const toPointObject = (
  input: TimelinePoint,
  pointIndex: number,
): { _type: "programTimelinePoint"; _key: string; kind: "bullet" | "heading"; text: string } | null => {
  if (typeof input === "string") {
    const text = input.trim()
    if (!text) return null
    return { _type: "programTimelinePoint", _key: `point-${pointIndex}`, kind: "bullet", text }
  }

  if (input && typeof input === "object") {
    const text = typeof input.text === "string" ? input.text.trim() : ""
    if (!text) return null
    const kind =
      input._type === "programTimelineHeading" ? "heading" : input.kind === "heading" ? "heading" : "bullet"
    return { _type: "programTimelinePoint", _key: `point-${pointIndex}`, kind, text }
  }

  return null
}

const main = async () => {
  const projectId = requireEnv("SANITY_API_PROJECT_ID")
  const dataset = process.env.SANITY_API_DATASET?.trim() || "preview"
  const token = requireEnv("SANITY_API_WRITE_TOKEN")

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  })

  const programs = await client.fetch<ProgramRow[]>(
    `*[_type == "program"]{ _id, title, timelineSteps[]{ _key, title, weeks[]{ _key, heading, points } } }`,
  )

  let patched = 0
  for (const program of programs) {
    const steps = Array.isArray(program.timelineSteps) ? program.timelineSteps : []
    if (steps.length === 0) continue

    let needsPatch = false
    const nextSteps = steps.map((step) => {
      const weeks = Array.isArray(step.weeks) ? step.weeks : []
      const nextWeeks = weeks.map((week) => {
        const points = Array.isArray(week.points) ? week.points : []
        const hasPrimitive = points.some((p) => typeof p === "string")
        const hasLegacyHeading = points.some(
          (p) => typeof p === "object" && p !== null && (p as any)._type === "programTimelineHeading",
        )
        if (!hasPrimitive && !hasLegacyHeading) return week

        const nextPoints = points
          .map((p, idx) => toPointObject(p, idx))
          .filter((p): p is NonNullable<typeof p> => p !== null)

        if (nextPoints.length === 0) return week
        needsPatch = true
        return { ...week, points: nextPoints }
      })
      return { ...step, weeks: nextWeeks }
    })

    if (!needsPatch) continue

    await client.patch(program._id).set({ timelineSteps: nextSteps }).commit()
    patched += 1
    console.log(`Patched timeline points for ${program.title ?? program._id} (${program._id})`)
  }

  console.log(`\nDone. Patched ${patched} program(s) in dataset "${dataset}".`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

