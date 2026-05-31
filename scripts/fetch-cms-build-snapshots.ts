/**
 * Fetches CMS data for Vite prerender using SANITY_API_READ_TOKEN.
 * Run before `vite build` so /events HTML includes live events on www.
 *
 * Requires SANITY_API_READ_TOKEN in .env / .env.local or Vercel Build env.
 */
import { createClient } from "@sanity/client"
import "./loadEnv"
import { eventsQuery } from "../shared/cms/groqQueries"
import { resolveSanityApiConfig } from "../shared/cms/sanityEnv"
import { writeEventsBuildSnapshot } from "../shared/cms/buildSnapshots"

const main = async () => {
  const config = resolveSanityApiConfig()
  if (config.status !== "ok") {
    console.warn(
      `[cms-snapshot] Skipping events snapshot (${config.status === "missing_project" ? "missing project id" : `dataset ${config.attemptedDataset} not allowed`}).`,
    )
    writeEventsBuildSnapshot([])
    return
  }

  const token = process.env.SANITY_API_READ_TOKEN?.trim()
  if (!token) {
    console.warn(
      "[cms-snapshot] SANITY_API_READ_TOKEN missing — prerender /events will be empty until token is set on Vercel Build.",
    )
    writeEventsBuildSnapshot([])
    return
  }

  const client = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  try {
    const rows = await client.fetch<Record<string, unknown>[]>(eventsQuery)
    const events = Array.isArray(rows) ? rows : []
    writeEventsBuildSnapshot(events)
    console.log(
      `[cms-snapshot] Wrote ${events.length} events (dataset=${config.dataset}).`,
    )
    if (
      events.length === 0 &&
      (process.env.VERCEL_ENV === "production" || config.dataset === "production")
    ) {
      console.warn(
        "[cms-snapshot] Production build has 0 events — verify Sanity production dataset and token scopes.",
      )
    }
  } catch (err) {
    console.warn(
      "[cms-snapshot] Sanity fetch failed:",
      err instanceof Error ? err.message : String(err),
    )
    writeEventsBuildSnapshot([])
  }
}

main()
