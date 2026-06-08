/**
 * Align production CMS with preview for events (dates) and hide retired items on www.
 *
 * Preview dataset  → staging (relliahealth.vercel.app, Studio default, visual editing)
 * Production dataset → live (www.relliahealth.com)
 *
 * Dry-run (prints diff, no writes):
 *   pnpm sanity:promote:dry
 *
 * Apply to production:
 *   pnpm sanity:promote -- --apply-production
 *
 * Unpublish advisor + alumni on production only (preview keeps them for staging):
 *   pnpm sanity:promote -- --apply-production --unpublish-network
 *
 * Requires SANITY_API_WRITE_TOKEN in .env or .env.local
 */
import { createClient, type SanityClient } from "@sanity/client"
import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
dotenv.config({ path: path.join(root, ".env") })
dotenv.config({ path: path.join(root, ".env.local") })

const PROJECT_ID =
  process.env.SANITY_API_PROJECT_ID?.trim() ||
  process.env.VITE_SANITY_PROJECT_ID?.trim() ||
  "ggbt0o98"

type EventRow = {
  _id: string
  title: string
  slug: string
  status?: string
  startsAt?: string | null
  endsAt?: string | null
  dateTime?: string | null
}

const EVENTS_GROQ = `*[_type == "event" && !(_id in path("drafts.**"))]{
  _id,
  title,
  "slug": slug.current,
  status,
  startsAt,
  endsAt,
  dateTime
}`

/** Retired events removed from production during promote (prefer deleting in Studio). */
const HIDE_ON_PRODUCTION_SLUGS = new Set<string>()

const requireToken = (): string => {
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim()
  if (!token) throw new Error("Missing SANITY_API_WRITE_TOKEN in .env or .env.local")
  return token
}

const makeClient = (dataset: string): SanityClient =>
  createClient({
    projectId: PROJECT_ID,
    dataset,
    token: requireToken(),
    apiVersion: "2024-01-01",
    useCdn: false,
  })

const printDatasetDiff = async (preview: SanityClient, production: SanityClient) => {
  const [previewEvents, prodEvents] = await Promise.all([
    preview.fetch<EventRow[]>(EVENTS_GROQ),
    production.fetch<EventRow[]>(EVENTS_GROQ),
  ])

  const previewBySlug = new Map(previewEvents.map((e) => [e.slug, e]))
  const prodBySlug = new Map(prodEvents.map((e) => [e.slug, e]))

  console.log("\n--- Events: preview vs production ---\n")
  console.log(`Preview: ${previewEvents.length} published | Production: ${prodEvents.length} published\n`)

  for (const slug of [...new Set([...previewBySlug.keys(), ...prodBySlug.keys()])].sort()) {
    const p = previewBySlug.get(slug)
    const r = prodBySlug.get(slug)
    if (!p) {
      console.log(`  ONLY production: ${slug} (${r?.title})`)
      continue
    }
    if (!r) {
      console.log(`  ONLY preview:    ${slug} (${p.title})`)
      continue
    }
    const dateMismatch =
      (p.startsAt ?? null) !== (r.startsAt ?? null) || (p.endsAt ?? null) !== (r.endsAt ?? null)
    const statusMismatch = (p.status ?? "") !== (r.status ?? "")
    if (dateMismatch || statusMismatch || HIDE_ON_PRODUCTION_SLUGS.has(slug)) {
      console.log(`  DIFF ${slug}`)
      if (statusMismatch) console.log(`       status  preview=${p.status} production=${r.status}`)
      if (dateMismatch) {
        console.log(`       startsAt preview=${p.startsAt ?? "—"} production=${r.startsAt ?? "—"}`)
        console.log(`       endsAt   preview=${p.endsAt ?? "—"} production=${r.endsAt ?? "—"}`)
      }
    }
  }

  const [previewCounts, prodCounts] = await Promise.all([
    preview.fetch<{ advisors: number; alumni: number; stories: number; drafts: number }>(
      `{
        "advisors": count(*[_type == "advisor" && !(_id in path("drafts.**"))]),
        "alumni": count(*[_type == "alumniCompany" && !(_id in path("drafts.**"))]),
        "stories": count(*[_type == "story" && !(_id in path("drafts.**"))]),
        "drafts": count(*[_id in path("drafts.**") && !(_type match "sanity.*")])
      }`,
    ),
    production.fetch<{ advisors: number; alumni: number; stories: number; drafts: number }>(
      `{
        "advisors": count(*[_type == "advisor" && !(_id in path("drafts.**"))]),
        "alumni": count(*[_type == "alumniCompany" && !(_id in path("drafts.**"))]),
        "stories": count(*[_type == "story" && !(_id in path("drafts.**"))]),
        "drafts": count(*[_id in path("drafts.**") && !(_type match "sanity.*")])
      }`,
    ),
  ])

  console.log("\n--- Other published counts ---\n")
  console.log(
    `  advisors  preview=${previewCounts.advisors} production=${prodCounts.advisors}`,
  )
  console.log(
    `  alumni    preview=${previewCounts.alumni} production=${prodCounts.alumni}`,
  )
  console.log(
    `  stories   preview=${previewCounts.stories} production=${prodCounts.stories}`,
  )
  console.log(
    `  draft docs (unpublished) preview=${previewCounts.drafts} production=${prodCounts.drafts}`,
  )
}

