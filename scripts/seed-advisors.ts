/**
 * Seeds advisor-related data to Sanity:
 *   - directoryFilterGroup "Country" (shared) and "Expertise"
 *   - showcase advisor document (dummy profile for editors)
 *
 * Safe to run repeatedly — uses createOrReplace so it's fully idempotent.
 *
 * Requires: SANITY_API_WRITE_TOKEN (Editor token)
 * Optional: SANITY_API_PROJECT_ID (defaults to ggbt0o98)
 *           SANITY_API_DATASET     (defaults to preview)
 *
 * Run: pnpm run seed:advisors
 */

import { createClient } from "@sanity/client"
import "./loadEnv"
import { ADVISOR_FILTER_OPTIONS } from "../client/data/advisorDirectory"
import {
  createDummyAdvisorBio,
  DUMMY_ADVISOR,
} from "./seed/cmsSyncContent"

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

const ptBlock = (key: string, text: string, style = "normal") => ({
  _type: "block" as const,
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: "span" as const, _key: `${key}-span`, text, marks: [] as string[] }],
})

const bullet = (key: string, text: string) => ({
  _type: "block" as const,
  _key: key,
  style: "normal" as const,
  listItem: "bullet" as const,
  level: 1,
  markDefs: [],
  children: [{ _type: "span" as const, _key: `${key}-span`, text, marks: [] as string[] }],
})

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

  const sharedCountryGroupSlug = slugify("Country")
  const advisorsExpertiseGroupSlug = slugify("Expertise")

  for (const legacyGroupSlug of [slugify("Countries"), slugify("Specialties")]) {
    mutations.push({ delete: { id: directoryFilterGroupId(legacyGroupSlug) } })
  }

  mutations.push({
    createOrReplace: {
      _id: directoryFilterGroupId(sharedCountryGroupSlug),
      _type: "directoryFilterGroup",
      title: "Country",
      slug: { _type: "slug", current: sharedCountryGroupSlug },
      appliesTo: "both",
      sortOrder: 0,
      options: [
        { _type: "option", label: "United States" },
        { _type: "option", label: "Canada" },
        { _type: "option", label: "United Kingdom" },
        { _type: "option", label: "Germany" },
        { _type: "option", label: "France" },
        { _type: "option", label: "Australia" },
      ],
    },
  })

  mutations.push({
    createOrReplace: {
      _id: directoryFilterGroupId(advisorsExpertiseGroupSlug),
      _type: "directoryFilterGroup",
      title: "Expertise",
      slug: { _type: "slug", current: advisorsExpertiseGroupSlug },
      appliesTo: "advisors",
      sortOrder: 1,
      options: ADVISOR_FILTER_OPTIONS.filter((o) => o.id !== "all").map((o) => ({
        _type: "option",
        label: o.label,
      })),
    },
  })

  const existingAdvisorIds = await client.fetch<string[]>(`*[_type == "advisor"]._id`)
  for (const id of existingAdvisorIds) {
    mutations.push({ delete: { id } })
  }

  mutations.push({
    createOrReplace: {
      _id: `advisor-${DUMMY_ADVISOR.id}`,
      _type: "advisor",
      slug: { _type: "slug", current: DUMMY_ADVISOR.id },
      name: DUMMY_ADVISOR.name,
      organization: DUMMY_ADVISOR.organization,
      role: DUMMY_ADVISOR.role,
      country: DUMMY_ADVISOR.country,
      yearJoined: DUMMY_ADVISOR.yearJoined,
      primaryExpertise: DUMMY_ADVISOR.primaryExpertise,
      industries: DUMMY_ADVISOR.industries,
      snapshot: DUMMY_ADVISOR.snapshot,
      directoryFilters: [
        {
          _type: "directoryFilterAssignment",
          group: { _type: "reference", _ref: directoryFilterGroupId(sharedCountryGroupSlug) },
          values: DUMMY_ADVISOR.country,
        },
        {
          _type: "directoryFilterAssignment",
          group: { _type: "reference", _ref: directoryFilterGroupId(advisorsExpertiseGroupSlug) },
          values: [DUMMY_ADVISOR.expertiseFilter],
        },
      ],
      photoSrc: DUMMY_ADVISOR.photoSrc,
      socialLinks: DUMMY_ADVISOR.socialLinks,
      bio: createDummyAdvisorBio(ptBlock, bullet),
    },
  })

  const chunkSize = 50
  for (let i = 0; i < mutations.length; i += chunkSize) {
    const chunk = mutations.slice(i, i + chunkSize)
    console.log(
      `Committing ${chunk.length} mutations (${i + 1}–${Math.min(i + chunkSize, mutations.length)}/${mutations.length})`,
    )
    await client.mutate(chunk, { autoGenerateArrayKeys: true })
  }

  console.log("Done — seeded showcase advisor with Country and Expertise filter groups.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
