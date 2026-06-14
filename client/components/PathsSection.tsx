import { useMemo, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  NETWORK_PATH_ROLE_TAG,
  type NetworkPathRoleId,
} from "@/lib/networkPathRoles"
import RelliaAction from "@/components/RelliaAction"
import ScrollReveal from "@/components/ScrollReveal"
import { useHomePage } from "@/hooks/useCmsDocuments"
import { DEFAULT_HOME_PAGE } from "@shared/cms/defaults"
import type { HomePathsCard } from "@shared/cms/types"
import { hasCmsString, pickCmsPortableText, pickRawOrMergedString } from "@shared/cms/cmsFieldUtils"
import NetworkMetricsSection from "@/components/NetworkMetricsSection"
import { PILL_ON_IMAGE_BLUR_CLASS } from "@/components/PillTag"
import { cmsCleanText, cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"

/** Layered soft blurs — disabled for solid white section background */
const BrandBlurField = () => null

const ROLE_IDS: NetworkPathRoleId[] = ["founder", "advisor", "investor", "partner"]

const CTA_PHRASE: Record<NetworkPathRoleId, string> = {
  founder: "I'm a founder",
  advisor: "I'm an advisor",
  investor: "I'm an investor",
  partner: "I'm a partner",
}

type ResolvedCard = {
  roleId: NetworkPathRoleId
  tagLabel: string
  title: string
  imageSrc: string
  imageAlt: string
  ctaLabel: string
  ctaTo: string
}

const ROLE_META: Record<
  NetworkPathRoleId,
  {
    title: string
    subtitle: string
    imageSrc: string
    imageAlt: string
    ctaTo: string
  }
> = {
  founder: {
    title: "Build with signal",
    subtitle: "Programs, mentors, and warm intros aligned to healthcare reality.",
    imageSrc: "/images/paths-founder-pexels.jpg",
    imageAlt: "Team of founders collaborating around a table",
    ctaTo: "/founders",
  },
  advisor: {
    title: "Mentor decisively",
    subtitle: "Join a bench built for outcomes—not open-ended overhead.",
    imageSrc: "/images/paths-advisor-pexels.jpg",
    imageAlt: "Professional advisor working with a colleague",
    ctaTo: "/advisors",
  },
  investor: {
    title: "See founder quality",
    subtitle: "Curated pitch events and diligence-friendly updates.",
    imageSrc: "/images/paths-investor-pexels.jpg",
    imageAlt: "Investor in conversation during a business meeting",
    ctaTo: "/investors",
  },
  partner: {
    title: "Drive adoption",
    subtitle: "Partner pathways designed for pilots, integration, and trust.",
    imageSrc: "/images/paths-partner-pexels.jpg",
    imageAlt: "Two partners shaking hands after an agreement",
    ctaTo: "/industry-partners",
  },
}

const isValidRoleId = (id: unknown): id is NetworkPathRoleId =>
  typeof id === "string" && (ROLE_IDS as string[]).includes(id)

const resolveCard = (id: NetworkPathRoleId, cms?: HomePathsCard): ResolvedCard => {
  const meta = ROLE_META[id]
  const tag = NETWORK_PATH_ROLE_TAG[id]
  return {
    roleId: id,
    tagLabel: cmsCleanText(cms?.tagLabel) || tag.label,
    title: cmsCleanText(cms?.title) || meta.title,
    imageSrc: hasCmsString(cms?.imageSrc) ? cms!.imageSrc! : meta.imageSrc,
    imageAlt: cmsCleanText(cms?.imageAlt) || meta.imageAlt,
    ctaLabel: cmsCleanText(cms?.ctaLabel) || CTA_PHRASE[id],
    ctaTo: cmsCleanText(cms?.ctaTo) || meta.ctaTo,
  }
}

const displayCardField = (cmsValue: string | undefined, resolved: string) =>
  cmsValue?.trim() ? cmsDisplayText(cmsValue) : resolved

export default function PathsSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-12% 0px -28% 0px" })
  const reduceMotion = useReducedMotion()
  const previewMode = isVisualEditingPreview()
  const { data: homeBundle } = useHomePage()
  const page = homeBundle?.merged ?? DEFAULT_HOME_PAGE
  const homeRaw = homeBundle?.raw
  const resolvedCards = useMemo<ResolvedCard[]>(() => {
    const cards = page.pathsCards ?? DEFAULT_HOME_PAGE.pathsCards ?? []
    return cards
      .filter((c): c is HomePathsCard => Boolean(c) && isValidRoleId(c?.roleId))
      .map((c) => resolveCard(c.roleId, c))
  }, [page.pathsCards])

  const pathsCardsRaw = page.pathsCards ?? DEFAULT_HOME_PAGE.pathsCards ?? []
  const pathsTitleRaw = pickRawOrMergedString(
    homeRaw?.pathsTitle,
    page.pathsTitle,
    "Find your place in the community",
  )

  const metricsHeadingPortable = pickCmsPortableText(
    homeRaw?.metricsHeadingPortable,
    page.metricsHeadingPortable,
    DEFAULT_HOME_PAGE.metricsHeadingPortable!,
  )

  const metricsBadgeLabel = pickRawOrMergedString(
    homeRaw?.metricsBadgeLabel,
    page.metricsBadgeLabel,
    "Network impact",
  )

  const headerHidden = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }
  const headerVisible = { opacity: 1, y: 0 }

  const headingContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.16,
        delayChildren: reduceMotion ? 0 : 0.08,
      },
    },
  }

  const headingWordVariants = {
    hidden: {
      opacity: reduceMotion ? 1 : 0,
      y: reduceMotion ? 0 : 26,
      filter: reduceMotion ? "blur(0px)" : "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 0.9,
        ease: [0.33, 1, 0.68, 1] as const,
      },
    },
  }



  return (
    <>
      <section
        ref={(node) => {
          sectionRef.current = node
        }}
        id="paths-section"
        className={cn(
          "relative w-full overflow-hidden px-6 md:px-10",
          "min-h-[72vh] md:min-h-[76vh] lg:min-h-[78vh]",
          "bg-white",
          "py-16 md:py-24 lg:py-28",
        )}
      >
        <BrandBlurField />

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1300px] flex-col items-center">
        <motion.div
          initial={headerHidden}
          animate={isInView ? headerVisible : headerHidden}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 0.78, ease: [0.16, 1, 0.3, 1] }
          }
          className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center"
        >
          <motion.h2
            variants={headingContainerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative z-10 flex flex-wrap justify-center gap-x-[0.22em] gap-y-2 text-balance font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-rellia-teal md:text-[44px] md:leading-[1.15]"
          >
            {previewMode ? (
              cmsDisplayText(pathsTitleRaw)
            ) : (
              cmsCleanText(pathsTitleRaw)
                .split(" ")
                .flatMap((word, idx, arr) => {
                  const nodes = [
                    <motion.span
                      key={`${idx}-${word}`}
                      variants={headingWordVariants}
                      className={cn("inline-block will-change-[transform,filter]")}
                    >
                      {word}
                    </motion.span>,
                  ]
                  if (word.toLowerCase() === "place" || (idx === Math.ceil(arr.length / 2) - 1 && arr.length > 4)) {
                    nodes.push(
                      <span
                        key={`${idx}-${word}-line`}
                        aria-hidden
                        className="h-0 w-full shrink-0 basis-full overflow-hidden"
                      />,
                    )
                  }
                  return nodes
                })
            )}
          </motion.h2>
        </motion.div>

        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.62, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 w-full md:mt-20"
        >
          <div
            className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-4 xl:gap-5"
          >
            {resolvedCards.map((card, idx) => {
              const Icon = NETWORK_PATH_ROLE_TAG[card.roleId].icon
              const cmsCard = pathsCardsRaw.find((c) => c?.roleId === card.roleId)
              return (
                <ScrollReveal key={card.roleId} variant="ctaReveal" delay={idx * 0.15}>
                  <article
                    className={cn(
                      "group relative overflow-hidden rounded-[26px] bg-white shadow-sm md:rounded-[28px]",
                      "transition-[transform,box-shadow] duration-300 motion-reduce:transition-none",
                      "hover:-translate-y-[1px] hover:shadow-md",
                    )}
                  >
                  <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
                    <img
                      src={hasCmsString(cmsCard?.imageSrc) ? cmsDisplayText(cmsCard!.imageSrc) : card.imageSrc}
                      alt={displayCardField(cmsCard?.imageAlt, card.imageAlt)}
                      className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 via-40% to-transparent"
                    />
                    <div className={cn("absolute right-3 top-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/95 sm:right-4 sm:top-4", PILL_ON_IMAGE_BLUR_CLASS)}>
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {displayCardField(cmsCard?.tagLabel, card.tagLabel)}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                      <h3 className="font-host-grotesk text-xl font-normal tracking-tight text-white md:text-2xl">
                        {displayCardField(cmsCard?.title, card.title)}
                      </h3>

                      <RelliaAction
                        asChild
                        variant="relliaCtaSecondary"
                        size="compact"
                        className="mt-4 w-fit px-4 py-2.5 text-sm shadow-sm md:mt-5 md:px-5 md:py-3 md:text-[0.9375rem]"
                      >
                        <Link
                          to={card.ctaTo}
                          className="inline-flex cursor-pointer items-center justify-center"
                          aria-label={cmsCleanText(cmsCard?.ctaLabel) || card.ctaLabel}
                        >
                          {displayCardField(cmsCard?.ctaLabel, card.ctaLabel)}
                        </Link>
                      </RelliaAction>
                    </div>
                  </div>
                  </article>
                </ScrollReveal>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>

    <NetworkMetricsSection
      heading={metricsHeadingPortable}
      metrics={(page.metrics || []).map((metric) => ({
        _key: metric._key,
        label: metric.label,
        value: Number(cmsCleanText(String(metric.value))) || 0,
        valueText: String(metric.value ?? ""),
        suffix: metric.suffix,
      }))}
      showBadge={page.showBadge !== false}
      badgeLabel={metricsBadgeLabel}
      backgroundImageUrl={pickRawOrMergedString(
        homeRaw?.metricsBackgroundImageUrl,
        page.metricsBackgroundImageUrl,
        DEFAULT_HOME_PAGE.metricsBackgroundImageUrl ?? "",
      )}
    />
    </>
  )
}
