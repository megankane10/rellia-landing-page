import {
  Palette,
  ClipboardList,
  ShieldCheck,
  CircleDollarSign,
  Megaphone,
  Hospital,
  LineChart,
  Plus,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import ScrollReveal from "./ScrollReveal"
import SectionHeading from "@/components/SectionHeading"
import { useState } from "react"
import { cn } from "@/lib/utils"

const TEAL = "#0D3540"

type Step = {
  icon: typeof Palette
  title: string
  description: string
}

const steps: Step[] = [
  {
    icon: Palette,
    title: "Product Design and Development",
    description:
      "Turn your concept into a viable health tech product. We help you work through prototype development, MVP development, architecture decisions, and interoperability requirements for a stronger technical foundation.",
  },
  {
    icon: ClipboardList,
    title: "User Feedback",
    description:
      "Gather the validation evidence that clinicians, investors, and regulators need to see. We help you design and execute usability testing, human factors research, clinical pilots, and real-world evidence collection in a way that is both rigorous and compliant.",
  },
  {
    icon: ShieldCheck,
    title: "Regulatory and Legal Compliance",
    description:
      "We help you understand global privacy and security requirements, intellectual property protection, medical device classification, and governance frameworks specific to your target markets.",
  },
  {
    icon: CircleDollarSign,
    title: "Fundraising",
    description:
      "Whether you are exploring non-dilutive grants, angel investors, or venture capital, we help you show up with a stronger investor narrative and a data room that holds up to scrutiny.",
  },
  {
    icon: Megaphone,
    title: "Marketing and Commercial Strategy",
    description:
      "Build a brand that resonates inside healthcare and a go-to-market strategy that moves prospects through to sales. Credibility and clarity both matter more in this industry.",
  },
  {
    icon: Hospital,
    title: "Navigating Healthcare Systems",
    description:
      "We help you understand hospital procurement processes, reimbursement pathways, and what it actually takes to drive adoption inside complex health systems.",
  },
  {
    icon: LineChart,
    title: "Operations and Scaling",
    description:
      "Getting to launch is one milestone. Building a sustainable company is another. We help put the right foundations in place for better financial modeling, growth metrics, customer success, and hiring so the momentum you built can continue on.",
  },
]

/** lg 3-column: row 0 verticals between 0–1 (col0 r) and 1–2 (col2 l); top-right has no outer border-r; row 1 inner verticals + bottom; orphan last = L+R */
const lgCellBorderClass = (idx: number, n: number): string => {
  const isOrphanLast = idx === n - 1 && n % 3 === 1
  if (isOrphanLast) {
    return "lg:border-l lg:border-r lg:border-rellia-teal/55"
  }

  const row = Math.floor(idx / 3)
  const col = idx % 3
  const t = "lg:border-rellia-teal/55"

  if (row === 0) {
    if (col === 0) return cn(t, "lg:border-r lg:border-b")
    if (col === 1) return cn(t, "lg:border-b")
    /* Top-right (3rd cell): keep left seam; no right-edge vertical */
    return cn(t, "lg:border-l lg:border-b lg:border-r-0")
  }

  if (row === 1) {
    if (col === 0) return cn(t, "lg:border-r lg:border-b")
    if (col === 1) return cn(t, "lg:border-r lg:border-b")
    return cn(t, "lg:border-b")
  }

  return ""
}

/** md 2-column: top row + middle rows get bottom rules; last single column = left+right only */
const mdCellBorderClass = (idx: number, n: number): string => {
  if (idx === n - 1 && n % 2 === 1) {
    return "md:border-l md:border-r md:border-rellia-teal/55"
  }

  const row = Math.floor(idx / 2)
  const col = idx % 2
  const t = "md:border-rellia-teal/55"

  if (row === 0) {
    if (col === 0) return cn(t, "md:border-b")
    return cn(t, "md:border-l md:border-b")
  }

  if (col === 0) return cn(t, "md:border-r md:border-b")
  return cn(t, "md:border-b")
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
      <div className="relative z-10 max-w-[1300px] mx-auto">
        <ScrollReveal delay={0.1}>
          <SectionHeading
            title="Where we focus"
            description="Health tech commercialization is complex, and generic start-up advice won't help you. These are the areas where Rellia can help."
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
                    mdBorders,
                    lgBorders,
                  )}
                >
                  {showBottomDividerMobile ? (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-px left-0 right-0 h-px md:hidden"
                      style={{
                        background: `linear-gradient(to right, transparent 0%, ${TEAL} 14%, ${TEAL} 86%, transparent 100%)`,
                      }}
                    />
                  ) : null}

                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isOpen ? TEAL : "rgba(255,255,255,0)",
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-0 flex h-[288px] w-full min-w-0 shrink-0 flex-col overflow-hidden md:h-[304px]"
                  >
                    <div className="relative z-10 flex h-full min-h-0 w-full flex-col px-5 pb-14 pt-6 md:px-6 md:pb-14 md:pt-7 lg:px-7 lg:pt-8">
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
                              <Icon className="h-7 w-7 shrink-0 text-rellia-teal" strokeWidth={2.35} aria-hidden="true" />
                            </motion.div>
                          ) : null}
                        </AnimatePresence>

                        <motion.div
                          layout="position"
                          className={cn("min-w-0 w-full shrink-0", !isOpen ? "mt-4" : "mt-0")}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div
                            className={cn(
                              "max-w-[13ch] text-xl font-host-grotesk font-normal leading-snug sm:max-w-[14ch] md:max-w-[15ch] md:text-2xl md:leading-snug",
                              isOpen ? "text-white" : "text-black",
                            )}
                          >
                            {step.title}
                          </div>
                        </motion.div>

                        <AnimatePresence initial={false}>
                          {isOpen ? (
                            <motion.div
                              id={`focus-panel-${idx}`}
                              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                              exit={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                              className="mt-4 w-full min-w-0 flex-1 overflow-y-auto text-[15px] font-urbanist leading-relaxed text-white/90 md:text-[16px]"
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
