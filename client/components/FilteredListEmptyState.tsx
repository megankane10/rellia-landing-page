import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type FilteredListEmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

/** Centered empty state with large teal icon — matches the past-event block on {@link EventDetail}. */
const FilteredListEmptyState = ({ icon: Icon, title, description, className }: FilteredListEmptyStateProps) => (
  <div className={cn("py-6 text-center md:py-10", className)} role="status" aria-live="polite">
    <div className="mb-6 flex justify-center md:mb-8" aria-hidden>
      <Icon className="h-16 w-16 text-rellia-teal md:h-24 md:w-24" strokeWidth={1.15} />
    </div>
    <p className="font-host-grotesk text-3xl font-bold leading-tight text-black md:text-4xl md:leading-tight">{title}</p>
    <p className="mx-auto mt-5 max-w-[480px] font-urbanist text-base text-black/60 md:text-lg">{description}</p>
  </div>
)

export default FilteredListEmptyState