const unpublishOnProduction = async (production: SanityClient, ids: string[]) => {
  console.log(
    "\nUnpublish advisor/alumni on production via Sanity Studio (dataset: production),\n" +
      "or use the Sanity MCP unpublish_documents tool — client.action() returns 404 on this project.\n" +
      `Document IDs (${ids.length}): ${ids.join(", ")}\n`,
  )
}

const main = async () => {
  const applyProduction = process.argv.includes("--apply-production")
  const unpublishNetwork = process.argv.includes("--unpublish-network")

  const preview = makeClient("preview")
  const production = makeClient("production")

  await printDatasetDiff(preview, production)

  if (!applyProduction) {
    console.log(
      "\nDry run only. Re-run with --apply-production to patch production.\nAdd --unpublish-network to remove advisor/alumni from www only.\n",
    )
    return
  }

  const previewEvents = await preview.fetch<EventRow[]>(EVENTS_GROQ)
  const previewBySlug = new Map(previewEvents.map((e) => [e.slug, e]))
  const prodEvents = await production.fetch<EventRow[]>(EVENTS_GROQ)

  const tx = production.transaction()

  for (const prod of prodEvents) {
    const slug = prod.slug

    if (HIDE_ON_PRODUCTION_SLUGS.has(slug)) {
      console.log(`Hiding on production: ${slug}`)
      tx.patch(prod._id, (p) => p.set({ status: "hidden" }))
      continue
    }

    const source = previewBySlug.get(slug)
    if (!source) continue

    const set: Record<string, unknown> = {}
    if (source.startsAt) set.startsAt = source.startsAt
    if (source.endsAt) set.endsAt = source.endsAt
    if (source.status === "hidden") set.status = "hidden"
    else if (prod.status === "hidden") set.status = "visible"

    const hasSet = Object.keys(set).length > 0
    const unsetDateTime = Boolean(prod.dateTime)

    if (!hasSet && !unsetDateTime) continue

    console.log(`Syncing production event: ${slug}`)
    tx.patch(prod._id, (p) => {
      let patch = p
      if (hasSet) patch = patch.set(set)
      if (unsetDateTime) patch = patch.unset(["dateTime"])
      return patch
    })
  }

  await tx.commit()
  console.log("\nCommitted event patches to production.\n")

  if (unpublishNetwork) {
    const ids = await production.fetch<string[]>(
      `*[_type in ["advisor", "alumniCompany"] && !(_id in path("drafts.**"))]._id`,
    )
    if (ids.length) {
      console.log(`Unpublishing ${ids.length} advisor/alumni on production...`)
      await unpublishOnProduction(production, ids)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
