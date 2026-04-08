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
  priceAmount,
  priceSuffix,
  className,
}: ProgramCardProps) => {
  const periodSuffix = priceSuffix?.trim() || "/month"

  return (
    <div
      aria-label={`Program: ${title}`}
      className={cn(
        "group h-full w-full max-w-[460px] mx-auto overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm ring-1 ring-black/[0.03] transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-lg hover:ring-black/[0.06]",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-rellia-teal focus-within:ring-offset-2",
        className,
      )}
    >
      <div className="flex h-full flex-col">
        <Link to={href} aria-label={`Learn more about ${title}`} className="block px-4 pt-4">
          <div className="relative aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl bg-gradient-to-br from-rellia-teal/[0.10] to-rellia-mint/[0.08]">
            <img
              src={imageSrc}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </Link>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
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

        {priceAmount ? (
          <div className="mt-auto flex min-h-[56px] items-stretch border-t border-black/10">
            <div className="flex min-w-0 flex-1 items-center bg-white px-4 py-3">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="font-host-grotesk text-[22px] font-semibold leading-none tracking-tight text-rellia-teal sm:text-2xl">
                  {priceAmount}
                </span>
                <span className="font-host-grotesk text-base font-semibold leading-none text-rellia-teal/85 sm:text-lg">
                  {periodSuffix}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-stretch px-3 py-2.5 sm:px-4">
              <RelliaAction
                asChild
                variant="outlineOnWhite"
                size="compact"
                className="self-center px-4 transition-colors hover:bg-rellia-teal hover:text-white"
              >
                <Link to={href}>Learn more</Link>
              </RelliaAction>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
