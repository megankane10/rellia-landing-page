import type { ReactNode } from "react"
import { useRef } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export type MembershipPathStep = {
  title: string
  description: string
}

const MEMBERSHIP_PATH_STEPS = [
  {
    title: "Submit Application",
    description:
      "Complete the application. Our team reviews every submission to keep the network valuable for every member.",
  },
  {
    title: "Review & Approval",
    description:
      "We’ll review your background and goals. You’ll hear from us by email within a few business days.",
  },
  {
    title: "Secure Your Spot",
    description:
      "Once approved, you’ll get a link to choose your membership and complete payment.",
  },
  {
    title: "Join the Network",
    description: "Get immediate access to the community, resources, and network benefits.",
  },
] as const

const ROLE_LINKS = [
  {
    title: "Founders",
    description: "Programs, cohorts, and support for health tech builders.",
    to: "/founders",
  },
  {
    title: "Advisors",
    description: "How we work with operators, clinicians, and domain experts.",
    to: "/advisors",
  },
  {
    title: "Investors",
    description: "Deal flow, diligence, and how we connect capital to the network.",
    to: "/investors",
  },
  {
    title: "Industry partners",
    description: "Collaboration models for organizations backing the ecosystem.",
    to: "/industry-partners",
  },
] as const

const RELLIA_TEAL = "#0D3540"

const stepCircleBaseClass =
  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-rellia-teal font-host-grotesk text-base font-semibold shadow-sm"

export type MembershipPathTimelineProps = {
  /** Section wrapper classes */
  className?: string
  showHeading?: boolean
  headingId?: string
  headingTitle?: ReactNode
  subheading?: string
  showRoleLinks?: boolean
  /** Override default membership steps (e.g. consulting pathway) */
  steps?: readonly MembershipPathStep[]
  /** Accessible name for the step list */
  timelineAriaLabel?: string
  /** Horizontal timeline from `md` (e.g. consulting’s 3 steps); default membership keeps vertical until `lg` when there are 4 steps */
  horizontalFromMd?: boolean
  /** Rendered after the numbered steps, before “Learn more about your role” (e.g. secondary CTA). */
  belowTimeline?: ReactNode
  /** Rendered in the section header after the subheading (e.g. primary CTA left-aligned under intro copy). */
  headingFooter?: ReactNode
}

const defaultHeadingTitle = (
  <>
    Path to <span className="text-rellia-teal">Membership</span>
  </>
)

const defaultSubheading =
  "What happens after you apply—from submission to joining—and tailored links below if you want more detail for your role before you hear back."

