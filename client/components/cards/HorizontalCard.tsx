import { Calendar, History, MapPin, Video, ArrowRight, Bell, CalendarDays } from "lucide-react"
import { Link } from "react-router-dom"
import type { ProgramsEventCard, ProgramsProgramCard } from "@shared/cms/types"
import {
  formatProgramsEventCardDateTime,
  getProgramsEventAttendanceMode,
  getProgramsEventSpeakerAvatarSrc,
  parseProgramsEventSpeaker,
  getProgramsEventLocationDetailLines,
} from "@shared/cms/programsEventDisplay"
import { programsEventDetailPath } from "@shared/cms/eventSlug"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"
import { useState } from "react"
import FilloutPopupDialog from "@/components/FilloutPopupDialog"
import { getCurrentMonthDeadline } from "@/lib/dateUtils"

const shortenMonth = (dateStr: string) => {
  const months: Record<string, string> = {
    January: "Jan", February: "Feb", March: "Mar", April: "Apr",
    May: "May", June: "Jun", July: "Jul", August: "Aug",
    September: "Sep", October: "Oct", November: "Nov", December: "Dec"
  };
  let result = dateStr;
  Object.entries(months).forEach(([full, short]) => {
    result = result.replace(new RegExp(`\\b${full}\\b`, "gi"), short);
  });
  return result;
};

export type Event = ProgramsEventCard
export type Program = ProgramsProgramCard

export type HorizontalCardProps =
  | { type: "event"; item: Event; variant?: "upcoming" | "past"; className?: string }
  | { type: "program"; item: Program; className?: string }

