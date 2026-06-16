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
  aboutPageQuery,
  applyPageQuery,
  careersPageQuery,
  consultingPageQuery,
  eventsLandingQuery,
  eventsQuery,
  globalSettingsQuery,
  homePageQuery,
  navigationQuery,
  openRolesQuery,
  pagesPrerenderSnapshotQuery,
  paymentPageQuery,
  programsLandingQuery,
  programsLayoutPageQuery,
  programsQuery,
  siteSettingsQuery,
  storiesPageQuery,
  storiesPrerenderSnapshotQuery,
} from "../shared/cms/groqQueries"
import { resolveSanityApiConfig } from "../shared/cms/sanityEnv"

const snapshotsDir = resolve(dirname(fileURLToPath(import.meta.url)), "../shared/cms/build-snapshots")
const eventsSnapshotPath = resolve(snapshotsDir, "events.json")
const storiesSnapshotPath = resolve(snapshotsDir, "stories.json")
const openRolesSnapshotPath = resolve(snapshotsDir, "openRoles.json")
const pagesSnapshotPath = resolve(snapshotsDir, "pages.json")

const aboutSnapshotPath = resolve(snapshotsDir, "aboutPage.json")
const applySnapshotPath = resolve(snapshotsDir, "applyPage.json")
const careersSnapshotPath = resolve(snapshotsDir, "careersPage.json")
const eventsLandingSnapshotPath = resolve(snapshotsDir, "eventsLandingPage.json")
const globalSettingsSnapshotPath = resolve(snapshotsDir, "globalSettings.json")
const homeSnapshotPath = resolve(snapshotsDir, "homePage.json")
const navigationSnapshotPath = resolve(snapshotsDir, "navigation.json")
const paymentSnapshotPath = resolve(snapshotsDir, "paymentPage.json")
const consultingSnapshotPath = resolve(snapshotsDir, "consultingPage.json")
const programsLandingSnapshotPath = resolve(snapshotsDir, "programsLandingPage.json")
const programsLayoutSnapshotPath = resolve(snapshotsDir, "programsLayoutPage.json")
const programsSnapshotPath = resolve(snapshotsDir, "programs.json")
const siteSettingsSnapshotPath = resolve(snapshotsDir, "siteSettings.json")
const storiesPageSnapshotPath = resolve(snapshotsDir, "storiesPage.json")

const writeJsonSnapshot = (path: string, rows: Record<string, unknown>[]): void => {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(rows, null, 0), "utf8")
}

const writeJsonDocSnapshot = (path: string, doc: Record<string, unknown> | null): void => {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(doc ?? null, null, 0), "utf8")
}

