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
  ArrowDown,
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
  Sparkles,
} from "lucide-react"
import { Link } from "react-router-dom"
import { NETWORK_PATH_ROLE_TAG } from "@/lib/networkPathRoles"
import ScrollReveal from "@/components/ScrollReveal"
import { DiagnosticSurveySection } from "@/components/DiagnosticSurveySection"
import { CreamSection, LightSection, Reveal } from "./_shared"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useNetworkFoundersPage } from "@/hooks/useCmsDocuments"
import NetworkCmsPage from "./NetworkCmsPage"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import WhyRellia from "@/components/WhyRellia"


const HERO_FALLBACK = "/images/founders.jpg"

const ELIGIBILITY_BENTO_ITEMS = [
  {
    text: "Digital health & care delivery software",
    fallbackUrl:
      "https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    text: "Software as a medical device (SaMD) and connected devices",
    fallbackUrl:
      "https://images.pexels.com/photos/8460155/pexels-photo-8460155.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    text: "Diagnostics, lab, and decision-support platforms",
    fallbackUrl:
      "https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    text: "Medtech and DTx with a credible path to evidence and regulation",
    fallbackUrl:
      "https://images.pexels.com/photos/7089017/pexels-photo-7089017.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    text: "Founding teams from idea through Series A",
    fallbackUrl:
      "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    text: "AI and machine learning in clinical workflows",
    fallbackUrl:
      "https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    text: "Payer and value-based care infrastructure",
    fallbackUrl: "https://images.pexels.com/photos/7089012/pexels-photo-7089012.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    text: "Direct-to-consumer healthcare and wellness",
    fallbackUrl: "https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 95%", "end 5%"],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"])

  const bgSrc =
    "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1600"

  return (
    <section
      ref={(node) => {
        sectionRef.current = node
      }}
      className="relative w-full overflow-hidden bg-white py-4 md:py-6"
    >
      <div className="relative w-full overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] shadow-lg">
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

          <div className="relative z-10 mx-auto flex w-full max-w-[1300px] flex-1 flex-col px-6 pb-16 pt-12 md:px-10 md:pb-18 md:pt-14">
            <div className="flex flex-col items-start text-left mt-8 md:mt-10 lg:mt-24">
              <ScrollReveal>
                <div className="mb-7 md:mb-8">
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
                <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {CONSULTING_FEATURES.map((v, i) => {
                    const Icon = v.icon
                    return (
                      <ScrollReveal key={v.title} delay={i * 0.08} className="h-full">
                        <div
                          className={cn(
                            relliaTealGlassCardClass,
                            "flex h-full min-h-[140px] flex-col px-4 py-4 sm:min-h-[220px] sm:px-6 sm:py-6 md:min-h-[250px] md:px-7 md:py-8",
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0 text-rellia-mint sm:h-7 sm:w-7" aria-hidden />
                          <p className="mt-2.5 font-host-grotesk text-sm font-semibold leading-snug tracking-tight text-white sm:mt-4 sm:text-lg md:text-xl">
                            {v.title}
                          </p>
                          <p className="mt-1.5 flex-1 font-urbanist text-xs leading-normal text-white/80 sm:mt-3 sm:text-base md:text-lg">
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
        <Reveal className="flex flex-col items-start text-left">
          <NetworkEyebrow label="Founders" tone="onDark" className="mb-6 md:mb-8" />
          <h1
            className={cn(
              "max-w-4xl font-bold leading-[1.08] tracking-tight text-rellia-mint drop-shadow-sm [&_span]:!text-rellia-mint [&_strong]:!text-rellia-mint [&_em]:!text-rellia-mint",
              PAGE_HEADER_TITLE_SIZE_CLASS,
            )}
          >
            Are you building in <span className="text-rellia-mint">health tech?</span>
          </h1>
          <p className="mt-6 max-w-2xl font-urbanist text-lg leading-relaxed text-white md:text-xl [&_span]:!text-white [&_strong]:!text-white">
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
              <Link
                to="/founders/alumni"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 sm:w-auto"
                aria-label="Explore alumni directory"
              >
                Explore Alumni
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </RelliaAction>
          </div>
        </Reveal>
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
  const src = item.fallbackUrl

  return (
    <article
      className={cn(
        "group relative flex h-[200px] md:h-[240px] flex-col overflow-hidden rounded-[18px] border border-black/10 shadow-[0_16px_36px_-24px_rgba(13,53,64,0.3)]",
        className,
      )}
    >
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        loading="lazy"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/45 to-transparent" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
      <div className="relative z-10 flex h-full min-h-0 w-full flex-1 flex-col justify-start p-5 text-left md:p-6">
        <p
          className="self-start font-host-grotesk font-light text-lg md:text-xl leading-[1.3] tracking-tight text-white [text-shadow:0_1px_16px_rgba(0,0,0,0.4)]"
        >
          {item.text}
        </p>
      </div>
    </article>
  )
}

function EligibilitySection() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1300px]">
        <SectionHeading
          animated={false}
          title="Built for serious health tech teams"
          description="Rellia works with companies where healthcare complexity is core to the product—evidence, regulation, workflow, and traction at once."
          className="mt-5 max-w-full [&>p]:max-w-full [&>p]:text-left [&>p]:leading-relaxed"
        />

        <div
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4"
        >
          {ELIGIBILITY_BENTO_ITEMS.map((item) => (
            <EligibilityBentoCard
              key={item.text}
              item={item}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/** Visual shell aligned with homepage {@link HowItWorks} — white background, elegant light cards */
function EngageTealBand() {
  return (
    <section className="relative w-full overflow-hidden bg-white px-6 py-16 md:px-10 md:py-24">
      <img
        src="/images/hologram-logo.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-16 top-6 w-[320px] max-w-[55vw] opacity-[0.15] md:right-0 md:top-4 md:w-[420px]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 -top-12 h-[450px] w-[450px] rounded-full bg-rellia-mint/10 blur-[120px]" />
        <div className="absolute -right-32 -bottom-16 h-[500px] w-[500px] rounded-full bg-rellia-mint/8 blur-[130px]" />
        <div className="absolute left-1/3 top-1/4 h-[350px] w-[350px] rounded-full bg-rellia-mint/5 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.25] [background-image:radial-gradient(circle_at_30%_15%,rgba(13,53,64,0.02),transparent_52%),radial-gradient(circle_at_75%_40%,rgba(157,214,208,0.06),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1300px]">
        <ScrollReveal>
          <div className="mb-8 md:mb-10">
            <h2 className="mt-5 font-host-grotesk text-2xl font-semibold leading-tight tracking-tight text-rellia-teal md:text-[32px]">
              How to plug in this week
            </h2>
            <p className="mt-4 max-w-2xl font-urbanist text-base font-medium leading-relaxed text-black/80 md:text-lg">
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
                  className="group flex h-full min-h-[168px] flex-col rounded-2xl border border-black/10 bg-gradient-to-br from-rellia-teal to-[#144853] p-5 transition duration-300 hover:from-[#113f4a] hover:to-[#0f3842] hover:shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:min-h-[184px] sm:p-6 items-start"
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
  const whyFeatures = MEMBERSHIP_VALUE_PROPS.map((prop) => ({
    title: prop.title,
    description: prop.body,
    iconKey: "",
  }))

  return (
    <WhyRellia
      sectionTitle="What makes Rellia membership different"
      sectionDescription="Operator-led support in a community where quality is defended by application review—not open signup churn."
      features={whyFeatures}
      sectionClassName="bg-white"
    />
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

  const outsideCardBaseDelay = 0.28
  const outsideCardStagger = 0.14
  const dividerDelay = outsideCardBaseDelay + outsideSteps.length * outsideCardStagger + 0.08
  const bottomHeaderDelay = dividerDelay + 0.22
  const relliaCardBaseDelay = bottomHeaderDelay + 0.14
  const relliaCardStagger = 0.12

  return (
    <section className="w-full overflow-hidden border-t border-black/[0.06] bg-white px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1300px]">
        <ScrollReveal variant="ctaReveal">
          <h2 className="w-full font-host-grotesk text-2xl font-semibold leading-tight tracking-tight text-rellia-teal md:text-[32px]">
            Where Rellia meets your trajectory
          </h2>
        </ScrollReveal>

        <ScrollReveal variant="ctaReveal" delay={0.1} className="mt-8 md:mt-10">
          <div className="flex w-full flex-col items-start gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
            <span className="inline-flex shrink-0 items-center rounded-full bg-rellia-cream px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-rellia-teal">
              You own
            </span>
            <p className="max-w-2xl font-urbanist text-base font-normal leading-relaxed tracking-tight text-rellia-teal md:text-lg md:text-right">
              We help you execute in healthcare complexity once you have direction—without replacing early discovery.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-6 grid w-full grid-cols-1 items-center gap-4 md:grid-cols-3">
          {outsideSteps.map((m, idx) => {
            const Icon = journeyIconById[m.id]
            return (
              <ScrollReveal
                key={m.id}
                variant="ctaReveal"
                delay={outsideCardBaseDelay + idx * outsideCardStagger}
              >
                <article className="flex items-center gap-3 rounded-full border border-rellia-cream/80 bg-rellia-cream/35 p-2 pr-5 text-left transition duration-300 hover:border-rellia-teal/20 hover:shadow-sm">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rellia-teal/5 text-rellia-teal">
                    <Icon className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <h3 className="font-host-grotesk text-base font-semibold leading-none text-black">{m.label}</h3>
                </article>
              </ScrollReveal>
            )
          })}
        </div>

        <div className="relative flex w-full items-center justify-center py-12">
          <ScrollReveal variant="lineReveal" delay={dividerDelay} className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2">
            <div className="h-full w-full bg-black/10" aria-hidden />
          </ScrollReveal>
          <ScrollReveal variant="ctaReveal" delay={dividerDelay + 0.12} className="relative z-10">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-rellia-teal text-white shadow-sm"
              aria-hidden
            >
              <ArrowDown className="h-5 w-5" />
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="ctaReveal" delay={bottomHeaderDelay} className="w-full">
          <div className="flex w-full flex-col items-start gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
            <span className="inline-flex shrink-0 items-center rounded-full bg-rellia-mint px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-rellia-teal">
              We help with
            </span>
            <h3 className="max-w-2xl font-urbanist text-base font-normal leading-relaxed tracking-tight text-rellia-teal md:text-lg md:text-right">
              Programs, operators, and warm intros aligned to milestones that survive clinical, regulatory, and buyer scrutiny.
            </h3>
          </div>
        </ScrollReveal>

        <div className="mt-6 grid w-full grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:grid-cols-4">
          {relliaSteps.map((m, idx) => {
            const Icon = journeyIconById[m.id]
            const isLast = idx === relliaSteps.length - 1
            return (
              <ScrollReveal
                key={m.id}
                variant="ctaReveal"
                delay={relliaCardBaseDelay + idx * relliaCardStagger}
                className={cn("h-full", isLast && "sm:col-span-2 md:col-span-2")}
              >
                <article
                  className={cn(
                    "flex h-full min-h-[220px] flex-col items-start rounded-2xl border border-rellia-teal/80 bg-rellia-teal p-6 text-left transition duration-300 hover:border-rellia-mint/55 hover:shadow-md md:min-h-[260px]",
                  )}
                >
                  <span className="mb-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rellia-mint text-rellia-teal shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h4 className="font-host-grotesk text-base font-semibold leading-snug text-white">{m.label}</h4>
                  <p className="mt-2 flex-1 font-urbanist text-sm leading-relaxed text-white/80">{m.detail}</p>
                </article>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ExploreNetworkSection() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1300px]">
        <ScrollReveal>
          <SectionHeading
            animated={false}
            title="Explore the network"
            description="Browse alumni and advisors—then apply when you want curated intros and the right programming for your stage."
            className="mt-5"
          />
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-7">
          {[
            {
              roleId: "founder" as const,
              title: "See our alumni portfolio",
              to: "/founders/alumni",
              imageSrc: "/images/founders-header.jpg",
            },
            {
              roleId: "advisor" as const,
              title: "Find the operators you want",
              to: "/advisors/directory",
              imageSrc: "/images/paths-advisor-pexels.jpg",
            },
          ].map((card, idx) => {
            const tag = NETWORK_PATH_ROLE_TAG[card.roleId]
            const TagIcon = tag.icon
            return (
              <ScrollReveal key={card.to} delay={0.06 * idx}>
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
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 via-40% to-transparent"
                    />
                    <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/90 backdrop-blur">
                      <TagIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {card.roleId === "founder" ? "Alumni" : tag.label}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-8">
                      <h3 className="font-host-grotesk text-xl font-normal tracking-tight text-white sm:text-2xl md:text-3xl">
                        {card.title}
                      </h3>

                      <RelliaAction
                        asChild
                        variant="relliaCtaSecondary"
                        size="compact"
                        className="mt-4 w-fit px-4 py-2.5 text-sm shadow-sm sm:mt-5 sm:px-5 sm:py-3 sm:text-[0.9375rem]"
                      >
                        <Link to={card.to} className="inline-flex cursor-pointer items-center justify-center">
                          Explore {card.roleId === "founder" ? "Alumni" : tag.label}
                        </Link>
                      </RelliaAction>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function Founders() {
  const foundersPageQuery = useNetworkFoundersPage()
  const { data: page } = foundersPageQuery
  useApplyCmsSeo(page?.seo)

  const useModularLayout =
    Boolean(page?.useModularPage) && (page?.sections?.length ?? 0) > 0

  if (useModularLayout) {
    return <NetworkCmsPage page={page} query={foundersPageQuery} />
  }

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
          headingTitle="From application to your first warm intro"
          subheading="Apply, get approved, choose your membership, join Slack, then reach out when you want introductions matched to your roadmap."
          className="border-t border-black/10"
        />

        <JourneySplitSection />




        <ExploreNetworkSection />
        <DeeperHelpValuesSection />


        <RelliaCta
          aboveSectionTone="white"
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
