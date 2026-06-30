import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { placeholderImageFromSeed } from "@/lib/placeholderImages"
import { cmsCleanText, cmsDisplayText } from "@/lib/cmsStega"
import {
  getProgramsEventCardDateBadgeFromEvent,
  getProgramsEventSpeakerAvatarSrc,
  parseProgramsEventSpeaker,
} from "@shared/cms/programsEventDisplay"
import {
  RELATED_COMPACT_CARD_HOVER_CLASS,
  RELATED_COMPACT_CARD_INSET_CLASS,
  RELATED_COMPACT_EVENT_CONTENT_CLASS,
  RELATED_COMPACT_EVENT_IMAGE_CLASS,
  RELATED_COMPACT_TITLE_CLASS,
} from "@/components/related/relatedCompactGrid"
import { programsEventDetailPath } from "@shared/cms/eventSlug"
import type { ProgramsEventCard } from "@shared/cms/types"
import { getEventTemporalPhase } from "@shared/cms/eventTemporalStatus"
import { EventCardDateBadge } from "@/components/cards/EventCardDateBadge"
import { EventStatusBadge } from "@/components/cards/EventStatusBadge"

export type EventCompactCardProps = {
  event: ProgramsEventCard
  className?: string
}

export const EventCompactCard = ({ event, className }: EventCompactCardProps) => {
  const detailHref = programsEventDetailPath(event)
  const phase = getEventTemporalPhase(event)
  const isPast = phase === "past"
  const speakerParts = parseProgramsEventSpeaker(event.person)
  const personRaw = (event.person ?? "").trim()
  const speakerName = speakerParts.speaker || personRaw || ""
  const speakerCompany = speakerParts.company
  const hasSpeakerBlock = Boolean(speakerName)
  const avatarSrc = getProgramsEventSpeakerAvatarSrc(event)
  const imageSrc = event.imageSrc?.trim()
    ? event.imageSrc
    : placeholderImageFromSeed(cmsCleanText(event.slug || event.title), 720, 720)
  const dateBadge = getProgramsEventCardDateBadgeFromEvent(event)

  return (
    <article className={cn("w-full", className)}>
      <Link
        to={detailHref}
        className={cn(
          "group flex w-full flex-col rounded-2xl",
          RELATED_COMPACT_CARD_INSET_CLASS,
          RELATED_COMPACT_CARD_HOVER_CLASS,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2",
        )}
        aria-label={`View ${cmsCleanText(event.title)}`}
      >
        <div className={cn(RELATED_COMPACT_EVENT_IMAGE_CLASS, "isolate bg-black/[0.03]")}>
          <img
            src={imageSrc}
            alt={cmsCleanText(event.title)}
            className={cn(
              "relative z-0 h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]",
              isPast && "opacity-90 saturate-[0.92]",
            )}
            loading="lazy"
          />
          {dateBadge ? (
            <EventCardDateBadge month={dateBadge.month} day={dateBadge.day} phase={phase} />
          ) : null}
        </div>

        <div className={RELATED_COMPACT_EVENT_CONTENT_CLASS}>
          <div className="mb-2">
            <EventStatusBadge phase={phase} />
          </div>

          <h3 className={cn(RELATED_COMPACT_TITLE_CLASS, "mt-0")}>{cmsDisplayText(event.title)}</h3>

          {hasSpeakerBlock ? (
            <div className="mt-3 flex items-center gap-3.5 md:mt-3.5">
              <img
                src={avatarSrc}
                alt=""
                className={cn(
                  "h-11 w-11 shrink-0 rounded-full border border-black/10 object-cover object-center sm:h-12 sm:w-12",
                  isPast && "opacity-90 saturate-[0.9]",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-host-grotesk text-[15px] font-normal leading-tight text-black/85 sm:text-base">
                  {cmsDisplayText(speakerName)}
                </p>
                {speakerCompany ? (
                  <p className="mt-0.5 truncate font-urbanist text-sm font-normal leading-snug text-black/50 sm:text-[15px]">
                    {cmsDisplayText(speakerCompany)}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  )
}

export default EventCompactCard
