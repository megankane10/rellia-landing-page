import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import PillTag from "@/components/PillTag"
import { cn } from "@/lib/utils"

type NetworkEyebrowTone = "onDark" | "onLight"

/**
 * Matches “Network impact” pill styling from {@link NetworkMetricsSection}
 * — frosted capsule + mint dot (not the teal SectionPillBadge).
 */
export default function NetworkEyebrow({
  label,
  tone = "onLight",
  className,
}: {
  label: string
  tone?: NetworkEyebrowTone
  className?: string
}) {
  const reduceMotion = useReducedMotion()

  const dot: ReactNode =
    tone === "onDark" ? (
      <motion.span
        aria-hidden
        className="relative inline-flex h-2 w-2 rounded-full bg-rellia-mint"
        initial={false}
        animate={
          reduceMotion
            ? undefined
            : { opacity: [1, 1, 1], transform: ["scale(1)", "scale(1.35)", "scale(1)"] }
        }
        transition={reduceMotion ? undefined : { duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    ) : (
      <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-rellia-teal" />
    )

  return (
    <PillTag
      label={label}
      dot={dot}
      className={cn(
        tone === "onDark"
          ? "border-white/30 bg-white/15 shadow-sm backdrop-blur-xl"
          : "border-rellia-teal/20 bg-white/70 shadow-sm backdrop-blur-lg",
        className,
      )}
      labelClassName={tone === "onLight" ? "text-rellia-teal font-semibold" : undefined}
    />
  )
}
