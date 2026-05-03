import { usePexelsPhoto } from "@/hooks/usePexelsPhoto"
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
import ScrollReveal from "@/components/ScrollReveal"
import { CreamSection, LightSection, Reveal } from "./_shared"

const HERO_FALLBACK = "/images/founders-header.jpg"

const ELIGIBILITY_CATEGORIES = [
  "Digital health & care delivery software",
  "Software as a medical device (SaMD) and connected devices",
  "Diagnostics, lab, and decision-support platforms",
  "Medtech and DTx with a credible path to evidence and regulation",
  "Founding teams from idea through Series A who can execute in healthcare complexity",
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
  const bgSrc = usePexelsPhoto({
    query: "healthcare startup team meeting",
    fallbackUrl: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1600",
    orientation: "landscape",
  })

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full overflow-hidden">
        <div className="relative min-h-[880px] w-full overflow-hidden sm:min-h-[920px] md:min-h-[900px] lg:min-h-[980px]">
          <div className="absolute inset-0 overflow-hidden" aria-hidden>
            <img
              src={bgSrc}
              alt=""
              className="h-full w-full object-cover scale-[1.12] object-[55%_50%]"
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
                            "flex h-full min-h-[260px] flex-col px-6 py-7 md:min-h-[280px] md:px-7 md:py-8",
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
        <div className="mt-10 flex flex-wrap gap-3">
          <RelliaAction asChild variant="mintOnTealStrip" size="comfortable" className="min-w-[220px] justify-center">
            <Link to="/apply" className="inline-flex cursor-pointer items-center gap-2" aria-label="Apply to join Rellia">
              Apply to join
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </RelliaAction>
          <RelliaAction
            asChild
            variant="heroGhostOnTeal"
            size="comfortable"
            className="min-w-[220px] justify-center border-white/45 hover:border-white/70"
          >
            <Link to="/founders/directory" className="inline-flex cursor-pointer items-center justify-center">
              Browse startups
            </Link>
          </RelliaAction>
        </div>
      </div>
    </section>
  )
}

function EligibilitySection() {
  const sideSrc = usePexelsPhoto({
    query: "medical technology innovation laboratory",
    fallbackUrl: "https://images.pexels.com/photos/3825539/pexels-photo-3825539.jpeg?auto=compress&cs=tinysrgb&w=900",
    orientation: "portrait",
  })

  return (
    <section className="w-full bg-rellia-cream/25 px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[1fr_min(42%,480px)] lg:items-center lg:gap-16">
        <div>
          <NetworkEyebrow label="Who it's for" tone="onLight" />
          <SectionHeading
            animated={false}
            title="Built for serious health tech teams"
            description="Rellia works with companies where healthcare complexity is core to the product—evidence, regulation, workflow, and traction at once."
            className="mt-5"
          />
          <ul className="mt-10 max-w-xl space-y-4" role="list">
            {ELIGIBILITY_CATEGORIES.map((line) => (
              <li key={line} className="flex gap-3 font-urbanist text-base leading-relaxed text-black/80 md:text-[17px]">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-rellia-teal" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-[28px] border border-black/10 shadow-[0_28px_80px_-48px_rgba(13,53,64,0.55)]">
          <img src={sideSrc} alt="" className="aspect-[4/5] w-full object-cover md:aspect-auto md:min-h-[420px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-rellia-teal/50 to-transparent" aria-hidden />
          <p className="absolute bottom-6 left-6 right-6 font-urbanist text-sm font-medium text-white drop-shadow-md md:text-base">
            Operators, clinicians, and builders—focused on outcomes that survive procurement and regulation.
          </p>
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
                  className="group flex min-h-[200px] flex-col rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md transition duration-300 hover:border-rellia-mint/40 hover:bg-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal"
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
        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 md:mt-24 md:gap-x-14 md:gap-y-12 lg:mt-28 lg:gap-x-16">
          {MEMBERSHIP_VALUE_PROPS.map((item, idx) => {
            const Icon = item.icon
            return (
              <Reveal key={item.title} delay={0.05 * idx}>
                <div className="flex max-w-xl flex-col gap-3">
                  <Icon className="h-8 w-8 shrink-0 text-rellia-teal" aria-hidden />
                  <h3 className="font-host-grotesk text-lg font-semibold text-rellia-teal md:text-xl">{item.title}</h3>
                  <p className="font-urbanist text-base leading-relaxed text-black/75">{item.body}</p>
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
                  <div key={m.id} className="w-full max-w-[280px] text-left">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rellia-teal/5 text-rellia-teal">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <p className="mt-3 font-host-grotesk text-lg font-semibold leading-snug text-black">
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
                  <div key={m.id} className="w-full max-w-[280px] text-left">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rellia-teal text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <p className="mt-3 font-host-grotesk text-lg font-semibold leading-snug text-rellia-teal">
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
                  label: "Founders",
                  title: "See what founders are building",
                  subtitle: "Search by category, stage, and collaboration notes.",
                  to: "/founders/directory",
                  imageSrc: "/images/founders-header.jpg",
                },
                {
                  label: "Advisors",
                  title: "Find the operators you want",
                  subtitle: "Browse mentors by focus area, industry, and style.",
                  to: "/advisors/directory",
                  imageSrc: "/images/paths-advisor-pexels.jpg",
                },
              ].map((card, idx) => (
                <Reveal key={card.to} delay={0.06 * idx}>
                  <article className="group relative overflow-hidden rounded-[28px] bg-white shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-[1px] hover:shadow-md motion-reduce:transition-none">
                    <div className="relative aspect-[5/4] w-full overflow-hidden md:aspect-[4/3]">
                      <img
                        src={card.imageSrc}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        loading="lazy"
                      />
                      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                      <div className="absolute left-5 top-5 inline-flex items-center rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/90 backdrop-blur md:left-6 md:top-6">
                        {card.label}
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
                          <Link to={card.to} className="inline-flex cursor-pointer items-center justify-center" aria-label={card.label}>
                            Browse {card.label} directory
                          </Link>
                        </RelliaAction>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
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
