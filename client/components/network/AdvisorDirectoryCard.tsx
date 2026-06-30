import { useMemo } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { DirectoryCardTags } from "@/components/network/DirectoryCardTags"
import { resolveAdvisorPrimaryTag } from "@/lib/resolveAdvisorPrimaryTag"
import { cmsCleanText, cmsDisplayText } from "@/lib/cmsStega"
import type { AdvisorDirectoryEntry } from "@/data/advisorDirectory"

type AdvisorDirectoryCardProps = {
  advisor: AdvisorDirectoryEntry
  href?: string
  onOpen?: () => void
  className?: string
}

const AdvisorDirectoryCard = ({
  advisor,
  href,
  onOpen,
  className,
}: AdvisorDirectoryCardProps) => {
  const cardTags = useMemo(() => {
    const primary = resolveAdvisorPrimaryTag(advisor)
    const industries = Array.isArray(advisor.industries)
      ? advisor.industries.map((tag) => tag.trim()).filter(Boolean)
      : []
    return primary ? [primary, ...industries] : industries
  }, [advisor])

  const description = [advisor.organization, advisor.role]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean)
    .join(" · ")

  const cardBody = (
    <>
      <div className="relative aspect-[5/4] w-full shrink-0 overflow-hidden border-b border-black/[0.05] bg-white">
        <img
          src={advisor.photoSrc}
          alt=""
          className="h-full w-full object-cover object-top transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          loading="lazy"
        />
        <DirectoryCardTags tags={cardTags} variant="onLight" />
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="line-clamp-1 font-host-grotesk text-lg font-bold leading-snug tracking-tight text-black group-hover:underline group-hover:underline-offset-4 decoration-2">
          {cmsDisplayText(advisor.name)}
        </h3>
        <p className="mt-1.5 line-clamp-3 min-h-[4.125rem] font-urbanist text-sm font-medium leading-relaxed text-black/70">
          {description ? cmsDisplayText(description) : "\u00A0"}
        </p>
      </div>
    </>
  )

  const shellClassName = cn(
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white",
    "shadow-sm transition-[box-shadow,transform] duration-300 motion-reduce:transition-none",
    "hover:-translate-y-[1px] hover:shadow-md",
    className,
  )

  if (href) {
    return (
      <article className={shellClassName}>
        <Link
          to={href}
          className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2"
          aria-label={`Open profile for ${cmsCleanText(advisor.name)}`}
        >
          {cardBody}
        </Link>
      </article>
    )
  }

  return (
    <article
      className={cn(shellClassName, "cursor-pointer")}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (!onOpen) return
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onOpen()
        }
      }}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `Open profile for ${cmsCleanText(advisor.name)}` : undefined}
    >
      {cardBody}
    </article>
  )
}

export default AdvisorDirectoryCard
