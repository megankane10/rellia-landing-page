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
import {
  eventsQuery,
  openRolesQuery,
  storiesPrerenderSnapshotQuery,
} from "../shared/cms/groqQueries"
import { resolveSanityApiConfig } from "../shared/cms/sanityEnv"

const snapshotsDir = resolve(dirname(fileURLToPath(import.meta.url)), "../shared/cms/build-snapshots")
const eventsSnapshotPath = resolve(snapshotsDir, "events.json")
const storiesSnapshotPath = resolve(snapshotsDir, "stories.json")
const openRolesSnapshotPath = resolve(snapshotsDir, "openRoles.json")

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
    writeJsonSnapshot(openRolesSnapshotPath, [])
    return
  }

  const token = process.env.SANITY_API_READ_TOKEN?.trim()
  if (!token) {
    console.warn(
      "[cms-snapshot] SANITY_API_READ_TOKEN missing — prerender /events, /stories, and /careers/roles may use fallbacks until token is set on Vercel Build.",
    )
    writeJsonSnapshot(eventsSnapshotPath, [])
    writeJsonSnapshot(storiesSnapshotPath, [])
    writeJsonSnapshot(openRolesSnapshotPath, [])
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
    const [eventRows, storyRows, openRoleRows] = await Promise.all([
      client.fetch<Record<string, unknown>[]>(eventsQuery),
      client.fetch<Record<string, unknown>[]>(storiesPrerenderSnapshotQuery),
      client.fetch<Record<string, unknown>[]>(openRolesQuery),
    ])
    const events = Array.isArray(eventRows) ? eventRows : []
    const stories = Array.isArray(storyRows) ? storyRows : []
    const openRoles = Array.isArray(openRoleRows) ? openRoleRows : []
    writeJsonSnapshot(eventsSnapshotPath, events)
    writeJsonSnapshot(storiesSnapshotPath, stories)
    writeJsonSnapshot(openRolesSnapshotPath, openRoles)
    console.log(
      `[cms-snapshot] Wrote ${events.length} events, ${stories.length} stories, ${openRoles.length} open roles (dataset=${config.dataset}).`,
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
    if (
      openRoles.length === 0 &&
      (process.env.VERCEL_ENV === "production" || config.dataset === "production")
    ) {
      console.warn(
        "[cms-snapshot] Production build has 0 open roles — career share embeds will lack role titles until roles exist in Sanity production.",
      )
    }
  } catch (err) {
    console.warn(
      "[cms-snapshot] Sanity fetch failed:",
      err instanceof Error ? err.message : String(err),
    )
    writeJsonSnapshot(eventsSnapshotPath, [])
    writeJsonSnapshot(storiesSnapshotPath, [])
    writeJsonSnapshot(openRolesSnapshotPath, [])
  }
}

main()
