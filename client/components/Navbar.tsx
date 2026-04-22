import { useMemo, useState, useEffect, useCallback, type KeyboardEvent } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

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

export type NavbarProps = {
  /** Navbar CTA link shape; default pill. */
  ctaRadiusClassName?: string
}

export default function Navbar({ ctaRadiusClassName = "rounded-full" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
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
    pathname === "/terms" ||
    pathname === "/network" ||
    pathname === "/programs"

  const desktopTone: "light" | "dark" =
    !mobileOpen && !scrolled && !hasTealHero ? "light" : "dark"

  const navLinks = useMemo(
    () => [
      { to: "/network/founders", label: "FOUNDERS", active: location.pathname === "/network/founders" },
      { to: "/network/advisors", label: "ADVISORS", active: location.pathname === "/network/advisors" },
      { to: "/network/investors", label: "INVESTORS", active: location.pathname === "/network/investors" },
      { to: "/network/partners", label: "PARTNERS", active: location.pathname === "/network/partners" },
      { to: "/stories", label: "STORIES", active: location.pathname === "/stories" || location.pathname.startsWith("/stories/") },
      { to: "/about", label: "ABOUT", active: isActive("/about") },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.pathname],
  )

  const shellCls = cn(
    "mx-auto grid w-full max-w-[1300px] grid-cols-[1fr_auto] items-center gap-3 transition-[height,padding] duration-500 ease-out motion-reduce:transition-none md:grid-cols-[1fr_auto_1fr] md:gap-4",
    mobileOpen &&
      "min-h-[72px] rounded-b-2xl border-x border-b border-white/10 border-t-transparent bg-rellia-teal px-6 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.35)] backdrop-blur-md md:min-h-[86px] md:rounded-b-3xl md:px-10",
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
    "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border transition-[color,background-color,border-color] duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:hidden",
    !mobileOpen &&
      (desktopTone === "dark"
        ? "border-white/35 bg-white/10 text-white focus-visible:ring-white/80 focus-visible:ring-offset-transparent hover:bg-white/18"
        : "border-black/10 bg-white text-rellia-teal focus-visible:ring-rellia-mint focus-visible:ring-offset-white hover:bg-rellia-cream"),
    mobileOpen && "border-white/25 bg-white/10 text-white focus-visible:ring-rellia-mint focus-visible:ring-offset-transparent hover:bg-white/15",
  )

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-out motion-reduce:transition-none",
        !mobileOpen && "pointer-events-none",
        !mobileOpen && !scrolled && (desktopTone === "dark" ? "bg-transparent" : "bg-white/85 backdrop-blur-xl border-b border-black/5"),
        !mobileOpen &&
          scrolled &&
          "border-b border-white/10 bg-rellia-teal shadow-[0_10px_30px_-24px_rgba(0,0,0,0.35)] backdrop-blur-2xl",
        mobileOpen && "bg-rellia-teal",
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
                "h-9 w-auto object-contain transition-[filter] duration-300 motion-reduce:transition-none md:h-11",
                "brightness-100",
              )}
            />
          </Link>

          <div className={desktopRailCls}>
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
            {mobileOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 top-[72px] z-[55] cursor-pointer bg-black/30 backdrop-blur-[2px] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300 motion-safe:ease-out motion-reduce:animate-none md:hidden"
            aria-label="Close navigation menu"
            onClick={handleCloseMobile}
          />
          <div
            id="mobile-nav-panel"
            className="relative z-[60] mx-auto w-full max-w-[1440px] border-x border-b border-white/10 bg-rellia-teal px-5 pb-9 pt-3 shadow-[0_26px_60px_-28px_rgba(0,0,0,0.45)] backdrop-blur-md motion-safe:animate-in motion-safe:slide-in-from-top-4 motion-safe:fade-in-0 motion-safe:duration-300 motion-safe:ease-out motion-reduce:animate-none md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <div className="flex flex-col">
              <Link
                to="/network/founders"
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-host-grotesk text-base font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                  location.pathname === "/network/founders" &&
                    "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                )}
                onClick={handleCloseMobile}
                aria-current={location.pathname === "/network/founders" ? "page" : undefined}
              >
                FOUNDERS
              </Link>
              <Link
                to="/network/advisors"
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-host-grotesk text-base font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                  location.pathname === "/network/advisors" &&
                    "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                )}
                onClick={handleCloseMobile}
                aria-current={location.pathname === "/network/advisors" ? "page" : undefined}
              >
                ADVISORS
              </Link>
              <Link
                to="/network/investors"
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-host-grotesk text-base font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                  location.pathname === "/network/investors" &&
                    "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                )}
                onClick={handleCloseMobile}
                aria-current={location.pathname === "/network/investors" ? "page" : undefined}
              >
                INVESTORS
              </Link>

              <Link
                to="/network/partners"
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-3 py-3 font-host-grotesk text-base font-medium text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
                  location.pathname === "/network/partners" &&
                    "bg-white/10 ring-1 ring-white/15 text-rellia-mint",
                )}
                onClick={handleCloseMobile}
                aria-current={location.pathname === "/network/partners" ? "page" : undefined}
              >
                PARTNERS
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
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
