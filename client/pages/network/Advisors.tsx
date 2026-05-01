import { useMemo, useState } from "react"
import PageHeader from "@/components/PageHeader"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import SectionPillBadge from "@/components/SectionPillBadge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Award,
  BookOpen,
  Clock,
  HeartHandshake,
  Network,
  Sparkles,
  Users,
} from "lucide-react"
import { Link } from "react-router-dom"
import { CreamSection, GlassCardLight, LightSection, Reveal, SectionShell } from "./_shared"

type AdvisorRow = {
  name: string
  role: string
  industries: string[]
  focus: string
  filter: string
}

const ADVISORS: AdvisorRow[] = [
  {
    name: "Dr. Elena Ruiz",
    role: "Former Chief Medical Officer, health system",
    industries: ["Clinical ops", "Digital health"],
    focus: "Care pathway design, clinician adoption, and evidence planning for early deployments.",
    filter: "Clinical",
  },
  {
    name: "Jordan Blake",
    role: "Regulatory & quality advisor",
    industries: ["MedTech", "SaMD"],
    focus: "FDA strategy, QMS readiness, and design controls without slowing product iteration.",
    filter: "Regulatory",
  },
  {
    name: "Priya Nair",
    role: "GTM & partnerships operator",
    industries: ["B2B", "Payers"],
    focus: "Enterprise sales motion, pilot contracting, and procurement navigation.",
    filter: "GTM",
  },
  {
    name: "Dr. Henry Moss",
    role: "Academic PI, outcomes research",
    industries: ["Clinical evidence", "Diagnostics"],
    focus: "Study design, endpoints, and publication strategy aligned to buyer questions.",
    filter: "Clinical",
  },
  {
    name: "Alex Rivera",
    role: "Product & interoperability lead",
    industries: ["Digital health", "Infrastructure"],
    focus: "EHR integration patterns, security reviews, and scalable data contracts.",
    filter: "Technical",
  },
  {
    name: "Sam Okonkwo",
    role: "Finance & venture advisor",
    industries: ["Fundraising", "MedTech"],
    focus: "Modeling, diligence prep, and milestone planning for seed–Series A.",
    filter: "GTM",
  },
]

const FILTER_CHIPS = ["All", "Clinical", "Regulatory", "GTM", "Technical"] as const

const BENEFITS = [
  {
    title: "Stay up to date",
    body: "See how care delivery, reimbursement, and regulation are shifting—without living on social feeds.",
    icon: BookOpen,
  },
  {
    title: "Sharpen skills",
    body: "Practice crisp advising: scoped questions, clear decisions, and repeatable frameworks.",
    icon: Sparkles,
  },
  {
    title: "Build network",
    body: "Meet founders and peers who respect your time and bring real operational context.",
    icon: Network,
  },
  {
    title: "Expert status",
    body: "Be known for a specific edge—so introductions match your strengths, not generic “pick your brain” asks.",
    icon: Award,
  },
  {
    title: "Help patients",
    body: "Translate experience into fewer dead-ends: better products reach the bedside faster.",
    icon: HeartHandshake,
  },
] as const

