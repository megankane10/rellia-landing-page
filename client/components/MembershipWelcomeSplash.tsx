import { useEffect, useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cmsCleanText, cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"

export type MembershipWelcomeSplashProps = {
  enabled: boolean
  heading: string
  subheading: string
  backgroundSrc: string
  logoSrc: string
  /** Kept for CMS compatibility; hold time after reveal is fixed at 1.5s. */
  totalSeconds?: number
  onComplete: () => void
}

type SplashPhase = "enter" | "hold" | "exit" | "done"

const HEADING_STAGGER_S = 0.2
const HEADING_WORD_DURATION_S = 0.88
const HEADING_DELAY_CHILDREN_S = 0.34
const SUBHEADING_REVEAL_S = 0.45
const READ_HOLD_MS = 1500
const ANIM_EXIT_MS = 550

const SLIDE_EASE = [0.4, 0, 0.2, 1] as const

export default function MembershipWelcomeSplash({
  enabled,
  heading,
  subheading,
  backgroundSrc,
  logoSrc,
  onComplete,
}: MembershipWelcomeSplashProps) {
  const reduceMotion = useReducedMotion()
  const previewMode = isVisualEditingPreview()
  const [phase, setPhase] = useState<SplashPhase>("enter")

  const headingText = previewMode ? cmsDisplayText(heading) : cmsCleanText(heading)
  const subheadingText = previewMode ? cmsDisplayText(subheading) : cmsCleanText(subheading)
  const words = useMemo(
    () => (previewMode ? headingText : cmsCleanText(heading)).trim().split(/\s+/).filter(Boolean),
    [heading, headingText, previewMode],
  )

  const subheadingDelay = useMemo(() => {
    if (reduceMotion) return 0
    const wordCount = Math.max(words.length, 1)
    return (
      HEADING_DELAY_CHILDREN_S +
      (wordCount - 1) * HEADING_STAGGER_S +
      HEADING_WORD_DURATION_S
    )
  }, [reduceMotion, words.length])

  const timings = useMemo(() => {
    const revealMs = Math.round(
      (subheadingDelay + (reduceMotion ? 0 : SUBHEADING_REVEAL_S)) * 1000,
    )
    const holdMs = READ_HOLD_MS
    const exitMs = ANIM_EXIT_MS
    return {
      revealMs,
      holdMs,
      exitMs,
      totalMs: revealMs + holdMs + exitMs,
    }
  }, [reduceMotion, subheadingDelay])

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
      y: reduceMotion ? 0 : 24,
      filter: reduceMotion ? "blur(0px)" : "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : HEADING_WORD_DURATION_S,
        ease: [0.33, 1, 0.68, 1] as const,
      },
    },
  }

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
      }, READ_HOLD_MS + ANIM_EXIT_MS)
      return () => window.clearTimeout(brief)
    }

    setPhase("enter")
    const holdTimer = window.setTimeout(() => setPhase("hold"), timings.revealMs)
    const exitTimer = window.setTimeout(
      () => setPhase("exit"),
      timings.revealMs + timings.holdMs,
    )
    const doneTimer = window.setTimeout(() => {
      setPhase("done")
      onComplete()
    }, timings.totalMs)

    return () => {
      window.clearTimeout(holdTimer)
      window.clearTimeout(exitTimer)
      window.clearTimeout(doneTimer)
    }
  }, [enabled, onComplete, reduceMotion, timings])

  if (!enabled || phase === "done") return null

  const isExiting = phase === "exit"

  return (
    <motion.div
      className="fixed inset-0 z-[250] overflow-hidden"
      initial={{ y: 0 }}
      animate={{ y: isExiting ? "-100%" : 0 }}
      transition={{
        duration: isExiting ? ANIM_EXIT_MS / 1000 : 0,
        ease: SLIDE_EASE,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Membership welcome"
    >
      <div className="relative flex h-full w-full flex-col">
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
          <motion.div
            className="mx-auto w-full max-w-3xl text-left"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="mb-8 md:mb-10"
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -64 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src={logoSrc}
                alt=""
                aria-hidden
                className="h-[4.5rem] w-[4.5rem] drop-shadow-[0_12px_32px_rgba(0,0,0,0.5)] md:h-24 md:w-24 lg:h-28 lg:w-28"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={
                  reduceMotion
                    ? undefined
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

            <motion.p
              className="mt-6 max-w-2xl font-urbanist text-xl font-normal leading-relaxed md:mt-8 md:text-2xl md:leading-relaxed"
              style={{
                color: "rgba(255, 255, 255, 0.82)",
                textShadow: "0 2px 24px rgba(0, 0, 0, 0.8), 0 1px 6px rgba(0, 0, 0, 0.7)",
              }}
              initial={reduceMotion ? { y: 0 } : { y: 12 }}
              animate={{ y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : SUBHEADING_REVEAL_S,
                delay: reduceMotion ? 0 : subheadingDelay,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {subheadingText}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
