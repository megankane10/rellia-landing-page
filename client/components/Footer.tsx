import * as React from "react"
import { Link } from "react-router-dom"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"
import { CareersHiringBadge } from "@/components/CareersHiringBadge"
import { InstagramFilled, LinkedInFilled, MailFilled } from "@/components/icons/SocialIcons"
import { useGlobalSettings, useNavigation } from "@/hooks/useCmsDocuments"
import type { NavItem } from "@shared/cms/types"
import { GETPROVEN_VENDORS_GRID_URL } from "@/config/partnerLinks"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

const SAFDAR_LINKEDIN_URL = "https://www.linkedin.com/in/safdarmd/"

const isExternalHref = (href: string) => /^(https?:\/\/|mailto:|tel:)/i.test(href)

const normalizeInternalHref = (href: string) => {
  const trimmed = href.trim()
  if (!trimmed) return "/"
  if (isExternalHref(trimmed)) return trimmed
  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  if (normalized === "/diagnostic-survey" || normalized === "/survey" || normalized === "/diagnostics") {
    return "/startup-diagnostic"
  }
  return normalized
}

const FALLBACK_FOOTER_COLUMNS: NavItem[] = [
  {
    label: "Solutions",
    href: "/",
    children: [
      { label: "Apply", href: "/apply" },
      { label: "Programs", href: "/programs" },
      { label: "Events", href: "/events" },
      { label: "Startup Diagnostic", href: "/startup-diagnostic" },
      { label: "Consulting", href: "/consulting" },
    ],
  },
  {
    label: "Network",
    href: "/founders",
    children: [
      { label: "Founders", href: "/founders" },
      { label: "Advisors", href: "/advisors" },
      { label: "Investors", href: "/investors" },
      { label: "Explore Industry Partners", href: GETPROVEN_VENDORS_GRID_URL },
    ],
  },
  {
    label: "Resources",
    href: "/stories",
    children: [
      { label: "Stories", href: "/stories" },
      { label: "Explore Alumni", href: "/founders/alumni" },
      { label: "Explore Advisors", href: "/advisors/directory" },
      { label: "Explore Industry Partners", href: GETPROVEN_VENDORS_GRID_URL },
    ],
  },
  {
    label: "Company",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
    ],
  },
] as const

const footerLinkClass =
  "font-urbanist text-[14px] leading-snug text-white transition-colors hover:text-rellia-mint md:text-[15px] md:leading-normal"

const footerSectionHeadingClass =
  "font-host-grotesk text-[14px] font-semibold leading-snug tracking-normal text-rellia-mint md:text-[15px] md:leading-normal"

const legalLinkClass =
  "font-urbanist text-[13px] leading-snug text-white/70 transition-colors hover:text-rellia-mint md:text-sm"

const BUILT_BY_SWEEP_REVERSE_MS = 1_400

type BuiltBySweepPhase = "idle" | "forward" | "reverse"

