import { cn } from "@/lib/utils"
import { isProductionHostname } from "@/lib/sanity"
import { CAREERS_VOLUNTEER_ENABLED, careersHasPublishedOpenRoles } from "@shared/careersPageConfig"

type CareersHiringBadgeProps = {
  className?: string
}

const badgeClassName =
  "inline-flex shrink-0 items-center justify-center rounded-sm bg-rellia-mint px-2 py-0.5 font-host-grotesk font-bold uppercase tracking-normal text-rellia-teal"

/** Mint pills next to Careers — hiring and/or volunteer when each mode is enabled */
export const CareersHiringBadge = ({ className }: CareersHiringBadgeProps) => {
  return null
}
