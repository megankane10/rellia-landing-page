import type { ProgramsEventCard } from "@shared/cms/types"
import { resolveEventHostImageSrc } from "./eventHostImage"

export const PROGRAMS_EVENT_LOCATION_FALLBACK = "Virtual"

const MIDDLE_DOT_SEP = " · "

const WEEKDAY_PREFIX: Array<[RegExp, string]> = [
  [/^Monday,\s*/i, "Mon, "],
  [/^Tuesday,\s*/i, "Tue, "],
  [/^Wednesday,\s*/i, "Wed, "],
  [/^Thursday,\s*/i, "Thu, "],
  [/^Friday,\s*/i, "Fri, "],
  [/^Saturday,\s*/i, "Sat, "],
  [/^Sunday,\s*/i, "Sun, "],
]

const MONTH_WORD: Array<[RegExp, string]> = [
  [/\bJanuary\b/i, "Jan"],
  [/\bFebruary\b/i, "Feb"],
  [/\bMarch\b/i, "Mar"],
  [/\bApril\b/i, "Apr"],
  [/\bJune\b/i, "Jun"],
  [/\bJuly\b/i, "Jul"],
  [/\bAugust\b/i, "Aug"],
  [/\bSeptember\b/i, "Sep"],
  [/\bOctober\b/i, "Oct"],
  [/\bNovember\b/i, "Nov"],
  [/\bDecember\b/i, "Dec"],
]

const CARD_DATE_TIME_SPLIT = "\uE000"

const applyWeekdayMonthAbbreviations = (input: string) => {
  let out = input.trim()
  for (const [re, rep] of WEEKDAY_PREFIX) {
    if (re.test(out)) {
      out = out.replace(re, rep)
      break
    }
  }
  for (const [re, rep] of MONTH_WORD) {
    out = out.replace(re, rep)
  }
  return out
}

const stripDayOrdinals = (s: string) => s.replace(/\b(\d{1,2})(?:st|nd|rd|th)\b/gi, "$1")

const WEEKDAY_LEADING_EXPAND: Array<[RegExp, string]> = [
  [/^Monday,?\s*/i, "Monday, "],
  [/^Tuesday,?\s*/i, "Tuesday, "],
  [/^Wednesday,?\s*/i, "Wednesday, "],
  [/^Thursday,?\s*/i, "Thursday, "],
  [/^Friday,?\s*/i, "Friday, "],
  [/^Saturday,?\s*/i, "Saturday, "],
  [/^Sunday,?\s*/i, "Sunday, "],
  [/^Mon\.?,?\s+/i, "Monday, "],
  [/^Tue\.?,?\s+/i, "Tuesday, "],
  [/^Wed\.?,?\s+/i, "Wednesday, "],
  [/^Thu\.?,?\s+/i, "Thursday, "],
  [/^Thur\.?,?\s+/i, "Thursday, "],
  [/^Thurs\.?,?\s+/i, "Thursday, "],
  [/^Fri\.?,?\s+/i, "Friday, "],
  [/^Sat\.?,?\s+/i, "Saturday, "],
  [/^Sun\.?,?\s+/i, "Sunday, "],
]

const MONTH_EXPAND: Array<[RegExp, string]> = [
  [/\bSept\b/gi, "September"],
  [/\bJan\b/gi, "January"],
  [/\bFeb\b/gi, "February"],
  [/\bMar\b/gi, "March"],
  [/\bApr\b/gi, "April"],
  [/\bJun\b/gi, "June"],
  [/\bJul\b/gi, "July"],
  [/\bAug\b/gi, "August"],
  [/\bOct\b/gi, "October"],
  [/\bNov\b/gi, "November"],
  [/\bDec\b/gi, "December"],
]

/** Calendar line: full weekday (when present), month name, day, year when present — e.g. `Thursday, April 9, 2025`. */
export const normalizeProgramsEventCalendarDate = (datePart: string): string => {
  let s = stripDayOrdinals(datePart.trim())
  if (!s) return ""

  for (const [re, rep] of WEEKDAY_LEADING_EXPAND) {
    if (re.test(s)) {
      s = s.replace(re, rep)
      break
    }
  }

  for (const [re, rep] of MONTH_EXPAND) {
    s = s.replace(re, rep)
  }

  return s.replace(/\s+/g, " ").replace(/,\s*,/g, ",").trim()
}

/**
 * Time line: `h:mm AM/PM EDT` (minutes zero-padded; timezone shown as EDT per product standard).
 */
