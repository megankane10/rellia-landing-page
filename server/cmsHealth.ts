import type { RequestHandler } from "express"
import { createClient } from "@sanity/client"
import { resolveSanityApiConfig } from "./sanityEnv"

const envFlag = (name: string): boolean => Boolean(process.env[name]?.trim())

const resolveExpectedDataset = (): string | null => {
  if (!process.env.VERCEL) return null
  const ve = process.env.VERCEL_ENV?.trim()
  if (ve === "production") return "production"
  if (ve === "preview") return "preview"
  return null
}

export const cmsHealthHandler: RequestHandler = async (_req, res) => {
  const apiResolved = resolveSanityApiConfig()
  const readTokenConfigured = envFlag("SANITY_API_READ_TOKEN")
  const writeTokenConfigured = envFlag("SANITY_API_WRITE_TOKEN")
  const publishWebhookSecretConfigured = envFlag("SANITY_PUBLISH_WEBHOOK_SECRET")
  const expectedDataset = resolveExpectedDataset()

  const publishWebhookReady =
    publishWebhookSecretConfigured && writeTokenConfigured && apiResolved.status === "ok"

  let previewHomeTitle: string | null = null
  let productionHomeTitle: string | null = null
  let datasetProbeError: string | null = null

  if (writeTokenConfigured && apiResolved.status === "ok") {
    try {
      const token = process.env.SANITY_API_WRITE_TOKEN!.trim()
      const { projectId } = apiResolved
      const previewClient = createClient({
        projectId,
        dataset: "preview",
        token,
        apiVersion: "2024-01-01",
        useCdn: false,
      })
      const productionClient = createClient({
        projectId,
        dataset: "production",
        token,
        apiVersion: "2024-01-01",
        useCdn: false,
      })
      const titleQuery = `*[_id == "homePage"][0].pathsTitle`
      const [previewTitle, productionTitle] = await Promise.all([
        previewClient.fetch<string | null>(titleQuery),
        productionClient.fetch<string | null>(titleQuery),
      ])
      previewHomeTitle = typeof previewTitle === "string" ? previewTitle : null
      productionHomeTitle = typeof productionTitle === "string" ? productionTitle : null
    } catch (err) {
      datasetProbeError =
        err instanceof Error ? err.message : "Could not compare preview vs production datasets"
    }
  }

  const datasetsInSync =
    previewHomeTitle !== null &&
    productionHomeTitle !== null &&
    previewHomeTitle === productionHomeTitle

  const issues: string[] = []

  if (apiResolved.status === "missing_project") {
    issues.push("Set SANITY_API_PROJECT_ID or VITE_SANITY_PROJECT_ID on this deployment.")
  }
  if (apiResolved.status === "dataset_not_allowed") {
    issues.push(
      `Dataset "${apiResolved.attemptedDataset}" is not in SANITY_ALLOWED_DATASETS for this deployment.`,
    )
  }
  if (!readTokenConfigured) {
    issues.push("SANITY_API_READ_TOKEN is missing — /api/sanity/query will fail.")
  }
  if (process.env.VERCEL_ENV === "production" && !publishWebhookSecretConfigured) {
    issues.push(
      "SANITY_PUBLISH_WEBHOOK_SECRET is missing — Studio publish will not sync preview → production.",
    )
  }
  if (process.env.VERCEL_ENV === "production" && !writeTokenConfigured) {
    issues.push("SANITY_API_WRITE_TOKEN is missing — publish webhook cannot copy to production.")
  }
  if (
    expectedDataset &&
    apiResolved.status === "ok" &&
    apiResolved.dataset !== expectedDataset
  ) {
    issues.push(
      `This deployment should read dataset "${expectedDataset}" but is configured for "${apiResolved.dataset}".`,
    )
  }
  if (
    writeTokenConfigured &&
    previewHomeTitle !== null &&
    productionHomeTitle !== null &&
    !datasetsInSync
  ) {
    issues.push(
      "preview and production datasets differ (sample: homePage.pathsTitle). Publish webhook may not have run, or run pnpm sanity:sync-to-production -- --apply.",
    )
  }
  if (datasetProbeError) {
    issues.push(datasetProbeError)
  }

  const ok = issues.length === 0

  res.status(ok ? 200 : 503).json({
    ok,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    cms: {
      projectId: apiResolved.status === "ok" ? apiResolved.projectId : null,
      activeDataset: apiResolved.status === "ok" ? apiResolved.dataset : null,
      expectedDataset,
      clientDataset: process.env.VITE_SANITY_DATASET?.trim() || null,
      enforceVercelDataset: envFlag("SANITY_ENFORCE_VERCEL_DATASET"),
      allowedDatasets:
        process.env.SANITY_ALLOWED_DATASETS?.split(",")
          .map((s) => s.trim())
          .filter(Boolean) ?? [],
    },
    tokens: {
      readTokenConfigured,
      writeTokenConfigured,
      publishWebhookSecretConfigured,
      publishWebhookReady,
    },
    sync: {
      previewHomePathsTitle: previewHomeTitle,
      productionHomePathsTitle: productionHomeTitle,
      datasetsInSync,
    },
    issues,
    hints: {
      publishWebhookUrl:
        "POST https://www.relliahealth.com/api/webhooks/sanity-publish?secret=<SANITY_PUBLISH_WEBHOOK_SECRET>",
      publishWebhookNote:
        "Replace <SANITY_PUBLISH_WEBHOOK_SECRET> with the real value from Vercel Production env — not the literal text YOUR_SECRET.",
      manualSync: "pnpm sanity:sync-to-production -- --apply",
    },
  })
}
