import { useCallback, useEffect, useMemo, useState } from "react"
import { motion, useAnimationControls, useReducedMotion } from "framer-motion"
import { cmsCleanText, cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"

export type MembershipWelcomeSplashProps = {
  enabled: boolean
  heading: string
  subheading: string
  backgroundSrc: string
  logoSrc: string
  /** Seconds to hold after headline + subheading finish revealing (CMS welcomeSplashDurationSeconds). */
  holdAfterRevealSeconds?: number
  onComplete: () => void
}

type SplashPhase = "enter" | "hold" | "exit" | "done"

const HEADING_STAGGER_S = 0.22
const HEADING_WORD_DURATION_S = 1.02
const HEADING_DELAY_CHILDREN_S = 0.4
const SUBHEADING_REVEAL_S = 0.72
/** Start subheading before the heading finishes (seconds). Increase = earlier subheading. */
const SUBHEADING_NEARLY_DONE_OFFSET_S = 0.38
/**
 * Progress bar placement. Change to "top" to move it back to the top edge.
 * File: client/components/MembershipWelcomeSplash.tsx
 */
const PROGRESS_BAR_EDGE: "top" | "bottom" = "bottom"
const MIN_HOLD_AFTER_REVEAL_SECONDS = 0.5
const MAX_HOLD_AFTER_REVEAL_SECONDS = 8
const DEFAULT_HOLD_AFTER_REVEAL_SECONDS = 3
const ANIM_EXIT_MS = 720

const resolveHoldAfterRevealSeconds = (value?: number) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_HOLD_AFTER_REVEAL_SECONDS
  }
  return Math.min(
    MAX_HOLD_AFTER_REVEAL_SECONDS,
    Math.max(MIN_HOLD_AFTER_REVEAL_SECONDS, value),
  )
}

const SLIDE_EASE = [0.4, 0, 0.2, 1] as const
const REVEAL_EASE = [0.33, 1, 0.68, 1] as const
const HEADING_WORD_EASE = [0.22, 0.03, 0.26, 1] as const

const splashViewportStyle = {
  height: "calc(100dvh + env(safe-area-inset-top, 0px))",
  minHeight: "calc(100dvh + env(safe-area-inset-top, 0px))",
  marginTop: "calc(-1 * env(safe-area-inset-top, 0px))",
} as const

