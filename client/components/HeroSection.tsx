import { useCallback, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { HomePageContent } from "@shared/cms/types"
import { ArrowRight, Pause, Play } from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import WordRevealHeading from "@/components/WordRevealHeading"
import { motion, useReducedMotion } from "framer-motion"

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

export default function HeroSection({ content }: HeroSectionProps) {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPaused, setIsPaused] = useState(false)

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
    <section className="relative min-h-screen flex items-center bg-rellia-teal overflow-hidden">
      {/* Video background */}
      <video
        ref={videoRef}
        poster="/images/heroPoster-home.png"
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center"
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
      >
        <source src="/videos/homehero.mp4" type="video/mp4" />
      </video>

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
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? undefined : { duration: 1.1, ease: "easeOut" }}
          >
            <WordRevealHeading
              text={`${content.headlinePrefix} ${content.headlineAccent}`}
              as="h1"
              className="font-host-grotesk font-medium text-white text-5xl md:text-7xl lg:text-[88px] leading-[0.95] tracking-tight"
              wordClassName="will-change-transform"
            />
          </motion.div>

          <motion.p
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? undefined : { duration: 1.0, ease: "easeOut", delay: 0.35 }}
            className="mt-10 md:mt-12 text-white/85 text-lg md:text-2xl font-urbanist leading-snug max-w-2xl"
          >
            {content.subheadline}
          </motion.p>

          <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? undefined : { duration: 1.0, ease: "easeOut", delay: 0.55 }}
            className="mt-10 flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:flex-row sm:items-center"
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
