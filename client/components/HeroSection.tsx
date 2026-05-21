import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { HomePageContent } from "@shared/cms/types"
import { ArrowRight } from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

/** Stagger timing must stay in sync with `headlineBelowFoldDelayMs` below */
const HEADLINE_STAGGER_CHILDREN_S = 0.15
const HEADLINE_DELAY_CHILDREN_S = 0.2
const HEADLINE_WORD_DURATION_S = 0.5
const HEADLINE_Y_OFFSET = 24

/** Soft ease-out — slow start, gentle settle */
const HEADLINE_WORD_EASE = [0.33, 1, 0.68, 1] as const
const BELOW_FOLD_EASE = [0.33, 1, 0.68, 1] as const

/** Insert flex line-break after this token on desktop so “of …” stays on line 2 without isolating “future”. */
const isFutureHeadlineWord = (token: string) =>
  token.replace(/[.,!?;:]+$/, "").toLowerCase() === "future"

const headlineBelowFoldDelayMs = (lineCount: number) => {
  const n = Math.max(lineCount, 1)
  const totalS =
    HEADLINE_DELAY_CHILDREN_S + (n - 1) * HEADLINE_STAGGER_CHILDREN_S + HEADLINE_WORD_DURATION_S
  /** Start below-fold earlier than the strict “last line finished” estimate. */
  return Math.max(0, Math.round(totalS * 1000) - 320)
}

const DEFAULT_HERO_VIDEO_SRC = "/videos/homehero.mp4"

type HeroSectionProps = {
  content: Pick<
    HomePageContent,
    | "headlinePrefix"
    | "subheadline"
    | "primaryCtaLabel"
    | "primaryCtaPath"
    | "secondaryCtaLabel"
    | "secondaryCtaPath"
    | "heroBackgroundVideoUrl"
  >;
}

export default function HeroSection({ content }: HeroSectionProps) {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [showBelowFold, setShowBelowFold] = useState(reduceMotion)

  const heroVideoSrc =
    content.heroBackgroundVideoUrl?.trim() || DEFAULT_HERO_VIDEO_SRC

  const headlineLines = useMemo(() => {
    const words = (content.headlinePrefix ?? "You are the future of health tech.").trim().split(/\s+/).filter(Boolean)
    const lines: string[][] = [[]]
    words.forEach((w) => {
      lines[lines.length - 1].push(w)
      if (isFutureHeadlineWord(w)) {
        lines.push([])
      }
    })
    return lines.filter((l) => l.length > 0)
  }, [content.headlinePrefix])

  useEffect(() => {
    if (reduceMotion) {
      setShowBelowFold(true)
      return
    }
    const ms = headlineBelowFoldDelayMs(headlineLines.length)
    const t = window.setTimeout(() => setShowBelowFold(true), ms)
    return () => window.clearTimeout(t)
  }, [reduceMotion, headlineLines.length])

  const headlineContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : HEADLINE_STAGGER_CHILDREN_S,
        delayChildren: reduceMotion ? 0 : HEADLINE_DELAY_CHILDREN_S,
      },
    },
  }

  const headlineWordVariants = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : HEADLINE_Y_OFFSET,
      filter: reduceMotion ? "blur(0px)" : "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : HEADLINE_WORD_DURATION_S,
        ease: HEADLINE_WORD_EASE,
      },
    },
  }

  return (
    <section className="relative min-h-[100svh] md:min-h-screen flex items-center bg-rellia-teal overflow-hidden">
      <div aria-hidden className="absolute inset-0">
        {!reduceMotion ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={heroVideoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            width={1920}
            height={1080}
            aria-hidden
          />
        ) : null}
      </div>

      {/* Softer teal wash so image stays visible */}
      <div aria-hidden className="absolute inset-0 bg-rellia-teal/45" />

      {/* Left-to-right gradient — extra contrast under the headline */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-rellia-teal/85 via-rellia-teal/55 to-rellia-teal/35"
      />

      <div className="relative z-10 max-w-[1300px] mx-auto w-full px-6 md:px-10 pt-24 pb-12 md:pt-28 md:pb-24">
        <div className="flex w-full max-w-5xl flex-col items-start text-left">
          <div className="-mt-2 md:-mt-1 w-full">
            <motion.h1
              variants={headlineContainerVariants}
              initial="hidden"
              animate="visible"
              className="font-host-grotesk text-[46px] font-medium leading-[0.95] tracking-tight text-rellia-mint md:text-[68px] lg:text-[82px] space-y-1"
            >
              {headlineLines.map((line, idx) => (
                <div 
                  key={`line-${idx}`} 
                  className={cn(
                    "overflow-hidden flex flex-wrap gap-x-[0.22em]",
                    idx > 0 && "hidden md:flex" // Hide forced second line on mobile if it exists
                  )}
                >
                  <motion.span
                    variants={headlineWordVariants}
                    className="inline-flex flex-wrap gap-x-[0.22em] will-change-[transform,filter]"
                  >
                    {line.map((word, wIdx) => (
                      <span key={`word-${idx}-${wIdx}`}>{word}</span>
                    ))}
                    {/* On mobile, if this is the first line and there's a second one, render the rest of the words here too but only show on mobile */}
                    {idx === 0 && headlineLines.length > 1 && (
                      <span className="flex md:hidden flex-wrap gap-x-[0.22em]">
                        {headlineLines.slice(1).flat().map((word, wIdx) => (
                          <span key={`mobile-word-${wIdx}`}>{word}</span>
                        ))}
                      </span>
                    )}
                  </motion.span>
                </div>
              ))}
            </motion.h1>
          </div>

          <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={showBelowFold ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 0.42, ease: BELOW_FOLD_EASE, delay: 0 }
            }
            className="mt-8 md:mt-9"
          >
            <p className="max-w-3xl text-pretty font-urbanist text-xl leading-relaxed text-white md:text-2xl">
              {content.subheadline}
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={showBelowFold ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 0.45, ease: BELOW_FOLD_EASE, delay: 0 }
            }
            className="mt-12 flex w-full max-w-3xl flex-col gap-4 sm:mt-14 sm:flex-row sm:items-stretch"
          >
            <RelliaAction
              type="button"
              variant="heroSolidOnTeal"
              size="comfortable"
              onClick={() => navigate(content.primaryCtaPath)}
              aria-label={content.primaryCtaLabel || "Apply to Join"}
              className="w-full justify-center sm:flex-1 sm:min-w-0"
            >
              {content.primaryCtaLabel || "Apply to Join"}
              <ArrowRight aria-hidden />
            </RelliaAction>

            <RelliaAction
              type="button"
              variant="heroGhostOnTeal"
              size="comfortable"
              onClick={() => navigate(content.secondaryCtaPath)}
              aria-label={content.secondaryCtaLabel || "Explore Programs"}
              className="w-full justify-center border-white/45 text-white hover:border-white/80 sm:flex-1 sm:min-w-0"
            >
              {content.secondaryCtaLabel || "Explore Programs"}
              <ArrowRight aria-hidden />
            </RelliaAction>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
