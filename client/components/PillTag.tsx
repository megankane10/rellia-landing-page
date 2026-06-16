import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"

/** Frosted pill on photography — light glass so the background image stays visible. */
export const PILL_ON_IMAGE_BLUR_CLASS =
  "border border-white/40 bg-white/14 text-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] backdrop-blur-xl"

/**
 * Darker frosted pill on path / directory image cards (homepage Paths, founders Explore network).
 * Slightly heavier tint than {@link PILL_ON_IMAGE_BLUR_CLASS} for legibility on busy photos.
 */
export const PILL_ON_PATH_CARD_BLUR_CLASS =
  "bg-black/30 text-white shadow-[0_2px_14px_rgba(0,0,0,0.22)] backdrop-blur-md"

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
        "inline-flex w-fit items-center gap-2 rounded-full px-4 py-2",
        PILL_ON_IMAGE_BLUR_CLASS,
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
