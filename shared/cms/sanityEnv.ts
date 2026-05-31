/**
 * Resolve Sanity project + dataset for server-side and build-time clients.
 * In production / Vercel, set SANITY_API_PROJECT_ID (or VITE_SANITY_PROJECT_ID).
 *
 * Restrictions (env):
 * - SANITY_ALLOWED_DATASETS — comma-separated names; if set, any other dataset is rejected.
 * - SANITY_ENFORCE_VERCEL_DATASET=true — on Vercel, bind dataset to VERCEL_ENV.
 */

const parseList = (raw: string | undefined): string[] =>
  (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

export type SanityApiConfig = {
  projectId: string
  dataset: string
}

export type ResolveSanityApiConfigResult =
  | { status: "ok"; projectId: string; dataset: string }
  | { status: "dataset_not_allowed"; attemptedDataset: string }
  | { status: "missing_project" }

export const resolveSanityApiConfig = (): ResolveSanityApiConfigResult => {
  const deployed =
    process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL)

  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim()

  let dataset =
    process.env.SANITY_API_DATASET?.trim() ||
    process.env.VITE_SANITY_DATASET?.trim() ||
    (deployed ? "production" : "preview")

  const enforceVercel =
    process.env.SANITY_ENFORCE_VERCEL_DATASET === "true" ||
    process.env.SANITY_ENFORCE_VERCEL_DATASET === "1"

  if (enforceVercel && process.env.VERCEL) {
    const ve = process.env.VERCEL_ENV?.trim()
    if (ve === "preview") dataset = "preview"
    if (ve === "production") dataset = "production"
  }

  const explicitAllowed = parseList(process.env.SANITY_ALLOWED_DATASETS)
  if (
    explicitAllowed.length > 0 &&
    !explicitAllowed.includes(dataset)
  ) {
    return {
      status: "dataset_not_allowed",
      attemptedDataset: dataset,
    }
  }

  if (projectId) {
    return { status: "ok", projectId, dataset }
  }

  if (!deployed) {
    return { status: "ok", projectId: "ggbt0o98", dataset }
  }

  return { status: "missing_project" }
}

export const trySanityApiConfig = (): SanityApiConfig | null => {
  const r = resolveSanityApiConfig()
  if (r.status !== "ok") return null
  return { projectId: r.projectId, dataset: r.dataset }
}
