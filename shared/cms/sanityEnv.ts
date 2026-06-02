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

export const ADMIN_SANITY_DATASETS = ["production", "preview"] as const
export type AdminSanityDataset = (typeof ADMIN_SANITY_DATASETS)[number]

/** Validates dataset name for admin draft monitor (production vs preview). */
export const resolveAdminSanityDataset = (
  requested: string | undefined,
): AdminSanityDataset | null => {
  const normalized = (requested?.trim() || "production").toLowerCase()
  if (normalized !== "production" && normalized !== "preview") return null

  const allowed = parseList(process.env.SANITY_ALLOWED_DATASETS)
  if (allowed.length > 0 && !allowed.includes(normalized)) return null

  return normalized as AdminSanityDataset
}
