/**
 * Fetches CMS data for Vite prerender using SANITY_API_READ_TOKEN.
 * Run before `vite build` so /events HTML includes live events on www.
 *
 * Requires SANITY_API_READ_TOKEN in .env / .env.local or Vercel Build env.
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@sanity/client"
import "./loadEnv"
import { eventsQuery, storiesPrerenderSnapshotQuery } from "../shared/cms/groqQueries"
import { resolveSanityApiConfig } from "../shared/cms/sanityEnv"

const snapshotsDir = resolve(dirname(fileURLToPath(import.meta.url)), "../shared/cms/build-snapshots")
const eventsSnapshotPath = resolve(snapshotsDir, "events.json")
const storiesSnapshotPath = resolve(snapshotsDir, "stories.json")

const writeJsonSnapshot = (path: string, rows: Record<string, unknown>[]): void => {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(rows, null, 0), "utf8")
}

const main = async () => {
  const config = resolveSanityApiConfig()
  if (config.status !== "ok") {
    console.warn(
      `[cms-snapshot] Skipping events snapshot (${config.status === "missing_project" ? "missing project id" : `dataset ${config.attemptedDataset} not allowed`}).`,
    )
    writeJsonSnapshot(eventsSnapshotPath, [])
    writeJsonSnapshot(storiesSnapshotPath, [])
    return
  }

  const token = process.env.SANITY_API_READ_TOKEN?.trim()
  if (!token) {
    console.warn(
      "[cms-snapshot] SANITY_API_READ_TOKEN missing — prerender /events and /stories may use fallbacks until token is set on Vercel Build.",
    )
    writeJsonSnapshot(eventsSnapshotPath, [])
    writeJsonSnapshot(storiesSnapshotPath, [])
    return
  }

  const client = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
    perspective: "published",
  })

  try {
    const [eventRows, storyRows] = await Promise.all([
      client.fetch<Record<string, unknown>[]>(eventsQuery),
      client.fetch<Record<string, unknown>[]>(storiesPrerenderSnapshotQuery),
    ])
    const events = Array.isArray(eventRows) ? eventRows : []
    const stories = Array.isArray(storyRows) ? storyRows : []
    writeJsonSnapshot(eventsSnapshotPath, events)
    writeJsonSnapshot(storiesSnapshotPath, stories)
    console.log(
      `[cms-snapshot] Wrote ${events.length} events, ${stories.length} stories (dataset=${config.dataset}).`,
    )
    if (
      events.length === 0 &&
      (process.env.VERCEL_ENV === "production" || config.dataset === "production")
    ) {
      console.warn(
        "[cms-snapshot] Production build has 0 events — verify Sanity production dataset and token scopes.",
      )
    }
    if (
      stories.length === 0 &&
      (process.env.VERCEL_ENV === "production" || config.dataset === "production")
    ) {
      console.warn(
        "[cms-snapshot] Production build has 0 stories — verify Sanity production dataset and token scopes.",
      )
    }
  } catch (err) {
    console.warn(
      "[cms-snapshot] Sanity fetch failed:",
      err instanceof Error ? err.message : String(err),
    )
    writeJsonSnapshot(eventsSnapshotPath, [])
    writeJsonSnapshot(storiesSnapshotPath, [])
  }
}

main()
