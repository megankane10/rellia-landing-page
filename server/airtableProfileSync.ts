import { createClient } from "@sanity/client"
import {
  resolveAirtableBaseId,
  resolveAirtableTableId,
  WEBSITE_STATUS_VALUES,
} from "../shared/admin/airtableConfig"
import { WEBSITE_STATUS_FIELD } from "../shared/admin/airtableDirectoryMeta"
import type { AirtableDirectoryKind } from "../shared/admin/airtableDirectoryMeta"
import {
  buildAdvisorDocFromAirtable,
  buildFounderDocFromAirtable,
} from "../shared/admin/airtableProfileMapping"

const fetchAirtableRecord = async (apiKey: string, kind: AirtableDirectoryKind, recordId: string) => {
  const tableId = resolveAirtableTableId(kind === "founder" ? "founders" : "advisors")
  const baseId = resolveAirtableBaseId()
  const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}/${recordId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(`Airtable record fetch failed (${response.status}): ${body.slice(0, 200)}`)
  }
  return (await response.json()) as { id: string; fields: Record<string, unknown> }
}

const patchAirtableRecord = async (options: {
  apiKey: string
  kind: AirtableDirectoryKind
  recordId: string
  fields: Record<string, unknown>
}) => {
  if (process.env.AIRTABLE_ALLOW_WRITES?.trim() !== "true") return

  const tableId = resolveAirtableTableId(options.kind === "founder" ? "founders" : "advisors")
  const baseId = resolveAirtableBaseId()
  await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}/${options.recordId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: options.fields }),
  })
}

export const syncAirtableProfileToSanityDraft = async (options: {
  airtableApiKey: string
  sanityProjectId: string
  sanityDataset: string
  sanityWriteToken: string
  kind: AirtableDirectoryKind
  recordId: string
}): Promise<{ documentId: string; studioPath: string }> => {
  const record = await fetchAirtableRecord(options.airtableApiKey, options.kind, options.recordId)
  const fields = record.fields

  const client = createClient({
    projectId: options.sanityProjectId,
    dataset: options.sanityDataset,
    token: options.sanityWriteToken,
    apiVersion: "2024-01-01",
    useCdn: false,
  })

  const doc =
    options.kind === "founder"
      ? buildFounderDocFromAirtable(options.recordId, fields)
      : buildAdvisorDocFromAirtable(options.recordId, fields)

  await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0])

  await patchAirtableRecord({
    apiKey: options.airtableApiKey,
    kind: options.kind,
    recordId: options.recordId,
    fields: {
      [WEBSITE_STATUS_FIELD]: WEBSITE_STATUS_VALUES.readyForReview,
      "Sanity document ID": doc._id,
    },
  })

  const studioType = options.kind === "founder" ? "alumniCompany" : "advisor"
  return {
    documentId: doc._id,
    studioPath: `/structure/${studioType};${encodeURIComponent(doc._id)}`,
  }
}
