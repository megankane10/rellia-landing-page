import { Calendar, History, MapPin, Video, Bell, CalendarDays } from "lucide-react"
import { Link } from "react-router-dom"
import type { ProgramsEventCard, ProgramsProgramCard } from "@shared/cms/types"
import { isProgramUpcoming, isProgramWaitlist } from "@shared/cms/programStatus"
import {
  formatProgramsEventCardDateTime,
  getProgramsEventDisplayDateTime,
  getProgramsEventAttendanceMode,
  getProgramsEventSpeakerAvatarSrc,
  parseProgramsEventSpeaker,
  getProgramsEventLocationDetailLines,
} from "@shared/cms/programsEventDisplay"
import { programsEventDetailPath } from "@shared/cms/eventSlug"
import { cn } from "@/lib/utils"
import { getCurrentMonthDeadline } from "@/lib/dateUtils"
import { placeholderImageFromSeed } from "@/lib/placeholderImages"
import { cmsCleanText, cmsDisplayText } from "@/lib/cmsStega"
import { MarketingImage } from "@/components/MarketingImage"

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

const extractEventDateBits = (raw: string) => {
  const yearMatch = raw.match(/\b(19|20)\d{2}\b/)
  const year = yearMatch?.[0] ?? ""
  const monthMatch = raw.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i)
  const month = monthMatch?.[0] ? monthMatch[0].toUpperCase() : ""
  const dayMatch = raw.match(/\b([0-3]?\d)\b/)
  const day = dayMatch?.[1] ?? ""
  return { year, month, day }
}

const formatTimeFromStartsAt = (startsAt: unknown): string => {
  if (typeof startsAt !== "string" || !startsAt.trim()) return ""
  const t = Date.parse(startsAt)
  if (!Number.isFinite(t)) return ""
  const d = new Date(t)
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  })
  return `${time} EDT`
}

