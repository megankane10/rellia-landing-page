import { useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import PageHeader from "@/components/PageHeader"
import { PortableRichText } from "@/components/PortableRichText"
import RelliaAction from "@/components/RelliaAction"
import NetworkEyebrow from "@/components/network/NetworkEyebrow"
import PageBuilderMetricsSection from "@/components/cms/PageBuilderMetricsSection"
import MembershipPathTimeline from "@/components/MembershipPathTimeline"
import { BuilderCtaButton } from "@/components/cms/BuilderCtaButton"
import SectionHeading from "@/components/SectionHeading"
import ScrollReveal from "@/components/ScrollReveal"
import { relliaTealGlassCardClass } from "@/lib/relliaTealGlassCard"
import { cmsCleanText, cmsDisplayText } from "@/lib/cmsStega"
import {
  extractFilloutId,
  FILLOUT_APPLY_FORM_ID,
  FILLOUT_EMBED_VIEWPORT_MIN_CLASS,
  PROGRAM_FILLOUT_EMBED_MIN_CLASS,
} from "@/lib/filloutApplyForm"
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
  CmsSectionFaq,
  CmsSectionMarketingHero,
  CmsSectionMetrics,
  CmsSectionFormEmbed,
  CmsSectionRelliaCta,
  CmsSectionTestimonials,
  CmsCtaButton,
  NavItem,
  SanityPortableText,
} from "@shared/cms/types"
import { HeroHeadlinePortable } from "@/components/HeroHeadlinePortable"
import { resolveHeroTitlePortable } from "@shared/cms/resolveHeroHeadline"
import { normalizeToPortableText } from "@shared/cms/normalizePortableText"
import { RoleHero } from "@/pages/network/_shared"
import { Link } from "react-router-dom"
import { CmsLucideIcon } from "@/components/icons/CmsLucideIcon"
import { ArrowRight } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FilloutStandardEmbed } from "@fillout/react"
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta"
import ProgramTrustedMembersSection from "@/components/program/ProgramTrustedMembersSection"
import { SectionPortableText } from "@/components/cms/SectionPortableText"
import {
  defaultHeadingToneForBackground,
  resolveHeadingTone,
  sectionBackgroundClass,
} from "@/lib/cmsSectionAppearance"

const sectionHeadingClass =
  "font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-black md:text-[40px]"

const sectionSubheadingClass =
  "mt-4 max-w-3xl font-urbanist text-base leading-relaxed text-black/65 md:text-lg"

const isExternalHref = (href: string) => /^(https?:\/\/|mailto:|tel:)/i.test(href)

const normalizeInternalHref = (href: string) => {
  const trimmed = href.trim()
  if (!trimmed) return "/"
  if (isExternalHref(trimmed)) return trimmed
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

const ctaButtonToAction = (button?: CmsCtaButton | null) => {
  const label = cmsCleanText(button?.label)
  const href = cmsCleanText(button?.href)
  if (!label || !href) return undefined
  const action = ctaActionFromHref(label, href)
  if (button?.openInNewTab) action.external = true
  return action
}

const engageItemHref = (item: NonNullable<CmsSectionEngageBand["items"]>[number]) => {
  const fromLink = cmsCleanText(item?.link?.href)
  if (fromLink) return normalizeInternalHref(fromLink)
  const fromHref = cmsCleanText(item?.href)
  return fromHref ? normalizeInternalHref(fromHref) : "#"
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
  const href = normalizeInternalHref(cmsCleanText(item.href))
  const content = children ?? cmsDisplayText(item.label)

  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={cmsCleanText(item.label)}>
        {content}
      </a>
    )
  }

  return (
    <Link to={href} className={className} aria-label={cmsCleanText(item.label)}>
      {content}
    </Link>
  )
}

