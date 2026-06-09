/**
 * Copy all published documents (including image/file assets) from preview → production.
 *
 * ⚠️  DESTRUCTIVE — replaces matching documents in production. Do not run on a live site
 *     with editor-owned content unless you explicitly want to overwrite production.
 *     Safe Studio deploy does not run this script.
 *
 * Run once before handoff so www matches staging, then Studio edits production directly.
 *
 * Dry run (counts only):
 *   pnpm sanity:sync-to-production:dry
 *
 * Apply:
 *   pnpm sanity:sync-to-production -- --apply
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
  const preview = makeClient("preview")
  const production = makeClient("production")

  const [previewDocs, productionDocs] = await Promise.all([
    preview.fetch<Array<Record<string, unknown>>>(ALL_PUBLISHED_DOCS_GROQ),
    production.fetch<Array<{ _id: string; _type?: string }>>(
      `*[!(_id in path("drafts.**")) && !(_type match "system.*")]{ _id, _type }`,
    ),
  ])

  console.log(`\nPreview published documents: ${previewDocs.length}`)
  console.log(`Production published documents (before): ${productionDocs.length}\n`)

  console.log("Preview counts by type:")
  for (const [type, count] of countByType(previewDocs)) {
    console.log(`  ${type}: ${count}`)
  }

  if (!apply) {
    console.log(
      "\nDry run only. Re-run with --apply to copy all preview documents into production.\n",
    )
    return
  }

  console.log("\nCopying to production…\n")

  const orderedDocs = sortDocsForCopy(previewDocs)

  for (let i = 0; i < orderedDocs.length; i += BATCH_SIZE) {
    const chunk = orderedDocs.slice(i, i + BATCH_SIZE)
    const tx = production.transaction()
    for (const doc of chunk) {
      const id = String(doc._id ?? "")
      if (!id) continue
      tx.createOrReplace(stripForReplace(doc) as Parameters<typeof tx.createOrReplace>[0])
    }
    await tx.commit()
    console.log(`  committed ${Math.min(i + BATCH_SIZE, orderedDocs.length)} / ${orderedDocs.length}`)
  }

  const afterCount = await production.fetch<number>(
    `count(*[!(_id in path("drafts.**")) && !(_type match "system.*")])`,
  )

  console.log(`\nProduction published documents (after): ${afterCount}\n`)
  console.log("Sync complete. Studio now edits production — publish updates www within ~30 seconds.\n")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
