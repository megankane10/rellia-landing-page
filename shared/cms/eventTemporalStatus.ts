import type { ProgramsEventCard } from "./types"

const MONTH_TO_INDEX: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
}

const parseLooseDateTimeToTimestamp = (raw: string): number => {
  const s = raw.trim()
  if (!s) return Number.NaN

  const direct = Date.parse(s)
  if (Number.isFinite(direct)) return direct

  const m = s.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b\s+(\d{1,2})\b,\s*((?:19|20)\d{2})\b/i,
  )
  if (!m) return Number.NaN

  const monthIndex = MONTH_TO_INDEX[(m[1] ?? "").toLowerCase()]
  const day = Number(m[2] ?? "")
  const year = Number(m[3] ?? "")
  if (!Number.isFinite(monthIndex) || !Number.isFinite(day) || !Number.isFinite(year)) {
    return Number.NaN
  }

  return Date.UTC(year, monthIndex, day, 12, 0, 0)
}

/** Prefer ISO `startsAt` / `endsAt`; fall back to display `dateTime` strings. */
export const getEventStartTimestamp = (event: {
  startsAt?: string
  dateTime?: string
}): number => {
  const iso = event.startsAt?.trim()
  if (iso) {
    const t = Date.parse(iso)
    if (Number.isFinite(t)) return t
  }
  if (typeof event.dateTime === "string" && event.dateTime.trim()) {
    const t = parseLooseDateTimeToTimestamp(event.dateTime)
    if (Number.isFinite(t)) return t
  }
  return Number.NaN
}

export const getEventEndTimestamp = (event: {
  endsAt?: string
  startsAt?: string
  dateTime?: string
}): number => {
  const isoEnd = event.endsAt?.trim()
  if (isoEnd) {
    const t = Date.parse(isoEnd)
    if (Number.isFinite(t)) return t
  }
  return getEventStartTimestamp(event)
}

/**
 * Upcoming vs past is derived from CMS datetimes when available.
 * Manual `status` in Sanity is only used for visibility (`hidden`); upcoming/past comes from dates.
 */
export type EventTemporalInput = Pick<
  ProgramsEventCard,
  "startsAt" | "endsAt" | "dateTime" | "status"
>

export const getEventTemporalStatus = (event: EventTemporalInput): "upcoming" | "past" => {
  const endTs = getEventEndTimestamp(event)
  const startTs = getEventStartTimestamp(event)
  const compareTs = Number.isFinite(endTs) ? endTs : startTs

  if (Number.isFinite(compareTs)) {
    return compareTs < Date.now() ? "past" : "upcoming"
  }

  return "upcoming"
}

const DEFAULT_LIVE_WINDOW_MS = 2 * 60 * 60 * 1000

export type EventTemporalPhase = "past" | "live" | "upcoming"

/** Past / live (in progress) / upcoming — used for event card status badges. */
export const getEventTemporalPhase = (event: EventTemporalInput): EventTemporalPhase => {
  const now = Date.now()
  const startTs = getEventStartTimestamp(event)
  const explicitEndTs = event.endsAt?.trim() ? getEventEndTimestamp(event) : Number.NaN
  const endTs = Number.isFinite(explicitEndTs)
    ? explicitEndTs
    : Number.isFinite(startTs)
      ? startTs + DEFAULT_LIVE_WINDOW_MS
      : Number.NaN

  if (Number.isFinite(endTs) && endTs < now) return "past"
  if (Number.isFinite(startTs) && startTs <= now && Number.isFinite(endTs) && endTs >= now) {
    return "live"
  }
  if (Number.isFinite(startTs) && startTs > now) return "upcoming"

  return getEventTemporalStatus(event) === "past" ? "past" : "upcoming"
}
