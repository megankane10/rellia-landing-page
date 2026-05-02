import { useId, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  Building2,
  Check,
  GraduationCap,
  Rocket,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import RelliaAction from "@/components/RelliaAction"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

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

/** Layered soft mint blurs — kept in the upper band so hero copy stays clean */
const MintBlurField = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -left-[22%] -top-[18%] h-[360px] w-[360px] rounded-full bg-rellia-mint/42 blur-[100px] md:h-[460px] md:w-[460px] md:blur-[118px]" />
    <div className="absolute -left-[6%] -top-[8%] h-[300px] w-[300px] rounded-full bg-rellia-mint/36 blur-[88px] md:h-[400px] md:w-[400px]" />
    <div className="absolute left-[14%] top-[-6%] h-[260px] w-[260px] rounded-full bg-rellia-mint/32 blur-[76px] md:h-[340px] md:w-[340px]" />
    <div className="absolute right-[4%] -top-[12%] h-[280px] w-[280px] rounded-full bg-rellia-mint/28 blur-[72px] md:h-[360px] md:w-[360px]" />
    <div className="absolute right-[-12%] top-[6%] h-[240px] w-[240px] rounded-full bg-rellia-mint/24 blur-[64px] md:h-[300px] md:w-[300px]" />
    <div className="absolute left-1/3 top-[14%] h-[200px] w-[200px] -translate-x-1/2 rounded-full bg-rellia-mint/20 blur-[58px] md:h-[260px] md:w-[260px]" />
  </div>
)

const ROLE_IDS = ["founder", "advisor", "investor", "partner"] as const
type RoleId = (typeof ROLE_IDS)[number]

const ROLE_META: Record<
  RoleId,
  {
    label: string
    headlineWord: string
    icon: LucideIcon
    benefits: string[]
    imageSrc: string
    imageAlt: string
    ctaLabel: string
    ctaTo: string
  }
> = {
  founder: {
    label: "Founder",
    headlineWord: "Founder",
    icon: Rocket,
    benefits: [
      "Programs and mentors tuned to validation, regulatory readiness, and fundraising proof.",
      "Peer founders and advisors who understand health-tech timelines and procurement.",
      "A clear path from milestone to milestone—without navigating the network alone.",
    ],
    imageSrc: "/images/paths-founder-pexels.jpg",
    imageAlt: "Team of founders collaborating around a table",
    ctaLabel: "Explore for founders",
    ctaTo: "/founders",
  },
  advisor: {
    label: "Advisor",
    headlineWord: "Advisor",
    icon: GraduationCap,
    benefits: [
      "Structured ways to contribute expertise without open-ended overhead.",
      "Visibility into teams and domains where your guidance moves outcomes.",
      "Recognition and rhythm that fit alongside your day job or clinical practice.",
    ],
    imageSrc: "/images/paths-advisor-pexels.jpg",
    imageAlt: "Professional advisor working with a colleague",
    ctaLabel: "Explore for advisors",
    ctaTo: "/advisors",
  },
  investor: {
    label: "Investor",
    headlineWord: "Investor",
    icon: TrendingUp,
    benefits: [
      "Curated introductions to ventures aligned with thesis and stage.",
      "Signal on traction, diligence posture, and sector fit before deeper conversations.",
      "Community context that complements your own sourcing—not a firehose of decks.",
    ],
    imageSrc: "/images/paths-investor-pexels.jpg",
    imageAlt: "Investor in conversation during a business meeting",
    ctaLabel: "Explore for investors",
    ctaTo: "/investors",
  },
  partner: {
    label: "Partner",
    headlineWord: "Partner",
    icon: Building2,
    benefits: [
      "Programs and placements that put your brand alongside founders solving real care problems.",
      "Trusted introductions and co-built moments—not generic sponsorship inventory.",
      "A partner lane aligned with industry partners and directory visibility where it fits.",
    ],
    imageSrc: "/images/paths-partner-pexels.jpg",
    imageAlt: "Two partners shaking hands after an agreement",
    ctaLabel: "Explore for partners",
    ctaTo: "/industry-partners",
  },
}

