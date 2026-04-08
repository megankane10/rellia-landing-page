import { Link } from "react-router-dom"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"

export type ProgramCardProps = {
  tag?: string
  title: string
  description: string
  imageSrc: string
  href: string
  buttonText: string
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
  priceLabel: _priceLabel,
  priceAmount: _priceAmount,
  priceSuffix: _priceSuffix,
  className,
}: ProgramCardProps) => {
  return (
    <div
      aria-label={`Program: ${title}`}
      className={cn(
        "group h-full w-full max-w-[420px] mx-auto overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-md",
        "hover:-translate-y-0.5 hover:shadow-lg hover:ring-black/[0.06]",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-rellia-teal focus-within:ring-offset-2",
        className,
      )}
    >
      <div className="flex h-full flex-col">
        <div className="aspect-video w-full shrink-0 overflow-hidden bg-rellia-teal/5">
          <Link to={href} aria-label={`Learn more about ${title}`} className="block h-full w-full">
            <img
              src={imageSrc}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </Link>
        </div>

        <div className="flex flex-1 flex-col p-6">
          {tag ? (
            <span className="mb-2 inline-flex w-fit items-center rounded-full border border-rellia-teal/15 bg-rellia-teal/5 px-3 py-1 font-urbanist text-[11px] font-semibold text-rellia-teal">
              {tag}
            </span>
          ) : null}

          <h3 className="font-host-grotesk text-[16px] font-medium leading-snug text-black">
            <Link to={href} className="transition-colors hover:text-rellia-teal focus-visible:outline-none">
              {title}
            </Link>
          </h3>

          <p className="mt-2 flex-1 font-urbanist text-[14px] leading-[1.55] text-black/60">
            {description}
          </p>
        </div>

        <div className="mt-auto p-4">
          <RelliaAction asChild variant="tealCardFull" className="w-full h-[48px] text-base">
            <Link to={href}>Learn more</Link>
          </RelliaAction>
        </div>
      </div>
    </div>
  )
}