export default function Advisors() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<(typeof FILTER_CHIPS)[number]>("All")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ADVISORS.filter((a) => {
      if (filter !== "All" && a.filter !== filter) return false
      if (!q) return true
      const blob = `${a.name} ${a.role} ${a.industries.join(" ")} ${a.focus}`.toLowerCase()
      return blob.includes(q)
    })
  }, [filter, query])

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <PageHeader
          title={
            <>
              Advisors who <span className="text-rellia-mint">elevate founders</span>
            </>
          }
          subtitle="High-signal mentorship with structured matches—built for clinicians, operators, and domain experts who want their time to compound."
          variant="dark"
        />

        <LightSection className="pt-10 md:pt-14">
          <Reveal>
            <Alert
              role="status"
              className="border-rellia-mint/50 bg-rellia-mint/20 backdrop-blur-md supports-[backdrop-filter]:bg-rellia-mint/15"
            >
              <Clock className="h-5 w-5 text-rellia-teal" aria-hidden />
              <AlertTitle className="font-host-grotesk text-lg text-rellia-teal">Flexible to fit your schedule</AlertTitle>
              <AlertDescription className="font-urbanist text-base text-black/75">
                Most advisors contribute about <strong className="text-black">1–3 hours</strong> per month—enough to matter,
                without becoming a second job. You choose depth, cadence, and boundaries up front.
              </AlertDescription>
            </Alert>
          </Reveal>
        </LightSection>

        <CreamSection>
          <Reveal>
            <SectionPillBadge>Benefits</SectionPillBadge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl">Why advisors join</h2>
            <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
              A membership-shaped network that treats advising like a craft—clarity, respect, and outcomes.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {BENEFITS.map((b, idx) => {
              const Icon = b.icon
              return (
                <Reveal key={b.title} delay={0.05 * idx}>
                  <GlassCardLight className="flex h-full flex-col p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rellia-teal/15 bg-rellia-mint/25 text-rellia-teal">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-4 font-host-grotesk text-lg font-semibold tracking-tight text-rellia-teal">{b.title}</h3>
                    <p className="mt-2 font-urbanist text-sm leading-relaxed text-black/70">{b.body}</p>
                  </GlassCardLight>
                </Reveal>
              )
            })}
          </div>
        </CreamSection>

        <LightSection>
          <Reveal>
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <SectionPillBadge>Directory</SectionPillBadge>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl">Advisor directory</h2>
                <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
                  Search by name or keyword, then filter by how you like to help. This is a representative sample of the
                  profiles we route to founders.
                </p>
              </div>
              <label className="w-full max-w-md font-urbanist text-sm font-semibold text-black/80">
                Search
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. regulatory, payer, EHR…"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-black outline-none ring-rellia-teal/30 placeholder:text-black/40 focus:ring-2"
                  aria-label="Search advisors"
                />
              </label>
            </div>
          </Reveal>

          <div className="mt-6 flex flex-wrap gap-2">
            {FILTER_CHIPS.map((chip) => {
              const active = filter === chip
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setFilter(chip)}
                  className={cn(
                    "rounded-full border px-4 py-2 font-urbanist text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
                    active
                      ? "border-rellia-teal bg-rellia-teal text-white"
                      : "border-black/10 bg-white text-black/70 hover:border-rellia-teal/40 hover:text-rellia-teal",
                  )}
                  aria-pressed={active}
                >
                  {chip}
                </button>
              )
            })}
          </div>

          <ul className="mt-10 grid list-none grid-cols-1 gap-4 md:grid-cols-2" aria-label="Advisor results">
            {filtered.map((a, idx) => (
              <Reveal key={a.name} delay={0.03 * idx}>
                <li>
                  <GlassCardLight className="p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-host-grotesk text-xl font-semibold tracking-tight text-rellia-teal">{a.name}</p>
                        <p className="mt-1 font-urbanist text-black/65">{a.role}</p>
                      </div>
                      <span className="rounded-full border border-rellia-teal/20 bg-rellia-mint/15 px-3 py-1 font-urbanist text-xs font-semibold text-rellia-teal">
                        {a.filter}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {a.industries.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 font-urbanist text-xs font-medium text-black/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 border-t border-black/10 pt-5">
                      <p className="font-host-grotesk text-sm font-semibold uppercase tracking-wide text-black/50">
                        Mentorship focus
                      </p>
                      <p className="mt-2 font-urbanist leading-relaxed text-black/75">{a.focus}</p>
                    </div>
                  </GlassCardLight>
                </li>
              </Reveal>
            ))}
          </ul>

          {filtered.length === 0 ? (
            <p className="mt-8 font-urbanist text-black/60">No advisors match that search—try a broader keyword.</p>
          ) : null}
        </LightSection>

        <CreamSection>
          <Reveal>
            <SectionPillBadge>Criteria</SectionPillBadge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl">What we look for</h2>
            <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
              We optimize for depth, kindness, and specificity—so founders get advice they can actually execute.
            </p>
          </Reveal>
          <div className="mt-8 max-w-3xl">
            <Accordion type="single" collapsible className="w-full rounded-2xl border border-black/10 bg-white/90 px-2">
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-4 font-host-grotesk text-left text-lg text-rellia-teal hover:no-underline">
                  Real-world execution experience
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 font-urbanist leading-relaxed text-black/70">
                  You’ve shipped, regulated, sold, studied, or scaled inside healthcare—not only advised from the sidelines.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="px-4 font-host-grotesk text-left text-lg text-rellia-teal hover:no-underline">
                  Clear boundaries and generosity
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 font-urbanist leading-relaxed text-black/70">
                  You can say no cleanly, protect patient safety, and still leave founders with a crisp next step.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="px-4 font-host-grotesk text-left text-lg text-rellia-teal hover:no-underline">
                  Specific “superpowers”
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 font-urbanist leading-relaxed text-black/70">
                  A narrow expertise beats a generalist resume—our matching works best when your edge is obvious.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="px-4 font-host-grotesk text-left text-lg text-rellia-teal hover:no-underline">
                  Respect for founder momentum
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 font-urbanist leading-relaxed text-black/70">
                  Advice is timed to milestones: evidence, regulatory, clinical workflow, and commercial traction—not
                  theoretical debates.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CreamSection>

        <SectionShell className="py-16 md:py-24">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-white/90">
                  <Users className="h-5 w-5 text-rellia-mint" aria-hidden />
                  <span className="font-urbanist text-sm font-semibold uppercase tracking-wider">Join</span>
                </div>
                <h2 className="mt-3 font-host-grotesk text-3xl font-bold tracking-tight md:text-4xl">Apply to join as an advisor</h2>
                <p className="mt-4 font-urbanist text-lg leading-relaxed text-white/80">
                  Share your background and availability—we’ll follow up with fit, expectations, and onboarding.
                </p>
              </div>
              <RelliaAction asChild variant="mintOnTealStrip" size="comfortable">
                <Link
                  to="/apply?type=advisor"
                  className="inline-flex items-center gap-2"
                  aria-label="Apply to join as an advisor"
                >
                  Apply to join
                  <ArrowRight aria-hidden className="h-4 w-4" />
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
