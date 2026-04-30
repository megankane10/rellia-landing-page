import {
  Activity,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  DollarSign,
  Megaphone,
  Plus,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import ScrollReveal from "./ScrollReveal"
import SectionHeading from "@/components/SectionHeading"
import { useState } from "react"
import { cn } from "@/lib/utils"

const TEAL = "#0D3540"
const TEAL_LINE = "rgba(13, 53, 64, 0.28)"

type Step = {
  icon: LucideIcon
  title: string
  description: string
}

const steps: Step[] = [
  {
    icon: BriefcaseBusiness,
    title: "Product Design and Development",
    description:
      "Turn your concept into a credible MVP with smart scope, architecture trade-offs, and interoperability guidance.",
  },
  {
    icon: ClipboardList,
    title: "User Feedback",
    description:
      "Collect the proof that matters—usability, pilots, and validation—so you can iterate fast and show traction clearly.",
  },
  {
    icon: BadgeCheck,
    title: "Regulatory and Legal Compliance",
    description:
      "Navigate privacy, security, IP, and classification with less guesswork—stay compliant without slowing the roadmap.",
  },
  {
    icon: DollarSign,
    title: "Fundraising",
    description:
      "Sharpen your narrative, metrics, and materials—be ready for grants, angels, or VC with a diligence-proof data room.",
  },
  {
    icon: Megaphone,
    title: "Marketing and Commercial Strategy",
    description:
      "Clarify positioning and go-to-market for healthcare—build trust and move prospects from interest to commitment.",
  },
  {
    icon: Building2,
    title: "Navigating Healthcare Systems",
    description:
      "Understand procurement, reimbursement, and adoption realities—so your plan matches how health systems actually buy and roll out.",
  },
  {
    icon: BadgeCheck,
    title: "Security and Trust",
    description:
      "Get ahead of security reviews with practical evidence, policies, and vendor requirements—without stalling progress.",
  },
  {
    icon: Activity,
    title: "Operations and Scaling",
    description:
      "Set the operating rhythm—metrics, customer success, hiring, and finance—so you can scale what’s working without chaos.",
  },
  {
    icon: ClipboardList,
    title: "Partnership Readiness",
    description:
      "Prepare for pilots and partnerships with the right materials, stakeholders, and execution plan—so teams can say yes faster.",
  },
]

/** lg 3-column: draw consistent inner dividers (straight lines across rows) */
const lgCellBorderClass = (idx: number, n: number): string => {
  const isOrphanLast = idx === n - 1 && n % 3 === 1
  if (isOrphanLast) {
    return "lg:border-l lg:border-r lg:border-rellia-teal/25"
  }

  const col = idx % 3
  const t = "lg:border-rellia-teal/25"
  const rows = Math.ceil(n / 3)
  const row = Math.floor(idx / 3)

  const showRight = col !== 2 && idx < n - 1
  const showBottom = row < rows - 1

  return cn(t, showRight && "lg:border-r", showBottom && "lg:border-b")
}

/** md 2-column: top row + middle rows get bottom rules; last single column = left+right only */
const mdCellBorderClass = (idx: number, n: number): string => {
  if (idx === n - 1 && n % 2 === 1) {
    return "md:border-l md:border-r md:border-rellia-teal/25"
  }

  const col = idx % 2
  const t = "md:border-rellia-teal/25"
  const rows = Math.ceil(n / 2)
  const row = Math.floor(idx / 2)

  const showRight = col === 0 && idx < n - 1
  const showBottom = row < rows - 1

  return cn(t, showRight && "md:border-r", showBottom && "md:border-b")
}

export default function HowItWorks() {
  const [openTitle, setOpenTitle] = useState<string | null>(null)

  const handleToggle = (title: string) => {
    setOpenTitle((curr) => (curr === title ? null : title))
  }

  const n = steps.length

  return (
    <section className="relative w-full bg-white py-16 md:py-24 px-6 md:px-10 overflow-hidden">
      <img
        src="/images/hologram-logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-8 w-[360px] max-w-[55vw] opacity-[0.05] md:right-0 md:top-0 md:w-[460px]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-[420px] w-[420px] rounded-full bg-rellia-mint/18 blur-3xl" />
        <div className="absolute right-[-160px] bottom-[-200px] h-[560px] w-[560px] rounded-full bg-rellia-teal/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(circle_at_20%_10%,rgba(13,53,64,0.08),transparent_52%),radial-gradient(circle_at_80%_30%,rgba(157,214,208,0.10),transparent_55%),radial-gradient(circle_at_35%_95%,rgba(13,53,64,0.07),transparent_55%)]" />
      </div>
      <div className="relative z-10 max-w-[1300px] mx-auto">
        <ScrollReveal delay={0.1}>
          <SectionHeading
            title="How we help you move faster"
            description="Healthcare commercialization has different rules. We give you targeted guidance in the areas that unlock the next milestone."
            tone="dark"
            className="mb-12 md:mb-16"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 place-items-stretch gap-0 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, idx) => {
              const Icon = step.icon
              const isOpen = step.title === openTitle

              const shouldCenterLastLg = idx === n - 1 && n % 3 === 1
              const shouldCenterLastMd = idx === n - 1 && n % 2 === 1
              const shouldSplitLastRowLg = n % 3 === 2 && idx >= n - 2
              const shouldForceOpsAndPartnerRowLg = n === 9
              const isOps = step.title === "Operations and Scaling"
              const isPartner = step.title === "Partnership Readiness"

              const lgBorders = lgCellBorderClass(idx, n)
              const mdBorders = mdCellBorderClass(idx, n)

              const showBottomDividerMobile = idx < n - 1

              return (
                <div
                  key={step.title}
                  className={cn(
                    "group relative flex min-h-0 min-w-0 flex-col",
                    shouldCenterLastMd && "md:col-start-2",
                    shouldCenterLastLg && "lg:col-start-2",
                    shouldSplitLastRowLg && idx === n - 2 && "lg:col-start-1",
                    shouldSplitLastRowLg && idx === n - 1 && "lg:col-start-3",
                    shouldForceOpsAndPartnerRowLg && isOps && "lg:col-start-2 lg:row-start-3",
                    shouldForceOpsAndPartnerRowLg && isPartner && "lg:col-start-3 lg:row-start-3",
                    mdBorders,
                    "lg:border-0",
                    lgBorders,
                  )}
                >
                  {showBottomDividerMobile ? (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-px left-0 right-0 h-px md:hidden"
                      style={{
                        background: `linear-gradient(to right, transparent 0%, ${TEAL_LINE} 14%, ${TEAL_LINE} 86%, transparent 100%)`,
                      }}
                    />
                  ) : null}

                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isOpen ? TEAL : "rgba(255,255,255,0)",
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-0 flex h-[190px] w-full min-w-0 shrink-0 flex-col overflow-hidden md:h-[210px]"
                  >
                    <div className="relative z-10 flex h-full min-h-0 w-full flex-col px-4 pb-12 pt-6 md:px-5 md:pb-12 md:pt-7 lg:px-6 lg:pt-8">
                      <button
                        type="button"
                        onClick={() => handleToggle(step.title)}
                        className={cn(
                          "flex min-h-0 w-full flex-1 flex-col text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4",
                          isOpen ? "focus-visible:outline-white" : "focus-visible:outline-rellia-teal",
                        )}
                        aria-expanded={isOpen}
                        aria-controls={`focus-panel-${idx}`}
                      >
                        <AnimatePresence initial={false} mode="popLayout">
                          {!isOpen ? (
                            <motion.div
                              key="icon-row"
                              initial={{ opacity: 1, y: 0 }}
                              exit={{
                                y: -48,
                                opacity: 0,
                                transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                              }}
                              className="flex shrink-0 items-start justify-start"
                            >
                              <Icon className="h-7 w-7 shrink-0 text-rellia-teal" aria-hidden={true} />
                            </motion.div>
                          ) : null}
                        </AnimatePresence>

                        <motion.div
                          layout="position"
                          className={cn("min-w-0 w-full shrink-0", !isOpen ? "mt-4" : "mt-0")}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <motion.div
                            initial={false}
                            animate={{ y: isOpen ? -10 : 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className={cn(
                              "max-w-[20ch] text-base font-host-grotesk font-medium leading-snug md:max-w-[22ch] md:text-lg md:leading-snug",
                              isOpen ? "text-white" : "text-black",
                            )}
                          >
                            {step.title}
                          </motion.div>
                        </motion.div>

                        <AnimatePresence initial={false}>
                          {isOpen ? (
                            <motion.div
                              id={`focus-panel-${idx}`}
                              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                              exit={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                              className="mt-3 w-full min-w-0 flex-1 text-[14px] font-urbanist leading-relaxed text-white/90 md:text-[15px] line-clamp-3"
                            >
                              {step.description}
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </button>
                    </div>
                  </motion.div>

                  <button
                    type="button"
                    onClick={() => handleToggle(step.title)}
                    className={cn(
                      "absolute bottom-3 right-3 z-20 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 font-host-grotesk font-semibold transition-[color,border-color,background-color] duration-300 md:bottom-4 md:right-4",
                      "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out",
                      "hover:before:scale-x-100 group-hover:before:scale-x-100 group-focus-within:before:scale-x-100",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4",
                      isOpen
                        ? cn(
                            "border-white/85 bg-white/18 text-white backdrop-blur-[2px]",
                            "before:bg-white/35 hover:text-white group-hover:text-white group-focus-within:text-white",
                            "hover:border-white hover:bg-white/28 group-hover:border-white group-focus-within:border-white",
                            "focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D3540]",
                          )
                        : cn(
                            "border-rellia-teal bg-white text-rellia-teal",
                            "before:bg-rellia-teal",
                            "hover:text-white group-hover:text-white group-focus-within:text-white hover:border-rellia-teal group-hover:border-rellia-teal",
                            "focus-visible:outline-rellia-teal",
                          ),
                    )}
                    aria-label={isOpen ? `Collapse ${step.title}` : `Expand ${step.title}`}
                  >
                    <motion.span
                      initial={false}
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="relative z-10 inline-flex text-inherit"
                    >
                      <Plus className="h-5 w-5 text-current" strokeWidth={2.25} />
                    </motion.span>
                  </button>
                </div>
              )
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
