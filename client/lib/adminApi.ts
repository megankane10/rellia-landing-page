export type AdminTeamUser = {
  id: string
  email: string
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
