import { Calendar, History } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { placeholderImageFromSeed } from "@/lib/placeholderImages"
import { cmsCleanText, cmsDisplayText } from "@/lib/cmsStega"
import { getProgramsEventRelatedCardMeta } from "@shared/cms/programsEventDisplay"
import {
  RELATED_COMPACT_BADGE_CLASS,
  RELATED_COMPACT_BADGE_ROW_CLASS,
  RELATED_COMPACT_CARD_HOVER_CLASS,
  RELATED_COMPACT_CONTENT_CLASS,
  RELATED_COMPACT_IMAGE_CLASS,
  RELATED_COMPACT_META_CLASS,
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
  const metaBesideBadge = [schedule, location].filter(Boolean).join(" · ")
  const imageSrc = event.imageSrc?.trim()
    ? event.imageSrc
    : placeholderImageFromSeed(cmsCleanText(event.slug || event.title), 720, 720)
  const isPast = variant === "past"

  return (
    <article className="h-full w-full">
      <Link
        to={detailHref}
        className={cn(
          "group flex h-full w-full flex-col overflow-hidden rounded-2xl",
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

        <div className={RELATED_COMPACT_CONTENT_CLASS}>
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
            {metaBesideBadge ? (
              <span className={RELATED_COMPACT_META_CLASS}>{metaBesideBadge}</span>
            ) : null}
          </div>

          <h3 className={RELATED_COMPACT_TITLE_CLASS}>{cmsDisplayText(event.title)}</h3>
        </div>
      </Link>
    </article>
  )
}

export default RelatedEventCard
