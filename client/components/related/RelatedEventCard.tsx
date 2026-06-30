import EventCompactCard from "@/components/cards/EventCompactCard"
import type { ProgramsEventCard } from "@shared/cms/types"

type RelatedEventCardProps = {
  event: ProgramsEventCard
  variant?: "upcoming" | "past"
}

const RelatedEventCard = ({ event }: RelatedEventCardProps) => {
  return <EventCompactCard event={event} />
}

export default RelatedEventCard
