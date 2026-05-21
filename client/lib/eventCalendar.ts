import { addMinutes, isValid, parseISO } from "date-fns"
import type { ProgramsEventCard } from "@shared/cms/types"

const escapeIcsText = (raw: string): string =>
  raw.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,")

/** ICS UTC datetime: `YYYYMMDDTHHmmssZ` */
const toIcsUtc = (d: Date): string => {
  const iso = d.toISOString()
  const base = iso.includes(".") ? `${iso.slice(0, iso.indexOf("."))}Z` : iso
  return base.replace(/[-:]/g, "")
}

export const getProgramsEventCalendarInterval = (
  event: ProgramsEventCard,
): { start: Date; end: Date } | null => {
  const startRaw = event.startsAt?.trim()
  const endRaw = event.endsAt?.trim()
  if (startRaw && endRaw) {
    const start = parseISO(startRaw)
    const end = parseISO(endRaw)
    if (isValid(start) && isValid(end) && end > start) return { start, end }
    return null
  }

  if (startRaw) {
    const start = parseISO(startRaw)
    if (!isValid(start)) return null
    return { start, end: addMinutes(start, 90) }
  }

  return null
}

const buildIcsDocument = (params: {
  uid: string
  stamp: Date
  start: Date
  end: Date
  summary: string
  description: string
  location: string
  url: string
}): string => {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rellia Health//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(params.uid)}`,
    `DTSTAMP:${toIcsUtc(params.stamp)}`,
    `DTSTART:${toIcsUtc(params.start)}`,
    `DTEND:${toIcsUtc(params.end)}`,
    `SUMMARY:${escapeIcsText(params.summary)}`,
    `DESCRIPTION:${escapeIcsText(params.description)}`,
    `LOCATION:${escapeIcsText(params.location)}`,
    `URL:${escapeIcsText(params.url)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return `${lines.join("\r\n")}\r\n`
}

/**
 * Adds the event to the user’s calendar: prefers the **Web Share API** with an `.ics` file on phones
 * (share sheet → Calendar / Google Calendar). Falls back to downloading the same file for desktop.
 * Returns `false` only if calendar start/end data is missing or invalid.
 */
export const downloadProgramsEventIcsFile = async (
  event: ProgramsEventCard,
  canonicalUrl: string,
): Promise<boolean> => {
  const interval = getProgramsEventCalendarInterval(event)
  if (!interval) return false

  const slug =
    event.slug?.trim() ||
    event.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") ||
    "event"
  const fileName = `${slug || "rellia-event"}.ics`
  const uid = `${slug}-${interval.start.getTime()}@relliahealth.com`
  const description = `${event.title}. ${event.dateTime?.trim() ?? event.startsAt ?? ""}`.trim()
  const location = event.location?.trim() ?? ""

  const ics = buildIcsDocument({
    uid,
    stamp: new Date(),
    start: interval.start,
    end: interval.end,
    summary: event.title,
    description,
    location,
    url: canonicalUrl,
  })

  const file = new File([ics], fileName, { type: "text/calendar;charset=utf-8" })

  if (typeof navigator !== "undefined" && typeof navigator.share === "function" && typeof navigator.canShare === "function") {
    try {
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: event.title,
          text: "Add this Rellia Health event to your calendar.",
        })
        return true
      }
    } catch (e) {
      const name = e instanceof Error ? e.name : ""
      if (name === "AbortError") return true
    }
  }

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = objectUrl
  a.download = fileName
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(objectUrl)
  return true
}
