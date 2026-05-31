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

export const fetchPublicCmsEventBySlug = async <T>(slug: string): Promise<T | null> => {
  const trimmed = slug.trim()
  if (!trimmed) return null
  try {
    const res = await fetch(`/api/cms/events/${encodeURIComponent(trimmed)}`, {
      credentials: "same-origin",
      headers: { accept: "application/json" },
    })
    if (!res.ok) return null
    const json = (await res.json()) as { data?: T }
    return json.data ?? null
  } catch {
    return null
  }
}
