import { usePexelsPhoto } from "@/hooks/usePexelsPhoto"
import PageHeader from "@/components/PageHeader"
import NetworkEyebrow from "@/components/network/NetworkEyebrow"
import SectionHeading from "@/components/SectionHeading"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import ScrollReveal from "@/components/ScrollReveal"
import { cn } from "@/lib/utils"
import { ArrowRight, Award, BookOpen, Clock, Crosshair, Gauge, HeartHandshake, Network, Scale, ShieldCheck, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import { CreamSection, GlassCardLight, LightSection, Reveal } from "./_shared"

const BENEFITS = [
  {
    title: "Stay current",
    body: "See how delivery models, reimbursement, and regulation shift—grounded in founder reality, not hype cycles.",
    icon: BookOpen,
  },
  {
    title: "Sharpen craft",
    body: "Practice crisp advising: scoped questions, decisive feedback, and repeatable frameworks operators respect.",
    icon: Sparkles,
  },
  {
    title: "Build network",
    body: "Meet founders and peers who respect your time and bring operational context to every conversation.",
    icon: Network,
  },
  {
    title: "Expert visibility",
    body: "Be highlighted for a defined edge—so introductions match your strengths, not generic office hours.",
    icon: Award,
  },
  {
    title: "Impact patients",
    body: "Translate experience into fewer dead-ends: safer pilots, clearer evidence, faster adoption where care happens.",
    icon: HeartHandshake,
  },
] as const

type SupportModel = {
  title: string
  body: string
  linkTo?: string
  linkLabel?: string
}

const SUPPORT_MODELS: SupportModel[] = [
  {
    title: "Community & network",
    body: "Engage on your terms inside Slack and curated introductions—meet founders and fellow advisors without rigid mandates.",
  },
  {
    title: "Advisory board roles",
    body: "Serve as a formal advisor when there is mutual fit—typically lightweight charters scoped to milestone cadence.",
  },
  {
    title: "Program advisor",
    body: "Shape cohort sessions and office hours inside Rellia programs—see our curriculum on the programs page.",
    linkTo: "/programs",
    linkLabel: "Browse programs",
  },
]

const CRITERIA_ITEMS = [
  {
    title: "Senior judgment",
    summary: "You have led, practiced, or scaled inside healthcare—not only consulted from the sidelines.",
    detail:
      "Hospital operations, regulatory submissions, enterprise sales, outcomes research, or technical architecture at depth.",
    icon: Scale,
  },
  {
    title: "Specific edge",
    summary: "A narrow expertise beats a general resume—matching works best when your strengths are obvious.",
    detail:
      "Whether regulatory strategy, payer contracting, or interoperability—you know what you will say no to as clearly as yes.",
    icon: Crosshair,
  },
  {
    title: "Boundaries with generosity",
    summary: "You protect scope and safety while still leaving founders with a crisp next step.",
    detail:
      "You decline cleanly when misaligned, show up prepared when aligned, and respect confidentiality inside healthcare norms.",
    icon: ShieldCheck,
  },
  {
    title: "Momentum-aware advice",
    summary: "Guidance is timed to milestones founders must hit—not theoretical debates detached from evidence plans.",
    detail:
      "Clinical workflow, regulatory sequencing, buyer diligence—aligned to what investors and systems actually review.",
    icon: Gauge,
  },
] as const

function BenefitsTealBand() {
  return (
    <section className="relative w-full overflow-hidden bg-rellia-teal px-6 py-16 md:px-10 md:py-24">
      <img
        src="/images/hologram-logo.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-12 bottom-0 w-[340px] max-w-[50vw] opacity-[0.06]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-20%] top-1/4 h-[420px] w-[420px] rounded-full bg-rellia-mint/18 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[380px] w-[380px] rounded-full bg-white/5 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1300px]">
        <ScrollReveal>
          <NetworkEyebrow label="Benefits" tone="onDark" />
          <h2 className="mt-5 font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-white md:text-[40px]">
            Mentorship that <span className="text-rellia-mint">compounds</span>
          </h2>
          <p className="mt-4 max-w-2xl font-urbanist text-base leading-relaxed text-white/80 md:text-lg">
            Stay close to innovation without ambient noise—sharp conversations with founders who execute.
          </p>
        </ScrollReveal>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => {
            const Icon = b.icon
            return (
              <div
                key={b.title}
                className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md transition duration-300 hover:border-rellia-mint/35 hover:bg-white/10"
              >
                <Icon className="h-7 w-7 text-rellia-mint" aria-hidden />
                <p className="mt-5 font-host-grotesk text-lg font-semibold leading-snug text-white">{b.title}</p>
                <p className="mt-3 font-urbanist text-sm leading-relaxed text-white/80">{b.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ScheduleSplit() {
  const img = usePexelsPhoto({
    query: "business mentor meeting healthcare professional",
    fallbackUrl: "https://images.pexels.com/photos/8376155/pexels-photo-8376155.jpeg?auto=compress&cs=tinysrgb&w=1000",
    orientation: "landscape",
  })

  return (
    <section className="w-full bg-rellia-cream/25 px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-[1300px] gap-10 lg:grid-cols-[min(44%,480px)_1fr] lg:items-center lg:gap-16">
        <div className="relative overflow-hidden rounded-[28px] border border-black/10 shadow-lg lg:order-2">
          <img src={img} alt="" className="aspect-[5/4] w-full object-cover md:aspect-[4/3]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-rellia-teal/40 to-transparent" aria-hidden />
        </div>
        <div className="lg:order-1">
          <NetworkEyebrow label="Your time" tone="onLight" />
          <h2 className="mt-5 font-host-grotesk text-3xl font-semibold tracking-tight text-black md:text-[40px]">
            Flexible for <span className="text-rellia-teal">senior</span> schedules
          </h2>
          <div className="mt-8 flex gap-4 rounded-2xl border border-rellia-teal/15 bg-white p-6 shadow-sm">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rellia-mint/30 text-rellia-teal">
              <Clock className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="font-host-grotesk text-lg font-semibold text-rellia-teal">1–3 hours, on your terms</p>
              <p className="mt-2 font-urbanist leading-relaxed text-black/75">
                Advisory roles are designed for short, high-leverage blocks—adjustable as your capacity changes. Depth when
                you opt in, never a second job by default.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Advisors() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title={
            <>
              Some people are just wired to help others succeed.
            </>
          }
          subtitle={
            <p className="font-urbanist">
              Mentor serious health tech founders through structured, respectful engagements—stay sharp on innovation while
              keeping flexibility for your career.
            </p>
          }
          variant="dark"
        />

        <ScheduleSplit />
        <BenefitsTealBand />

        <LightSection>
          <div className="mx-auto max-w-[1300px]">
            <NetworkEyebrow label="Support models" tone="onLight" />
            <SectionHeading
              animated={false}
              title="How advisors can engage"
              description="Community presence, formal advisory work, or program leadership—pick surfaces that fit your cadence."
              className="mt-5"
            />
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {SUPPORT_MODELS.map((row, idx) => (
                <Reveal key={row.title} delay={0.06 * idx}>
                  <GlassCardLight className="flex h-full flex-col p-8 transition duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-default">
                    <h3 className="font-host-grotesk text-xl font-semibold text-rellia-teal">{row.title}</h3>
                    <p className="mt-3 flex-1 font-urbanist leading-relaxed text-black/75">{row.body}</p>
                    {row.linkTo && row.linkLabel ? (
                      <Link
                        to={row.linkTo}
                        className="mt-6 inline-flex cursor-pointer items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal underline-offset-4 hover:underline"
                      >
                        {row.linkLabel}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    ) : null}
                  </GlassCardLight>
                </Reveal>
              ))}
            </div>
          </div>
        </LightSection>

        <CreamSection>
          <div className="mx-auto flex max-w-[1300px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <Reveal className="max-w-xl">
              <NetworkEyebrow label="Directory" tone="onLight" />
              <h2 className="mt-5 font-host-grotesk text-3xl font-semibold tracking-tight text-black md:text-[40px]">
                Meet the advisor bench
              </h2>
              <p className="mt-4 font-urbanist text-lg leading-relaxed text-black/70">
                Filter by expertise, search by keyword, and open profiles—representative of how we route founders.
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <RelliaAction asChild variant="tealFilledLift" size="comfortable">
                <Link to="/advisors/directory" className="inline-flex cursor-pointer items-center gap-2">
                  Open advisor directory
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </RelliaAction>
            </Reveal>
          </div>
        </CreamSection>

        <LightSection>
          <div className="mx-auto max-w-[1300px]">
            <NetworkEyebrow label="Criteria" tone="onLight" />
            <SectionHeading
              animated={false}
              title="What we look for"
              description="Effective advisors combine depth, specificity, and respect for founder momentum."
              className="mt-5"
            />
            <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-14 md:gap-y-12 lg:gap-x-16">
              {CRITERIA_ITEMS.map((c) => {
                const Icon = c.icon
                return (
                  <Reveal key={c.title}>
                    <div className="flex max-w-xl flex-col gap-3">
                      <Icon className="h-8 w-8 shrink-0 text-rellia-teal" aria-hidden />
                      <h3 className="font-host-grotesk text-lg font-semibold text-rellia-teal md:text-xl">{c.title}</h3>
                      <p className="font-urbanist text-base font-medium leading-relaxed text-black/65">{c.summary}</p>
                      <p className="font-urbanist text-base leading-relaxed text-black/70">{c.detail}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </LightSection>

        <RelliaCta
          title="**Apply** as an advisor"
          body="Share your background—we'll follow up with fit, expectations, and onboarding paths."
          primary={{ label: "Apply to join", to: "/apply" }}
          secondary={{ label: "Contact", to: "/contact" }}
        />
      </main>

      <Footer />
    </div>
  )
}
