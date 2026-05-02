import { useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion"
import { ExternalLink, Search } from "lucide-react"
import {
  ADVISOR_DIRECTORY_SEED,
  ADVISOR_FILTER_OPTIONS,
  type AdvisorDirectoryEntry,
  type AdvisorDirectoryFilter,
} from "@/data/advisorDirectory"
import NetworkDirectoryModal from "@/components/network/NetworkDirectoryModal"
import { Link } from "react-router-dom"

const DIRECTORY_KICKER_CLASS = "font-urbanist text-sm font-semibold uppercase tracking-[0.16em] text-[#5A726F]"
const DIRECTORY_TITLE_CLASS =
  "font-host-grotesk text-4xl font-extrabold tracking-tight text-[#4F6562] md:text-5xl"

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
}

function AdvisorCard({
  advisor,
  onDetails,
}: {
  advisor: AdvisorDirectoryEntry
  onDetails: () => void
}) {
  return (
    <motion.article
      layout
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white",
        "shadow-sm transition-[box-shadow,transform] duration-300 motion-reduce:transition-none",
        "hover:shadow-md hover:-translate-y-[1px]",
      )}
    >
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex items-start gap-4">
          {advisor.logoSrc ? (
            <img
              src={advisor.logoSrc}
              alt=""
              className="h-14 w-14 shrink-0 rounded-xl border border-black/10 object-contain p-1"
            />
          ) : (
            <span
              aria-hidden
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-rellia-teal/20 bg-rellia-mint/25 font-host-grotesk text-sm font-bold text-rellia-teal"
            >
              {initials(advisor.organization)}
            </span>
          )}
          <div className="min-w-0">
            <h3 className="font-host-grotesk text-lg font-semibold tracking-tight text-rellia-teal">{advisor.name}</h3>
            <p className="mt-0.5 font-urbanist text-sm text-black/65">{advisor.organization}</p>
            <p className="mt-1 font-urbanist text-sm text-black/70">{advisor.role}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-rellia-teal/20 bg-rellia-mint/15 px-3 py-1 font-urbanist text-xs font-semibold text-rellia-teal">
            {advisor.filter}
          </span>
          {advisor.industries.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 font-urbanist text-xs font-medium text-black/70"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-4 line-clamp-3 flex-1 font-urbanist text-sm leading-relaxed text-black/75">{advisor.focus}</p>
        <RelliaAction
          type="button"
          variant="outlineOnWhite"
          size="compact"
          className="mt-6 w-fit px-5 cursor-pointer"
          onClick={onDetails}
          aria-label={`View details for ${advisor.name}`}
        >
          View profile
        </RelliaAction>
      </div>
    </motion.article>
  )
}

export default function AdvisorsDirectory() {
  const reduceMotion = useReducedMotion()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"all" | AdvisorDirectoryFilter>("all")
  const [activeId, setActiveId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ADVISOR_DIRECTORY_SEED.filter((a) => {
      if (filter !== "all" && a.filter !== filter) return false
      if (!q) return true
      const blob = `${a.name} ${a.organization} ${a.role} ${a.industries.join(" ")} ${a.focus}`.toLowerCase()
      return blob.includes(q)
    })
  }, [filter, query])

  const active = useMemo(() => ADVISOR_DIRECTORY_SEED.find((a) => a.id === activeId) ?? null, [activeId])

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
            <p className={DIRECTORY_KICKER_CLASS}>Advisors</p>
            <h1 className={cn(DIRECTORY_TITLE_CLASS, "mt-4")}>Advisor directory</h1>
            <p className="mt-4 max-w-2xl font-urbanist text-lg leading-relaxed text-black/70">
              Search and filter operators, clinicians, and specialists who opt into high-signal mentorship with serious
              founders.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <RelliaAction asChild variant="outlineOnWhite" size="comfortable">
                <Link to="/advisors" className="cursor-pointer">
                  Back to Advisors
                </Link>
              </RelliaAction>
              <RelliaAction asChild variant="tealFilledLift" size="comfortable">
                <Link to="/apply" className="cursor-pointer">
                  Apply as advisor
                </Link>
              </RelliaAction>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative block w-full max-w-xl flex-1">
                <span className="sr-only">Search advisors</span>
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45"
                  aria-hidden
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Name, organization, expertise…"
                  className={cn(
                    "h-12 w-full rounded-2xl border border-black/10 bg-white pl-10 pr-4",
                    "font-urbanist text-sm text-black placeholder:text-black/45",
                    "outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
                  )}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {ADVISOR_FILTER_OPTIONS.map((f) => {
                  const isActive = filter === f.id
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilter(f.id)}
                      className={cn(
                        "cursor-pointer rounded-full border px-4 py-2 font-urbanist text-sm font-semibold transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
                        isActive
                          ? "border-rellia-teal bg-rellia-teal text-white"
                          : "border-black/10 bg-white text-black/70 hover:border-rellia-teal/40 hover:text-rellia-teal",
                      )}
                      aria-pressed={isActive}
                    >
                      {f.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((a) => (
                  <motion.div key={a.id} variants={item} layout>
                    <AdvisorCard advisor={a} onDetails={() => setActiveId(a.id)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 ? (
              <p className="mt-10 font-urbanist text-black/60">No advisors match—try another keyword or filter.</p>
            ) : null}
          </div>
        </section>

        <NetworkDirectoryModal open={Boolean(active)} onOpenChange={(open) => (!open ? setActiveId(null) : undefined)}>
          {active ? (
            <>
              <div className="flex flex-col">
                <div className="flex min-h-[120px] flex-col justify-center gap-6 md:flex-row md:items-center md:gap-8">
                  {active.logoSrc ? (
                    <img
                      src={active.logoSrc}
                      alt=""
                      className="mx-auto max-h-[min(28vh,180px)] w-auto max-w-[min(88vw,280px)] object-contain md:mx-0"
                    />
                  ) : (
                    <span className="mx-auto flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-rellia-teal/25 bg-rellia-mint/20 font-host-grotesk text-2xl font-bold text-rellia-teal md:mx-0 md:h-32 md:w-32">
                      {initials(active.organization)}
                    </span>
                  )}
                  <div className="min-w-0 text-center md:text-left">
                    <h2 className="font-host-grotesk text-2xl text-rellia-teal md:text-3xl">{active.name}</h2>
                    <p className="mt-1 font-urbanist text-sm text-black/65">{active.organization}</p>
                    <p className="mt-1 font-urbanist text-sm text-black/70">{active.role}</p>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-6 md:justify-start">
                  {active.industries.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 font-urbanist text-xs font-medium text-black/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="pt-4 text-center font-urbanist text-base leading-relaxed text-black/75 md:text-left">{active.focus}</p>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                <RelliaAction asChild variant="tealFilledLift" size="comfortable">
                  <Link to="/apply" className="cursor-pointer">
                    Apply as advisor
                  </Link>
                </RelliaAction>
                {active.linkedInUrl ? (
                  <RelliaAction asChild variant="outlineOnWhite" size="comfortable">
                    <a href={active.linkedInUrl} target="_blank" rel="noreferrer" className="cursor-pointer">
                      LinkedIn
                      <ExternalLink className="h-4 w-4" aria-hidden />
                    </a>
                  </RelliaAction>
                ) : null}
              </div>
            </>
          ) : null}
        </NetworkDirectoryModal>
      </main>

      <Footer />
    </div>
  )
}