const SectionMarketingHero = ({ section }: { section: CmsSectionMarketingHero }) => {
  const headline =
    section.headlinePortable ??
    (section.title
      ? resolveHeroTitlePortable(
          { heroTitle: section.title, heroAccentPhrase: section.accentPhrase },
          normalizeToPortableText(section.title) ?? [],
        )
      : null)
  const title: ReactNode = headline?.length ? <HeroHeadlinePortable value={headline} /> : null

  const imageSrc =
    cmsCleanText(section.imageUrl) || "/images/network-hero.png"
  const primaryHref = section.primaryCta?.href ? normalizeInternalHref(cmsCleanText(section.primaryCta.href)) : "/"
  const secondaryHref = section.secondaryCta?.href
    ? normalizeInternalHref(cmsCleanText(section.secondaryCta.href))
    : undefined

  return (
    <RoleHero
      skipNavOffset
      eyebrowLabel={cmsDisplayText(section.eyebrowLabel) || undefined}
      title={title}
      subtitle={cmsDisplayText(section.subtitle)}
      imageSrc={imageSrc}
      primaryCta={{
        label: cmsDisplayText(section.primaryCta?.label) || "Learn more",
        to: primaryHref,
      }}
      secondaryCta={
        section.secondaryCta?.href
          ? {
              label: cmsDisplayText(section.secondaryCta.label) || "Contact",
              to: secondaryHref || "/contact",
            }
          : undefined
      }
    />
  )
}

const SectionMetrics = ({ section }: { section: CmsSectionMetrics }) => {
  const metrics =
    section.metrics?.map((m) => ({
      label: cmsDisplayText(m.label),
      value: m.value,
      suffix: cmsDisplayText(m.suffix),
    })) ?? []

  if (metrics.length === 0) return null

  const headingPortable =
    section.headlinePortable ??
    (section.heading
      ? normalizeToPortableText(section.heading)
      : null)

  return (
    <section className="w-full bg-white px-6 py-14 md:px-10 md:py-20">
      <div className="mx-auto w-full max-w-[1300px]">
        <PageBuilderMetricsSection
          heading={headingPortable?.length ? <HeroHeadlinePortable value={headingPortable} /> : null}
          subheading={cmsDisplayText(section.subheading) || undefined}
          metrics={metrics}
          showBadge={section.showBadge !== false}
          badgeLabel={cmsDisplayText(section.badgeLabel) || "Network impact"}
          imageUrl={cmsCleanText(section.imageUrl)}
          imageAlt={cmsCleanText(section.imageAlt)}
        />
      </div>
    </section>
  )
}

