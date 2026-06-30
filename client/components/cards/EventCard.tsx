import { Calendar, History } from "lucide-react"
import { Link } from "react-router-dom"
import type { ProgramsEventCard } from "@shared/cms/types"
import {
  formatProgramsEventCardDateTime,
  getProgramsEventDisplayDateTime,
  getProgramsEventAttendanceMode,
  getProgramsEventSpeakerAvatarSrc,
  parseProgramsEventSpeaker,
} from "@shared/cms/programsEventDisplay"
import { programsEventDetailPath } from "@shared/cms/eventSlug"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"
import { cmsCleanText, cmsDisplayText } from "@/lib/cmsStega"
import { MarketingImage } from "@/components/MarketingImage"

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
 * Title area reserves three lines (line-clamp-3) at xl / 2xl body sizes.
 */
const EVENT_CARD_TITLE_DATE_SLOT_MIN_H =
  "min-h-[calc((0.875rem*1.375)+0.25rem+(1.25rem*1.375*3)+0.5rem+1.625rem)] sm:min-h-[calc((15px*1.375)+0.25rem+(1.5rem*1.375*3)+0.5rem+1.625rem)]"

const attendanceTagClassName =
  "inline-flex w-fit items-center gap-1 rounded-full border border-black/10 bg-white px-2.5 py-1 font-host-grotesk text-[9px] font-semibold uppercase tracking-[0.12em] text-black/60 sm:gap-1.5 sm:text-[10px] sm:tracking-[0.14em]"

const tagIconClassName = "h-3 w-3 shrink-0 opacity-90 sm:h-3.5 sm:w-3.5"

export const EventCard = ({
  event,
  variant,
  className,
}: EventCardProps) => {
  const speakerParts = parseProgramsEventSpeaker(event.person)
  const attendanceMode = getProgramsEventAttendanceMode(event)
  const detailHref = programsEventDetailPath(event)
  const dateTimeLine = formatProgramsEventCardDateTime(getProgramsEventDisplayDateTime(event))
  const personRaw = (event.person ?? "").trim()

  /** Matches Events page filters: Upcoming | Past */
  const tagLabel = variant === "past" ? "Past" : "Upcoming"
  const isPast = variant === "past"

  const speakerName = speakerParts.speaker || personRaw || ""
  const speakerCompany = speakerParts.company
  const hasSpeakerBlock = Boolean(speakerName)

  const avatarSrc = getProgramsEventSpeakerAvatarSrc(event)

  return (
    <article
      className={cn(
        "group flex h-full min-h-0 flex-col overflow-hidden rounded-[20px] p-2 border border-black/10 bg-white shadow-sm transition-all duration-500 ease-in hover:bg-black/[0.03] hover:shadow-md outline outline-1 outline-offset-[10px] outline-transparent hover:outline-rellia-teal/20",
        className,
      )}
    >
      {event.imageSrc ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black/5 shrink-0">
          <MarketingImage
            src={event.imageSrc}
            alt={cmsCleanText(event.title)}
            preset="contentCard"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
              variant === "past" && "opacity-90 saturate-[0.9]"
            )}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-rellia-teal/5 shrink-0 flex items-center justify-center">
          <Calendar className="h-12 w-12 text-rellia-teal/20" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 pb-6 md:p-6 md:pb-7">
        <div className="flex-1 flex flex-col gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex w-fit max-w-full shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-host-grotesk text-[9px] font-semibold uppercase tracking-[0.12em] ring-1 ring-black/5 sm:gap-1.5 sm:text-[10px] sm:tracking-[0.14em]",
                  isPast ? "bg-black/[0.06] text-black/65" : "bg-rellia-mint text-rellia-teal",
                )}
              >
                {isPast ? (
                  <History className="h-3 w-3 opacity-80 text-black/50" aria-hidden strokeWidth={2.25} />
                ) : (
                  <Calendar className="h-3 w-3 opacity-80 text-rellia-teal" aria-hidden strokeWidth={2.25} />
                )}
                {tagLabel}
              </span>
              {dateTimeLine ? (
                <span className="font-urbanist text-[11px] font-bold text-black/40 uppercase tracking-widest">
                  {dateTimeLine}
                </span>
              ) : null}
            </div>

            <h3 className="line-clamp-2 font-host-grotesk text-xl font-semibold leading-tight tracking-tight text-black group-hover:underline decoration-2 underline-offset-4">
              {cmsDisplayText(event.title)}
            </h3>
          </div>

          {hasSpeakerBlock ? (
            <div className="mt-auto pt-4 flex items-center gap-3 border-t border-black/5">
              <MarketingImage
                src={avatarSrc}
                alt=""
                decorative
                preset="avatar"
                className={cn(
                  "h-10 w-10 shrink-0 rounded-full border border-black/10 object-cover object-center",
                  variant === "past" && "opacity-90 saturate-[0.9]",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="font-host-grotesk text-sm font-normal leading-tight text-black/85 truncate">{cmsDisplayText(speakerName)}</p>
                {speakerCompany ? (
                  <p className="mt-0.5 font-urbanist text-xs font-normal leading-tight text-black/45 truncate">
                    {cmsDisplayText(speakerCompany)}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 pt-6">
          <RelliaAction
            asChild
            variant="mintCardTealFill"
            className="w-full h-[46px] text-sm font-bold"
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
