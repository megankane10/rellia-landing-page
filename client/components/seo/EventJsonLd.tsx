import { Helmet } from "react-helmet-async"
import { getSiteUrl } from "@/config/seo"

type EventJsonLdProps = {
  name: string
  description: string
  url: string
  startDate?: string
  endDate?: string
  locationName?: string
  imageUrl?: string
  eventStatus?: "EventScheduled" | "EventCancelled" | "EventPostponed"
  eventAttendanceMode?: "OfflineEventAttendanceMode" | "OnlineEventAttendanceMode" | "MixedEventAttendanceMode"
}

const EventJsonLd = ({
  name,
  description,
  url,
  startDate,
  endDate,
  locationName,
  imageUrl,
  eventStatus = "EventScheduled",
  eventAttendanceMode,
}: EventJsonLdProps) => {
  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    url,
    eventStatus: `https://schema.org/${eventStatus}`,
    organizer: {
      "@type": "Organization",
      name: "Rellia Health",
      url: getSiteUrl(),
    },
  }
  if (startDate) payload.startDate = startDate
  if (endDate) payload.endDate = endDate
  if (locationName) {
    payload.location = {
      "@type": "Place",
      name: locationName,
    }
  }
  if (imageUrl) payload.image = imageUrl
  if (eventAttendanceMode) {
    payload.eventAttendanceMode = `https://schema.org/${eventAttendanceMode}`
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(payload)}</script>
    </Helmet>
  )
}

export default EventJsonLd
