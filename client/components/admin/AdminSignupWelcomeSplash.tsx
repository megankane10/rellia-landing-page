import { useCallback, useEffect, useMemo, useState } from "react"
import { BarChart3, ExternalLink, FileText, PenLine } from "lucide-react"
import { motion, useAnimationControls, useReducedMotion } from "framer-motion"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"
import { OPERATIONS_DOC_EDIT_URL } from "@shared/cms/operationsDocUrl"

export type AdminSignupWelcomeSplashProps = {
  firstName: string
  onComplete: () => void
}

type SplashPhase = "enter" | "exit" | "done"

const HEADING_STAGGER_S = 0.2
const HEADING_WORD_DURATION_S = 0.95
const HEADING_DELAY_CHILDREN_S = 0.35
const CONTENT_REVEAL_DELAY_S = 0.55
const CONTENT_REVEAL_S = 0.65
const ANIM_EXIT_MS = 720
const SLIDE_EASE = [0.4, 0, 0.2, 1] as const
const REVEAL_EASE = [0.33, 1, 0.68, 1] as const
const HEADING_WORD_EASE = [0.22, 0.03, 0.26, 1] as const

const HOLOGRAM_LOGO_SRC = "/images/hologram-logo.png"
const BRAND_IMAGE_SRC = "/health_tech_collaboration_1778023064936.png"

const RESOURCE_LINKS = [
  {
    href: OPERATIONS_DOC_EDIT_URL,
    label: "Management guide",
    description: "Operations runbook for the dashboard and site",
    icon: FileText,
  },
  {
    href: "https://relliahealth.sanity.studio",
    label: "Sanity Studio",
    description: "Edit pages, stories, events, and program content",
    icon: PenLine,
  },
  {
    href: "https://analytics.google.com/analytics/",
    label: "Google Analytics",
    description: "Monitor traffic, behavior, and conversion events",
    icon: BarChart3,
  },
] as const

const splashViewportStyle = {
  height: "calc(100dvh + env(safe-area-inset-top, 0px))",
  minHeight: "calc(100dvh + env(safe-area-inset-top, 0px))",
  marginTop: "calc(-1 * env(safe-area-inset-top, 0px))",
} as const

const headingWordVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: HEADING_WORD_DURATION_S,
      ease: HEADING_WORD_EASE,
    },
  },
}

