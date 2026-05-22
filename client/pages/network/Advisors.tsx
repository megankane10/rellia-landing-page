import PageHeader from "@/components/PageHeader"
import SectionHeading from "@/components/SectionHeading"
import WhyRellia from "@/components/WhyRellia"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta from "@/components/RelliaCta"
import ScrollReveal from "@/components/ScrollReveal"
import { cn } from "@/lib/utils"
import { ArrowRight, Award, BookOpen, Clock, Crosshair, Gauge, HeartHandshake, Network, Scale, ShieldCheck, Sparkles, Check } from "lucide-react"
import { Link } from "react-router-dom"
import LogoMarquee from "@/components/LogoMarquee"
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

const engagementCardClass =
  "group flex min-h-[240px] flex-col rounded-2xl border border-white/15 bg-white/5 p-8 backdrop-blur-md transition-colors duration-300 hover:border-rellia-mint/40 hover:bg-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal"

const ADVISOR_ENGAGEMENT = [
  {
    title: "Community & network",
    body: "Engage on your terms inside Slack and curated introductions—meet founders and fellow advisors without rigid mandates.",
    to: "/founders/alumni",
    cta: "Explore Alumni Directory",
    icon: Network,
  },
  {
    title: "Advisory board roles",
    body: "Serve as a formal advisor when there is mutual fit—typically lightweight charters scoped to milestone cadence.",
    to: "/advisors/directory",
    cta: "Meet Our Advisors",
    icon: Award,
  },
  {
    title: "Program advisor",
    body: "Shape cohort sessions and office hours inside Rellia programs—see our curriculum on the programs page.",
    to: "/programs",
    cta: "Browse Programs",
    icon: BookOpen,
  },
]

function SupportModelsSection() {
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
          <h2 className="mt-5 font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-white md:text-[40px]">
            Three ways to <span className="text-rellia-mint">work with Rellia</span>
          </h2>
          <p className="mt-4 max-w-2xl font-urbanist text-base font-medium leading-relaxed text-white/80 md:text-lg">
            Community presence, formal advisory work, or program leadership—pick surfaces that fit your cadence.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <div className="mt-12 grid grid-cols-1 gap-7 lg:grid-cols-3 lg:gap-6">
            {ADVISOR_ENGAGEMENT.map((card) => {
              const Icon = card.icon
              return (
                <Link key={card.title} to={card.to} className={engagementCardClass}>
                  <Icon className="h-8 w-8 text-rellia-mint transition-transform duration-300 group-hover:scale-105" aria-hidden />
                  <h3 className="mt-5 font-host-grotesk text-xl font-semibold tracking-tight text-white">{card.title}</h3>
                  <p className="mt-4 flex-1 font-urbanist leading-relaxed text-white/85">{card.body}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-mint">
                    {card.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
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

function ScheduleSplit() {
  return (
    <section className="w-full bg-rellia-cream/25 px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[min(38%,420px)_1fr] lg:items-start lg:gap-20">
        <div className="relative overflow-hidden rounded-[28px] border border-black/10 shadow-lg">
          <img
            src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1000"
            alt=""
            className="aspect-[3/4] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-rellia-teal/30 to-transparent" aria-hidden />
        </div>
        <div className="pt-2">
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
  const advisorsPageQuery = useNetworkAdvisorsPage()
  const { data: page } = advisorsPageQuery
  useApplyCmsSeo(page?.seo)

  const useModularLayout =
    Boolean(page?.useModularPage) && (page?.sections?.length ?? 0) > 0

  if (useModularLayout) {
    return <NetworkCmsPage page={page} query={advisorsPageQuery} />
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <div className="lg:flex lg:h-[82vh] lg:flex-col">
          <RoleHero
            roleId="advisor"
            imageSrc="/images/advisors.jpg"
            className="lg:flex-1"
            title={
              <>
                Some people are just wired to help <span className="text-rellia-mint">others succeed.</span>
              </>
            }
            subtitle="Mentor serious health tech founders through structured, respectful engagements—stay sharp on innovation while keeping flexibility for your career."
            primaryCta={{ label: "Apply to join", to: "/apply" }}
            secondaryCta={{ label: "Explore Advisors", to: "/advisors/directory" }}
          />
        </div>

        <SupportModelsSection />
        <ScheduleSplit />
        <BenefitsSplitSection />

        <WhyRellia
          sectionTitle="What we look for"
          sectionDescription="Effective advisors combine depth, specificity, and respect for founder momentum."
          features={CRITERIA_ITEMS.map((c) => ({
            title: c.title,
            description: `${c.summary} ${c.detail}`,
            iconKey: "",
          }))}
          sectionClassName="bg-white"
        />

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

function BenefitsSplitSection() {
  return (
    <CreamSection>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
        <Reveal>
          <SectionHeading
            animated={false}
            title="Mentorship that compounds"
            description="Stay close to innovation without ambient noise—sharp conversations with founders who execute."
            className="mt-5"
          />
          <ul className="mt-10 max-w-xl space-y-4" aria-label="Advisor benefits">
            {BENEFITS.map((line, idx) => (
              <Reveal key={line} delay={0.04 * idx}>
                <li className="flex gap-3 font-urbanist text-base leading-relaxed text-black/80 md:text-[17px]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rellia-mint/35">
                    <Check className="h-3.5 w-3.5 text-rellia-teal" strokeWidth={3} aria-hidden />
                  </span>
                  {line}
                </li>
              </Reveal>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="overflow-hidden rounded-2xl border border-rellia-teal/15 shadow-[0_28px_80px_-48px_rgba(13,53,64,0.45)]">
            <img
              src="/images/metrics-bg-pexels-2.jpg"
              alt="Advisors collaborating with founders"
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </CreamSection>
  )
}
