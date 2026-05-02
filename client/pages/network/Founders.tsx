import { usePexelsPhoto } from "@/hooks/usePexelsPhoto"
import { PAGE_HEADER_DARK_SUBTITLE_CLASS, PAGE_HEADER_TITLE_SIZE_CLASS } from "@/components/PageHeader"
import NetworkEyebrow from "@/components/network/NetworkEyebrow"
import SectionHeading from "@/components/SectionHeading"
import MembershipPathTimeline from "@/components/MembershipPathTimeline"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import { relliaTealGlassCardClass } from "@/lib/relliaTealGlassCard"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Mail,
  MessagesSquare,
  Percent,
  UserPlus,
  Users,
  Video,
} from "lucide-react"
import { Link } from "react-router-dom"
import ScrollReveal from "@/components/ScrollReveal"
import { CreamSection, LightSection, Reveal } from "./_shared"

const HERO_FALLBACK =
  "https://images.pexels.com/photos/7414216/pexels-photo-7414216.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=1400"

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

function FoundersHero() {
  const heroSrc = usePexelsPhoto({
    query: "health technology startup team collaboration",
    fallbackUrl: HERO_FALLBACK,
    orientation: "landscape",
  })

  return (
    <section className="relative overflow-hidden bg-rellia-teal pt-[72px] md:pt-[86px]">
      <img
        src={heroSrc}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal/[0.97] via-rellia-teal/85 to-[#0a2830]/90" aria-hidden />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(167,219,214,0.35),transparent_50%),radial-gradient(circle_at_85%_30%,rgba(255,255,255,0.12),transparent_45%)]" />
      <img
        src="/images/hologram-logo.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 w-[min(52vw,420px)] opacity-[0.07] md:right-0"
      />

      <div className="relative z-10 mx-auto max-w-[1300px] px-6 pb-20 pt-10 md:px-10 md:pb-28 md:pt-14">
        <NetworkEyebrow label="Founders" tone="onDark" className="mb-6 md:mb-8" />
        <h1
          className={cn(
            "max-w-4xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-sm",
            PAGE_HEADER_TITLE_SIZE_CLASS,
          )}
        >
          The home for <span className="text-rellia-mint">health tech founders</span>
        </h1>
        <p className={cn("mt-6 max-w-2xl", PAGE_HEADER_DARK_SUBTITLE_CLASS)}>
          You&apos;re building something that can change healthcare. We bring the experts, programs, and connections to help
          you get there.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <RelliaAction asChild variant="mintOnTealStrip" size="comfortable">
            <Link to="/apply" className="inline-flex cursor-pointer items-center gap-2" aria-label="Apply to join Rellia">
              Apply to join
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </RelliaAction>
          <RelliaAction asChild variant="heroGhostOnTeal" size="comfortable">
            <Link to="/founders/directory" className="cursor-pointer">
              Browse founder directory
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
          <div className="mb-12 md:mb-14">
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
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
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
        <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-2 md:gap-x-14 md:gap-y-12 lg:gap-x-16">
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
  const visualSrc = usePexelsPhoto({
    query: "healthcare startup roadmap planning whiteboard",
    fallbackUrl: "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1200",
    orientation: "landscape",
  })

  return (
    <LightSection className="bg-rellia-cream/20">
      <div className="mx-auto max-w-[1300px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-14 xl:grid-cols-[1fr_min(40%,440px)]">
          <div>
            <NetworkEyebrow label="Journey" tone="onLight" />
            <SectionHeading
              animated={false}
              title="Where Rellia meets your trajectory"
              description="Early discovery stays yours. Once you have product direction, we compound through MVP, evidence, regulation, and commercial traction."
              className="mt-5"
            />

            <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] md:flex-wrap md:overflow-visible">
              {JOURNEY_TIMELINE.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 font-host-grotesk text-xs font-semibold md:text-sm",
                    m.zone === "outside"
                      ? "border-black/15 bg-black/[0.04] text-black/45"
                      : "border-rellia-mint/60 bg-rellia-mint/20 text-rellia-teal",
                  )}
                >
                  {m.label}
                </div>
              ))}
            </div>

            <Accordion type="multiple" className="mt-10 space-y-2">
              {JOURNEY_TIMELINE.map((m) => (
                <AccordionItem
                  key={m.id}
                  value={m.id}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
                >
                  <AccordionTrigger className="px-5 py-4 text-left hover:no-underline md:px-6">
                    <span className="flex w-full flex-1 items-center justify-between gap-3">
                      <span className="font-host-grotesk text-base font-semibold text-rellia-teal md:text-lg">{m.label}</span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2.5 py-1 font-urbanist text-[10px] font-bold uppercase tracking-wide md:text-[11px]",
                          m.zone === "outside" ? "bg-black/[0.06] text-black/50" : "bg-rellia-mint/40 text-rellia-teal",
                        )}
                      >
                        {m.zone === "outside" ? "Discovery" : "Rellia"}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 font-urbanist leading-relaxed text-black/75 md:px-6">
                    {m.detail}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="relative lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[28px] border border-black/10 shadow-xl">
              <img src={visualSrc} alt="" className="aspect-[4/5] w-full object-cover lg:aspect-[3/4]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" aria-hidden />
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
        <FoundersHero />
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

        <CreamSection>
          <div className="mx-auto grid max-w-[1300px] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <Reveal>
              <NetworkEyebrow label="1:1 depth" tone="onLight" />
              <h2 className="mt-5 font-host-grotesk text-3xl font-semibold tracking-tight text-black md:text-[40px]">
                Need <span className="text-rellia-teal">deeper</span> support?
              </h2>
              <p className="mt-4 font-urbanist text-lg leading-relaxed text-black/70">
                Focused working sessions beyond community rhythm—regulatory planning, narrative, diligence prep—with specialists for scoped engagements.
              </p>
              <RelliaAction asChild variant="tealFilledLift" size="comfortable" className="mt-8">
                <Link to="/consulting" className="cursor-pointer">
                  Explore consulting
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </RelliaAction>
            </Reveal>
            <Reveal delay={0.08}>
              <div className={cn(relliaTealGlassCardClass, "relative overflow-hidden border-white/30 p-8 md:p-10")}>
                <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-rellia-mint/30 blur-3xl" />
                <Users className="relative h-10 w-10 text-rellia-teal" aria-hidden />
                <p className="relative mt-4 font-host-grotesk text-xl font-semibold text-rellia-teal">Consulting snapshot</p>
                <p className="relative mt-3 font-urbanist leading-relaxed text-black/75">
                  Scoped deliverables and senior judgment on the milestone you are staring down—not an endless retainer.
                </p>
              </div>
            </Reveal>
          </div>
        </CreamSection>

        <LightSection>
          <div className="mx-auto max-w-[1300px]">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                <NetworkEyebrow label="Directories" tone="onLight" />
                <SectionHeading
                  animated={false}
                  title="Explore founders and advisors"
                  description="See who is building alongside you—and browse mentors by expertise before you apply for intros."
                  className="mt-5"
                />
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <RelliaAction asChild variant="outlineOnWhite" size="comfortable">
                    <Link to="/founders/directory" className="cursor-pointer">
                      Founder directory
                    </Link>
                  </RelliaAction>
                  <RelliaAction asChild variant="tealFilledLift" size="comfortable">
                    <Link to="/advisors/directory" className="cursor-pointer">
                      Advisor directory
                    </Link>
                  </RelliaAction>
                </div>
              </Reveal>
              <Reveal delay={0.06}>
                <div className="flex h-full flex-col justify-center rounded-[28px] border border-black/10 bg-gradient-to-br from-rellia-teal to-[#0a2830] p-8 text-white shadow-xl md:p-12">
                  <NetworkEyebrow label="Warm intros" tone="onDark" />
                  <p className="mt-6 font-host-grotesk text-2xl font-semibold leading-snug md:text-3xl">
                    Meet operators who&apos;ve shipped in your lane.
                  </p>
                  <p className="mt-4 font-urbanist leading-relaxed text-white/85">
                    The advisor directory shows regulatory, clinical, GTM, and technical depth—apply so we can route you intentionally.
                  </p>
                  <Link
                    to="/advisors/directory"
                    className="mt-8 inline-flex items-center gap-2 font-host-grotesk font-semibold text-rellia-mint underline-offset-4 transition hover:underline cursor-pointer"
                  >
                    Open advisor directory
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </Reveal>
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