export const normalizeProgramsEventTime = (timePart: string): string => {
  let t = timePart.trim().replace(/\s+/g, " ")
  if (!t) return ""

  t = t.replace(/\b(Eastern|EST|ET)\b/gi, "").replace(/\s+/g, " ").trim()
  t = t.replace(/\b(EDT|PST|PDT|CST|CDT|PT|MT|MST|MDT)\b/gi, "").replace(/\s+/g, " ").trim()

  t = t.replace(/(\d)([AP]M)\b/gi, "$1 $2")

  const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*([AP]M)\b/i)
  if (!m) return `${t} EDT`.replace(/\s+/g, " ").trim()

  const hour = m[1] ?? "0"
  const minRaw = m[2]
  const ap = `${m[3] ?? ""}`.toUpperCase()
  const mm = minRaw !== undefined ? minRaw.padStart(2, "0") : "00"
  const h = parseInt(hour, 10)
  if (Number.isNaN(h)) return `${t} EDT`.trim()

  return `${h}:${mm} ${ap} EDT`
}

const splitProgramsEventDateTimeRaw = (raw: string): { datePart: string; timePart: string } => {
  const trimmed = raw.trim()
  if (!trimmed) return { datePart: "", timePart: "" }

  const normalized = trimmed
    .replace(/\s*[—–]\s*/g, CARD_DATE_TIME_SPLIT)
    .replace(/\s+at\s+/gi, CARD_DATE_TIME_SPLIT)

  const chunks = normalized.split(CARD_DATE_TIME_SPLIT).map((c) => c.trim()).filter(Boolean)

  let datePart: string
  let timePart: string

  if (chunks.length >= 2) {
    datePart = chunks[0] ?? ""
    timePart = chunks.slice(1).join(" ")
  } else {
    const one = chunks[0] ?? normalized
    const withClock = one.match(
      /^(.+?)\s+(\d{1,2}:\d{2}\s*(?:[AP]M)(?:\s+[A-Z]{2,5})?)$/i,
    )
    if (withClock) {
      datePart = withClock[1]?.trim() ?? ""
      timePart = withClock[2]?.trim() ?? ""
    } else {
      const ampmOnly = one.match(/^(.+?)\s+(\d{1,2}\s*[AP]M(?:\s+[A-Z]{2,5})?)$/i)
      if (ampmOnly) {
        datePart = ampmOnly[1]?.trim() ?? ""
        timePart = ampmOnly[2]?.trim() ?? ""
      } else {
        datePart = stripDayOrdinals(one.trim())
        timePart = ""
      }
    }
  }

  return { datePart, timePart }
}

/** Parsed calendar date and time for cards and event detail (long date + `h:mm AM/PM EDT`). */
export const parseProgramsEventDateTimeParts = (raw: string): { date: string; time: string } => {
  const { datePart, timePart } = splitProgramsEventDateTimeRaw(raw)
  const date = datePart ? normalizeProgramsEventCalendarDate(datePart) : ""
  const time = timePart ? normalizeProgramsEventTime(timePart) : ""
  return { date, time }
}

const IMAGE_BADGE_MONTH_TO_ABBR: Record<string, string> = {
  january: "JAN",
  february: "FEB",
  march: "MAR",
  april: "APR",
  may: "MAY",
  june: "JUN",
  july: "JUL",
  august: "AUG",
  september: "SEP",
  october: "OCT",
  november: "NOV",
  december: "DEC",
}

/** Month abbreviation + day for event card image corner (from normalized calendar date). */
export const getProgramsEventCardImageDateBadge = (raw: string): { month: string; day: string } | null => {
  const { date } = parseProgramsEventDateTimeParts(raw)
  if (!date) return null

  let match = date.match(
    /,\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})\b/i,
  )
  if (!match) {
    match = date.match(
      /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})\b/i,
    )
  }
  if (!match) return null

  const monthKey = (match[1] ?? "").toLowerCase()
  const abbr = IMAGE_BADGE_MONTH_TO_ABBR[monthKey]
  if (!abbr) return null

  return { month: abbr, day: (match[2] ?? "").padStart(2, "0") }
}

/** Month abbreviation + day for compact event card overlay (display string or `startsAt`). */
export const getProgramsEventCardDateBadgeFromEvent = (
  event: ProgramsEventCard,
): { month: string; day: string } | null => {
  const fromDisplay = getProgramsEventCardImageDateBadge(getProgramsEventDisplayDateTime(event))
  if (fromDisplay) return fromDisplay

  const startRaw = event.startsAt?.trim()
  if (!startRaw) return null

  const startMs = Date.parse(startRaw)
  if (!Number.isFinite(startMs)) return null

  const d = new Date(startMs)
  const monthLong = d.toLocaleDateString("en-US", {
    month: "long",
    timeZone: "America/New_York",
  })
  const abbr = IMAGE_BADGE_MONTH_TO_ABBR[monthLong.toLowerCase()]
  if (!abbr) return null

  const day = d.toLocaleDateString("en-US", {
    day: "numeric",
    timeZone: "America/New_York",
  })

  return { month: abbr, day: day.padStart(2, "0") }
}

