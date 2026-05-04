import { Link } from "react-router-dom"
import { useState } from "react"
import { ArrowRight, Bell } from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"
import FilloutPopupDialog from "@/components/FilloutPopupDialog"

export type ProgramCardProps = {
  tag?: string
  title: string
  description: string
  imageSrc: string
  href?: string
  buttonText: string
  waitlistHref?: string
  priceLabel?: string
  priceAmount?: string
  priceSuffix?: string
  className?: string
}

export const ProgramCard = ({
  tag,
  title,
  description,
  imageSrc,
  href,
  buttonText,
  waitlistHref,
  priceLabel: _priceLabel,
  priceAmount: _priceAmount,
  priceSuffix: _priceSuffix,
  className,
}: ProgramCardProps) => {
  const hasHref = Boolean(href && href.trim().length > 0)
  const hasWaitlistHref = Boolean(waitlistHref && waitlistHref.trim().length > 0)
  const isWaitlistCard = hasWaitlistHref
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const displayTag = tag?.trim() ?? ""
  const showCornerBadge = Boolean(displayTag) && !isWaitlistCard

  return (
    <article
      aria-label={`Program: ${title}${isWaitlistCard ? ". Coming soon — join the waitlist." : ""}`}
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Image */}
        <div className="relative w-full shrink-0 overflow-hidden aspect-video bg-rellia-teal/5">
            {isWaitlistCard && (
              <div className="absolute right-3 top-3 z-10">
                <span className="inline-flex items-center rounded-full border border-white/25 bg-black/35 px-3 py-1.5 font-host-grotesk text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md">
                  Waitlist
                </span>
              </div>
            )}
            {showCornerBadge && (
              <div className="absolute right-3 top-3 z-10">
                <span className="inline-flex items-center rounded-full bg-rellia-mint/90 px-3 py-1 font-host-grotesk text-[11px] font-extrabold uppercase tracking-[0.16em] text-rellia-teal shadow-lg ring-1 ring-white/50">
                  {displayTag}
                </span>
              </div>
            )}
            {hasHref ? (
              <Link to={href as string} aria-label={`Learn more about ${title}`} className="block h-full w-full">
                <img
                  src={imageSrc}
                  alt={title}
                  className={cn(
                    "h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
                    isWaitlistCard && "opacity-[0.88] saturate-[0.65]",
                  )}
                  loading="lazy"
                />
              </Link>
            ) : (
              <img
                src={imageSrc}
                alt={title}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-500 ease-out",
                  isWaitlistCard && "opacity-[0.88] saturate-[0.65]",
                )}
                loading="lazy"
              />
            )}
          </div>

          {/* Text and Button Container */}
          <div className="flex flex-1 flex-col p-4 sm:p-5">
            {/* Title + description */}
            <div className="flex shrink-0 flex-col">
              <h3 className="line-clamp-2 font-host-grotesk text-xl font-semibold leading-snug tracking-tight text-black sm:text-2xl sm:leading-snug">
                {hasHref ? (
                  <Link
                    to={href as string}
                    className="transition-colors hover:text-rellia-teal focus-visible:outline-none"
                  >
                    {title}
                  </Link>
                ) : (
                  title
                )}
              </h3>
              <p className="mt-2 font-urbanist text-sm leading-relaxed text-black/55 line-clamp-3 sm:text-[15px]">
                {description}
              </p>
            </div>

            {/* Button */}
            <div className="mt-auto shrink-0 pt-5 sm:pt-6">
          <RelliaAction
            asChild
            variant="mintCardTealFill"
            className="w-full h-[48px] text-base"
          >
            {hasHref ? (
              <Link to={href as string}>
                {buttonText || "Learn more"} <ArrowRight />
              </Link>
            ) : hasWaitlistHref ? (
              <button
                type="button"
                onClick={() => setWaitlistOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setWaitlistOpen(true)
                  }
                }}
                aria-label={`Join waitlist for ${title}`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Bell className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                  {buttonText || "Join Waitlist"}
                </span>
              </button>
            ) : (
              <button type="button" disabled aria-disabled className="opacity-60 cursor-not-allowed">
                {buttonText || "Join Waitlist"}
              </button>
            )}
            </RelliaAction>
          </div>
        </div>
      </div>

      {hasWaitlistHref ? (
        <FilloutPopupDialog
          open={waitlistOpen}
          onOpenChange={setWaitlistOpen}
          formUrl={waitlistHref as string}
          title="Join the program waitlist"
          description="Share a few details and we'll reach out when this program opens."
        />
      ) : null}
    </article>
  )
}
