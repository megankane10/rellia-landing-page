import { Bell, Calendar, CalendarDays } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { getCurrentMonthDeadline } from "@/lib/dateUtils"
import { placeholderImageFromSeed } from "@/lib/placeholderImages"
import { cmsCleanText, cmsDisplayText } from "@/lib/cmsStega"
import { isProgramUpcoming, isProgramWaitlist } from "@shared/cms/programStatus"
import {
  RELATED_COMPACT_BADGE_CLASS,
  RELATED_COMPACT_BADGE_ROW_CLASS,
  RELATED_COMPACT_CARD_HOVER_CLASS,
  RELATED_COMPACT_CONTENT_CLASS,
  RELATED_COMPACT_DEADLINE_CLASS,
  RELATED_COMPACT_DEADLINE_TEXT_CLASS,
  RELATED_COMPACT_IMAGE_CLASS,
  RELATED_COMPACT_TITLE_CLASS,
} from "@/components/related/relatedCompactGrid"
import type { ProgramsProgramCard } from "@shared/cms/types"

type RelatedProgramCardProps = {
  program: ProgramsProgramCard
}

const RelatedProgramCard = ({ program }: RelatedProgramCardProps) => {
  const href = cmsCleanText(program.href)
  const isUpcomingStatus = isProgramUpcoming(program)
  const isWaitlistCard = isProgramWaitlist(program) && !isUpcomingStatus
  const imageSrc = program.imageSrc?.trim()
    ? program.imageSrc
    : placeholderImageFromSeed(cmsCleanText(program.title), 720, 720)
  const deadline = cmsDisplayText(program.deadline) || getCurrentMonthDeadline()

  const inner = (
    <>
      <div className={cn(RELATED_COMPACT_IMAGE_CLASS, "bg-rellia-teal/5")}>
        <img
          src={imageSrc}
          alt={cmsCleanText(program.title)}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className={RELATED_COMPACT_CONTENT_CLASS}>
        <div className={RELATED_COMPACT_BADGE_ROW_CLASS}>
          <span
            className={cn(
              RELATED_COMPACT_BADGE_CLASS,
              !isWaitlistCard ? "bg-rellia-mint text-rellia-teal" : "bg-black/[0.04] text-black/65",
            )}
          >
            {isWaitlistCard ? (
              <>
                <Bell className="h-3 w-3 opacity-80" aria-hidden strokeWidth={2.5} />
                Join the waitlist
              </>
            ) : (
              <>
                <Calendar className="h-3 w-3 opacity-80" aria-hidden strokeWidth={2.5} />
                Applications open
              </>
            )}
          </span>
        </div>

        <h3 className={RELATED_COMPACT_TITLE_CLASS}>{cmsDisplayText(program.title)}</h3>

        {!isWaitlistCard ? (
          <div className={RELATED_COMPACT_DEADLINE_CLASS}>
            <CalendarDays className="h-5 w-5 shrink-0 text-rellia-teal md:h-6 md:w-6" strokeWidth={2.25} aria-hidden />
            <span className={RELATED_COMPACT_DEADLINE_TEXT_CLASS}>DEADLINE: {deadline}</span>
          </div>
        ) : null}
      </div>
    </>
  )

  if (!href) {
    return (
      <article className="h-full w-full">
        <div className={cn("group flex h-full w-full flex-col rounded-2xl", RELATED_COMPACT_CARD_HOVER_CLASS)}>
          {inner}
        </div>
      </article>
    )
  }

  return (
    <article className="h-full w-full">
      <Link
        to={href}
        className={cn(
          "group flex h-full w-full flex-col overflow-hidden rounded-2xl",
          RELATED_COMPACT_CARD_HOVER_CLASS,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2",
        )}
        aria-label={`View ${cmsCleanText(program.title)}`}
      >
        {inner}
      </Link>
    </article>
  )
}

export default RelatedProgramCard
