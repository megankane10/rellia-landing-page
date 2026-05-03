import type { ProgramsEventCard } from "@shared/cms/types"

/**
 * Luma inline embed (`/simple`) expects an `evt-*` id. We also try short public slugs
 * from `href` (e.g. `https://luma.com/bgvqn7ia`) as `https://lu.ma/embed/{slug}`.
 */
export const getLumaEmbedIframeSrc = (event: ProgramsEventCard): string | null => {
  const evtId = event.lumaEventId?.trim()
  if (evtId) {
    const id = evtId.startsWith("evt-") ? evtId : `evt-${evtId}`
    return `https://lu.ma/embed/event/${id}/simple`
  }

  const href = event.href?.trim()
  if (!href) return null

  try {
    const u = new URL(href)
    const fromPath = u.pathname.match(/(evt-[a-zA-Z0-9]+)/)
    if (fromPath) {
      return `https://lu.ma/embed/event/${fromPath[1]}/simple`
    }
    const seg = u.pathname.split("/").filter(Boolean)[0]
    if (seg) {
      return `https://lu.ma/embed/${seg}`
    }
  } catch {
    return null
  }

  return null
}