export default function MembershipWelcomeSplash({
  enabled,
  heading,
  subheading,
  backgroundSrc,
  logoSrc,
  holdAfterRevealSeconds,
  onComplete,
}: MembershipWelcomeSplashProps) {
  const reduceMotion = useReducedMotion()
  const previewMode = isVisualEditingPreview()
  const exitControls = useAnimationControls()
  const [phase, setPhase] = useState<SplashPhase>("enter")

  const headingText = previewMode ? cmsDisplayText(heading) : cmsCleanText(heading)
  const subheadingText = previewMode ? cmsDisplayText(subheading) : cmsCleanText(subheading)
  const words = useMemo(
    () => (previewMode ? headingText : cmsCleanText(heading)).trim().split(/\s+/).filter(Boolean),
    [heading, headingText, previewMode],
  )

  const headingRevealEndS = useMemo(() => {
    if (reduceMotion) return 0
    const wordCount = Math.max(words.length, 1)
    return (
      HEADING_DELAY_CHILDREN_S +
      (wordCount - 1) * HEADING_STAGGER_S +
      HEADING_WORD_DURATION_S
    )
  }, [reduceMotion, words.length])

  const subheadingStartS = useMemo(
    () => Math.max(0, headingRevealEndS - SUBHEADING_NEARLY_DONE_OFFSET_S),
    [headingRevealEndS],
  )

  const revealMs = useMemo(() => {
    const contentRevealEndS = Math.max(
      headingRevealEndS,
      subheadingStartS + (reduceMotion ? 0 : SUBHEADING_REVEAL_S),
    )
    return Math.round(contentRevealEndS * 1000)
  }, [headingRevealEndS, reduceMotion, subheadingStartS])

  const holdAfterRevealMs = useMemo(() => {
    const seconds = resolveHoldAfterRevealSeconds(holdAfterRevealSeconds)
    return Math.round(seconds * 1000)
  }, [holdAfterRevealSeconds])

  const preExitDurationMs = useMemo(
    () => revealMs + holdAfterRevealMs,
    [holdAfterRevealMs, revealMs],
  )

  const handleProgressComplete = useCallback(() => {
    if (reduceMotion || phase === "exit" || phase === "done") return
    setPhase("exit")
  }, [phase, reduceMotion])

  const headingContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : HEADING_STAGGER_S,
        delayChildren: reduceMotion ? 0 : HEADING_DELAY_CHILDREN_S,
      },
    },
  }

  const headingWordVariants = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 18,
      filter: reduceMotion ? "blur(0px)" : "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : HEADING_WORD_DURATION_S,
        ease: HEADING_WORD_EASE,
      },
    },
  }

  const progressBarPositionClass =
    PROGRESS_BAR_EDGE === "top"
      ? "absolute inset-x-0 top-0"
      : "absolute inset-x-0 bottom-0"

  useEffect(() => {
    if (!enabled) {
      setPhase("done")
      onComplete()
      return
    }

    if (reduceMotion) {
      const brief = window.setTimeout(() => {
        setPhase("done")
        onComplete()
      }, preExitDurationMs + ANIM_EXIT_MS)
      return () => window.clearTimeout(brief)
    }

    setPhase("enter")
  }, [enabled, onComplete, preExitDurationMs, reduceMotion])

  useEffect(() => {
    if (phase !== "exit" || reduceMotion) return

    let cancelled = false
    void exitControls
      .start({
        y: "-100%",
        transition: {
          duration: ANIM_EXIT_MS / 1000,
          ease: SLIDE_EASE,
        },
      })
      .then(() => {
        if (cancelled) return
        setPhase("done")
        onComplete()
      })

    return () => {
      cancelled = true
    }
  }, [exitControls, onComplete, phase, reduceMotion])

  if (!enabled || phase === "done") return null

  const isExiting = phase === "exit"

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[10050] w-full overflow-hidden transform-gpu"
      style={splashViewportStyle}
      initial={{ y: 0 }}
      animate={exitControls}
      role="dialog"
      aria-modal="true"
      aria-label="Membership welcome"
    >
      <div
        className={`pointer-events-none z-20 h-[4px] ${progressBarPositionClass}`}
        aria-hidden
      >
        <motion.div
          key={preExitDurationMs}
          className="h-full w-full origin-left bg-rellia-mint"
          initial={{ scaleX: reduceMotion ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: reduceMotion ? 0 : preExitDurationMs / 1000,
            ease: "linear",
          }}
          onAnimationComplete={handleProgressComplete}
        />
      </div>

      <div className="relative flex h-full min-h-full w-full flex-col">
        <div className="absolute inset-0">
          <img
            src={backgroundSrc}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#071f26]/75 via-rellia-teal/60 to-[#0a2e36]/80"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#071f26]/85 via-[#071f26]/25 to-black/15"
            aria-hidden
          />
          <div
            className="absolute inset-y-0 left-0 w-full max-w-4xl bg-gradient-to-r from-black/55 via-black/20 to-transparent lg:max-w-5xl"
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex min-h-full flex-1 items-center px-6 py-24 md:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-3xl text-left">
            <motion.div
              className="mb-16 md:mb-20 lg:mb-24"
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -64 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: REVEAL_EASE }}
            >
              <motion.img
                src={logoSrc}
                alt=""
                aria-hidden
                className="h-[4.5rem] w-[4.5rem] drop-shadow-[0_12px_32px_rgba(0,0,0,0.5)] md:h-24 md:w-24 lg:h-28 lg:w-28"
                animate={
                  reduceMotion || isExiting
                    ? { rotate: 0 }
                    : { rotate: 360 }
                }
                transition={
                  reduceMotion || isExiting
                    ? { duration: 0.2 }
                    : {
                        rotate: {
                          duration: 18,
                          repeat: Infinity,
                          ease: "linear",
                        },
                      }
                }
              />
            </motion.div>

            {previewMode ? (
              <h1 className="text-balance font-host-grotesk text-[2.35rem] font-semibold leading-[1.1] tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.55)] md:text-5xl lg:text-[3.35rem]">
                {headingText}
              </h1>
            ) : (
              <motion.h1
                variants={headingContainerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-x-[0.22em] gap-y-1 text-balance font-host-grotesk text-[2.35rem] font-semibold leading-[1.1] tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.55)] md:text-5xl lg:text-[3.35rem]"
              >
                {words.map((word, idx) => (
                  <motion.span
                    key={`${idx}-${word}`}
                    variants={headingWordVariants}
                    className="inline-block will-change-[transform,filter]"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
            )}

            {previewMode ? (
              <p
                className="mt-6 max-w-2xl font-urbanist text-xl font-normal leading-relaxed md:mt-8 md:text-2xl md:leading-relaxed"
                style={{
                  color: "rgba(255, 255, 255, 0.82)",
                  textShadow:
                    "0 2px 24px rgba(0, 0, 0, 0.8), 0 1px 6px rgba(0, 0, 0, 0.7)",
                }}
              >
                {subheadingText}
              </p>
            ) : (
              <motion.p
                className="mt-6 max-w-2xl font-urbanist text-xl font-normal leading-relaxed md:mt-8 md:text-2xl md:leading-relaxed"
                style={{
                  color: "rgba(255, 255, 255, 0.82)",
                  textShadow:
                    "0 2px 24px rgba(0, 0, 0, 0.8), 0 1px 6px rgba(0, 0, 0, 0.7)",
                }}
                initial={
                  reduceMotion
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : { opacity: 0, y: 32, filter: "blur(12px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: reduceMotion ? 0 : subheadingStartS,
                  duration: reduceMotion ? 0 : SUBHEADING_REVEAL_S,
                  ease: REVEAL_EASE,
                }}
              >
                {subheadingText}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