export function HorizontalCard(props: HorizontalCardProps) {
  const { type, item, className } = props

  if (type === "event") {
    const event = item as Event
    const variant = props.variant || "upcoming"
    const speakerParts = parseProgramsEventSpeaker(event.person)
    const attendanceMode = getProgramsEventAttendanceMode(event)
    const detailHref = programsEventDetailPath(event)
    const rawDateTime = formatProgramsEventCardDateTime(event.dateTime ?? "")
    const dateTimeLine = shortenMonth(rawDateTime)
    const personRaw = (event.person ?? "").trim()
    const speakerName = speakerParts.speaker || personRaw || ""
    const hasSpeakerBlock = Boolean(speakerName)
    const locationLine1 = getProgramsEventLocationDetailLines(event).line1
    const avatarSrc = getProgramsEventSpeakerAvatarSrc(event)

    const tagLabel = variant === "past" ? "Past" : "Upcoming"
    const tagIsMint = variant === "upcoming"

    return (
      <article
        className={cn(
          "group relative flex flex-row w-full rounded-xl border border-black/10 bg-white transition-all duration-300 hover:border-black/20 hover:shadow-md p-4 md:p-5 gap-4 md:gap-6 items-stretch min-h-[160px] sm:min-h-[180px] md:min-h-[200px]",
          className
        )}
      >
        <Link to={detailHref} className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal rounded-xl">
          <span className="sr-only">View {event.title}</span>
        </Link>
        <div className="flex flex-1 flex-col min-w-0 py-1">
          <div className="flex flex-col space-y-1 mb-2">
            {dateTimeLine ? (
              <p className="font-urbanist text-[13px] md:text-sm font-bold text-black/50 uppercase tracking-wide">{dateTimeLine}</p>
            ) : null}
            <h3 className="line-clamp-2 font-host-grotesk text-xl md:text-2xl font-semibold leading-tight tracking-tight text-black group-hover:underline decoration-2 underline-offset-4">
              {event.title}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={cn(
                "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 font-host-grotesk text-[10px] font-bold uppercase tracking-[0.14em] ring-1 ring-black/5",
                tagIsMint ? "bg-rellia-mint/80 text-rellia-teal" : "bg-black/[0.04] text-black/65"
              )}
            >
              {variant === "past" ? (
                <History className="h-3.5 w-3.5 opacity-80" aria-hidden strokeWidth={2.25} />
              ) : (
                <Calendar className="h-3.5 w-3.5 opacity-80" aria-hidden strokeWidth={2.25} />
              )}
              {tagLabel}
            </span>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-1 font-host-grotesk text-[10px] font-bold uppercase tracking-[0.14em] text-black/70">
              {attendanceMode === "virtual" ? (
                <Video className="h-3.5 w-3.5 opacity-80" aria-hidden strokeWidth={2.25} />
              ) : (
                <MapPin className="h-3.5 w-3.5 opacity-80" aria-hidden strokeWidth={2.25} />
              )}
              {attendanceMode === "virtual" ? "Virtual" : "In person"}
            </span>
          </div>

          {/* Location line removed per request */}

          {hasSpeakerBlock ? (
            <div className="mt-auto pt-4 flex items-center gap-3">
              <img
                src={avatarSrc}
                alt=""
                className={cn(
                  "h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-full border border-black/10 object-cover object-center",
                  variant === "past" && "opacity-90 saturate-[0.9]"
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="font-host-grotesk text-sm md:text-base font-bold text-black leading-snug truncate">{speakerName}</p>
                {speakerParts.company ? (
                  <p className="font-urbanist text-[13px] md:text-sm text-black/60 font-medium leading-snug truncate">{speakerParts.company}</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {event.imageSrc ? (
          <div className="relative shrink-0 rounded-lg overflow-hidden bg-black/5 ml-auto w-24 sm:w-32 md:w-40 aspect-square self-start sm:self-center">
            <img
              src={event.imageSrc}
              alt={event.title}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
                variant === "past" && "opacity-90 saturate-[0.9]"
              )}
              loading="lazy"
            />
          </div>
        ) : null}
      </article>
    )
  }

  // Program Card
  const program = item as Program
  const hasHref = Boolean(program.href && program.href.trim().length > 0)
  const hasWaitlistHref = Boolean(program.waitlistHref && program.waitlistHref.trim().length > 0)
  const isWaitlistCard = hasWaitlistHref
  const [waitlistOpen, setWaitlistOpen] = useState(false)

  return (
    <article
      className={cn(
        "group relative flex flex-row w-full rounded-xl border border-black/10 bg-white transition-all duration-300 hover:border-black/20 hover:shadow-md p-4 md:p-5 gap-4 md:gap-6 items-stretch min-h-[160px] sm:min-h-[180px] md:min-h-[200px]",
        hasHref ? "cursor-pointer" : (isWaitlistCard ? "cursor-pointer" : ""),
        className
      )}
      onClick={!hasHref && isWaitlistCard ? () => setWaitlistOpen(true) : undefined}
      onKeyDown={!hasHref && isWaitlistCard ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          setWaitlistOpen(true)
        }
      } : undefined}
      tabIndex={!hasHref && isWaitlistCard ? 0 : undefined}
    >
      {hasHref ? (
        <Link to={program.href as string} className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal rounded-xl">
          <span className="sr-only">View {program.title}</span>
        </Link>
      ) : null}

      <div className="flex flex-[1.2] flex-col min-w-0 py-1">
        <h3 className={cn(
          "font-host-grotesk text-xl md:text-2xl font-semibold leading-tight tracking-tight text-black mb-2",
          (hasHref || isWaitlistCard) && "group-hover:underline decoration-2 underline-offset-4"
        )}>
          {program.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 font-host-grotesk text-[10px] font-bold uppercase tracking-[0.14em] ring-1 ring-black/5",
              !isWaitlistCard ? "bg-rellia-mint/80 text-rellia-teal" : "bg-black/[0.04] text-black/65"
            )}
          >
            {isWaitlistCard ? (
              <>
                <Bell className="h-3.5 w-3.5 opacity-80" aria-hidden strokeWidth={2.25} />
                Waitlist
              </>
            ) : (
              <>
                <Calendar className="h-3.5 w-3.5 opacity-80" aria-hidden strokeWidth={2.25} />
                Available
              </>
            )}
          </span>
        </div>
        
        <p className="font-urbanist text-sm md:text-base font-medium leading-relaxed text-black/60 line-clamp-3 pt-4">
          {program.description}
        </p>

        {!isWaitlistCard && (
          <div className="mt-auto pt-5 flex items-center gap-2 text-black">
            <CalendarDays className="h-4.5 w-4.5 text-rellia-teal" strokeWidth={2.5} />
            <span className="font-host-grotesk text-[11px] md:text-xs font-bold uppercase tracking-[0.18em]">
              Deadline: {program.deadline || getCurrentMonthDeadline()}
            </span>
          </div>
        )}
      </div>

      <div className="relative shrink-0 rounded-lg overflow-hidden bg-rellia-teal/5 ml-auto w-28 sm:w-40 md:w-56 aspect-square self-start sm:self-center">
        <img
          src={program.imageSrc}
          alt={program.title}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
            isWaitlistCard && "opacity-[0.88] saturate-[0.65]"
          )}
          loading="lazy"
        />
      </div>

      {hasWaitlistHref ? (
        <FilloutPopupDialog
          open={waitlistOpen}
          onOpenChange={setWaitlistOpen}
          formUrl={program.waitlistHref as string}
          title="Join the program waitlist"
          description="Share a few details and we'll reach out when this program opens."
        />
      ) : null}
    </article>
  )
}
