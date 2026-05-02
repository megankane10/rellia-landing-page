import { useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion"
import { Globe, Linkedin, Search } from "lucide-react"
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
        "group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/10 bg-white",
        "shadow-sm transition-[box-shadow,transform] duration-300 motion-reduce:transition-none",
        "hover:shadow-md hover:-translate-y-[1px]",
      )}
      onClick={onDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onDetails()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open profile for ${advisor.name}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-rellia-cream to-rellia-cream/40">
        <img
          src={advisor.photoSrc}
          alt=""
          className="h-full w-full object-cover object-top transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          loading="lazy"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-80"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="font-host-grotesk text-lg font-semibold tracking-tight text-rellia-teal">{advisor.name}</h3>
        <p className="mt-1 font-urbanist text-sm font-medium text-black/70">{advisor.organization}</p>
        <p className="mt-0.5 font-urbanist text-sm text-black/60">{advisor.role}</p>
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
        <span className="mt-auto pt-5 font-host-grotesk text-sm font-semibold text-rellia-teal underline-offset-4 transition group-hover:underline">
          View profile
        </span>
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
      const blob =
        `${a.name} ${a.organization} ${a.role} ${a.industries.join(" ")} ${a.focus} ${a.bio}`.toLowerCase()
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
            <article className="mx-auto max-w-5xl">
              <div className="grid gap-10 lg:grid-cols-[minmax(260px,380px)_minmax(0,1fr)] lg:gap-x-14 lg:gap-y-0 xl:grid-cols-[400px_1fr]">
                <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
                  <div className="overflow-hidden rounded-2xl border border-black/10 bg-rellia-cream/20 shadow-sm">
                    <div className="aspect-[4/5] w-full max-h-[min(56vh,560px)]">
                      <img
                        src={active.photoSrc}
                        alt=""
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white px-4 py-4 md:px-5">
                    <p className="font-host-grotesk text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                      Connect
                    </p>
                    <ul className="mt-3 flex flex-col gap-3">
                      <li>
                        <a
                          href={active.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-urbanist text-sm font-semibold text-rellia-teal underline decoration-rellia-teal/25 underline-offset-4 transition hover:decoration-rellia-teal"
                        >
                          <Linkedin className="h-4 w-4 shrink-0" aria-hidden />
                          LinkedIn profile
                        </a>
                      </li>
                      {active.websiteUrl ? (
                        <li>
                          <a
                            href={active.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-urbanist text-sm font-semibold text-rellia-teal underline decoration-rellia-teal/25 underline-offset-4 transition hover:decoration-rellia-teal"
                          >
                            <Globe className="h-4 w-4 shrink-0" aria-hidden />
                            Website
                          </a>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </div>

                <div className="min-w-0 space-y-10 pb-2">
                  <header className="border-b border-black/10 pb-8">
                    <p className="font-urbanist text-xs font-semibold uppercase tracking-[0.14em] text-rellia-teal">
                      {active.filter}
                    </p>
                    <h2 className="mt-3 font-host-grotesk text-3xl font-semibold tracking-tight text-black md:text-[2rem] md:leading-tight">
                      {active.name}
                    </h2>
                    <p className="mt-2 font-urbanist text-lg font-medium text-black/75">{active.organization}</p>
                    <p className="mt-1 font-urbanist text-base text-black/65">{active.role}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {active.industries.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 font-urbanist text-xs font-medium text-black/75"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </header>

                  <section>
                    <h3 className="font-host-grotesk text-xl font-semibold text-black">About</h3>
                    <p className="mt-4 font-urbanist text-base leading-relaxed text-black/80 md:text-[17px] md:leading-relaxed">
                      {active.bio}
                    </p>
                  </section>

                  <section>
                    <h3 className="font-host-grotesk text-xl font-semibold text-black">How they mentor</h3>
                    <p className="mt-4 font-urbanist text-base leading-relaxed text-black/80 md:text-[17px] md:leading-relaxed">
                      {active.mentoringStyle}
                    </p>
                  </section>

                  <section>
                    <h3 className="font-host-grotesk text-xl font-semibold text-black">Highlights</h3>
                    <ul className="mt-4 list-none space-y-3 pl-0">
                      {active.highlights.map((line) => (
                        <li
                          key={line.slice(0, 40)}
                          className="relative pl-6 font-urbanist text-base leading-relaxed text-black/80 before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-rellia-teal md:text-[17px]"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-2xl bg-rellia-cream/35 px-5 py-5 md:px-6">
                    <h3 className="font-host-grotesk text-sm font-semibold uppercase tracking-[0.12em] text-black/55">
                      Snapshot
                    </h3>
                    <p className="mt-3 font-urbanist text-base leading-relaxed text-black/75">{active.focus}</p>
                  </section>
                </div>
              </div>
            </article>
          ) : null}
        </NetworkDirectoryModal>
      </main>

      <Footer />
    </div>
  )
}
