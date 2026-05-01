import PageHeader from "@/components/PageHeader"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import SectionPillBadge from "@/components/SectionPillBadge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import { ArrowRight, BookOpen, Mail, UserPlus, Video } from "lucide-react"
import { Link } from "react-router-dom"
import {
  CreamSection,
  GlassCardLight,
  LightSection,
  MultiStepSignupForm,
  Reveal,
  SectionShell,
} from "./_shared"

type PathMilestone = {
  label: string
  detail: string
  phase: "early" | "acceleration"
}

const ACCELERATION_MILESTONES: PathMilestone[] = [
  {
    label: "Product idea",
    phase: "early",
    detail: "Clarify the problem, care setting, and what “success” looks like for patients and buyers before you over-build.",
  },
  {
    label: "Education",
    phase: "early",
    detail: "Learn the guardrails that matter in health tech—evidence expectations, regulatory paths, and common failure modes.",
  },
  {
    label: "MVP",
    phase: "acceleration",
    detail: "Ship a credible MVP with the right scope: interoperability, safety basics, and a validation plan operators can review.",
  },
  {
    label: "Funding",
    phase: "acceleration",
    detail: "Shape a de-risked narrative for investors: milestones, clinical or economic logic, and a realistic use-of-funds plan.",
  },
  {
    label: "Regulatory",
    phase: "acceleration",
    detail: "Map obligations early (quality system, labeling, risk management) so validation work doesn’t get thrown away later.",
  },
  {
    label: "Clinical evidence",
    phase: "acceleration",
    detail: "Run pilots and studies that produce decision-grade signal—usability, outcomes, and workflow fit.",
  },
  {
    label: "Commercialization",
    phase: "acceleration",
    detail: "Move from proof to repeatable revenue: pricing, procurement, channel partners, and scalable delivery.",
  },
]

const ENGAGEMENT = [
  {
    title: "Join membership",
    body: "Get ongoing access to programs, office hours, and a community built for health tech execution.",
    to: "/membership",
    icon: UserPlus,
  },
  {
    title: "Browse programs",
    body: "Pick structured tracks that match your stage—from QMS foundations to cohort-based accelerators.",
    to: "/programs",
    icon: BookOpen,
  },
  {
    title: "Virtual events",
    body: "Learn from operators and clinicians, and meet peers who are solving adjacent problems.",
    to: "/events",
    icon: Video,
  },
  {
    title: "Contact",
    body: "Share your roadmap and we’ll point you to the fastest next step inside the network.",
    to: "/contact",
    icon: Mail,
  },
] as const

const FEATURED_FOUNDERS = [
  {
    name: "Amina Okoro",
    company: "Northline Dx",
    tag: "Diagnostics",
    initials: "AO",
    avatar:
      "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=2",
  },
  {
    name: "James Patel",
    company: "Relay Care OS",
    tag: "Digital health",
    initials: "JP",
    avatar:
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=2",
  },
  {
    name: "Sofia Lind",
    company: "Vireo Surgical",
    tag: "MedTech",
    initials: "SL",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=2",
  },
  {
    name: "Marcus Chen",
    company: "Helix Rehab",
    tag: "Rehab tech",
    initials: "MC",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=2",
  },
] as const

const AccelerationPath = () => {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-[26px] hidden h-px bg-gradient-to-r from-black/10 via-rellia-teal/25 to-rellia-mint/40 md:block"
      />
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin] md:gap-4 md:pb-0 snap-x snap-mandatory md:snap-none">
        {ACCELERATION_MILESTONES.map((m) => {
          const isEarly = m.phase === "early"
          return (
            <HoverCard key={m.label} openDelay={180} closeDelay={80}>
              <HoverCardTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "relative z-10 min-w-[132px] max-w-[160px] shrink-0 snap-start rounded-2xl border px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
                    isEarly
                      ? "border-black/10 bg-black/[0.03] text-black/50 grayscale"
                      : "border-rellia-mint/60 bg-white text-rellia-teal shadow-[0_0_0_1px_rgba(167,219,214,0.35),0_16px_48px_-28px_rgba(13,53,64,0.45)] ring-2 ring-rellia-mint/35 hover:-translate-y-0.5",
                  )}
                  aria-label={`${m.label}. Hover or focus for details.`}
                >
                  <span className="font-host-grotesk text-sm font-semibold tracking-tight">{m.label}</span>
                  {!isEarly ? (
                    <span className="mt-1 block font-urbanist text-[11px] font-medium uppercase tracking-wider text-rellia-teal/70">
                      Acceleration
                    </span>
                  ) : (
                    <span className="mt-1 block font-urbanist text-[11px] font-medium uppercase tracking-wider text-black/40">
                      Early
                    </span>
                  )}
                </button>
              </HoverCardTrigger>
              <HoverCardContent
                side="top"
                align="center"
                className="w-72 border border-rellia-teal/15 bg-white p-4 text-black shadow-lg"
              >
                <p className="font-host-grotesk text-base font-semibold text-rellia-teal">{m.label}</p>
                <p className="mt-2 font-urbanist text-sm leading-relaxed text-black/70">{m.detail}</p>
              </HoverCardContent>
            </HoverCard>
          )
        })}
      </div>
    </div>
  )
}

