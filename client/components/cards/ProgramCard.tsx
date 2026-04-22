import { Link } from "react-router-dom"
import { useState } from "react"
import { Bell } from "lucide-react"
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
  const isWaitlistCard = !hasHref && hasWaitlistHref
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const displayTag = tag?.trim() ?? ""
  const showCornerBadge = Boolean(displayTag) && !isWaitlistCard

  return (
    <div
      aria-label={`Program: ${title}${isWaitlistCard ? ". Coming soon — join the waitlist." : ""}`}
      className={cn(
        "group h-full w-full max-w-[420px] mx-auto overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm",
        "transition-[transform,box-shadow] duration-200 ease-out",
        "hover:-translate-y-0.5 hover:shadow-md hover:shadow-lg hover:ring-1 hover:ring-black/[0.06]",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-rellia-teal focus-within:ring-offset-2",
        className,
      )}
    >
      <div className="flex h-full flex-col">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-rellia-teal/5">
          {showCornerBadge ? (
            <div className="absolute right-3 top-3 z-10">
              <span className="inline-flex items-center rounded-full bg-rellia-mint/90 px-3 py-1 font-host-grotesk text-[11px] font-extrabold uppercase tracking-[0.16em] text-rellia-teal shadow-lg ring-1 ring-white/50">
                {displayTag}
              </span>
            </div>
          ) : null}

          {hasHref ? (
            <Link to={href as string} aria-label={`Learn more about ${title}`} className="block h-full w-full">
              <img
                src={imageSrc}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </Link>
          ) : (
            <img
              src={imageSrc}
              alt={title}
              className={cn(
                "h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
                isWaitlistCard && "opacity-[0.88] saturate-[0.65]",
              )}
              loading="lazy"
            />
          )}

          {isWaitlistCard ? (
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-center gap-2 border-b border-rellia-teal/15 bg-rellia-mint py-2.5 px-4 text-rellia-teal shadow-[0_4px_12px_rgba(13,53,64,0.12)]"
              aria-hidden
            >
              <Bell className="h-4 w-4 shrink-0" strokeWidth={2.25} />
              <span className="font-host-grotesk text-[11px] font-bold uppercase tracking-[0.14em]">
                Join the Waitlist
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-host-grotesk text-[16px] font-medium leading-snug text-black">
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

          <p className="mt-2 flex-1 font-urbanist text-[14px] leading-[1.55] text-black/60">
            {description}
          </p>
        </div>

        <div className="mt-auto p-4">
          <RelliaAction
            asChild
            variant={isWaitlistCard ? "mintCardFull" : "creamCardFull"}
            className="w-full h-[48px] text-base"
          >
            {hasHref ? (
              <Link to={href as string}>{buttonText || "Learn more"}</Link>
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
                {buttonText || "Join Waitlist"}
              </button>
            ) : (
              <button type="button" disabled aria-disabled className="opacity-60 cursor-not-allowed">
                {buttonText || "Join Waitlist"}
              </button>
            )}
          </RelliaAction>
        </div>
      </div>

      {hasWaitlistHref ? (
        <FilloutPopupDialog
          open={waitlistOpen}
          onOpenChange={setWaitlistOpen}
          formUrl={waitlistHref as string}
          title="Join the program waitlist"
          description="Share a few details and we’ll reach out when this program opens."
        />
      ) : null}
    </div>
  )
}
