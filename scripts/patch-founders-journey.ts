import { createClient } from "@sanity/client"
import "./loadEnv"
import { DEFAULT_NETWORK_FOUNDERS_PAGE } from "../shared/cms/networkPageDefaults"

const ICON_BY_STEP_ID: Record<string, string> = {
  idea: "Lightbulb",
  edu: "GraduationCap",
  problem: "MessagesSquare",
  mvp: "Hammer",
  feedback: "MessagesSquare",
  funding: "Percent",
  reg: "ShieldCheck",
  clinical: "Stethoscope",
  commercial: "Target",
  launch: "Rocket",
}

type JourneyStepDoc = {
  _key: string
  id: string
  label?: string
  zone?: string
  detail?: string
  iconKey?: string
}

const patchDataset = async (dataset: string) => {
  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim() ||
    "ggbt0o98"
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim()
  if (!token) throw new Error("SANITY_API_WRITE_TOKEN missing")

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const doc = await client.fetch<{ journeySteps?: JourneyStepDoc[] } | null>(
    `*[_id == "networkFoundersPage"][0]{ journeySteps[]{ _key, id, label, zone, detail, iconKey } }`,
  )

  if (!doc) {
    console.log(`networkFoundersPage not found on ${dataset}, skipping`)
    return
  }

  const journeySteps = (doc.journeySteps ?? []).map((step) => ({
    ...step,
    iconKey: step.iconKey?.trim() || ICON_BY_STEP_ID[step.id] || undefined,
  }))

  await client
    .patch("networkFoundersPage")
    .set({
      showJourneySection: DEFAULT_NETWORK_FOUNDERS_PAGE.showJourneySection ?? true,
      journeyTitle: DEFAULT_NETWORK_FOUNDERS_PAGE.journeyTitle,
      journeyHelpBadge: DEFAULT_NETWORK_FOUNDERS_PAGE.journeyHelpBadge,
      journeyHelpHeading: DEFAULT_NETWORK_FOUNDERS_PAGE.journeyHelpHeading,
      journeySteps,
    })
    .unset(["journeySubtitle"])
    .commit()

  console.log(`Patched networkFoundersPage trajectory fields on dataset: ${dataset}`)
}

const main = async () => {
  const explicitDataset = process.env.SANITY_API_DATASET?.trim()
  if (explicitDataset) {
    await patchDataset(explicitDataset)
    return
  }

  await patchDataset("preview")
  await patchDataset("production")
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
