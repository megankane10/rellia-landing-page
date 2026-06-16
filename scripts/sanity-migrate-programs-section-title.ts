/**
 * Converts programsLandingPage.programsSectionTitle from legacy portable text to plain string.
 * Safe to re-run — skips when the field is already a non-empty string.
 *
 *   pnpm sanity:migrate:programs-section-title
 *   SANITY_API_DATASET=production pnpm sanity:migrate:programs-section-title
 */
import { createClient } from "@sanity/client"
import "./loadEnv"
import { cmsTextToPlain } from "../shared/cms/cmsFieldUtils"
import { DEFAULT_PROGRAMS_LANDING } from "../shared/cms/defaults"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

type ProgramsLandingDoc = {
  _id: string
  programsSectionTitle?: unknown
}

const main = async () => {
  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim() ||
    "ggbt0o98"
  const dataset =
    process.env.SANITY_API_DATASET?.trim() ||
    process.env.VITE_SANITY_DATASET?.trim() ||
    "preview"
  const token = requireEnv("SANITY_API_WRITE_TOKEN")

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const doc = await client.fetch<ProgramsLandingDoc | null>(
    `*[_id == "programsLandingPage"][0]{ _id, programsSectionTitle }`,
  )

  if (!doc?._id) {
    console.log("No programsLandingPage document found — nothing to migrate.")
    return
  }

  const current = doc.programsSectionTitle
  if (typeof current === "string" && current.trim()) {
    console.log(`programsSectionTitle is already a string ("${current.trim()}") — skipping.`)
    return
  }

  const plain =
    cmsTextToPlain(current) || DEFAULT_PROGRAMS_LANDING.programsSectionTitle

  await client.patch(doc._id).set({ programsSectionTitle: plain }).commit()
  console.log(`Migrated programsSectionTitle → "${plain}" in dataset "${dataset}".`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
