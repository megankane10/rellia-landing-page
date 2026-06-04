import { useCallback, useEffect, useMemo, useState } from "react"
import { Calendar } from "lucide-react"
import type { ProgramsEventCard } from "@shared/cms/types"
import { buildCalendarProviderLinks, type CalendarProvider } from "@/lib/calendarLinks"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type EventAddToCalendarButtonProps = {
  event: ProgramsEventCard
  canonicalUrl: string
  className?: string
}

const triggerClassName = cn(
  "inline-flex h-12 w-fit cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-rellia-teal bg-rellia-teal",
  "px-6 font-host-grotesk text-sm font-semibold text-white sm:text-[15px]",
  "transition-[background-color,border-color,color,box-shadow] duration-500 ease-out",
  "hover:border-rellia-mint hover:bg-rellia-mint hover:text-rellia-teal",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
)

const providerButtonClassName = cn(
  "flex w-full items-center justify-start gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-left",
  "font-host-grotesk text-sm font-semibold text-rellia-teal transition-colors",
  "hover:border-rellia-teal/30 hover:bg-rellia-cream/40",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
)

const openCalendarUrl = (href: string) => {
  const anchor = document.createElement("a")
  anchor.href = href
  anchor.target = "_blank"
  anchor.rel = "noopener noreferrer"
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

const usePreferBottomSheet = () => {
  const [preferBottomSheet, setPreferBottomSheet] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)")
    const update = () => setPreferBottomSheet(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return preferBottomSheet
}

type CalendarPickerBodyProps = {
  providers: { id: CalendarProvider; label: string; href: string }[]
  onPick: (provider: CalendarProvider) => void
}

const PROVIDER_ICONS: Record<CalendarProvider, string> = {
  google: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/google-calendar-2026/default.svg",
  outlook: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/microsoft-outlook/default.svg",
  ics: "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/apple/mono.svg",
}

const CalendarPickerBody = ({ providers, onPick }: CalendarPickerBodyProps) => (
  <ul className="mt-2 flex flex-col gap-2">
    {providers.map((provider) => (
      <li key={provider.id}>
        <button
          type="button"
          className={providerButtonClassName}
          onClick={() => onPick(provider.id)}
        >
          <img
            src={PROVIDER_ICONS[provider.id]}
            alt={`${provider.label} icon`}
            className="h-[22px] w-[22px] shrink-0"
            aria-hidden
          />
          <span>{provider.label}</span>
        </button>
      </li>
    ))}
  </ul>
)

export const EventAddToCalendarButton = ({
  event,
  canonicalUrl,
  className,
}: EventAddToCalendarButtonProps) => {
  const links = useMemo(
    () => buildCalendarProviderLinks(event, canonicalUrl),
    [canonicalUrl, event],
  )
  const [open, setOpen] = useState(false)
  const preferBottomSheet = usePreferBottomSheet()

  const handlePick = useCallback(
    (provider: CalendarProvider) => {
      if (!links) return

      const match = links.providers.find((entry) => entry.id === provider)
      if (!match) return

      openCalendarUrl(match.href)
      setOpen(false)
    },
    [links],
  )

  if (!links) return null

  const pickerTitle = "Add to calendar"
  const pickerDescription = `Choose a calendar for ${event.title.trim() || "this event"}.`

  const pickerBody = (
    <CalendarPickerBody
      providers={links.providers}
      onPick={(provider) => void handlePick(provider)}
    />
  )

  return (
    <div className={cn("inline-block", className)}>
      <button
        type="button"
        className={triggerClassName}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Calendar className="h-4 w-4 shrink-0" aria-hidden />
        Add to Calendar
      </button>

      {preferBottomSheet ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="bottom"
            className="rounded-t-3xl border-black/10 px-6 pb-8 pt-6"
          >
            <SheetHeader className="text-left">
              <SheetTitle className="font-host-grotesk text-lg font-semibold text-black">
                {pickerTitle}
              </SheetTitle>
              <SheetDescription className="font-urbanist text-sm text-black/60">
                {pickerDescription}
              </SheetDescription>
            </SheetHeader>
            {pickerBody}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md rounded-3xl border-black/10 px-6 py-6 sm:rounded-3xl">
            <DialogHeader>
              <DialogTitle className="font-host-grotesk text-lg font-semibold text-black">
                {pickerTitle}
              </DialogTitle>
              <DialogDescription className="font-urbanist text-sm text-black/60">
                {pickerDescription}
              </DialogDescription>
            </DialogHeader>
            {pickerBody}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
