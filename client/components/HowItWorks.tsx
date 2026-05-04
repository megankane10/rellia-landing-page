import type { ReactNode } from "react"
import {
  Activity,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  DollarSign,
  Megaphone,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import ScrollReveal from "./ScrollReveal"
import { cn } from "@/lib/utils"

export type HowItWorksStep = {
  icon: LucideIcon
  title: string
  description: string
}

const defaultSteps: HowItWorksStep[] = [
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

export type HowItWorksProps = {
  /** When set, replaces the default “How we help you…” heading block */
  heading?: ReactNode
  /** Subcopy under the heading */
  subheading?: ReactNode
  /** Custom steps (e.g. careers perks). When omitted, uses the homepage roadmap grid */
  steps?: HowItWorksStep[]
  /** Homepage uses 3 columns on large screens; careers uses 2×2 */
  columns?: 2 | 3
}

export default function HowItWorks(props?: HowItWorksProps) {
  const { heading, subheading, steps: stepsProp, columns: columnsProp } = props ?? {}
  const steps = stepsProp ?? defaultSteps
  /** Careers-style overrides default to 2 columns; homepage keeps three-up on large screens */
  const columns = columnsProp ?? (stepsProp != null ? 2 : 3)

  return (
    <section className="relative w-full bg-rellia-teal py-16 md:py-24 px-6 md:px-10 overflow-hidden">
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
      <div className="relative z-10 max-w-[1300px] mx-auto">
        {/* Abstract linework behind heading */}
        <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-[320px] w-[520px] -translate-x-[260px]">
          {/* Dense vertical line stack, anchored to far-left with overflow */}
          <div className="absolute left-0 top-0 h-full w-full">
            <div className="absolute left-6 top-6 h-[260px] w-[2px] bg-gradient-to-b from-rellia-mint/35 via-white/10 to-transparent" />
            <div className="absolute left-10 top-10 h-[240px] w-px bg-gradient-to-b from-white/18 via-white/8 to-transparent" />
            <div className="absolute left-14 top-4 h-[280px] w-[2px] bg-gradient-to-b from-rellia-mint/22 via-rellia-mint/10 to-transparent" />
            <div className="absolute left-20 top-8 h-[250px] w-px bg-gradient-to-b from-white/14 via-white/6 to-transparent" />
            <div className="absolute left-26 top-14 h-[220px] w-[2px] bg-gradient-to-b from-rellia-mint/18 via-white/8 to-transparent" />
            <div className="absolute left-32 top-2 h-[292px] w-px bg-gradient-to-b from-white/12 via-white/5 to-transparent" />
            <div className="absolute left-38 top-18 h-[210px] w-[2px] bg-gradient-to-b from-rellia-mint/14 via-rellia-mint/7 to-transparent" />
            <div className="absolute left-44 top-8 h-[250px] w-px bg-gradient-to-b from-white/10 via-white/4 to-transparent" />
            <div className="absolute left-52 top-22 h-[200px] w-[2px] bg-gradient-to-b from-rellia-mint/12 via-white/6 to-transparent" />
            <div className="absolute left-60 top-6 h-[260px] w-px bg-gradient-to-b from-white/9 via-white/3 to-transparent" />
            <div className="absolute left-66 top-16 h-[220px] w-[2px] bg-gradient-to-b from-rellia-mint/10 via-rellia-mint/6 to-transparent" />
            <div className="absolute left-72 top-10 h-[240px] w-px bg-gradient-to-b from-white/8 via-white/3 to-transparent" />
            <div className="absolute left-80 top-24 h-[190px] w-[2px] bg-gradient-to-b from-rellia-mint/9 via-white/5 to-transparent" />
            <div className="absolute left-88 top-14 h-[220px] w-px bg-gradient-to-b from-white/7 via-white/2 to-transparent" />
          </div>
        </div>

        <ScrollReveal delay={0.1}>
          <div className="mb-16 md:mb-20">
            {heading ?? (
              <h2 className="font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-white md:text-[40px]">
                How we help you <span className="text-rellia-mint">move faster</span>
              </h2>
            )}
            {subheading ?? (
              <p className="mt-4 font-urbanist text-base font-medium leading-relaxed tracking-tight text-white/80 md:text-lg">
                Healthcare commercialization has different rules. We give you targeted guidance in the areas that unlock
                the next milestone.
              </p>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div
            className={cn(
              "grid w-full grid-cols-1 justify-items-start gap-6 md:grid-cols-2 md:gap-7",
              columns === 3 && "lg:grid-cols-3 lg:gap-8",
            )}
          >
            {steps.map((step) => {
              const Icon = step.icon

              return (
                <div
                  key={step.title}
                  className="flex h-[200px] w-full max-w-[320px] flex-col px-1 md:px-2"
                >
                  <Icon className="h-7 w-7 text-rellia-mint" aria-hidden />
                  <p className="mt-5 font-host-grotesk text-lg font-semibold leading-snug tracking-tight text-white line-clamp-2">
                    {step.title}
                  </p>
                  <p className="mt-3 font-urbanist text-sm leading-relaxed text-white/80 line-clamp-3">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
