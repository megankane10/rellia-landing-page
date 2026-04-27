import { useState, type KeyboardEvent } from "react"
import { Link } from "react-router-dom"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Navbar from "@/components/Navbar"
import { ScrollUpPinnedNav } from "@/components/ScrollUpPinnedNav"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta"
import { CheckCircle2, ArrowRight, ChevronRight } from "lucide-react"
import RelliaAction from "@/components/RelliaAction"
import type { QmsProgramContent } from "@shared/cms/types"
import type { ProgramPageStaticBlocks } from "@shared/cms/programs/types"

/**
 * Shared layout for **program detail** pages under `/programs/…` (not the `/programs` hub).
 * Each program supplies CMS copy (`paymentUrl` = Stripe Payment Link) and route-specific static blocks.
 * Add new programs by new routes + Sanity types; consider generalizing `QmsProgramContent` when shapes align.
 */
export type ProgramPageLayoutProps = {
  cms: QmsProgramContent
  heroImageSrc: string
  heroImageAlt: string
  /** Anchor id for the "Learn more" in-hero control */
  outcomesSectionId: string
  /** Anchor id for the pricing/payment card section */
  paymentSectionId?: string
  staticBlocks: ProgramPageStaticBlocks
  /** Last segment of the breadcrumb (defaults to hero title) */
  breadcrumbCurrentLabel?: string
}

