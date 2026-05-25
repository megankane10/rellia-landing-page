import type { ProgramsEventCard } from "@shared/cms/types"
import { DEFAULT_HOME_PAGE } from "./defaults"

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

  let normalized = trimmed
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

/** Extra portrait paths not duplicated on the home testimonials list (carousel uses `.jpg` for Melissa). */
const PROGRAMS_EVENT_SPEAKER_EXTRA_AVATARS = ["/images/testimonials-melissaW.jpg"] as const

const buildProgramsEventSpeakerAvatarPool = (): readonly string[] => {
  const fromHome = DEFAULT_HOME_PAGE.testimonials
    .map((t) => t.imageSrc.trim())
    .filter((src) => src.length > 0)
  const merged = [...fromHome, ...PROGRAMS_EVENT_SPEAKER_EXTRA_AVATARS]
  const unique = Array.from(new Set(merged))
  return unique.length > 0 ? unique : [...PROGRAMS_EVENT_SPEAKER_EXTRA_AVATARS]
}

const PROGRAMS_EVENT_SPEAKER_AVATAR_POOL = buildProgramsEventSpeakerAvatarPool()

const RELLIA_HEALTH_SPEAKER_RE = /rellia\s*health/i

const DR_SABINA_NAGPAL_SPEAKER_RE = /dr\.?\s*sabina|sabina.*nagpal/i
const MAZHAR_TESTIMONIAL_PORTRAIT = "/images/testimonials-MazharS.jpeg"

const BRENTON_HILL_SPEAKER_RE = /brenton\s*hill/i
const BRENTON_HILL_EVENT_PORTRAIT = "/images/testimonials-nickS.jpeg"

const AI_COLLECTIVE_HOST_RE = /ai\s*collective/i
const AI_COLLECTIVE_HOST_LOGO = "/images/logo-aicollective.jpg"

const hashProgramsEventKey = (key: string): number => {
  let h = 0
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) | 0
  }
  return h
}

/**
 * Speaker headshot for event cards and detail — stable hash into home testimonial portraits (+ Melissa `.jpg`),
 * `/favicon.ico` when Rellia-branded, or Mazhar’s testimonial portrait for Dr. Sabina Nagpal’s event.
 */
export const getProgramsEventSpeakerAvatarSrc = (event: ProgramsEventCard): string => {
  const parts = parseProgramsEventSpeaker(event.person)
  const speaker = (parts.speaker || (event.person ?? "").trim()).trim()
  const company = parts.company.trim()
  const personRaw = (event.person ?? "").trim()
  if (
    RELLIA_HEALTH_SPEAKER_RE.test(speaker) ||
    RELLIA_HEALTH_SPEAKER_RE.test(company) ||
    RELLIA_HEALTH_SPEAKER_RE.test(personRaw)
  ) {
    return "/favicon.ico"
  }
  const isDrSabinaNagpalEvent =
    event.slug === "leadership-under-pressure" ||
    (DR_SABINA_NAGPAL_SPEAKER_RE.test(speaker) && /\bNagpal\b/i.test(speaker)) ||
    DR_SABINA_NAGPAL_SPEAKER_RE.test(personRaw)
  if (isDrSabinaNagpalEvent) {
    return MAZHAR_TESTIMONIAL_PORTRAIT
  }
  const isBrentonHillEvent =
    event.slug === "why-healthcare-says-no-to-your-ai" ||
    BRENTON_HILL_SPEAKER_RE.test(speaker) ||
    BRENTON_HILL_SPEAKER_RE.test(personRaw)
  if (isBrentonHillEvent) {
    return BRENTON_HILL_EVENT_PORTRAIT
  }
  const isAiCollectiveHost =
    event.slug === "ai-healthcare-compliance" ||
    AI_COLLECTIVE_HOST_RE.test(speaker) ||
    AI_COLLECTIVE_HOST_RE.test(company) ||
    AI_COLLECTIVE_HOST_RE.test(personRaw)
  if (isAiCollectiveHost) {
    return AI_COLLECTIVE_HOST_LOGO
  }
  const key = `${event.title}-${getProgramsEventDisplayDateTime(event)}-${event.person}`
  const pool = PROGRAMS_EVENT_SPEAKER_AVATAR_POOL
  const idx = Math.abs(hashProgramsEventKey(key)) % pool.length
  return pool[idx] ?? pool[0]
}

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
