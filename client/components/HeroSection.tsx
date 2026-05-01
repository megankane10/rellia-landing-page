import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { HomePageContent } from "@shared/cms/types"
import { ArrowRight } from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import { motion, useReducedMotion } from "framer-motion"

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

  useEffect(() => {
    if (reduceMotion) {
      setShowBelowFold(true)
      return
    }
    const t = window.setTimeout(() => setShowBelowFold(true), 520)
    return () => window.clearTimeout(t)
  }, [reduceMotion])

  const headline = (content.headlinePrefix ?? "").trim() || "You are the future of health tech."

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

      {/* Softer teal wash so image stays visible */}
      <div aria-hidden className="absolute inset-0 bg-rellia-teal/45" />

      {/* Left-to-right gradient — extra contrast under the headline */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-rellia-teal/85 via-rellia-teal/55 to-rellia-teal/35"
      />

      <div className="relative z-10 max-w-[1300px] mx-auto w-full px-6 md:px-10 pt-24 pb-12 md:pt-28 md:pb-24">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
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
              className="text-balance font-host-grotesk text-[46px] font-medium leading-[0.95] tracking-tight text-rellia-mint md:text-[68px] lg:text-[82px]"
            >
              {headline}
            </motion.h1>
          </motion.div>

          <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={showBelowFold ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={reduceMotion ? undefined : { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="mt-8 md:mt-9"
          >
            <p className="mx-auto max-w-2xl text-pretty font-urbanist text-xl leading-relaxed text-white md:text-2xl">
              {content.subheadline}
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={showBelowFold ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={reduceMotion ? undefined : { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
            className="mt-12 flex w-full flex-col items-center justify-center gap-4 sm:mt-14 sm:w-auto sm:flex-row"
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
