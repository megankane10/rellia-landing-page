import { useMemo, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Calendar, CalendarOff, ChevronLeft, ArrowLeft, History, MapPin, Ticket, Video, Check } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaAction from "@/components/RelliaAction"
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta"
import { useProgramsLandingPage } from "@/hooks/useCmsDocuments"
import { downloadProgramsEventIcsFile } from "@/lib/eventCalendar"
import { getLumaEmbedIframeSrc } from "@/lib/lumaEmbed"
import { cn } from "@/lib/utils"
import {
  buildPageUrl,
  clampMetaDescription,
  clampMetaTitle,
  resolveSocialOgImageUrl,
} from "@/config/seo"
import EventJsonLd from "@/components/seo/EventJsonLd"
import PageSocialHelmet from "@/components/seo/PageSocialHelmet"
import { DEFAULT_PROGRAMS_LANDING } from "@shared/cms/defaults"
import { findProgramsEventBySlug, getProgramsEventSlug } from "@shared/cms/eventSlug"
import {
  formatProgramsEventDetailDateExtended,
  formatProgramsEventDetailTimeEst,
  getProgramsEventAttendanceMode,
  getProgramsEventLocationDetailLines,
  getProgramsEventLocationLabel,
  getProgramsEventMapsSearchUrl,
  getProgramsEventSpeakerAvatarSrc,
  parseProgramsEventSpeaker,
  getProgramsEventDisplayDateTime,
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
import { buildMailtoHref } from "@/lib/mailto"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"
import { EventDetailPortableText } from "@/components/EventDetailPortableText"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import type { SanityPortableText } from "@shared/cms/types"
import { useEventBySlug } from "@/hooks/useCmsDocuments"
import { resolveEventCardImageSrc } from "@shared/cms/itemCardImage"
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv"
import { isCmsQueryLoading, shouldShowCmsEmptyState } from "@/lib/cmsQueryState"
import CmsPageLoadingShell from "@/components/cms/CmsPageLoadingShell"
import { isSanityConfigured } from "@/lib/sanity"

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

/** Same pills as `EventCard` (listing) — status + attendance */
const eventDetailHeroTagIconClassName = "h-3 w-3 shrink-0 opacity-90 sm:h-3.5 sm:w-3.5"

const eventDetailHeroAttendanceTagClassName =
  "inline-flex w-fit items-center gap-1 rounded-full border border-black/10 bg-white px-2.5 py-1 font-host-grotesk text-[9px] font-semibold uppercase tracking-[0.12em] text-black/60 sm:gap-1.5 sm:text-[10px] sm:tracking-[0.14em]"

const splitEventDetailBody = (raw: string | undefined): string[] => {
  if (!raw?.trim()) return []
  return raw
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function portableTextToPlainText(blocks: any): string {
  if (!blocks) return ""
  if (typeof blocks === "string") return blocks
  if (!Array.isArray(blocks)) return ""
  return blocks
    .map((block) => {
      if (!block || typeof block !== "object") return ""
      if (block.children && Array.isArray(block.children)) {
        return block.children.map((child: any) => (child && typeof child === "object" ? child.text || "" : "")).join("")
      }
      return ""
    })
    .filter(Boolean)
    .join(" ")
}

const getEventStatus = (event: any): "upcoming" | "past" => {
  const explicit = event?.status
  if (explicit === "upcoming" || explicit === "past") return explicit

  const candidate = event?.startsAt
  if (typeof candidate !== "string" || !candidate.trim()) return "upcoming"
  const t = Date.parse(candidate)
  if (!Number.isFinite(t)) return "upcoming"
  return t < Date.now() ? "past" : "upcoming"
}

export default function EventDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const resolvedSlug = slug?.trim() ? decodeURIComponent(slug) : ""
  const eventQuery = useEventBySlug(resolvedSlug)
  const { data: cmsEvent } = eventQuery
  const fallbackMatch =
    allowCmsSeedFallbacks() && resolvedSlug
      ? findProgramsEventBySlug(resolvedSlug, DEFAULT_PROGRAMS_LANDING)
      : null
  const match = (() => {
    if (!cmsEvent && !fallbackMatch) return null
    const cardImageSrc = resolveEventCardImageSrc(
      resolvedSlug,
      cmsEvent?.imageSrc ?? fallbackMatch?.imageSrc,
    )
    if (cmsEvent) {
      return {
        _variant: getEventStatus(cmsEvent) === "past" ? "past" : "upcoming",
        ...cmsEvent,
        imageSrc: cardImageSrc ?? cmsEvent.imageSrc,
      }
    }
    if (!fallbackMatch) return null
    return cardImageSrc ? { ...fallbackMatch, imageSrc: cardImageSrc } : fallbackMatch
  })()
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle")
  const [showForm, setShowForm] = useState(false)

  const eventMeta = useMemo(() => {
    if (!match) return null
    const { _variant: _variantIgnored, ...event } = match
    const computedDateTime = getProgramsEventDisplayDateTime(event)
    const shortDateTime = shortenProgramsEventDateTime(computedDateTime)
    const pageTitle = clampMetaTitle(`${event.title} - Events`)

    const descText = (() => {
      if (event.eventDescription) {
        if (typeof event.eventDescription === "string") return event.eventDescription
        if (Array.isArray(event.eventDescription)) {
          const text = portableTextToPlainText(event.eventDescription)
          if (text.trim()) return text.trim()
        }
      }
      if (event.detailBody) {
        if (typeof event.detailBody === "string") return event.detailBody
        if (Array.isArray(event.detailBody)) {
          const text = portableTextToPlainText(event.detailBody)
          if (text.trim()) return text.trim()
        }
      }
      return ""
    })()

    const eventDate = shortDateTime || computedDateTime
    const finalDesc = descText
      ? `${eventDate} · ${descText}`
      : eventDate

    const eventDescription = clampMetaDescription(finalDesc)
    const eventSlugPath = getProgramsEventSlug(event)
    const pagePath = `/events/${eventSlugPath}`
    return {
      pageTitle,
      eventDescription,
      shareTitle: pageTitle,
      ogImage: resolveSocialOgImageUrl(event.imageSrc, undefined, { square: true }),
      canonical: buildPageUrl(pagePath),
      pagePath,
    }
  }, [match, location.pathname])

  if (!resolvedSlug) {
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

  if (isSanityConfigured() && isCmsQueryLoading(eventQuery)) {
    return <CmsPageLoadingShell />
  }

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
  const computedDateTime = getProgramsEventDisplayDateTime(event)
  const shortDateTime = shortenProgramsEventDateTime(computedDateTime)
  const detailTimeEst = formatProgramsEventDetailTimeEst(computedDateTime)
  const detailDateLine = formatProgramsEventDetailDateExtended(computedDateTime)
  const locationLabel = getProgramsEventLocationLabel(event)
  const locationDetailLines = getProgramsEventLocationDetailLines(event)
  const mapsSearchUrl = getProgramsEventMapsSearchUrl(event)
  const attendanceMode = getProgramsEventAttendanceMode(event)
  const speakerAvatarSrc = getProgramsEventSpeakerAvatarSrc(event)
  const embedSrc = getLumaEmbedIframeSrc(event)
  const descriptionBody =
    Array.isArray(event.eventDescription) && event.eventDescription.length > 0
      ? event.eventDescription
      : Array.isArray(event.detailBody) && event.detailBody.length > 0
        ? event.detailBody
        : null
  const detailPortable: SanityPortableText | null = descriptionBody
  const detailPlainParagraphs =
    typeof event.detailBody === "string" ? splitEventDetailBody(event.detailBody) : []
  const hasDetailBodyContent =
    Boolean(detailPortable?.length) || detailPlainParagraphs.length > 0
  const showLumaIframe = !isPast && Boolean(embedSrc) && event.embedLumaOnDetailPage !== false
  const addToCalendarEnabled = event.addToCalendarEnabled === true
  const showHeroEventCta =
    !isPast &&
    (addToCalendarEnabled || Boolean(embedSrc) || Boolean(event.href?.trim()))
  const pageTitle = eventMeta!.pageTitle
  const eventDescription = eventMeta!.eventDescription
  const canonical = eventMeta!.canonical
  const shareTitle = eventMeta!.shareTitle
  const ogImage = eventMeta!.ogImage

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonical)
      setCopyState("copied")
      window.setTimeout(() => setCopyState("idle"), 2000)
    } catch {
      setCopyState("idle")
    }
  }

  const handleHeroCtaClick = async () => {
    if (!showHeroEventCta) return
    if (addToCalendarEnabled) {
      const ok = await downloadProgramsEventIcsFile(event, canonical)
      if (!ok) {
        window.alert(
          "Calendar file could not be created. Add calendar start (and optional end) as ISO 8601 times in the CMS.",
        )
      }
      return
    }
    setShowForm(true)
    setTimeout(() => {
      document.getElementById("event-content-area")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 50)
  }

  const registerHref = event.href?.trim() ?? ""

  const tagLabel = isPast ? "Past" : "Upcoming"

  const speakerName = (speakerParts.speaker || event.person?.trim() || "").trim()
  const speakerCompany = speakerParts.company.trim()
  const hasSpeakerMeta = Boolean(speakerName)
  const detailSectionHeading = event.detailBodyHeading?.trim() ?? ""

  return (
    <div className="flex min-h-screen flex-col bg-white font-host-grotesk overflow-x-hidden">
      <PageSocialHelmet
        title={pageTitle}
        description={eventDescription}
        canonical={canonical}
        ogImage={ogImage}
      />

      <EventJsonLd
        name={event.title}
        description={eventDescription}
        url={canonical}
        imageUrl={ogImage}
        locationName={locationLabel}
        startDate={
          typeof (event as { startsAt?: string }).startsAt === "string"
            ? (event as { startsAt: string }).startsAt
            : undefined
        }
        eventAttendanceMode={
          attendanceMode === "virtual" ? "OnlineEventAttendanceMode" : "OfflineEventAttendanceMode"
        }
      />

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
                  <div className="w-full max-w-[320px] shrink-0 self-start sm:max-w-[288px] md:max-w-[340px] lg:max-w-[380px]">
                    <div
                      className={cn(
                        "relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-white/90 shadow-sm ring-1 ring-black/5",
                        isPast && "opacity-95 saturate-[0.9]",
                      )}
                    >
                      <img
                        src={event.imageSrc}
                        alt={event.title}
                        className={cn(
                          "h-full w-full object-cover object-center sm:object-contain sm:object-left sm:object-top",
                          isPast && "grayscale-[0.2]",
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex min-h-0 min-w-0 flex-1 flex-col items-start text-left">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex w-fit max-w-full shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-host-grotesk text-[9px] font-semibold uppercase tracking-[0.12em] ring-1 ring-black/5 sm:gap-1.5 sm:text-[10px] sm:tracking-[0.14em]",
                            isPast ? "bg-black/[0.06] text-black/65" : "bg-rellia-mint text-rellia-teal",
                          )}
                        >
                          {isPast ? (
                            <History className="h-3 w-3 opacity-80 text-black/50" aria-hidden strokeWidth={2.25} />
                          ) : (
                            <Calendar className="h-3 w-3 opacity-80 text-rellia-teal" aria-hidden strokeWidth={2.25} />
                          )}
                          {tagLabel}
                        </span>
                      </div>
                      <h1 className="w-full min-w-0 font-host-grotesk text-3xl font-medium leading-tight tracking-tight text-rellia-teal md:text-4xl lg:text-5xl">
                        {event.title}
                      </h1>

                      <div className="mt-6 w-full max-w-3xl sm:mt-7 md:mt-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-6 lg:gap-10">
                        {hasSpeakerMeta ? (
                          <div className="min-w-0 md:min-w-[min(100%,17.5rem)] lg:min-w-[21rem]">
                            <p className={eventDetailMetaLabelClassName}>Host</p>
                            <div className="mt-2.5 flex items-center gap-3 sm:gap-3.5">
                              <img
                                src={speakerAvatarSrc}
                                alt=""
                                className={cn(eventDetailSpeakerAvatarClassName, isPast && "opacity-90 saturate-[0.9]")}
                                aria-hidden
                              />
                              <div className="flex min-w-0 flex-1 flex-col gap-1">
                                <p className={eventDetailMetaPrimaryValueClassName}>{speakerName}</p>
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
                            <div className="mt-2.5 space-y-1">
                              {mapsSearchUrl ? (
                                <>
                                  <a
                                    href={mapsSearchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                      eventDetailMetaPrimaryValueClassName,
                                      "inline-block max-w-full rounded-sm underline decoration-rellia-teal/55 underline-offset-[0.18em] transition-colors hover:decoration-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
                                    )}
                                    aria-label={`Open location in Google Maps: ${locationLabel}`}
                                  >
                                    {locationDetailLines.line1}
                                  </a>
                                  {locationDetailLines.line2 ? (
                                    <p className={eventDetailMetaSecondaryValueClassName}>
                                      {locationDetailLines.line2}
                                    </p>
                                  ) : null}
                                </>
                              ) : (
                                <>
                                  <p className={eventDetailMetaPrimaryValueClassName}>{locationDetailLines.line1}</p>
                                  {locationDetailLines.line2 ? (
                                    <p className={eventDetailMetaSecondaryValueClassName}>{locationDetailLines.line2}</p>
                                  ) : null}
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="mt-2.5 space-y-1">
                              <p className={eventDetailMetaPrimaryValueClassName}>Zoom</p>
                              <p className={eventDetailMetaSecondaryValueClassName}>Virtual</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {showHeroEventCta ? (
                      <div className="mt-9 flex w-full justify-start sm:mt-10 md:mt-12">
                        <RelliaAction
                          type="button"
                          variant="relliaCtaPrimary"
                          size="compact"
                          className="inline-flex w-full cursor-pointer px-6 py-3 text-sm sm:w-auto sm:px-8 sm:text-[15px]"
                          onClick={handleHeroCtaClick}
                          aria-haspopup={!addToCalendarEnabled ? "dialog" : undefined}
                          aria-label={addToCalendarEnabled ? "Add to Calendar" : "Register now"}
                        >
                          {addToCalendarEnabled ? "Add to Calendar" : "Register now"}
                        </RelliaAction>
                      </div>
                    ) : null}
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
                      href={buildMailtoHref(DEFAULT_GLOBAL_SETTINGS.supportEmail, {
                        subject: shareTitle,
                        body: `${shareTitle}\n\n${canonical}`,
                      })}
                      className={shareToolbarButtonClassName}
                      aria-label="Share by email"
                    >
                      <ShareIconMail />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={cn(
                        shareToolbarButtonClassName,
                        copyState === "copied" && "bg-rellia-mint text-rellia-teal border-rellia-teal shadow-md"
                      )}
                      aria-label={copyState === "copied" ? "Link copied" : "Copy event link"}
                    >
                      {copyState === "copied" ? (
                        <Check className="h-5 w-5 shrink-0 animate-scale-in" />
                      ) : (
                        <ShareIconCopy />
                      )}
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

        <section id="event-content-area" className="border-t border-black/10 bg-white min-h-[500px]">
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div key="content-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                {isPast ? (
                  <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-8 px-6 py-10 md:px-10 md:py-14 md:gap-10">
                    <EventDetailBackToEventsLink variant="top" />
              {hasDetailBodyContent ? (
                <ScrollReveal>
                  <div className="mx-auto w-full max-w-[900px]">
                    {detailSectionHeading ? (
                      <h2 className="mb-6 font-host-grotesk text-2xl font-semibold tracking-tight text-black md:mb-8 md:text-[32px]">
                        {detailSectionHeading}
                      </h2>
                    ) : null}
                    {detailPortable && detailPortable.length > 0 ? (
                      <EventDetailPortableText value={detailPortable} />
                    ) : (
                      <>
                        {detailPlainParagraphs.map((paragraph, index) => (
                          <p
                            key={`past-detail-${index}`}
                            className={cn(
                              "font-urbanist text-base leading-relaxed text-black/85 md:text-[17px] md:leading-relaxed",
                              index > 0 ? "mt-5 md:mt-6" : "",
                            )}
                          >
                            {paragraph}
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                </ScrollReveal>
              ) : null}
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
                    <EventDetailBackToEventsLink variant="footer" />
                  </div>
                ) : (
                  <div className="mx-auto w-full max-w-[1300px] px-6 py-10 md:px-10 md:py-14">
                    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8 md:gap-10">
                      <EventDetailBackToEventsLink variant="top" />
                {hasDetailBodyContent ? (
                  <ScrollReveal>
                    <div className="w-full">
                      {detailSectionHeading ? (
                        <h2 className="mb-6 font-host-grotesk text-2xl font-semibold tracking-tight text-black md:mb-8 md:text-[32px]">
                          {detailSectionHeading}
                        </h2>
                      ) : null}
                      {detailPortable && detailPortable.length > 0 ? (
                        <EventDetailPortableText value={detailPortable} />
                      ) : (
                        <>
                          {detailPlainParagraphs.map((paragraph, index) => (
                            <p
                              key={`detail-${index}`}
                              className={cn(
                                "font-urbanist text-base leading-relaxed text-black/85 md:text-[17px] md:leading-relaxed",
                                index > 0 ? "mt-5 md:mt-6" : "",
                              )}
                            >
                              {paragraph}
                            </p>
                          ))}
                        </>
                      )}
                    </div>
                  </ScrollReveal>
                ) : null}
                {!hasDetailBodyContent ? (
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
                ) : null}
                <EventDetailBackToEventsLink variant="footer" />
              </div>
            </div>
          )}
              </motion.div>
            ) : (
              <motion.div key="form-view" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="w-full">
                <div className="max-w-[1100px] mx-auto px-6 md:px-10 pt-10 pb-4">
                  <button type="button" onClick={() => setShowForm(false)} className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4">
                    <ArrowLeft className="h-4 w-4" aria-hidden />Back to details
                  </button>
                </div>
                <div className="w-full flex-1 border-t border-black/5 bg-rellia-cream/20">
                  {embedSrc ? (
                    <div className="w-full">
                      <iframe
                        src={embedSrc}
                        title={`${event.title} — Registration`}
                        className="w-full border-0"
                        style={{ height: "700px", minHeight: "700px" }}
                        allow="payment; fullscreen"
                        scrolling="no"
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-[500px] flex-col items-center justify-center gap-6 py-20 px-6 text-center">
                      <Ticket className="h-16 w-16 text-rellia-teal md:h-20 md:w-20" strokeWidth={1.15} aria-hidden />
                      <div className="mx-auto max-w-[480px] space-y-5">
                        <p className="font-host-grotesk text-3xl font-bold leading-tight text-black md:text-4xl md:leading-tight">
                          Missing Luma Event ID
                        </p>
                        <p className="font-urbanist text-base text-black/60 md:text-lg">
                          Please add the Luma Event ID (e.g., evt-...) in Sanity to enable the inline registration form.
                        </p>
                      </div>
                      <div className="flex flex-col gap-4 sm:flex-row">
                        {registerHref ? (
                          <RelliaAction asChild variant="mintTealFill" size="compact" className="cursor-pointer px-8 py-3 text-sm">
                            <a href={registerHref} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                              Open registration link
                            </a>
                          </RelliaAction>
                        ) : null}
                        <RelliaAction
                          type="button"
                          variant="outlineOnWhite"
                          size="compact"
                          className="cursor-pointer px-8 py-3 text-sm"
                          onClick={() => setShowForm(false)}
                        >
                          Back to details
                        </RelliaAction>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <Footer />
    </div>
  )
}
