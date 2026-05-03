import { Link } from "react-router-dom"
import type { ProgramsEventCard } from "@shared/cms/types"
import {
  formatProgramsEventCardDateTime,
  getProgramsEventAttendanceMode,
  getProgramsEventLocationLabel,
  getProgramsEventSpeakerAvatarSrc,
  parseProgramsEventSpeaker,
} from "@shared/cms/programsEventDisplay"
import { programsEventDetailPath } from "@shared/cms/eventSlug"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"

export type EventCardProps = {
  event: ProgramsEventCard
  variant: "upcoming" | "past"
  className?: string
}

const eventKey = (event: ProgramsEventCard) =>
  `${event.title}-${event.dateTime}-${event.person}`

export { eventKey }

/**
 * Date + title + tags: min height keeps speaker rows aligned across cards in a grid.
 */
const EVENT_CARD_TITLE_DATE_SLOT_MIN_H =
  "min-h-[calc((0.875rem*1.375)+0.25rem+(1.25rem*1.375*2)+0.5rem+1.625rem)] sm:min-h-[calc((15px*1.375)+0.25rem+(1.5rem*1.375*2)+0.5rem+1.625rem)]"

const attendanceTagClassName =
  "inline-flex w-fit items-center rounded-full border border-black/10 bg-white px-2.5 py-1 font-host-grotesk text-[9px] font-semibold uppercase tracking-[0.12em] text-black/60 sm:text-[10px] sm:tracking-[0.14em]"

export const EventCard = ({
  event,
  variant,
  className,
}: EventCardProps) => {
  const isWaitlistEvent =
    variant === "upcoming" &&
    (Boolean(event.comingSoon) || !Boolean(event.href && event.href.trim().length > 0))
  const speakerParts = parseProgramsEventSpeaker(event.person)
  const locationLabel = getProgramsEventLocationLabel(event)
  const attendanceMode = getProgramsEventAttendanceMode(event)
  const detailHref = programsEventDetailPath(event)
  const dateTimeLine = formatProgramsEventCardDateTime(event.dateTime ?? "")
  const personRaw = (event.person ?? "").trim()

  const tagLabel =
    variant === "past" ? "Past event" : isWaitlistEvent ? "Waitlist" : "Upcoming"
  const tagIsMint = variant === "upcoming" && !isWaitlistEvent

  const speakerName = speakerParts.speaker || personRaw || ""
  const speakerCompany = speakerParts.company
  const hasSpeakerBlock = Boolean(speakerName)

  const avatarSrc = getProgramsEventSpeakerAvatarSrc(event)

  return (
    <article
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4">
        <div className={cn("flex shrink-0 flex-col", EVENT_CARD_TITLE_DATE_SLOT_MIN_H)}>
          <div className="shrink-0 space-y-1">
            {dateTimeLine ? (
              <p className="font-urbanist text-sm font-normal leading-snug text-black/50 sm:text-[15px]">{dateTimeLine}</p>
            ) : null}
            <h3 className="line-clamp-2 font-host-grotesk text-xl font-semibold leading-snug tracking-tight text-black sm:text-2xl sm:leading-snug">
              {event.title}
            </h3>
          </div>
          <div className="mt-2 flex shrink-0 flex-wrap items-center gap-2">
            {isWaitlistEvent ? (
              <span className="inline-flex w-fit items-center rounded-full border border-black/10 bg-black/[0.06] px-2.5 py-1 font-host-grotesk text-[9px] font-semibold uppercase tracking-[0.12em] text-black/70 sm:text-[10px] sm:tracking-[0.14em]">
                <span className="mr-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black/40" aria-hidden />
                Waitlist
              </span>
            ) : (
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 font-host-grotesk text-[9px] font-semibold uppercase tracking-[0.12em] ring-1 ring-black/5 sm:text-[10px] sm:tracking-[0.14em]",
                  tagIsMint ? "bg-rellia-mint text-rellia-teal" : "bg-black/[0.06] text-black/65",
                )}
              >
                <span
                  className={cn("h-1.5 w-1.5 shrink-0 rounded-full", tagIsMint ? "bg-rellia-teal" : "bg-black/40")}
                  aria-hidden
                />
                {tagLabel}
              </span>
            )}
            <span className={attendanceTagClassName}>
              {attendanceMode === "virtual" ? "Virtual" : "In person"}
            </span>
          </div>
          <div className="min-h-0 flex-1" aria-hidden />
        </div>

        {hasSpeakerBlock ? (
          <div className="flex shrink-0 items-start gap-3 md:gap-3.5">
            <img
              src={avatarSrc}
              alt=""
              className={cn(
                "h-12 w-12 shrink-0 rounded-lg border border-black/10 object-cover object-center",
                (variant === "past" || isWaitlistEvent) && "opacity-90 saturate-[0.9]",
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="font-host-grotesk text-base font-medium leading-snug text-black">{speakerName}</p>
              {speakerCompany ? (
                <p className="mt-0.5 font-urbanist text-sm font-normal leading-snug text-black/55">{speakerCompany}</p>
              ) : null}
            </div>
          </div>
        ) : null}
        {attendanceMode === "inPerson" ? (
          <p className="shrink-0 font-urbanist text-xs font-normal leading-snug text-black/55 sm:text-[13px]">{locationLabel}</p>
        ) : null}
        </div>

        <div className="shrink-0 pt-5 sm:pt-6">
          <RelliaAction
            asChild
            variant="outlineOnWhite"
            size="compact"
            className="w-full cursor-pointer px-4 py-2.5 text-xs sm:text-sm"
          >
            <Link to={detailHref} className="cursor-pointer">
              View event
            </Link>
          </RelliaAction>
        </div>
      </div>
    </article>
  )
}
