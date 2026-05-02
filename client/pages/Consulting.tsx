import { PEXELS_HEALTH_MEETING } from "@/config/pexelsFallbacks"
import { usePexelsPhoto } from "@/hooks/usePexelsPhoto"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PageHeader from "@/components/PageHeader"
import NetworkEyebrow from "@/components/network/NetworkEyebrow"
import SectionHeading from "@/components/SectionHeading"
import MembershipPathTimeline from "@/components/MembershipPathTimeline"
import RelliaAction from "@/components/RelliaAction"
import ScrollReveal from "@/components/ScrollReveal"
import { CheckCircle2, ClipboardList, MessagesSquare, UsersRound } from "lucide-react"
import { Link } from "react-router-dom"
import { CreamSection, LightSection, Reveal, SectionShell } from "./network/_shared"

const WHEN_TO_USE = [
  "You need scoped deep dives—FDA strategy, clinical evidence design, enterprise sales narrative—in focused sessions",
  "Your team wants documentation or diligence artifacts reviewed before a board or investor cycle",
  "You are navigating a pivot that touches regulatory labeling, pilot contracts, or interoperability commitments",
] as const

const WHAT_TO_EXPECT = [
  {
    icon: ClipboardList,
    text: "Scoped engagements with clear deliverables and timelines—distinct from always-on community membership",
  },
  {
    icon: UsersRound,
    text: "Aligned with Rellia’s advisor bench; we match expertise to the milestone you are staring down",
  },
  {
    icon: MessagesSquare,
    text: "Transparent scoping after we understand constraints—start with a conversation, not a vague retainer",
  },
] as const

const CONSULTING_PATH_STEPS = [
  {
    title: "Discovery",
    description:
      "We align on the milestone, constraints, and artifacts you need—clinical, regulatory, commercial, or narrative.",
  },
  {
    title: "Scoped proposal",
    description:
      "You get deliverables, timeline, and the advisor match before work begins—no open-ended retainers by default.",
  },
  {
    title: "Working sessions",
    description:
      "Deep working sessions with specialists who have shipped in healthcare; optional bridge back to membership rhythm.",
  },
] as const

function FitSectionSplit() {
  const img = usePexelsPhoto({
    query: "healthcare medical technology meeting discussion",
    fallbackUrl: PEXELS_HEALTH_MEETING,
    orientation: "landscape",
  })

  return (
    <LightSection className="bg-rellia-cream/20 pt-12 md:pt-16">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div>
          <NetworkEyebrow label="Fit" tone="onLight" />
          <SectionHeading
            animated={false}
            title="When consulting makes sense"
            description="Membership gives ongoing access to community, programs, and broad intros. Consulting is for concentrated blocks of work where you need explicit outputs and senior judgment on the critical path."
            className="mt-5"
          />
          <ul className="mt-10 max-w-3xl space-y-4" role="list">
            {WHEN_TO_USE.map((line, idx) => (
              <Reveal key={line.slice(0, 32)} delay={0.04 * idx}>
                <li className="flex gap-3 font-urbanist text-base leading-relaxed text-black/80 md:text-[17px]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-rellia-teal" aria-hidden />
                  {line}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal delay={0.06}>
          <div className="overflow-hidden rounded-2xl border border-rellia-teal/15 shadow-[0_28px_80px_-48px_rgba(13,53,64,0.4)]">
            <img
              src={img}
              alt="Clinical and commercial leaders in a focused working session"
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </LightSection>
  )
}

export default function Consulting() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <PageHeader
          variant="dark"
          title={
            <>
              Founder consulting <span className="text-rellia-mint">built for healthcare reality</span>
            </>
          }
          subtitle={
            <p className="font-urbanist">
              One-to-one and small-team working sessions when you need depth beyond community rhythm—regulatory, clinical,
              commercial, and narrative—with specialists who have shipped in health tech.
            </p>
          }
        />

        <FitSectionSplit />

        <MembershipPathTimeline
          headingId="consulting-engagement-path-heading"
          headingTitle={
            <>
              How a <span className="text-rellia-teal">consulting engagement</span> runs
            </>
          }
          subheading="Same timeline interaction as membership onboarding—scaled to three concrete phases before work begins."
          steps={CONSULTING_PATH_STEPS}
          timelineAriaLabel="Consulting engagement steps"
          showRoleLinks={false}
          className="border-t-0 bg-white py-16 md:py-24 lg:py-28"
        />

        <CreamSection>
          <ScrollReveal>
            <NetworkEyebrow label="Expectations" tone="onLight" />
            <SectionHeading
              animated={false}
              title="What to expect"
              description="Consulting stays outcome-oriented—documentation you can reuse in diligence and boards."
              className="mt-5"
            />
          </ScrollReveal>
          <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-x-10 md:gap-y-12 lg:gap-x-12">
            {WHAT_TO_EXPECT.map((item, idx) => {
              const Icon = item.icon
              return (
                <Reveal key={item.text.slice(0, 32)} delay={0.05 * idx}>
                  <div className="flex max-w-xl flex-col gap-3">
                    <Icon className="h-8 w-8 shrink-0 text-rellia-teal" aria-hidden />
                    <p className="font-urbanist text-base leading-relaxed text-black/75">{item.text}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <RelliaAction asChild variant="tealFilledLift" size="comfortable">
              <Link to="/contact" className="cursor-pointer">
                Start a consulting conversation
              </Link>
            </RelliaAction>
            <RelliaAction asChild variant="outlineOnWhite" size="comfortable">
              <Link to="/apply" className="cursor-pointer">
                Apply for membership
              </Link>
            </RelliaAction>
          </div>
        </CreamSection>

        <SectionShell className="py-16 md:py-20">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <h2 className="font-host-grotesk text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  Not sure which path fits?
                </h2>
                <p className="mt-3 font-urbanist text-base leading-relaxed text-white/85 md:text-lg">
                  Tell us your milestone—we&apos;ll recommend membership, consulting, or a blended rhythm.
                </p>
              </div>
              <RelliaAction asChild variant="mintOnTealStrip" size="comfortable">
                <Link to="/contact" className="inline-flex cursor-pointer items-center gap-2">
                  Talk to us
                </Link>
              </RelliaAction>
            </div>
          </Reveal>
        </SectionShell>
      </main>

      <Footer />
    </div>
  )
}
