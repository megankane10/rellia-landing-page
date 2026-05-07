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
    const avatarSrc = getProgramsEventSpeakerAvatarSrc(event)

    const tagIsMint = variant === "upcoming"

    // Simple parser for "May 15" or similar from the date line
    // e.g. "Monday, May 15, 6:00 PM"
    const dateParts = dateTimeLine.split(",")
    const dateMain = (dateParts[1] || dateParts[0] || "").trim() // "May 15"
    const timeMain = (dateParts[2] || "").trim() // "6:00 PM"

    return (
      <article
        className={cn(
          "group relative flex items-center w-full bg-white transition-all duration-300 py-6 md:py-10 border-b border-black/[0.06] hover:bg-black/[0.01]",
          className
        )}
      >
        <Link to={detailHref} className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal">
          <span className="sr-only">View {event.title}</span>
        </Link>

        {/* Date Block */}
        <div className="flex flex-col items-start justify-center w-24 sm:w-28 md:w-40 shrink-0">
          <span className="font-host-grotesk text-3xl md:text-5xl font-bold text-black leading-none">
            {dateMain.split(" ")[1] || dateMain}
          </span>
          <span className="mt-2 font-urbanist text-[11px] md:text-sm font-bold text-black/40 uppercase tracking-[0.25em]">
            {dateMain.split(" ")[0] || ""}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col min-w-0 pr-6">
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <span
              className={cn(
                "inline-flex items-center gap-2 font-host-grotesk text-xs md:text-sm font-bold uppercase tracking-[0.14em]",
                tagIsMint ? "text-rellia-teal" : "text-black/40"
              )}
            >
              {variant === "past" ? (
                <History className="h-4 w-4" aria-hidden strokeWidth={2.5} />
              ) : (
                <Calendar className="h-4 w-4" aria-hidden strokeWidth={2.5} />
              )}
              {variant === "past" ? "Past" : "Upcoming"}
            </span>
            <span className="h-1 w-1 rounded-full bg-black/10" aria-hidden />
            <span className="font-urbanist text-sm font-bold text-black/40 uppercase tracking-widest">
              {timeMain || "TBD"}
            </span>
          </div>

          <h3 className="line-clamp-2 font-host-grotesk text-2xl md:text-3xl font-bold leading-tight tracking-tight text-black group-hover:text-rellia-teal transition-colors duration-300">
            {event.title}
          </h3>

          <div className="mt-4 flex flex-wrap items-center gap-y-3 gap-x-6">
            {hasSpeakerBlock && (
              <div className="flex items-center gap-3">
                 <img src={avatarSrc} alt="" className="h-7 w-7 rounded-full border border-black/10 object-cover" />
                 <div className="flex flex-col min-w-0">
                   <span className="font-urbanist text-sm font-bold text-black/80 truncate max-w-[140px] leading-none">{speakerName}</span>
                   {speakerParts.company && (
                     <span className="font-urbanist text-[11px] font-medium text-black/40 truncate max-w-[120px] mt-0.5">{speakerParts.company}</span>
                   )}
                 </div>
              </div>
            )}
            {hasSpeakerBlock && <span className="hidden sm:block h-1 w-1 rounded-full bg-black/10" aria-hidden />}
            <div className="flex items-center gap-2 font-urbanist text-sm font-bold text-black/50">
              {attendanceMode === "virtual" ? (
                <Video className="h-4 w-4 text-rellia-teal/70" aria-hidden strokeWidth={2.5} />
              ) : (
                <MapPin className="h-4 w-4 text-rellia-teal/70" aria-hidden strokeWidth={2.5} />
              )}
              {attendanceMode === "virtual" ? "Virtual" : "In person"}
            </div>
          </div>
        </div>

        {/* Image Thumbnail */}
        {event.imageSrc && (
          <div className="relative shrink-0 rounded-2xl overflow-hidden bg-black/5 w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 ml-auto shadow-sm">
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
        )}
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
        "group relative flex flex-row w-full rounded-2xl border border-black/10 bg-white transition-all duration-500 hover:border-rellia-teal/30 hover:shadow-[0_20px_50px_-20px_rgba(13,148,136,0.12)] p-4 md:p-6 gap-5 md:gap-8 items-stretch",
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
        <Link to={program.href as string} className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal rounded-2xl">
          <span className="sr-only">View {program.title}</span>
        </Link>
      ) : null}

      <div className="relative shrink-0 rounded-xl overflow-hidden bg-rellia-teal/5 w-24 sm:w-32 md:w-[260px] lg:w-[320px] aspect-square">
        <img
          src={program.imageSrc}
          alt={program.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col min-w-0 py-1">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 font-host-grotesk text-[10px] font-bold uppercase tracking-[0.16em] ring-1 ring-black/5",
              !isWaitlistCard ? "bg-rellia-mint/80 text-rellia-teal" : "bg-black/[0.04] text-black/65"
            )}
          >
            {isWaitlistCard ? (
              <>
                <Bell className="h-3.5 w-3.5 opacity-80" aria-hidden strokeWidth={2.5} />
                Join the Waitlist
              </>
            ) : (
              <>
                <Calendar className="h-3.5 w-3.5 opacity-80" aria-hidden strokeWidth={2.5} />
                Applications Open
              </>
            )}
          </span>
        </div>

        <h3 className={cn(
          "font-host-grotesk text-2xl md:text-3xl font-bold leading-[1.15] tracking-tight text-black mb-4",
          (hasHref || isWaitlistCard) && "group-hover:text-rellia-teal transition-colors duration-300"
        )}>
          {program.title}
        </h3>
        
        <p className="font-urbanist text-[15px] md:text-base font-medium leading-relaxed text-black/60 line-clamp-3">
          {program.description}
        </p>

        {!isWaitlistCard && (
          <div className="mt-4 flex items-center gap-2.5 text-black/70">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rellia-mint/20">
              <CalendarDays className="h-4 w-4 text-rellia-teal" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-host-grotesk text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">Deadline</span>
              <span className="font-urbanist text-sm font-bold text-black/80">
                {program.deadline || getCurrentMonthDeadline()}
              </span>
            </div>
          </div>
        )}

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-black/5">
          <span className="font-host-grotesk text-sm font-bold text-rellia-teal group-hover:underline underline-offset-4 decoration-2">
            {isWaitlistCard ? "Notify me" : "View program details"}
          </span>
          <ArrowRight className="h-5 w-5 text-rellia-teal transition-transform duration-300 group-hover:translate-x-1" />
        </div>
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
