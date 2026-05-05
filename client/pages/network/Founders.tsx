import { usePexelsPhoto } from "@/hooks/usePexelsPhoto"
import { useEffect, useMemo, useRef, useState } from "react"
import { PAGE_HEADER_TITLE_SIZE_CLASS } from "@/components/PageHeader"
import NetworkEyebrow from "@/components/network/NetworkEyebrow"
import SectionHeading from "@/components/SectionHeading"
import MembershipPathTimeline from "@/components/MembershipPathTimeline"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LogoMarquee from "@/components/LogoMarquee"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import { relliaTealGlassCardClass } from "@/lib/relliaTealGlassCard"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  GraduationCap,
  Hammer,
  Lightbulb,
  Mail,
  MessagesSquare,
  Percent,
  Rocket,
  ShieldCheck,
  Stethoscope,
  Target,
  UserPlus,
  Users,
  Video,
  X,
} from "lucide-react"
import { Link } from "react-router-dom"
import { NETWORK_PATH_ROLE_TAG } from "@/lib/networkPathRoles"
import ScrollReveal from "@/components/ScrollReveal"
import { CreamSection, LightSection, Reveal } from "./_shared"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

const HERO_FALLBACK = "/images/founders-header.jpg"

const ELIGIBILITY_BENTO_ITEMS = [
  {
    text: "Digital health & care delivery software",
    pexelsQuery: "doctor nurse tablet hospital electronic health record patient care",
    fallbackUrl:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    text: "Software as a medical device (SaMD) and connected devices",
    pexelsQuery: "medical device engineer FDA software prototype healthcare technology",
    fallbackUrl:
      "https://images.pexels.com/photos/3825539/pexels-photo-3825539.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    text: "Diagnostics, lab, and decision-support platforms",
    pexelsQuery: "laboratory diagnostics blood test microscope pathology healthcare lab",
    fallbackUrl:
      "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    text: "Medtech and DTx with a credible path to evidence and regulation",
    pexelsQuery: "clinical research hospital evidence healthcare regulatory quality assurance",
    fallbackUrl:
      "https://images.pexels.com/photos/7088489/pexels-photo-7088489.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    text: "Founding teams from idea through Series A who can execute in healthcare complexity",
    pexelsQuery: "health tech startup founders meeting office collaboration pitch",
    fallbackUrl:
      "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
] as const

const MEMBERSHIP_VALUE_PROPS = [
  {
    title: "Warm, qualified intros",
    body: "Introductions to investors, partners, and clinicians who understand your stage—not spray-and-pray blasts.",
    icon: UserPlus,
  },
  {
    title: "Slack community with signal",
    body: "A vetted network where people answer with operator context because application review keeps quality high.",
    icon: MessagesSquare,
  },
  {
    title: "Programs for healthcare reality",
    body: "Workshops and tracks built for regulatory, clinical, and commercial work—not generic startup content.",
    icon: GraduationCap,
  },
  {
    title: "Equity-friendly access",
    body: "Depth from experienced advisors and operators without giving up ownership to join.",
    icon: Percent,
  },
] as const

type JourneyZone = "outside" | "rellia"

type JourneyStep = {
  id: string
  label: string
  zone: JourneyZone
  detail: string
}

const JOURNEY_TIMELINE: JourneyStep[] = [
  {
    id: "idea",
    label: "Product idea",
    zone: "outside",
    detail:
      "Exploring problems and narratives on your own or with peers—the groundwork before scoped execution. Not where Rellia substitutes for your discovery process.",
  },
  {
    id: "edu",
    label: "Industry education",
    zone: "outside",
    detail:
      "Learning reimbursement, stakeholder maps, and regulatory vocabulary broadly available through courses and content—foundational, not a substitute for operator feedback.",
  },
  {
    id: "problem",
    label: "Problem statement",
    zone: "outside",
    detail:
      "Clarifying who benefits and what would count as success in a care or buyer workflow. Rellia does not write your strategy doc for you—but we help pressure-test it once you’re building.",
  },
  {
    id: "mvp",
    label: "MVP development",
    zone: "rellia",
    detail:
      "Ship a scope operators can review: safety basics, interoperability touchpoints, and a validation plan that won’t be thrown away in the next phase.",
  },
  {
    id: "feedback",
    label: "User feedback",
    zone: "rellia",
    detail:
      "Structured feedback from clinicians, patients, and buyers so you learn what to fix before you scale sales or studies.",
  },
  {
    id: "funding",
    label: "Funding",
    zone: "rellia",
    detail:
      "A de-risked story: milestones, clinical or economic logic, and a use-of-funds plan that matches healthcare diligence.",
  },
  {
    id: "reg",
    label: "Regulatory",
    zone: "rellia",
    detail:
      "Map QMS, labeling, and risk early so evidence and software releases stay aligned to submission pathways.",
  },
  {
    id: "clinical",
    label: "Clinical evidence",
    zone: "rellia",
    detail:
      "Pilots and studies that produce decision-grade signal: workflow fit, outcomes, and endpoints buyers actually care about.",
  },
  {
    id: "commercial",
    label: "Commercialization",
    zone: "rellia",
    detail:
      "Repeatable revenue: pricing, procurement, channel partners, and delivery that holds up at scale.",
  },
  {
    id: "launch",
    label: "Launch & scale",
    zone: "rellia",
    detail:
      "Grow into health systems and markets with the intros, playbooks, and peer network to sustain momentum after first revenue.",
  },
]

const ENGAGEMENT = [
  {
    title: "Apply for membership",
    body: "Single application—we route you to the right onboarding.",
    to: "/apply",
    icon: UserPlus,
  },
  {
    title: "Browse programs",
    body: "Structured tracks from QMS foundations to cohort programs.",
    to: "/programs",
    icon: BookOpen,
  },
  {
    title: "Virtual events",
    body: "Learn from operators and meet peers in health tech.",
    to: "/events",
    icon: Video,
  },
  {
    title: "Contact us",
    body: "We’ll point you to the fastest next step.",
    to: "/contact",
    icon: Mail,
  },
] as const

const CONSULTING_FEATURES = [
  {
    title: "Regulatory + evidence planning",
    body: "QMS foundations, pathway mapping, and study planning you can take to diligence and buyers.",
    icon: CheckCircle2,
  },
  {
    title: "Narrative + diligence preparation",
    body: "Positioning, milestones, and materials built for healthcare scrutiny—not pitch-deck theater.",
    icon: BookOpen,
  },
  {
    title: "Commercial + buyer workflow",
    body: "Procurement reality checks, pricing logic, and adoption constraints that show up in pilots.",
    icon: Users,
  },
  {
    title: "Warm intros (when you're ready)",
    body: "Introductions matched to your roadmap so you talk to the right operators, partners, and investors.",
    icon: UserPlus,
  },
] as const

function DeeperHelpValuesSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 95%", "end 5%"],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"])

  const bgSrc = usePexelsPhoto({
    query: "healthcare startup team meeting",
    fallbackUrl: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1600",
    orientation: "landscape",
  })

  return (
    <section
      ref={(node) => {
        sectionRef.current = node
      }}
      className="relative w-full overflow-hidden bg-white"
    >
      <div className="relative w-full overflow-hidden">
        <div className="relative min-h-[880px] w-full overflow-hidden sm:min-h-[920px] md:min-h-[900px] lg:min-h-[980px]">
          <div className="absolute inset-0 overflow-hidden" aria-hidden>
            <motion.img
              src={bgSrc}
              alt=""
              className="h-full w-full object-cover scale-[1.12] object-[55%_50%]"
              style={reduceMotion ? undefined : { y: bgY }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-rellia-teal/35" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-[1300px] flex-col px-6 pb-16 pt-12 md:px-10 md:pb-18 md:pt-14">
            <div className="flex flex-col items-start text-left mt-8 md:mt-10 lg:mt-24">
              <ScrollReveal>
                <div className="mb-7 md:mb-8">
                  <NetworkEyebrow label="1:1 depth" tone="onDark" />
                </div>
                <h2 className={cn("max-w-4xl font-host-grotesk font-bold leading-tight tracking-tight text-white", PAGE_HEADER_TITLE_SIZE_CLASS)}>
                  Need deeper help?
                </h2>
                <p className="mt-5 max-w-2xl font-urbanist text-lg leading-relaxed text-white/80 md:text-xl">
                  Scoped working sessions beyond community rhythm—clear deliverables for the milestone you&apos;re staring down.
                </p>
                <RelliaAction asChild variant="mintOnTealStrip" size="comfortable" className="mt-8">
                  <Link to="/consulting" className="inline-flex cursor-pointer items-center gap-2" aria-label="Explore consulting">
                    Explore consulting
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </RelliaAction>
              </ScrollReveal>
            </div>

            <div className="mt-12 sm:mt-[4.8rem] md:mt-[7.2rem] lg:mt-[8.4rem] lg:flex lg:flex-1 lg:items-center">
              <div className="w-full">
                <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {CONSULTING_FEATURES.map((v, i) => {
                    const Icon = v.icon
                    return (
                      <ScrollReveal key={v.title} delay={i * 0.08} className="h-full">
                        <div
                          className={cn(
                            relliaTealGlassCardClass,
                            "flex h-full min-h-[200px] flex-col px-5 py-5 sm:min-h-[220px] sm:px-6 sm:py-6 md:min-h-[250px] md:px-7 md:py-8",
                          )}
                        >
                          <Icon className="h-6 w-6 shrink-0 text-rellia-mint sm:h-7 sm:w-7" aria-hidden />
                          <p className="mt-3 font-host-grotesk text-base font-semibold leading-snug tracking-tight text-white sm:mt-4 sm:text-lg md:text-xl">
                            {v.title}
                          </p>
                          <p className="mt-2 flex-1 font-urbanist text-sm leading-normal text-white/80 sm:mt-3 sm:text-base md:text-lg">
                            {v.body}
                          </p>
                        </div>
                      </ScrollReveal>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FoundersHero() {
  const heroSrc = HERO_FALLBACK

  return (
    <section className="relative overflow-hidden bg-rellia-teal pt-[72px] md:pt-[86px] lg:flex lg:flex-1 lg:flex-col lg:min-h-0 lg:pt-[96px]">
      <img
        src={heroSrc}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal/[0.88] via-rellia-teal/72 to-[#0a2830]/82" aria-hidden />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_20%_20%,rgba(167,219,214,0.35),transparent_50%),radial-gradient(circle_at_85%_30%,rgba(255,255,255,0.14),transparent_45%)]" />
      <img
        src="/images/hologram-logo.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 w-[min(52vw,420px)] opacity-[0.07] md:right-0"
      />

      <div className="relative z-10 mx-auto max-w-[1300px] px-6 pb-20 pt-10 md:px-10 md:pb-28 md:pt-14 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:pb-20 lg:pt-0">
        <NetworkEyebrow label="Founders" tone="onDark" className="mb-6 md:mb-8" />
        <h1
          className={cn(
            "max-w-4xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-sm",
            PAGE_HEADER_TITLE_SIZE_CLASS,
          )}
        >
          Are you building in <span className="text-rellia-mint">health tech?</span>
        </h1>
        <p className="mt-6 max-w-2xl font-urbanist text-lg leading-relaxed text-white/80 md:text-xl">
          You&apos;re building something that can change healthcare. We bring the experts, programs, and connections to help
          you get there.
        </p>
        <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
          <RelliaAction
            asChild
            variant="mintOnTealStrip"
            size="comfortable"
            className="w-full min-w-0 justify-center sm:min-w-[220px] sm:w-auto"
          >
            <Link to="/apply" className="inline-flex w-full cursor-pointer items-center justify-center gap-2 sm:w-auto" aria-label="Apply to join Rellia">
              Apply to join
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </RelliaAction>
          <RelliaAction
            asChild
            variant="heroGhostOnTeal"
            size="comfortable"
            className="w-full min-w-0 justify-center border-white/45 hover:border-white/70 sm:min-w-[220px] sm:w-auto"
          >
            <Link to="/founders/directory" className="inline-flex w-full cursor-pointer items-center justify-center sm:w-auto">
              Browse startups
            </Link>
          </RelliaAction>
        </div>
      </div>
    </section>
  )
}

type EligibilityBentoItem = (typeof ELIGIBILITY_BENTO_ITEMS)[number]

const EligibilityBentoCard = ({
  item,
  className,
  featured,
}: {
  item: EligibilityBentoItem
  className?: string
  featured?: boolean
}) => {
  const src = usePexelsPhoto({
    query: item.pexelsQuery,
    fallbackUrl: item.fallbackUrl,
    orientation: "landscape",
  })

  return (
    <article
      className={cn(
        "group relative flex min-h-[220px] flex-col overflow-hidden rounded-[22px] border border-black/10 shadow-[0_24px_60px_-42px_rgba(13,53,64,0.5)] md:min-h-[240px] lg:h-full lg:min-h-0",
        className,
      )}
    >
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        loading="lazy"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/5 to-transparent" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
      <div className="relative z-10 flex h-full min-h-0 w-full flex-1 flex-col justify-end p-5 text-left md:p-7">
        <p
          className={cn(
            "self-start font-host-grotesk font-semibold leading-snug tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.5)]",
            featured
              ? "max-w-[min(100%,18rem)] text-xl sm:max-w-[20rem] sm:text-2xl md:max-w-[22rem] md:text-[1.65rem] md:leading-snug lg:text-[1.85rem] lg:leading-[1.2]"
              : "max-w-[min(100%,13rem)] text-lg sm:max-w-[15rem] sm:text-xl md:max-w-[17rem] md:text-[1.35rem] md:leading-snug lg:max-w-[18rem] lg:text-[1.45rem]",
          )}
        >
          {item.text}
        </p>
      </div>
    </article>
  )
}

function EligibilitySection() {
  return (
    <section className="w-full bg-rellia-cream/25 px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1300px]">
        <NetworkEyebrow label="Who it's for" tone="onLight" />
        <SectionHeading
          animated={false}
          title="Built for serious health tech teams"
          description="Rellia works with companies where healthcare complexity is core to the product—evidence, regulation, workflow, and traction at once."
          className="mt-5 max-w-3xl [&>p]:max-w-[min(100%,22rem)] [&>p]:text-left [&>p]:leading-relaxed"
        />

        <div
          className={cn(
            "mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5",
            "lg:mt-14 lg:grid-cols-4 lg:grid-rows-3 lg:gap-5 lg:[grid-auto-rows:minmax(200px,1fr)]",
          )}
        >
          {ELIGIBILITY_BENTO_ITEMS.map((item, idx) => (
            <EligibilityBentoCard
              key={item.text}
              item={item}
              featured={idx === 0}
              className={cn(
                idx === 0 && "lg:col-span-2 lg:row-span-2 lg:min-h-[380px]",
                idx === 1 && "lg:col-span-2 lg:row-start-1 lg:col-start-3",
                idx === 2 && "lg:col-span-2 lg:row-start-2 lg:col-start-3",
                idx === 3 && "lg:col-span-2 lg:row-start-3 lg:col-start-1",
                idx === 4 && "lg:col-span-2 lg:row-start-3 lg:col-start-3",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/** Visual shell aligned with homepage {@link HowItWorks} — teal band, ambient blobs, hologram watermark */
function EngageTealBand() {
  return (
    <section className="relative w-full overflow-hidden bg-rellia-teal px-6 py-16 md:px-10 md:py-24">
      <img
        src="/images/hologram-logo.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-16 top-6 w-[320px] max-w-[55vw] opacity-[0.06] md:right-0 md:top-4 md:w-[420px]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-10 h-[420px] w-[420px] rounded-full bg-rellia-mint/22 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[480px] w-[480px] rounded-full bg-rellia-mint/16 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.2] [background-image:radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.14),transparent_52%),radial-gradient(circle_at_75%_40%,rgba(157,214,208,0.12),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1300px]">
        <ScrollReveal>
          <div className="mb-8 md:mb-10">
            <NetworkEyebrow label="Engage" tone="onDark" />
            <h2 className="mt-5 font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-white md:text-[40px]">
              How to <span className="text-rellia-mint">plug in</span> this week
            </h2>
            <p className="mt-4 max-w-2xl font-urbanist text-base font-medium leading-relaxed text-white/80 md:text-lg">
              Every path reconnects to the same high-trust network—pick what fits your sprint.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <div className="mt-16 grid grid-cols-1 gap-7 md:mt-20 md:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-6">
            {ENGAGEMENT.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  to={item.to}
                  className="group flex h-full min-h-[168px] flex-col rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md transition duration-300 hover:border-rellia-mint/40 hover:bg-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal sm:min-h-[184px] sm:p-6"
                >
                  <Icon className="h-7 w-7 text-rellia-mint transition-transform duration-300 group-hover:scale-105" aria-hidden />
                  <p className="mt-5 font-host-grotesk text-lg font-semibold leading-snug tracking-tight text-white">
                    {item.title}
                  </p>
                  <p className="mt-3 flex-1 font-urbanist text-sm leading-relaxed text-white/80">{item.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 font-urbanist text-sm font-semibold text-rellia-mint">
                    Continue
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              )
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function MembershipDifferentSection() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1300px]">
        <NetworkEyebrow label="Membership" tone="onLight" />
        <SectionHeading
          animated={false}
          title="What makes Rellia membership different"
          description="Operator-led support in a community where quality is defended by application review—not open signup churn."
          className="mt-5"
        />
        <div className="mt-16 grid grid-cols-1 items-start gap-10 sm:grid-cols-2 md:mt-20 md:gap-x-12 md:gap-y-14 lg:mt-24 lg:gap-x-16 lg:gap-y-16">
          {MEMBERSHIP_VALUE_PROPS.map((item, idx) => {
            const Icon = item.icon
            return (
              <Reveal key={item.title} delay={0.05 * idx}>
                <div className="flex w-full flex-col items-start text-left">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rellia-teal/5 text-rellia-teal">
                    <Icon className="h-6 w-6 shrink-0" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-host-grotesk text-xl font-semibold text-rellia-teal md:text-2xl">{item.title}</h3>
                  <p className="mt-3 font-urbanist text-base leading-relaxed text-black/75 md:text-lg">{item.body}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function JourneySplitSection() {
  const relliaSteps = JOURNEY_TIMELINE.filter((s) => s.zone === "rellia")
  const outsideSteps = JOURNEY_TIMELINE.filter((s) => s.zone === "outside")

  const journeyIconById = {
    idea: Lightbulb,
    edu: GraduationCap,
    problem: MessagesSquare,
    mvp: Hammer,
    feedback: MessagesSquare,
    funding: Percent,
    reg: ShieldCheck,
    clinical: Stethoscope,
    commercial: Target,
    launch: Rocket,
  } satisfies Record<JourneyStep["id"], typeof Lightbulb>

  return (
    <LightSection className="bg-rellia-cream/20 py-14 md:py-20">
      <div className="mx-auto max-w-[1300px]">
        <NetworkEyebrow label="Journey" tone="onLight" />
        <SectionHeading
          animated={false}
          title="Where Rellia meets your trajectory"
          description="We help you execute in healthcare complexity once you have direction—without replacing early discovery."
          className="mt-5 max-w-3xl"
        />

        <div className="mt-16 space-y-12 md:mt-20 md:space-y-16">
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[200px_1fr] lg:gap-12">
            <div>
              <p className="font-host-grotesk text-base font-semibold uppercase tracking-[0.14em] text-black/55">
                You own
              </p>
              <p className="mt-3 font-urbanist text-base leading-relaxed text-black/70">
                We won&apos;t replace early thinking—problem selection, learning, and narrative formation stays yours.
              </p>
            </div>

            <div className="grid grid-cols-1 justify-items-start gap-10 sm:grid-cols-2 sm:justify-items-end sm:gap-6 xl:grid-cols-3">
              {outsideSteps.map((m) => {
                const Icon = journeyIconById[m.id]
                return (
                  <div
                    key={m.id}
                    className="flex flex-col items-start text-left md:w-full md:max-w-[280px]"
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rellia-teal/5 text-rellia-teal">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <p className="mt-3 font-host-grotesk text-lg font-semibold leading-snug text-black md:mt-3">
                      {m.label}
                    </p>
                    <p className="mt-1.5 font-urbanist text-sm leading-relaxed text-black/65">
                      {m.detail}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="h-px w-full bg-black/10" aria-hidden />

          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[200px_1fr] lg:gap-12">
            <div>
              <p className="font-host-grotesk text-base font-semibold uppercase tracking-[0.14em] text-rellia-teal/80">
                We help with
              </p>
              <p className="mt-3 font-urbanist text-base leading-relaxed text-black/70">
                Programs, operators, and warm intros aligned to milestones that survive clinical, regulatory, and buyer scrutiny.
              </p>
            </div>

            <div className="grid grid-cols-1 justify-items-start gap-10 sm:grid-cols-2 sm:justify-items-end sm:gap-6 xl:grid-cols-3">
              {relliaSteps.map((m) => {
                const Icon = journeyIconById[m.id]
                return (
                  <div
                    key={m.id}
                    className="flex flex-col items-start text-left md:w-full md:max-w-[280px]"
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rellia-teal text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <p className="mt-3 font-host-grotesk text-lg font-semibold leading-snug text-rellia-teal md:mt-3">
                      {m.label}
                    </p>
                    <p className="mt-1.5 font-urbanist text-sm leading-relaxed text-rellia-teal/80">
                      {m.detail}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </LightSection>
  )
}

function DiagnosticSurveySection() {
  const categories = [
    { name: "Product design & UI/UX", icon: Lightbulb },
    { name: "Technology and architecture", icon: Hammer },
    { name: "Regulatory compliance", icon: ShieldCheck },
    { name: "Clinical evidence", icon: Stethoscope },
    { name: "Legal, privacy, cybersecurity", icon: BookOpen },
    { name: "IP strategy", icon: Target },
    { name: "Reimbursement strategy", icon: Percent },
    { name: "Fundraising and investment readiness", icon: Rocket },
    { name: "Marketing and branding", icon: Users },
    { name: "Go-to-market strategy", icon: Target },
    { name: "Navigating health system procurement and adoption", icon: CheckCircle2 },
    { name: "Customer success", icon: MessagesSquare },
    { name: "Operations and scaling", icon: Rocket },
    { name: "Leadership mindset and resilience", icon: GraduationCap }
  ];

  return (
    <section className="w-full bg-rellia-cream/20 px-6 py-28 md:px-10 md:py-40 border-t border-black/10 flex items-center min-h-[80vh]">
      <div className="mx-auto w-full max-w-[1300px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="flex flex-col items-start lg:sticky lg:top-32">
            <Reveal>
              <NetworkEyebrow label="Assessment" tone="onLight" />
              <h2 className="font-host-grotesk text-3xl font-bold leading-tight tracking-tight text-black md:text-[44px] mt-4 mb-6">
                Startup Diagnostic Survey
              </h2>
              <p className="font-urbanist text-lg md:text-xl leading-relaxed text-black/70 mb-10 max-w-xl">
                A structured, deep-dive assessment of your company to identify the top areas for improvement. Founders receive a personalized gap analysis report and are matched with the most qualified advisors to help address those critical gaps directly.
              </p>
              <RelliaAction asChild variant="mintTealFill" size="comfortable" className="w-full sm:w-auto justify-center">
                <Link to="/survey" className="inline-flex cursor-pointer items-center gap-2">
                  Take Diagnostic Survey
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </Link>
              </RelliaAction>
            </Reveal>
          </div>
          
          <div className="pt-2 lg:pt-4">
            <Reveal delay={0.1}>
              <h3 className="font-host-grotesk text-2xl font-bold text-black mb-8 border-b border-black/10 pb-4">Categories we assess</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                {categories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4">
                      <Icon className="w-6 h-6 text-rellia-teal shrink-0 mt-0.5" strokeWidth={1.5} />
                      <span className="font-host-grotesk font-semibold text-black/90 text-lg leading-snug">{cat.name}</span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Founders() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <div className="lg:flex lg:min-h-screen lg:flex-col">
          <FoundersHero />
          <LogoMarquee
            showHeading={false}
            density="compact"
            sectionClassName="border-b border-black/[0.06] bg-white py-6 md:py-8 lg:flex lg:h-[18vh] lg:min-h-[140px] lg:items-center lg:py-0"
          />
        </div>
        <EligibilitySection />
        <EngageTealBand />
        <MembershipDifferentSection />

        <MembershipPathTimeline
          showRoleLinks={false}
          headingId="founders-membership-path-heading"
          headingTitle={
            <>
              From <span className="text-rellia-teal">application</span> to your first warm intro
            </>
          }
          subheading="Apply, get approved, choose your membership, join Slack, then reach out when you want introductions matched to your roadmap."
          className="border-t border-black/10"
        />

        <JourneySplitSection />

        <DiagnosticSurveySection />

        <DeeperHelpValuesSection />

        <LightSection>
          <div className="mx-auto max-w-[1300px]">
            <Reveal>
              <NetworkEyebrow label="Directories" tone="onLight" />
              <SectionHeading
                animated={false}
                title="Explore the network"
                description="Browse startups and advisors—then apply when you want curated intros and the right programming for your stage."
                className="mt-5"
              />
            </Reveal>

            <div className="mt-14 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-7">
              {[
                {
                  roleId: "founder" as const,
                  title: "See what founders are building",
                  subtitle: "Search by category, stage, and collaboration notes.",
                  to: "/founders/directory",
                  imageSrc: "/images/founders-header.jpg",
                },
                {
                  roleId: "advisor" as const,
                  title: "Find the operators you want",
                  subtitle: "Browse mentors by focus area, industry, and style.",
                  to: "/advisors/directory",
                  imageSrc: "/images/paths-advisor-pexels.jpg",
                },
              ].map((card, idx) => {
                const tag = NETWORK_PATH_ROLE_TAG[card.roleId]
                const TagIcon = tag.icon
                return (
                <Reveal key={card.to} delay={0.06 * idx}>
                  <article className="group relative overflow-hidden rounded-[28px] bg-white shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-[1px] hover:shadow-md motion-reduce:transition-none">
                    <div className="relative aspect-[5/4] w-full overflow-hidden md:aspect-[4/3]">
                      <img
                        src={card.imageSrc}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        loading="lazy"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-rellia-teal/92 via-rellia-teal/54 via-38% to-transparent"
                      />

                      <div className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/95 ring-1 ring-white/15 sm:right-4 sm:top-4">
                        <TagIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {tag.label}
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                        <p className="font-host-grotesk text-2xl font-semibold tracking-tight text-white md:text-3xl">
                          {card.title}
                        </p>
                        <p className="mt-2 max-w-[44ch] font-urbanist text-sm leading-relaxed text-white/85 md:text-base">
                          {card.subtitle}
                        </p>

                        <RelliaAction
                          asChild
                          variant="relliaCtaSecondary"
                          size="compact"
                          className="mt-5 w-fit px-5 py-3 text-sm shadow-sm"
                        >
                          <Link
                            to={card.to}
                            className="inline-flex cursor-pointer items-center justify-center"
                            aria-label={`Browse ${tag.label} directory`}
                          >
                            Browse {tag.label} directory
                          </Link>
                        </RelliaAction>
                      </div>
                    </div>
                  </article>
                </Reveal>
                )
              })}
            </div>
          </div>
        </LightSection>

        <RelliaCta
          title="**Ready** to join?"
          body="Apply once—we'll follow up with fit, onboarding, and the fastest path into programs and intros."
          primary={{ label: "Apply to join", to: "/apply" }}
          secondary={{ label: "View programs", to: "/programs" }}
        />
      </main>

      <Footer />
    </div>
  )
}
