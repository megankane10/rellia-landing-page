import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Info,
  CalendarDays,
  HelpCircle,
  ChevronDown,
  Menu,
  X,
  UserPlus,
  TrendingUp,
  Building2,
  Users,
  GraduationCap,
} from "lucide-react";

const networkItems = [
  { label: "Founders", icon: Users, href: "/network#founders" },
  { label: "Advisors", icon: GraduationCap, href: "/network#advisors" },
  { label: "Investors", icon: TrendingUp, href: "/network#investors" },
  { label: "Industry Partners", icon: Building2, href: "/network#partners" },
]

/** Cream pages that use PlaceholderPage — match solid navbar like scrolled state */
const SOLID_NAVBAR_PATHS = new Set<string>([
  "/contact",
  "/blog",
])

const LOGO_FILLED = "/images/logo-rellia-filled.webp"

export type NavbarProps = {
  /** Navbar CTA link shape; default pill. Use e.g. rounded-[14px] to match Figma contact header. */
  ctaRadiusClassName?: string
}

export default function Navbar({ ctaRadiusClassName = "rounded-full" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const isNetworkActive = location.pathname === "/network";

  const solidNavFromRoute = SOLID_NAVBAR_PATHS.has(location.pathname)
  const navFilled = scrolled || mobileOpen || solidNavFromRoute
  const useLightNav =
    !navFilled &&
    (location.pathname === "/" ||
      location.pathname === "/about" ||
      location.pathname === "/programs" ||
      location.pathname === "/payment" ||
      location.pathname === "/terms" ||
      location.pathname === "/privacy" ||
      location.pathname === "/network");

  const textCls = useLightNav
    ? "text-white hover:text-white/85"
    : "text-rellia-teal hover:text-rellia-teal/70";
  const underlineCls = "bg-rellia-mint";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b transition-[background-color,box-shadow,backdrop-filter,border-color] duration-300",
        navFilled
          ? "border-black/10 bg-rellia-cream shadow-sm"
          : cn(
              "bg-transparent backdrop-blur-[2px]",
              useLightNav ? "border-white/25" : "border-black/10",
            ),
      )}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-[72px] md:h-[86px] grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={LOGO_FILLED}
            alt="Rellia"
            className={cn(
              "h-9 md:h-11 w-auto object-contain transition-all duration-300",
              useLightNav && "brightness-0 invert",
            )}
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center justify-center gap-5 lg:gap-7">
          <Link
            to="/"
            className={`relative flex items-center gap-1.5 font-host-grotesk text-[15px] lg:text-[16px] font-medium transition-colors pb-1 ${textCls}`}
          >
            <Home className="w-4 h-4 shrink-0" />
            Home
            {isActive("/") && (
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${underlineCls} transition-colors`} />
            )}
          </Link>

          <Link
            to="/about"
            className={`relative flex items-center gap-1.5 font-host-grotesk text-[15px] lg:text-[16px] font-medium transition-colors pb-1 ${textCls}`}
          >
            <Info className="w-4 h-4 shrink-0" />
            About
            {isActive("/about") && (
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${underlineCls} transition-colors`} />
            )}
          </Link>

          {/* Programs — direct link, no dropdown */}
          <Link
            to="/programs"
            className={`relative flex items-center gap-1.5 font-host-grotesk text-[15px] lg:text-[16px] font-medium transition-colors pb-1 ${textCls}`}
          >
            <CalendarDays className="w-4 h-4 shrink-0" />
            Programs &amp; Events
            {isActive("/programs") && (
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${underlineCls} transition-colors`} />
            )}
          </Link>

          {/* Network — direct link to /network, hover reveals the section dropdown */}
          <div className="relative group">
            <Link
              to="/network"
              className={`relative flex items-center gap-1.5 font-host-grotesk text-[15px] lg:text-[16px] font-medium transition-colors pb-1 ${textCls}`}
            >
              <Users className="w-4 h-4 shrink-0" />
              Network
              <ChevronDown className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:rotate-180" />
              {isNetworkActive && (
                <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${underlineCls} transition-colors`} />
              )}
            </Link>

            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-white rounded-xl shadow-2xl border border-black/5 overflow-hidden min-w-[220px]">
                {networkItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="flex items-center gap-3 px-5 py-3.5 text-rellia-teal hover:bg-rellia-cream transition-colors font-host-grotesk text-sm font-medium border-b border-black/5 last:border-0"
                    >
                      <Icon className="w-4 h-4 text-rellia-mint shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <Link
            to="/faq"
            className={`relative flex items-center gap-1.5 font-host-grotesk text-[15px] lg:text-[16px] font-medium transition-colors pb-1 ${textCls}`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            FAQ
            {isActive("/faq") && (
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${underlineCls} transition-colors`} />
            )}
          </Link>
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3 shrink-0 justify-self-end">
          <Link
            to="/network"
            className={cn(
              "flex items-center gap-2 font-host-grotesk font-semibold text-[14px] lg:text-[15px] px-6 py-3 border-2 transition-all duration-200 whitespace-nowrap tracking-tight hover:-translate-y-0.5 hover:shadow-lg",
              ctaRadiusClassName,
              useLightNav
                ? "border-transparent text-rellia-teal bg-rellia-mint hover:bg-white hover:border-transparent hover:text-rellia-teal"
                : "bg-rellia-teal text-white border-rellia-teal hover:bg-transparent hover:text-rellia-teal",
            )}
          >
            <UserPlus className="w-4 h-4" />
            Get Involved
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={cn(
            "md:hidden p-2 transition-colors",
            useLightNav ? "text-white" : "text-rellia-teal",
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-rellia-cream border-t border-black/10 px-6 pb-6 flex flex-col">
          <Link
            to="/"
            className="flex items-center gap-3 py-4 border-b border-black/5 font-host-grotesk text-base font-medium text-rellia-teal"
            onClick={() => setMobileOpen(false)}
          >
            <Home className="w-5 h-5 text-rellia-mint" />
            Home
          </Link>
          <Link
            to="/about"
            className="flex items-center gap-3 py-4 border-b border-black/5 font-host-grotesk text-base font-medium text-rellia-teal"
            onClick={() => setMobileOpen(false)}
          >
            <Info className="w-5 h-5 text-rellia-mint" />
            About
          </Link>

          <Link
            to="/programs"
            className="flex items-center gap-3 py-4 border-b border-black/5 font-host-grotesk text-base font-medium text-rellia-teal"
            onClick={() => setMobileOpen(false)}
          >
            <CalendarDays className="w-5 h-5 text-rellia-mint" />
            Programs &amp; Events
          </Link>

          {/* Network — link navigates to /network; chevron toggles the section sub-list */}
          <div className="border-b border-black/5">
            <div className="flex items-center justify-between w-full">
              <Link
                to="/network"
                className="flex items-center gap-3 py-4 font-host-grotesk text-base font-medium text-rellia-teal flex-1"
                onClick={() => setMobileOpen(false)}
              >
                <Users className="w-5 h-5 text-rellia-mint" />
                Network
              </Link>
              <button
                type="button"
                aria-label={networkOpen ? "Collapse Network sections" : "Expand Network sections"}
                aria-expanded={networkOpen}
                className="p-3 -mr-2"
                onClick={() => setNetworkOpen(!networkOpen)}
              >
                <ChevronDown
                  className={`w-5 h-5 text-rellia-teal transition-transform duration-200 ${networkOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
            {networkOpen && (
              <div className="pl-8 pb-3 flex flex-col gap-1">
                {networkItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="flex items-center gap-3 py-2.5 font-host-grotesk text-sm font-medium text-rellia-teal/80 hover:text-rellia-teal"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="w-4 h-4 text-rellia-mint" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            to="/faq"
            className="flex items-center gap-3 py-4 border-b border-black/5 font-host-grotesk text-base font-medium text-rellia-teal"
            onClick={() => setMobileOpen(false)}
          >
            <HelpCircle className="w-5 h-5 text-rellia-mint" />
            FAQ
          </Link>

          <div className="mt-5 flex flex-col gap-3">
            <Link
              to="/network"
              className={cn(
                "flex items-center justify-center gap-2 bg-rellia-teal text-white font-host-grotesk font-semibold text-base px-7 py-3.5 border-2 border-rellia-teal hover:bg-transparent hover:text-rellia-teal transition-all duration-200 w-full",
                ctaRadiusClassName,
              )}
              onClick={() => setMobileOpen(false)}
            >
              <UserPlus className="w-5 h-5" />
              Get Involved
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
