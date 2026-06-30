import type { KeyboardEvent } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { cmsCleanText, cmsDisplayText } from "@/lib/cmsStega"
import { DirectoryCardTags } from "@/components/network/DirectoryCardTags"
import type { FounderCompany } from "@/data/founderDirectory"

type FounderDirectoryCardProps = {
  company: FounderCompany
  href?: string
  onOpen?: () => void
  layout?: boolean
  className?: string
}

const cardBody = (company: FounderCompany) => {
  const cardTags = [...company.specialtyTags, ...company.businessModels]
  const description = company.shortDescription?.trim() || company.tagline?.trim()

  return (
    <>
      <div className="relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden border-b border-black/[0.05] bg-white p-4">
        <img
          src={company.logoSrc}
          alt=""
          className="max-h-full max-w-full object-contain object-center transition duration-500 ease-out group-hover:scale-[1.02]"
          loading="lazy"
        />
        <DirectoryCardTags tags={cardTags} variant="onLight" />
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="line-clamp-1 font-host-grotesk text-lg font-bold leading-snug tracking-tight text-black group-hover:underline decoration-2 underline-offset-4">
          {cmsDisplayText(company.logoName)}
        </h3>
        <p className="mt-1.5 line-clamp-3 min-h-[4.125rem] font-urbanist text-sm font-medium leading-relaxed text-black/77">
          {description ? cmsDisplayText(description) : "\u00A0"}
        </p>
        {company.countries.length > 0 ? (
          <p className="mt-2 line-clamp-1 font-urbanist text-sm leading-relaxed text-black/55">
            {company.countries.join(", ")}
          </p>
        ) : null}
      </div>
    </>
  )
}

const shellClassName = (className?: string) =>
  cn(
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white",
    "shadow-sm transition-[box-shadow,transform] duration-300 motion-reduce:transition-none",
    "hover:-translate-y-[1px] hover:shadow-md",
    className,
  )

const FounderDirectoryCard = ({
  company,
  href,
  onOpen,
  layout = false,
  className,
}: FounderDirectoryCardProps) => {
  if (href) {
    return (
      <article className={shellClassName(className)}>
        <Link
          to={href}
          className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2"
          aria-label={`Open details for ${cmsCleanText(company.logoName)}`}
        >
          {cardBody(company)}
        </Link>
      </article>
    )
  }

  const interactiveProps = onOpen
    ? {
        onClick: onOpen,
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onOpen()
          }
        },
        role: "button" as const,
        tabIndex: 0,
      }
    : {}

  const Article = layout ? motion.article : "article"

  return (
    <Article
      layout={layout || undefined}
      className={cn(shellClassName(className), onOpen ? "cursor-pointer" : undefined)}
      aria-label={onOpen ? `Open details for ${cmsCleanText(company.logoName)}` : undefined}
      {...interactiveProps}
    >
      {cardBody(company)}
    </Article>
  )
}

export default FounderDirectoryCard
