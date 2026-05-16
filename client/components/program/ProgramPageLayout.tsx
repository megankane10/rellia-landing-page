import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FilloutStandardEmbed } from "@fillout/react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Quote,
} from "lucide-react";
import { getCurrentMonthDeadline } from "@/lib/dateUtils";
import RelliaAction from "@/components/RelliaAction";
import { Helmet } from "react-helmet-async";
import { getSiteUrl } from "@/config/seo";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SectionsRenderer } from "@/components/cms/PageRenderer"
import { useProgramBySlug, useProgramPageBySlug } from "@/hooks/useCmsDocuments"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { PEXELS_HEALTH_MEETING, PEXELS_OFFICE_COLLABORATION, LOCAL_METRICS_BG_JPEG } from "@/config/pexelsFallbacks"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { QmsProgramContent } from "@shared/cms/types";
import type { ProgramPageStaticBlocks } from "@shared/cms/programs/types";
import ProgramTrustedMembersSection from "@/components/program/ProgramTrustedMembersSection"

export type ProgramPageLayoutProps = {
  cms: QmsProgramContent;
  cmsSlug?: string;
  heroImageSrc?: string;
  heroImageAlt?: string;
  outcomesSectionId: string;
  paymentSectionId?: string;
  staticBlocks: ProgramPageStaticBlocks;
  /** When true, shows a "Waitlist" badge in the hero and changes the payment CTA to "Join Waitlist" */
  isWaitlist?: boolean;
};

const RELLIA_TEAL = "#0D3540";

