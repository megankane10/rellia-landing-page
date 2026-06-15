/**
 * Patches CMS copy from recent marketing updates (without full re-seed).
 *
 *   pnpm sanity:migrate:cms-text-copy
 *   SANITY_API_DATASET=production pnpm sanity:migrate:cms-text-copy
 *
 * Also run (if not already on the dataset):
 *   pnpm sanity:migrate:careers-section-headlines
 *   pnpm sanity:migrate:about-values-headline
 */
import { createClient } from "@sanity/client"
import "./loadEnv"
import { DEFAULT_HOME_PATHS_CARDS } from "../shared/cms/defaults"
import { DEFAULT_NETWORK_PARTNERS_PAGE } from "../shared/cms/networkPageDefaults"

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in .env or .env.local`)
  return value
}

const DIAGNOSTIC_BADGE = "Startup Diagnostic"

const partnerPathsDefaults = DEFAULT_HOME_PATHS_CARDS.find((card) => card.roleId === "partner")

type PathsCard = {
  _key?: string
  roleId?: string
  tagLabel?: string
  ctaLabel?: string
}

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

  const patches: string[] = []

  const diagnostic = await client.fetch<{ _id: string; heroBadgeLabel?: string } | null>(
    `*[_id == "diagnosticLandingPage"][0]{ _id, heroBadgeLabel }`,
  )

  if (diagnostic?._id) {
    const current = diagnostic.heroBadgeLabel?.trim() ?? ""
    if (current.toLowerCase() !== DIAGNOSTIC_BADGE.toLowerCase()) {
      await client.patch(diagnostic._id).set({ heroBadgeLabel: DIAGNOSTIC_BADGE }).commit()
      patches.push(`diagnosticLandingPage.heroBadgeLabel → "${DIAGNOSTIC_BADGE}" (was "${current || "(empty)"}")`)
    }
  } else {
    console.log("No diagnosticLandingPage document found.")
  }

  const partners = await client.fetch<{ _id: string; heroEyebrow?: string } | null>(
    `*[_id == "networkPartnersPage"][0]{ _id, heroEyebrow }`,
  )

  if (partners?._id) {
    const target = DEFAULT_NETWORK_PARTNERS_PAGE.heroEyebrow?.trim() ?? "Industry partners"
    const current = partners.heroEyebrow?.trim() ?? ""
    if (current !== target) {
      await client.patch(partners._id).set({ heroEyebrow: target }).commit()
      patches.push(`networkPartnersPage.heroEyebrow → "${target}" (was "${current || "(empty)"}")`)
    }
  }

  const home = await client.fetch<{ _id: string; pathsCards?: PathsCard[] } | null>(
    `*[_id == "homePage"][0]{ _id, pathsCards[]{ _key, roleId, tagLabel, ctaLabel } }`,
  )

  if (home?._id && partnerPathsDefaults && Array.isArray(home.pathsCards)) {
    const partnerIndex = home.pathsCards.findIndex((card) => card.roleId === "partner")
    if (partnerIndex >= 0) {
      const partner = home.pathsCards[partnerIndex]
      const nextTag = partnerPathsDefaults.tagLabel
      const nextCta = partnerPathsDefaults.ctaLabel
      const tagChanged = partner.tagLabel?.trim() !== nextTag
      const ctaChanged = partner.ctaLabel?.trim() !== nextCta

      if (tagChanged || ctaChanged) {
        const partnerKey = partner._key ?? "partner"
        const patch = client.patch(home._id)
        if (tagChanged) {
          patch.set({ [`pathsCards[_key=="${partnerKey}"].tagLabel`]: nextTag })
        }
        if (ctaChanged) {
          patch.set({ [`pathsCards[_key=="${partnerKey}"].ctaLabel`]: nextCta })
        }
        await patch.commit()
        patches.push(
          `homePage.pathsCards[partner] → tag "${nextTag}", cta "${nextCta}"`,
        )
      }
    }
  }

  if (patches.length === 0) {
    console.log(`No CMS text copy patches needed on ${projectId}/${dataset}.`)
    return
  }

  console.log(`Patched ${projectId}/${dataset}:`)
  for (const line of patches) {
    console.log(`  - ${line}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
