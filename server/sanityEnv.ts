/**
 * Resolve Sanity project + dataset for server-side clients.
 * In production / Vercel, **do not** fall back to a baked-in project id — set SANITY_API_PROJECT_ID (or VITE_SANITY_PROJECT_ID).
 */
export const resolveSanityApiConfig = (): {
  projectId: string;
  dataset: string;
} | null => {
  const deployed =
    process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

  const projectId =
    process.env.SANITY_API_PROJECT_ID?.trim() ||
    process.env.VITE_SANITY_PROJECT_ID?.trim();

  const dataset =
    process.env.SANITY_API_DATASET?.trim() ||
    process.env.VITE_SANITY_DATASET?.trim() ||
    (deployed ? "production" : "preview");

  if (projectId) {
    return { projectId, dataset };
  }

  if (!deployed) {
    return { projectId: "ggbt0o98", dataset };
  }

  return null;
};
