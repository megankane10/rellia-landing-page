import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"

/** Transparent blur pill for badges over photography (matches NetworkMetricsSection). */
export const PILL_ON_IMAGE_BLUR_CLASS =
  "border border-white/20 bg-black/25 shadow-none backdrop-blur-2xl"

type PillTagProps = {
  /** Raw CMS string — stega preserved for Presentation click-to-edit. */
  label: string
  dot?: ReactNode
  className?: string
  labelClassName?: string
}

export default function PillTag({ label, dot, className, labelClassName }: PillTagProps) {
  const previewMode = isVisualEditingPreview()

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
          "font-host-grotesk text-xs font-semibold tracking-[0.18em] text-white",
          !previewMode && "uppercase",
          labelClassName,
        )}
      >
        {cmsDisplayText(label)}
      </span>
    </div>
  )
}
