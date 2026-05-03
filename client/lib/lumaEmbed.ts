import type { ProgramsEventCard } from "@shared/cms/types"

/**
 * Luma inline embed (`/simple`) requires an explicit CMS **`lumaEventId`** (`evt-…`).
 * Registration URLs alone do not enable the embed — editors must set the event ID in Sanity.
 */
export const getLumaEmbedIframeSrc = (event: ProgramsEventCard): string | null => {
  const evtId = event.lumaEventId?.trim()
  if (!evtId) return null
  const id = evtId.startsWith("evt-") ? evtId : `evt-${evtId}`
  return `https://lu.ma/embed/event/${id}/simple`
}
