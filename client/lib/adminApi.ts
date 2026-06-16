export type AdminTeamUser = {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  createdAt: string
  lastSignInAt: string | null
  lastActiveAt: string | null
  confirmedAt: string | null
}

export type AdminTeamNoteBlock =
  | { type: "text"; text: string }
  | { type: "sticker"; emoji: string }
  | { type: "image"; url: string; alt?: string }

export type AdminTeamNote = {
  blocks: AdminTeamNoteBlock[]
  publishedById: string | null
  publishedByName: string | null
  publishedAt: string | null
  updatedAt: string | null
}

export type AdminTeamNoteReaction = {
  emoji: string
  userId: string
  userName: string | null
  createdAt: string
}

export type AdminTeamNotePayload = {
  configured: boolean
  note: AdminTeamNote | null
  reactions: AdminTeamNoteReaction[]
}

export const fetchAdminTeam = async (accessToken: string): Promise<AdminTeamUser[]> => {
  const res = await fetch("/api/admin/team", {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "same-origin",
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Could not load team (${res.status})`)
  }

  const data = (await res.json()) as { users?: AdminTeamUser[] }
  return data.users ?? []
}

export const postAdminPresenceHeartbeat = async (accessToken: string): Promise<void> => {
  const res = await fetch("/api/admin/presence/heartbeat", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "same-origin",
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Could not update presence (${res.status})`)
  }
}

export const fetchAdminTeamNote = async (accessToken: string): Promise<AdminTeamNotePayload> => {
  const res = await fetch("/api/admin/team-note", {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "same-origin",
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Could not load team note (${res.status})`)
  }

  return (await res.json()) as AdminTeamNotePayload
}

export const publishAdminTeamNote = async (
  accessToken: string,
  blocks: AdminTeamNoteBlock[],
): Promise<{ note: AdminTeamNote }> => {
  const res = await fetch("/api/admin/team-note", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ blocks }),
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Could not publish team note (${res.status})`)
  }

  return (await res.json()) as { note: AdminTeamNote }
}

export const toggleAdminTeamNoteReaction = async (
  accessToken: string,
  emoji: string,
): Promise<{ active: boolean }> => {
  const res = await fetch("/api/admin/team-note/reactions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ emoji }),
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Could not update reaction (${res.status})`)
  }

  return (await res.json()) as { active: boolean }
}

export type AdminSanityDraftRow = {
  _id: string
  _type: string
  title?: string
  _updatedAt?: string
}

export const fetchAdminSanityDrafts = async (
  accessToken: string,
  dataset: "production" | "preview",
): Promise<AdminSanityDraftRow[]> => {
  const params = new URLSearchParams({ dataset })
  const res = await fetch(`/api/admin/sanity-drafts?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "same-origin",
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Could not load content drafts (${res.status})`)
  }

  const data = (await res.json()) as { drafts?: AdminSanityDraftRow[] }
  return data.drafts ?? []
}

export type AdminStripeMetrics = {
  configured: boolean
  currency?: string
  revenueLast30Days?: number
  revenuePrevious30Days?: number
  revenueChangePct?: number | null
  revenueDaily?: Array<{ label: string; dateKey: string; amount: number }>
}

export const fetchAdminStripeMetrics = async (accessToken: string): Promise<AdminStripeMetrics> => {
  const res = await fetch("/api/admin/stripe-metrics", {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "same-origin",
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Could not load Stripe metrics (${res.status})`)
  }

  return (await res.json()) as AdminStripeMetrics
}
