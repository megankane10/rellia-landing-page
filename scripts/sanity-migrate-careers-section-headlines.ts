/**
 * Seeds careersPage portable section headings and open roles subtitle when missing.
 * Does not overwrite documents that already have the new fields populated.
 *
 *   pnpm sanity:migrate:careers-section-headlines
 *   SANITY_API_DATASET=production pnpm sanity:migrate:careers-section-headlines
 */
import { createClient } from "@sanity/client"
import "./loadEnv"
import { DEFAULT_CAREERS_PAGE } from "../shared/cms/careersPageDefaults"
import { resolveSectionHeadlinePortable } from "../shared/cms/resolveSectionHeadline"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

type CareersDoc = {
  _id: string
  perksTitle?: string
  perksTitlePortable?: unknown
  openRolesTitle?: string
  openRolesTitlePortable?: unknown
  openRolesSubtitle?: string
  lifeAtRelliaHeading?: string
  lifeAtRelliaHeadingPortable?: unknown
}

const hasPortable = (value: unknown) => Array.isArray(value) && value.length > 0

async function main() {
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

  const doc = await client.fetch<CareersDoc | null>(`*[_id == "careersPage"][0]{
    _id,
    perksTitle,
    perksTitlePortable,
    openRolesTitle,
    openRolesTitlePortable,
    openRolesSubtitle,
    lifeAtRelliaHeading,
    lifeAtRelliaHeadingPortable
  }`)

  if (!doc?._id) {
    console.log("No careersPage document found.")
    return
  }

  const set: Record<string, unknown> = {}
  const unset: string[] = []

  if (!hasPortable(doc.perksTitlePortable)) {
    set.perksTitlePortable = resolveSectionHeadlinePortable(
      { headlinePortable: doc.perksTitlePortable, title: doc.perksTitle },
      DEFAULT_CAREERS_PAGE.perksTitlePortable!,
    )
    if (doc.perksTitle?.trim()) unset.push("perksTitle")
  }

  if (!hasPortable(doc.openRolesTitlePortable)) {
    set.openRolesTitlePortable = resolveSectionHeadlinePortable(
      { headlinePortable: doc.openRolesTitlePortable, title: doc.openRolesTitle },
      DEFAULT_CAREERS_PAGE.openRolesTitlePortable!,
    )
    if (doc.openRolesTitle?.trim()) unset.push("openRolesTitle")
  }

  if (!doc.openRolesSubtitle?.trim()) {
    set.openRolesSubtitle = DEFAULT_CAREERS_PAGE.openRolesSubtitle
  }

  if (!hasPortable(doc.lifeAtRelliaHeadingPortable)) {
    set.lifeAtRelliaHeadingPortable = resolveSectionHeadlinePortable(
      {
        headlinePortable: doc.lifeAtRelliaHeadingPortable,
        title: doc.lifeAtRelliaHeading,
      },
      DEFAULT_CAREERS_PAGE.lifeAtRelliaHeadingPortable!,
    )
    if (doc.lifeAtRelliaHeading?.trim()) unset.push("lifeAtRelliaHeading")
  }

  if (Object.keys(set).length === 0) {
    console.log("careersPage already has all portable section headings.")
    return
  }

  await client.patch(doc._id).set(set).commit()
  if (unset.length > 0) {
    await client.patch(doc._id).unset(unset).commit()
  }

  console.log(`Patched careersPage on "${dataset}":`, Object.keys(set).join(", "))
  if (unset.length > 0) console.log("Unset legacy fields:", unset.join(", "))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
