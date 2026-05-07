import { createClient, type SanityClient } from "@sanity/client";

export const getSanityProjectId = (): string =>
  import.meta.env.VITE_SANITY_PROJECT_ID || "";

export const getSanityDataset = (): string =>
  import.meta.env.VITE_SANITY_DATASET || "";

export const isSanityConfigured = (): boolean => {
  if (import.meta.env.VITE_DISABLE_CMS === "true") return false
  return Boolean(
    import.meta.env.VITE_SANITY_PROJECT_ID &&
      import.meta.env.VITE_SANITY_DATASET,
  )
}

let client: SanityClient | null = null;

export const getSanityClient = (): SanityClient | null => {
  if (!isSanityConfigured()) return null;
  if (!client) {
    client = createClient({
      projectId: getSanityProjectId(),
      dataset: getSanityDataset(),
      apiVersion: "2024-01-01",
      // Publishing in Studio should reflect quickly on Vercel previews.
      // `useCdn: true` can lag; use the API for fresher reads.
      useCdn: false,
    });
  }
  return client;
};

export const sanityFetch = async <T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T | null> => {
  try {
    const isEmbeddedInFrame =
      typeof window !== "undefined" && window.self !== window.top;

    if (isEmbeddedInFrame) {
      const res = await fetch("/api/sanity/query", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query, params: params ?? {} }),
      });
      if (!res.ok) return null;
      const json = (await res.json()) as { data?: T };
      return json.data ?? null;
    }

    const c = getSanityClient();
    if (!c) return null;
    return await c.fetch<T>(query, params ?? {});
  } catch {
    return null;
  }
};
