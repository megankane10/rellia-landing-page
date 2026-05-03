import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { Link, useParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { CalendarOff, ChevronLeft, MapPin } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta"
import { useProgramsLandingPage } from "@/hooks/useCmsDocuments"
import { getLumaEmbedIframeSrc } from "@/lib/lumaEmbed"
import { cn } from "@/lib/utils"
import { getSiteUrl } from "@/config/seo"
import { DEFAULT_PROGRAMS_LANDING } from "@shared/cms/defaults"
import { findProgramsEventBySlug, getProgramsEventSlug } from "@shared/cms/eventSlug"
import {
  formatProgramsEventDetailDateExtended,
  formatProgramsEventDetailTimeEst,
  getProgramsEventAttendanceMode,
  getProgramsEventLocationLabel,
  getProgramsEventSpeakerAvatarSrc,
  parseProgramsEventSpeaker,
  shortenProgramsEventDateTime,
} from "@shared/cms/programsEventDisplay"
import {
  ShareIconCopy,
  ShareIconFacebook,
  ShareIconLinkedIn,
  ShareIconMail,
  ShareIconX,
  shareToolbarButtonClassName,
} from "@/components/share/sharePageIcons"

const eventDetailBackToEventsLinkClassName =
  "inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:underline hover:underline-offset-4"

const EventDetailBackToEventsLink = ({ variant = "footer" }: { variant?: "top" | "footer" }) => {
  const link = (
    <Link to="/events" className={eventDetailBackToEventsLinkClassName} aria-label="Back to all events">
      <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
      All events
    </Link>
  )
  if (variant === "top") {
    return <div className="shrink-0">{link}</div>
  }
  return <div className="mt-10 border-t border-black/10 pt-8 md:mt-14">{link}</div>
}

const eventDetailMetaLabelClassName =
  "font-host-grotesk text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45 sm:text-[11px]"

/** Calendar date line, speaker name, location — same font, size, weight */
const eventDetailMetaPrimaryValueClassName =
  "font-urbanist text-[15px] font-medium leading-snug text-black md:text-base"

/** Time line & speaker company — same size and weight */
const eventDetailMetaSecondaryValueClassName =
  "font-urbanist text-[15px] font-normal leading-snug text-black/70 md:text-base"

/** ~height of two meta text lines (primary + secondary + gap) beside name/company */
const eventDetailSpeakerAvatarClassName =
  "h-11 w-11 shrink-0 rounded-full border border-black/10 object-cover object-center ring-1 ring-black/[0.04] sm:h-12 sm:w-12"

const toAbsoluteImageUrl = (src: string, base: string): string => {
  if (/^https?:\/\//i.test(src)) return src
  if (!src.startsWith("/")) return `${base}/${src}`
  return `${base}${src}`
}

export default function EventDetail() {
  const { slug } = useParams()
  const { data } = useProgramsLandingPage()
  const pl = data ?? DEFAULT_PROGRAMS_LANDING
  const resolvedSlug = slug?.trim() ? decodeURIComponent(slug) : ""
  const match = resolvedSlug ? findProgramsEventBySlug(resolvedSlug, pl) : null
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle")

  const base = getSiteUrl()

  if (!match) {
    return (
      <div className="flex min-h-screen flex-col bg-white font-host-grotesk overflow-x-hidden">
        <Navbar />
        <main id="main-content" className="flex flex-1 flex-col">
          <RelliaCta
            title="**Event not found**"
            body="This event may have moved. Browse all events to see what is coming up."
            primary={ctaActionFromHref("All events", "/events")}
            secondary={ctaActionFromHref("Back to home", "/")}
            className="flex-1"
          />
        </main>
        <Footer />
      </div>
    )
  }

  const { _variant, ...event } = match
  const isPast = _variant === "past"
  const speakerParts = parseProgramsEventSpeaker(event.person)
  const shortDateTime = shortenProgramsEventDateTime(event.dateTime ?? "")
  const detailTimeEst = formatProgramsEventDetailTimeEst(event.dateTime ?? "")
  const detailDateLine = formatProgramsEventDetailDateExtended(event.dateTime ?? "")
  const locationLabel = getProgramsEventLocationLabel(event)
  const attendanceMode = getProgramsEventAttendanceMode(event)
  const speakerAvatarSrc = getProgramsEventSpeakerAvatarSrc(event)
  const embedSrc = getLumaEmbedIframeSrc(event)
  const pageTitle = `${event.title} — Rellia Health`
  const eventSlugPath = getProgramsEventSlug(event)
  const canonical = `${base}/events/${eventSlugPath}`
  const shareTitle = pageTitle
  const ogImage = toAbsoluteImageUrl(event.imageSrc, base)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonical)
      setCopyState("copied")
      window.setTimeout(() => setCopyState("idle"), 2000)
    } catch {
      setCopyState("idle")
    }
  }

  const tagLabel = isPast ? "Past event" : "Upcoming"

  const speakerName = (speakerParts.speaker || event.person?.trim() || "").trim()
  const speakerCompany = speakerParts.company.trim()
  const hasSpeakerMeta = Boolean(speakerName)

  return (
    <div className="flex min-h-screen flex-col bg-white font-host-grotesk overflow-x-hidden">
      <Helmet htmlAttributes={{ lang: "en" }}>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`${event.title}. ${shortDateTime || event.dateTime}. ${locationLabel}.`}
        />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Rellia Health" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content={`${event.title}. ${shortDateTime || event.dateTime}. ${locationLabel}.`}
        />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta
          name="twitter:description"
          content={`${event.title}. ${shortDateTime || event.dateTime}. ${locationLabel}.`}
        />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <Navbar />

      <main id="main-content" className="flex flex-1 flex-col">
        {/* Match StoryPost hero rhythm: pt-24 pb-12 md:pt-32 md:pb-16 */}
        <section className="relative overflow-hidden bg-rellia-cream pb-12 pt-24 md:pb-16 md:pt-32">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-28 -top-32 h-[520px] w-[520px] rounded-full bg-rellia-mint/20 blur-3xl" />
            <div className="absolute -right-40 top-1/3 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-rellia-teal/10 blur-3xl" />
            <div className="absolute bottom-[-220px] left-1/3 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-rellia-mint/15 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.18] mix-blend-multiply [background-image:radial-gradient(circle_at_20%_10%,rgba(13,53,64,0.10),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(13,53,64,0.08),transparent_52%),radial-gradient(circle_at_40%_95%,rgba(13,53,64,0.09),transparent_55%)]" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1300px] px-6 md:px-10">
            <div className="mx-auto w-full max-w-[1100px]">
              <ScrollReveal>
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
                  <div
                    className={cn(
                      "relative aspect-square w-full max-w-[240px] shrink-0 self-start overflow-hidden rounded-2xl bg-white/90 shadow-sm ring-1 ring-black/5 sm:max-w-[280px]",
                      isPast && "opacity-95 saturate-[0.9]",
                    )}
                  >
                    <img
                      src={event.imageSrc}
                      alt={event.title}
                      className={cn(
                        "h-full w-full object-contain object-left object-top",
                        isPast && "grayscale-[0.2]",
                      )}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
                        isPast
                          ? "bg-white/85 ring-1 ring-black/10"
                          : "bg-rellia-mint",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          isPast ? "bg-black/40" : "bg-rellia-teal",
                        )}
                        aria-hidden
                      />
                      <span
                        className={cn(
                          "font-host-grotesk text-[11px] font-semibold uppercase tracking-[0.14em]",
                          isPast ? "text-black/60" : "text-rellia-teal",
                        )}
                      >
                        {tagLabel}
                      </span>
                    </div>

                    <h1 className="mt-5 font-host-grotesk text-3xl font-medium leading-tight tracking-tight text-rellia-teal sm:mt-6 md:text-4xl lg:text-5xl">
                      {event.title}
                    </h1>

                    <div className="mt-6 max-w-3xl sm:mt-7 md:mt-8">
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
                        {hasSpeakerMeta ? (
                          <div className="min-w-0">
                            <p className={eventDetailMetaLabelClassName}>Speaker</p>
                            <div className="mt-2.5 flex items-center gap-3 sm:gap-3.5">
                              <img
                                src={speakerAvatarSrc}
                                alt=""
                                className={cn(eventDetailSpeakerAvatarClassName, isPast && "opacity-90 saturate-[0.9]")}
                                aria-hidden
                              />
                              <div className="min-w-0 flex flex-col gap-1">
                                <p className={cn(eventDetailMetaPrimaryValueClassName, "truncate")}>{speakerName}</p>
                                {speakerCompany ? (
                                  <p className={eventDetailMetaSecondaryValueClassName}>{speakerCompany}</p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ) : null}
                        {detailTimeEst || detailDateLine ? (
                          <div className="min-w-0">
                            <p className={eventDetailMetaLabelClassName}>Date & time</p>
                            <div className="mt-2.5 space-y-1">
                              {detailDateLine ? (
                                <p className={eventDetailMetaPrimaryValueClassName}>{detailDateLine}</p>
                              ) : null}
                              {detailTimeEst ? (
                                <p
                                  className={
                                    detailDateLine
                                      ? eventDetailMetaSecondaryValueClassName
                                      : eventDetailMetaPrimaryValueClassName
                                  }
                                >
                                  {detailTimeEst}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                        <div className="min-w-0">
                          <p className={eventDetailMetaLabelClassName}>Location</p>
                          {attendanceMode === "inPerson" ? (
                            <p className={cn("mt-2.5 flex items-start gap-2", eventDetailMetaPrimaryValueClassName)}>
                              <MapPin
                                className="mt-0.5 h-4 w-4 shrink-0 text-rellia-teal"
                                strokeWidth={2}
                                aria-hidden
                              />
                              <span className="min-w-0">{locationLabel}</span>
                            </p>
                          ) : (
                            <p className={cn("mt-2.5", eventDetailMetaPrimaryValueClassName)}>{locationLabel}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-8 md:h-10" aria-hidden />

                <div className="mt-8 flex w-full flex-col items-stretch gap-4">
                  <p className="font-host-grotesk text-[12px] font-semibold uppercase tracking-[0.14em] text-black/55">
                    Share this event
                  </p>
                  <div className="h-px w-full bg-black/10" aria-hidden />

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(shareTitle)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={shareToolbarButtonClassName}
                      aria-label="Share on X"
                    >
                      <ShareIconX />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={shareToolbarButtonClassName}
                      aria-label="Share on LinkedIn"
                    >
                      <ShareIconLinkedIn />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={shareToolbarButtonClassName}
                      aria-label="Share on Facebook"
                    >
                      <ShareIconFacebook />
                    </a>
                    <a
                      href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareTitle}\n${canonical}`)}`}
                      className={shareToolbarButtonClassName}
                      aria-label="Share via email"
                    >
                      <ShareIconMail />
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={shareToolbarButtonClassName}
                      aria-label={copyState === "copied" ? "Link copied" : "Copy event link"}
                    >
                      <ShareIconCopy />
                    </button>

                    <AnimatePresence mode="wait" initial={false}>
                      {copyState === "copied" ? (
                        <motion.span
                          key="copied-feedback"
                          className="font-host-grotesk text-sm font-semibold text-rellia-teal"
                          initial={{ opacity: 0, y: 4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.98 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        >
                          Copied!
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-t border-black/10 bg-white">
          {isPast ? (
            <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-8 px-6 py-10 md:px-10 md:py-14 md:gap-10">
              <EventDetailBackToEventsLink variant="top" />
              <ScrollReveal>
                <div className="py-6 text-center md:py-10">
                  <div className="mb-6 flex justify-center md:mb-8" aria-hidden>
                    <CalendarOff
                      className="h-16 w-16 text-rellia-teal md:h-24 md:w-24"
                      strokeWidth={1.15}
                    />
                  </div>
                  <p className="font-host-grotesk text-3xl font-bold leading-tight text-black md:text-4xl md:leading-tight">
                    This event has ended
                  </p>
                  <p className="mx-auto mt-5 max-w-[480px] font-urbanist text-base text-black/60 md:text-lg">
                    Looking for what is next? Visit our events page for upcoming sessions and registration.
                  </p>
                  <div className="mt-8 flex justify-center">
                    <RelliaAction asChild variant="mintTealFill" size="compact" className="cursor-pointer px-8 py-3 text-sm">
                      <Link to="/events" className="cursor-pointer">
                        Back to all events
                      </Link>
                    </RelliaAction>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          ) : embedSrc ? (
            <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-8 px-6 pb-10 pt-8 md:gap-10 md:px-10 md:pb-14 md:pt-10">
              <EventDetailBackToEventsLink variant="top" />
              <ScrollReveal className="w-full shrink-0">
                <div className="overflow-hidden rounded-2xl">
                  <iframe
                    title={`${event.title} — Luma`}
                    src={embedSrc}
                    className="block min-h-[52rem] h-[max(60rem,82dvh)] w-full border-0 md:min-h-[56rem] md:h-[max(64rem,85dvh)]"
                    allow="payment; fullscreen"
                    loading="lazy"
                  />
                </div>
              </ScrollReveal>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-8 px-6 py-10 md:px-10 md:py-14 md:gap-10">
              <EventDetailBackToEventsLink variant="top" />
              <ScrollReveal>
                <div className="py-10 text-center">
                  <p className="font-urbanist text-black/65">
                    Registration details are not available here yet. Check back soon or contact us for more information.
                  </p>
                  {event.href ? (
                    <div className="mt-6 flex justify-center">
                      <RelliaAction asChild variant="mintTealFill" size="compact" className="cursor-pointer px-6">
                        <a href={event.href} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                          Open on Luma
                        </a>
                      </RelliaAction>
                    </div>
                  ) : null}
                </div>
              </ScrollReveal>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
