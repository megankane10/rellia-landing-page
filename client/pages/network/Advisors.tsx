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
import { CreamSection, GlassCardLight, LightSection, Reveal, RoleHero } from "./_shared"
import { useNetworkAdvisorsPage } from "@/hooks/useCmsDocuments"
import NetworkCmsPage from "./NetworkCmsPage"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"

const BENEFITS = [
  "Stay up to date on the latest innovations happening in your industry",
  "Sharpen your own career skills",
  "Build your network",
  "Be highlighted as an expert in your field",
  "Help bring healthcare improvements to patients",
] as const

type SupportModel = {
  title: string
  body: string
  linkTo?: string
  linkLabel?: string
}

const SUPPORT_MODELS: (SupportModel & { icon: any })[] = [
  {
    title: "Community & network",
    body: "Engage on your terms inside Slack and curated introductions—meet founders and fellow advisors without rigid mandates.",
    icon: Network,
  },
  {
    title: "Advisory board roles",
    body: "Serve as a formal advisor when there is mutual fit—typically lightweight charters scoped to milestone cadence.",
    icon: Award,
  },
  {
    title: "Program advisor",
    body: "Shape cohort sessions and office hours inside Rellia programs—see our curriculum on the programs page.",
    icon: BookOpen,
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

function SupportModelsSection() {
  return (
    <LightSection>
      <div className="mx-auto max-w-[1300px]">
        <NetworkEyebrow label="Support models" tone="onLight" />
        <SectionHeading
          animated={false}
          title="How advisors can engage"
          description="Community presence, formal advisory work, or program leadership—pick surfaces that fit your cadence."
          className="mt-5"
        />
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
          {SUPPORT_MODELS.map((row, idx) => {
            const Icon = row.icon
            return (
              <Reveal key={row.title} delay={0.06 * idx}>
                <div className="flex items-start gap-5 text-left">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rellia-mint/20">
                    <Icon className="h-5 w-5 text-rellia-teal" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-host-grotesk text-xl font-bold text-rellia-teal">{row.title}</h3>
                    <p className="mt-3 font-urbanist text-[17px] leading-relaxed text-black/75">{row.body}</p>
                    {row.linkTo && row.linkLabel ? (
                      <Link
                        to={row.linkTo}
                        className="mt-4 inline-flex cursor-pointer items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal underline-offset-4 hover:underline"
                      >
                        {row.linkLabel}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </LightSection>
  )
}

function ScheduleSplit() {
  const img = usePexelsPhoto({
    query: "modern professional healthcare team collaboration office",
    fallbackUrl: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1000",
    orientation: "landscape",
  })

  return (
    <section className="w-full bg-rellia-cream/25 px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[min(38%,420px)_1fr] lg:items-start lg:gap-20">
        <div className="relative overflow-hidden rounded-[28px] border border-black/10 shadow-lg">
          <img src={img} alt="" className="aspect-[3/4] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-rellia-teal/30 to-transparent" aria-hidden />
        </div>
        <div className="pt-2">
          <NetworkEyebrow label="Your time" tone="onLight" />
          <h2 className="mt-5 font-host-grotesk text-3xl font-semibold tracking-tight text-black md:text-[48px] leading-[1.1]">
            Built for <span className="text-rellia-teal">busy</span> schedules
          </h2>
          
          <div className="mt-12 space-y-12">
            <div className="flex gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-rellia-teal">
                <Clock className="h-7 w-7" aria-hidden />
              </span>
              <div>
                <p className="font-host-grotesk text-xl font-bold text-black">1–3 hours, on your terms</p>
                <p className="mt-2 font-urbanist text-lg leading-relaxed text-black/70">
                  Advisory roles are designed for short, high-leverage blocks—adjustable as your capacity changes. Depth when
                  you opt in, never a second job by default.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-rellia-teal">
                <HeartHandshake className="h-7 w-7" aria-hidden />
              </span>
              <div>
                <p className="font-host-grotesk text-xl font-bold text-black">Volunteer role</p>
                <p className="mt-2 font-urbanist text-lg leading-relaxed text-black/70">
                  Advisors serve on a volunteer basis, focused on impact and ecosystem development. We protect your boundaries while ensuring founders get high-signal feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Advisors() {
  const { data: page, isLoading } = useNetworkAdvisorsPage()
  useApplyCmsSeo(page?.seo)

  const useModularLayout =
    Boolean(page?.useModularPage) && (page?.sections?.length ?? 0) > 0

  if (useModularLayout) {
    return <NetworkCmsPage page={page} isLoading={isLoading} />
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <RoleHero
          roleId="advisor"
          imageSrc="/images/paths-advisor-pexels.jpg"
          title={
            <>
              Some people are just wired to help <span className="text-rellia-mint">others succeed.</span>
            </>
          }
          subtitle="Mentor serious health tech founders through structured, respectful engagements—stay sharp on innovation while keeping flexibility for your career."
          primaryCta={{ label: "Apply to join", to: "/apply" }}
          secondaryCta={{ label: "Browse our Advisors", to: "/advisors/directory" }}
        />

        <SupportModelsSection />
        <ScheduleSplit />
        <BenefitsTealBand />

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

function BenefitsTealBand() {
  return (
    <section className="relative w-full overflow-hidden bg-rellia-teal px-6 py-16 md:px-10 md:py-24">
      <img
        src="/images/hologram-logo.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-12 bottom-0 w-[340px] max-w-[55vw] opacity-[0.06]"
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
        <div className="mt-12 grid grid-cols-1 gap-y-16 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-3">
          {BENEFITS.map((statement, idx) => {
            return (
              <Reveal key={idx} delay={0.05 * idx}>
                <div className="flex items-start gap-4 text-left">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rellia-mint/20">
                    <Sparkles className="h-3.5 w-3.5 text-rellia-mint" aria-hidden />
                  </div>
                  <p className="font-urbanist text-lg leading-relaxed text-white/90">{statement}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
