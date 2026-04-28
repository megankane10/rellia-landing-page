import { useMemo, useState, useEffect, useCallback, useRef, type KeyboardEvent } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ChevronDown, Instagram, Linkedin, Mail, Menu, X } from "lucide-react"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"

const LOGO_DEFAULT = "/images/logo-rellia-footer.webp"
const LOGO_FILLED = "/images/logo-rellia-filled.webp"

const navItemBase =
  "group relative flex cursor-pointer items-center rounded-full px-3.5 py-2 font-host-grotesk text-[13px] font-semibold uppercase tracking-[0.16em] outline-none transition-[color,background-color,transform] duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-safe:hover:-translate-y-[1px]"

const getNavItemClass = (active: boolean, tone: "light" | "dark") =>
  cn(
    navItemBase,
    active &&
      (tone === "dark"
        ? "!text-rellia-mint focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        : "!text-rellia-mint bg-rellia-mint/10 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white"),
    !active &&
      tone === "dark"
        ? "text-white/90 hover:text-rellia-mint focus-visible:ring-white/70 focus-visible:ring-offset-transparent"
        : "text-black/75 hover:text-rellia-mint focus-visible:ring-rellia-mint focus-visible:ring-offset-white",
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
  to: string
  items: NetworkItem[]
  extraItem?: { to: string; label: string; active: boolean }
  active: boolean
  tone: "light" | "dark"
  open: boolean
  onToggle: () => void
  onClose: () => void
}

const DesktopNavDropdown = ({ label, to, items, extraItem, active, tone, open, onToggle, onClose }: DesktopNavDropdownProps) => {
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
              "absolute left-0 top-full z-50 mt-2 w-56 translate-y-0 rounded-2xl border p-2 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.55)] backdrop-blur-xl",
              tone === "dark" ? "border-white/10 bg-rellia-teal/80" : "border-black/10 bg-white/90",
            )}
          >
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                role="menuitem"
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 font-host-grotesk text-sm font-semibold tracking-wide outline-none transition-colors duration-150 motion-reduce:transition-none",
                  item.active
                    ? "bg-white/10 text-rellia-mint ring-1 ring-white/10"
                    : tone === "dark"
                      ? "text-white/90 hover:bg-white/10 hover:text-rellia-mint focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                      : "text-black/70 hover:bg-black/5 hover:text-rellia-mint focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                )}
                onClick={onClose}
                aria-current={item.active ? "page" : undefined}
              >
                <span>{item.label}</span>
              </Link>
            ))}

            {extraItem ? (
              <>
                <div className={cn("my-2 h-px", tone === "dark" ? "bg-white/10" : "bg-black/10")} aria-hidden />
                <Link
                  to={extraItem.to}
                  role="menuitem"
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2.5 font-host-grotesk text-sm font-semibold tracking-wide outline-none transition-colors duration-150 motion-reduce:transition-none",
                    extraItem.active
                      ? "bg-white/10 text-rellia-mint ring-1 ring-white/10"
                      : tone === "dark"
                        ? "text-white/90 hover:bg-white/10 hover:text-rellia-mint focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                        : "text-black/70 hover:bg-black/5 hover:text-rellia-mint focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                  )}
                  onClick={onClose}
                  aria-current={extraItem.active ? "page" : undefined}
                >
                  <span>{extraItem.label}</span>
                </Link>
              </>
            ) : null}
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
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileNetworkOpen, setMobileNetworkOpen] = useState(false)
  const [desktopNetworkOpen, setDesktopNetworkOpen] = useState(false)
  const desktopNetworkRef = useRef<HTMLDivElement | null>(null)
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
    }
  }, [mobileOpen])

  useEffect(() => {
    setDesktopNetworkOpen(false)
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
    pathname.startsWith("/network") ||
    pathname === "/founders" ||
    pathname === "/advisors" ||
    pathname === "/investors" ||
    pathname === "/industry-partners" ||
    pathname === "/programs"

  const desktopTone: "light" | "dark" =
    !mobileOpen && !scrolled && !hasTealHero ? "light" : "dark"

  const networkItems = useMemo<NetworkItem[]>(
    () => [
      { to: "/founders", label: "For founders", active: location.pathname === "/founders" },
      { to: "/advisors", label: "For advisors", active: location.pathname === "/advisors" },
      { to: "/investors", label: "For investors", active: location.pathname === "/investors" },
      {
        to: "/industry-partners",
        label: "For partners",
        active: location.pathname === "/industry-partners" || location.pathname.startsWith("/industry-partners/"),
      },
    ],
    [location.pathname],
  )

  const howTheyWorkTogetherItem = useMemo(
    () => ({
      to: "/network",
      label: "How they work together",
      active: location.pathname === "/network",
    }),
    [location.pathname],
  )

  const isNetworkActive =
    location.pathname === "/network" ||
    networkItems.some((i) => i.active)

  const navLinks = useMemo(
    () => [
      {
        to: "/programs",
        label: "PROGRAMS",
        active: location.pathname === "/programs" || location.pathname.startsWith("/programs/"),
      },
      { to: "/stories", label: "STORIES", active: location.pathname === "/stories" || location.pathname.startsWith("/stories/") },
      { to: "/about", label: "ABOUT", active: isActive("/about") },
      { to: "/faq", label: "FAQ", active: isActive("/faq") },
      { to: "/contact", label: "CONTACT", active: isActive("/contact") },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.pathname],
  )

  const shellCls = cn(
    "mx-auto grid w-full max-w-[1300px] grid-cols-[1fr_auto] items-center gap-3 transition-[height,padding] duration-500 ease-out motion-reduce:transition-none md:grid-cols-[1fr_auto_1fr] md:gap-4",
    mobileOpen &&
      "min-h-[72px] rounded-b-2xl border-x border-b border-white/10 border-t-transparent bg-rellia-teal/80 px-6 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.35)] backdrop-blur-xl md:min-h-[86px] md:rounded-b-3xl md:px-10",
    !mobileOpen &&
      "h-[72px] md:h-[86px] px-6 md:px-10",
  )

  const desktopRailCls = cn("hidden items-center md:flex gap-1")

  const ctaCls = cn(
    "group relative isolate inline-flex cursor-pointer items-center gap-2 overflow-hidden border-2 font-host-grotesk font-semibold outline-none transition-[transform,box-shadow,colors,background-color,border-color] duration-300 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg",
    "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out hover:before:scale-x-100",
    "px-6 py-3 text-[14px] lg:text-[15px]",
    ctaRadiusClassName,
    "border-rellia-mint bg-rellia-mint text-rellia-teal focus-visible:ring-offset-transparent before:bg-white hover:border-white hover:text-rellia-teal",
  )

  const menuIconBtnCls = cn(
    "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center transition-[color] duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:hidden",
    !mobileOpen &&
      (desktopTone === "dark"
        ? "text-white focus-visible:ring-white/80 focus-visible:ring-offset-transparent hover:text-white/90"
        : "text-rellia-teal focus-visible:ring-rellia-mint focus-visible:ring-offset-white hover:text-rellia-teal/80"),
    mobileOpen && "text-white focus-visible:ring-rellia-mint focus-visible:ring-offset-transparent hover:text-white/90",
  )

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-out motion-reduce:transition-none",
        !mobileOpen && "pointer-events-none",
        !mobileOpen &&
          !scrolled &&
          (pathname === "/faq"
            ? "bg-transparent"
            : desktopTone === "dark"
              ? "bg-transparent"
              : "bg-white/85 backdrop-blur-xl border-b border-black/5"),
        !mobileOpen &&
          scrolled &&
          "bg-rellia-teal shadow-[0_10px_30px_-24px_rgba(0,0,0,0.35)] backdrop-blur-2xl",
        mobileOpen && "bg-rellia-teal/75 backdrop-blur-2xl shadow-[0_10px_30px_-24px_rgba(0,0,0,0.35)]",
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
              src={desktopTone === "light" ? LOGO_FILLED : LOGO_DEFAULT}
              alt="Rellia"
              className={cn(
                "h-11 w-auto object-contain transition-[filter] duration-300 motion-reduce:transition-none md:h-11",
                "brightness-100",
              )}
            />
          </Link>

          <div className={desktopRailCls}>
            <div ref={desktopNetworkRef}>
              <DesktopNavDropdown
                label="NETWORK"
                to="/network"
                items={networkItems}
                extraItem={howTheyWorkTogetherItem}
                active={isNetworkActive}
                tone={desktopTone}
                open={desktopNetworkOpen}
                onToggle={() => setDesktopNetworkOpen((o) => !o)}
                onClose={() => setDesktopNetworkOpen(false)}
              />
            </div>
            {navLinks.map((l) => (
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
            <Link to="/network" className={ctaCls}>
              Get Involved
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
        {/* Backdrop (below the navbar bar) */}
        <button
          type="button"
          className={cn(
            "fixed inset-x-0 top-[72px] z-[55] h-[calc(100dvh-72px)] cursor-pointer bg-black/30 transition-opacity duration-300 ease-out motion-reduce:transition-none md:hidden",
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-label="Close navigation menu"
          onClick={handleCloseMobile}
        />

        {/* Panel slides in from the right, under the navbar */}
        <div
          id="mobile-nav-panel"
          className={cn(
            "fixed inset-x-0 top-[72px] z-[56] h-[calc(100dvh-72px)] w-full shadow-2xl md:hidden transform-gpu",
            "bg-rellia-teal/75 backdrop-blur-2xl",
            "will-change-transform transition-transform duration-400 ease-out motion-reduce:transition-none",
            mobileOpen ? "translate-x-0" : "pointer-events-none translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="relative flex h-full w-full flex-col overflow-y-auto bg-rellia-teal/65 px-6 pb-8 pt-8 backdrop-blur-2xl">
            <div className="flex flex-1 flex-col min-h-0">
              <button
                type="button"
                className={cn(
                  "flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl px-3 py-3 font-host-grotesk text-base font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                  (location.pathname === "/network" || networkItems.some((i) => i.active)) &&
                    "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
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

                      <div className="my-2 h-px bg-white/10" aria-hidden />
                      <Link
                        to={howTheyWorkTogetherItem.to}
                        className={cn(
                          "flex min-h-11 cursor-pointer items-center rounded-xl px-3 py-2.5 font-urbanist text-[15px] font-semibold text-white/90 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                          howTheyWorkTogetherItem.active && "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                        )}
                        onClick={handleCloseMobile}
                        aria-current={howTheyWorkTogetherItem.active ? "page" : undefined}
                      >
                        {howTheyWorkTogetherItem.label}
                      </Link>
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
                to="/stories"
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-host-grotesk text-base font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                  (location.pathname === "/stories" || location.pathname.startsWith("/stories/")) &&
                    "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                )}
                onClick={handleCloseMobile}
                aria-current={
                  location.pathname === "/stories" || location.pathname.startsWith("/stories/")
                    ? "page"
                    : undefined
                }
              >
                STORIES
              </Link>

              <Link
                to="/about"
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-host-grotesk text-base font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                  isActive("/about") && "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                )}
                onClick={handleCloseMobile}
                aria-current={isActive("/about") ? "page" : undefined}
              >
                ABOUT
              </Link>

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
                  to="/network"
                  className={cn(
                    "flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 border-2 border-rellia-mint bg-rellia-mint px-6 py-3.5 font-host-grotesk text-base font-semibold text-rellia-teal outline-none transition-colors hover:bg-transparent hover:border-rellia-cream hover:text-white focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                    ctaRadiusClassName,
                  )}
                  onClick={handleCloseMobile}
                >
                  Get Involved
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
                    <Linkedin className="h-5 w-5 text-white/80" />
                  </a>
                  <a
                    href={DEFAULT_GLOBAL_SETTINGS.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 bg-white/5 p-2 transition-colors hover:bg-white/10"
                    aria-label="Rellia Health on Instagram"
                  >
                    <Instagram className="h-5 w-5 text-white/80" />
                  </a>
                  <a
                    href={`mailto:${DEFAULT_GLOBAL_SETTINGS.supportEmail}`}
                    className="rounded-full border border-white/15 bg-white/5 p-2 transition-colors hover:bg-white/10"
                    aria-label={`Email ${DEFAULT_GLOBAL_SETTINGS.supportEmail}`}
                  >
                    <Mail className="h-5 w-5 text-white/80" />
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
