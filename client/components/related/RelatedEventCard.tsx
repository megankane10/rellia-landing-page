import { Calendar, History } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { placeholderImageFromSeed } from "@/lib/placeholderImages"
import { cmsCleanText, cmsDisplayText } from "@/lib/cmsStega"
import {
  getProgramsEventRelatedCardMeta,
  getProgramsEventSpeakerAvatarSrc,
  parseProgramsEventSpeaker,
} from "@shared/cms/programsEventDisplay"
import {
  RELATED_COMPACT_BADGE_CLASS,
  RELATED_COMPACT_BADGE_ROW_CLASS,
  RELATED_COMPACT_CARD_HOVER_CLASS,
  RELATED_COMPACT_CARD_INSET_CLASS,
  RELATED_COMPACT_EVENT_CONTENT_CLASS,
  RELATED_COMPACT_IMAGE_CLASS,
  RELATED_COMPACT_META_CLASS,
  RELATED_COMPACT_EVENT_SCHEDULE_CLASS,
  RELATED_COMPACT_TITLE_CLASS,
} from "@/components/related/relatedCompactGrid"
import { programsEventDetailPath } from "@shared/cms/eventSlug"
import type { ProgramsEventCard } from "@shared/cms/types"

type RelatedEventCardProps = {
  event: ProgramsEventCard
  variant?: "upcoming" | "past"
}

const RelatedEventCard = ({ event, variant = "upcoming" }: RelatedEventCardProps) => {
  const detailHref = programsEventDetailPath(event)
  const { schedule, location } = getProgramsEventRelatedCardMeta(event)
  const hasEventMeta = Boolean(schedule || location)
  const speakerParts = parseProgramsEventSpeaker(event.person)
  const personRaw = (event.person ?? "").trim()
  const speakerName = speakerParts.speaker || personRaw || ""
  const speakerCompany = speakerParts.company
  const hasSpeakerBlock = Boolean(speakerName)
  const avatarSrc = getProgramsEventSpeakerAvatarSrc(event)
  const imageSrc = event.imageSrc?.trim()
    ? event.imageSrc
    : placeholderImageFromSeed(cmsCleanText(event.slug || event.title), 720, 720)
  const isPast = variant === "past"

  return (
    <article className="w-full">
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
        <div className={cn(RELATED_COMPACT_IMAGE_CLASS, "bg-black/5")}>
          <img
            src={imageSrc}
            alt={cmsCleanText(event.title)}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
              isPast && "opacity-90 saturate-[0.92]",
            )}
            loading="lazy"
          />
        </div>

        <div className={RELATED_COMPACT_EVENT_CONTENT_CLASS}>
          <div className={RELATED_COMPACT_BADGE_ROW_CLASS}>
            <span
              className={cn(
                RELATED_COMPACT_BADGE_CLASS,
                isPast ? "bg-black/[0.06] text-black/65" : "bg-rellia-mint text-rellia-teal",
              )}
            >
              {isPast ? (
                <History className="h-3 w-3 opacity-90" aria-hidden strokeWidth={2.25} />
              ) : (
                <Calendar className="h-3 w-3 opacity-90" aria-hidden strokeWidth={2.25} />
              )}
              {isPast ? "Past" : "Upcoming"}
            </span>
            {hasEventMeta ? (
              <span className="inline-flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5">
                {schedule ? (
                  <span className={RELATED_COMPACT_EVENT_SCHEDULE_CLASS}>{schedule}</span>
                ) : null}
                {schedule && location ? (
                  <span className="text-black/35" aria-hidden>
                    ·
                  </span>
                ) : null}
                {location ? <span className={RELATED_COMPACT_META_CLASS}>{location}</span> : null}
              </span>
            ) : null}
          </div>

          <h3 className={RELATED_COMPACT_TITLE_CLASS}>{cmsDisplayText(event.title)}</h3>

          {hasSpeakerBlock ? (
            <div className="mt-2.5 flex items-center gap-2.5 md:mt-3">
              <img
                src={avatarSrc}
                alt=""
                className={cn(
                  "h-8 w-8 shrink-0 rounded-full border border-black/10 object-cover object-center",
                  isPast && "opacity-90 saturate-[0.9]",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-host-grotesk text-xs font-medium leading-tight text-black md:text-sm">
                  {cmsDisplayText(speakerName)}
                </p>
                {speakerCompany ? (
                  <p className="mt-0.5 truncate font-urbanist text-[11px] font-normal leading-tight text-black/45 md:text-xs">
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

export default RelatedEventCard
