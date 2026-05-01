import { cn } from "@/lib/utils"
import { hasOpenCareersRoles } from "@shared/careersOpenRoles"

type CareersHiringBadgeProps = {
  className?: string
}

/** Mint pill with teal “HIRING” — only renders when `CAREERS_OPEN_ROLES` is non-empty */
export const CareersHiringBadge = ({ className }: CareersHiringBadgeProps) => {
  if (!hasOpenCareersRoles()) return null

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-sm bg-rellia-mint px-2 py-0.5 font-host-grotesk text-[10px] font-bold uppercase tracking-normal text-rellia-teal",
        className,
      )}
      aria-hidden
    >
      HIRING
    </span>
  )
}
