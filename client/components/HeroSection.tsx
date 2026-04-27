import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { HomePageContent } from "@shared/cms/types"
import { ArrowRight, Pause, Play } from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion"

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

const AnimatedHeadline = ({
  reduceMotion,
  onComplete,
  text,
}: {
  reduceMotion: boolean
  onComplete: () => void
  text: string
}) => {
  const normalized = useMemo(() => text.trim().replace(/\s+/g, " "), [text])
  const words = useMemo(() => (normalized.length > 0 ? normalized.split(" ") : []), [normalized])
  const breakBeforeWordIndex = useMemo(() => words.findIndex((w) => w.toLowerCase() === "of"), [words])

  if (reduceMotion) {
    const fallbackBreakIndex = breakBeforeWordIndex >= 0 ? breakBeforeWordIndex : undefined
    return (
      <h1 className="relative font-host-grotesk font-medium text-5xl md:text-7xl lg:text-[88px] leading-[0.95] tracking-tight">
        <span className="text-rellia-cream">
          {words.map((w, idx) => (
            <span key={`${idx}-${w}`} className="inline">
              {fallbackBreakIndex != null && idx === fallbackBreakIndex ? <span className="hidden md:block" /> : null}
              {w}
              {idx === words.length - 1 ? " " : " "}
            </span>
          ))}
        </span>
      </h1>
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

  // Trigger "headline done" as soon as the final word finishes animating.
  const headlineDoneDelaySeconds = (words.length - 1) * baseStaggerSeconds + 1.15

  return (
    <h1
      className="relative font-host-grotesk font-medium text-5xl md:text-7xl lg:text-[88px] leading-[0.95] tracking-tight"
      aria-label={normalized}
    >
      <motion.span
        variants={container}
        initial="hidden"
        animate="show"
        className="text-rellia-cream"
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
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        transition={{ delay: headlineDoneDelaySeconds, duration: 0 }}
        onAnimationComplete={onComplete}
      >
        .
      </motion.span>
    </h1>
  )
}

export default function HeroSection({ content }: HeroSectionProps) {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [heroHeight, setHeroHeight] = useState(0)
  const hasSmoothScrolledRef = useRef(false)
  const [isPaused, setIsPaused] = useState(false)
  const [rotatingLineIndex, setRotatingLineIndex] = useState(0)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [canShowHeadline, setCanShowHeadline] = useState(false)
  const [isHeadlineDone, setIsHeadlineDone] = useState(false)
  const isHeroInView = useInView(sectionRef, { amount: 0.6 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  useLayoutEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const update = () => setHeroHeight(el.getBoundingClientRect().height)
    update()

    if (typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(() => update())
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Keep the video visually "stationary" in the viewport as the page scrolls past the hero.
  // We do this by translating the video down by the same amount the section scrolls up.
  const videoY = useTransform(scrollYProgress, [0, 1], [0, heroHeight])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.06])

  useEffect(() => {
    if (reduceMotion) return
    const handleWheel = (event: WheelEvent) => {
      if (hasSmoothScrolledRef.current) return
      if (event.deltaY <= 0) return
      if (!isHeroInView) return

      // Only intercept while the user is still essentially at the top of the hero.
      if (window.scrollY > 32) return

      const target = document.getElementById("paths-section")
      if (!target) return

      hasSmoothScrolledRef.current = true
      event.preventDefault()
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [reduceMotion, isHeroInView])

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
      setIsVideoReady(true)
      setCanShowHeadline(true)
      setIsHeadlineDone(true)
      return
    }
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    if (isVideoReady) {
      setCanShowHeadline(true)
      return
    }
    const timeout = window.setTimeout(() => {
      setCanShowHeadline(true)
    }, 250)
    return () => window.clearTimeout(timeout)
  }, [reduceMotion, isVideoReady])

  useEffect(() => {
    if (reduceMotion) return
    if (!isVideoReady) return
    const interval = window.setInterval(() => {
      setRotatingLineIndex((idx) => (idx + 1) % rotatingLines.length)
    }, 1750)
    return () => window.clearInterval(interval)
  }, [reduceMotion, isVideoReady, rotatingLines.length])

  const handleTogglePlayback = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      void el.play()
    } else {
      el.pause()
    }
  }, [])

  return (
    <section
      ref={(node) => {
        sectionRef.current = node
      }}
      className="relative min-h-screen flex items-center bg-rellia-teal overflow-hidden"
    >
      {/* Video background */}
      <motion.video
        ref={videoRef}
        poster="/images/heroPoster-home.png"
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={reduceMotion ? undefined : { y: videoY, scale: videoScale }}
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        onLoadedData={() => setIsVideoReady(true)}
        onCanPlay={() => setIsVideoReady(true)}
        onError={() => setIsVideoReady(false)}
      >
        <source src="/videos/homehero.mp4" type="video/mp4" />
      </motion.video>

      {/* Softer teal wash so image stays visible */}
      <div aria-hidden className="absolute inset-0 bg-rellia-teal/25" />

      {/* Left-to-right gradient — extra contrast under the headline */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-rellia-teal/75 via-rellia-teal/35 to-rellia-teal/20"
      />

      {/* Pause / play — sits above overlay so it stays visible & clickable */}
      <div className="absolute bottom-6 right-6 z-20 md:bottom-10 md:right-10">
        <button
          type="button"
          onClick={handleTogglePlayback}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
          aria-label={isPaused ? "Play background video" : "Pause background video"}
        >
          {isPaused ? <Play className="h-5 w-5" fill="currentColor" /> : <Pause className="h-5 w-5" />}
        </button>
      </div>

      <div className="relative z-10 max-w-[1300px] mx-auto w-full px-6 md:px-10 pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="mx-auto flex max-w-4xl flex-col items-start text-left">
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={canShowHeadline ? { opacity: 1 } : { opacity: 0 }}
            transition={reduceMotion ? undefined : { duration: 0.55, ease: "easeOut", delay: 0.05 }}
          >
            {canShowHeadline ? (
              <AnimatedHeadline
                reduceMotion={!!reduceMotion}
                onComplete={() => setIsHeadlineDone(true)}
                text="You are the future of health tech."
              />
            ) : null}
          </motion.div>

          <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            animate={isHeadlineDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={reduceMotion ? undefined : { duration: 0.45, ease: "easeOut", delay: 0 }}
            className="mt-6 md:mt-7"
          >
            <div
              className="min-h-[2.25rem] md:min-h-[2.75rem] text-rellia-mint text-xl md:text-3xl font-urbanist"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="text-rellia-mint">We help you </span>
              {reduceMotion ? (
                <span className="text-rellia-mint">{rotatingLines[0]}</span>
              ) : (
                <span className="inline-grid align-baseline">
                  <AnimatePresence mode="sync" initial={false}>
                    <motion.span
                      key={rotatingLineIndex}
                      initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="col-start-1 row-start-1 inline-block text-rellia-mint"
                    >
                      {rotatingLines[rotatingLineIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              )}
            </div>
          </motion.div>

          <motion.p
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={isHeadlineDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={reduceMotion ? undefined : { duration: 0.55, ease: "easeOut", delay: 0 }}
            className="mt-10 md:mt-12 text-white/85 text-lg md:text-2xl font-urbanist leading-snug max-w-2xl"
          >
            Rellia helps founders achieve their milestones to launch their healthcare innovations.
          </motion.p>

          <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={isHeadlineDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={reduceMotion ? undefined : { duration: 0.6, ease: "easeOut", delay: 0 }}
            className="mt-10 flex w-full flex-col items-stretch justify-start gap-4 sm:w-auto sm:flex-row sm:items-center"
          >
            <RelliaAction
              type="button"
              variant="heroSolidOnTeal"
              size="comfortable"
              onClick={() => navigate(content.primaryCtaPath)}
              aria-label={content.primaryCtaLabel}
            >
              {content.primaryCtaLabel}
              <ArrowRight aria-hidden />
            </RelliaAction>

            <RelliaAction
              type="button"
              variant="heroGhostOnTeal"
              size="comfortable"
              onClick={() => navigate(content.secondaryCtaPath)}
              aria-label={content.secondaryCtaLabel}
            >
              {content.secondaryCtaLabel}
              <ArrowRight aria-hidden />
            </RelliaAction>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
