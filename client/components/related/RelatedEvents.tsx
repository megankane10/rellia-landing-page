import { useEffect, useMemo } from "react"
import ScrollReveal from "@/components/ScrollReveal"
import RelatedContentSection from "@/components/related/RelatedContentSection"
import RelatedEventCard from "@/components/related/RelatedEventCard"
import { RELATED_COMPACT_EVENTS_GRID_CLASS } from "@/components/related/relatedCompactGrid"
import { useEvents, useEventsLandingPage } from "@/hooks/useCmsDocuments"
import { normalizeCmsEventForCard } from "@/lib/cmsEventList"
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv"
import { DEFAULT_PROGRAMS_LANDING } from "@shared/cms/defaults"
import { getProgramsEventSlug } from "@shared/cms/eventSlug"
import {
  DEFAULT_EVENTS_RELATED_COPY,
  mergeRelatedContentCopy,
} from "@shared/cms/relatedContentCopy"
import { getEventStartTimestamp, getEventTemporalStatus } from "@shared/cms/eventTemporalStatus"
import { resolveEventCardImageSrc } from "@shared/cms/itemCardImage"
import type { ProgramsEventCard } from "@shared/cms/types"

type RelatedEventsProps = {
  currentSlug: string
  onHasRelatedChange?: (hasRelated: boolean) => void
}

const RelatedEvents = ({ currentSlug, onHasRelatedChange }: RelatedEventsProps) => {
  const { data } = useEvents()
  const { data: eventsLanding } = useEventsLandingPage()
  const copy = mergeRelatedContentCopy(eventsLanding, DEFAULT_EVENTS_RELATED_COPY)

  const related = useMemo(() => {
    const cmsEvents = Array.isArray(data) ? data : []
    const raw =
      cmsEvents.length > 0
        ? cmsEvents
        : allowCmsSeedFallbacks()
          ? [...DEFAULT_PROGRAMS_LANDING.upcomingEvents, ...DEFAULT_PROGRAMS_LANDING.pastEvents]
          : []

    const normalized = raw
      .map((event: { slug?: string; imageSrc?: string; title?: string; dateTime?: string }) => {
        const slug = (event.slug ?? getProgramsEventSlug(event as never)).trim()
        const cardImageSrc = resolveEventCardImageSrc(slug, event.imageSrc)
        const withImage = cardImageSrc ? { ...event, imageSrc: cardImageSrc } : event
        return normalizeCmsEventForCard(withImage as never)
      })
      .filter((event: ProgramsEventCard) => {
        const slug = getProgramsEventSlug(event).trim().toLowerCase()
        return slug && slug !== currentSlug.trim().toLowerCase()
      })
      .sort((a: ProgramsEventCard, b: ProgramsEventCard) => {
        const at = getEventStartTimestamp(a)
        const bt = getEventStartTimestamp(b)
        if (!Number.isFinite(at) && !Number.isFinite(bt)) return 0
        if (!Number.isFinite(at)) return 1
        if (!Number.isFinite(bt)) return -1
        return bt - at
      })

    return normalized.slice(0, 3)
  }, [currentSlug, data])

  const visible = copy.relatedSectionEnabled && related.length > 0

  useEffect(() => {
    onHasRelatedChange?.(visible)
  }, [onHasRelatedChange, visible])

  if (!copy.relatedSectionEnabled || related.length === 0) return null

  return (
    <RelatedContentSection
      headingId="related-events-heading"
      title={copy.relatedSectionTitle}
      subheadline={copy.relatedSectionSubheadline}
      viewAllHref="/events"
      viewAllLabel="View all events"
      gridClassName={RELATED_COMPACT_EVENTS_GRID_CLASS}
    >
      {related.map((event: ProgramsEventCard, index: number) => (
        <ScrollReveal key={`${event.title}-${event.dateTime}`} delay={index * 0.05} className="w-full">
          <RelatedEventCard
            event={event}
            variant={getEventTemporalStatus(event) === "past" ? "past" : "upcoming"}
          />
        </ScrollReveal>
      ))}
    </RelatedContentSection>
  )
}

export default RelatedEvents
