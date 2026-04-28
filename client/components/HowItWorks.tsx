import {
  Plus,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import ScrollReveal from "./ScrollReveal"
import SectionHeading from "@/components/SectionHeading"
import { useState } from "react"
import { cn } from "@/lib/utils"

const TEAL = "#0D3540"
const TEAL_LINE = "rgba(13, 53, 64, 0.28)"

type SolidIconProps = React.SVGProps<SVGSVGElement>

const IconPaletteSolid = (props: SolidIconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M12 2.25c-5.92 0-10.75 4.52-10.75 10.1 0 4.1 2.62 7.47 6.46 9.08.72.3 1.54-.23 1.54-1.01v-1.1c0-1.53 1.26-2.78 2.8-2.78h2.2c3.34 0 6.05-2.6 6.05-5.88C22.3 6.43 17.7 2.25 12 2.25Zm-5.2 10.1a1.35 1.35 0 1 1 0-2.7 1.35 1.35 0 0 1 0 2.7Zm3.2-3.5a1.35 1.35 0 1 1 0-2.7 1.35 1.35 0 0 1 0 2.7Zm4 0a1.35 1.35 0 1 1 0-2.7 1.35 1.35 0 0 1 0 2.7Zm3.2 3.5a1.35 1.35 0 1 1 0-2.7 1.35 1.35 0 0 1 0 2.7Z"
    />
  </svg>
)

const IconClipboardSolid = (props: SolidIconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M9 2.5c-.9 0-1.67.55-2 1.33H5.8c-1.55 0-2.8 1.25-2.8 2.8v13.9c0 1.55 1.25 2.8 2.8 2.8h12.4c1.55 0 2.8-1.25 2.8-2.8V6.63c0-1.55-1.25-2.8-2.8-2.8H17c-.33-.78-1.1-1.33-2-1.33H9Zm0 3.1c-.39 0-.7-.31-.7-.7s.31-.7.7-.7h6c.39 0 .7.31.7.7s-.31.7-.7.7H9Zm1.2 5.4h7.4a.75.75 0 0 1 0 1.5h-7.4a.75.75 0 0 1 0-1.5Zm0 3.6h7.4a.75.75 0 0 1 0 1.5h-7.4a.75.75 0 0 1 0-1.5Zm0 3.6h5.2a.75.75 0 0 1 0 1.5h-5.2a.75.75 0 0 1 0-1.5Z"
    />
  </svg>
)

const IconShieldCheckSolid = (props: SolidIconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M12 2.25c.15 0 .3.03.44.08l7.1 2.63c.6.22 1 .8 1 1.44v6.02c0 5.6-4.02 9.19-8.95 11.3a1.5 1.5 0 0 1-1.18 0C5.48 21.6 1.46 18.02 1.46 12.42V6.4c0-.64.4-1.22 1-1.44l7.1-2.63c.14-.05.29-.08.44-.08Zm3.42 8.1a.9.9 0 0 0-1.27 0l-3.03 3.03-1.24-1.24a.9.9 0 1 0-1.27 1.27l1.88 1.88c.35.35.92.35 1.27 0l3.66-3.66a.9.9 0 0 0 0-1.28Z"
    />
  </svg>
)

const IconDollarSolid = (props: SolidIconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M12 2.25c-5.38 0-9.75 4.37-9.75 9.75S6.62 21.75 12 21.75 21.75 17.38 21.75 12 17.38 2.25 12 2.25Zm.72 5.3c.76.11 1.5.44 2.09.97a.9.9 0 1 1-1.2 1.35c-.33-.3-.75-.46-1.2-.5v2.05l.43.1c2.06.46 2.9 1.57 2.9 2.98 0 1.55-1.12 2.68-3.33 2.93v.95a.9.9 0 0 1-1.8 0v-.98a4.63 4.63 0 0 1-2.68-1.25.9.9 0 1 1 1.25-1.3c.46.43 1.06.68 1.74.75v-2.2l-.62-.14c-1.95-.45-2.7-1.5-2.7-2.85 0-1.48 1.08-2.6 3.32-2.88V6.6a.9.9 0 0 1 1.8 0v.95Zm-1.8 1.95c-1.03.16-1.45.6-1.45 1.18 0 .52.33.9 1.45 1.17V9.5Zm1.8 6.48c.98-.15 1.52-.55 1.52-1.22 0-.58-.35-1.02-1.52-1.29v2.51Z"
    />
  </svg>
)

const IconMegaphoneSolid = (props: SolidIconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M20.8 7.1c.6.26.95.86.86 1.51l-1.02 7.25c-.1.69-.71 1.19-1.41 1.15l-4.19-.22-6.02 2.46a1.55 1.55 0 0 1-2.12-1.44v-2.03H5.1c-.85 0-1.55-.69-1.55-1.55V9.77c0-.86.7-1.55 1.55-1.55h1.8V6.2c0-1.1 1.13-1.84 2.12-1.44l6.02 2.46 4.19-.22c.2-.01.4.02.57.1ZM8.7 9.2v5.6l5.6-2.28v-1.04L8.7 9.2Zm0 8.73 2.12-.86-.74-1.35H8.7v2.21Z"
    />
  </svg>
)

const IconHospitalSolid = (props: SolidIconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M5.25 3.75c0-.83.67-1.5 1.5-1.5h10.5c.83 0 1.5.67 1.5 1.5V21.75h-4.5v-4.5H9.75v4.5h-4.5V3.75Zm6 4.2c0-.41.34-.75.75-.75h.5V6.7c0-.41.34-.75.75-.75s.75.34.75.75v.5h.5c.41 0 .75.34.75.75s-.34.75-.75.75h-.5v.5c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-.5h-.5a.75.75 0 0 1-.75-.75ZM8.4 11.7h2.1c.41 0 .75.34.75.75s-.34.75-.75.75H8.4a.75.75 0 0 1 0-1.5Zm5.1 0h2.1c.41 0 .75.34.75.75s-.34.75-.75.75h-2.1a.75.75 0 0 1 0-1.5Z"
    />
  </svg>
)

const IconChartSolid = (props: SolidIconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M5.25 3.75c.41 0 .75.34.75.75v14.25h14.25a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1-.75-.75V4.5c0-.41.34-.75.75-.75Zm13.68 4.4a.9.9 0 0 1 0 1.27l-4.52 4.52a.9.9 0 0 1-1.27 0l-2.1-2.1-2.4 2.4a.9.9 0 1 1-1.27-1.27l3.03-3.03a.9.9 0 0 1 1.27 0l2.1 2.1 3.89-3.89a.9.9 0 0 1 1.27 0Z"
    />
  </svg>
)

type Step = {
  icon: React.ComponentType<SolidIconProps>
  title: string
  description: string
}

const steps: Step[] = [
  {
    icon: IconPaletteSolid,
    title: "Product Design and Development",
    description:
      "Turn your concept into a viable health tech product. We help you work through prototype development, MVP development, architecture decisions, and interoperability requirements for a stronger technical foundation.",
  },
  {
    icon: IconClipboardSolid,
    title: "User Feedback",
    description:
      "Gather the validation evidence that clinicians, investors, and regulators need to see. We help you design and execute usability testing, human factors research, clinical pilots, and real-world evidence collection in a way that is both rigorous and compliant.",
  },
  {
    icon: IconShieldCheckSolid,
    title: "Regulatory and Legal Compliance",
    description:
      "We help you understand global privacy and security requirements, intellectual property protection, medical device classification, and governance frameworks specific to your target markets.",
  },
  {
    icon: IconDollarSolid,
    title: "Fundraising",
    description:
      "Whether you are exploring non-dilutive grants, angel investors, or venture capital, we help you show up with a stronger investor narrative and a data room that holds up to scrutiny.",
  },
  {
    icon: IconMegaphoneSolid,
    title: "Marketing and Commercial Strategy",
    description:
      "Build a brand that resonates inside healthcare and a go-to-market strategy that moves prospects through to sales. Credibility and clarity both matter more in this industry.",
  },
  {
    icon: IconHospitalSolid,
    title: "Navigating Healthcare Systems",
    description:
      "We help you understand hospital procurement processes, reimbursement pathways, and what it actually takes to drive adoption inside complex health systems.",
  },
  {
    icon: IconChartSolid,
    title: "Operations and Scaling",
    description:
      "Getting to launch is one milestone. Building a sustainable company is another. We help put the right foundations in place for better financial modeling, growth metrics, customer success, and hiring so the momentum you built can continue on.",
  },
]

/** lg 3-column: row 0 verticals between 0–1 (col0 r) and 1–2 (col2 l); top-right has no outer border-r; row 1 inner verticals + bottom; orphan last = L+R */
const lgCellBorderClass = (idx: number, n: number): string => {
  const isOrphanLast = idx === n - 1 && n % 3 === 1
  if (isOrphanLast) {
    return "lg:border-l lg:border-r lg:border-rellia-teal/25"
  }

  const row = Math.floor(idx / 3)
  const col = idx % 3
  const t = "lg:border-rellia-teal/25"

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
    return "md:border-l md:border-r md:border-rellia-teal/25"
  }

  const row = Math.floor(idx / 2)
  const col = idx % 2
  const t = "md:border-rellia-teal/25"

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
                              <Icon className="h-7 w-7 shrink-0 text-rellia-teal" aria-hidden="true" />
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
                              "max-w-[13ch] text-xl font-host-grotesk font-medium leading-snug sm:max-w-[14ch] md:max-w-[15ch] md:text-2xl md:leading-snug",
                              isOpen ? "text-white" : "text-rellia-teal",
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
