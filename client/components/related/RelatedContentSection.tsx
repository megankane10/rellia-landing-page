import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import ScrollReveal from "@/components/ScrollReveal"
import { PROFILE_PAGE_GRID_CLASS } from "@/components/network/profilePageGrid"
import { HEADING_SECTION } from "@/lib/typography"
import { cn } from "@/lib/utils"
import { cmsDisplayText } from "@/lib/cmsStega"

/** Standard horizontal page gutter used across marketing sections (matches story hero + directory pages). */
export const MARKETING_PAGE_GUTTER_CLASS = "px-6 md:px-10"

/** Standard max content width for listing grids and related-item rails. */
export const MARKETING_PAGE_SHELL_CLASS = `mx-auto w-full max-w-[1300px] ${MARKETING_PAGE_GUTTER_CLASS}`

export type RelatedContentSectionProps = {
  headingId: string
  title: string
  subheadline: string
  viewAllHref: string
  viewAllLabel: string
  children: ReactNode
  /** Profile pages align heading + grid with the main content column beside the sticky sidebar. */
  layout?: "default" | "profile" | "profileEmbedded"
  gridClassName?: string
}

const RelatedContentSection = ({
  headingId,
  title,
  subheadline,
  viewAllHref,
  viewAllLabel,
  children,
  layout = "default",
  gridClassName = "mt-8 grid grid-cols-1 gap-12 md:mt-10 md:grid-cols-2 md:gap-8 xl:grid-cols-3",
}: RelatedContentSectionProps) => {
  const viewAllLinkClass =
    "inline-flex w-fit shrink-0 items-center gap-1.5 font-host-grotesk text-sm font-semibold text-rellia-teal hover:underline hover:underline-offset-4"

  const headerBlock = (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2
          id={headingId}
          className={cn(
            "min-w-0 font-host-grotesk font-semibold leading-tight tracking-tight text-black",
            HEADING_SECTION,
          )}
        >
          {cmsDisplayText(title)}
        </h2>
        <Link
          to={viewAllHref}
          className={cn(viewAllLinkClass, "hidden sm:inline-flex")}
          aria-label={viewAllLabel}
        >
          {viewAllLabel}
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      </div>
      {subheadline?.trim() ? (
        <p className="mt-3 max-w-2xl font-urbanist text-base leading-relaxed text-black/60 md:mt-4 md:text-lg">
          {cmsDisplayText(subheadline)}
        </p>
      ) : null}
      <Link
        to={viewAllHref}
        className={cn(viewAllLinkClass, "mt-3 sm:hidden")}
        aria-label={viewAllLabel}
      >
        {viewAllLabel}
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
      </Link>
    </div>
  )

  if (layout === "profileEmbedded") {
    return (
      <section className="w-full pb-12 md:pb-16" aria-labelledby={headingId}>
        <div className="border-t border-black/10 pt-12 md:pt-16">
          <div className={PROFILE_PAGE_GRID_CLASS}>
            <div className="hidden lg:block" aria-hidden="true" />
            <div className="min-w-0 lg:col-start-2">
              {headerBlock}
              <div className={gridClassName}>{children}</div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (layout === "profile") {
    return (
      <section className="bg-white pb-12 md:pb-16" aria-labelledby={headingId}>
        <div className="border-t border-black/10" aria-hidden />
        <div className={cn(MARKETING_PAGE_SHELL_CLASS, "pt-12 md:pt-16")}>
          <ScrollReveal>
            <div className={PROFILE_PAGE_GRID_CLASS}>
              <div className="hidden lg:block" aria-hidden="true" />
              <div className="min-w-0 lg:col-start-2">
                {headerBlock}
                <div className={gridClassName}>{children}</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    )
  }

  return (
    <section
      className="border-t border-black/10 bg-white py-12 md:py-16"
      aria-labelledby={headingId}
    >
      <div className={MARKETING_PAGE_SHELL_CLASS}>
        <ScrollReveal>
          {headerBlock}
          <div className={gridClassName}>{children}</div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default RelatedContentSection
