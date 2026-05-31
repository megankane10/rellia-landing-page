/** Public read-only CMS list endpoints (no CSRF). Server attaches Sanity read token. */

export const fetchPublicCmsEvents = async <T>(): Promise<T[]> => {
  try {
    const res = await fetch("/api/cms/events", {
      credentials: "same-origin",
      headers: { accept: "application/json" },
    })
    if (!res.ok) return []
    const json = (await res.json()) as { data?: T[] }
    return Array.isArray(json.data) ? json.data : []
  } catch {
    return []
  }
}
