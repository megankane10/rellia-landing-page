import { cn } from "@/lib/utils"
import { CAREERS_VOLUNTEER_ENABLED, careersHasPublishedOpenRoles } from "@shared/careersPageConfig"

type CareersHiringBadgeProps = {
  className?: string
}

const badgeClassName =
  "inline-flex shrink-0 items-center justify-center rounded-sm bg-rellia-mint px-2 py-0.5 font-host-grotesk font-bold uppercase tracking-normal text-rellia-teal"

/** Mint pills next to Careers — hiring and/or volunteer when each mode is enabled */
export const CareersHiringBadge = ({ className }: CareersHiringBadgeProps) => {
  const showHiring = careersHasPublishedOpenRoles()
  const showVolunteer = CAREERS_VOLUNTEER_ENABLED

  if (!showHiring && !showVolunteer) return null

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1", className)}>
      {showHiring ? (
        <span className={cn(badgeClassName, "text-[10px]")} aria-hidden>
          HIRING
        </span>
      ) : null}
      {showVolunteer ? (
        <span className={cn(badgeClassName, "text-[10px]")} aria-hidden>
          VOLUNTEER
        </span>
      ) : null}
    </span>
  )
}
