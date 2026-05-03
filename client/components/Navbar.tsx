import { useMemo, useState, useEffect, useCallback, useRef, type KeyboardEvent } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { DEFAULT_GLOBAL_SETTINGS, DEFAULT_HOME_PAGE } from "@shared/cms/defaults"
import { useHomePage } from "@/hooks/useCmsDocuments"
import { CareersHiringBadge } from "@/components/CareersHiringBadge"
import { InstagramFilled, LinkedInFilled, MailFilled } from "@/components/icons/SocialIcons"

const LOGO_DEFAULT = "/images/logo-rellia-footer.webp"
/** Wordmark for transparent bar on light heroes (FAQ, story posts) */
const LOGO_FILLED = "/images/logo-rellia-filled.webp"

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
  const panelId = `${label.toLowerCase()}-submenu`

  return (
    <div className="relative">
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
}

export default function Navbar({ ctaRadiusClassName = "rounded-full" }: NavbarProps) {
  const { data: homePageData } = useHomePage()
  const homePage = homePageData ?? DEFAULT_HOME_PAGE
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileNetworkOpen, setMobileNetworkOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const [desktopNetworkOpen, setDesktopNetworkOpen] = useState(false)
  const desktopNetworkRef = useRef<HTMLDivElement | null>(null)
  const [desktopAboutOpen, setDesktopAboutOpen] = useState(false)
  const desktopAboutRef = useRef<HTMLDivElement | null>(null)
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
      setMobileNetworkOpen(false)
      setMobileAboutOpen(false)
    }
  }, [mobileOpen])

  useEffect(() => {
    setDesktopNetworkOpen(false)
    setDesktopAboutOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mobileOpen])

  useEffect(() => {
    if (!desktopNetworkOpen) return
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setDesktopNetworkOpen(false)
    }
    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      const root = desktopNetworkRef.current
      if (!root) return
      if (e.target instanceof Node && root.contains(e.target)) return
      setDesktopNetworkOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("pointerdown", handlePointerDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [desktopNetworkOpen])

  useEffect(() => {
    if (!desktopAboutOpen) return
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setDesktopAboutOpen(false)
    }
    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      const root = desktopAboutRef.current
      if (!root) return
      if (e.target instanceof Node && root.contains(e.target)) return
      setDesktopAboutOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("pointerdown", handlePointerDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [desktopAboutOpen])

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
    pathname === "/founders/directory" ||
    pathname === "/advisors/directory" ||
    pathname === "/industry-partners/directory"

  /** Light cream/white heroes (story posts, event detail): transparent bar + light nav chrome until scroll */
  const isLightHeroNav = /^\/stories\/.+/.test(pathname) || /^\/events\/.+/.test(pathname)

  const hasTransparentTopBar = (hasTealHero || isLightHeroNav) && !isNetworkDirectoryPage

  const useLightNavChrome = isLightHeroNav && !scrolled && !mobileOpen

  const desktopTone: "light" | "dark" = useLightNavChrome ? "light" : "dark"

  const logoSrc = useLightNavChrome ? LOGO_FILLED : LOGO_DEFAULT

  const networkItems = useMemo<NetworkItem[]>(
    () => [
      { to: "/founders", label: "Founders", active: location.pathname === "/founders" || location.pathname.startsWith("/founders/") },
      { to: "/advisors", label: "Advisors", active: location.pathname === "/advisors" || location.pathname.startsWith("/advisors/") },
      { to: "/investors", label: "Investors", active: location.pathname === "/investors" },
      {
        to: "/industry-partners",
        label: "Industry partners",
        active: location.pathname === "/industry-partners" || location.pathname.startsWith("/industry-partners/"),
      },
    ],
    [location.pathname],
  )

  const isNetworkActive = location.pathname === "/network" || networkItems.some((i) => i.active)

  const aboutItems = useMemo<NetworkItem[]>(
    () => [
      { to: "/about", label: "About Us", active: location.pathname === "/about" },
      { to: "/stories", label: "Stories", active: location.pathname === "/stories" || location.pathname.startsWith("/stories/") },
      { to: "/careers", label: "Careers", active: location.pathname === "/careers" },
    ],
    [location.pathname],
  )

  const isAboutActive = aboutItems.some((i) => i.active)

  const primaryLinks = useMemo(
    () => [
      {
        to: "/programs",
        label: "PROGRAMS",
        active: location.pathname === "/programs" || location.pathname.startsWith("/programs/"),
      },
      { to: "/events", label: "EVENTS", active: isActive("/events") },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.pathname],
  )

  const secondaryLinks = useMemo(
    () => [
      { to: "/faq", label: "FAQ", active: isActive("/faq") },
      { to: "/contact", label: "CONTACT", active: isActive("/contact") },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.pathname],
  )

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
        "fixed inset-x-0 top-0 z-[9999] transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-out motion-reduce:transition-none",
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
            <div ref={desktopNetworkRef}>
              <DesktopNavDropdown
                label="NETWORK"
                items={networkItems}
                active={isNetworkActive}
                tone={desktopTone}
                open={desktopNetworkOpen}
                onToggle={() => {
                  setDesktopAboutOpen(false)
                  setDesktopNetworkOpen((o) => !o)
                }}
                onClose={() => setDesktopNetworkOpen(false)}
              />
            </div>

            {primaryLinks.map((l) => (
              <DesktopNavLink
                key={l.to}
                to={l.to}
                label={l.label}
                active={l.active}
                tone={desktopTone}
              />
            ))}

            <div ref={desktopAboutRef}>
              <DesktopNavDropdown
                label="ABOUT"
                items={aboutItems}
                active={isAboutActive}
                tone={desktopTone}
                open={desktopAboutOpen}
                onToggle={() => {
                  setDesktopNetworkOpen(false)
                  setDesktopAboutOpen((o) => !o)
                }}
                onClose={() => setDesktopAboutOpen(false)}
              />
            </div>

            {secondaryLinks.map((l) => (
              <DesktopNavLink
                key={l.to}
                to={l.to}
                label={l.label}
                active={l.active}
                tone={desktopTone}
              />
            ))}
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
              <button
                type="button"
                className={cn(
                  "flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl px-3 py-3 font-host-grotesk text-base font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                  isNetworkActive && "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                )}
                onClick={() => setMobileNetworkOpen((o) => !o)}
                aria-expanded={mobileNetworkOpen}
              >
                <span>NETWORK</span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                      "h-5 w-5 transition-transform duration-300 ease-out motion-reduce:transition-none",
                    mobileNetworkOpen ? "rotate-180" : "rotate-0",
                  )}
                />
              </button>

                <div
                  className={cn(
                    "grid will-change-[grid-template-rows,opacity] transition-[grid-template-rows,opacity] duration-450 ease-out motion-reduce:transition-none",
                    mobileNetworkOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="mb-2 mt-2 space-y-1 border-l-2 border-rellia-mint/80 pl-4 ml-3">
                      {networkItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={cn(
                            "flex min-h-11 cursor-pointer items-center rounded-xl px-3 py-2.5 font-urbanist text-[15px] font-semibold text-white/90 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                            item.active && "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                          )}
                          onClick={handleCloseMobile}
                          aria-current={item.active ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

              <Link
                to="/programs"
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-host-grotesk text-base font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                  (location.pathname === "/programs" || location.pathname.startsWith("/programs/")) &&
                    "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                )}
                onClick={handleCloseMobile}
                aria-current={
                  location.pathname === "/programs" || location.pathname.startsWith("/programs/")
                    ? "page"
                    : undefined
                }
              >
                PROGRAMS
              </Link>

              <Link
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-host-grotesk text-base font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                  isActive("/events") && "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                )}
                to="/events"
                onClick={handleCloseMobile}
                aria-current={isActive("/events") ? "page" : undefined}
              >
                EVENTS
              </Link>

              <button
                type="button"
                className={cn(
                  "flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl px-3 py-3 font-host-grotesk text-base font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                  isAboutActive && "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                )}
                onClick={() => setMobileAboutOpen((o) => !o)}
                aria-expanded={mobileAboutOpen}
                aria-label="Toggle About menu"
              >
                <span>ABOUT</span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "h-5 w-5 transition-transform duration-300 ease-out motion-reduce:transition-none",
                    mobileAboutOpen ? "rotate-180" : "rotate-0",
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid will-change-[grid-template-rows,opacity] transition-[grid-template-rows,opacity] duration-450 ease-out motion-reduce:transition-none",
                  mobileAboutOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <div className="mb-2 mt-2 space-y-1 border-l-2 border-rellia-mint/80 pl-4 ml-3">
                    {aboutItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={cn(
                          "flex min-h-11 cursor-pointer items-center justify-start gap-2 rounded-xl px-3 py-2.5 font-urbanist text-[15px] font-semibold text-white/90 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                          item.active && "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                        )}
                        onClick={handleCloseMobile}
                        aria-current={item.active ? "page" : undefined}
                      >
                        {item.to === "/careers" ? (
                          <span className="flex min-w-0 items-center gap-1.5">
                            <span>{item.label}</span>
                            <CareersHiringBadge />
                          </span>
                        ) : (
                          <span className="min-w-0">{item.label}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                to="/faq"
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-host-grotesk text-base font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                  isActive("/faq") && "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                )}
                onClick={handleCloseMobile}
                aria-current={isActive("/faq") ? "page" : undefined}
              >
                FAQ
              </Link>

              <Link
                to="/contact"
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-host-grotesk text-base font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                  isActive("/contact") && "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                )}
                onClick={handleCloseMobile}
                aria-current={isActive("/contact") ? "page" : undefined}
              >
                CONTACT
              </Link>

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
                    href={DEFAULT_GLOBAL_SETTINGS.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 bg-white/5 p-2 transition-colors hover:bg-white/10"
                    aria-label="Rellia Health on LinkedIn"
                  >
                    <LinkedInFilled className="h-5 w-5 text-white/85" />
                  </a>
                  <a
                    href={DEFAULT_GLOBAL_SETTINGS.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 bg-white/5 p-2 transition-colors hover:bg-white/10"
                    aria-label="Rellia Health on Instagram"
                  >
                    <InstagramFilled className="h-5 w-5 text-white/85" />
                  </a>
                  <a
                    href={`mailto:${DEFAULT_GLOBAL_SETTINGS.supportEmail}`}
                    className="rounded-full border border-white/15 bg-white/5 p-2 transition-colors hover:bg-white/10"
                    aria-label={`Email ${DEFAULT_GLOBAL_SETTINGS.supportEmail}`}
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
