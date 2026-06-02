export type AdminTeamUser = {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  createdAt: string
  lastSignInAt: string | null
  confirmedAt: string | null
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
    throw new Error(body.error ?? `Could not load Sanity drafts (${res.status})`)
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
