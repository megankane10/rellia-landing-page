import { cn } from "@/lib/utils"
import type { EventTemporalPhase } from "@shared/cms/eventTemporalStatus"

type EventCardDateBadgeProps = {
  month: string
  day: string
  phase?: EventTemporalPhase
  className?: string
}

const formatBadgeDay = (day: string): string => {
  const trimmed = day.trim()
  if (/^\d+$/.test(trimmed)) return trimmed.padStart(2, "0")
  return trimmed
}

/** Solid brand plaque — opaque fill only (no glass / alpha washes). */
const BADGE_SURFACE_CLASS =
  "overflow-hidden rounded-xl bg-rellia-teal ring-1 ring-inset ring-white/20 shadow-[0_10px_28px_-8px_rgba(13,53,64,0.72)]"

const BADGE_SURFACE_PAST_CLASS =
  "overflow-hidden rounded-xl bg-[#0a2d36] ring-1 ring-inset ring-white/15 shadow-[0_10px_28px_-8px_rgba(10,45,54,0.72)]"

export const EventCardDateBadge = ({
  month,
  day,
  phase = "upcoming",
  className,
}: EventCardDateBadgeProps) => {
  const isPast = phase === "past"
  const dayDisplay = formatBadgeDay(day)

  return (
    <div
      className={cn(
        "pointer-events-none absolute right-2.5 top-2.5 z-20 flex aspect-square size-[4.25rem] flex-col items-center justify-center text-center sm:right-3 sm:top-3 sm:size-[4.75rem]",
        isPast ? BADGE_SURFACE_PAST_CLASS : BADGE_SURFACE_CLASS,
        className,
      )}
      aria-hidden
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-rellia-mint" aria-hidden />
      <span className="relative font-host-grotesk text-2xl font-bold leading-none tabular-nums text-white">
        {dayDisplay}
      </span>
      <span className="relative mt-1 font-host-grotesk text-xs font-bold uppercase tracking-[0.1em] text-white sm:text-[13px]">
        {month}
      </span>
    </div>
  )
}
