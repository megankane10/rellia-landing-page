import { createClient, type SanityClient } from "@sanity/client"

const isPublishedId = (id: string) => Boolean(id) && !id.startsWith("drafts.")

const isSyncableType = (type: string) =>
  Boolean(type) && !type.startsWith("system.") && !type.startsWith("sanity.")

export const extractPublishedMutationIds = (body: unknown): {
  upsertIds: string[]
  deleteIds: string[]
} => {
  if (!body || typeof body !== "object") {
    return { upsertIds: [], deleteIds: [] }
  }

  const record = body as Record<string, unknown>
  const upsert = new Set<string>()
  const deleted = new Set<string>()

  const ids = record.ids
  if (ids && typeof ids === "object") {
    const bucket = ids as Record<string, unknown>
    for (const key of ["created", "updated"] as const) {
      const list = bucket[key]
      if (!Array.isArray(list)) continue
      for (const id of list) {
        if (typeof id === "string" && isPublishedId(id)) upsert.add(id)
      }
    }
    const removed = bucket.deleted
    if (Array.isArray(removed)) {
      for (const id of removed) {
        if (typeof id === "string" && isPublishedId(id)) deleted.add(id)
      }
    }
  }

  if (Array.isArray(record.documents)) {
    for (const doc of record.documents) {
      if (!doc || typeof doc !== "object") continue
      const row = doc as Record<string, unknown>
      const id = typeof row._id === "string" ? row._id : ""
      if (isPublishedId(id)) upsert.add(id)
    }
  }

  return {
    upsertIds: [...upsert],
    deleteIds: [...deleted],
  }
}

const stripForReplace = (doc: Record<string, unknown>) => {
  const { _rev, ...rest } = doc
  return rest
}

export const syncPublishedDocsToProduction = async (options: {
  projectId: string
  writeToken: string
  upsertIds: string[]
  deleteIds: string[]
}): Promise<{ synced: number; deleted: number; skipped: number }> => {
  const { projectId, writeToken, upsertIds, deleteIds } = options
  if (upsertIds.length === 0 && deleteIds.length === 0) {
    return { synced: 0, deleted: 0, skipped: 0 }
  }

  const preview = createClient({
    projectId,
    dataset: "preview",
    token: writeToken,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const production = createClient({
    projectId,
    dataset: "production",
    token: writeToken,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  let synced = 0
  let skipped = 0

  for (const id of upsertIds) {
    const doc = await preview.fetch<Record<string, unknown> | null>(`*[_id == $id][0]{...}`, { id })
    if (!doc || typeof doc._type !== "string" || !isSyncableType(doc._type)) {
      skipped += 1
      continue
    }

    if (doc._type === "sanity.imageAsset" || doc._type === "sanity.fileAsset" || id.startsWith("image-") || id.startsWith("file-")) {
      await production.createOrReplace(stripForReplace(doc) as Parameters<SanityClient["createOrReplace"]>[0])
      synced += 1
      continue
    }

    await production.createOrReplace(stripForReplace(doc) as Parameters<SanityClient["createOrReplace"]>[0])
    synced += 1
  }

  let deleted = 0
  if (deleteIds.length > 0) {
    const tx = production.transaction()
    for (const id of deleteIds) {
      tx.delete(id)
    }
    await tx.commit()
    deleted = deleteIds.length
  }

  return { synced, deleted, skipped }
}
