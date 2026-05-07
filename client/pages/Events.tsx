import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta"
import { HorizontalCard } from "@/components/cards/HorizontalCard"
import PageHeader from "@/components/PageHeader"
import { useEvents } from "@/hooks/useCmsDocuments"
import { useProgramsLandingPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_PROGRAMS_LANDING } from "@shared/cms/defaults"
import { useMemo, useState, useEffect } from "react"
import { CalendarDays, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import FilteredListEmptyState from "@/components/FilteredListEmptyState"

type EventFilter = "all" | "upcoming" | "past"
const PAGE_SIZE = 12

const MONTH_TO_INDEX: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
}

const parseLooseDateTimeToTimestamp = (raw: string): number => {
  const s = raw.trim()
  if (!s) return Number.NaN

  const direct = Date.parse(s)
  if (Number.isFinite(direct)) return direct

  // Handle strings like:
  // "Thursday, February 19, 2025 — 12:00 PM EST"
  const m = s.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b\s+(\d{1,2})\b,\s*((?:19|20)\d{2})\b/i,
  )
  if (!m) return Number.NaN

  const monthIndex = MONTH_TO_INDEX[(m[1] ?? "").toLowerCase()]
  const day = Number(m[2] ?? "")
  const year = Number(m[3] ?? "")
  if (!Number.isFinite(monthIndex) || !Number.isFinite(day) || !Number.isFinite(year)) return Number.NaN

  // Midday UTC is enough for past/upcoming classification.
  return Date.UTC(year, monthIndex, day, 12, 0, 0)
}

