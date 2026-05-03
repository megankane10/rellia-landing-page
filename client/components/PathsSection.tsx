import { useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  NETWORK_PATH_ROLE_TAG,
  type NetworkPathRoleId,
} from "@/lib/networkPathRoles"
import RelliaAction from "@/components/RelliaAction"

/** Layered soft mint blurs — kept in the upper band so hero copy stays clean */
const MintBlurField = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -left-[22%] -top-[18%] h-[360px] w-[360px] rounded-full bg-rellia-mint/42 blur-[100px] md:h-[460px] md:w-[460px] md:blur-[118px]" />
    <div className="absolute -left-[6%] -top-[8%] h-[300px] w-[300px] rounded-full bg-rellia-mint/36 blur-[88px] md:h-[400px] md:w-[400px]" />
    <div className="absolute left-[14%] top-[-6%] h-[260px] w-[260px] rounded-full bg-rellia-mint/32 blur-[76px] md:h-[340px] md:w-[340px]" />
    <div className="absolute right-[4%] -top-[12%] h-[280px] w-[280px] rounded-full bg-rellia-mint/28 blur-[72px] md:h-[360px] md:w-[360px]" />
    <div className="absolute right-[-12%] top-[6%] h-[240px] w-[240px] rounded-full bg-rellia-mint/24 blur-[64px] md:h-[300px] md:w-[300px]" />
    <div className="absolute left-1/3 top-[14%] h-[200px] w-[200px] -translate-x-1/2 rounded-full bg-rellia-mint/20 blur-[58px] md:h-[260px] md:w-[260px]" />
  </div>
)

const ROLE_IDS: NetworkPathRoleId[] = ["founder", "advisor", "investor", "partner"]

const CTA_PHRASE: Record<NetworkPathRoleId, string> = {
  founder: "I'm a founder",
  advisor: "I'm an advisor",
  investor: "I'm an investor",
  partner: "I'm a partner",
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

export default function PathsSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-12% 0px -28% 0px" })
  const reduceMotion = useReducedMotion()

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
    <section
      ref={(node) => {
        sectionRef.current = node
      }}
      id="paths-section"
      className={cn(
        "relative w-full overflow-hidden px-6 md:px-10",
        "min-h-[72vh] md:min-h-[76vh] lg:min-h-[78vh]",
        "bg-gradient-to-b from-rellia-greyTeal via-rellia-greyTeal to-[#b5cac7]",
        "py-16 md:py-24 lg:py-28",
      )}
    >
      <MintBlurField />

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1300px] flex-col items-center">
        <motion.div
          initial={headerHidden}
          animate={isInView ? headerVisible : headerHidden}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 0.78, ease: [0.16, 1, 0.3, 1] }
          }
          className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[38%] z-0 h-[min(52vw,260px)] w-[min(92vw,400px)] -translate-x-1/2 -translate-y-1/2 rounded-[55%] bg-gradient-to-br from-rellia-mint/58 via-rellia-mint/38 to-rellia-mint/22 blur-[56px] md:top-[40%] md:h-[300px] md:w-[460px] md:blur-[76px]"
          />

          <Users
            className="relative z-10 mb-5 h-10 w-10 shrink-0 text-rellia-teal md:mb-6 md:h-12 md:w-12"
            strokeWidth={1.35}
            aria-hidden
          />

          <motion.h2
            variants={headingContainerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative z-10 flex flex-wrap justify-center gap-x-[0.22em] gap-y-2 text-balance font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-black md:text-[44px] md:leading-[1.15]"
          >
            {["Find", "your", "place", "in", "the", "community"].flatMap((word, idx) => {
              const isAccent = word === "your" || word === "place"
              const nodes = [
                <motion.span
                  key={`${idx}-${word}`}
                  variants={headingWordVariants}
                  className={cn("inline-block will-change-[transform,filter]", isAccent && "text-rellia-teal")}
                >
                  {word}
                </motion.span>,
              ]

              if (word === "place") {
                nodes.push(
                  <span
                    key={`${idx}-${word}-line`}
                    aria-hidden
                    className="h-0 w-full shrink-0 basis-full overflow-hidden"
                  />,
                )
              }

              return nodes
            })}
          </motion.h2>
        </motion.div>

        <motion.div
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.62, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 w-full md:mt-20"
        >
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-4 xl:gap-5">
            {ROLE_IDS.map((id, idx) => {
              const card = ROLE_META[id]
              const tag = NETWORK_PATH_ROLE_TAG[id]
              const Icon = tag.icon
              const ctaText = CTA_PHRASE[id]
              return (
                <motion.article
                  key={id}
                  initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.62, delay: 0.06 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }
                  }
                  className={cn(
                    "group relative overflow-hidden rounded-[26px] bg-white shadow-sm md:rounded-[28px]",
                    "transition-[transform,box-shadow] duration-300 motion-reduce:transition-none",
                    "hover:-translate-y-[1px] hover:shadow-md",
                  )}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
                    <img
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      loading="lazy"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent backdrop-blur-[2px]"
                    />
                    <div className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/95 ring-1 ring-white/15 backdrop-blur-md sm:right-4 sm:top-4">
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {tag.label}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                      <h3 className="font-host-grotesk text-xl font-medium tracking-tight text-white md:text-2xl">
                        {card.title}
                      </h3>
                      <p className="mt-2 max-w-[36ch] font-urbanist text-sm leading-relaxed text-white/85 md:text-base">
                        {card.subtitle}
                      </p>

                      <RelliaAction
                        asChild
                        variant="relliaCtaSecondary"
                        size="compact"
                        className="mt-4 w-fit px-4 py-2.5 text-sm shadow-sm md:mt-5 md:px-5 md:py-3 md:text-[0.9375rem]"
                      >
                        <Link
                          to={card.ctaTo}
                          className="inline-flex cursor-pointer items-center justify-center"
                          aria-label={ctaText}
                        >
                          {ctaText}
                        </Link>
                      </RelliaAction>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
