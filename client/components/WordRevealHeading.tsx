import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { stegaClean } from "@sanity/client/stega"
import { cn } from "@/lib/utils"
import { cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"

export default function WordRevealHeading({
  text,
  as: Tag = "h1",
  className,
  wordClassName,
  stagger = 0.12,
}: {
  text: string
  as?: "h1" | "h2" | "h3"
  className?: string
  wordClassName?: string
  /** Seconds between words. */
  stagger?: number
}) {
  const reduceMotion = useReducedMotion()
  const isPreview = isVisualEditingPreview()

  const words = useMemo(() => {
    const trimmed = stegaClean(text ?? "").trim()
    if (!trimmed) return []
    return trimmed.split(/\s+/g)
  }, [text])

  if (isPreview) {
    return (
      <Tag className={cn("text-balance", className)}>
        {cmsDisplayText(text)}
      </Tag>
    )
  }

  return (
    <Tag className={cn("text-balance", className)}>
      <span className="inline">
        {words.map((w, i) => {
          const delay = reduceMotion ? 0 : i * stagger
          return (
            <motion.span
              key={`${w}-${i}`}
              initial={
                reduceMotion
                  ? { opacity: 1, filter: "blur(0px)", y: 0 }
                  : { opacity: 0, filter: "blur(6px)", y: 10 }
              }
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={
                reduceMotion
                  ? undefined
                  : {
                      delay,
                      duration: 0.6,
                      ease: "easeOut",
                    }
              }
              className={cn("inline-block whitespace-pre", wordClassName)}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          )
        })}
      </span>
    </Tag>
  )
}

