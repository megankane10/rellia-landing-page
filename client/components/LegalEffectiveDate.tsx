import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

type LegalEffectiveDateProps = {
  date: string
  className?: string
}

export const LegalEffectiveDate = ({ date, className }: LegalEffectiveDateProps) => {
  const trimmedDate = date.trim()
  if (!trimmedDate) return null

  return (
    <div
      className={cn(
        "mb-10 flex items-center gap-3 font-urbanist text-base leading-relaxed md:mb-12 md:gap-3.5 md:text-lg",
        className,
      )}
      role="note"
      aria-label={`Effective date ${trimmedDate}`}
    >
      <CalendarDays
        className="h-6 w-6 shrink-0 text-rellia-teal/70 md:h-7 md:w-7"
        aria-hidden
        strokeWidth={2.25}
      />
      <span className="text-black/55">Effective date</span>
      <span className="font-semibold text-rellia-teal">{trimmedDate}</span>
    </div>
  )
}