const BuiltByCredit = () => {
  const [showTooltip, setShowTooltip] = React.useState(false)
  const [sweepPhase, setSweepPhase] = React.useState<BuiltBySweepPhase>("idle")
  const sweepTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchDismissTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearSweepTimer = () => {
    if (sweepTimerRef.current) {
      clearTimeout(sweepTimerRef.current)
      sweepTimerRef.current = null
    }
  }

  const clearTouchDismissTimer = () => {
    if (touchDismissTimerRef.current) {
      clearTimeout(touchDismissTimerRef.current)
      touchDismissTimerRef.current = null
    }
  }

  const handlePointerEnter = () => {
    clearSweepTimer()
    clearTouchDismissTimer()
    setSweepPhase("forward")
    setShowTooltip(true)
  }

  const handlePointerLeave = () => {
    clearSweepTimer()
    clearTouchDismissTimer()
    setSweepPhase("reverse")
    setShowTooltip(false)
    sweepTimerRef.current = setTimeout(() => {
      setSweepPhase("idle")
      sweepTimerRef.current = null
    }, BUILT_BY_SWEEP_REVERSE_MS)
  }

  React.useEffect(
    () => () => {
      clearSweepTimer()
      clearTouchDismissTimer()
    },
    [],
  )

  return (
    <span className="relative inline-flex">
      <a
        href={SAFDAR_LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="built-by-credit rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal"
        aria-label="Built by Safdar — let's connect on LinkedIn"
        aria-describedby={showTooltip ? "built-by-safdar-tooltip" : undefined}
        onMouseEnter={handlePointerEnter}
        onMouseLeave={handlePointerLeave}
        onFocus={handlePointerEnter}
        onBlur={handlePointerLeave}
        onTouchStart={() => {
          handlePointerEnter()
        }}
        onTouchEnd={() => {
          clearTouchDismissTimer()
          touchDismissTimerRef.current = setTimeout(() => {
            handlePointerLeave()
            touchDismissTimerRef.current = null
          }, 2000)
        }}
      >
        <span className="built-by-credit-label">
          <span className="built-by-credit-base" aria-hidden="true">
            Built by <span className="built-by-name">Safdar</span>
          </span>
          <span
            className={cn(
              "built-by-credit-sweep",
              sweepPhase === "forward" && "built-by-credit-sweep--forward",
              sweepPhase === "reverse" && "built-by-credit-sweep--reverse",
            )}
            aria-hidden="true"
          >
            Built by <span className="built-by-name">Safdar</span>
          </span>
          <span className="sr-only">Built by Safdar</span>
        </span>
      </a>
      <span
        id="built-by-safdar-tooltip"
        role="tooltip"
        aria-hidden={!showTooltip}
        className={cn("built-by-tooltip", showTooltip && "built-by-tooltip--visible")}
      >
        <span className="built-by-tooltip-inner">
          Let&apos;s connect on LinkedIn
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        </span>
      </span>
    </span>
  )
}

export default function Footer() {
  const { data: globalSettingsData } = useGlobalSettings()
  const { data: navigationData } = useNavigation()
  const g = globalSettingsData ?? DEFAULT_GLOBAL_SETTINGS

  const hasStructuredFooter =
    Array.isArray(navigationData?.footer) &&
    navigationData.footer.length > 0 &&
    navigationData.footer.some((item) => Array.isArray(item?.children) && item.children.length > 0)

  const footerColumnsRaw = hasStructuredFooter
    ? (navigationData?.footer ?? FALLBACK_FOOTER_COLUMNS)
    : FALLBACK_FOOTER_COLUMNS

  const footerColumns = footerColumnsRaw
    .filter((i): i is NavItem => Boolean(i && i.enabled !== false && typeof i.label === "string" && typeof i.href === "string"))
    .map((col) => ({
      label: col.label,
      href: normalizeInternalHref(col.href),
      children: Array.isArray(col.children)
        ? col.children
            .filter((c): c is NavItem => Boolean(c && c.enabled !== false && typeof c.label === "string" && typeof c.href === "string"))
            .map((c) => ({ label: c.label, href: normalizeInternalHref(c.href) }))
        : [],
    }))

  return (
    <footer
      className="p-2 sm:p-4 md:p-[30px]"
      style={{ backgroundColor: "var(--footer-backdrop, transparent)" }}
    >
      <div className="w-full rounded-2xl border border-white/10 bg-rellia-teal text-white shadow-[0_28px_80px_-40px_rgba(13,53,64,0.55)] md:rounded-[28px]">
        <div className="px-4 pt-9 pb-7 md:px-10 md:pt-14 md:pb-11 lg:px-12">
          {/* Mobile header (logo + tagline first) */}
          <div className="mb-10 flex flex-col items-start gap-4 text-left md:hidden">
            <Link to="/" className="flex items-center justify-start">
              <img src="/images/hologram-logo.png" alt="Rellia" className="h-9 w-auto md:h-10" />
            </Link>
            <p className="font-urbanist text-[14px] leading-snug text-white md:text-[15px] md:leading-relaxed">
              {g.footerTagline}
            </p>
          </div>

          <div className="mb-8 flex flex-col gap-10 md:mb-10 md:flex-row md:items-start md:gap-16 lg:gap-24 xl:gap-28">
            <div className="hidden min-w-0 flex-col gap-6 md:flex md:max-w-[280px] md:shrink-0">
              <Link to="/" className="flex items-center">
                <img src="/images/hologram-logo.png" alt="Rellia" className="h-10 w-auto" />
              </Link>
              <p className="max-w-[280px] font-urbanist text-[15px] leading-relaxed text-white">{g.footerTagline}</p>
              <div className="flex gap-4">
                <a
                  href={g.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-full bg-white/5 p-2 transition-all duration-300 hover:bg-rellia-mint"
                  aria-label="Rellia Health on LinkedIn"
                >
                  <LinkedInFilled className="h-5 w-5 text-white/85 transition-colors duration-300 group-hover:text-rellia-teal" />
                </a>
                <a
                  href={g.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-full bg-white/5 p-2 transition-all duration-300 hover:bg-rellia-mint"
                  aria-label="Rellia Health on Instagram"
                >
                  <InstagramFilled className="h-5 w-5 text-white/85 transition-colors duration-300 group-hover:text-rellia-teal" />
                </a>
                <a
                  href={`mailto:${g.supportEmail}`}
                  className="group rounded-full bg-white/5 p-2 transition-all duration-300 hover:bg-rellia-mint"
                  aria-label={`Email ${g.supportEmail}`}
                >
                  <MailFilled className="h-5 w-5 text-white/85 transition-colors duration-300 group-hover:text-rellia-teal" />
                </a>
              </div>
            </div>

            <div
              className={`grid min-w-0 flex-1 grid-cols-2 gap-x-8 gap-y-10 sm:gap-x-10 md:gap-x-12 md:pl-6 lg:gap-x-8 lg:pl-10 xl:gap-x-12 xl:pl-14 ${
                footerColumns.length >= 4 ? "md:grid-cols-4" : 
                footerColumns.length === 3 ? "md:grid-cols-3" : 
                "md:grid-cols-2"
              }`}
            >
              {footerColumns.map((col) => {
                const links = col.children.length > 0 ? col.children : [{ label: col.label, href: col.href }]
                return (
                  <div key={col.label} className="flex min-w-0 flex-col gap-4 md:gap-6">
                    <h4 className={footerSectionHeadingClass}>{col.label}</h4>
                    <nav className="flex flex-col gap-2 md:gap-3" aria-label={`${col.label} links`}>
                      {links.map((l) => {
                        if (isExternalHref(l.href)) {
                          const isIndustryPartnersDirectory =
                            col.label === "Resources" && l.href === GETPROVEN_VENDORS_GRID_URL
                          const isMailToOrTel = /^(mailto:|tel:)/i.test(l.href)
                          return (
                            <a
                              key={l.href}
                              href={l.href}
                              target={isMailToOrTel ? undefined : "_blank"}
                              rel={isMailToOrTel ? undefined : "noopener noreferrer"}
                              className={`inline-flex items-center gap-1.5 ${footerLinkClass}`}
                            >
                              <span>{isIndustryPartnersDirectory ? "Explore Industry Partners" : l.label}</span>
                              {isIndustryPartnersDirectory ? (
                                <ArrowUpRight className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                              ) : null}
                            </a>
                          )
                        }
                        return l.href === "/careers" ? (
                          <Link
                            key={l.href}
                            to={l.href}
                            className={`inline-flex max-w-full flex-wrap items-center gap-2 ${footerLinkClass}`}
                          >
                            <span>{l.label}</span>
                            <CareersHiringBadge />
                          </Link>
                        ) : (
                          <Link key={l.href} to={l.href} className={footerLinkClass}>
                            {l.label}
                          </Link>
                        )
                      })}
                    </nav>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mb-4 flex flex-col items-center justify-center gap-4 md:hidden">
            <div className="flex items-center justify-center gap-3">
              <a
                href={g.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-full bg-white/5 p-2 transition-all duration-300 hover:bg-rellia-mint"
                aria-label="Rellia Health on LinkedIn"
              >
                <LinkedInFilled className="h-5 w-5 text-white/85 transition-colors duration-300 group-hover:text-rellia-teal" />
              </a>
              <a
                href={g.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-full bg-white/5 p-2 transition-all duration-300 hover:bg-rellia-mint"
                aria-label="Rellia Health on Instagram"
              >
                <InstagramFilled className="h-5 w-5 text-white/85 transition-colors duration-300 group-hover:text-rellia-teal" />
              </a>
              <a
                href={`mailto:${g.supportEmail}`}
                className="group rounded-full bg-white/5 p-2 transition-all duration-300 hover:bg-rellia-mint"
                aria-label={`Email ${g.supportEmail}`}
              >
                <MailFilled className="h-5 w-5 text-white/85 transition-colors duration-300 group-hover:text-rellia-teal" />
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 md:pt-5">
            <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[1fr_auto_1fr] md:gap-6">
              <p className="text-center font-urbanist text-[13px] leading-snug text-white/55 md:text-left md:text-sm order-2 md:order-none">
                &copy; {new Date().getFullYear()} {g.copyrightLine} Ontario, Canada
              </p>

              <div className="flex justify-center md:px-4 order-1 md:order-none">
                <BuiltByCredit />
              </div>

              <nav
                className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:justify-end lg:gap-x-8 order-3 md:order-none"
                aria-label="Legal"
              >
                <Link to="/terms" className={legalLinkClass}>
                  Terms of Service
                </Link>
                <span className="text-white/25 select-none" aria-hidden>
                  |
                </span>
                <Link to="/privacy" className={legalLinkClass}>
                  Privacy Policy
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
