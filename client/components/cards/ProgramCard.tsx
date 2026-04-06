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
  className?: string
}

export const ProgramCard = ({
  tag,
  title,
  description,
  imageSrc,
  href,
  buttonText,
  className,
}: ProgramCardProps) => {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-all hover:shadow-md",
        className,
      )}
    >
      <div className="relative mb-5 aspect-video overflow-hidden rounded-xl bg-rellia-teal/5">
        <img src={imageSrc} alt={title} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col text-left">
        {tag ? (
          <span className="mb-4 inline-flex items-center rounded-full border border-rellia-teal/15 bg-rellia-teal/5 px-4 py-1 font-urbanist text-[11px] text-rellia-teal md:text-xs">
            {tag}
          </span>
        ) : null}

        <h3 className="mb-3 font-host-grotesk text-lg font-bold leading-tight text-black">{title}</h3>

        <p className="mb-6 font-urbanist text-sm leading-relaxed text-black/60">{description}</p>

        <div className="mt-auto">
          <RelliaAction asChild variant="tealCardFull" size="compact">
            <Link to={href}>{buttonText}</Link>
          </RelliaAction>
        </div>
      </div>
    </div>
  )
}