const ProgramPageLayout = ({
  cms: q,
  heroImageSrc,
  heroImageAlt,
  outcomesSectionId,
  paymentSectionId = "program-payment",
  breadcrumbCurrentLabel,
  staticBlocks: { howItWorksCards, pillars, timeline },
}: ProgramPageLayoutProps) => {
  const crumbCurrent = breadcrumbCurrentLabel ?? q.heroTitle
  const [timelineOpen, setTimelineOpen] = useState<string | undefined>(undefined)

  const handleLearnMoreClick = () => {
    document.getElementById(outcomesSectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  const handleGetStartedClick = () => {
    document.getElementById(paymentSectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  const handleGetStartedKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleGetStartedClick()
    }
  }

  const handleLearnMoreKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleLearnMoreClick()
    }
  }

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <ScrollUpPinnedNav ariaLabel="Breadcrumb">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-3.5 md:py-4">
          <ol className="flex flex-wrap items-center gap-2 text-sm md:text-[15px] font-urbanist">
            <li>
              <Link
                to="/programs"
                className="font-semibold text-rellia-teal transition-colors hover:text-rellia-teal/85 hover:underline underline-offset-4"
              >
                Programs &amp; Events
              </Link>
            </li>
            <li className="flex items-center text-black/30" aria-hidden>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </li>
            <li className="text-black/55 font-medium max-w-[min(100%,42rem)] truncate" title={crumbCurrent}>
              {crumbCurrent}
            </li>
          </ol>
        </div>
      </ScrollUpPinnedNav>

      <main id="main-content" className="pt-[128px] md:pt-[146px]">

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <div className="flex flex-col lg:flex-row lg:items-center gap-16">
                <div className="flex-1 max-w-lg lg:max-w-xl order-1 lg:order-1">
                  <img src={heroImageSrc} alt={heroImageAlt} className="w-full rounded-3xl shadow-2xl" />
                </div>

                <div className="flex-1 order-2 lg:order-2">
                  <h2 className="font-host-grotesk font-bold text-black text-4xl md:text-5xl tracking-tight mb-6">
                    {q.heroTitle}
                  </h2>
                  <p className="font-urbanist text-black/70 text-lg md:text-xl leading-relaxed max-w-xl">
                    {q.heroDescription}
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
                  <RelliaAction
                    type="button"
                    variant="mintTealFill"
                    onClick={handleGetStartedClick}
                    onKeyDown={handleGetStartedKeyDown}
                    aria-label="Get started — scroll to pricing and enrollment"
                  >
                    {q.heroCtaLabel}
                    <ArrowRight className="ml-2" />
                  </RelliaAction>
                    <RelliaAction
                      type="button"
                      variant="outlineOnWhite"
                      onClick={handleLearnMoreClick}
                      onKeyDown={handleLearnMoreKeyDown}
                      aria-label="Learn more about the program — scroll to Program Outcomes"
                    >
                      Learn More
                    </RelliaAction>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section
          id={outcomesSectionId}
          className="scroll-mt-24 md:scroll-mt-[5.5rem] py-16 md:py-24 bg-rellia-teal/5"
        >
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal className="mb-12 text-center">
              <h3 className="font-host-grotesk font-semibold text-black text-3xl md:text-[40px] leading-tight tracking-tight">
                {q.outcomesTitle}
              </h3>
            </ScrollReveal>
            <div className="py-2">
              <ScrollReveal>
                <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
                  <p className="font-urbanist text-black/60 text-base md:text-lg leading-relaxed text-center">
                    {q.outcomesIntro}
                  </p>

                  <ul className="max-w-2xl w-full mx-auto flex flex-col gap-4">
                    {q.outcomes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-rellia-teal shrink-0 mt-0.5" />
                        <span className="font-urbanist text-black/75 text-base md:text-lg leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal className="mb-12 text-center">
              <h3 className="font-host-grotesk font-semibold text-black text-3xl md:text-[40px] leading-tight tracking-tight">
                {q.howItWorksTitle}
              </h3>
            </ScrollReveal>
            <div className="mb-8">
              <p className="font-urbanist text-black/60 text-base md:text-lg leading-relaxed text-center max-w-3xl mx-auto">
                {q.howItWorksIntro}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorksCards.map((card, i) => {
                const Icon = card.icon
                return (
                  <ScrollReveal key={card.title} delay={i * 0.1}>
                    <div className="bg-white rounded-3xl border border-black/5 p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                      <div className="w-12 h-12 rounded-2xl bg-rellia-mint/20 flex items-center justify-center mb-5">
                        <Icon className="w-6 h-6 text-rellia-teal" />
                      </div>
                      <h4 className="font-host-grotesk font-bold text-black text-xl mb-3">{card.title}</h4>
                      <p className="font-urbanist text-black/65 text-base leading-relaxed">{card.description}</p>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-rellia-teal/5">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal className="mb-12 text-center">
              <h3 className="font-host-grotesk font-semibold text-black text-3xl md:text-[40px] leading-tight tracking-tight">
                {q.pillarsTitle}
              </h3>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {pillars.map((pillar, i) => {
                const Icon = pillar.icon
                return (
                  <ScrollReveal key={pillar.title} delay={i * 0.1}>
                    <div className="bg-white rounded-3xl border border-black/5 p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                      <div className="w-12 h-12 rounded-2xl bg-rellia-mint/20 flex items-center justify-center mb-5">
                        <Icon className="w-6 h-6 text-rellia-teal" />
                      </div>
                      <h4 className="font-host-grotesk font-bold text-black text-lg mb-3">{pillar.title}</h4>
                      <p className="font-urbanist text-black/65 text-sm leading-relaxed">{pillar.description}</p>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-[900px] mx-auto px-6 md:px-10">
            <ScrollReveal className="mb-12 text-center">
              <h3 className="font-host-grotesk font-semibold text-black text-3xl md:text-[40px] leading-tight tracking-tight">
                {q.timelineTitle}
              </h3>
              <p className="font-urbanist text-black/60 text-base md:text-lg mt-4 max-w-xl mx-auto">
                {q.timelineSubtitle}
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <Accordion
                type="single"
                collapsible
                value={timelineOpen}
                onValueChange={setTimelineOpen}
                className="flex flex-col gap-4"
              >
                {timeline.map((month) => (
                  <AccordionItem
                    key={month.month}
                    value={month.month}
                    className="border border-black/8 rounded-2xl overflow-hidden bg-rellia-teal/5 px-6"
                  >
                    <AccordionTrigger className="font-host-grotesk font-semibold text-black text-lg md:text-xl py-5 hover:no-underline">
                      {month.month}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <ul className="flex flex-col gap-2 pl-1">
                        {month.weeks.map((weekLine) => (
                          <li key={weekLine} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-rellia-mint shrink-0 mt-0.5" />
                            <span className="font-urbanist text-black/70 text-sm leading-relaxed">{weekLine}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollReveal>
          </div>
        </section>

        <section id={paymentSectionId} className="py-16 md:py-24 bg-rellia-teal/5">
          <div className="max-w-[620px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <div className="bg-white rounded-3xl border border-black/5 shadow-lg p-8 md:p-10 text-center">
                <span className="inline-flex items-center rounded-full border border-rellia-teal/20 bg-rellia-teal/5 px-4 py-1 text-xs md:text-sm font-urbanist text-rellia-teal mb-6">
                  {q.pricingBadge}
                </span>

                <div className="mt-6 mb-4">
                  <div className="flex items-start justify-center">
                    <span className="text-5xl md:text-6xl font-bold text-rellia-teal tracking-tight leading-none">
                      {q.pricingAmount}
                    </span>
                    <span className="text-3xl md:text-4xl font-bold text-rellia-teal tracking-tight leading-none">
                      {q.pricingSubAmount}
                    </span>
                  </div>
                </div>

                <p className="font-urbanist text-black/60 text-base md:text-lg leading-relaxed max-w-md mx-auto mb-8">
                  {q.pricingDescription}
                </p>

                <div className="h-px bg-black/10 w-full mb-6" />

                <ul className="mt-4 flex flex-col gap-3 list-none font-urbanist text-black/60 text-base md:text-lg leading-relaxed text-left w-full items-start">
                  {q.pricingBullets.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-rellia-teal shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <RelliaAction asChild variant="mintCardTealFill" className="mt-8 w-full">
                  <a href={q.paymentUrl} target="_blank" rel="noopener noreferrer">
                    Start Now
                    <ArrowRight className="ml-2" />
                  </a>
                </RelliaAction>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <RelliaCta
          title={q.bottomCtaTitle}
          body={q.bottomCtaBody}
          primary={ctaActionFromHref(q.bottomCtaButtonLabel, q.bottomContactHref)}
        />
      </main>

      <Footer />
    </div>
  )
}

export default ProgramPageLayout
