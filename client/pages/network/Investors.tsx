import PageHeader from "@/components/PageHeader"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import SectionPillBadge from "@/components/SectionPillBadge"
import { cn } from "@/lib/utils"
import { ArrowRight, Users } from "lucide-react"
import { Link } from "react-router-dom"
import {
  CreamSection,
  GlassCard,
  GlassCardLight,
  LightSection,
  MultiStepSignupForm,
  Reveal,
  SectionShell,
} from "./_shared"

type Slice = { label: string; pct: number; color: string }

const COLORS = {
  blue: "#2563eb",
  teal: "#0d9488",
  slate: "#475569",
  cyan: "#0891b2",
  indigo: "#4f46e5",
  mint: "#5eead4",
}

function PipelineDonut({ title, slices }: { title: string; slices: Slice[] }) {
  const total = slices.reduce((s, x) => s + x.pct, 0)
  const normalized =
    total === 100
      ? slices
      : slices.map((x) => ({
          ...x,
          pct: Math.round((x.pct / total) * 100),
        }))

  let acc = 0
  const parts = normalized.map((s) => {
    const start = acc
    acc += s.pct
    return `${s.color} ${start}% ${acc}%`
  })
  const gradient = `conic-gradient(${parts.join(", ")})`

  return (
    <GlassCardLight className="flex h-full flex-col p-6 md:p-8">
      <p className="font-host-grotesk text-lg font-semibold text-rellia-teal">{title}</p>
      <div className="mt-6 flex flex-1 flex-col items-center justify-center">
        <div
          className="relative h-40 w-40 shrink-0 rounded-full border border-black/5 shadow-inner"
          style={{ background: gradient }}
          role="img"
          aria-label={`${title} distribution`}
        >
          <div className="absolute inset-[24%] rounded-full border border-black/10 bg-white shadow-sm" />
        </div>
      </div>
      <ul className="mt-6 space-y-2 font-urbanist text-sm">
        {normalized.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3 text-black/75">
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
              <span className="truncate">{s.label}</span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-black/85">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </GlassCardLight>
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
              A portfolio you&apos;ll be <span className="text-rellia-mint">proud to back</span>
            </>
          }
          subtitle="Meet teams with clearer milestones—clinical, regulatory, and commercial—before the usual diligence scramble."
          variant="dark"
        />

        <LightSection className="pt-10 md:pt-14">
          <Reveal>
            <SectionPillBadge>Pipeline</SectionPillBadge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl">How founders cluster today</h2>
            <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
              Illustrative mix based on active introductions—useful for thesis fit, not a fund mandate.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Reveal delay={0.05}>
              <PipelineDonut
                title="B2B vs B2C"
                slices={[
                  { label: "B2B / enterprise", pct: 62, color: COLORS.blue },
                  { label: "B2C / patient", pct: 24, color: COLORS.teal },
                  { label: "Hybrid", pct: 14, color: COLORS.slate },
                ]}
              />
            </Reveal>
            <Reveal delay={0.08}>
              <PipelineDonut
                title="Company stages"
                slices={[
                  { label: "Pre-seed", pct: 28, color: COLORS.indigo },
                  { label: "Seed", pct: 44, color: COLORS.teal },
                  { label: "Series A", pct: 28, color: COLORS.cyan },
                ]}
              />
            </Reveal>
            <Reveal delay={0.11}>
              <PipelineDonut
                title="Device & delivery"
                slices={[
                  { label: "Med device / diagnostics", pct: 34, color: COLORS.blue },
                  { label: "Digital / SaMD", pct: 41, color: COLORS.mint },
                  { label: "Services + tech", pct: 25, color: COLORS.slate },
                ]}
              />
            </Reveal>
          </div>
        </LightSection>

        <section className="relative overflow-hidden bg-[#071018] px-6 md:px-10 py-16 md:py-24 text-white">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
            <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-[1300px]">
            <Reveal>
              <SectionPillBadge className="border-white/20 bg-white/10 text-white">Pitch events</SectionPillBadge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Individual vs group pitch events</h2>
              <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-white/75">
                High-contrast sessions designed for real decisions—whether you prefer deep 1:1 dives or efficient cohort
                reviews.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              <Reveal delay={0.06}>
                <GlassCard className="h-full border-white/15 bg-white/5 p-8 backdrop-blur-md">
                  <h3 className="font-host-grotesk text-xl font-semibold text-rellia-mint">Individual sessions</h3>
                  <p className="mt-4 font-urbanist leading-relaxed text-white/80">
                    Tailored narrative, targeted diligence questions, and space to go deep on clinical workflow,
                    reimbursement, or regulatory edge cases—without an audience.
                  </p>
                </GlassCard>
              </Reveal>
              <Reveal delay={0.1}>
                <GlassCard className="h-full border-white/15 bg-white/5 p-8 backdrop-blur-md">
                  <h3 className="font-host-grotesk text-xl font-semibold text-rellia-mint">Group reviews</h3>
                  <p className="mt-4 font-urbanist leading-relaxed text-white/80">
                    See multiple teams in one sitting with standardized milestones—ideal for pattern recognition,
                    thesis tuning, and fast filtering before you commit partner time.
                  </p>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </section>

        <LightSection>
          <Reveal>
            <SectionPillBadge>Social proof</SectionPillBadge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl">VC funds & angel groups</h2>
            <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
              Organizations that regularly meet Rellia founders through intros, showcases, and shared diligence.
            </p>
          </Reveal>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-14">
            {VC_NAMES.map((name, idx) => (
              <Reveal key={name} delay={0.02 * idx}>
                <span
                  className={cn(
                    "block max-w-[200px] text-center font-host-grotesk text-base font-bold transition-all duration-300 md:text-lg",
                    "text-black/35 grayscale hover:scale-[1.02] hover:grayscale-0 hover:text-rellia-teal",
                  )}
                >
                  {name}
                </span>
              </Reveal>
            ))}
          </div>
        </LightSection>

        <CreamSection>
          <Reveal>
            <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div>
                <div className="flex items-center gap-2 text-rellia-teal">
                  <Users className="h-5 w-5" aria-hidden />
                  <span className="font-urbanist text-sm font-semibold uppercase tracking-wider">Portfolio partners</span>
                </div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl">Connect Rellia to your portfolio</h2>
                <p className="mt-4 font-urbanist text-lg leading-relaxed text-black/70">
                  If you already back exceptional teams, we can plug them into operators, advisors, and partner pathways
                  that shorten cycles from pilot to procurement.
                </p>
              </div>
              <GlassCardLight className="p-8">
                <p className="font-host-grotesk text-lg font-semibold text-rellia-teal">Partner concierge</p>
                <p className="mt-3 font-urbanist leading-relaxed text-black/70">
                  Share a portfolio company and the milestone you want to unlock—we’ll suggest the lightest-weight Rellia
                  touchpoints to match.
                </p>
                <RelliaAction asChild variant="outlineOnWhite" size="comfortable" className="mt-6 w-full sm:w-auto">
                  <Link to="/contact" className="inline-flex items-center justify-center gap-2" aria-label="Connect as a portfolio partner">
                    Connect to partner
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </Link>
                </RelliaAction>
              </GlassCardLight>
            </div>
          </Reveal>
        </CreamSection>

        <SectionShell className="py-16 md:py-24">
          <div id="signup" className="scroll-mt-28">
            <Reveal>
              <MultiStepSignupForm
                ctaLabel="Request investor access"
                roleLabel="Investor"
                step2Fields={[
                  { name: "firm", label: "Firm / fund", placeholder: "Your fund or family office" },
                  { name: "thesis", label: "Investment thesis", placeholder: "Digital health, med device, diagnostics…" },
                  { name: "check", label: "Typical check size", placeholder: "$250k – $2M" },
                  { name: "geography", label: "Geography", placeholder: "North America / Global" },
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
