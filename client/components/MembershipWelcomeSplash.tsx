import { useEffect, useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cmsCleanText, cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"

export type MembershipWelcomeSplashProps = {
  enabled: boolean
  heading: string
  subheading: string
  backgroundSrc: string
  logoSrc: string
  /** Total splash duration in seconds (entrance, hold, and exit scale together). */
  durationSeconds: number
  onComplete: () => void
}

type SplashPhase = "enter" | "hold" | "exit" | "done"

const clampDuration = (seconds: number) => Math.min(12, Math.max(3, seconds))

const phaseRatios = {
  enter: 0.38,
  hold: 0.32,
  exit: 0.3,
} as const

const SLIDE_EASE = [0.4, 0, 0.2, 1] as const

export default function MembershipWelcomeSplash({
  enabled,
  heading,
  subheading,
  backgroundSrc,
  logoSrc,
  durationSeconds,
  onComplete,
}: MembershipWelcomeSplashProps) {
  const reduceMotion = useReducedMotion()
  const previewMode = isVisualEditingPreview()
  const [phase, setPhase] = useState<SplashPhase>("enter")

  const totalMs = useMemo(
    () => clampDuration(durationSeconds) * 1000,
    [durationSeconds],
  )

  const timings = useMemo(() => {
    const enterMs = totalMs * phaseRatios.enter
    const holdMs = totalMs * phaseRatios.hold
    const exitMs = totalMs * phaseRatios.exit
    return { enterMs, holdMs, exitMs, totalMs }
  }, [totalMs])

  const headingText = previewMode ? cmsDisplayText(heading) : cmsCleanText(heading)
  const subheadingText = previewMode ? cmsDisplayText(subheading) : cmsCleanText(subheading)
  const words = useMemo(
    () => (previewMode ? headingText : cmsCleanText(heading)).trim().split(/\s+/).filter(Boolean),
    [heading, headingText, previewMode],
  )

  const headingContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.11,
        delayChildren: reduceMotion ? 0 : 0.2,
      },
    },
  }

  const headingWordVariants = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 22,
      filter: reduceMotion ? "blur(0px)" : "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 0.72,
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
      }, 300)
      return () => window.clearTimeout(brief)
    }

    setPhase("enter")
    const holdTimer = window.setTimeout(() => setPhase("hold"), timings.enterMs)
    const exitTimer = window.setTimeout(() => setPhase("exit"), timings.enterMs + timings.holdMs)
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
  const exitDuration = timings.exitMs / 1000

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden"
      initial={{ y: 0 }}
      animate={{ y: isExiting ? "-100%" : 0 }}
      transition={{
        duration: isExiting ? exitDuration : 0,
        ease: SLIDE_EASE,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Membership welcome"
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-b-[1.75rem] md:rounded-b-[2.25rem] shadow-[0_24px_80px_-20px_rgba(7,31,38,0.55)]">
        <div className="absolute inset-0">
          <motion.img
            src={backgroundSrc}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
            initial={reduceMotion ? { scale: 1 } : { scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#071f26]/80 via-rellia-teal/72 to-[#0a2e36]/88"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#071f26]/92 via-[#071f26]/35 to-black/25"
            aria-hidden
          />
          <div
            className="absolute inset-y-0 left-0 w-full max-w-3xl bg-gradient-to-r from-black/65 via-black/35 to-transparent md:max-w-4xl"
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex flex-1 items-center px-6 pb-16 pt-[max(5.5rem,18vh)] md:px-12 md:pb-20 lg:px-16">
          <motion.div
            className="mx-auto w-full max-w-2xl text-left"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="mb-6 md:mb-8"
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src={logoSrc}
                alt=""
                aria-hidden
                className="h-14 w-14 drop-shadow-[0_10px_28px_rgba(0,0,0,0.45)] md:h-[4.25rem] md:w-[4.25rem]"
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
              <h1 className="text-balance font-host-grotesk text-[2rem] font-semibold leading-[1.12] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] md:text-[2.75rem] lg:text-5xl">
                {headingText}
              </h1>
            ) : (
              <motion.h1
                variants={headingContainerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-x-[0.22em] gap-y-1 text-balance font-host-grotesk text-[2rem] font-semibold leading-[1.12] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] md:text-[2.75rem] lg:text-5xl"
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
              className="mt-5 max-w-xl font-urbanist text-base font-normal leading-relaxed text-white/72 drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] md:mt-6 md:text-lg md:leading-relaxed"
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.68,
                delay: reduceMotion ? 0 : 0.42,
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
