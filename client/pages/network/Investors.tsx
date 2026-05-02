import type { ReactNode } from "react"
import { usePexelsPhoto } from "@/hooks/usePexelsPhoto"
import PageHeader from "@/components/PageHeader"
import NetworkEyebrow from "@/components/network/NetworkEyebrow"
import SectionHeading from "@/components/SectionHeading"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import ScrollReveal from "@/components/ScrollReveal"
import { cn } from "@/lib/utils"
import { ArrowRight, BarChart3, ShieldCheck, Sparkles, Users } from "lucide-react"
import { Link } from "react-router-dom"
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { CreamSection, GlassCard, GlassCardLight, LightSection, Reveal, SectionShell } from "./_shared"

const COLORS = {
  blue: "#2563eb",
  teal: "#0d9488",
  slate: "#475569",
  cyan: "#0891b2",
  indigo: "#4f46e5",
  mint: "#5eead4",
  violet: "#7c3aed",
}

const INVESTOR_BENEFITS = [
  {
    title: "Diligence-ready narratives",
    body: "Teams arrive with clearer milestones across clinical, regulatory, and commercial tracks—less scramble in your inbox.",
    icon: ShieldCheck,
  },
  {
    title: "Operator-backed signal",
    body: "Founders are coached by advisors who have shipped in healthcare—not generic mentors recycling buzzwords.",
    icon: Sparkles,
  },
  {
    title: "Curated intros",
    body: "Sessions are thesis-aware and hosted virtually—focused conversations instead of crowded demo days.",
    icon: Users,
  },
  {
    title: "Pattern visibility",
    body: "See how companies cluster by stage, modality, and buyer so you can tune allocation faster.",
    icon: BarChart3,
  },
] as const

const B2B_DATA = [
  { name: "B2B / enterprise", value: 62, fill: COLORS.blue },
  { name: "B2C / patient", value: 24, fill: COLORS.teal },
  { name: "Hybrid", value: 14, fill: COLORS.slate },
]

const STAGE_DATA = [
  { name: "Idea / pre-product", value: 12, fill: COLORS.violet },
  { name: "Pre-seed", value: 26, fill: COLORS.indigo },
  { name: "Seed", value: 38, fill: COLORS.teal },
  { name: "Series A", value: 24, fill: COLORS.cyan },
]

const DEVICE_DATA = [
  { name: "Med device / diagnostics", value: 34, fill: COLORS.blue },
  { name: "Digital / SaMD", value: 41, fill: COLORS.mint },
  { name: "Services + tech", value: 25, fill: COLORS.slate },
]

function IllustrativePie({
  title,
  data,
  ariaLabel,
}: {
  title: string
  data: Array<{ name: string; value: number; fill: string }>
  ariaLabel: string
}) {
  return (
    <GlassCardLight className="flex h-full flex-col p-6 md:p-8">
      <p className="font-host-grotesk text-lg font-semibold text-rellia-teal">{title}</p>
      <p className="mt-1 font-urbanist text-xs text-black/50">Illustrative mix for thesis fit—not a fund mandate.</p>
      <div
        className="mt-4 h-[220px] w-full min-h-[220px]"
        role="img"
        aria-label={ariaLabel}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={84}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Share"]}
              contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.08)" }}
            />
            <Legend
              verticalAlign="bottom"
              formatter={(value) => <span className="font-urbanist text-xs text-black/75">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCardLight>
  )
}

