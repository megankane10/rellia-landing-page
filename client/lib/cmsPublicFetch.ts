/** Public read-only CMS list endpoints (no CSRF). Server attaches Sanity read token. */

export const fetchPublicCmsEvents = async <T>(): Promise<T[]> => {
  const res = await fetch("/api/cms/events", {
    credentials: "same-origin",
    headers: { accept: "application/json" },
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch public CMS events: ${res.status}`)
  }
  const json = (await res.json()) as { data?: T[] }
  return Array.isArray(json.data) ? json.data : []
}

export const fetchPublicCmsEventBySlug = async <T>(slug: string): Promise<T | null> => {
  const trimmed = slug.trim()
  if (!trimmed) return null
  const res = await fetch(`/api/cms/events/${encodeURIComponent(trimmed)}`, {
    credentials: "same-origin",
    headers: { accept: "application/json" },
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch public CMS event: ${res.status}`)
  }
  const json = (await res.json()) as { data?: T }
  return json.data ?? null
}