const formatEasternTimeFromIso = (iso: string): string => {
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return ""
  const d = new Date(t)
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  })
}

/** Build display line from ISO instants, e.g. `Wednesday, May 27, 2026 — 6:00 PM - 8:30 PM EDT`. */
export const formatProgramsEventDateTimeFromInstants = (
  startsAt?: string,
  endsAt?: string,
): string => {
  const startRaw = startsAt?.trim()
  if (!startRaw) return ""

  const startMs = Date.parse(startRaw)
  if (!Number.isFinite(startMs)) return ""

  const d = new Date(startMs)
  const weekday = d.toLocaleDateString("en-US", { weekday: "long", timeZone: "America/New_York" })
  const month = d.toLocaleDateString("en-US", { month: "long", timeZone: "America/New_York" })
  const day = d.toLocaleDateString("en-US", { day: "numeric", timeZone: "America/New_York" })
  const year = d.toLocaleDateString("en-US", { year: "numeric", timeZone: "America/New_York" })
  const startTime = formatEasternTimeFromIso(startRaw)
  const endRaw = endsAt?.trim()
  const endTime = endRaw ? formatEasternTimeFromIso(endRaw) : ""
  const timeSegment =
    endTime && endTime !== startTime ? `${startTime} - ${endTime} EDT` : `${startTime} EDT`

  return `${weekday}, ${month} ${day}, ${year} — ${timeSegment}`
}

/** Prefer explicit display string, then ISO instants. */
export const getProgramsEventDisplayDateTime = (event: ProgramsEventCard): string => {
  const explicit = event.dateTime?.trim()
  if (explicit && !/^upcoming\s*[—–-]/i.test(explicit)) return explicit
  const fromInstants = formatProgramsEventDateTimeFromInstants(event.startsAt, event.endsAt)
  if (fromInstants) return fromInstants
  return explicit ?? ""
}

/** Single-line summary for cards: `Wednesday, April 9, 2025 — 2:00 PM EDT`. */
export const formatProgramsEventCardDateTime = (raw: string): string => {
  const { date } = parseProgramsEventDateTimeParts(raw)
  return date
}

/** Compact date for related-event cards: `Dec 27` (month abbreviated, day only). */
export const formatProgramsEventRelatedCardDate = (raw: string): string => {
  const badge = getProgramsEventCardImageDateBadge(raw)
  if (badge) {
    const month =
      badge.month.charAt(0) + badge.month.slice(1).toLowerCase()
    return `${month} ${parseInt(badge.day, 10)}`
  }

  const { date } = parseProgramsEventDateTimeParts(raw)
  if (!date) return ""

  const abbreviated = applyWeekdayMonthAbbreviations(date)
  const withWeekday = abbreviated.match(
    /^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+([A-Za-z]+)\s+(\d{1,2})\b/,
  )
  if (withWeekday?.[1] && withWeekday[2]) {
    return `${withWeekday[1]} ${parseInt(withWeekday[2], 10)}`
  }

  const monthDay = abbreviated.match(/^([A-Za-z]+)\s+(\d{1,2})\b/)
  if (monthDay?.[1] && monthDay[2]) {
    return `${monthDay[1]} ${parseInt(monthDay[2], 10)}`
  }

  return abbreviated.split(",")[0]?.trim() ?? abbreviated
}

/** Compact one-line for meta / subtitles (same canonical formatting as cards). */
export const shortenProgramsEventDateTime = (raw: string): string => {
  const { date, time } = parseProgramsEventDateTimeParts(raw)
  if (!date && !time) return ""
  if (!time) return date
  if (!date) return time
  return `${date} · ${time}`
}

/** Event detail hero: full weekday + month + day + year (no abbreviations). */
export const formatProgramsEventDetailDateExtended = (raw: string): string => {
  const date = parseProgramsEventDateTimeParts(raw).date
  if (!date) return ""
  return applyWeekdayMonthAbbreviations(date)
}

/**
 * Event detail hero: first line of the date block, e.g. `2:00 PM EST` (Eastern US label).
 */
export const formatProgramsEventDetailTimeEst = (raw: string): string => {
  const { time } = parseProgramsEventDateTimeParts(raw)
  if (!time) return ""
  const trimmed = time.trim()
  const clock = trimmed.match(/^(\d{1,2}:\d{2}\s*[AP]M)/i)
  if (clock?.[1]) return `${clock[1]} EST`
  const stripped = trimmed.replace(/\s+(EDT|EST|ET)\b/gi, "").trim()
  return stripped ? `${stripped} EST` : ""
}