const MembershipPathTimeline = ({
  className,
  showHeading = true,
  headingId = "membership-path-heading",
  headingTitle = defaultHeadingTitle,
  subheading = defaultSubheading,
  showRoleLinks = true,
  steps,
  timelineAriaLabel = "Membership application steps",
  horizontalFromMd = false,
  belowTimeline,
  headingFooter,
}: MembershipPathTimelineProps = {}) => {
  const stepsToRender = steps ?? MEMBERSHIP_PATH_STEPS
  const stepCount = stepsToRender.length
  const showDesktopHorizontal = stepCount === 4 && !horizontalFromMd
  const showMdHorizontalRow = horizontalFromMd && stepCount > 0
  const timelineRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(timelineRef, { once: true, margin: "-10% 0px -12% 0px" })
  const reduceMotion = useReducedMotion()
  const instant = Boolean(reduceMotion)

  const lineTransition = {
    duration: instant ? 0 : 0.95,
    delay: instant ? 0 : 0.08,
    ease: [0.22, 1, 0.36, 1] as const,
  }

  const circleFillTransition = (index: number) => ({
    duration: instant ? 0 : 0.38,
    delay: instant ? 0 : 0.14 + index * 0.18,
    ease: [0.33, 1, 0.68, 1] as const,
  })

  const stepRiseTransition = (index: number) => ({
    duration: instant ? 0 : 0.42,
    delay: instant ? 0 : 0.06 + index * 0.1,
    ease: [0.22, 1, 0.36, 1] as const,
  })

  const circleAnimate = isInView
    ? { backgroundColor: RELLIA_TEAL, color: "#ffffff", borderColor: RELLIA_TEAL }
    : { backgroundColor: "#ffffff", color: RELLIA_TEAL, borderColor: RELLIA_TEAL }

  return (
    <section
      aria-labelledby={showHeading ? headingId : undefined}
      className={cn(
        "w-full border-t border-black/8 bg-rellia-cream/25 px-6 py-14 md:px-10 md:py-20 lg:py-24",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1300px] text-left">
        {showHeading ? (
          <header
            className={cn(
              "max-w-3xl",
              headingFooter ? "pb-14 md:pb-16 lg:pb-20" : "pb-8 md:pb-10 lg:pb-12",
            )}
          >
            <h2
              id={headingId}
              className="font-host-grotesk text-3xl font-semibold leading-tight tracking-tight text-black md:text-4xl lg:text-[2.75rem]"
            >
              {headingTitle}
            </h2>
            <p className="mt-4 font-urbanist text-base leading-relaxed text-black/70 md:text-lg md:leading-relaxed">
              {subheading}
            </p>
            {headingFooter ? (
              <div className="mt-6 flex w-full justify-start md:mt-8">{headingFooter}</div>
            ) : null}
          </header>
        ) : null}

        <div ref={timelineRef}>
          {/* Mobile / narrow: vertical spine through circles; number left, copy beside */}
          <div
            className={cn(
              "relative",
              showMdHorizontalRow ? "md:hidden" : "",
              showDesktopHorizontal ? "lg:hidden" : "",
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-4 left-[1.25rem] top-[1.25rem] w-0.5 -translate-x-1/2 rounded-full bg-black/10"
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute bottom-4 left-[1.25rem] top-[1.25rem] w-0.5 -translate-x-1/2 origin-top rounded-full bg-rellia-teal"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={lineTransition}
            />
            <ol className="relative z-[1] m-0 list-none space-y-8 p-0" aria-label={timelineAriaLabel}>
              {stepsToRender.map((step, index) => (
                <motion.li
                  key={step.title}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 22 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
                  transition={stepRiseTransition(index)}
                >
                  <motion.span
                    className={cn(stepCircleBaseClass, "bg-white")}
                    initial={false}
                    animate={circleAnimate}
                    transition={circleFillTransition(index)}
                    aria-hidden
                  >
                    {index + 1}
                  </motion.span>
                  <div className="min-w-0 flex-1 pt-0.5 text-left">
                    <h3 className="font-host-grotesk text-base font-semibold leading-snug text-black sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 font-urbanist text-sm leading-relaxed text-black/70">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Tablet/desktop: horizontal row (consulting & similar — any step count) */}
          <div className={cn("relative", showMdHorizontalRow ? "hidden md:block" : "hidden")}>
            <div
              aria-hidden
              className="pointer-events-none absolute top-[1.25rem] h-0.5 -translate-y-1/2 bg-black/10"
              style={{
                left: "20px",
                width: `calc(100% * ${stepCount - 1} / ${stepCount})`,
              }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-[1.25rem] h-0.5 -translate-y-1/2 origin-left bg-rellia-teal"
              style={{
                left: "20px",
                width: `calc(100% * ${stepCount - 1} / ${stepCount})`,
              }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={lineTransition}
            />
            <div
              role="list"
              aria-label={timelineAriaLabel}
              className="relative z-[1] grid gap-5 xl:gap-8"
              style={{ gridTemplateColumns: `repeat(${stepCount}, minmax(0, 1fr))` }}
            >
              {stepsToRender.map((step, index) => (
                <motion.div
                  key={step.title}
                  role="listitem"
                  className="flex min-w-0 flex-col items-start text-left"
                  initial={{ opacity: 0, y: 26 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                  transition={stepRiseTransition(index)}
                >
                  <motion.span
                    className={cn(stepCircleBaseClass, "bg-white")}
                    initial={false}
                    animate={circleAnimate}
                    transition={circleFillTransition(index)}
                    aria-hidden
                  >
                    {index + 1}
                  </motion.span>
                  <h3 className="mt-5 w-full font-host-grotesk text-base font-semibold leading-snug text-black xl:text-lg">
                    {step.title}
                  </h3>
                  <p className="mt-2 w-full font-urbanist text-sm leading-relaxed text-black/70">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Large desktop: four-column membership path */}
          <div className={cn("relative", showDesktopHorizontal ? "hidden lg:block" : "hidden")}>
            <div
              aria-hidden
              className="pointer-events-none absolute left-[20px] top-[1.25rem] h-0.5 w-[75%] -translate-y-1/2 bg-black/10"
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-[20px] top-[1.25rem] h-0.5 w-[75%] -translate-y-1/2 origin-left bg-rellia-teal"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={lineTransition}
            />
            <div
              role="list"
              aria-label={timelineAriaLabel}
              className="relative z-[1] grid grid-cols-4 gap-5 xl:gap-8"
            >
              {stepsToRender.map((step, index) => (
                <motion.div
                  key={step.title}
                  role="listitem"
                  className="flex min-w-0 flex-col items-start text-left"
                  initial={{ opacity: 0, y: 26 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                  transition={stepRiseTransition(index)}
                >
                  <motion.span
                    className={cn(stepCircleBaseClass, "bg-white")}
                    initial={false}
                    animate={circleAnimate}
                    transition={circleFillTransition(index)}
                    aria-hidden
                  >
                    {index + 1}
                  </motion.span>
                  <h3 className="mt-5 w-full font-host-grotesk text-base font-semibold leading-snug text-black xl:text-lg">
                    {step.title}
                  </h3>
                  <p className="mt-2 w-full font-urbanist text-sm leading-relaxed text-black/70">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {belowTimeline ? (
          <div className="mt-12 flex w-full justify-center md:mt-16 lg:mt-20">{belowTimeline}</div>
        ) : null}

        {showRoleLinks ? (
          <div
            className={cn(
              belowTimeline
                ? "mt-12 md:mt-16 lg:mt-20"
                : headingFooter
                  ? "mt-10 md:mt-12 lg:mt-16"
                  : "mt-20 md:mt-28 lg:mt-36",
            )}
          >
            <h3 className="font-host-grotesk text-lg font-semibold tracking-tight text-black md:text-xl">
              Learn more about your role
            </h3>

            <ul className="mt-8 grid grid-cols-1 gap-3 md:mt-10 md:grid-cols-4 md:gap-4 lg:gap-5">
              {ROLE_LINKS.map((role) => (
              <li key={role.to} className="min-w-0">
                <Link
                  to={role.to}
                  className={cn(
                    "group flex h-full min-h-0 flex-col rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition md:min-h-[8.5rem] md:p-5",
                    "hover:border-rellia-teal/35 hover:shadow-md",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2",
                  )}
                >
                  <span className="font-host-grotesk text-base font-semibold text-black group-hover:text-rellia-teal md:text-lg">
                    {role.title}
                  </span>
                  <span className="mt-2 flex-1 font-urbanist text-sm leading-relaxed text-black/65 md:mt-2">
                    {role.description}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1.5 font-urbanist text-sm font-semibold text-rellia-teal md:mt-4">
                    View page
                    <ArrowRight
                      className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default MembershipPathTimeline