function PipelinePhotoSection({
  children,
}: {
  children: ReactNode
}) {
  const bg = usePexelsPhoto({
    query: "abstract technology network connections blue",
    fallbackUrl: "/images/metrics-bg-pexels-2.jpg",
    orientation: "landscape",
  })

  return (
    <section className="relative overflow-hidden">
      <img src={bg} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal/90 via-rellia-teal/75 to-[#0a2830]/88" aria-hidden />
      <div aria-hidden className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
      <div className="relative z-10 px-6 py-16 md:px-10 md:py-24">{children}</div>
    </section>
  )
}

function PortfolioSplit() {
  const sideImage = usePexelsPhoto({
    query: "team collaboration office healthcare meeting",
    fallbackUrl: "/images/hero-pexels-1.jpg",
    orientation: "landscape",
  })

  return (
    <CreamSection>
      <div className="mx-auto grid max-w-[1300px] gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <Reveal>
          <NetworkEyebrow label="Portfolio support" tone="onLight" />
          <h2 className="mt-5 font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-black md:text-[40px]">
            Offer Rellia to <span className="text-rellia-teal">your portfolio</span>
          </h2>
          <p className="mt-4 font-urbanist text-lg leading-relaxed text-black/70">
            If you already back exceptional teams, plug them into operators, advisors, and partner pathways that shorten cycles from pilot to procurement.
          </p>
          <div className="mt-6 flex items-center gap-2 text-rellia-teal">
            <Users className="h-5 w-5 shrink-0" aria-hidden />
            <span className="font-urbanist text-sm font-medium">Operator touchpoints, not generic coaching</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="grid gap-6">
            <div className="overflow-hidden rounded-2xl border border-rellia-teal/10 shadow-lg">
              <img
                src={sideImage}
                alt="Team collaboration in a professional setting"
                className="aspect-[4/3] h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <GlassCardLight className="p-8">
              <p className="font-host-grotesk text-lg font-semibold text-rellia-teal">Partner concierge</p>
              <p className="mt-3 font-urbanist leading-relaxed text-black/70">
                Share a portfolio company and the milestone you want to unlock—we’ll suggest the lightest-weight Rellia touchpoints to match.
              </p>
              <RelliaAction asChild variant="outlineOnWhite" size="comfortable" className="mt-6 w-full sm:w-auto">
                <Link to="/contact" className="inline-flex cursor-pointer items-center justify-center gap-2" aria-label="Contact about portfolio partnership">
                  Connect with us
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </RelliaAction>
            </GlassCardLight>
          </div>
        </Reveal>
      </div>
    </CreamSection>
  )
}

const VC_NAMES = [
  "Harbor Health Ventures",
  "Northline BioCapital",
  "Relay Angel Network",
  "Atlas Clinical Fund",
  "Brightwave Partners",
  "Cedar Grove VC",
  "Signalline Angels",
  "Maritime MedTech",
] as const

export default function Investors() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title={
            <>
              Invest where operators <span className="text-rellia-mint">already add signal</span>
            </>
          }
          subtitle={
            <p className="font-urbanist">
              Meet Rellia-backed teams with sharper milestones—clinical, regulatory, and commercial—before the usual diligence scramble.
            </p>
          }
          variant="dark"
        />

        <LightSection className="bg-rellia-cream/20 pt-10 md:pt-14">
          <div className="mx-auto max-w-[1300px]">
            <NetworkEyebrow label="Why Rellia-backed" tone="onLight" />
            <SectionHeading
              animated={false}
              title="Benefits of investing alongside Rellia"
              description="We shorten the distance between credible narrative and reality checks from people who have scaled in healthcare."
              className="mt-5"
            />
          </div>
          <div className="mx-auto mt-14 grid max-w-[1300px] grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-14 lg:grid-cols-4 lg:gap-x-10">
            {INVESTOR_BENEFITS.map((b, idx) => {
              const Icon = b.icon
              return (
                <Reveal key={b.title} delay={0.05 * idx}>
                  <div className="flex max-w-sm flex-col gap-3">
                    <Icon className="h-8 w-8 shrink-0 text-rellia-teal" aria-hidden />
                    <h3 className="font-host-grotesk text-lg font-semibold tracking-tight text-rellia-teal">{b.title}</h3>
                    <p className="font-urbanist text-base leading-relaxed text-black/70">{b.body}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </LightSection>

        <PipelinePhotoSection>
          <div className="mx-auto max-w-[1300px]">
            <ScrollReveal>
              <NetworkEyebrow label="Pipeline" tone="onDark" />
              <h2 className="mt-5 font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-white md:text-[40px]">
                How founders <span className="text-rellia-mint">cluster</span>
              </h2>
              <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-white/85">
                Illustrative distributions based on active introductions—useful for thesis alignment.
              </p>
            </ScrollReveal>
            <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Reveal delay={0.05}>
                <IllustrativePie
                  title="B2B vs B2C"
                  data={B2B_DATA}
                  ariaLabel="Pie chart of B2B versus B2C versus hybrid share"
                />
              </Reveal>
              <Reveal delay={0.08}>
                <IllustrativePie
                  title="Stages"
                  data={STAGE_DATA}
                  ariaLabel="Pie chart of company stages from idea through Series A"
                />
              </Reveal>
              <Reveal delay={0.11}>
                <IllustrativePie
                  title="Device & delivery"
                  data={DEVICE_DATA}
                  ariaLabel="Pie chart of device types and delivery models"
                />
              </Reveal>
            </div>
          </div>
        </PipelinePhotoSection>

        <section className="relative overflow-hidden bg-[#071018] px-6 py-16 text-white md:px-10 md:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
            <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-[1300px]">
            <ScrollReveal>
              <NetworkEyebrow label="Pitch formats" tone="onDark" />
              <h2 className="mt-5 font-host-grotesk text-3xl font-semibold leading-tight tracking-tight md:text-[40px]">
                Thesis sessions vs <span className="text-rellia-mint">group showcases</span>
              </h2>
              <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-white/80">
                Host a focused virtual session aligned to your mandate—or join a larger showcase to compare teams alongside fellow investors.
              </p>
            </ScrollReveal>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              <Reveal delay={0.06}>
                <GlassCard className="h-full border-white/15 bg-white/5 p-8 backdrop-blur-md">
                  <h3 className="font-host-grotesk text-xl font-semibold text-rellia-mint">Individual pitch session</h3>
                  <p className="mt-4 font-urbanist leading-relaxed text-white/80">
                    A virtual session scoped to your thesis—dig into workflow, reimbursement, or regulatory edge cases without competing noise.
                  </p>
                </GlassCard>
              </Reveal>
              <Reveal delay={0.1}>
                <GlassCard className="h-full border-white/15 bg-white/5 p-8 backdrop-blur-md">
                  <h3 className="font-host-grotesk text-xl font-semibold text-rellia-mint">Group pitch event</h3>
                  <p className="mt-4 font-urbanist leading-relaxed text-white/80">
                    See multiple teams with standardized milestones—ideal for pattern recognition and efficient filtering before deeper diligence.
                  </p>
                </GlassCard>
              </Reveal>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <RelliaAction asChild variant="mintOnTealStrip" size="comfortable">
                <Link to="/contact" className="cursor-pointer">
                  Request a session
                </Link>
              </RelliaAction>
              <RelliaAction asChild variant="heroGhostOnTeal" size="comfortable">
                <Link to="/apply" className="cursor-pointer">
                  Apply for investor updates
                </Link>
              </RelliaAction>
            </div>
          </div>
        </section>

        <LightSection className="bg-white">
          <div className="mx-auto max-w-[1300px]">
            <NetworkEyebrow label="Co-investors" tone="onLight" />
            <SectionHeading
              animated={false}
              title="VC funds and angel groups we work with"
              description="Organizations that regularly meet Rellia founders through intros, showcases, and shared diligence."
              className="mt-5"
            />
          </div>
          <div className="mx-auto mt-12 flex max-w-[1300px] flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-14">
            {VC_NAMES.map((name, idx) => (
              <Reveal key={name} delay={0.02 * idx}>
                <span
                  className={cn(
                    "block max-w-[200px] text-center font-host-grotesk text-base font-bold transition-all duration-300 md:text-lg",
                    "text-black/35 grayscale hover:scale-[1.02] hover:grayscale-0 hover:text-rellia-teal cursor-default",
                  )}
                >
                  {name}
                </span>
              </Reveal>
            ))}
          </div>
        </LightSection>

        <PortfolioSplit />


        <SectionShell className="py-16 md:py-24">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <h2 className="font-host-grotesk text-3xl font-bold tracking-tight md:text-4xl">Get investor access</h2>
                <p className="mt-4 font-urbanist text-lg leading-relaxed text-white/80">
                  Apply once—we route serious investors to curated intros, showcases, and diligence-friendly updates.
                </p>
              </div>
              <RelliaAction asChild variant="mintOnTealStrip" size="comfortable">
                <Link to="/apply" className="inline-flex cursor-pointer items-center gap-2" aria-label="Apply as investor">
                  Apply
                  <ArrowRight className="h-4 w-4" aria-hidden />
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