const cleanBadgeTime = (raw: string): string => {
  const s = raw.trim()
  if (!s) return ""
  return s
    // When we split by commas on strings like "Tue, Jun 24, 2026 — 5:30 PM EDT",
    // the "time" chunk can start with "2026 —". Strip that entirely.
    .replace(/^(?:19|20)\d{2}\s*[—-]\s*/g, "")
    .replace(/^[—-]\s*/g, "")
    .trim()
}

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
    const rawDateTime = formatProgramsEventCardDateTime(getProgramsEventDisplayDateTime(event))
    const dateTimeLine = shortenMonth(rawDateTime)
    const personRaw = (event.person ?? "").trim()
    const speakerName = speakerParts.speaker || personRaw || ""
    const hasSpeakerBlock = Boolean(speakerName)
    const avatarSrc = getProgramsEventSpeakerAvatarSrc(event)

    const tagIsMint = variant === "upcoming"

    // Simple parser for "May 15" or similar from the date line
    // e.g. "Monday, May 15, 6:00 PM"
    const dateParts = dateTimeLine.split(",")
    const dateMain = (dateParts[1] || dateParts[0] || "").trim()
    const parsedTime = (dateParts[2] || "").trim()
    const computedTime = parsedTime || formatTimeFromStartsAt(event.startsAt)
    const timeMain = cleanBadgeTime(computedTime)
    const dateBits = extractEventDateBits(dateTimeLine)
    const eventThumbSrc = event.imageSrc?.trim() ? event.imageSrc : placeholderImageFromSeed(cmsCleanText(event.slug || event.title), 720, 720)

    return (
      <article
        className={cn(
          "group relative flex flex-col md:flex-row items-start md:items-center w-full bg-white transition-all duration-300 pt-4 pb-5 md:pt-6 md:pb-7 px-4 md:px-8 border-b border-black/[0.06] hover:bg-black/[0.03] gap-6 md:gap-0",
          "hover:rounded-2xl hover:border-black/10 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.12)] hover:z-20 ring-2 ring-transparent hover:ring-rellia-teal",
          className
        )}
      >
        <Link to={detailHref} className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal">
          <span className="sr-only">View {cmsCleanText(event.title)}</span>
        </Link>

        {/* Date Block (Desktop only) */}
        <div className="hidden md:flex flex-col items-center justify-center w-40 shrink-0 text-center">
          <span className="font-urbanist text-[11px] md:text-sm font-bold text-black/40 uppercase tracking-[0.25em]">
            {dateBits.year}
          </span>
          <span className="mt-1 font-host-grotesk text-3xl md:text-5xl font-bold text-black leading-none">
            {(dateBits.day || dateMain.split(" ")[1] || dateMain).padStart(2, "0")}
          </span>
          <span className="mt-2.5 font-urbanist text-[13px] md:text-[16px] font-black text-rellia-teal uppercase tracking-[0.25em]">
            {dateBits.month || dateMain.split(" ")[0] || ""}
          </span>
        </div>
 
        {/* Content Section */}
        <div className="flex flex-1 flex-col min-w-0 pr-6 md:pr-10 w-full">
          {/* Mobile Date + Tags Row */}
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-2.5 mb-3 md:hidden">
            <div className="flex items-center gap-2 pr-1">
              <span className="font-host-grotesk text-3xl font-bold text-black leading-none">
                {(dateBits.day || dateMain.split(" ")[1] || dateMain).padStart(2, "0")}
              </span>
              <span className="font-urbanist text-[15px] font-black text-rellia-teal uppercase tracking-[0.2em] mt-0.5">
                {dateBits.month || dateMain.split(" ")[0] || ""}
              </span>
            </div>
            <span
              className={cn(
                "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 font-host-grotesk text-[9px] font-semibold uppercase tracking-[0.12em] ring-1 ring-black/5 sm:gap-1.5 sm:text-[10px] sm:tracking-[0.14em]",
                variant === "past" ? "bg-black/[0.06] text-black/65" : "bg-rellia-mint text-rellia-teal"
              )}
            >
              {variant === "past" ? (
                <History className="h-3 w-3 opacity-90 text-black/50" aria-hidden strokeWidth={2.25} />
              ) : (
                <Calendar className="h-3 w-3 opacity-90 text-rellia-teal" aria-hidden strokeWidth={2.25} />
              )}
              {variant === "past" ? "Past" : "Upcoming"}
            </span>
          </div>
 
          {/* Desktop Tags Row */}
          <div className="hidden md:flex flex-wrap items-center gap-4 mb-3">
            <span
              className={cn(
                "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 font-host-grotesk text-[9px] font-semibold uppercase tracking-[0.12em] ring-1 ring-black/5 sm:gap-1.5 sm:text-[10px] sm:tracking-[0.14em]",
                variant === "past" ? "bg-black/[0.06] text-black/65" : "bg-rellia-mint text-rellia-teal"
              )}
            >
              {variant === "past" ? (
                <History className="h-3.5 w-3.5 opacity-90 text-black/50" aria-hidden strokeWidth={2.25} />
              ) : (
                <Calendar className="h-3.5 w-3.5 opacity-90 text-rellia-teal" aria-hidden strokeWidth={2.25} />
              )}
              {variant === "past" ? "Past" : "Upcoming"}
            </span>
          </div>
 
          <h3 className="font-host-grotesk text-2xl md:text-[32px] lg:text-[36px] font-medium leading-tight tracking-tight text-black group-hover:text-rellia-teal transition-colors duration-300 group-hover:underline decoration-2 underline-offset-4">
            {cmsDisplayText(event.title)}
          </h3>
 
          {/* Mobile Image (Above Speaker) */}
          <div className="mt-5 md:hidden">
            <div className="relative aspect-[5/4] w-full max-h-[min(72vw,320px)] overflow-hidden rounded-2xl bg-black/5 shadow-sm">
              <MarketingImage
                src={eventThumbSrc}
                alt={cmsCleanText(event.title)}
                preset="contentCard"
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
                  variant === "past" && "opacity-90 saturate-[0.9]"
                )}
                loading="lazy"
              />
            </div>
          </div>
 
          <div className="mt-6 flex flex-wrap items-center gap-y-3 gap-x-6">
            {hasSpeakerBlock && (
              <div className="flex items-center gap-3">
                <MarketingImage
                  src={avatarSrc}
                  alt=""
                  decorative
                  preset="avatar"
                  className="h-9 w-9 rounded-full border border-black/10 object-cover"
                />
                <span className="font-urbanist text-[15px] md:text-base font-semibold text-black/80 leading-none truncate">
                  {cmsDisplayText(speakerName)}
                  {speakerParts.company ? (
                    <span className="font-normal text-black/45">, {cmsDisplayText(speakerParts.company)}</span>
                  ) : null}
                </span>
              </div>
            )}
          </div>
        </div>
 
        {/* Desktop Image Thumbnail */}
        <div className="relative hidden shrink-0 overflow-hidden rounded-2xl bg-black/5 shadow-sm md:ml-auto md:block md:h-[180px] md:w-[180px] lg:h-[210px] lg:w-[210px]">
          <MarketingImage
            src={eventThumbSrc}
            alt={cmsCleanText(event.title)}
            preset="contentCard"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
              variant === "past" && "opacity-90 saturate-[0.9]"
            )}
            loading="lazy"
          />
        </div>
      </article>
    )
  }

  // Program Card
  const program = item as Program
  const hasHref = Boolean(cmsCleanText(program.href))
  const isUpcomingStatus = isProgramUpcoming(program)
  const isWaitlistCard = isProgramWaitlist(program) && !isUpcomingStatus
  const programImageSrc = program.imageSrc?.trim()
    ? program.imageSrc
    : placeholderImageFromSeed(cmsCleanText(program.title), 1200, 900)

  return (
    <article
      className={cn(
        "group relative flex w-full transition-all duration-500 py-4 md:py-6 px-4 md:px-8 gap-6 md:gap-10 items-start flex-col md:flex-row",
        "border-b border-black/[0.06]",
        "hover:rounded-2xl hover:border-black/10 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.12)] hover:bg-black/[0.03] hover:z-20 outline outline-2 outline-offset-[8px] outline-transparent hover:outline-rellia-teal",
        hasHref ? "cursor-pointer" : "",
        className
      )}
    >
      {hasHref ? (
        <Link to={program.href as string} className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal rounded-2xl">
          <span className="sr-only">View {cmsCleanText(program.title)}</span>
        </Link>
      ) : null}

      {/* Image */}
      <div className="relative aspect-[5/4] w-full max-h-[min(72vw,320px)] shrink-0 overflow-hidden rounded-2xl bg-rellia-teal/5 md:aspect-square md:h-[210px] md:max-h-none md:w-[210px] lg:h-[250px] lg:w-[250px]">
        <MarketingImage
          src={programImageSrc}
          alt={cmsCleanText(program.title)}
          preset="contentCard"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col min-w-0 py-1">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 font-host-grotesk text-[10px] font-bold uppercase tracking-[0.16em] ring-1 ring-black/5",
              !isWaitlistCard ? "bg-rellia-mint/80 text-rellia-teal" : "bg-black/[0.04] text-black/65"
            )}
          >
            {isWaitlistCard ? (
              <>
                <Bell className="h-3.5 w-3.5 opacity-80" aria-hidden strokeWidth={2.5} />
                Join the waitlist
              </>
            ) : (
              <>
                <Calendar className="h-3.5 w-3.5 opacity-80" aria-hidden strokeWidth={2.5} />
                Applications open
              </>
            )}
          </span>
        </div>

        <h3 className={cn(
          "font-host-grotesk text-2xl md:text-[28px] font-medium leading-[1.15] tracking-tight text-black mb-2",
          (hasHref || isWaitlistCard) && "group-hover:text-rellia-teal transition-colors duration-300 group-hover:underline decoration-2 underline-offset-4"
        )}>
          {cmsDisplayText(program.title)}
        </h3>
        
        <p className="font-urbanist text-[14px] md:text-[15px] font-medium leading-relaxed text-black/60 line-clamp-3">
          {cmsDisplayText(program.description)}
        </p>

        {!isWaitlistCard ? (
          <div className="mt-auto pt-5 md:pt-6 pb-5 md:pb-6">
            <div className="flex items-end gap-3 text-black/70">
              <CalendarDays className="h-7 w-7 text-rellia-teal" strokeWidth={2.25} aria-hidden />
              <span className="font-host-grotesk text-[12px] font-bold uppercase tracking-[0.18em] text-black/80">
                DEADLINE: {cmsDisplayText(program.deadline) || getCurrentMonthDeadline()}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  )
}
