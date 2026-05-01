import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { HomePageContent } from "@shared/cms/types"
import { ArrowRight } from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

type HeroSectionProps = {
  content: Pick<
    HomePageContent,
    | "headlinePrefix"
    | "headlineAccent"
    | "subheadline"
    | "primaryCtaLabel"
    | "primaryCtaPath"
    | "secondaryCtaLabel"
    | "secondaryCtaPath"
  >;
};

const AnimatedHeadline = ({ reduceMotion, text }: { reduceMotion: boolean; text: string }) => {
  const normalized = useMemo(() => text.trim().replace(/\s+/g, " "), [text])
  const words = useMemo(() => (normalized.length > 0 ? normalized.split(" ") : []), [normalized])
  const breakBeforeWordIndex = useMemo(() => words.findIndex((w) => w.toLowerCase() === "of"), [words])

  if (reduceMotion) {
    const fallbackBreakIndex = breakBeforeWordIndex >= 0 ? breakBeforeWordIndex : undefined
    return (
      <p className="relative font-host-grotesk font-normal text-3xl md:text-4xl lg:text-[44px] leading-[1.05] tracking-tight">
        <span className="text-rellia-cream/95">
          {words.map((w, idx) => (
            <span key={`${idx}-${w}`} className="inline">
              {fallbackBreakIndex != null && idx === fallbackBreakIndex ? <span className="hidden md:block" /> : null}
              {w}
              {idx === words.length - 1 ? " " : " "}
            </span>
          ))}
        </span>
      </p>
    )
  }

  // Controls the perceived "one word at a time" cadence.
  // Keep it smooth, but get to readable text faster.
  const baseStaggerSeconds = 0.22

  const container = {
    hidden: {},
    show: {},
  } as const

  const word = {
    hidden: { opacity: 0, y: 16, filter: "blur(18px)" },
    show: (idx: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.15,
        ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
        delay: idx * baseStaggerSeconds,
      },
    }),
  } as const

  return (
    <p className="relative font-host-grotesk font-normal text-3xl md:text-4xl lg:text-[44px] leading-[1.05] tracking-tight" aria-label={normalized}>
      <motion.span
        variants={container}
        initial="hidden"
        animate="show"
        className="text-rellia-cream/95"
      >
        {words.map((w, idx) => (
          <span key={`${idx}-${w}`} className="inline">
            {breakBeforeWordIndex >= 0 && idx === breakBeforeWordIndex ? <span className="hidden md:block" /> : null}
            <motion.span custom={idx} variants={word} className="inline-block">
              {w}
            </motion.span>
            {idx === words.length - 1 ? (
              ""
            ) : breakBeforeWordIndex >= 0 && idx === breakBeforeWordIndex - 1 ? (
              <>
                <span className="inline md:hidden">{"\u00A0"}</span>
                <span className="hidden md:block" />
              </>
            ) : (
              "\u00A0"
            )}
          </span>
        ))}
      </motion.span>
    </p>
  )
}

export default function HeroSection({ content }: HeroSectionProps) {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)
  const [rotatingLineIndex, setRotatingLineIndex] = useState(0)
  const [canRotate, setCanRotate] = useState(false)
  const [hasHeadlineRevealed, setHasHeadlineRevealed] = useState(false)

  const rotatingLines = useMemo(
    () => [
      "launch sooner",
      "scale smarter",
      "move faster",
      "reach market sooner",
      "grow with confidence",
    ],
    [],
  )

  useEffect(() => {
    if (reduceMotion) {
      setHasHeadlineRevealed(true)
      setCanRotate(true)
      return
    }

    setCanRotate(false)
    setHasHeadlineRevealed(false)
    setRotatingLineIndex(0)
  }, [reduceMotion, rotatingLines.length])

  useEffect(() => {
    if (reduceMotion) return
    if (!canRotate) return
    const interval = window.setInterval(() => {
      setRotatingLineIndex((idx) => (idx + 1) % rotatingLines.length)
    }, 2400)
    return () => window.clearInterval(interval)
  }, [canRotate, reduceMotion, rotatingLines.length])

  return (
    <section
      ref={(node) => {
        sectionRef.current = node
      }}
      className="relative min-h-[100svh] md:min-h-screen flex items-center bg-rellia-teal overflow-hidden"
    >
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

      {/* Softer teal wash so image stays visible */}
      <div aria-hidden className="absolute inset-0 bg-rellia-teal/45" />

      {/* Left-to-right gradient — extra contrast under the headline */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-rellia-teal/85 via-rellia-teal/55 to-rellia-teal/35"
      />

      <div className="relative z-10 max-w-[1300px] mx-auto w-full px-6 md:px-10 pt-24 pb-12 md:pt-28 md:pb-24">
        <div className="mx-auto flex max-w-4xl flex-col items-start text-left">
          <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? undefined : { duration: 0.45, ease: "easeOut", delay: 0.05 }}
            className="-mt-2 md:-mt-1"
          >
            <motion.h1
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? undefined : { duration: 0.9, ease: [0.42, 0, 0.58, 1] }}
              onAnimationComplete={() => {
                if (reduceMotion) return
                if (hasHeadlineRevealed) return
                setHasHeadlineRevealed(true)
                window.setTimeout(() => setCanRotate(true), 650)
              }}
              className="text-rellia-mint text-4xl md:text-6xl lg:text-[72px] font-host-grotesk font-medium tracking-tight leading-[0.95]"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="block">We help you</span>
              <span className="block min-h-[2.85rem] md:min-h-[3.5rem] lg:min-h-[4.35rem]">
                <span className="inline-grid align-baseline">
                  <AnimatePresence mode="sync" initial={false}>
                    <motion.span
                      key={rotatingLineIndex}
                      initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -14, filter: "blur(10px)" }}
                      transition={{ duration: 0.38, ease: [0.42, 0, 0.58, 1] }}
                      className="col-start-1 row-start-1 inline-block text-rellia-mint"
                    >
                      {rotatingLines[rotatingLineIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </motion.h1>
          </motion.div>

          <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={reduceMotion || hasHeadlineRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={reduceMotion ? undefined : { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="mt-8 md:mt-9"
          >
            <p className="text-white text-xl md:text-2xl font-urbanist leading-relaxed max-w-2xl">
              Rellia helps founders achieve their milestones to launch their healthcare innovations.
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={reduceMotion || hasHeadlineRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={reduceMotion ? undefined : { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
            className="mt-12 md:mt-14 flex w-full flex-col items-stretch justify-start gap-4 sm:w-auto sm:flex-row sm:items-center"
          >
            <RelliaAction
              type="button"
              variant="heroSolidOnTeal"
              size="comfortable"
              onClick={() => navigate(content.primaryCtaPath)}
              aria-label="Apply to Join"
            >
              Apply to Join
              <ArrowRight aria-hidden />
            </RelliaAction>

            <RelliaAction
              type="button"
              variant="heroGhostOnTeal"
              size="comfortable"
              onClick={() => navigate(content.secondaryCtaPath)}
              aria-label="Explore Programs"
              className="border-white/45 text-white hover:border-white/80"
            >
              Explore Programs
              <ArrowRight aria-hidden />
            </RelliaAction>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
