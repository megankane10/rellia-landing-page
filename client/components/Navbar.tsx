import { useMemo, useState, useEffect, useCallback, useRef, type KeyboardEvent } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { DEFAULT_GLOBAL_SETTINGS, DEFAULT_HOME_PAGE } from "@shared/cms/defaults"
import { useGlobalSettings, useHomePage, useNavigation, useSiteSettings } from "@/hooks/useCmsDocuments"
import { CareersHiringBadge } from "@/components/CareersHiringBadge"
import { InstagramFilled, LinkedInFilled, MailFilled } from "@/components/icons/SocialIcons"
import type { NavItem } from "@shared/cms/types"

const LOGO_DEFAULT = "/images/logo-rellia-footer.webp"
/** Wordmark for transparent bar on light heroes (FAQ, story posts) */
const LOGO_FILLED = "/images/logo-rellia-filled.webp"

const FALLBACK_NAV_PRIMARY: NavItem[] = [
  { label: "Programs", href: "/programs" },
  { label: "Events", href: "/events" },
  {
    label: "Network",
    href: "/network",
    children: [
      { label: "Founders", href: "/founders" },
      { label: "Investors", href: "/investors" },
      { label: "Industry partners", href: "/industry-partners" },
      { label: "Advisors", href: "/advisors" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Stories", href: "/stories" },
      { label: "Careers", href: "/careers" },
    ],
  },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const

const mergePrimaryNav = (primary: NavItem[] | undefined): NavItem[] => {
  const incoming = Array.isArray(primary) ? primary : []
  if (incoming.length === 0) return [...FALLBACK_NAV_PRIMARY]

  const byHref = new Map<string, NavItem>()
  for (const item of incoming) {
    if (!item?.href || !item?.label) continue
    const key = item.href.trim().toLowerCase()
    if (!key) continue
    byHref.set(key, item)
  }

  const merged: NavItem[] = []
  for (const fallback of FALLBACK_NAV_PRIMARY) {
    const match = byHref.get(fallback.href.toLowerCase())
    if (!match) {
      merged.push(fallback)
      continue
    }
    if (Array.isArray(fallback.children) && fallback.children.length > 0) {
      const childMap = new Map(
        (Array.isArray(match.children) ? match.children : [])
          .filter((c): c is NavItem => Boolean(c?.href && c?.label))
          .map((c) => [c.href.trim().toLowerCase(), c]),
      )
      const mergedChildren = fallback.children.map((child) => childMap.get(child.href.toLowerCase()) ?? child)
      merged.push({ ...match, children: mergedChildren })
      continue
    }
    merged.push(match)
  }

  return merged
}

const navItemBase =
  "group relative flex cursor-pointer items-center rounded-full px-3.5 py-2 font-host-grotesk text-[13px] font-semibold uppercase tracking-[0.16em] outline-none transition-[color,background-color,transform] duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-safe:hover:-translate-y-[1px]"

const getNavItemClass = (active: boolean, tone: "light" | "dark") =>
  cn(
    navItemBase,
    active &&
      (tone === "dark"
        ? "!text-rellia-mint focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        : "!text-rellia-teal bg-rellia-teal/10 focus-visible:ring-rellia-teal focus-visible:ring-offset-2 focus-visible:ring-offset-white"),
    !active &&
      tone === "dark"
        ? "text-white/90 hover:text-rellia-mint focus-visible:ring-white/70 focus-visible:ring-offset-transparent"
        : "text-black/75 hover:text-rellia-mint focus-visible:ring-rellia-mint focus-visible:ring-offset-white",
  )

const getCtaClassName = (radiusClassName: string, lightNavHover: boolean) =>
  cn(
    "group relative isolate inline-flex cursor-pointer items-center gap-2 overflow-hidden border-2 font-host-grotesk font-semibold outline-none transition-[transform,box-shadow,colors,background-color,border-color] duration-300 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg",
    "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out hover:before:scale-x-100",
    "px-6 py-3 text-[14px] lg:text-[15px]",
    radiusClassName,
    lightNavHover
      ? "border-rellia-teal bg-rellia-teal text-white focus-visible:ring-rellia-teal focus-visible:ring-offset-white before:bg-rellia-mint hover:border-rellia-mint hover:text-rellia-teal"
      : "border-rellia-mint bg-rellia-mint text-rellia-teal focus-visible:ring-rellia-mint focus-visible:ring-offset-transparent before:bg-white hover:border-white hover:text-rellia-teal",
  )

type DesktopNavLinkProps = {
  to: string
  label: string
  active: boolean
  tone: "light" | "dark"
}

const DesktopNavLink = ({ to, label, active, tone }: DesktopNavLinkProps) => (
  <Link to={to} className={getNavItemClass(active, tone)} aria-current={active ? "page" : undefined}>
    {label}
  </Link>
)

type NetworkItem = { to: string; label: string; active: boolean }

type DesktopNavDropdownProps = {
  label: string
  items: NetworkItem[]
  active: boolean
  tone: "light" | "dark"
  open: boolean
  onToggle: () => void
  onClose: () => void
}

const DesktopNavDropdown = ({ label, items, active, tone, open, onToggle, onClose }: DesktopNavDropdownProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const panelId = `${label.toLowerCase()}-submenu`

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      const root = rootRef.current
      if (!root) return
      if (e.target instanceof Node && root.contains(e.target)) return
      onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("pointerdown", handlePointerDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [open, onClose])

  return (
    <div ref={rootRef} className="relative">
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={onToggle}
          className={getNavItemClass(active, tone)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={panelId}
        >
          {label}
          <ChevronDown
            aria-hidden
            className={cn(
              "ml-2 h-4 w-4 opacity-80 transition-transform duration-200 motion-reduce:transition-none",
              open ? "rotate-180" : "rotate-0",
              tone === "dark" ? "text-white/80" : "text-black/60",
            )}
          />
        </button>

        {open && (
          <div
            id={panelId}
            role="menu"
            aria-label={`${label} submenu`}
            className={cn(
              "absolute left-0 top-full z-50 mt-2 min-w-[15rem] w-60 max-w-[calc(100vw-2rem)] translate-y-0 rounded-2xl border p-2 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.55)] backdrop-blur-xl",
              tone === "dark" ? "border-white/10 bg-rellia-teal/80" : "border-black/10 bg-white/90",
            )}
          >
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                role="menuitem"
                className={cn(
                  "flex items-center justify-start gap-2 rounded-xl px-3 py-2.5 font-host-grotesk text-sm font-semibold tracking-wide outline-none transition-colors duration-150 motion-reduce:transition-none",
                  item.active
                    ? tone === "dark"
                      ? "bg-white/10 text-rellia-mint ring-1 ring-white/10"
                      : "bg-rellia-teal/10 text-rellia-teal ring-1 ring-rellia-teal/15"
                    : tone === "dark"
                      ? "text-white/90 hover:bg-white/10 hover:text-rellia-mint focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                      : "text-black/70 hover:bg-black/5 hover:text-rellia-teal focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                )}
                onClick={onClose}
                aria-current={item.active ? "page" : undefined}
              >
                {item.to === "/careers" ? (
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate">{item.label}</span>
                    <CareersHiringBadge />
                  </span>
                ) : (
                  <span className="min-w-0 truncate">{item.label}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export type NavbarProps = {
  /** Navbar CTA link shape; default pill. */
  ctaRadiusClassName?: string
  /** Force solid teal background regardless of path. */
  forceSolid?: boolean
}

export default function Navbar({ 
  ctaRadiusClassName = "rounded-full",
  forceSolid = false
}: NavbarProps) {
  const { data: navigationData } = useNavigation()
  const { data: globalSettingsData } = useGlobalSettings()
  const { data: homePageData } = useHomePage()
  const { data: siteSettingsData } = useSiteSettings()
  const homePage = homePageData ?? DEFAULT_HOME_PAGE
  const globalSettings = globalSettingsData ?? DEFAULT_GLOBAL_SETTINGS
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileOpenLabel, setMobileOpenLabel] = useState<string | null>(null)
  const [desktopOpenLabel, setDesktopOpenLabel] = useState<string | null>(null)
  const location = useLocation()
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) {
      setMobileOpenLabel(null)
    }
  }, [mobileOpen])

  useEffect(() => {
    setDesktopOpenLabel(null)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mobileOpen])

  const handleToggleMobile = useCallback(() => {
    setMobileOpen((o) => !o)
  }, [])

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false)
  }, [])

  const handleMenuButtonKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleToggleMobile()
    }
  }, [handleToggleMobile])

  const isActive = (path: string) => location.pathname === path

  const pathname = location.pathname

  const hasTealHero =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/stories" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/network" ||
    pathname === "/founders" ||
    pathname.startsWith("/founders/") ||
    pathname === "/advisors" ||
    pathname.startsWith("/advisors/") ||
    pathname === "/investors" ||
    pathname === "/industry-partners" ||
    pathname === "/consulting" ||
    pathname === "/events" ||
    pathname === "/programs" ||
    pathname === "/faq" ||
    pathname === "/careers"

  /** Light backgrounds but nav should stay solid teal until scroll (not transparent over white). */
  const isNetworkDirectoryPage =
    pathname === "/founders/alumni" ||
    pathname.startsWith("/founders/alumni/") ||
    pathname === "/advisors/directory" ||
    pathname.startsWith("/advisors/directory/")

  /** Light cream/white heroes (story posts, event detail, directories, programs): transparent bar + light nav chrome until scroll */
  const isLightHeroNav =
    /^\/stories\/.+/.test(pathname) ||
    /^\/events\/.+/.test(pathname) ||
    /^\/programs\/.+/.test(pathname) ||
    isNetworkDirectoryPage

  const hasTransparentTopBar = !forceSolid && (hasTealHero || isLightHeroNav)

  const useLightNavChrome = isLightHeroNav && !scrolled && !mobileOpen

  const desktopTone: "light" | "dark" = useLightNavChrome ? "light" : "dark"

  const cmsLogoUrl = typeof siteSettingsData?.logoUrl === "string" && siteSettingsData.logoUrl.trim()
    ? siteSettingsData.logoUrl.trim()
    : null

  const logoSrc = useLightNavChrome ? LOGO_FILLED : cmsLogoUrl || LOGO_DEFAULT

  const isExternalHref = useCallback((href: string) => /^(https?:\/\/|mailto:|tel:)/i.test(href), [])

  const normalizeInternalHref = useCallback((href: string) => {
    const trimmed = href.trim()
    if (!trimmed) return "/"
    if (isExternalHref(trimmed)) return trimmed
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  }, [isExternalHref])

  const isHrefActive = useCallback((href: string) => {
    const normalized = normalizeInternalHref(href)
    if (isExternalHref(normalized)) return false
    if (normalized === "/") return location.pathname === "/"
    return location.pathname === normalized || location.pathname.startsWith(`${normalized}/`)
  }, [isExternalHref, location.pathname, normalizeInternalHref])

  const navPrimary = useMemo(
    () => mergePrimaryNav(navigationData?.primary).filter((item) => item.enabled !== false),
    [navigationData?.primary],
  )

  const primaryLinks = useMemo(() => {
    return navPrimary
      .filter((i) => typeof i?.href === "string" && typeof i?.label === "string")
      .map((i) => {
        const href = normalizeInternalHref(i.href)
        return {
          raw: i,
          href,
          label: i.label,
          active: isHrefActive(href) || (Array.isArray(i.children) ? i.children.some((c) => isHrefActive(c.href)) : false),
          hasChildren: Array.isArray(i.children) && i.children.length > 0,
        }
      })
  }, [isHrefActive, navPrimary, normalizeInternalHref])

  const shellCls = cn(
    "mx-auto grid w-full max-w-[1300px] grid-cols-[1fr_auto] items-center gap-3",
    "h-[72px] md:h-[86px] px-6 md:px-10",
    "md:grid-cols-[1fr_auto_1fr] md:gap-4",
  )

  const desktopRailCls = cn("hidden items-center md:flex gap-1")

  const ctaCls = getCtaClassName(ctaRadiusClassName, useLightNavChrome)

  const menuIconBtnCls = cn(
    "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center transition-[color] duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:hidden",
    mobileOpen &&
      "text-white focus-visible:ring-rellia-mint focus-visible:ring-offset-transparent hover:text-white/90",
    !mobileOpen &&
      useLightNavChrome &&
      "text-black/80 focus-visible:ring-rellia-teal focus-visible:ring-offset-transparent hover:text-black",
    !mobileOpen &&
      !useLightNavChrome &&
      "text-white focus-visible:ring-white/80 focus-visible:ring-offset-transparent hover:text-white/90",
  )

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "fixed inset-x-0 top-0 z-[9999] transform-gpu transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-out motion-reduce:transition-none",
        mobileOpen && "border-b border-white/10 bg-rellia-teal shadow-[0_10px_30px_-24px_rgba(0,0,0,0.35)] backdrop-blur-2xl",
        !mobileOpen && scrolled && "bg-rellia-teal shadow-[0_10px_30px_-24px_rgba(0,0,0,0.35)] backdrop-blur-2xl",
        !mobileOpen &&
          !scrolled &&
          hasTransparentTopBar &&
          "border-b border-transparent bg-transparent",
        !mobileOpen &&
          !scrolled &&
          !hasTransparentTopBar &&
          "bg-rellia-teal shadow-[0_10px_30px_-24px_rgba(0,0,0,0.35)] backdrop-blur-2xl",
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-rellia-teal focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg motion-reduce:transition-none"
      >
        Skip to main content
      </a>

      <div
        className={cn(
          "flex justify-center transition-[padding] duration-500 ease-out motion-reduce:transition-none",
          "pointer-events-none pt-0",
        )}
      >
        <div className={cn(shellCls, "pointer-events-auto")}>
          <Link
            to="/"
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
              "pl-0",
            )}
            aria-label="Rellia Health Home"
          >
            <img
              src={logoSrc}
              alt="Rellia"
              className={cn(
                "h-11 w-auto object-contain transition-[filter] duration-300 motion-reduce:transition-none md:h-11",
                logoSrc === LOGO_DEFAULT && "brightness-100",
              )}
            />
          </Link>

          <div className={desktopRailCls}>
            {primaryLinks.map((item) => {
              if (!item.hasChildren) {
                if (isExternalHref(item.href)) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={getNavItemClass(false, desktopTone)}
                      aria-label={item.label}
                    >
                      {item.label}
                    </a>
                  )
                }
                return (
                  <DesktopNavLink
                    key={item.href}
                    to={item.href}
                    label={item.label}
                    active={item.active}
                    tone={desktopTone}
                  />
                )
              }

              const childItems: NetworkItem[] = (item.raw.children ?? [])
                .filter((c): c is NavItem => Boolean(c && c.enabled !== false && typeof c.href === "string" && typeof c.label === "string"))
                .map((c) => {
                  const href = normalizeInternalHref(c.href)
                  return { to: href, label: c.label, active: isHrefActive(href) }
                })

              const open = desktopOpenLabel === item.label

              return (
                <DesktopNavDropdown
                  key={item.label}
                  label={item.label}
                  items={childItems}
                  active={item.active}
                  tone={desktopTone}
                  open={open}
                  onToggle={() => setDesktopOpenLabel((v) => (v === item.label ? null : item.label))}
                  onClose={() => setDesktopOpenLabel(null)}
                />
              )
            })}
          </div>

            <div className="hidden shrink-0 justify-self-end md:flex">
            <Link to={homePage.primaryCtaPath} className={ctaCls}>
              {homePage.primaryCtaLabel}
            </Link>
          </div>

          <button
            type="button"
            className={menuIconBtnCls}
            onClick={handleToggleMobile}
            onKeyDown={handleMenuButtonKeyDown}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-6 w-6" aria-hidden>
              <span
                className={cn(
                  "absolute left-1 right-1 top-[6px] h-[2px] rounded-full bg-current transition-[transform,width,top] duration-650 ease-in-out motion-reduce:transition-none",
                  mobileOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "rotate-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-1 right-1 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-current transition-[transform,opacity] duration-650 ease-in-out motion-reduce:transition-none",
                  mobileOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100",
                )}
              />
              <span
                className={cn(
                  "absolute left-1 right-1 bottom-[6px] h-[2px] rounded-full bg-current transition-[transform,width,bottom] duration-650 ease-in-out motion-reduce:transition-none",
                  mobileOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : "rotate-0",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu (always mounted; animates via translate) */}
      <>
        {/* Full-screen teal overlay slides in under the navbar */}
        <div
          id="mobile-nav-panel"
          className={cn(
            "fixed inset-x-0 top-[72px] z-[56] h-[calc(100dvh-72px)] w-full md:hidden transform-gpu",
            "bg-rellia-teal backdrop-blur-[56px] backdrop-saturate-150 shadow-2xl border-l border-white/10",
            "will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.42,0,0.58,1)] motion-reduce:transition-none",
            mobileOpen ? "translate-x-0" : "pointer-events-none translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          onClick={handleCloseMobile}
        >
          <div
            className="relative flex h-full w-full flex-col overflow-y-auto px-6 pb-8 pt-8 drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-1 flex-col min-h-0">
              {primaryLinks.map((item) => {
                const baseCls =
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-host-grotesk text-base font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal"

                if (!item.hasChildren) {
                  const activeCls = item.active ? "bg-white/10 ring-1 ring-white/15 text-rellia-mint" : ""
                  if (isExternalHref(item.href)) {
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(baseCls, activeCls)}
                        onClick={handleCloseMobile}
                        aria-label={item.label}
                      >
                        {item.label}
                      </a>
                    )
                  }
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(baseCls, activeCls)}
                      onClick={handleCloseMobile}
                      aria-current={item.active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  )
                }

                const open = mobileOpenLabel === item.label
                const childItems: Array<{ href: string; label: string; active: boolean }> = (item.raw.children ?? [])
                  .filter((c): c is NavItem => Boolean(c && c.enabled !== false && typeof c.href === "string" && typeof c.label === "string"))
                  .map((c) => {
                    const href = normalizeInternalHref(c.href)
                    return { href, label: c.label, active: isHrefActive(href) }
                  })

                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      className={cn(baseCls, item.active && "bg-white/10 ring-1 ring-white/15 text-rellia-mint", "w-full justify-between")}
                      onClick={() => setMobileOpenLabel((v) => (v === item.label ? null : item.label))}
                      aria-expanded={open}
                      aria-label={`Toggle ${item.label} menu`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "h-5 w-5 transition-transform duration-300 ease-out motion-reduce:transition-none",
                          open ? "rotate-180" : "rotate-0",
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        "grid will-change-[grid-template-rows,opacity] transition-[grid-template-rows,opacity] duration-450 ease-out motion-reduce:transition-none",
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="mb-2 mt-2 space-y-1 border-l-2 border-rellia-mint/80 pl-4 ml-3">
                          {childItems.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className={cn(
                                "flex min-h-11 cursor-pointer items-center justify-start gap-2 rounded-xl px-3 py-2.5 font-urbanist text-[15px] font-semibold text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                                child.active && "bg-white/10 ring-1 ring-white/15",
                              )}
                              onClick={handleCloseMobile}
                              aria-current={child.active ? "page" : undefined}
                            >
                              {child.href === "/careers" ? (
                                <span className="flex min-w-0 items-center gap-1.5">
                                  <span className="min-w-0 truncate">{child.label}</span>
                                  <CareersHiringBadge />
                                </span>
                              ) : (
                                <span className="min-w-0 truncate">{child.label}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="mt-6 border-t border-white/15 pt-6">
                <Link
                  to={homePage.primaryCtaPath}
                  className={cn(
                    "flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 border-2 border-rellia-mint bg-rellia-mint px-6 py-3.5 font-host-grotesk text-base font-semibold text-rellia-teal outline-none transition-colors hover:bg-transparent hover:border-rellia-cream hover:text-white focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                    ctaRadiusClassName,
                  )}
                  onClick={handleCloseMobile}
                >
                  {homePage.primaryCtaLabel}
                </Link>
              </div>

              <div className="mt-auto pt-14">
                <div className="flex items-center justify-center gap-4">
                  <a
                    href={globalSettings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 bg-white/5 p-2 transition-colors hover:bg-white/10"
                    aria-label="Rellia Health on LinkedIn"
                  >
                    <LinkedInFilled className="h-5 w-5 text-white/85" />
                  </a>
                  <a
                    href={globalSettings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 bg-white/5 p-2 transition-colors hover:bg-white/10"
                    aria-label="Rellia Health on Instagram"
                  >
                    <InstagramFilled className="h-5 w-5 text-white/85" />
                  </a>
                  <a
                    href={`mailto:${globalSettings.supportEmail}`}
                    className="rounded-full border border-white/15 bg-white/5 p-2 transition-colors hover:bg-white/10"
                    aria-label={`Email ${globalSettings.supportEmail}`}
                  >
                    <MailFilled className="h-5 w-5 text-white/85" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </nav>
  )
}
