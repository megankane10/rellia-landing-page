import { useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NetworkDirectoryModal from "@/components/network/NetworkDirectoryModal"
import { PORTFOLIO_LOGO_MARKS } from "@/components/LogoMarquee"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion"
import { Search } from "lucide-react"
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
  return {
    id: `fc-${index + 1}`,
    logoName: logo.name,
    logoSrc: logo.src,
    tagline: summaries[index % summaries.length].split(" ").slice(0, 4).join(" ") + "…",
    stages: [STAGES_CYCLE[index % STAGES_CYCLE.length]],
    category: CATEGORY_CYCLE[index % CATEGORY_CYCLE.length],
    shortDescription: summaries[index % summaries.length],
    longDescription: `${summaries[index % summaries.length]} Teams in Rellia use membership for warm introductions, advisor sessions, and programs mapped to regulatory and evidence milestones—not generic accelerator fluff.`,
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
        <div className="flex min-h-[132px] items-center justify-start py-1">
          <img
            src={company.logoSrc}
            alt=""
            className="max-h-[120px] w-auto max-w-full object-contain object-left"
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
        `${c.logoName} ${c.shortDescription} ${c.stages.join(" ")} ${c.category}`.toLowerCase()
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

            {filtered.length === 0 ? (
              <p className="mt-10 font-urbanist text-black/60">No companies match that search or filters.</p>
            ) : null}
          </div>
        </section>

        <NetworkDirectoryModal open={Boolean(active)} onOpenChange={(open) => (!open ? setActiveId(null) : undefined)}>
          {active ? (
            <>
              <div className="flex flex-col">
                <div className="flex min-h-[160px] items-center justify-center py-4 md:min-h-[200px]">
                  <img
                    src={active.logoSrc}
                    alt=""
                    className="max-h-[min(40vh,220px)] w-auto max-w-full object-contain"
                  />
                </div>
                <h2 className="pt-2 font-host-grotesk text-2xl text-rellia-teal">{active.logoName}</h2>
                <div className="flex flex-wrap gap-2 pt-2">
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
                <p className="pt-4 font-urbanist text-base leading-relaxed text-black/75">{active.longDescription}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <RelliaAction asChild variant="tealFilledLift" size="comfortable">
                  <Link to="/apply" className="cursor-pointer">
                    Apply to join
                  </Link>
                </RelliaAction>
                <RelliaAction asChild variant="outlineOnWhite" size="comfortable">
                  <Link to="/advisors/directory" className="cursor-pointer">
                    Browse advisors
                  </Link>
                </RelliaAction>
              </div>
            </>
          ) : null}
        </NetworkDirectoryModal>
      </main>

      <Footer />
    </div>
  )
}