/** Vertical timeline outcome — MembershipPathTimeline style */
const OutcomesTimeline = ({ items }: { items: string[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -12% 0px" });
  const reduceMotion = useReducedMotion();
  const instant = Boolean(reduceMotion);
  const lineT = {
    duration: instant ? 0 : 0.95,
    delay: instant ? 0 : 0.08,
    ease: [0.22, 1, 0.36, 1] as const,
  };
  const circleT = (i: number) => ({
    duration: instant ? 0 : 0.38,
    delay: instant ? 0 : 0.14 + i * 0.18,
    ease: [0.33, 1, 0.68, 1] as const,
  });
  const stepT = (i: number) => ({
    duration: instant ? 0 : 0.42,
    delay: instant ? 0 : 0.06 + i * 0.1,
    ease: [0.22, 1, 0.36, 1] as const,
  });
  const circleAnim = isInView
    ? {
        backgroundColor: RELLIA_TEAL,
        color: "#ffffff",
        borderColor: RELLIA_TEAL,
      }
    : {
        backgroundColor: "#ffffff",
        color: RELLIA_TEAL,
        borderColor: RELLIA_TEAL,
      };

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-4 left-[1.25rem] top-[1.25rem] w-0.5 -translate-x-1/2 rounded-full bg-black/10"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-4 left-[1.25rem] top-[1.25rem] w-0.5 -translate-x-1/2 origin-top rounded-full bg-rellia-teal"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={lineT}
      />
      <ol className="relative z-[1] m-0 list-none space-y-8 p-0">
        {items.map((item, i) => (
          <motion.li
            key={item}
            className="flex items-start gap-4"
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={stepT(i)}
          >
            <motion.span
              className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-rellia-teal font-host-grotesk text-base font-semibold shadow-sm bg-white"
              initial={false}
              animate={circleAnim}
              transition={circleT(i)}
              aria-hidden
            >
              {i + 1}
            </motion.span>
            <div className="min-w-0 flex-1 pt-1.5">
              <p className="font-urbanist text-[17px] md:text-lg leading-relaxed text-black/80">
                {item}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
};

/** Extract Fillout form ID from a fillout URL like https://forms.fillout.com/t/<id> */
const extractFilloutId = (url: string): string | null => {
  try {
    const match = url.match(/fillout\.com\/t\/([^?#/]+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
};

const BackToPrograms = () => (
  <Link
    to="/programs"
    className="inline-flex items-center gap-1 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4 transition-colors"
  >
    <ChevronLeft className="h-4 w-4" aria-hidden />
    Back to Programs
  </Link>
);

const ProgramPageLayout = ({
  cms,
  cmsSlug,
  heroImageSrc,
  heroImageAlt,
  outcomesSectionId,
  paymentSectionId = "program-payment",
  staticBlocks: { howItWorksCards, pillars, timeline },
  isWaitlist = false,
}: ProgramPageLayoutProps) => {
  const [timelineOpen, setTimelineOpen] = useState<string | undefined>(
    undefined,
  );
  const [showForm, setShowForm] = useState(false);
  const [cardImages, setCardImages] = useState<string[]>([]);
  const location = useLocation();
  const { data: programPageData } = useProgramPageBySlug(cmsSlug ?? '', cms)
  const { data: programDoc } = useProgramBySlug(cmsSlug ?? "")
  const q = programPageData?.content ?? cms
  useApplyCmsSeo(q.seo)
  const filloutId = extractFilloutId(q.paymentUrl);

  const resolvedProgramTitle = (programDoc?.title || q.heroTitle || "").trim()
  const resolvedProgramDescription = (q.heroDescription || "").trim()

  const resolvedHeroImageSrc = (programDoc?.imageSrc || heroImageSrc || "").trim()
  const resolvedHeroImageAlt = (heroImageAlt || resolvedProgramTitle || "Program image").trim()

  const canonicalUrl = `${getSiteUrl()}${location.pathname}`;

  const extraSections = (programPageData?.sections ?? []).filter(
    (s) => s._type !== "sectionHero",
  )

  useEffect(() => {
    setCardImages([LOCAL_METRICS_BG_JPEG, PEXELS_OFFICE_COLLABORATION, PEXELS_HEALTH_MEETING])
  }, [])

  const scrollTo = (id: string) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  const onKey = (fn: () => void) => (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Helmet>
        <title>{resolvedProgramTitle} — Rellia Health</title>
        <meta name="description" content={resolvedProgramDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Rellia Health" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={resolvedProgramTitle} />
        <meta property="og:description" content={resolvedProgramDescription} />
        <meta
          property="og:image"
          content={
            resolvedHeroImageSrc.startsWith("http")
              ? resolvedHeroImageSrc
              : `${getSiteUrl()}${resolvedHeroImageSrc}`
          }
        />
        <meta name="twitter:title" content={resolvedProgramTitle} />
        <meta name="twitter:description" content={resolvedProgramDescription} />
        <meta
          name="twitter:image"
          content={
            resolvedHeroImageSrc.startsWith("http")
              ? resolvedHeroImageSrc
              : `${getSiteUrl()}${resolvedHeroImageSrc}`
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Navbar />
      <main id="main-content">
        {/* ─── Hero — text left, square image right ─── */}
        <section className="bg-white pt-[100px] pb-10 md:pt-[130px] md:pb-16 lg:pt-[160px] lg:pb-24">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10">
            <div className="mb-8 md:mb-12">
              <BackToPrograms />
            </div>
            <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:gap-14">
              {/* Left — text */}
              <div className="flex-1 lg:max-w-[55%]">
                <ScrollReveal>
                  {isWaitlist ? (
                    <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-rellia-teal/10 text-rellia-teal font-host-grotesk text-xs font-bold uppercase tracking-widest border border-rellia-teal/20">
                      Waitlist
                    </span>
                  ) : (
                    <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-rellia-mint text-rellia-teal font-host-grotesk text-xs font-bold uppercase tracking-widest border border-black/5">
                      Applications open
                    </span>
                  )}
                  <h1 className="max-w-3xl text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-black">
                    {resolvedProgramTitle}
                  </h1>
                  <p className="mt-5 max-w-xl font-urbanist text-base leading-relaxed text-black/60 md:text-lg">
                    {resolvedProgramDescription}
                  </p>

                  {!isWaitlist && (
                    <div className="mt-10 flex items-end gap-3 text-black">
                      <CalendarDays className="h-6 w-6 text-rellia-teal" aria-hidden strokeWidth={2.25} />
                      <span className="font-host-grotesk text-[12px] font-bold uppercase tracking-[0.18em] text-black/80">
                        DEADLINE: {getCurrentMonthDeadline()}
                      </span>
                    </div>
                  )}

                  <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <RelliaAction
                      type="button"
                      variant="mintTealFill"
                      size="comfortable"
                      onClick={() => scrollTo(paymentSectionId)}
                      onKeyDown={onKey(() => scrollTo(paymentSectionId))}
                      className="flex w-full sm:w-fit justify-center"
                    >
                      {q.heroCtaLabel}
                      <ArrowRight className="h-4 w-4 ml-2" aria-hidden />
                    </RelliaAction>
                    <RelliaAction
                      type="button"
                      variant="outlineOnWhite"
                      size="comfortable"
                      onClick={() => scrollTo(outcomesSectionId)}
                      onKeyDown={onKey(() => scrollTo(outcomesSectionId))}
                      className="flex w-full sm:w-fit justify-center"
                    >
                      Learn More
                    </RelliaAction>
                  </div>
                </ScrollReveal>
              </div>
              {/* Right — square image */}
              <div className="mb-8 lg:mb-0 flex-shrink-0 w-full lg:w-[340px] xl:w-[400px]">
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-rellia-teal/5">
                  <img
                    src={resolvedHeroImageSrc}
                    alt={resolvedHeroImageAlt}
                    className={cn(
                      "h-full w-full rounded-2xl",
                      Boolean(programDoc?.imageSrc || heroImageSrc)
                        ? "object-cover"
                        : "object-cover object-[0%_0%]",
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Program Outcomes ─── */}
        <section
          id={outcomesSectionId}
          className="scroll-mt-24 md:scroll-mt-[5.5rem] relative w-full bg-rellia-greyTeal py-16 md:py-24 px-6 md:px-10 overflow-hidden"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-28 top-10 h-[520px] w-[520px] rounded-full bg-rellia-mint/12 blur-3xl" />
            <div className="absolute right-[-220px] bottom-[-240px] h-[680px] w-[680px] rounded-full bg-rellia-mint/10 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-[1300px] mx-auto">
            <ScrollReveal delay={0.1}>
              <div className="mb-10 md:mb-14">
                <h2 className="font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-black md:text-[40px]">
                  {q.outcomesTitle}
                </h2>
                <p className="mt-4 font-urbanist text-base font-medium leading-relaxed tracking-tight text-black/65 md:text-lg">
                  {q.outcomesIntro}
                </p>
              </div>
            </ScrollReveal>
            <div className="w-full">
              <OutcomesTimeline items={q.outcomes} />
            </div>
          </div>
        </section>

        {q.testimonials && q.testimonials.length > 0 ? (
          <ProgramTrustedMembersSection testimonials={q.testimonials} />
        ) : cmsSlug === "qms" ? (
          <ProgramTrustedMembersSection />
        ) : null}

        {/* ─── How It Works ─── */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <ScrollReveal>
              <div className="mb-10 md:mb-14">
                <h2 className="font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-black md:text-[40px]">
                  {q.howItWorksTitle}
                </h2>
                <p className="mt-4 font-urbanist text-base font-medium leading-relaxed text-black/60 md:text-lg">
                  {q.howItWorksIntro}
                </p>
              </div>
            </ScrollReveal>
            <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
              {howItWorksCards.map((card, i) => {
                const bgImg = card.imageSrc || cardImages[i] || "";
                return (
                  <ScrollReveal key={card.title} delay={i * 0.12}>
                    <div className="group relative rounded-2xl overflow-hidden h-[300px] md:h-[360px] shadow-md hover:shadow-xl transition-shadow duration-500">
                      {bgImg ? (
                        <img
                          src={bgImg}
                          alt=""
                          aria-hidden
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-rellia-teal/10" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
                      <div className="absolute inset-0 bg-rellia-teal/0 group-hover:bg-rellia-teal/20 transition-colors duration-500" />
                      <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-8">
                        <h4 className="font-host-grotesk font-semibold text-white text-xl md:text-2xl leading-snug mb-2">
                          {card.title}
                        </h4>
                        <p className="font-urbanist text-white/80 text-sm md:text-base leading-relaxed line-clamp-3">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Program Pillars ─── */}
        <section className="relative w-full bg-rellia-teal py-20 md:py-28 px-6 md:px-10 overflow-hidden flex flex-col">
          <img
            src="/images/hologram-logo.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 top-8 w-[360px] max-w-[55vw] opacity-[0.05] md:right-0 md:top-0 md:w-[460px]"
          />
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-28 top-10 h-[520px] w-[520px] rounded-full bg-rellia-mint/22 blur-3xl" />
            <div className="absolute right-[-220px] bottom-[-240px] h-[680px] w-[680px] rounded-full bg-rellia-mint/18 blur-3xl" />
            <div className="absolute left-[35%] top-[55%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rellia-mint/10 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.16),transparent_52%),radial-gradient(circle_at_80%_30%,rgba(157,214,208,0.14),transparent_55%),radial-gradient(circle_at_35%_95%,rgba(255,255,255,0.10),transparent_55%)]" />
          </div>
          <div className="relative z-10 w-full max-w-[1300px] mx-auto flex flex-col h-full">
            <ScrollReveal delay={0.1}>
              <div className="mb-12 md:mb-16">
                <h2 className="font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-white md:text-[40px]">
                  {q.pillarsTitle}
                </h2>
              </div>
            </ScrollReveal>
            <div className="pt-2">
              <ScrollReveal delay={0.2}>
                <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                  {pillars.map((p) => {
                    const Icon = p.icon;
                    return (
                      <div
                        key={p.title}
                        className="flex w-full flex-col px-1 md:px-2"
                      >
                        <Icon
                          className="h-7 w-7 text-rellia-mint"
                          aria-hidden
                        />
                        <p className="mt-5 font-host-grotesk text-lg font-semibold leading-snug tracking-tight text-white line-clamp-2">
                          {p.title}
                        </p>
                        <p className="mt-3 font-urbanist text-sm leading-relaxed text-white/80 max-w-[260px]">
                          {p.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ─── Timeline ─── */}
        <section className="py-28 md:py-44 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <div className="flex flex-col lg:flex-row lg:gap-20">
              <div className="lg:w-[44%] shrink-0 mb-10 lg:mb-0 lg:sticky lg:top-32 lg:self-start">
                <ScrollReveal>
                  <h2 className="font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-black md:text-[40px]">
                    {q.timelineTitle.includes("&") ? (
                      <>
                        {q.timelineTitle.split("&")[0].trim()}
                        <br />
                        {"& "}
                        {q.timelineTitle.split("&").slice(1).join("&").trim()}
                      </>
                    ) : (
                      q.timelineTitle
                    )}
                  </h2>
                  <p className="font-urbanist text-black/60 text-base md:text-lg mt-4 max-w-sm">
                    {q.timelineSubtitle}
                  </p>
                </ScrollReveal>
              </div>
              <div className="flex-1">
                <ScrollReveal>
                  <Accordion
                    type="single"
                    collapsible
                    value={timelineOpen}
                    onValueChange={setTimelineOpen}
                    className="flex flex-col gap-0"
                  >
                    {timeline.map((month, idx) => (
                      <AccordionItem
                        key={month.month}
                        value={month.month}
                        className={cn(
                          "border-l-2 pl-6 md:pl-8 relative py-5",
                          timelineOpen === month.month
                            ? "border-l-rellia-teal"
                            : "border-l-black/10",
                        )}
                      >
                        <div
                          className={cn(
                            "absolute left-0 top-[26px] -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 transition-colors duration-300",
                            timelineOpen === month.month
                              ? "border-rellia-teal bg-rellia-mint"
                              : "border-black/20 bg-white",
                          )}
                        />
                        <span
                          className={cn(
                            "font-host-grotesk text-[11px] font-semibold uppercase tracking-[0.16em] block",
                            timelineOpen === month.month
                              ? "text-rellia-teal"
                              : "text-black/40",
                          )}
                        >
                          Step {idx + 1}
                        </span>
                        <AccordionTrigger className="font-host-grotesk font-semibold text-black text-lg md:text-xl py-2 hover:no-underline [&[data-state=open]]:text-rellia-teal transition-colors text-left">
                          {month.month}
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <ul className="flex flex-col gap-4 pl-1">
                            {month.weeks.map((w, wIdx) => {
                              if (typeof w === "string") {
                                return (
                                  <li key={wIdx} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-rellia-mint shrink-0 mt-0.5" />
                                    <span className="font-urbanist text-black text-base leading-relaxed">
                                      {w}
                                    </span>
                                  </li>
                                )
                              }
                              return (
                                <li key={wIdx} className="flex flex-col gap-2.5 mb-1 last:mb-0">
                                  {w.heading && (
                                    <span className="font-host-grotesk text-[10px] font-bold uppercase tracking-[0.18em] text-rellia-teal">
                                      {w.heading}
                                    </span>
                                  )}
                                  <div className="flex flex-col gap-4">
                                    {w.points.map((pt, ptIdx) => (
                                      <div key={ptIdx} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-rellia-mint shrink-0 mt-0.5" />
                                        <span className="font-urbanist text-black text-base leading-relaxed">
                                          {pt}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Payment — taller section, full-height divider, inline embed ─── */}
        <section
          id={paymentSectionId}
          className="w-full bg-rellia-cream/40 border-t border-black/5"
        >
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div
                key="price-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative max-w-[1100px] mx-auto px-6 md:px-10 flex flex-col md:flex-row py-40 md:py-56">
                  {/* Full-height divider */}
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-black/10 -translate-x-1/2" />

                  {/* Left: badge, price, description, button — top + left aligned */}
                  <div className="flex-1 flex flex-col justify-start items-start md:pr-12 lg:pr-16">
                    <h2 className="font-host-grotesk text-sm font-bold tracking-widest text-rellia-teal uppercase">
                      {q.pricingBadge}
                    </h2>
                    <div className="mt-5">
                      <span className="text-6xl md:text-7xl font-extrabold text-black tracking-tight">
                        {q.pricingAmount}
                        <span className="text-4xl md:text-5xl">
                          {q.pricingSubAmount}
                        </span>
                      </span>
                    </div>
                    <p className="mt-5 mb-10 font-urbanist text-black/60 text-base md:text-lg leading-relaxed max-w-md">
                      {q.pricingDescription}
                    </p>
                    <RelliaAction
                      type="button"
                      variant="mintTealFill"
                      size="comfortable"
                      onClick={() => setShowForm(true)}
                      className="px-10 w-fit"
                    >
                      {isWaitlist ? "Join Waitlist" : "Secure Your Spot"}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                    </RelliaAction>
                  </div>

                  {/* Right: heading + bullet points — top + left aligned */}
                  <div className="flex-1 flex flex-col justify-start items-start mt-10 md:mt-0 md:pl-12 lg:pl-16">
                    <h3 className="font-host-grotesk text-xl font-semibold text-black mb-6">
                      What's included
                    </h3>
                    <ul className="flex flex-col gap-5 list-none">
                      {q.pricingBullets.map((line) => (
                        <li key={line} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-rellia-teal shrink-0 mt-0.5" />
                          <span className="font-urbanist text-black/70 text-base md:text-lg leading-relaxed">
                            {line}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <div className="max-w-[1100px] mx-auto px-6 md:px-10 pt-10 pb-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="inline-flex items-center gap-2 font-host-grotesk text-sm font-bold text-rellia-teal hover:underline hover:underline-offset-4"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Back to details
                  </button>
                </div>
                {/* Full-width embed like /apply — extends beyond container margins */}
                <div
                  className={cn(
                    "w-full",
                    "[&_iframe]:!rounded-none",
                  )}
                >
                  {filloutId ? (
                    <FilloutStandardEmbed
                      filloutId={filloutId}
                      inheritParameters
                      dynamicResize
                    />
                  ) : (
                    <iframe
                      src={q.paymentUrl}
                      title={isWaitlist ? "Waitlist form" : "Enrollment form"}
                      className="w-full border-0"
                      style={{ minHeight: "calc(100svh - 120px)" }}
                      allow="payment; fullscreen"
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Back to Programs — bottom */}
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-8">
          <BackToPrograms />
        </div>

        <RelliaCta
          title={q.bottomCtaTitle}
          body={q.bottomCtaBody}
          primary={ctaActionFromHref(
            q.bottomCtaButtonLabel,
            q.bottomContactHref,
          )}
        />

        {extraSections.length > 0 ? (
          <SectionsRenderer sections={extraSections} />
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default ProgramPageLayout;