const SectionFormEmbed = ({ section }: { section: CmsSectionFormEmbed }) => {
  const formId =
    extractFilloutId(cmsCleanText(section.filloutFormUrl)) || FILLOUT_APPLY_FORM_ID
  const layout = section.layout ?? "standalone"
  const [showForm, setShowForm] = useState(false)

  if (layout === "split") {
    const benefits = (section.benefits ?? []).map((b) => cmsDisplayText(b)).filter(Boolean)
    const panelImage = cmsCleanText(section.panelImageUrl)
    const ctaLabel = cmsDisplayText(section.ctaLabel) || "Apply now"

    return (
      <section className={cn("w-full bg-white", showForm && "bg-rellia-cream/40")}>
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="form-intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="relative w-full overflow-hidden bg-rellia-teal py-16 md:py-24 lg:py-28">
                {panelImage ? (
                  <div className="pointer-events-none absolute inset-0" aria-hidden>
                    <img
                      src={panelImage}
                      alt=""
                      className="h-full w-full object-cover opacity-[0.32]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal/95 via-[#0f5c5c]/90 to-rellia-teal/85" />
                  </div>
                ) : (
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-rellia-teal via-[#0f5c5c] to-rellia-teal/85"
                    aria-hidden
                  />
                )}
                <div className="relative z-10 mx-auto w-full max-w-[1300px] px-6 md:px-10 lg:px-14">
                  {section.panelHeadline ? (
                    <h2 className="font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-rellia-mint md:text-[40px]">
                      {cmsDisplayText(section.panelHeadline)}
                    </h2>
                  ) : null}
                  {section.panelBody ? (
                    <p className="mt-5 max-w-2xl font-urbanist text-base leading-relaxed text-white/90 md:text-lg">
                      {cmsDisplayText(section.panelBody)}
                    </p>
                  ) : null}
                  {benefits.length > 0 ? (
                    <ul className="mt-8 flex flex-col gap-y-4 font-urbanist text-base text-white/95 md:text-lg">
                      {benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3">
                          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-rellia-mint" aria-hidden />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-10">
                    <RelliaAction
                      type="button"
                      variant="mintOnTealStrip"
                      size="comfortable"
                      className="w-full justify-center sm:w-auto sm:min-w-[220px]"
                      onClick={() => setShowForm(true)}
                      aria-label={ctaLabel}
                    >
                      {ctaLabel}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </RelliaAction>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form-embed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className={cn("w-full bg-rellia-cream/40 pt-12 pb-4", FILLOUT_EMBED_VIEWPORT_MIN_CLASS)}
            >
              <div className="mx-auto w-full max-w-[1300px] px-6 md:px-10">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="mb-8 font-host-grotesk text-sm font-semibold text-rellia-teal underline-offset-4 hover:underline"
                >
                  ← Back to details
                </button>
              </div>
              <div className={cn("w-full min-h-[700px] md:min-h-[1000px]", PROGRAM_FILLOUT_EMBED_MIN_CLASS)}>
                <FilloutStandardEmbed filloutId={formId} dynamicResize />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    )
  }

  return (
    <section className={cn("w-full bg-rellia-cream/40", FILLOUT_EMBED_VIEWPORT_MIN_CLASS)}>
      <div className={cn("w-full min-h-[700px] md:min-h-[1000px]", PROGRAM_FILLOUT_EMBED_MIN_CLASS)}>
        <FilloutStandardEmbed filloutId={formId} dynamicResize />
      </div>
    </section>
  )
}

const SectionHero = ({ section }: { section: CmsSectionHero }) => {
  const headlinePt = normalizeToPortableText(section.headline as unknown)
  const subPt = normalizeToPortableText(section.subheadline as unknown)

  const title = headlinePt ? (
    <PortableRichText value={headlinePt} className="prose-h1:text-white prose-p:text-white/80" />
  ) : null
  const subtitle = subPt ? (
    <PortableRichText value={subPt} className="prose-p:text-white/80" />
  ) : undefined

  return (
    <section className="w-full bg-rellia-teal lg:pt-[96px]">
      <div className="relative min-h-[320px] md:min-h-[380px]">
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
          className="relative z-10 bg-transparent"
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
          <h2 className={sectionHeadingClass}>
            {section.title.trim()}
          </h2>
        ) : null}
        {section.tag?.trim() ? (
          <p className={cn(sectionSubheadingClass, section.title?.trim() ? "" : "mt-0")}>{section.tag.trim()}</p>
        ) : null}
        <PortableRichText value={section.body ?? null} className={cn(section.title?.trim() || section.tag?.trim() ? "mt-8" : "")} />
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
          <h2 className={sectionHeadingClass}>
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

                <div className="mt-4 flex items-start gap-3">
                  {card.iconKey?.trim() ? (
                    <CmsLucideIcon
                      name={card.iconKey.trim()}
                      className="mt-0.5 h-6 w-6 shrink-0 text-rellia-teal"
                    />
                  ) : null}
                  <h3 className="font-host-grotesk text-lg font-bold tracking-tight text-black">
                    {card.title}
                  </h3>
                </div>
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
  const bentoFallbackImage =
    "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200"

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
              <img
                src={item.imageUrl || bentoFallbackImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/25 to-transparent" />
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
  const background = section.background ?? "white"
  const headingTone = resolveHeadingTone(section.headingTone, defaultHeadingToneForBackground(background))
  const showBadge = section.showBadge !== false && Boolean(section.badge?.trim())

  return (
    <section className={cn("w-full px-6 py-16 md:px-10 md:py-24", sectionBackgroundClass(background))}>
      <div className="mx-auto max-w-[1300px]">
        {showBadge ? (
          <NetworkEyebrow label={section.badge!} tone={headingTone === "light" ? "onDark" : "onLight"} />
        ) : null}
        <div className={cn(showBadge && "mt-5")}>
          <SectionPortableText value={section.title} variant="heading" tone={headingTone} />
          {section.subtitle ? (
            <SectionPortableText
              value={section.subtitle}
              variant="subheading"
              tone={headingTone}
              className="mt-4"
            />
          ) : null}
        </div>
        <div className="mt-16 grid grid-cols-1 items-start gap-10 sm:grid-cols-2 md:mt-20 md:gap-x-12 md:gap-y-14 lg:mt-24 lg:gap-x-16 lg:gap-y-16">
          {items.map((item, idx) => (
            <ScrollReveal key={item._key ?? idx} delay={0.05 * idx}>
              <div className="flex w-full flex-col items-start text-left">
                <CmsLucideIcon
                  name={item.icon}
                  className={cn(
                    "h-9 w-9 shrink-0",
                    headingTone === "light" ? "text-rellia-mint" : "text-rellia-teal",
                  )}
                />
                <h3
                  className={cn(
                    "mt-5 font-host-grotesk text-xl font-semibold md:text-2xl",
                    headingTone === "light" ? "text-white" : "text-rellia-teal",
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    "mt-3 max-w-xl font-urbanist text-base leading-relaxed md:text-lg",
                    headingTone === "light" ? "text-white/80" : "text-black/75",
                  )}
                >
                  {item.body}
                </p>
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
  const headingTone = resolveHeadingTone(section.headingTone, "light")
  const showBadge = section.showBadge !== false && Boolean(section.badge?.trim())

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
            {showBadge ? <NetworkEyebrow label={section.badge!} tone="onDark" /> : null}
            <div className={cn(showBadge && "mt-5")}>
              <SectionPortableText value={section.title} variant="heading" tone={headingTone} />
              {section.subtitle ? (
                <SectionPortableText
                  value={section.subtitle}
                  variant="subheading"
                  tone={headingTone}
                  className="mt-4 max-w-2xl"
                />
              ) : null}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <div className="mt-16 grid grid-cols-1 gap-7 md:mt-20 md:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-6">
            {items.map((item, idx) => (
              <Link
                key={item._key ?? idx}
                to={engageItemHref(item)}
                className="group flex h-full min-h-[168px] flex-col rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md transition duration-300 hover:border-rellia-mint/40 hover:bg-white/10 cursor-pointer focus-visible:outline-none sm:min-h-[184px] sm:p-6"
              >
                {item.icon ? (
                  <CmsLucideIcon
                    name={item.icon}
                    className="h-7 w-7 text-rellia-mint transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10"
                    aria-hidden
                  />
                )}
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
  const steps =
    section.steps?.map((step) => ({
      title: cmsDisplayText(step.title),
      description: cmsDisplayText(step.description),
    })) ?? []

  if (steps.length === 0) return null

  const roleLinks =
    section.roleLinks?.map((link) => ({
      title: cmsDisplayText(link.title),
      description: cmsDisplayText(link.description),
      href: normalizeInternalHref(cmsCleanText(link.href)),
    })) ?? []

  const headingTitle = cmsDisplayText(section.headingTitle) || undefined
  const subheading = cmsDisplayText(section.subheading) || undefined

  return (
    <MembershipPathTimeline
      className="bg-rellia-cream/20"
      badge={section.badge?.trim() || undefined}
      headingTitle={headingTitle}
      subheading={subheading}
      steps={steps}
      showRoleLinks={section.showRoleLinks !== false}
      roleLinks={roleLinks}
      belowTimeline={
        section.cta?.label ? (
          <div className="flex justify-start">
            <BuilderCtaButton cta={section.cta} className="w-full justify-center sm:w-auto" />
          </div>
        ) : undefined
      }
    />
  )
}

const SectionDiagnosticSurvey = ({ section }: { section: CmsSectionDiagnosticSurvey }) => {
  const layout = section.layout ?? "categories"
  const categoryIconName = cmsCleanText(section.categoryIcon) || "CalendarDays"
  const imageSrc = cmsCleanText(section.imageUrl)
  const isImageSplit = layout === "imageSplit" && Boolean(imageSrc)

  const primaryCta = section.primaryCta?.href
    ? section.primaryCta
    : section.cta?.label
      ? { label: section.cta.label, href: section.cta.href ?? section.ctaHref ?? "/" }
      : section.ctaLabel
        ? { label: section.ctaLabel, href: section.ctaHref ?? "/" }
        : undefined

  return (
    <section
      className={cn(
        "w-full border-t border-black/10 bg-rellia-cream/20 px-6 md:px-10",
        isImageSplit ? "py-0" : "flex min-h-[80vh] items-center py-28 md:py-40",
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1300px]",
          isImageSplit
            ? "grid min-h-[70vh] grid-cols-1 lg:grid-cols-2"
            : "grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24",
        )}
      >
        <div
          className={cn(
            "flex flex-col items-start",
            isImageSplit ? "justify-center py-16 lg:py-24 lg:pr-16" : "lg:sticky lg:top-32",
          )}
        >
          <ScrollReveal>
            {section.badge ? <NetworkEyebrow label={section.badge} tone="onLight" /> : null}
            <div className={cn("mb-6", section.badge ? "mt-5" : "mt-0")}>
              <SectionPortableText value={section.title} variant="heading" tone="dark" />
            </div>
            {section.subtitle ? (
              <SectionPortableText
                value={section.subtitle}
                variant="subheading"
                tone="dark"
                className="mb-10 max-w-xl"
              />
            ) : null}
            {(primaryCta?.href || section.secondaryCta?.href) ? (
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
                {primaryCta?.href ? (
                  <RelliaAction asChild variant="mintTealFill" size="comfortable" className="w-full justify-center sm:w-auto">
                    <CtaLink item={primaryCta} className="inline-flex w-full cursor-pointer items-center justify-center gap-2 sm:w-auto">
                      {primaryCta.label}
                      <ArrowRight className="h-5 w-5" aria-hidden />
                    </CtaLink>
                  </RelliaAction>
                ) : null}
                {section.secondaryCta?.href ? (
                  <RelliaAction
                    asChild
                    variant="outlineOnWhite"
                    size="comfortable"
                    className="w-full justify-center sm:w-auto"
                  >
                    <CtaLink item={section.secondaryCta} className="inline-flex w-full cursor-pointer items-center justify-center gap-2 sm:w-auto" />
                  </RelliaAction>
                ) : null}
              </div>
            ) : null}
          </ScrollReveal>
        </div>

        {isImageSplit ? (
          <div className="relative min-h-[320px] lg:min-h-full">
            <img
              src={imageSrc}
              alt={cmsCleanText(section.imageAlt)}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          <div className="pt-2 lg:pt-4">
            <ScrollReveal delay={0.1}>
              <h3 className="mb-8 border-b border-black/10 pb-4 font-host-grotesk text-2xl font-bold text-black">
                {section.categoriesTitle}
              </h3>
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
                {(section.categories ?? []).map((cat, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="mt-0.5 h-6 w-6 shrink-0 text-rellia-teal">
                      <CmsLucideIcon name={categoryIconName} className="h-full w-full" />
                    </span>
                    <span className="font-host-grotesk text-lg font-semibold leading-snug text-black/90">{cat}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        )}
      </div>
    </section>
  )
}

const SectionTestimonials = ({ section }: { section: CmsSectionTestimonials }) => {
  const testimonials = section.testimonials ?? []
  if (testimonials.length === 0) return null
  return (
    <section className="w-full bg-white">
      <ProgramTrustedMembersSection
        title={cmsCleanText(section.heading) || "Already trusted by Rellia members"}
        testimonials={testimonials}
      />
    </section>
  )
}

const SectionRelliaCtaBlock = ({ section }: { section: CmsSectionRelliaCta }) => {
  const primary = ctaButtonToAction(section.primaryCta)
  if (!primary) return null

  return (
    <RelliaCta
        title={cmsDisplayText(section.title)}
        body={cmsDisplayText(section.body) || undefined}
        primary={primary}
        secondary={ctaButtonToAction(section.secondaryCta)}
        size={section.size ?? "default"}
        primaryStyle={section.primaryStyle ?? "button"}
        aboveSectionTone={
          section.aboveSectionTone === "grey"
            ? "grey"
            : section.aboveSectionTone === "white"
              ? "white"
              : undefined
        }
        roundedClassName="rounded-none"
      />
  )
}

const SectionFaq = ({ section }: { section: CmsSectionFaq }) => {
  const items = (section.items ?? []).filter((item) => item.question?.trim() && item.answer?.trim())
  if (items.length === 0) return null

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[900px] px-6 md:px-10">
        <ScrollReveal>
          {section.title?.trim() ? (
            <h2 className={cn(sectionHeadingClass, "mb-4 md:mb-5")}>
              {cmsDisplayText(section.title)}
            </h2>
          ) : null}
          {section.subtitle?.trim() ? (
            <p className="mb-10 max-w-2xl text-left font-urbanist text-lg leading-relaxed text-black/65 md:text-xl">
              {cmsDisplayText(section.subtitle)}
            </p>
          ) : null}
          <div className="rounded-3xl border border-black/10 bg-white px-7 py-0 shadow-sm">
            <Accordion type="single" collapsible>
              {items.map((item, index) => (
                <AccordionItem
                  key={item._key ?? `${item.question}-${index}`}
                  value={item._key ?? `faq-${index}`}
                  className={index === items.length - 1 ? "-mx-7 border-b-0 px-7" : "-mx-7 border-b border-black/10 px-7"}
                >
                  <AccordionTrigger className="min-h-[64px] py-4 text-left text-base font-medium text-black md:min-h-[72px] md:py-5 md:text-lg">
                    {cmsDisplayText(item.question)}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 font-urbanist text-base leading-relaxed text-black/70 whitespace-pre-line md:text-lg">
                    {cmsDisplayText(item.answer)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

const renderSection = (section: CmsPageSection) => {
  switch (section._type) {
    case "sectionMarketingHero":
      return <SectionMarketingHero section={section} />
    case "sectionMetrics":
      return <SectionMetrics section={section} />
    case "sectionFormEmbed":
      return <SectionFormEmbed section={section} />
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
    case "sectionFaq":
      return <SectionFaq section={section} />
    case "sectionRelliaCta":
      return <SectionRelliaCtaBlock section={section} />
    case "sectionTestimonials":
      return <SectionTestimonials section={section} />
    default:
      return null
  }
}

export const PageRenderer = ({
  page,
  renderAfterFirstHero,
}: {
  page: CmsPageContent
  renderAfterFirstHero?: ReactNode
}) => {
  const sections = page.sections ?? []
  return <SectionsRenderer sections={sections} renderAfterFirstHero={renderAfterFirstHero} />
}

export default PageRenderer

export const SectionsRenderer = ({
  sections,
  renderAfterFirstHero,
}: {
  sections: CmsPageSection[]
  renderAfterFirstHero?: ReactNode
}) => {
  let heroSeen = false

  return (
    <>
      {sections.map((s, idx) => {
        const key = s._key ?? `${s._type}-${idx}`
        const insertAfterHero =
          !heroSeen && isHeroSection(s) && renderAfterFirstHero ? (
            <>
              {renderAfterFirstHero}
            </>
          ) : null

        if (!heroSeen && isHeroSection(s)) {
          heroSeen = true
        }

        return (
          <div key={key}>
            {renderSection(s)}
            {insertAfterHero}
          </div>
        )
      })}
    </>
  )
}

const isHeroSection = (section: CmsPageSection) =>
  section._type === "sectionHero" || section._type === "sectionMarketingHero"
