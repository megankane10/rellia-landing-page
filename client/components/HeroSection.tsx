import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { HomePageContent } from "@shared/cms/types"
import { ArrowRight } from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import { motion, useReducedMotion } from "framer-motion"

/** Stagger timing must stay in sync with `headlineBelowFoldDelayMs` below */
const HEADLINE_STAGGER_CHILDREN_S = 0.22
const HEADLINE_DELAY_CHILDREN_S = 0.22
const HEADLINE_WORD_DURATION_S = 1.12

/** Soft ease-out — slow start, gentle settle */
const HEADLINE_WORD_EASE = [0.33, 1, 0.68, 1] as const
const BELOW_FOLD_EASE = [0.33, 1, 0.68, 1] as const

/** Insert flex line-break after this token on desktop so “of …” stays on line 2 without isolating “future”. */
const isFutureHeadlineWord = (token: string) =>
  token.replace(/[.,!?;:]+$/, "").toLowerCase() === "future"

const headlineBelowFoldDelayMs = (wordCount: number) => {
  const n = Math.max(wordCount, 1)
  const totalS =
    HEADLINE_DELAY_CHILDREN_S + (n - 1) * HEADLINE_STAGGER_CHILDREN_S + HEADLINE_WORD_DURATION_S
  /** Start below-fold earlier than the strict “last word finished” estimate (overlap is intentional). */
  return Math.max(0, Math.round(totalS * 1000) - 320)
}

type HeroSectionProps = {
  content: Pick<
    HomePageContent,
    | "headlinePrefix"
    | "subheadline"
    | "primaryCtaLabel"
    | "primaryCtaPath"
    | "secondaryCtaLabel"
    | "secondaryCtaPath"
  >;
}

export default function HeroSection({ content }: HeroSectionProps) {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [showBelowFold, setShowBelowFold] = useState(reduceMotion)

  const headline = (content.headlinePrefix ?? "").trim() || "You are the future of health tech."
  const headlineWords = useMemo(() => headline.split(/\s+/).filter(Boolean), [headline])

  useEffect(() => {
    if (reduceMotion) {
      setShowBelowFold(true)
      return
    }
    const ms = headlineBelowFoldDelayMs(headlineWords.length)
    const t = window.setTimeout(() => setShowBelowFold(true), ms)
    return () => window.clearTimeout(t)
  }, [reduceMotion, headlineWords.length])

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
      y: reduceMotion ? 0 : 36,
      filter: reduceMotion ? "blur(0px)" : "blur(11px)",
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
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/homehero.mp4" type="video/mp4" />
        </video>
      </div>

      <div aria-hidden className="absolute inset-0 bg-rellia-teal/30" />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/10"
      />

      <div className="relative z-10 max-w-[1300px] mx-auto w-full px-6 md:px-10 pt-24 pb-12 md:pt-28 md:pb-24">
        <div className="flex w-full max-w-5xl flex-col items-start text-left">
          <div className="-mt-2 md:-mt-1 w-full">
            <motion.h1
              variants={headlineContainerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap justify-start gap-x-[0.22em] gap-y-2 text-balance font-host-grotesk text-[46px] font-medium leading-[0.95] tracking-tight text-rellia-mint md:text-[68px] lg:text-[82px]"
            >
              {headlineWords.flatMap((word, index) => {
                const nodes = [
                  <motion.span
                    key={`${index}-${word}`}
                    variants={headlineWordVariants}
                    className="inline-block will-change-[transform,filter]"
                  >
                    {word}
                  </motion.span>,
                ]
                if (isFutureHeadlineWord(word)) {
                  nodes.push(
                    <span
                      key={`${index}-${word}-line`}
                      aria-hidden
                      className="hidden h-0 w-full shrink-0 basis-full overflow-hidden md:block"
                    />,
                  )
                }
                return nodes
              })}
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
            className="mt-12 flex w-full max-w-3xl flex-col gap-4 sm:mt-14 sm:flex-row sm:items-center sm:justify-start"
          >
            <RelliaAction
              type="button"
              variant="heroSolidOnTeal"
              size="comfortable"
              onClick={() => navigate(content.primaryCtaPath)}
              aria-label={content.primaryCtaLabel || "Apply to Join"}
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
              className="border-white/45 text-white hover:border-white/80"
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
