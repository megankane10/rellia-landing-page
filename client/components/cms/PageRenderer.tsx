import type { ReactNode } from "react"
import PageHeader from "@/components/PageHeader"
import { PortableRichText } from "@/components/PortableRichText"
import RelliaAction from "@/components/RelliaAction"
import { cn } from "@/lib/utils"
import type {
  CmsPageContent,
  CmsPageSection,
  CmsSectionCardsGrid,
  CmsSectionHero,
  CmsSectionRichText,
  NavItem,
} from "@shared/cms/types"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

const isExternalHref = (href: string) => /^(https?:\/\/|mailto:|tel:)/i.test(href)

const normalizeInternalHref = (href: string) => {
  const trimmed = href.trim()
  if (!trimmed) return "/"
  if (isExternalHref(trimmed)) return trimmed
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

const CtaLink = ({
  item,
  className,
  children,
}: {
  item: NavItem
  className?: string
  children?: ReactNode
}) => {
  const href = normalizeInternalHref(item.href)
  const content = children ?? item.label

  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={item.label}>
        {content}
      </a>
    )
  }

  return (
    <Link to={href} className={className} aria-label={item.label}>
      {content}
    </Link>
  )
}

const SectionHero = ({ section }: { section: CmsSectionHero }) => {
  const title = section.headline
  const subtitle = section.subheadline?.trim() ? section.subheadline : undefined

  return (
    <section className="w-full bg-rellia-teal pt-[72px] md:pt-[86px] lg:pt-[96px]">
      <div className="relative">
        {section.imageUrl ? (
          <>
            <img
              src={section.imageUrl}
              alt={section.imageAlt?.trim() ?? ""}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal/[0.92] via-rellia-teal/70 to-[#0a2830]/85" aria-hidden />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal/[0.92] via-rellia-teal/70 to-[#0a2830]/85" aria-hidden />
        )}

        <PageHeader
          title={
            <span className="inline-flex flex-col">
              {section.badge?.trim() ? (
                <span className="mb-4 inline-flex w-fit items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 font-host-grotesk text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 md:mb-5 md:text-xs">
                  {section.badge.trim()}
                </span>
              ) : null}
              <span>{title}</span>
            </span>
          }
          subtitle={subtitle}
          variant="dark"
          className="bg-transparent"
        />

        {(section.primaryCta?.href || section.secondaryCta?.href) ? (
          <div className="relative z-10 mx-auto max-w-[1300px] px-6 pb-14 md:px-10 md:pb-16">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {section.primaryCta?.href ? (
                <RelliaAction asChild variant="mintOnTealStrip" size="comfortable" className="w-full justify-center sm:w-auto">
                  <CtaLink item={section.primaryCta} className="inline-flex w-full cursor-pointer items-center justify-center gap-2 sm:w-auto">
                    {section.primaryCta.label}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </CtaLink>
                </RelliaAction>
              ) : null}
              {section.secondaryCta?.href ? (
                <RelliaAction
                  asChild
                  variant="heroGhostOnTeal"
                  size="comfortable"
                  className="w-full justify-center border-white/45 hover:border-white/70 sm:w-auto"
                >
                  <CtaLink item={section.secondaryCta} className="inline-flex w-full cursor-pointer items-center justify-center sm:w-auto" />
                </RelliaAction>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

const SectionRichText = ({ section }: { section: CmsSectionRichText }) => {
  return (
    <section className="w-full bg-white px-6 py-14 md:px-10 md:py-20">
      <div className="mx-auto w-full max-w-[900px]">
        {section.title?.trim() ? (
          <h2 className="font-host-grotesk text-3xl font-bold leading-tight tracking-tight text-black md:text-4xl">
            {section.title.trim()}
          </h2>
        ) : null}
        <PortableRichText value={section.body ?? null} className={cn(section.title?.trim() ? "mt-8" : "")} />
      </div>
    </section>
  )
}

const SectionCardsGrid = ({ section }: { section: CmsSectionCardsGrid }) => {
  const cards = section.cards ?? []
  if (cards.length === 0) return null

  return (
    <section className="w-full bg-white px-6 py-14 md:px-10 md:py-20">
      <div className="mx-auto w-full max-w-[1300px]">
        {section.title?.trim() ? (
          <h2 className="font-host-grotesk text-3xl font-bold leading-tight tracking-tight text-black md:text-4xl">
            {section.title.trim()}
          </h2>
        ) : null}
        {section.subtitle?.trim() ? (
          <p className={cn("mt-4 max-w-3xl font-urbanist text-base leading-relaxed text-black/65 md:text-lg", !section.title?.trim() && "mt-0")}>
            {section.subtitle.trim()}
          </p>
        ) : null}

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card._key ?? card.title}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-[box-shadow,transform] duration-300 hover:-translate-y-[1px] hover:shadow-md motion-reduce:transition-none"
            >
              {card.imageUrl ? (
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-rellia-cream/40">
                  <img
                    src={card.imageUrl}
                    alt={card.imageAlt?.trim() ?? ""}
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  {card.badge?.trim() ? (
                    <span className="rounded-full border border-rellia-teal/20 bg-rellia-mint/15 px-3 py-1 font-urbanist text-xs font-semibold text-rellia-teal">
                      {card.badge.trim()}
                    </span>
                  ) : null}
                  {(card.tags ?? []).filter(Boolean).slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 font-urbanist text-xs font-medium text-black/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <h3 className="mt-4 font-host-grotesk text-lg font-bold tracking-tight text-black">
                  {card.title}
                </h3>
                {card.body?.trim() ? (
                  <p className="mt-3 flex-1 font-urbanist text-sm leading-relaxed text-black/70 md:text-[15px]">
                    {card.body.trim()}
                  </p>
                ) : (
                  <div className="flex-1" />
                )}

                {card.cta?.href ? (
                  <div className="mt-6">
                    <RelliaAction asChild variant="mintTealFill" size="comfortable" className="w-fit">
                      <CtaLink item={card.cta} className="inline-flex cursor-pointer items-center gap-2">
                        {card.cta.label}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </CtaLink>
                    </RelliaAction>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const renderSection = (section: CmsPageSection) => {
  switch (section._type) {
    case "sectionHero":
      return <SectionHero section={section} />
    case "sectionRichText":
      return <SectionRichText section={section} />
    case "sectionCardsGrid":
      return <SectionCardsGrid section={section} />
    default:
      return null
  }
}

export const PageRenderer = ({ page }: { page: CmsPageContent }) => {
  const sections = page.sections ?? []
  return <SectionsRenderer sections={sections} />
}

export const SectionsRenderer = ({ sections }: { sections: CmsPageSection[] }) => {
  return <>{sections.map((s, idx) => <div key={s._key ?? `${s._type}-${idx}`}>{renderSection(s)}</div>)}</>
}

