import { Link } from "react-router-dom"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"
import { CareersHiringBadge } from "@/components/CareersHiringBadge"
import { InstagramFilled, LinkedInFilled, MailFilled } from "@/components/icons/SocialIcons"
import { useGlobalSettings, useNavigation } from "@/hooks/useCmsDocuments"
import type { NavItem } from "@shared/cms/types"

const isExternalHref = (href: string) => /^(https?:\/\/|mailto:|tel:)/i.test(href)

const normalizeInternalHref = (href: string) => {
  const trimmed = href.trim()
  if (!trimmed) return "/"
  if (isExternalHref(trimmed)) return trimmed
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

const FALLBACK_FOOTER_COLUMNS: NavItem[] = [
  {
    label: "Solutions",
    href: "/",
    children: [
      { label: "Apply", href: "/apply" },
      { label: "Programs", href: "/programs" },
      { label: "Events", href: "/events" },
      { label: "Startup Diagnostic", href: "/diagnostic-survey" },
      { label: "Consulting", href: "/consulting" },
    ],
  },
  {
    label: "Network",
    href: "/network",
    children: [
      { label: "Founders", href: "/founders" },
      { label: "Advisors", href: "/advisors" },
      { label: "Investors", href: "/investors" },
      { label: "Industry Partners", href: "/industry-partners" },
    ],
  },
  {
    label: "Resources",
    href: "/stories",
    children: [
      { label: "Stories", href: "/stories" },
      { label: "Explore Alumni", href: "/founders/alumni" },
      { label: "Explore Advisors", href: "/advisors/directory" },
      { label: "Industry Partners Directory", href: "https://proven.cc/rellia-health" },
    ],
  },
  {
    label: "Company",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const

const footerLinkClass =
  "font-urbanist text-[14px] leading-snug text-white transition-colors hover:text-rellia-mint md:text-[15px] md:leading-normal"

const footerSectionHeadingClass =
  "font-host-grotesk text-[14px] font-semibold leading-snug tracking-normal text-rellia-mint md:text-[15px] md:leading-normal"

const legalLinkClass =
  "font-urbanist text-[13px] leading-snug text-white/70 transition-colors hover:text-rellia-mint md:text-sm"

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
        <div className="px-4 py-10 md:px-10 md:py-16 lg:px-12">
          {/* Mobile header (logo + tagline first) */}
          <div className="mb-10 flex flex-col items-start gap-4 text-left md:hidden">
            <Link to="/" className="flex items-center justify-start">
              <img src="/images/hologram-logo.png" alt="Rellia" className="h-9 w-auto md:h-10" />
            </Link>
            <p className="font-urbanist text-[14px] leading-snug text-white md:text-[15px] md:leading-relaxed">
              {g.footerTagline}
            </p>
          </div>

          <div className="mb-14 flex flex-col gap-10 md:mb-16 md:flex-row md:items-start md:gap-16 lg:gap-24 xl:gap-28">
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
                  className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
                  aria-label="Rellia Health on LinkedIn"
                >
                  <LinkedInFilled className="h-5 w-5 text-white/85" />
                </a>
                <a
                  href={g.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
                  aria-label="Rellia Health on Instagram"
                >
                  <InstagramFilled className="h-5 w-5 text-white/85" />
                </a>
                <a
                  href={`mailto:${g.supportEmail}`}
                  className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
                  aria-label={`Email ${g.supportEmail}`}
                >
                  <MailFilled className="h-5 w-5 text-white/85" />
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
                          return (
                            <a
                              key={l.href}
                              href={l.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={footerLinkClass}
                            >
                              {l.label}
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

          {/* Mobile socials after links, before divider */}
          <div className="mb-10 flex items-center justify-center gap-3 md:mb-12 md:hidden">
            <a
              href={g.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
              aria-label="Rellia Health on LinkedIn"
            >
              <LinkedInFilled className="h-5 w-5 text-white/85" />
            </a>
            <a
              href={g.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
              aria-label="Rellia Health on Instagram"
            >
              <InstagramFilled className="h-5 w-5 text-white/85" />
            </a>
            <a
              href={`mailto:${g.supportEmail}`}
              className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
              aria-label={`Email ${g.supportEmail}`}
            >
              <MailFilled className="h-5 w-5 text-white/85" />
            </a>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between md:pt-8">
            <p className="text-center font-urbanist text-[13px] leading-snug text-white/55 sm:text-left md:text-sm">
              &copy; {new Date().getFullYear()} {g.copyrightLine} Ontario, Canada
            </p>
            <nav
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end lg:gap-x-8"
              aria-label="Legal"
            >
              <Link to="/terms" className={legalLinkClass}>
                Terms of Service
              </Link>
              <Link to="/privacy" className={legalLinkClass}>
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