const getEventTimestamp = (event: any): number => {
  const candidate = event?.startsAt || event?.calendarStartsAt || event?.dateTime
  if (typeof candidate !== "string" || !candidate.trim()) return Number.NaN
  const parsed = parseLooseDateTimeToTimestamp(candidate)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

const getEventStatus = (event: any): "upcoming" | "past" => {
  const explicit = event?.status
  if (explicit === "upcoming" || explicit === "past") return explicit

  const t = getEventTimestamp(event)
  if (!Number.isFinite(t)) return "upcoming"
  return t < Date.now() ? "past" : "upcoming"
}

export default function Events() {
  const { data } = useEvents()
  const { data: programsLanding } = useProgramsLandingPage()
  const landingEvents =
    programsLanding && (Array.isArray((programsLanding as any).upcomingEvents) || Array.isArray((programsLanding as any).pastEvents))
      ? [
          ...(((programsLanding as any).upcomingEvents as any[]) ?? []),
          ...(((programsLanding as any).pastEvents as any[]) ?? []),
        ]
      : []

  const allEvents =
    Array.isArray(data) && data.length > 0
      ? data
      : landingEvents.length > 0
        ? landingEvents
        : [...DEFAULT_PROGRAMS_LANDING.upcomingEvents, ...DEFAULT_PROGRAMS_LANDING.pastEvents]
  const [eventFilter, setEventFilter] = useState<EventFilter>("all")
  const [page, setPage] = useState(1)

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const upcoming = allEvents
      .filter((e: any) => getEventStatus(e) === "upcoming")
      .sort((a: any, b: any) => {
        const at = getEventTimestamp(a)
        const bt = getEventTimestamp(b)
        if (!Number.isFinite(at) && !Number.isFinite(bt)) return 0
        if (!Number.isFinite(at)) return 1
        if (!Number.isFinite(bt)) return -1
        return at - bt
      })
    const past = allEvents
      .filter((e: any) => getEventStatus(e) === "past")
      .sort((a: any, b: any) => {
        const at = getEventTimestamp(a)
        const bt = getEventTimestamp(b)
        if (!Number.isFinite(at) && !Number.isFinite(bt)) return 0
        if (!Number.isFinite(at)) return 1
        if (!Number.isFinite(bt)) return -1
        return bt - at
      })
    return { upcomingEvents: upcoming, pastEvents: past }
  }, [allEvents])

  const visibleEvents = useMemo(() => {
    if (eventFilter === "all") {
      // Combined, sorted by date (upcoming first, then past)
      return [...upcomingEvents, ...pastEvents]
    }
    return eventFilter === "upcoming" ? upcomingEvents : pastEvents
  }, [eventFilter, upcomingEvents, pastEvents])

  useEffect(() => {
    setPage(1)
  }, [eventFilter])

  const totalPages = Math.max(1, Math.ceil(visibleEvents.length / PAGE_SIZE))
  const pageEvents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return visibleEvents.slice(start, start + PAGE_SIZE)
  }, [page, visibleEvents])

  const filters: Array<{ label: string; value: EventFilter }> = [
    { label: "All", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Past", value: "past" },
  ]

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1))
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1))

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        <PageHeader
          variant="dark"
          title={
            <>
              {programsLanding?.heroTitleLine1 ?? "Network."}{" "}
              <span className="text-rellia-mint">{programsLanding?.heroTitleMint ?? "Learn."}</span>{" "}
              {programsLanding?.heroSecondaryCtaLabel ? "" : "Scale."}
            </>
          }
          subtitle={
            programsLanding?.heroSubtitle ??
            "Discover what’s coming up, revisit past sessions, and join the conversations shaping the future of health."
          }
        />

        <section className="pt-8 pb-16 md:pt-12 md:pb-20 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <div className="mb-4">
                <h2 className="font-host-grotesk text-2xl md:text-3xl font-semibold leading-tight tracking-tight text-black">
                  {programsLanding?.programsSectionTitle?.trim()
                    ? programsLanding.programsSectionTitle.replace(/Programs/i, "Events")
                    : "Browse Events"}
                </h2>
              </div>
              <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="w-full md:w-auto">
                  <Tabs value={eventFilter} onValueChange={(v) => setEventFilter(v as EventFilter)}>
                    <TabsList
                      className={cn(
                        "relative h-auto w-fit gap-1 rounded-full bg-white p-1.5",
                        "border border-black/10 shadow-[0_12px_32px_-22px_rgba(0,0,0,0.22)]",
                      )}
                    >
                      {filters.map((f) => (
                        <TabsTrigger
                          key={f.value}
                          value={f.value}
                          className={cn(
                            "relative rounded-full px-5 py-2.5",
                            "font-host-grotesk text-[12px] font-semibold uppercase tracking-[0.14em]",
                            "text-black/80 hover:text-rellia-teal",
                            "bg-transparent data-[state=active]:bg-rellia-teal data-[state=active]:text-white data-[state=active]:shadow-none",
                            "focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                          )}
                        >
                          {eventFilter === f.value ? (
                            <motion.span
                              layoutId="events-filter-pill"
                              className="absolute inset-0 z-0 rounded-full bg-rellia-teal shadow-sm"
                              transition={{ type: "spring", stiffness: 520, damping: 42 }}
                              aria-hidden
                            />
                          ) : null}
                          <span className="relative z-[1]">{f.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                <p className="font-urbanist text-sm text-black/55 md:text-right">
                  Showing {pageEvents.length} of {visibleEvents.length} events
                </p>
              </div>

              {visibleEvents.length === 0 ? (
                <FilteredListEmptyState
                  className="mt-12"
                  icon={CalendarDays}
                  title="No events"
                  description="No events match this filter. Try another tab, or check back later for new upcoming dates and archived sessions."
                />
              ) : (
                <div className="flex flex-col">
                  <motion.div
                    layout
                    transition={{ layout: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } }}
                    className="flex flex-col gap-6 will-change-transform"
                  >
                    <AnimatePresence mode="sync" initial={false}>
                      {pageEvents.map((event) => {
                        const isPast = getEventStatus(event) === "past"
                        return (
                          <motion.div
                            key={event?.slug || `${event.title}-${event.dateTime}`}
                            layout="position"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{
                              duration: 0.26,
                              ease: [0.16, 1, 0.3, 1],
                              layout: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                            }}
                          >
                            <HorizontalCard 
                              type="event"
                              item={event} 
                              variant={isPast ? "past" : "upcoming"} 
                            />
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </motion.div>

                  {totalPages > 1 && (
                    <div className="mt-14 flex items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={handlePrevPage}
                        disabled={page <= 1}
                        className={cn(
                          "inline-flex h-12 w-12 items-center justify-center rounded-full border font-host-grotesk font-semibold transition-colors",
                          page <= 1
                            ? "cursor-not-allowed border-black/10 bg-white text-black/30"
                            : "border-black/10 bg-white text-rellia-teal hover:border-rellia-teal hover:text-rellia-teal",
                        )}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-5 w-5" aria-hidden />
                      </button>

                      <p className="font-urbanist text-base font-semibold text-black/60">
                        Page {page} of {totalPages}
                      </p>

                      <button
                        type="button"
                        onClick={handleNextPage}
                        disabled={page >= totalPages}
                        className={cn(
                          "inline-flex h-12 w-12 items-center justify-center rounded-full border font-host-grotesk font-semibold transition-colors",
                          page >= totalPages
                            ? "cursor-not-allowed border-black/10 bg-white text-black/30"
                            : "border-black/10 bg-white text-rellia-teal hover:border-rellia-teal hover:text-rellia-teal",
                        )}
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-5 w-5" aria-hidden />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </ScrollReveal>
          </div>
        </section>

        <RelliaCta
          title="Want to **speak** at a Rellia event?"
          body="If you have a practical playbook for founders building in health tech, we’d love to hear from you."
          primary={ctaActionFromHref("Contact page", "/contact")}
          secondary={ctaActionFromHref("Apply to join", "/apply")}
        />
      </main>

      <Footer />
    </div>
  )
}