export default function Founders() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title={
            <>
              The launchpad for <span className="text-rellia-mint">health tech founders</span>
            </>
          }
          subtitle={
            <p className="font-urbanist">
              Move faster through regulatory complexity, clinical validation, and commercialization—with a network built
              for operators, clinicians, and builders.
            </p>
          }
          variant="dark"
        />

        <LightSection className="pt-12 md:pt-16">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <SectionPillBadge>Acceleration</SectionPillBadge>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl">Rellia Acceleration Path</h2>
                <p className="mt-4 font-urbanist text-lg leading-relaxed text-black/70">
                  Hover each milestone for what we help you pressure-test. Early exploration stays intentionally light; the
                  acceleration lane is where execution compounds.
                </p>
              </div>
              <RelliaAction asChild variant="tealFilledLift" size="comfortable" className="shrink-0">
                <a href="#signup" className="inline-flex items-center gap-2" aria-label="Start founder signup">
                  Get started
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </a>
              </RelliaAction>
            </div>
          </Reveal>
          <div className="mt-10">
            <Reveal delay={0.08}>
              <AccelerationPath />
            </Reveal>
          </div>
        </LightSection>

        <CreamSection>
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl">How to engage</h2>
            <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
              Pick the front door that fits your week—every path connects back to the same high-trust community.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ENGAGEMENT.map((item, idx) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={0.05 * idx}>
                  <Link
                    to={item.to}
                    className="group block h-full rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2"
                  >
                    <GlassCardLight className="flex h-full flex-col p-7 transition-transform duration-300 group-hover:-translate-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rellia-teal/15 bg-rellia-mint/25 text-rellia-teal">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <ArrowRight
                          aria-hidden
                          className="mt-1 h-5 w-5 shrink-0 text-rellia-teal/40 transition-transform group-hover:translate-x-0.5 group-hover:text-rellia-teal"
                        />
                      </div>
                      <h3 className="mt-5 font-host-grotesk text-xl font-semibold tracking-tight text-rellia-teal">
                        {item.title}
                      </h3>
                      <p className="mt-3 font-urbanist leading-relaxed text-black/70">{item.body}</p>
                    </GlassCardLight>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </CreamSection>

        <LightSection>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <div>
                <SectionPillBadge>Directory</SectionPillBadge>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl">Featured founders</h2>
                <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
                  A snapshot of teams building across diagnostics, devices, and care delivery—representative of the caliber
                  inside Rellia.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <RelliaAction asChild variant="outlineOnWhite" size="comfortable" className="shrink-0">
                <Link to="/apply" className="inline-flex items-center gap-2" aria-label="Apply to join Rellia">
                  Apply to join
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </RelliaAction>
            </Reveal>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_FOUNDERS.map((f, idx) => (
              <Reveal key={f.name} delay={0.05 * idx}>
                <GlassCardLight className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={f.avatar}
                      alt=""
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-rellia-mint/40"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-rellia-teal text-[10px] font-bold text-white"
                        >
                          {f.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-host-grotesk font-semibold text-rellia-teal">{f.company}</p>
                          <p className="truncate font-urbanist text-sm text-black/60">{f.name}</p>
                        </div>
                      </div>
                      <span className="mt-3 inline-flex rounded-full border border-rellia-teal/20 bg-rellia-mint/20 px-3 py-1 font-urbanist text-xs font-semibold text-rellia-teal">
                        {f.tag}
                      </span>
                    </div>
                  </div>
                </GlassCardLight>
              </Reveal>
            ))}
          </div>
        </LightSection>

        <SectionShell className="py-16 md:py-24">
          <div id="signup" className="scroll-mt-28">
            <Reveal>
              <MultiStepSignupForm
                ctaLabel="Apply for the next cohort"
                roleLabel="Founder"
                step2Fields={[
                  { name: "company", label: "Company / project", placeholder: "Your company or working name" },
                  { name: "stage", label: "Stage", placeholder: "Idea / MVP / Pilot / Revenue" },
                  { name: "focus", label: "Focus area", placeholder: "Digital health, med device, diagnostics…" },
                  { name: "timeline", label: "Target milestone", placeholder: "e.g. FDA strategy, pilot launch, Series A" },
                ]}
              />
            </Reveal>
          </div>
        </SectionShell>
      </main>

      <Footer />
    </div>
  )
}
