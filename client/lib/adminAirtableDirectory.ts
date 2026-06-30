import type {
  AirtableDirectoryDetail,
  AirtableDirectoryKind,
  AirtableDirectoryQueuePayload,
} from "@shared/admin/airtableDirectoryMeta"

export type { AirtableDirectoryQueuePayload }

export const airtableDirectoryQueryKey = ["admin-airtable-directory-queue"] as const

export const airtableDirectoryDetailQueryKey = (
  kind: AirtableDirectoryKind,
  recordId: string,
) => ["admin-airtable-directory-detail", kind, recordId] as const

export const fetchAirtableDirectoryQueue = async (
  accessToken: string,
): Promise<AirtableDirectoryQueuePayload> => {
  const res = await fetch("/api/admin/airtable-directory-queue", {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "same-origin",
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Could not load network profiles (${res.status})`)
  }

  return (await res.json()) as AirtableDirectoryQueuePayload
}

export const fetchAirtableDirectoryDetail = async (
  accessToken: string,
  kind: AirtableDirectoryKind,
  recordId: string,
): Promise<AirtableDirectoryDetail> => {
  const res = await fetch(`/api/admin/airtable-directory/${kind}/${recordId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "same-origin",
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Could not load profile (${res.status})`)
  }

  return (await res.json()) as AirtableDirectoryDetail
}

export const syncAirtableProfileToSanity = async (
  accessToken: string,
  kind: AirtableDirectoryKind,
  recordId: string,
): Promise<{ ok: boolean; documentId: string; studioUrl: string }> => {
  const res = await fetch(`/api/admin/airtable-sync/${kind}/${recordId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "same-origin",
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Could not sync profile (${res.status})`)
  }

  return (await res.json()) as { ok: boolean; documentId: string; studioUrl: string }
}

export const isAirtableDirectoryEnabled = () =>
  Boolean(import.meta.env.VITE_SANITY_PROJECT_ID?.trim())

export const networkProfileAdminPath = (kind: AirtableDirectoryKind, recordId: string) =>
  `/admin/content/network/${kind}/${recordId}`
