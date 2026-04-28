import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta"
import { EventCard, eventKey } from "@/components/cards"
import { useProgramsLandingPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_PROGRAMS_LANDING } from "@shared/cms/defaults"
import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

type EventsFilter = "all" | "upcoming" | "past"

export default function Events() {
  const { data } = useProgramsLandingPage()
  const pl = data ?? DEFAULT_PROGRAMS_LANDING
  const [eventsFilter, setEventsFilter] = useState<EventsFilter>("all")

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

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main id="main-content">
        <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 bg-rellia-teal overflow-hidden">
          {/* Less busy header background (no grid, no hologram) */}
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-rellia-teal/85 via-rellia-teal/55 to-rellia-teal/30" />
            <div className="absolute -left-28 -top-32 h-[520px] w-[520px] rounded-full bg-rellia-mint/25 blur-3xl" />
            <div className="absolute -right-40 top-1/3 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute left-1/3 bottom-[-220px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-rellia-mint/15 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.22] mix-blend-soft-light [background-image:radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(255,255,255,0.12),transparent_52%),radial-gradient(circle_at_40%_95%,rgba(255,255,255,0.14),transparent_55%)]" />
          </div>

          <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-5">
                Connect &amp; <span className="text-rellia-mint">Learn</span>
              </h1>
              <p className="text-white/80 text-lg md:text-2xl max-w-3xl font-urbanist leading-relaxed">
                Join live sessions with operators, clinicians, and health tech leaders. Register on Luma to save your
                seat.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-rellia-cream/50">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal className="mb-10 flex flex-col items-center text-center">
              <h2 className="font-host-grotesk font-semibold text-black text-3xl md:text-[40px] leading-tight tracking-tight">
                Events
              </h2>
              <p className="font-urbanist text-black/60 text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
                Switch between upcoming and past events, or view everything in one place.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mb-10 flex flex-col items-center gap-4">
                <div className="inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setEventsFilter("all")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setEventsFilter("all")
                      }
                    }}
                    aria-label="Show all events"
                    className={[
                      "min-h-11 rounded-full px-4 text-sm font-semibold transition-colors",
                      eventsFilter === "all"
                        ? "bg-rellia-teal text-white"
                        : "text-black/70 hover:text-black",
                    ].join(" ")}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventsFilter("upcoming")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setEventsFilter("upcoming")
                      }
                    }}
                    aria-label="Show upcoming events"
                    className={[
                      "min-h-11 rounded-full px-4 text-sm font-semibold transition-colors",
                      eventsFilter === "upcoming"
                        ? "bg-rellia-teal text-white"
                        : "text-black/70 hover:text-black",
                    ].join(" ")}
                  >
                    Upcoming
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventsFilter("past")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setEventsFilter("past")
                      }
                    }}
                    aria-label="Show past events"
                    className={[
                      "min-h-11 rounded-full px-4 text-sm font-semibold transition-colors",
                      eventsFilter === "past"
                        ? "bg-rellia-teal text-white"
                        : "text-black/70 hover:text-black",
                    ].join(" ")}
                  >
                    Past
                  </button>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout" initial={false}>
                  {visibleEvents.map((event) => (
                    <motion.div
                      key={eventKey(event)}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <EventCard event={event} variant={event._variant} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </ScrollReveal>
          </div>
        </section>
        <RelliaCta
          title="Want to speak at a Rellia event?"
          body="If you have a practical playbook for founders building in health tech, we’d love to hear from you. Share your topic and availability — we’ll follow up quickly."
          primary={ctaActionFromHref("Contact page", "/contact")}
          secondary={ctaActionFromHref("Join the network", "/network")}
        />
      </main>

      <Footer />
    </div>
  )
}

