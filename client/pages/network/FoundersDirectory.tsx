import { useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NetworkDirectoryModal from "@/components/network/NetworkDirectoryModal"
import { PORTFOLIO_LOGO_MARKS } from "@/components/LogoMarquee"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion"
import { Building2, Search } from "lucide-react"
import FilteredListEmptyState from "@/components/FilteredListEmptyState"
import { Link } from "react-router-dom"

/** Gray-teal tone for directory heroes */
const DIRECTORY_KICKER_CLASS = "font-urbanist text-sm font-semibold uppercase tracking-[0.16em] text-[#5A726F]"
const DIRECTORY_TITLE_CLASS =
  "font-host-grotesk text-4xl font-extrabold tracking-tight text-[#4F6562] md:text-5xl"

type StageTag = "Idea" | "Pre-seed" | "Seed" | "Series A"

type FounderCategory =
  | "Digital health"
  | "Diagnostics & labs"
  | "Med device"
  | "Care delivery"
  | "Analytics & employer"

type FounderCompany = {
  id: string
  logoName: string
  logoSrc: string
  tagline: string
  stages: StageTag[]
  category: FounderCategory
  shortDescription: string
  longDescription: string
  /** Illustrative company site — placeholder domain */
  websiteUrl: string
  traction: string
  relliaCollaboration: string
}

const STAGES_CYCLE: StageTag[] = ["Pre-seed", "Seed", "Seed", "Series A", "Pre-seed", "Idea"]

const CATEGORY_CYCLE: FounderCategory[] = [
  "Digital health",
  "Diagnostics & labs",
  "Med device",
  "Care delivery",
  "Analytics & employer",
]

const ALL_STAGES = ["Idea", "Pre-seed", "Seed", "Series A"] as const

const slugFromName = (name: string) => {
  const s = name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 32)
  return s || "company"
}

const FOUNDER_DIRECTORY: FounderCompany[] = PORTFOLIO_LOGO_MARKS.slice(0, 12).map((logo, index) => {
  const summaries = [
    "Clinical workflow tooling with early hospital pilots and a focused UX research lane.",
    "Diagnostics-adjacent platform prioritizing interoperability and lab partnerships.",
    "Digital therapeutic pathways with clinician-in-the-loop protocols.",
    "Care navigation layer integrating payer-friendly utilization narratives.",
    "Device-enabled rehab telemetry with home-use ergonomics as the wedge.",
    "Population analytics prototype translating claims feeds into operational KPIs.",
    "Pharmacovigilance workflow automation for emerging therapeutic portfolios.",
    "Remote monitoring stack emphasizing alert fatigue reduction across nursing stations.",
    "Surgical coordination SaaS aligned to OR block-time realities and vendor neutrality.",
    "Patient engagement micro-apps anchored on culturally competent education journeys.",
    "Employer-facing benefits analytics tying biometric pilots to absenteeism deltas.",
    "Credentialing automation prototype shortening onboarding without sacrificing audit trails.",
  ]
  const base = summaries[index % summaries.length]
  const slug = slugFromName(logo.name)
  return {
    id: `fc-${index + 1}`,
    logoName: logo.name,
    logoSrc: logo.src,
    tagline: base.split(" ").slice(0, 4).join(" ") + "…",
    stages: [STAGES_CYCLE[index % STAGES_CYCLE.length]],
    category: CATEGORY_CYCLE[index % CATEGORY_CYCLE.length],
    shortDescription: base,
    longDescription: `${base} The team structures pilots with clear clinical owners, success criteria, and a defensible data plan for the next financing conversation.`,
    websiteUrl: `https://www.${slug}.example`,
    traction: `Active pilots with health system and specialty partners; expanding integration surface area and outcome readouts in line with ${CATEGORY_CYCLE[index % CATEGORY_CYCLE.length].toLowerCase()} buyer expectations. Roadmap tied to evidence milestones, not vanity releases.`,
    relliaCollaboration: `Rellia membership is used for warm operator intros, advisor deep-dives on protocol and procurement, and program cadence that matches regulatory and study timelines—so the company isn’t building in a silo while the market moves.`,
  }
})

