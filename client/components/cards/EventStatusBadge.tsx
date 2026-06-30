import { cn } from "@/lib/utils"
import type { EventTemporalPhase } from "@shared/cms/eventTemporalStatus"

export const EVENT_CARD_BADGE_TEXT_CLASS =
  "font-host-grotesk text-[10px] font-bold uppercase tracking-[0.12em] sm:text-[11px] sm:tracking-[0.14em]"

const PHASE_LABEL: Record<EventTemporalPhase, string> = {
  past: "Past",
  upcoming: "Upcoming",
  live: "Live now",
}

type EventStatusBadgeProps = {
  phase: EventTemporalPhase
  className?: string
}

export const EventStatusBadge = ({ phase, className }: EventStatusBadgeProps) => {
  const isPast = phase === "past"
  const isLive = phase === "live"

  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5",
        EVENT_CARD_BADGE_TEXT_CLASS,
        isPast ? "text-black/45" : "text-rellia-teal",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          isPast && "bg-black/35",
          !isPast && "bg-rellia-teal",
          isLive && "animate-pulse",
        )}
        aria-hidden
      />
      {PHASE_LABEL[phase]}
    </span>
  )
}
