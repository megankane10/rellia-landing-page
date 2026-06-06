import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Transparent blur pill for badges over photography (matches NetworkMetricsSection). */
export const PILL_ON_IMAGE_BLUR_CLASS =
  "border border-white/20 bg-black/25 shadow-none backdrop-blur-2xl"

type PillTagProps = {
  label: string
  dot?: ReactNode
  className?: string
  labelClassName?: string
}

export default function PillTag({ label, dot, className, labelClassName }: PillTagProps) {
  return (
    <div
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border border-white/20",
        "bg-white/12 px-4 py-2 shadow-sm backdrop-blur-md",
        className,
      )}
    >
      {dot ?? <span className="h-2 w-2 shrink-0 rounded-full bg-rellia-mint" aria-hidden />}
      <span
        className={cn(
          "font-host-grotesk text-xs font-semibold uppercase tracking-[0.18em] text-white",
          labelClassName,
        )}
      >
        {label}
      </span>
    </div>
  )
}

