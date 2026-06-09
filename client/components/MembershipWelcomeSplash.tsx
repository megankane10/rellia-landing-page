import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
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
  enter: 0.45,
  hold: 0.3,
  exit: 0.25,
} as const

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
        staggerChildren: reduceMotion ? 0 : 0.14,
        delayChildren: reduceMotion ? 0 : 0.12,
      },
    },
  }

  const headingWordVariants = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 28,
      filter: reduceMotion ? "blur(0px)" : "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 0.85,
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
      }, 400)
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
  const showContent = phase === "enter" || phase === "hold" || phase === "exit"

  return (
    <AnimatePresence>
      {showContent ? (
        <motion.div
          key="membership-welcome-splash"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: isExiting ? timings.exitMs / 1000 : 0.35,
            ease: [0.4, 0, 0.2, 1],
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Membership welcome"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{
              scale: isExiting ? 1.08 : 1,
              opacity: isExiting ? 0 : 1,
            }}
            transition={{
              duration: isExiting ? timings.exitMs / 1000 : 0.7,
              ease: [0.16, 1, 0.3, 1],
              delay: isExiting ? 0.12 : 0,
            }}
          >
            <img
              src={backgroundSrc}
              alt=""
              aria-hidden
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-rellia-teal/88 via-rellia-teal/78 to-[#071f26]/92" />
          </motion.div>

          <motion.div
            className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center md:px-10"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
            animate={
              isExiting
                ? { opacity: 0, y: -56, filter: "blur(8px)" }
                : { opacity: 1, y: 0, filter: "blur(0px)" }
            }
            transition={{
              duration: isExiting ? timings.exitMs / 1000 : 0.75,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="mb-8 flex justify-center md:mb-10">
            <div className="relative inline-block max-w-3xl text-left">
              <motion.div
                className="absolute -left-2 -top-12 h-14 w-14 md:-left-4 md:-top-14 md:h-16 md:w-16 lg:-left-6 lg:-top-16 lg:h-[4.5rem] lg:w-[4.5rem]"
                initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -80 }}
                animate={
                  isExiting
                    ? { opacity: 0, y: -48 }
                    : { opacity: 1, y: 0 }
                }
                transition={{
                  duration: reduceMotion ? 0 : 0.95,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <motion.img
                  src={logoSrc}
                  alt=""
                  aria-hidden
                  className="h-full w-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
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
                <h1 className="text-balance text-left font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl md:leading-[1.12]">
                  {headingText}
                </h1>
              ) : (
                <motion.h1
                  variants={headingContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative z-10 flex flex-wrap justify-start gap-x-[0.22em] gap-y-2 text-balance text-left font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl md:leading-[1.12]"
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
            </div>
            </div>

            <motion.p
              className="mx-auto max-w-2xl font-urbanist text-base font-medium leading-relaxed text-white/88 md:text-xl"
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
              animate={
                isExiting
                  ? { opacity: 0, y: -20 }
                  : { opacity: 1, y: 0 }
              }
              transition={{
                duration: reduceMotion ? 0 : 0.72,
                delay: reduceMotion ? 0 : 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {subheadingText}
            </motion.p>
          </motion.div>

          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/25 to-transparent",
              isExiting && "opacity-0 transition-opacity duration-500",
            )}
            aria-hidden
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
