import { useMemo, useState } from "react"
import type { ProgramsEventCard } from "@shared/cms/types"
import { buildCalendarProviderLinks, type CalendarProvider } from "@/lib/calendarLinks"
import { downloadProgramsEventIcsFile } from "@/lib/eventCalendar"
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
  const links = useMemo(
    () => buildCalendarProviderLinks(event, canonicalUrl),
    [canonicalUrl, event],
  )
  const [selected, setSelected] = useState<CalendarProvider | "">("")

  if (!links) return null

  const handleSelectChange = async (value: string) => {
    const provider = value as CalendarProvider
    setSelected(provider)
    if (!provider) return

    const match = links.providers.find((entry) => entry.id === provider)
    if (!match) return

    if (provider === "ics") {
      await downloadProgramsEventIcsFile(event, canonicalUrl)
      setSelected("")
      return
    }

    window.open(match.href, "_blank", "noopener,noreferrer")
    setSelected("")
  }

  return (
    <div className={cn("inline-block", className)}>
      <label htmlFor={`event-calendar-${event.slug ?? event.title}`} className="sr-only">
        Add to calendar
      </label>
      <select
        id={`event-calendar-${event.slug ?? event.title}`}
        value={selected}
        onChange={(e) => void handleSelectChange(e.target.value)}
        className={cn(
          "h-12 w-fit cursor-pointer rounded-full border-2 border-rellia-teal bg-rellia-teal",
          "px-6 font-host-grotesk text-sm font-semibold text-white sm:text-[15px]",
          "transition-[background-color,border-color,color,box-shadow] duration-500 ease-out",
          "hover:border-rellia-mint hover:bg-rellia-mint hover:text-rellia-teal",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
        )}
        aria-label="Add to calendar — choose your calendar app"
      >
        <option value="">Add to Calendar</option>
        {links.providers.map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.label}
          </option>
        ))}
      </select>
    </div>
  )
}
