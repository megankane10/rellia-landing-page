/**
 * Copy all published documents (including image/file assets) from production → preview.
 * Use this to align the staging environment with the verified production dataset.
 *
 * Dry run (counts only):
 *   pnpm tsx scripts/sync-production-to-preview.ts
 *
 * Apply:
 *   pnpm tsx scripts/sync-production-to-preview.ts --apply
 *
 * Apply but keep preview placeholder reference content (stories, open roles, profiles):
 *   pnpm tsx scripts/sync-production-to-preview.ts --apply --preserve-placeholders
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

const BATCH_SIZE = 40

/** Preview-only reference content — skipped when syncing production → preview for Additions. */
const PRESERVE_PLACEHOLDER_TYPES = new Set([
  "story",
  "openRole",
  "advisor",
  "alumniCompany",
  "founder",
])

const ALL_PUBLISHED_DOCS_GROQ = `*[
  !(_id in path("drafts.**"))
  && !(_type match "system.*")
]{
  ...
}`

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

const stripForReplace = (doc: Record<string, unknown>) => {
  const { _rev, ...rest } = doc
  return rest
}

const isAssetDoc = (doc: Record<string, unknown>) => {
  const id = String(doc._id ?? "")
  const type = String(doc._type ?? "")
  return (
    type === "sanity.imageAsset" ||
    type === "sanity.fileAsset" ||
    id.startsWith("image-") ||
    id.startsWith("file-")
  )
}

const sortDocsForCopy = (docs: Array<Record<string, unknown>>) => {
  const assets: Array<Record<string, unknown>> = []
  const content: Array<Record<string, unknown>> = []
  for (const doc of docs) {
    if (isAssetDoc(doc)) assets.push(doc)
    else content.push(doc)
  }
  return [...assets, ...content]
}

const countByType = (docs: Array<{ _type?: string }>) => {
  const counts = new Map<string, number>()
  for (const doc of docs) {
    const type = doc._type ?? "unknown"
    counts.set(type, (counts.get(type) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))
}

const main = async () => {
  const apply = process.argv.includes("--apply")
  const preservePlaceholders = process.argv.includes("--preserve-placeholders")
  const source = makeClient("production")
  const target = makeClient("preview")

  const [sourceDocsRaw, targetDocs] = await Promise.all([
    source.fetch<Array<Record<string, unknown>>>(ALL_PUBLISHED_DOCS_GROQ),
    target.fetch<Array<{ _id: string; _type?: string }>>(
      `*[!(_id in path("drafts.**")) && !(_type match "system.*")]{ _id, _type }`,
    ),
  ])

  const skipped = preservePlaceholders
    ? sourceDocsRaw.filter((doc) => PRESERVE_PLACEHOLDER_TYPES.has(String(doc._type ?? "")))
    : []
  const sourceDocs = preservePlaceholders
    ? sourceDocsRaw.filter((doc) => !PRESERVE_PLACEHOLDER_TYPES.has(String(doc._type ?? "")))
    : sourceDocsRaw

  console.log(`\nProduction published documents (source): ${sourceDocsRaw.length}`)
  console.log(`Preview published documents (target before): ${targetDocs.length}`)
  if (preservePlaceholders) {
    console.log(
      `\nPreserving preview placeholders (not overwritten): ${[...PRESERVE_PLACEHOLDER_TYPES].join(", ")}`,
    )
    console.log(`Skipped ${skipped.length} production doc(s) in those types.`)
  }
  console.log()

  console.log("Documents to copy — counts by type:")
  for (const [type, count] of countByType(sourceDocs)) {
    console.log(`  ${type}: ${count}`)
  }

  if (!apply) {
    console.log(
      preservePlaceholders
        ? "\nDry run only. Re-run with --apply --preserve-placeholders to sync production into preview while keeping placeholder stories, open roles, and profiles.\n"
        : "\nDry run only. Re-run with --apply to copy all production documents into preview.\n",
    )
    return
  }

  console.log("\nCopying to preview staging dataset…\n")

  const orderedDocs = sortDocsForCopy(sourceDocs)

  for (let i = 0; i < orderedDocs.length; i += BATCH_SIZE) {
    const chunk = orderedDocs.slice(i, i + BATCH_SIZE)
    const tx = target.transaction()
    for (const doc of chunk) {
      const id = String(doc._id ?? "")
      if (!id) continue
      tx.createOrReplace(stripForReplace(doc) as Parameters<typeof tx.createOrReplace>[0])
    }
    await tx.commit()
    console.log(`  committed ${Math.min(i + BATCH_SIZE, orderedDocs.length)} / ${orderedDocs.length}`)
  }

  const afterCount = await target.fetch<number>(
    `count(*[!(_id in path("drafts.**")) && !(_type match "system.*")])`,
  )

  console.log(`\nPreview published documents (after): ${afterCount}\n`)
  console.log(
    preservePlaceholders
      ? "Sync complete. Preview matches production except preserved placeholder stories, open roles, and profiles.\n"
      : "Sync complete. Preview dataset now matches production.\n",
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