const reducedHeadingWordVariants = {
  hidden: { opacity: 1, y: 0, filter: "blur(0px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
}

const SplashHeadingWord = ({
  word,
  tone,
  variants,
}: {
  word: string
  tone: "white" | "mint"
  variants: typeof headingWordVariants | typeof reducedHeadingWordVariants
}) => (
  <motion.span
    variants={variants}
    className={cn(
      "inline-block will-change-[transform,filter]",
      tone === "mint" ? "text-rellia-mint" : "text-white",
    )}
  >
    {word}
  </motion.span>
)

const AdminSignupWelcomeSplash = ({ firstName, onComplete }: AdminSignupWelcomeSplashProps) => {
  const reduceMotion = useReducedMotion()
  const exitControls = useAnimationControls()
  const [phase, setPhase] = useState<SplashPhase>("enter")

  const displayName = firstName.trim() || "there"
  const firstSentenceWords = useMemo(
    () => [
      { text: "You're", tone: "mint" as const },
      { text: "all", tone: "mint" as const },
      { text: "set,", tone: "mint" as const },
      { text: `${displayName}.`, tone: "mint" as const },
    ],
    [displayName],
  )
  const secondSentenceWords = useMemo(
    () => [
      { text: "Welcome", tone: "white" as const },
      { text: "to", tone: "white" as const },
      { text: "the", tone: "white" as const },
      { text: "Dashboard.", tone: "white" as const },
    ],
    [],
  )

  const headingRevealEndS = useMemo(() => {
    if (reduceMotion) return 0
    const line1Count = firstSentenceWords.length
    const line2Count = secondSentenceWords.length
    const line1End =
      HEADING_DELAY_CHILDREN_S +
      (line1Count - 1) * HEADING_STAGGER_S +
      HEADING_WORD_DURATION_S
    const line2Start = line1End + HEADING_STAGGER_S * 0.5
    const line2End = line2Start + (line2Count - 1) * HEADING_STAGGER_S + HEADING_WORD_DURATION_S
    return Math.max(line1End, line2End)
  }, [firstSentenceWords.length, reduceMotion, secondSentenceWords.length])

  const secondLineDelayChildrenS = useMemo(() => {
    if (reduceMotion) return 0
    return (
      HEADING_DELAY_CHILDREN_S +
      (firstSentenceWords.length - 1) * HEADING_STAGGER_S +
      HEADING_WORD_DURATION_S +
      HEADING_STAGGER_S * 0.35
    )
  }, [firstSentenceWords.length, reduceMotion])

  const firstLineContainerVariants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0 : HEADING_STAGGER_S,
          delayChildren: reduceMotion ? 0 : HEADING_DELAY_CHILDREN_S,
        },
      },
    }),
    [reduceMotion],
  )

  const secondLineContainerVariants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0 : HEADING_STAGGER_S,
          delayChildren: reduceMotion ? 0 : secondLineDelayChildrenS,
        },
      },
    }),
    [reduceMotion, secondLineDelayChildrenS],
  )

  const actionsStartS = useMemo(
    () => headingRevealEndS + CONTENT_REVEAL_DELAY_S,
    [headingRevealEndS],
  )

  const wordVariants = reduceMotion ? reducedHeadingWordVariants : headingWordVariants

  const handleEnterDashboard = useCallback(() => {
    if (phase === "exit" || phase === "done") return
    if (reduceMotion) {
      setPhase("done")
      onComplete()
      return
    }
    setPhase("exit")
  }, [onComplete, phase, reduceMotion])

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

  if (phase === "done") return null

  const isExiting = phase === "exit"

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[10050] w-full overflow-hidden transform-gpu"
      style={splashViewportStyle}
      initial={{ y: 0 }}
      animate={exitControls}
      role="dialog"
      aria-modal="true"
      aria-label="Admin welcome"
    >
      <div className="relative flex h-full min-h-full w-full flex-col">
        <div className="absolute inset-0 bg-rellia-teal">
          <img
            src={BRAND_IMAGE_SRC}
            alt=""
            aria-hidden
            className="h-full w-full object-cover opacity-35 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal via-[#0f5c5c] to-rellia-teal/90" />
          <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-rellia-mint/25 blur-[120px]" />
          <div className="absolute bottom-[-5%] right-[-5%] h-[40%] w-[40%] rounded-full bg-rellia-mint/15 blur-[100px]" />
          <div className="absolute inset-y-0 left-0 w-full max-w-4xl bg-gradient-to-r from-black/35 via-black/10 to-transparent lg:max-w-5xl" />
        </div>

        <div className="relative z-10 flex min-h-full flex-1 items-center px-6 py-20 md:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-3xl text-left">
            <motion.div
              className="mb-10 md:mb-14"
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: REVEAL_EASE }}
            >
              <motion.img
                src={HOLOGRAM_LOGO_SRC}
                alt=""
                aria-hidden
                className="h-20 w-20 drop-shadow-[0_12px_32px_rgba(0,0,0,0.45)] md:h-24 md:w-24"
                animate={reduceMotion || isExiting ? { rotate: 0 } : { rotate: 360 }}
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

            <h1 className="flex flex-col gap-y-2 text-balance font-host-grotesk text-[2.5rem] font-semibold leading-[1.08] tracking-tight [text-shadow:0_2px_28px_rgba(0,0,0,0.55)] md:gap-y-3 md:text-5xl lg:text-[3.5rem]">
              <motion.span
                variants={firstLineContainerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-x-[0.22em] gap-y-1"
              >
                {firstSentenceWords.map((entry, idx) => (
                  <SplashHeadingWord
                    key={`line1-${idx}-${entry.text}`}
                    word={entry.text}
                    tone={entry.tone}
                    variants={wordVariants}
                  />
                ))}
              </motion.span>
              <motion.span
                variants={secondLineContainerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-x-[0.22em] gap-y-1"
              >
                {secondSentenceWords.map((entry, idx) => (
                  <SplashHeadingWord
                    key={`line2-${idx}-${entry.text}`}
                    word={entry.text}
                    tone={entry.tone}
                    variants={wordVariants}
                  />
                ))}
              </motion.span>
            </h1>

            <motion.div
              className="mt-10 md:mt-12"
              initial={
                reduceMotion
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 28, filter: "blur(10px)" }
              }
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: reduceMotion ? 0 : actionsStartS,
                duration: reduceMotion ? 0 : CONTENT_REVEAL_S,
                ease: REVEAL_EASE,
              }}
            >
              <RelliaAction
                type="button"
                variant="heroSolidOnTeal"
                size="comfortable"
                className="min-w-[12rem]"
                disabled={isExiting}
                onClick={handleEnterDashboard}
              >
                Enter dashboard
              </RelliaAction>

              <div className="mt-16 w-full max-w-4xl md:mt-20">
                <p className="mb-4 text-left font-urbanist text-sm font-semibold uppercase tracking-[0.14em] text-white/75">
                  More ways to manage
                </p>
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                {RESOURCE_LINKS.map((link) => {
                  const Icon = link.icon
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group flex min-h-[9.5rem] flex-col rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm transition-all md:min-h-[10.5rem] md:p-6",
                        "hover:border-rellia-mint/40 hover:bg-white/15",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Icon className="h-6 w-6 shrink-0 text-rellia-mint" aria-hidden />
                        <ExternalLink
                          className="h-4 w-4 shrink-0 text-white/45 transition-colors group-hover:text-rellia-mint"
                          aria-hidden
                        />
                      </div>
                      <span className="mt-4 font-host-grotesk text-base font-semibold text-white">
                        {link.label}
                      </span>
                      <span className="mt-1.5 font-urbanist text-sm leading-relaxed text-white/65">
                        {link.description}
                      </span>
                    </a>
                  )
                })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminSignupWelcomeSplash
