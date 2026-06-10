import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Rocket,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"

export type NetworkJumpSectionId = "founders" | "investors" | "advisors" | "partners"

const NETWORK_JUMP_LINKS: Array<{
  id: NetworkJumpSectionId
  numeral: string
  label: string
  icon: LucideIcon
  /** Dedicated role page (homepage tiles navigate here) */
  rolePath: string
}> = [
  { id: "founders", numeral: "01", label: "Founders", icon: Rocket, rolePath: "/founders" },
  { id: "advisors", numeral: "02", label: "Advisors", icon: GraduationCap, rolePath: "/advisors" },
  { id: "investors", numeral: "03", label: "Investors", icon: TrendingUp, rolePath: "/investors" },
  {
    id: "partners",
    numeral: "04",
    label: "Industry Partners",
    icon: Building2,
    rolePath: "/industry-partners",
  },
]

/** Smooth-scroll to a section on the Network page (fixed navbar ~92px). */
const handleScrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 92
  window.scrollTo({ top: y, behavior: "smooth" })
}

type NetworkJumpNavProps = {
  /**
   * samePage — `#id` + smooth scroll (Network hero).
   * networkRoute — role pages e.g. `/founders` (homepage paths section).
   */
  mode: "samePage" | "networkRoute"
  className?: string
  /**
   * darken — hover lowers background luminance (Network hero on photo).
   * lift — hover raises tile with shadow (plain / muted section backgrounds).
   */
  hoverVariant?: "darken" | "lift"
}

export default function NetworkJumpNav({ mode, className, hoverVariant }: NetworkJumpNavProps) {
  const resolvedHover = hoverVariant ?? (mode === "networkRoute" ? "lift" : "darken")

  const cellClassName = cn(
    "group flex flex-col gap-3 md:gap-4 lg:gap-5 bg-rellia-teal p-5 md:p-7 lg:p-9 outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2",
    mode === "samePage" ? "focus-visible:ring-offset-rellia-teal" : "focus-visible:ring-offset-rellia-cream",
    resolvedHover === "darken" && "transition-colors duration-200 hover:bg-rellia-teal/70",
    resolvedHover === "lift" &&
      "transition-[transform,box-shadow] duration-300 transition-timing-function-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_22px_44px_-14px_rgba(13,53,64,0.42)] active:translate-y-[-6px]",
  )
  const navChrome = cn(
    "grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden",
    mode === "samePage" ? "bg-white/15 border border-white/15" : "border border-rellia-teal/25 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.18)]",
    className,
  )

  return (
    <nav
      aria-label={mode === "samePage" ? "Jump to Network section" : "Network role pages"}
      className={navChrome}
    >
      {NETWORK_JUMP_LINKS.map(({ id, numeral, label, icon: Icon, rolePath }) =>
        mode === "samePage" ? (
          <a
            key={id}
            href={`#${id}`}
            className={cellClassName}
            onClick={(e) => {
              e.preventDefault()
              handleScrollToId(id)
            }}
          >
            <JumpNavCellContent
              numeral={numeral}
              label={label}
              Icon={Icon}
              footerLabel="Jump to section"
            />
          </a>
        ) : (
          <Link
            key={id}
            to={rolePath}
            className={cellClassName}
            aria-label={`${label} — open ${label} page`}
          >
            <JumpNavCellContent
              numeral={numeral}
              label={label}
              Icon={Icon}
              footerLabel="View page"
            />
          </Link>
        ),
      )}
    </nav>
  )
}

const JumpNavCellContent = ({
  numeral,
  label,
  Icon,
  footerLabel,
}: {
  numeral: string
  label: string
  Icon: LucideIcon
  footerLabel: string
}) => (
  <>
    <div className="flex items-center justify-between">
      <span className="font-host-grotesk text-xs lg:text-sm font-semibold tracking-[0.18em] text-rellia-mint">
        {numeral}
      </span>
      <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-rellia-mint/80" strokeWidth={1.75} aria-hidden />
    </div>
    <span className="font-host-grotesk text-base md:text-xl lg:text-2xl font-semibold text-white leading-tight">
      {label}
    </span>
    <div className="mt-auto w-full">
      <div className="relative h-px w-full overflow-hidden rounded-full bg-white/18">
        <div
          aria-hidden
          className="h-full w-full origin-left scale-x-0 bg-rellia-mint transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-x-100"
        />
      </div>
      <span className="mt-3 inline-flex items-center gap-1 font-urbanist text-[13px] lg:text-sm text-white/70 transition-colors group-hover:text-rellia-mint">
        {footerLabel}
        <ArrowRight className="h-3.5 w-3.5 lg:h-4 lg:w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
      </span>
    </div>
  </>
)
