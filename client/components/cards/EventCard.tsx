import { CalendarDays, User } from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import type { ProgramsEventCard } from "@shared/cms/types"
import { cn } from "@/lib/utils"

export type EventCardProps = {
  event: ProgramsEventCard
  variant: "upcoming" | "past"
  registerLabel?: string
  className?: string
}

const eventKey = (event: ProgramsEventCard) =>
  `${event.title}-${event.dateTime}-${event.person}`

export { eventKey }

export const EventCard = ({
  event,
  variant,
  registerLabel = "Register Now",
  className,
}: EventCardProps) => {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-md",
        className,
      )}
    >
      <div className="aspect-video w-full shrink-0 overflow-hidden bg-rellia-teal/5">
        <img
          src={event.imageSrc}
          alt={variant === "past" ? event.person : event.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h4 className="mb-3 font-host-grotesk text-lg font-bold leading-tight text-black">{event.title}</h4>

        <div className="mb-6 flex flex-col gap-2 font-urbanist text-sm text-black/60">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-rellia-mint" />
            {event.dateTime}
          </p>
          <p className="flex items-center gap-2">
            <User className="h-4 w-4 shrink-0 text-rellia-mint" />
            {event.person}
          </p>
        </div>

        <div className="mt-auto">
          {variant === "upcoming" && event.comingSoon ? (
            <div className="w-full rounded-full bg-black/5 py-2.5 text-center text-sm font-semibold text-black/30">
              Coming Soon
            </div>
          ) : variant === "upcoming" && event.href ? (
            <RelliaAction asChild variant="mintCardTealFill" size="compact">
              <a href={event.href} target="_blank" rel="noopener noreferrer">
                {registerLabel}
              </a>
            </RelliaAction>
          ) : variant === "past" && event.href ? (
            <RelliaAction asChild variant="mintCardTealFill" size="compact">
              <a href={event.href} target="_blank" rel="noopener noreferrer">
                {event.buttonText ?? "View"}
              </a>
            </RelliaAction>
          ) : null}
        </div>
      </div>
    </div>
  )
}
