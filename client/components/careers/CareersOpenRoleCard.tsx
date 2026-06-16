import { ChevronRight, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import type { CareersOpenRole } from "@shared/cms/types"
import { careersRoleDetailPath } from "@shared/cms/careersRoleShare"
import { cn } from "@/lib/utils"

/** Employment type — teal on white (matches production / main). */
export const roleEmploymentBadgeClass =
  "inline-flex shrink-0 items-center rounded-full border border-rellia-teal/25 bg-rellia-teal/10 px-3 py-1 font-urbanist text-sm font-semibold text-rellia-teal"

/** Location — neutral grey with map pin. */
export const roleLocationBadgeClass =
  "inline-flex max-w-full items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 font-urbanist text-sm text-black/65"

/** Mobile: card bleeds past section padding; inner px keeps title/chevron on the page margin (symmetric). */
export const roleCardBleedClass = "-mx-3 md:mx-0"
export const roleCardInnerPxClass = "px-3 md:px-7"

export const roleCardLinkClass =
  "group block overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-sm transition-all duration-300 hover:border-black/15 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2"

type CareersOpenRoleCardProps = {
  role: CareersOpenRole
  formatText?: (value: string) => string
  className?: string
  bleedOnMobile?: boolean
  compact?: boolean
}

const defaultFormatText = (value: string) => value

export const CareersOpenRoleCard = ({
  role,
  formatText = defaultFormatText,
  className,
  bleedOnMobile = false,
  compact = false,
}: CareersOpenRoleCardProps) => (
  <Link
    to={careersRoleDetailPath(role.id)}
    className={cn(roleCardLinkClass, bleedOnMobile && roleCardBleedClass, className)}
    aria-label={`View ${formatText(role.title)}`}
  >
    <span
      className={cn(
        "flex items-start gap-3 md:items-center",
        compact ? "gap-2.5 py-4 md:gap-3 md:py-5" : "gap-3 py-5 md:gap-4 md:py-6",
        roleCardInnerPxClass,
        compact ? "pr-4 md:pr-5" : "pr-4 md:pr-7",
      )}
    >
      <span className={cn("flex min-w-0 flex-1 flex-col text-left", compact ? "gap-2.5 md:gap-3" : "gap-3 md:gap-4")}>
        <span
          className={cn(
            "font-host-grotesk font-semibold leading-snug tracking-tight text-black transition-colors duration-300 group-hover:text-rellia-teal",
            compact ? "text-base md:text-lg" : "text-lg md:text-xl",
          )}
        >
          {formatText(role.title)}
        </span>

        <span className="flex flex-wrap items-center gap-2">
          <span className={roleEmploymentBadgeClass}>{formatText(role.employmentType)}</span>
          <span className={cn(roleLocationBadgeClass, "truncate")}>
            <MapPin className="h-3.5 w-3.5 shrink-0 text-rellia-teal" aria-hidden strokeWidth={2.25} />
            <span className="truncate">{formatText(role.location)}</span>
          </span>
        </span>
      </span>

      <ChevronRight
        className="mt-1 h-5 w-5 shrink-0 text-rellia-teal transition-transform duration-300 group-hover:translate-x-0.5 md:mt-0"
        aria-hidden
        strokeWidth={2.25}
      />
    </span>
  </Link>
)
