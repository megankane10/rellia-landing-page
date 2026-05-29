import { useMemo } from "react"
import { format } from "date-fns"
import { AddToCalendarButton, type AddToCalendarButtonType } from "add-to-calendar-button-react"
import type { ProgramsEventCard } from "@shared/cms/types"
import { getProgramsEventCalendarInterval } from "@/lib/eventCalendar"
import { cn } from "@/lib/utils"

type EventAddToCalendarButtonProps = {
  event: ProgramsEventCard
  canonicalUrl: string
  className?: string
}

export const EventAddToCalendarButton = ({
  event,
  canonicalUrl,
  className,
}: EventAddToCalendarButtonProps) => {
  const props = useMemo(() => {
    const interval = getProgramsEventCalendarInterval(event)
    if (!interval) return null

    const { start, end } = interval
    const location = event.location?.trim() ?? ""
    const description = event.dateTime?.trim() || canonicalUrl

    return {
      name: event.title,
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
      startTime: format(start, "HH:mm"),
      endTime: format(end, "HH:mm"),
      timeZone: "America/Toronto",
      location,
      description,
      options: ["Apple", "Google", "iCal", "Microsoft365", "Outlook.com", "Yahoo"] as AddToCalendarButtonType["options"],
    }
  }, [canonicalUrl, event])

  if (!props) return null

  return (
    <div className={cn("event-add-to-calendar", className)}>
      <AddToCalendarButton
        name={props.name}
        startDate={props.startDate}
        endDate={props.endDate}
        startTime={props.startTime}
        endTime={props.endTime}
        timeZone={props.timeZone}
        location={props.location}
        description={props.description}
        options={props.options}
        label="Add to Calendar"
        buttonStyle="round"
        lightMode="light"
        styleLight="--btn-background: #0D3540; --btn-text: #fff; --btn-border: #0D3540; --font: Host Grotesk, system-ui, sans-serif; --btn-border-radius: 9999px;"
      />
    </div>
  )
}
