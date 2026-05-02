import { useId, useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import NetworkJumpNav from "@/components/NetworkJumpNav"

/** Diagonal teal wave strokes rising from the left (large rotated SVG). */
const PathsSectionDiagonalWaves = ({ gradientId }: { gradientId: string }) => {
  const wavePaths = [
    "M -80 120 C 180 40, 380 220, 620 140 C 820 80, 1020 120, 1240 200 C 1420 260, 1580 200, 1760 160",
    "M -100 200 C 160 120, 360 300, 600 220 C 800 160, 1000 200, 1220 280 C 1400 340, 1560 280, 1740 240",
    "M -120 280 C 140 200, 340 380, 580 300 C 780 240, 980 280, 1200 360 C 1380 420, 1540 360, 1720 320",
    "M -100 360 C 180 280, 400 460, 640 380 C 840 320, 1060 360, 1280 440 C 1460 500, 1620 440, 1800 400",
    "M -90 440 C 200 360, 420 540, 660 460 C 860 400, 1080 440, 1300 520 C 1480 580, 1640 520, 1820 480",
  ]

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        className="absolute -left-[28%] top-[-18%] h-[135%] w-[165%] -rotate-[15deg] opacity-[0.38] md:-left-[22%] md:top-[-14%] md:opacity-[0.44]"
        viewBox="0 0 1200 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0D3540" stopOpacity="0.7" />
            <stop offset="35%" stopColor="#2A8A8A" stopOpacity="0.45" />
            <stop offset="68%" stopColor="#9DD6D0" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#EEF2F2" stopOpacity="0" />
          </linearGradient>
        </defs>
        {wavePaths.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={`url(#${gradientId})`}
            strokeWidth={i === 0 ? 2.75 : i === 2 ? 2 : 1.5}
            opacity={i === 0 ? 1 : i === 1 ? 0.88 : i === 2 ? 0.72 : i === 3 ? 0.55 : 0.4}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  )
}

/** Layered soft mint blurs for atmosphere */
const MintBlurField = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -left-[20%] top-[8%] h-[420px] w-[420px] rounded-full bg-rellia-mint/45 blur-[100px] md:h-[520px] md:w-[520px] md:blur-[120px]" />
    <div className="absolute left-[5%] top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-rellia-mint/35 blur-[90px] md:h-[480px] md:w-[480px] md:blur-[110px]" />
    <div className="absolute -left-[8%] bottom-[12%] h-[340px] w-[340px] rounded-full bg-rellia-mint/40 blur-[85px] md:h-[440px] md:w-[440px]" />
    <div className="absolute left-[18%] top-[22%] h-[280px] w-[280px] rounded-full bg-rellia-mint/30 blur-[72px] md:h-[360px] md:w-[360px]" />
    <div className="absolute left-1/4 bottom-[8%] h-[260px] w-[260px] rounded-full bg-rellia-mint/28 blur-[68px] md:left-[30%] md:h-[320px] md:w-[320px]" />
    <div className="absolute right-[8%] top-[35%] h-[220px] w-[220px] rounded-full bg-rellia-mint/22 blur-[60px] md:h-[280px] md:w-[280px]" />
  </div>
)

export default function PathsSection() {
  const waveGradId = useId().replace(/:/g, "")
  const sectionRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-12% 0px -28% 0px" })
  const reduceMotion = useReducedMotion()

  const headerHidden = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }
  const headerVisible = { opacity: 1, y: 0 }
  const navHidden = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 52 }
  const navVisible = { opacity: 1, y: 0 }

  return (
    <section
      ref={(node) => {
        sectionRef.current = node
      }}
      id="paths-section"
      className={cn(
        "relative w-full overflow-hidden px-6 md:px-10",
        "min-h-[72vh] md:min-h-[76vh] lg:min-h-[78vh]",
        "bg-gradient-to-b from-rellia-cream via-[#E6EEEE] to-rellia-greyTeal/35",
        "py-24 md:py-36 lg:py-44",
      )}
    >
      <MintBlurField />
      <PathsSectionDiagonalWaves gradientId={waveGradId} />

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1300px] flex-col items-center">
        <motion.h2
          initial={headerHidden}
          animate={isInView ? headerVisible : headerHidden}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 0.78, ease: [0.16, 1, 0.3, 1] }
          }
          className={cn(
            "relative mx-auto max-w-4xl text-center font-host-grotesk text-3xl font-semibold leading-[1.15] tracking-tight text-black md:text-[44px]",
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-[-18%] inset-y-[-55%] -z-10 opacity-80 blur-[56px] md:blur-[72px]"
            style={{
              background:
                "radial-gradient(closest-side at 45% 42%, rgba(157,214,208,0.65), rgba(157,214,208,0.35) 45%, rgba(157,214,208,0) 75%)",
            }}
          />
          <span className="pointer-events-none absolute inset-x-[-25%] inset-y-[-40%] -z-10 opacity-50 blur-3xl md:blur-[40px]" aria-hidden>
            <span className="absolute left-[20%] top-0 h-[120%] w-[65%] rounded-full bg-rellia-mint/50 blur-3xl" />
          </span>
          <span className="block">
            Find <span className="text-rellia-teal">your place</span> in the
          </span>
          <span className="mt-1 block md:mt-1.5">
            <span className="text-rellia-teal">Rellia</span> community.
          </span>
        </motion.h2>

        <motion.div
          initial={navHidden}
          animate={isInView ? navVisible : navHidden}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.72, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
          }
          className="mt-20 w-full md:mt-28 lg:mt-36"
        >
          <NetworkJumpNav mode="networkRoute" hoverVariant="lift" className="mx-auto w-full max-w-[1150px]" />
        </motion.div>
      </div>
    </section>
  )
}
