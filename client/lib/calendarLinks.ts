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

  const icsHref = `data:text/calendar;charset=utf-8,${encode(
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${format(start, "yyyyMMdd'T'HHmmss")}`,
      `DTEND:${format(end, "yyyyMMdd'T'HHmmss")}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `URL:${canonicalUrl}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n"),
  )}`

  return {
    providers: [
      { id: "google", label: "Google Calendar", href: googleHref },
      { id: "outlook", label: "Outlook", href: outlookHref },
      { id: "ics", label: "Apple Calendar", href: icsHref },
    ],
  }
}