/** Speaker headshot for event cards and detail — shared with `resolveEventHostImageSrc`. */
export const getProgramsEventSpeakerAvatarSrc = (event: ProgramsEventCard): string =>
  resolveEventHostImageSrc(event)

export const parseProgramsEventSpeaker = (person: string | undefined) => {
  const raw = (person ?? "").trim()
  if (!raw) return { speaker: "", company: "" }

  const separators = [" • ", " · ", " | ", " — ", " - ", ", "]
  const matched = separators.find((sep) => raw.includes(sep))
  if (!matched) return { speaker: raw, company: "" }

  const [speakerRaw, ...rest] = raw.split(matched)
  const speaker = (speakerRaw ?? "").trim()
  const company = rest.join(matched).trim()
  return { speaker, company }
}

export const getProgramsEventLocationLabel = (event: ProgramsEventCard) => {
  const v = event.location?.trim()
  return v && v.length > 0 ? v : PROGRAMS_EVENT_LOCATION_FALLBACK
}

/**
 * In-person detail layout: line 1 = venue / primary (before first comma when present);
 * line 2 = street + locality (e.g. `101 College St, Toronto`) using secondary styling.
 */
export const getProgramsEventLocationDetailLines = (
  event: ProgramsEventCard,
): { line1: string; line2: string | null } => {
  const raw = event.location?.trim() ?? ""
  if (!raw.length) {
    return { line1: PROGRAMS_EVENT_LOCATION_FALLBACK, line2: null }
  }

  const primaryComma = raw.indexOf(",")
  if (primaryComma === -1) {
    return { line1: raw, line2: null }
  }

  const line1 = raw.slice(0, primaryComma).trim()
  const rest = raw.slice(primaryComma + 1).trim()
  if (!line1.length) return { line1: rest.length ? rest : raw, line2: null }
  if (!rest.length) return { line1, line2: null }

  const line2 = rest.replace(/\s*·\s*/g, ", ").replace(/\s+/g, " ").trim()

  return { line1: line1.length ? line1 : raw, line2: line2.length ? line2 : null }
}

/** Whether the event is marketed as remote vs on-site, from the CMS `location` string. */
export const getProgramsEventAttendanceMode = (event: ProgramsEventCard): "virtual" | "inPerson" => {
  const v = event.location?.trim() ?? ""
  if (!v.length) return "virtual"
  const lower = v.toLowerCase()
  if (
    lower === "virtual" ||
    lower === "online" ||
    lower === "remote" ||
    lower.startsWith("virtual ") ||
    /^virtual\b/u.test(v) ||
    /^online\b/u.test(v) ||
    /^remote\b/u.test(v)
  ) {
    return "virtual"
  }
  return "inPerson"
}

/** Related-event card meta — date/time combined, location separate (avoids stacked middle dots). */
export type ProgramsEventRelatedCardMeta = {
  schedule: string
  location: string
}

export const getProgramsEventRelatedCardMeta = (
  event: ProgramsEventCard,
): ProgramsEventRelatedCardMeta => {
  const raw = getProgramsEventDisplayDateTime(event)
  const shortDate = formatProgramsEventRelatedCardDate(raw)
  let time = parseProgramsEventDateTimeParts(raw).time
  if (!time && event.startsAt?.trim()) {
    const eastern = formatEasternTimeFromIso(event.startsAt.trim())
    if (eastern) time = normalizeProgramsEventTime(eastern)
  }

  const schedule =
    shortDate && time ? `${shortDate}, ${time}` : shortDate || time || ""

  const attendance = getProgramsEventAttendanceMode(event)
  const location =
    attendance === "virtual"
      ? PROGRAMS_EVENT_LOCATION_FALLBACK
      : getProgramsEventLocationDetailLines(event).line1 || getProgramsEventLocationLabel(event)

  return { schedule, location }
}

/** @deprecated Use `getProgramsEventRelatedCardMeta` for structured schedule + location. */
export const formatProgramsEventRelatedCardMeta = (event: ProgramsEventCard): string => {
  const { schedule, location } = getProgramsEventRelatedCardMeta(event)
  return [schedule, location].filter(Boolean).join(MIDDLE_DOT_SEP)
}

/**
 * Google Maps search URL for an in-person venue (full `location` string).
 * Returns `null` for virtual events or empty location.
 */
export const getProgramsEventMapsSearchUrl = (event: ProgramsEventCard): string | null => {
  if (getProgramsEventAttendanceMode(event) !== "inPerson") return null
  const raw = event.location?.trim() ?? ""
  if (!raw.length) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw)}`
}

export { MIDDLE_DOT_SEP }
