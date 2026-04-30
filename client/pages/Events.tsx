import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta"
import { EventCard, eventKey } from "@/components/cards"
import PageHeader from "@/components/PageHeader"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProgramsLandingPage } from "@/hooks/useCmsDocuments"
import { cn } from "@/lib/utils"
import { DEFAULT_PROGRAMS_LANDING } from "@shared/cms/defaults"
import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

type EventsFilter = "all" | "upcoming" | "past"
const PAGE_SIZE = 12

export default function Events() {
  const { data } = useProgramsLandingPage()
  const pl = data ?? DEFAULT_PROGRAMS_LANDING
  const [eventsFilter, setEventsFilter] = useState<EventsFilter>("all")
  const [page, setPage] = useState(1)

  const filters: Array<{ label: string; value: EventsFilter }> = [
    { label: "All", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Past", value: "past" },
  ]

  const visibleEvents = useMemo(() => {
    if (eventsFilter === "upcoming") {
      return pl.upcomingEvents.map((e) => ({ ...e, _variant: "upcoming" as const }))
    }
    if (eventsFilter === "past") {
      return pl.pastEvents.map((e) => ({ ...e, _variant: "past" as const }))
    }
    return [
      ...pl.upcomingEvents.map((e) => ({ ...e, _variant: "upcoming" as const })),
      ...pl.pastEvents.map((e) => ({ ...e, _variant: "past" as const })),
    ]
  }, [eventsFilter, pl.pastEvents, pl.upcomingEvents])

  useEffect(() => {
    setPage(1)
  }, [eventsFilter])

  const totalPages = Math.max(1, Math.ceil(visibleEvents.length / PAGE_SIZE))
  const pageEvents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return visibleEvents.slice(start, start + PAGE_SIZE)
  }, [page, visibleEvents])

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
              Network. <span className="text-rellia-mint">Learn.</span> Scale.
            </>
          }
          subtitle="Discover what’s coming up, revisit past sessions, and join the conversations shaping the future of health."
        />

        <section className="pt-10 pb-16 md:pt-12 md:pb-20 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <div className="mb-4">
                <h2 className="font-host-grotesk text-2xl md:text-3xl font-semibold leading-tight tracking-tight text-black">
                  Browse Events
                </h2>
              </div>
              <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="w-full md:w-auto">
                  {/* Mobile: full-width segmented options */}
                  <div className="md:hidden">
                    <Tabs value={eventsFilter} onValueChange={(v) => setEventsFilter(v as EventsFilter)}>
                      <TabsList
                        className={cn(
                          "relative h-auto w-full gap-1 rounded-full bg-white p-1.5",
                          "border border-black/10 shadow-[0_12px_32px_-22px_rgba(0,0,0,0.22)]",
                        )}
                      >
                        {filters.map((f) => (
                          <TabsTrigger
                            key={f.value}
                            value={f.value}
                            className={cn(
                              "relative z-10 flex-1 rounded-full px-3 py-2.5 text-center",
                              "font-host-grotesk text-[12px] font-semibold uppercase tracking-[0.14em]",
                              "text-black/80 hover:text-rellia-teal",
                              "data-[state=active]:text-white",
                              "focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                            )}
                          >
                            {eventsFilter === f.value ? (
                              <motion.span
                                layoutId="events-filter-pill"
                                className="absolute inset-0 -z-10 rounded-full bg-rellia-teal shadow-sm"
                                transition={{ type: "spring", stiffness: 520, damping: 42 }}
                                aria-hidden
                              />
                            ) : null}
                            {f.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Desktop: segmented tabs */}
                  <div className="hidden md:block">
                    <Tabs value={eventsFilter} onValueChange={(v) => setEventsFilter(v as EventsFilter)}>
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
                              "relative z-10 rounded-full px-4 py-2.5",
                              "font-host-grotesk text-[12px] font-semibold uppercase tracking-[0.14em]",
                              "text-black/80 hover:text-rellia-teal",
                              "data-[state=active]:text-white",
                              "focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                            )}
                          >
                            {eventsFilter === f.value ? (
                              <motion.span
                                layoutId="events-filter-pill"
                                className="absolute inset-0 -z-10 rounded-full bg-rellia-teal shadow-sm"
                                transition={{ type: "spring", stiffness: 520, damping: 42 }}
                                aria-hidden
                              />
                            ) : null}
                            {f.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                <p className="font-urbanist text-sm text-black/55 md:text-right">
                  Showing {pageEvents.length} of {visibleEvents.length} events
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <motion.div
                layout
                transition={{ layout: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 will-change-transform"
              >
                <AnimatePresence mode="sync" initial={false}>
                  {pageEvents.map((event) => (
                    <motion.div
                      key={eventKey(event)}
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
                      <EventCard event={event} variant={event._variant} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </ScrollReveal>

            {totalPages > 1 ? (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className={[
                    "inline-flex h-12 w-12 items-center justify-center rounded-full border font-host-grotesk font-semibold transition-colors",
                    page <= 1
                      ? "cursor-not-allowed border-black/10 bg-white text-black/30"
                      : "border-black/10 bg-white text-rellia-teal hover:border-rellia-teal hover:text-rellia-teal",
                  ].join(" ")}
                  aria-label="Previous events page"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>

                <p className="font-urbanist text-base text-black/60" aria-label="Events page indicator">
                  Page {page} of {totalPages}
                </p>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className={[
                    "inline-flex h-12 w-12 items-center justify-center rounded-full border font-host-grotesk font-semibold transition-colors",
                    page >= totalPages
                      ? "cursor-not-allowed border-black/10 bg-white text-black/30"
                      : "border-black/10 bg-white text-rellia-teal hover:border-rellia-teal hover:text-rellia-teal",
                  ].join(" ")}
                  aria-label="Next events page"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              </div>
            ) : null}
          </div>
        </section>
        <RelliaCta
          title="Want to speak at a Rellia event?"
          body="If you have a practical playbook for founders building in health tech, we’d love to hear from you."
          primary={ctaActionFromHref("Contact page", "/contact")}
          secondary={ctaActionFromHref("Join the network", "/network")}
        />
      </main>

      <Footer />
    </div>
  )
}

