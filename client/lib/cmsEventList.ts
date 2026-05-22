import { getProgramsEventDisplayDateTime } from "@shared/cms/programsEventDisplay"
import type { ProgramsEventCard } from "@shared/cms/types"

/** Ensure listing cards get a display date line from startsAt/endsAt when dateTime is missing in CMS. */
export const normalizeCmsEventForCard = (event: ProgramsEventCard): ProgramsEventCard => {
  const dateTime = getProgramsEventDisplayDateTime(event)
  if (!dateTime) return event
  return { ...event, dateTime }
}
