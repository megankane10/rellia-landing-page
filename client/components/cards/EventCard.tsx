import { ExternalLink, User } from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import type { ProgramsEventCard } from "@shared/cms/types"
import { cn } from "@/lib/utils"

export type EventCardProps = {
  event: ProgramsEventCard
  variant: "upcoming" | "past"
  className?: string
}

const eventKey = (event: ProgramsEventCard) =>
  `${event.title}-${event.dateTime}-${event.person}`

export { eventKey }

export const EventCard = ({
  event,
  variant,
  className,
}: EventCardProps) => {
  const isWaitlistEvent =
    variant === "upcoming" &&
    (Boolean(event.comingSoon) || !Boolean(event.href && event.href.trim().length > 0))
  const primaryLabel = isWaitlistEvent ? "Join waitlist" : variant === "upcoming" ? "Register on Luma" : "View on Luma"
  const buttonDisabled = !event.href || event.href.trim().length === 0
  const speakerParts = (() => {
    const raw = (event.person ?? "").trim()
    if (!raw) return { speaker: "", company: "" }

    const separators = [" • ", " · ", " | ", " — ", " - ", ", "]
    const matched = separators.find((sep) => raw.includes(sep))
    if (!matched) return { speaker: raw, company: "" }

    const [speakerRaw, ...rest] = raw.split(matched)
    const speaker = (speakerRaw ?? "").trim()
    const company = rest.join(matched).trim()
    return { speaker, company }
  })()
  const dateParts = (() => {
    const raw = (event.dateTime ?? "").trim()
    const monthMatch = raw.match(
      /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\b/i,
    )
    const monthToken = (monthMatch?.[1] ?? "").trim()
    const monthLabel = monthToken ? monthToken.slice(0, 3).toUpperCase() : ""

    const afterMonth = monthMatch
      ? raw.slice((monthMatch.index ?? 0) + monthMatch[0].length)
      : raw
    const dayMatch = afterMonth.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/i) ?? raw.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/i)
    const day = (dayMatch?.[1] ?? "").trim()
    const dayLabel = day ? day.padStart(2, "0") : ""

    return { monthLabel, dayLabel, fallback: raw }
  })()

  return (
    <div
      className={cn(
        "flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-rellia-teal/5">
        <img
          src={event.imageSrc}
          alt={variant === "past" ? event.person : event.title}
          className={cn(
            "h-full w-full object-cover",
            (variant === "past" || isWaitlistEvent) && "grayscale-[0.25] saturate-[0.85] opacity-[0.92]",
          )}
        />

        {variant === "past" || isWaitlistEvent ? (
          <div className="absolute left-3 top-3 z-10">
            <span className="inline-flex items-center rounded-full border border-white/25 bg-black/35 px-3 py-1.5 font-host-grotesk text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md">
              {variant === "past" ? "Event Concluded" : "Waitlist"}
            </span>
          </div>
        ) : null}

        <div className="absolute right-3 top-3 z-10">
          <div
            className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border border-white/25 bg-black/20 text-white backdrop-blur-md"
            aria-label={dateParts.fallback}
          >
            {dateParts.monthLabel && dateParts.dayLabel ? (
              <>
                <span className="font-host-grotesk text-[11px] font-extrabold tracking-[0.16em] opacity-90">
                  {dateParts.monthLabel}
                </span>
                <span className="-mt-0.5 font-host-grotesk text-lg font-bold leading-none">
                  {dateParts.dayLabel}
                </span>
              </>
            ) : (
              <span className="px-2 text-center font-urbanist text-[11px] font-semibold leading-tight">
                {dateParts.fallback}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-col gap-2 font-urbanist text-sm text-black/60">
          <p className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0 text-rellia-mint" />
            <span className="line-clamp-1 text-black/70">
              {speakerParts.speaker || event.person}
              {speakerParts.company ? (
                <span className="text-black/45">
                  {" "}
                  | {speakerParts.company}
                </span>
              ) : null}
            </span>
          </p>
        </div>

        <h4 className="mb-5 h-[3.05rem] font-host-grotesk text-lg font-bold leading-snug text-black line-clamp-2">
          {event.title}
        </h4>

        <div className="mt-auto">
          {buttonDisabled ? (
            <button
              type="button"
              disabled
              aria-disabled
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-black/5 px-4 text-sm font-semibold text-black/30"
            >
              {primaryLabel}
            </button>
          ) : (
            <RelliaAction asChild variant="mintCardTealFill" size="compact">
              <a href={event.href} target="_blank" rel="noopener noreferrer">
                <span className="inline-flex items-center justify-center gap-2">
                  {primaryLabel} <ExternalLink className="h-4 w-4" />
                </span>
              </a>
            </RelliaAction>
          )}
        </div>
      </div>
    </div>
  )
}