const resetSingletonSnapshots = () => {
  writeJsonDocSnapshot(globalSettingsSnapshotPath, null)
  writeJsonDocSnapshot(siteSettingsSnapshotPath, null)
  writeJsonDocSnapshot(navigationSnapshotPath, null)
  writeJsonDocSnapshot(homeSnapshotPath, null)
  writeJsonDocSnapshot(aboutSnapshotPath, null)
  writeJsonDocSnapshot(careersSnapshotPath, null)
  writeJsonDocSnapshot(applySnapshotPath, null)
  writeJsonDocSnapshot(paymentSnapshotPath, null)
  writeJsonDocSnapshot(consultingSnapshotPath, null)
  writeJsonDocSnapshot(programsLandingSnapshotPath, null)
  writeJsonDocSnapshot(programsLayoutSnapshotPath, null)
  writeJsonDocSnapshot(eventsLandingSnapshotPath, null)
  writeJsonDocSnapshot(storiesPageSnapshotPath, null)
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
    writeJsonSnapshot(pagesSnapshotPath, [])
    writeJsonSnapshot(programsSnapshotPath, [])
    resetSingletonSnapshots()
    return
  }

  const token = process.env.SANITY_API_READ_TOKEN?.trim()
  if (!token) {
    console.warn(
      "[cms-snapshot] SANITY_API_READ_TOKEN missing — prerender /events, /stories, /careers/roles, and custom CMS pages may use fallbacks until token is set on Vercel Build.",
    )
    writeJsonSnapshot(eventsSnapshotPath, [])
    writeJsonSnapshot(storiesSnapshotPath, [])
    writeJsonSnapshot(openRolesSnapshotPath, [])
    writeJsonSnapshot(pagesSnapshotPath, [])
    writeJsonSnapshot(programsSnapshotPath, [])
    resetSingletonSnapshots()
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
    const [
      eventRows,
      storyRows,
      openRoleRows,
      pageRows,
      programRows,
      globalSettingsDoc,
      siteSettingsDoc,
      navigationDoc,
      homeDoc,
      aboutDoc,
      careersDoc,
      applyDoc,
      paymentDoc,
      consultingDoc,
      programsLandingDoc,
      programsLayoutDoc,
      eventsLandingDoc,
      storiesPageDoc,
    ] = await Promise.all([
      client.fetch<Record<string, unknown>[]>(eventsQuery),
      client.fetch<Record<string, unknown>[]>(storiesPrerenderSnapshotQuery),
      client.fetch<Record<string, unknown>[]>(openRolesQuery),
      client.fetch<Record<string, unknown>[]>(pagesPrerenderSnapshotQuery),
      client.fetch<Record<string, unknown>[]>(programsQuery),
      client.fetch<Record<string, unknown> | null>(globalSettingsQuery),
      client.fetch<Record<string, unknown> | null>(siteSettingsQuery),
      client.fetch<Record<string, unknown> | null>(navigationQuery),
      client.fetch<Record<string, unknown> | null>(homePageQuery),
      client.fetch<Record<string, unknown> | null>(aboutPageQuery),
      client.fetch<Record<string, unknown> | null>(careersPageQuery),
      client.fetch<Record<string, unknown> | null>(applyPageQuery),
      client.fetch<Record<string, unknown> | null>(paymentPageQuery),
      client.fetch<Record<string, unknown> | null>(consultingPageQuery),
      client.fetch<Record<string, unknown> | null>(programsLandingQuery),
      client.fetch<Record<string, unknown> | null>(programsLayoutPageQuery),
      client.fetch<Record<string, unknown> | null>(eventsLandingQuery),
      client.fetch<Record<string, unknown> | null>(storiesPageQuery),
    ])
    const events = Array.isArray(eventRows) ? eventRows : []
    const stories = Array.isArray(storyRows) ? storyRows : []
    const openRoles = Array.isArray(openRoleRows) ? openRoleRows : []
    const pages = Array.isArray(pageRows) ? pageRows : []
    const programs = Array.isArray(programRows) ? programRows : []
    writeJsonSnapshot(eventsSnapshotPath, events)
    writeJsonSnapshot(storiesSnapshotPath, stories)
    writeJsonSnapshot(openRolesSnapshotPath, openRoles)
    writeJsonSnapshot(pagesSnapshotPath, pages)
    writeJsonSnapshot(programsSnapshotPath, programs)
    writeJsonDocSnapshot(globalSettingsSnapshotPath, globalSettingsDoc ?? null)
    writeJsonDocSnapshot(siteSettingsSnapshotPath, siteSettingsDoc ?? null)
    writeJsonDocSnapshot(navigationSnapshotPath, navigationDoc ?? null)
    writeJsonDocSnapshot(homeSnapshotPath, homeDoc ?? null)
    writeJsonDocSnapshot(aboutSnapshotPath, aboutDoc ?? null)
    writeJsonDocSnapshot(careersSnapshotPath, careersDoc ?? null)
    writeJsonDocSnapshot(applySnapshotPath, applyDoc ?? null)
    writeJsonDocSnapshot(paymentSnapshotPath, paymentDoc ?? null)
    writeJsonDocSnapshot(consultingSnapshotPath, consultingDoc ?? null)
    writeJsonDocSnapshot(programsLandingSnapshotPath, programsLandingDoc ?? null)
    writeJsonDocSnapshot(programsLayoutSnapshotPath, programsLayoutDoc ?? null)
    writeJsonDocSnapshot(eventsLandingSnapshotPath, eventsLandingDoc ?? null)
    writeJsonDocSnapshot(storiesPageSnapshotPath, storiesPageDoc ?? null)
    console.log(
      `[cms-snapshot] Wrote ${events.length} events, ${stories.length} stories, ${openRoles.length} open roles, ${programs.length} programs, ${pages.length} custom pages + singletons (dataset=${config.dataset}).`,
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
    if (
      programs.length === 0 &&
      (process.env.VERCEL_ENV === "production" || config.dataset === "production")
    ) {
      console.warn(
        "[cms-snapshot] Production build has 0 programs — verify Sanity production dataset and token scopes.",
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
    writeJsonSnapshot(pagesSnapshotPath, [])
    writeJsonSnapshot(programsSnapshotPath, [])
    resetSingletonSnapshots()
  }
}

main()