export default function PathsSection() {
  const waveGradId = useId().replace(/:/g, "")
  const sectionRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-12% 0px -28% 0px" })
  const reduceMotion = useReducedMotion()
  const [role, setRole] = useState<RoleId>("founder")

  const headerHidden = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }
  const headerVisible = { opacity: 1, y: 0 }
  const navHidden = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 52 }
  const navVisible = { opacity: 1, y: 0 }

  const panel = ROLE_META[role]
  const PanelIcon = panel.icon

  const handleRoleChange = (value: string) => {
    if (
      value === "founder" ||
      value === "advisor" ||
      value === "investor" ||
      value === "partner"
    ) {
      setRole(value)
    }
  }

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
        <motion.div
          initial={headerHidden}
          animate={isInView ? headerVisible : headerHidden}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 0.78, ease: [0.16, 1, 0.3, 1] }
          }
          className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-[-20%] top-[-92%] bottom-[72%] -z-10 opacity-75 blur-[52px] md:blur-[68px]"
            style={{
              background:
                "radial-gradient(ellipse 88% 70% at 50% 98%, rgba(157,214,208,0.58), rgba(157,214,208,0.28) 48%, rgba(157,214,208,0) 72%)",
            }}
          />
          <span
            className="pointer-events-none absolute inset-x-[-28%] top-[-72%] bottom-[78%] -z-10 opacity-45 blur-3xl md:blur-[38px]"
            aria-hidden
          >
            <span className="absolute left-[18%] top-[62%] h-[48%] w-[62%] rounded-full bg-rellia-mint/45 blur-3xl" />
          </span>

          <div className="flex w-full flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center md:gap-x-4 md:gap-y-3">
            <span className="mr-1 pr-3 font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-black md:mr-0 md:pr-5 md:text-[44px] md:leading-[1.15]">
              I am a
            </span>
            <ToggleGroup
              type="single"
              value={role}
              onValueChange={handleRoleChange}
              aria-label="Choose your role"
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {ROLE_IDS.map((id) => (
                <ToggleGroupItem
                  key={id}
                  value={id}
                  variant="outline"
                  size="lg"
                  className={cn(
                    "rounded-full border-rellia-teal/30 bg-white/90 px-5 py-2.5 font-host-grotesk text-base font-semibold text-black shadow-sm",
                    "transition-colors duration-200 data-[state=on]:border-rellia-teal data-[state=on]:bg-rellia-teal data-[state=on]:text-white",
                    "hover:bg-white focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2",
                  )}
                >
                  {ROLE_META[id].headlineWord}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <p className="mt-5 max-w-xl font-urbanist text-base leading-relaxed text-black md:mt-6 md:text-lg">
            Find your place in the Rellia community.
          </p>
        </motion.div>

        <motion.div
          initial={navHidden}
          animate={isInView ? navVisible : navHidden}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 0.72, delay: 0.12, ease: [0.16, 1, 0.3, 1] }
          }
          className="mt-14 w-full md:mt-16"
        >
          <div className="mx-auto w-full max-w-[1150px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={role}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={
                  reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                }
                className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-12"
              >
                <div className="flex min-h-0 flex-col text-left">
                  <PanelIcon
                    className="h-14 w-14 shrink-0 text-rellia-teal md:h-16 md:w-16"
                    aria-hidden
                    strokeWidth={1.35}
                  />
                  <h3 className="mt-5 font-host-grotesk text-xl font-semibold tracking-tight text-black md:mt-6 md:text-2xl">
                    Built for {panel.label.toLowerCase()}s like you
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {panel.benefits.map((line) => (
                      <li key={line} className="flex gap-3">
                        <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rellia-teal">
                          <Check className="h-3.5 w-3.5 text-white" aria-hidden strokeWidth={2.5} />
                        </span>
                        <span className="font-urbanist text-base leading-relaxed text-black opacity-100 md:text-[17px]">
                          {line}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <RelliaAction
                    asChild
                    variant="creamCtaHeroFill"
                    size="comfortable"
                    className="mt-12 self-start px-7 py-3 text-sm md:mt-14 md:text-base"
                  >
                    <Link
                      to={panel.ctaTo}
                      className="inline-flex items-center gap-2 focus-visible:outline-none"
                    >
                      {panel.ctaLabel}
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                    </Link>
                  </RelliaAction>
                </div>

                <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl border border-black/10 shadow-[0_24px_60px_-40px_rgba(13,53,64,0.35)] lg:mx-0 lg:max-w-none lg:aspect-[5/4]">
                  <img
                    src={panel.imageSrc}
                    alt={panel.imageAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
