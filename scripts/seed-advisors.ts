/**
 * Seeds advisor-related data to Sanity:
 *   - advisorFilter documents (one per specialty tag)
 *   - directoryFilterGroup "Expertise" (powers the directory dropdown)
 *   - advisor documents (from ADVISOR_DIRECTORY_SEED)
 *
 * Safe to run repeatedly — uses createOrReplace so it's fully idempotent.
 * Does NOT touch pages, navigation, programs, or any other CMS content.
 *
 * Requires: SANITY_API_WRITE_TOKEN (Editor token)
 * Optional: SANITY_API_PROJECT_ID (defaults to ggbt0o98)
 *           SANITY_API_DATASET     (defaults to preview)
 *
 * Run: pnpm run seed:advisors
 */

import { createClient } from "@sanity/client"
import "./loadEnv"
import { ADVISOR_DIRECTORY_SEED, ADVISOR_FILTER_OPTIONS } from "../client/data/advisorDirectory"

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "tag"

const requireEnv = (key: string): string => {
  const v = process.env[key]?.trim()
  if (!v) throw new Error(`Missing required env var: ${key}`)
  return v
}

const directoryFilterGroupId = (slug: string) => `directoryFilterGroup-${slug}`

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

  console.log(`Seeding advisors → project: ${projectId}, dataset: ${dataset}`)

  const mutations: any[] = []

  // ── 1. Delete existing advisor documents so deterministic IDs replace any
  //       Studio-created docs with random IDs.
  const existingAdvisorIds = await client.fetch<string[]>(`*[_type == "advisor"]._id`)
  for (const id of existingAdvisorIds) {
    mutations.push({ delete: { id } })
  }

  // Also clean up old advisorFilter docs that used the previous 4-category scheme.
  // The new ones will be created below with fresh IDs derived from the new labels.
  const existingFilterIds = await client.fetch<string[]>(`*[_type == "advisorFilter"]._id`)
  for (const id of existingFilterIds) {
    mutations.push({ delete: { id } })
  }

  // ── 2. Create one advisorFilter document per specialty tag
  const advisorFilterIdByLabel = new Map<string, string>()
  for (const [index, opt] of ADVISOR_FILTER_OPTIONS.entries()) {
    if (opt.id === "all") continue
    const label = opt.label
    const docId = `advisorFilter-${slugify(label)}`
    advisorFilterIdByLabel.set(label, docId)
    mutations.push({
      createOrReplace: {
        _id: docId,
        _type: "advisorFilter",
        label,
        slug: { _type: "slug", current: slugify(label) },
        sortOrder: index,
      },
    })
  }

  // ── 3. Upsert the "Expertise" directoryFilterGroup used by the directory dropdown
  const expertiseGroupSlug = slugify("Expertise")
  mutations.push({
    createOrReplace: {
      _id: directoryFilterGroupId(expertiseGroupSlug),
      _type: "directoryFilterGroup",
      title: "Expertise",
      slug: { _type: "slug", current: expertiseGroupSlug },
      appliesTo: "advisors",
      sortOrder: 0,
      options: ADVISOR_FILTER_OPTIONS.filter((o) => o.id !== "all").map((o) => ({
        _type: "option",
        label: o.label,
      })),
    },
  })

  // ── 4. Seed each advisor
  for (const advisor of ADVISOR_DIRECTORY_SEED) {
    const filterRefId = advisor.filter ? advisorFilterIdByLabel.get(advisor.filter) : undefined
    mutations.push({
      createOrReplace: {
        _id: `advisor-${advisor.id}`,
        _type: "advisor",
        slug: { _type: "slug", current: advisor.id },
        name: advisor.name,
        organization: advisor.organization,
        role: advisor.role,
        location: advisor.location,
        country: advisor.country,
        yearJoined: advisor.yearJoined,
        industries: advisor.industries,
        focus: advisor.focus,
        filter: filterRefId
          ? { _type: "reference", _ref: filterRefId }
          : undefined,
        directoryFilters: advisor.filter
          ? [
              {
                _type: "directoryFilterAssignment",
                group: {
                  _type: "reference",
                  _ref: directoryFilterGroupId(expertiseGroupSlug),
                },
                values: [advisor.filter],
              },
            ]
          : undefined,
        photoSrc: advisor.photoSrc,
        linkedInUrl: advisor.linkedInUrl,
        websiteUrl: advisor.websiteUrl,
        bio: advisor.bio,
        mentoringStyle: advisor.mentoringStyle,
        highlights: advisor.highlights,
      },
    })
  }

  // ── 5. Commit in chunks (Sanity has request size limits)
  const chunkSize = 50
  for (let i = 0; i < mutations.length; i += chunkSize) {
    const chunk = mutations.slice(i, i + chunkSize)
    console.log(
      `Committing ${chunk.length} mutations (${i + 1}–${Math.min(i + chunkSize, mutations.length)}/${mutations.length})`,
    )
    await client.mutate(chunk, { autoGenerateArrayKeys: true })
  }

  console.log(
    `Done — seeded ${ADVISOR_DIRECTORY_SEED.length} advisors and ${advisorFilterIdByLabel.size} specialty tags.`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
