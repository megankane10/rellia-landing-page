import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta"
import { HorizontalCard } from "@/components/cards/HorizontalCard"
import PageHeader from "@/components/PageHeader"
import { useEvents } from "@/hooks/useCmsDocuments"
import { useEventsLandingPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_PROGRAMS_LANDING } from "@shared/cms/defaults"
import { getProgramsEventSlug } from "@shared/cms/eventSlug"
import { resolveEventCardImageSrc } from "@shared/cms/itemCardImage"
import { useMemo, useState, useEffect } from "react"
import { CalendarDays, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import FilteredListEmptyState from "@/components/FilteredListEmptyState"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { HeroHeadlinePortable } from "@/components/HeroHeadlinePortable"
import { DEFAULT_EVENTS_LANDING_HERO_PORTABLE } from "@shared/cms/inlineHeroHeadline"
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv"
import { normalizeCmsEventForCard } from "@/lib/cmsEventList"
import { isCmsListAwaitingData, isCmsQueryLoading, shouldShowCmsEmptyState } from "@/lib/cmsQueryState"
import { DirectoryGridSkeleton } from "@/components/cms/CmsPageLoadingShell"
import { isSanityConfigured } from "@/lib/sanity"
import { getEventStartTimestamp, getEventTemporalStatus } from "@shared/cms/eventTemporalStatus"

type EventFilter = "all" | "upcoming" | "past"
const PAGE_SIZE = 12

const getEventStatus = (event: Parameters<typeof getEventTemporalStatus>[0]): "upcoming" | "past" =>
  getEventTemporalStatus(event)

export default function Events() {
  const eventsQuery = useEvents()
  const { data } = eventsQuery
  const { data: landing } = useEventsLandingPage()
  const eventsLoading =
    isSanityConfigured() &&
    (isCmsQueryLoading(eventsQuery) || isCmsListAwaitingData(eventsQuery))
  useApplyCmsSeo(landing?.seo)

  const allEvents = useMemo(() => {
    const cmsEvents = Array.isArray(data) ? data : []
    const raw =
      cmsEvents.length > 0
        ? cmsEvents
        : allowCmsSeedFallbacks()
          ? [...DEFAULT_PROGRAMS_LANDING.upcomingEvents, ...DEFAULT_PROGRAMS_LANDING.pastEvents]
          : []
    return raw.map((event: { slug?: string; imageSrc?: string; title?: string; dateTime?: string }) => {
      const slug = (event.slug ?? getProgramsEventSlug(event as never)).trim()
      const cardImageSrc = resolveEventCardImageSrc(slug, event.imageSrc)
      const withImage = cardImageSrc ? { ...event, imageSrc: cardImageSrc } : event
      return normalizeCmsEventForCard(withImage as never)
    })
  }, [data])
  const [eventFilter, setEventFilter] = useState<EventFilter>("all")
  const [page, setPage] = useState(1)

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const upcoming = allEvents
      .filter((e: any) => getEventStatus(e) === "upcoming")
      .sort((a: any, b: any) => {
        const at = getEventStartTimestamp(a)
        const bt = getEventStartTimestamp(b)
        if (!Number.isFinite(at) && !Number.isFinite(bt)) return 0
        if (!Number.isFinite(at)) return 1
        if (!Number.isFinite(bt)) return -1
        // Latest first (newest dates on top).
        return bt - at
      })
    const past = allEvents
      .filter((e: any) => getEventStatus(e) === "past")
      .sort((a: any, b: any) => {
        const at = getEventStartTimestamp(a)
        const bt = getEventStartTimestamp(b)
        if (!Number.isFinite(at) && !Number.isFinite(bt)) return 0
        if (!Number.isFinite(at)) return 1
        if (!Number.isFinite(bt)) return -1
        return bt - at
      })
    return { upcomingEvents: upcoming, pastEvents: past }
  }, [allEvents])

  const visibleEvents = useMemo(() => {
    if (eventFilter === "all") {
      // Strict newest -> oldest across both upcoming + past.
      return [...upcomingEvents, ...pastEvents].sort((a: any, b: any) => {
        const at = getEventStartTimestamp(a)
        const bt = getEventStartTimestamp(b)
        if (!Number.isFinite(at) && !Number.isFinite(bt)) return 0
        if (!Number.isFinite(at)) return 1
        if (!Number.isFinite(bt)) return -1
        return bt - at
      })
    }
    return eventFilter === "upcoming" ? upcomingEvents : pastEvents
  }, [eventFilter, upcomingEvents, pastEvents])

  useEffect(() => {
    setPage(1)
  }, [eventFilter])

  useEffect(() => {
    const el = document.getElementById("view-events")
    if (el && page > 1) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }, [page])

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
          titleClassName="text-4xl md:text-5xl lg:text-6xl"
          title={
            <HeroHeadlinePortable
              value={landing?.heroTitlePortable ?? DEFAULT_EVENTS_LANDING_HERO_PORTABLE}
            />
          }
          subtitle={
            landing?.heroSubtitle ||
            "Join live sessions with operators, clinicians, and health tech leaders."
          }
        />

        <section id="view-events" className="pt-8 pb-16 md:pt-12 md:pb-20 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <div className="mb-4">
                <h2 className="font-host-grotesk text-2xl md:text-[32px] font-semibold leading-tight tracking-tight text-black">
                  Browse Events
                </h2>
              </div>
              <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="w-full md:w-auto">
                  <Tabs value={eventFilter} onValueChange={(v) => setEventFilter(v as EventFilter)}>
                    <TabsList
                      className={cn(
                        "relative h-auto w-full md:w-fit gap-1 rounded-full bg-white p-1.5",
                        "border border-black/10 shadow-[0_12px_32px_-22px_rgba(0,0,0,0.22)]",
                      )}
                    >
                      {filters.map((f) => (
                        <TabsTrigger
                          key={f.value}
                          value={f.value}
                          className={cn(
                            "relative flex-1 md:flex-initial rounded-full px-5 py-2.5",
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

              {eventsLoading ? (
                <DirectoryGridSkeleton />
              ) : shouldShowCmsEmptyState(eventsQuery) && visibleEvents.length === 0 ? (
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
                    className="flex flex-col gap-0 will-change-transform"
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
          title={landing?.ctaTitle || "Want to **speak** at a Rellia event?"}
          body={
            landing?.ctaBody ||
            "If you have a practical playbook for founders building in health tech, we’d love to hear from you."
          }
          primary={ctaActionFromHref(landing?.ctaPrimaryLabel || "Contact", landing?.ctaPrimaryHref || "/contact")}
          secondary={
            landing?.ctaSecondaryLabel && landing?.ctaSecondaryHref
              ? ctaActionFromHref(landing.ctaSecondaryLabel, landing.ctaSecondaryHref)
              : ctaActionFromHref("Apply to join", "/apply")
          }
        />
      </main>

      <Footer />
    </div>
  )
}