function FounderDirectoryCard({
  company,
  onOpen,
}: {
  company: FounderCompany
  onOpen: () => void
}) {
  return (
    <motion.article
      layout
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white",
        "shadow-sm transition-[box-shadow,transform] duration-300 motion-reduce:transition-none",
        "cursor-pointer hover:shadow-md hover:-translate-y-[1px]",
      )}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onOpen()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${company.logoName}`}
    >
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex min-h-[132px] w-full items-center justify-center py-1">
          <img
            src={company.logoSrc}
            alt=""
            className="max-h-[120px] w-auto max-w-full object-contain object-center"
          />
        </div>
        <h3 className="mt-5 font-host-grotesk text-lg font-semibold tracking-tight text-rellia-teal">
          {company.logoName}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-0.5 font-urbanist text-xs font-semibold text-black/70">
            {company.category}
          </span>
          {company.stages.map((s) => (
            <span
              key={s}
              className="inline-flex rounded-full border border-rellia-teal/20 bg-rellia-mint/20 px-2.5 py-0.5 font-urbanist text-xs font-semibold text-rellia-teal"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="mt-4 line-clamp-3 font-urbanist text-sm leading-relaxed text-black/70">{company.shortDescription}</p>
        <span className="mt-auto pt-5 font-host-grotesk text-sm font-semibold text-rellia-teal underline-offset-4 group-hover:underline">
          View details
        </span>
      </div>
    </motion.article>
  )
}

export default function FoundersDirectory() {
  const reduceMotion = useReducedMotion()
  const [query, setQuery] = useState("")
  const [stageFilter, setStageFilter] = useState<"all" | StageTag>("all")
  const [categoryFilter, setCategoryFilter] = useState<"all" | FounderCategory>("all")
  const [activeId, setActiveId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FOUNDER_DIRECTORY.filter((c) => {
      if (stageFilter !== "all" && !c.stages.includes(stageFilter)) return false
      if (categoryFilter !== "all" && c.category !== categoryFilter) return false
      if (!q) return true
      const blob =
        `${c.logoName} ${c.shortDescription} ${c.stages.join(" ")} ${c.category} ${c.traction}`.toLowerCase()
      return blob.includes(q)
    })
  }, [query, stageFilter, categoryFilter])

  const active = useMemo(() => FOUNDER_DIRECTORY.find((c) => c.id === activeId) ?? null, [activeId])

  const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]
  const container: Variants = {
    hidden: reduceMotion ? {} : { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduceMotion
        ? undefined
        : { duration: 0.35, ease: EASE_OUT, when: "beforeChildren", staggerChildren: 0.06 },
    },
  }
  const item: Variants = {
    hidden: reduceMotion ? {} : { opacity: 0, y: 14 },
    show: reduceMotion ? {} : { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />

      <main id="main-content">
        <section className="border-b border-black/10 bg-rellia-cream/40 pt-28 pb-12 md:pt-36 md:pb-16">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10">
            <p className={DIRECTORY_KICKER_CLASS}>Founders</p>
            <h1 className={cn(DIRECTORY_TITLE_CLASS, "mt-4")}>Founder directory</h1>
            <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
              Representative companies from the Rellia portfolio network—stage tags and summaries help you see who is building
              alongside you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <RelliaAction asChild variant="outlineOnWhite" size="comfortable">
                <Link to="/founders" className="cursor-pointer">
                  Back to Founders
                </Link>
              </RelliaAction>
              <RelliaAction asChild variant="tealFilledLift" size="comfortable">
                <Link to="/apply" className="cursor-pointer">
                  Apply to join
                </Link>
              </RelliaAction>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10">
            <label className="relative block max-w-xl">
              <span className="sr-only">Search companies</span>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45"
                aria-hidden
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search by name, stage, category, or keyword…"
                className={cn(
                  "h-12 w-full rounded-2xl border border-black/10 bg-white pl-10 pr-4",
                  "font-urbanist text-sm text-black placeholder:text-black/45",
                  "outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
                )}
              />
            </label>

            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-start lg:gap-8">
              <div>
                <p className="font-urbanist text-xs font-semibold uppercase tracking-wide text-black/45">Stage</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setStageFilter("all")}
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1.5 font-urbanist text-sm font-semibold transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
                      stageFilter === "all"
                        ? "border-rellia-teal bg-rellia-teal text-white"
                        : "border-black/10 bg-white text-black/70 hover:border-rellia-teal/40 hover:text-rellia-teal",
                    )}
                    aria-pressed={stageFilter === "all"}
                  >
                    All stages
                  </button>
                  {ALL_STAGES.map((s) => {
                    const isActive = stageFilter === s
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStageFilter(s)}
                        className={cn(
                          "cursor-pointer rounded-full border px-3 py-1.5 font-urbanist text-sm font-semibold transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
                          isActive
                            ? "border-rellia-teal bg-rellia-teal text-white"
                            : "border-black/10 bg-white text-black/70 hover:border-rellia-teal/40 hover:text-rellia-teal",
                        )}
                        aria-pressed={isActive}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <p className="font-urbanist text-xs font-semibold uppercase tracking-wide text-black/45">Category</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setCategoryFilter("all")}
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1.5 font-urbanist text-sm font-semibold transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
                      categoryFilter === "all"
                        ? "border-rellia-teal bg-rellia-teal text-white"
                        : "border-black/10 bg-white text-black/70 hover:border-rellia-teal/40 hover:text-rellia-teal",
                    )}
                    aria-pressed={categoryFilter === "all"}
                  >
                    All categories
                  </button>
                  {CATEGORY_CYCLE.map((cat) => {
                    const isActive = categoryFilter === cat
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoryFilter(cat)}
                        className={cn(
                          "cursor-pointer rounded-full border px-3 py-1.5 font-urbanist text-sm font-semibold transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
                          isActive
                            ? "border-rellia-teal bg-rellia-teal text-white"
                            : "border-black/10 bg-white text-black/70 hover:border-rellia-teal/40 hover:text-rellia-teal",
                        )}
                        aria-pressed={isActive}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <FilteredListEmptyState
                className="mt-10"
                icon={Building2}
                title="No companies match this search"
                description="Adjust your keywords, stage, or category filters to explore the founder directory."
              />
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((c) => (
                    <motion.div key={c.id} variants={item} layout>
                      <FounderDirectoryCard company={c} onOpen={() => setActiveId(c.id)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>

        <NetworkDirectoryModal open={Boolean(active)} onOpenChange={(open) => (!open ? setActiveId(null) : undefined)}>
          {active ? (
            <article className="mx-auto max-w-4xl">
              <div className="flex min-h-[140px] items-center justify-center border-b border-black/10 pb-8 md:min-h-[180px] md:pb-10">
                <img
                  src={active.logoSrc}
                  alt=""
                  className="max-h-[min(36vh,260px)] w-auto max-w-full object-contain object-center"
                />
              </div>
              <header className="pt-8 md:pt-10">
                <h2 className="font-host-grotesk text-2xl font-semibold tracking-tight text-rellia-teal md:text-3xl">
                  {active.logoName}
                </h2>
                <p className="mt-2 font-urbanist text-sm text-black/55">{active.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 font-urbanist text-xs font-semibold text-black/70">
                    {active.category}
                  </span>
                  {active.stages.map((s) => (
                    <span
                      key={s}
                      className="inline-flex rounded-full border border-rellia-teal/20 bg-rellia-mint/20 px-3 py-1 font-urbanist text-xs font-semibold text-rellia-teal"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </header>

              <section className="mt-10 border-t border-black/10 pt-10">
                <h3 className="font-host-grotesk text-lg font-semibold text-black">Overview</h3>
                <p className="mt-3 font-urbanist text-base leading-relaxed text-black/80">{active.longDescription}</p>
              </section>

              <section className="mt-10">
                <h3 className="font-host-grotesk text-lg font-semibold text-black">Traction & roadmap</h3>
                <p className="mt-3 font-urbanist text-base leading-relaxed text-black/80">{active.traction}</p>
              </section>

              <section className="mt-10">
                <h3 className="font-host-grotesk text-lg font-semibold text-black">Collaborating through Rellia</h3>
                <p className="mt-3 font-urbanist text-base leading-relaxed text-black/80">{active.relliaCollaboration}</p>
              </section>

              <section className="mt-10 rounded-2xl border border-black/10 bg-rellia-cream/25 px-5 py-5 md:px-6 md:py-6">
                <h3 className="font-host-grotesk text-sm font-semibold uppercase tracking-[0.12em] text-black/55">
                  Company website
                </h3>
                <a
                  href={active.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex max-w-full break-all font-urbanist text-base font-semibold text-rellia-teal underline decoration-rellia-teal/30 underline-offset-4 transition-colors hover:decoration-rellia-teal"
                >
                  {active.websiteUrl.replace(/^https?:\/\//, "")}
                </a>
                <p className="mt-2 font-urbanist text-xs leading-relaxed text-black/50">
                  External link opens in a new tab. Domain shown is illustrative for this directory preview.
                </p>
              </section>
            </article>
          ) : null}
        </NetworkDirectoryModal>
      </main>

      <Footer />
    </div>
  )
}
