import type { ReactNode } from "react"
import PageHeader from "@/components/PageHeader"
import { PortableRichText } from "@/components/PortableRichText"
import RelliaAction from "@/components/RelliaAction"
import NetworkEyebrow from "@/components/network/NetworkEyebrow"
import SectionHeading from "@/components/SectionHeading"
import ScrollReveal from "@/components/ScrollReveal"
import { relliaTealGlassCardClass } from "@/lib/relliaTealGlassCard"
import { cn } from "@/lib/utils"
import type {
  CmsPageContent,
  CmsPageSection,
  CmsSectionCardsGrid,
  CmsSectionHero,
  CmsSectionRichText,
  CmsSectionEligibilityBento,
  CmsSectionFeatureGrid,
  CmsSectionEngageBand,
  CmsSectionJourneyTimeline,
  CmsSectionDiagnosticSurvey,
  NavItem,
  SanityPortableText,
} from "@shared/cms/types"
import { Link } from "react-router-dom"
import * as LucideIcons from "lucide-react"
import { ArrowRight, CalendarDays } from "lucide-react"

const isExternalHref = (href: string) => /^(https?:\/\/|mailto:|tel:)/i.test(href)

const normalizeInternalHref = (href: string) => {
  const trimmed = href.trim()
  if (!trimmed) return "/"
  if (isExternalHref(trimmed)) return trimmed
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

const LucideIcon = ({ name, className }: { name?: string; className?: string }) => {
  if (!name) return null
  const Icon = (LucideIcons as any)[name]
  if (!Icon) return null
  return <Icon className={className} aria-hidden />
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
  const title = <PortableRichText value={section.headline as any} className="prose-h1:text-white prose-p:text-white/80" />
  const subtitle = section.subheadline ? (
    <PortableRichText value={section.subheadline as any} className="prose-p:text-white/80" />
  ) : undefined

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

const SectionEligibilityBento = ({ section }: { section: CmsSectionEligibilityBento }) => {
  const items = section.items ?? []
  return (
    <section className="w-full bg-rellia-cream/25 px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1300px]">
        {section.badge && <NetworkEyebrow label={section.badge} tone="onLight" />}
        <SectionHeading
          animated={false}
          title={section.title ?? ""}
          description={section.description}
          className="mt-5 max-w-full [&>p]:max-w-full [&>p]:text-left [&>p]:leading-relaxed"
        />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {items.map((item, idx) => (
            <article
              key={item._key ?? idx}
              className="group relative flex h-[320px] md:h-[400px] flex-col overflow-hidden rounded-[22px] border border-black/10 shadow-[0_24px_60px_-42px_rgba(13,53,64,0.5)]"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                />
              )}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/5 to-transparent" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
              <div className="relative z-10 flex h-full min-h-0 w-full flex-1 flex-col justify-end p-6 text-left md:p-8">
                <p className="self-start font-host-grotesk font-medium text-2xl md:text-[1.75rem] leading-[1.2] tracking-tight text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.5)] max-w-[240px]">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const SectionFeatureGrid = ({ section }: { section: CmsSectionFeatureGrid }) => {
  const items = section.items ?? []
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1300px]">
        {section.badge && <NetworkEyebrow label={section.badge} tone="onLight" />}
        <div className="mt-5">
           <PortableRichText value={section.title as any} className="prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:text-black" />
           {section.subtitle && <PortableRichText value={section.subtitle as any} className="mt-4 prose-p:text-black/65" />}
        </div>
        <div className="mt-16 grid grid-cols-1 items-start gap-10 sm:grid-cols-2 md:mt-20 md:gap-x-12 md:gap-y-14 lg:mt-24 lg:gap-x-16 lg:gap-y-16">
          {items.map((item, idx) => (
            <ScrollReveal key={item._key ?? idx} delay={0.05 * idx}>
              <div className="flex w-full flex-col items-start text-left">
                <LucideIcon name={item.icon} className="h-9 w-9 shrink-0 text-rellia-teal" />
                <h3 className="mt-5 font-host-grotesk text-xl font-semibold text-rellia-teal md:text-2xl">{item.title}</h3>
                <p className="mt-3 max-w-xl font-urbanist text-base leading-relaxed text-black/75 md:text-lg">{item.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const SectionEngageBand = ({ section }: { section: CmsSectionEngageBand }) => {
  const items = section.items ?? []
  return (
    <section className="relative w-full overflow-hidden bg-rellia-teal px-6 py-16 md:px-10 md:py-24">
      <img
        src="/images/hologram-logo.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-16 top-6 w-[320px] max-w-[55vw] opacity-[0.06] md:right-0 md:top-4 md:w-[420px]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-10 h-[420px] w-[420px] rounded-full bg-rellia-mint/22 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[480px] w-[480px] rounded-full bg-rellia-mint/16 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.2] [background-image:radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.14),transparent_52%),radial-gradient(circle_at_75%_40%,rgba(157,214,208,0.12),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1300px]">
        <ScrollReveal>
          <div className="mb-8 md:mb-10">
            {section.badge && <NetworkEyebrow label={section.badge} tone="onDark" />}
            <div className="mt-5 prose-h2:text-3xl prose-h2:md:text-[40px] prose-h2:font-semibold prose-h2:tracking-tight prose-h2:text-white">
                <PortableRichText value={section.title as any} />
            </div>
            {section.subtitle && (
              <div className="mt-4 max-w-2xl prose-p:text-base prose-p:md:text-lg prose-p:font-medium prose-p:text-white/80">
                <PortableRichText value={section.subtitle as any} />
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <div className="mt-16 grid grid-cols-1 gap-7 md:mt-20 md:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-6">
            {items.map((item, idx) => (
              <Link
                key={item._key ?? idx}
                to={item.href || "#"}
                className="group flex h-full min-h-[168px] flex-col rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md transition duration-300 hover:border-rellia-mint/40 hover:bg-white/10 cursor-pointer focus-visible:outline-none sm:min-h-[184px] sm:p-6"
              >
                <LucideIcon name={item.icon} className="h-7 w-7 text-rellia-mint transition-transform duration-300 group-hover:scale-105" />
                <p className="mt-5 font-host-grotesk text-lg font-semibold leading-snug tracking-tight text-white">
                  {item.title}
                </p>
                <p className="mt-3 flex-1 font-urbanist text-sm leading-relaxed text-white/80">{item.body}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-urbanist text-sm font-semibold text-rellia-mint">
                  Continue
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

const SectionJourneyTimeline = ({ section }: { section: CmsSectionJourneyTimeline }) => {
  return (
    <section className="bg-rellia-cream/20 py-14 md:py-20 px-6 md:px-10">
      <div className="mx-auto max-w-[1300px]">
        {section.badge && <NetworkEyebrow label={section.badge} tone="onLight" />}
        <div className="mt-5">
           <PortableRichText value={section.title as any} className="prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:text-black" />
           {section.description && <PortableRichText value={section.description as any} className="mt-4 prose-p:text-black/65" />}
        </div>

        <div className="mt-16 space-y-12 md:mt-20 md:space-y-16">
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[200px_1fr] lg:gap-12">
            <div>
              <p className="font-host-grotesk text-base font-semibold uppercase tracking-[0.14em] text-black/55">
                {section.leftColumnTitle}
              </p>
              <p className="mt-3 font-urbanist text-base leading-relaxed text-black/70">
                {section.leftColumnBody}
              </p>
            </div>

            <div className="grid grid-cols-1 justify-items-start gap-10 sm:grid-cols-2 sm:justify-items-end sm:gap-6 xl:grid-cols-3">
              {(section.leftColumnSteps ?? []).map((m) => (
                <div key={m.id} className="flex flex-col items-start text-left md:w-full md:max-w-[280px]">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rellia-teal/5 text-rellia-teal">
                    <LucideIcon name={m.icon} className="h-5 w-5" />
                  </span>
                  <p className="mt-3 font-host-grotesk text-lg font-semibold leading-snug text-black md:mt-3">
                    {m.label}
                  </p>
                  <p className="mt-1.5 font-urbanist text-sm leading-relaxed text-black/65">
                    {m.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-black/10" aria-hidden />

          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[200px_1fr] lg:gap-12">
            <div>
              <p className="font-host-grotesk text-base font-semibold uppercase tracking-[0.14em] text-rellia-teal/80">
                {section.rightColumnTitle}
              </p>
              <p className="mt-3 font-urbanist text-base leading-relaxed text-black/70">
                {section.rightColumnBody}
              </p>
            </div>

            <div className="grid grid-cols-1 justify-items-start gap-10 sm:grid-cols-2 sm:justify-items-end sm:gap-6 xl:grid-cols-3">
              {(section.rightColumnSteps ?? []).map((m) => (
                <div key={m.id} className="flex flex-col items-start text-left md:w-full md:max-w-[280px]">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rellia-teal text-white">
                    <LucideIcon name={m.icon} className="h-5 w-5" />
                  </span>
                  <p className="mt-3 font-host-grotesk text-lg font-semibold leading-snug text-rellia-teal md:mt-3">
                    {m.label}
                  </p>
                  <p className="mt-1.5 font-urbanist text-sm leading-relaxed text-rellia-teal/80">
                    {m.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const SectionDiagnosticSurvey = ({ section }: { section: CmsSectionDiagnosticSurvey }) => {
  return (
    <section className="w-full bg-rellia-cream/20 px-6 py-28 md:px-10 md:py-40 border-t border-black/10 flex items-center min-h-[80vh]">
      <div className="mx-auto w-full max-w-[1300px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="flex flex-col items-start lg:sticky lg:top-32">
            <ScrollReveal>
              {section.badge && <NetworkEyebrow label={section.badge} tone="onLight" />}
              <div className="mt-4 mb-6 prose-h2:text-3xl prose-h2:md:text-[44px] prose-h2:font-bold prose-h2:tracking-tight prose-h2:text-black prose-h2:leading-tight">
                <PortableRichText value={section.title as any} />
              </div>
              {section.subtitle && (
                <div className="mb-10 max-w-xl prose-p:text-lg prose-p:md:text-xl prose-p:leading-relaxed prose-p:text-black/70">
                    <PortableRichText value={section.subtitle as any} />
                </div>
              )}
              <RelliaAction asChild variant="mintTealFill" size="comfortable" className="w-full sm:w-auto justify-center">
                <Link to={section.ctaHref || "#"} className="inline-flex cursor-pointer items-center gap-2">
                  {section.ctaLabel || "Take Survey"}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </RelliaAction>
            </ScrollReveal>
          </div>
          
          <div className="pt-2 lg:pt-4">
            <ScrollReveal delay={0.1}>
              <h3 className="font-host-grotesk text-2xl font-bold text-black mb-8 border-b border-black/10 pb-4">{section.categoriesTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                {(section.categories ?? []).map((cat, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="w-6 h-6 text-rellia-teal shrink-0 mt-0.5"><CalendarDays className="w-full h-full" /></span>
                    <span className="font-host-grotesk font-semibold text-black/90 text-lg leading-snug">{cat}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
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
    case "sectionEligibilityBento":
      return <SectionEligibilityBento section={section} />
    case "sectionFeatureGrid":
      return <SectionFeatureGrid section={section} />
    case "sectionEngageBand":
      return <SectionEngageBand section={section} />
    case "sectionJourneyTimeline":
      return <SectionJourneyTimeline section={section} />
    case "sectionDiagnosticSurvey":
      return <SectionDiagnosticSurvey section={section} />
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
