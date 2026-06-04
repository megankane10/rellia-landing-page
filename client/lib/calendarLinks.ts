import { format } from "date-fns"
import type { ProgramsEventCard } from "@shared/cms/types"
import { getProgramsEventCalendarInterval } from "@/lib/eventCalendar"

export type CalendarProvider = "google" | "outlook" | "ics"

const encode = (value: string) => encodeURIComponent(value)

export const buildCalendarProviderLinks = (
  event: ProgramsEventCard,
  canonicalUrl: string,
): { providers: { id: CalendarProvider; label: string; href: string }[] } | null => {
  const interval = getProgramsEventCalendarInterval(event)
  if (!interval) return null

  const { start, end } = interval
  const title = event.title.trim()
  const location = event.location?.trim() ?? ""
  const description = event.dateTime?.trim() || canonicalUrl
  const googleDates = `${format(start, "yyyyMMdd'T'HHmmss")}/${format(end, "yyyyMMdd'T'HHmmss")}`

  const googleHref =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encode(title)}` +
    `&dates=${googleDates}` +
    `&details=${encode(description)}` +
    `&location=${encode(location)}` +
    `&ctz=America/Toronto`

  const outlookHref =
    `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent` +
    `&subject=${encode(title)}` +
    `&body=${encode(description)}` +
    `&location=${encode(location)}` +
    `&startdt=${encode(start.toISOString())}` +
    `&enddt=${encode(end.toISOString())}`

  const slug =
    event.slug?.trim() ||
    event.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") ||
    "event"
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.relliahealth.com"
  const icsHref = `${origin}/api/cms/events/${slug}/ics`

  return {
    providers: [
      { id: "google", label: "Google Calendar", href: googleHref },
      { id: "outlook", label: "Outlook", href: outlookHref },
      { id: "ics", label: "Apple Calendar", href: icsHref },
    ],
  }
}
