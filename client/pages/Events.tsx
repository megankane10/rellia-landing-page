import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta"
import { HorizontalCard, eventKey } from "@/components/cards"
import PageHeader from "@/components/PageHeader"
import { useProgramsLandingPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_PROGRAMS_LANDING } from "@shared/cms/defaults"
import { useMemo } from "react"
import { CalendarDays } from "lucide-react"

export default function Events() {
  const { data } = useProgramsLandingPage()
  const pl = data ?? DEFAULT_PROGRAMS_LANDING

  const { upcomingEvents, pastEvents } = useMemo(() => {
    // Sort upcoming events (ascending date)
    const upcoming = [...pl.upcomingEvents].sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    )
    // Sort past events (descending date)
    const past = [...pl.pastEvents].sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    )
    return { upcomingEvents: upcoming, pastEvents: past }
  }, [pl.upcomingEvents, pl.pastEvents])

  const recentPastEvents = pastEvents.slice(0, 3)
  const remainingPastEvents = pastEvents.slice(3)

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
              <div className="mb-10">
                <h2 className="font-host-grotesk text-2xl md:text-3xl font-semibold leading-tight tracking-tight text-black mb-6">
                  Upcoming Events
                </h2>
                {upcomingEvents.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {upcomingEvents.map((event) => (
                      <HorizontalCard key={eventKey(event)} type="event" item={event} variant="upcoming" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 border border-black/10 rounded-2xl bg-white text-center">
                    <CalendarDays className="h-10 w-10 text-black/20 mb-4" />
                    <p className="font-host-grotesk text-lg font-medium text-black">No upcoming events right now</p>
                    <p className="font-urbanist text-black/50 mt-1">Check back later for new dates.</p>
                  </div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-16">
                <h2 className="font-host-grotesk text-2xl md:text-3xl font-semibold leading-tight tracking-tight text-black mb-6">
                  Past Events
                </h2>
                {pastEvents.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {recentPastEvents.map((event) => (
                      <HorizontalCard key={eventKey(event)} type="event" item={event} variant="past" />
                    ))}
                    
                    {remainingPastEvents.length > 0 && (
                      <details className="group [&_summary::-webkit-details-marker]:hidden">
                        <summary className="cursor-pointer list-none flex items-center justify-center w-full py-4 mt-2 border border-black/10 rounded-full font-host-grotesk font-semibold text-rellia-teal hover:bg-black/[0.02] transition-colors">
                          <span className="group-open:hidden">View All Past Events</span>
                          <span className="hidden group-open:block">Show Less</span>
                        </summary>
                        <div className="flex flex-col gap-6 mt-6 pb-2 animate-in slide-in-from-top-2 fade-in duration-300 ease-out">
                          {remainingPastEvents.map((event) => (
                            <HorizontalCard key={eventKey(event)} type="event" item={event} variant="past" />
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 border border-black/10 rounded-2xl bg-white text-center">
                    <CalendarDays className="h-10 w-10 text-black/20 mb-4" />
                    <p className="font-host-grotesk text-lg font-medium text-black">No past events</p>
                  </div>
                )}
              </div>
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

