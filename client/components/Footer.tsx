import { Link } from "react-router-dom"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"
import { GETPROVEN_VENDORS_GRID_URL } from "@/config/partnerLinks"
import { CareersHiringBadge } from "@/components/CareersHiringBadge"
import { InstagramFilled, LinkedInFilled, MailFilled } from "@/components/icons/SocialIcons"

const g = DEFAULT_GLOBAL_SETTINGS

const footerLinkClass =
  "font-urbanist text-[14px] leading-snug text-white transition-colors hover:text-rellia-mint md:text-[15px] md:leading-normal"

const footerSectionHeadingClass =
  "font-host-grotesk text-[14px] font-semibold leading-snug tracking-normal text-rellia-mint md:text-[15px] md:leading-normal"

const legalLinkClass =
  "font-urbanist text-[13px] leading-snug text-white/70 transition-colors hover:text-rellia-mint md:text-sm"

export default function Footer() {
  return (
    <footer
      className="p-2 sm:p-4 md:p-[30px]"
      style={{ backgroundColor: "var(--footer-backdrop, transparent)" }}
    >
      <div className="w-full rounded-2xl border border-white/10 bg-rellia-teal text-white shadow-[0_28px_80px_-40px_rgba(13,53,64,0.55)] md:rounded-[28px]">
        <div className="px-4 py-10 md:px-10 md:py-16 lg:px-12">
          {/* Mobile header (logo + tagline first) */}
          <div className="mb-10 flex flex-col gap-4 md:hidden">
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

            <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-8 gap-y-10 sm:gap-x-10 md:gap-x-12 md:pl-6 lg:grid-cols-4 lg:gap-x-8 lg:pl-10 xl:gap-x-12 xl:pl-14">
              {/* Solutions */}
              <div className="flex min-w-0 flex-col gap-4 md:gap-6">
                <h4 className={footerSectionHeadingClass}>Solutions</h4>
                <nav className="flex flex-col gap-2 md:gap-3" aria-label="Solutions links">
                  <Link to="/apply" className={footerLinkClass}>
                    Apply
                  </Link>
                  <Link to="/programs" className={footerLinkClass}>
                    Programs
                  </Link>
                  <Link to="/events" className={footerLinkClass}>
                    Events
                  </Link>
                  <Link to="/diagnostic-survey" className={footerLinkClass}>
                    Startup Diagnostic
                  </Link>
                  <Link to="/consulting" className={footerLinkClass}>
                    Consulting
                  </Link>
                </nav>
              </div>

              {/* Network */}
              <div className="flex min-w-0 flex-col gap-4 md:gap-6">
                <h4 className={footerSectionHeadingClass}>Network</h4>
                <nav className="flex flex-col gap-2 md:gap-3" aria-label="Network links">
                  <Link to="/founders" className={footerLinkClass}>
                    Founders
                  </Link>
                  <Link to="/advisors" className={footerLinkClass}>
                    Advisors
                  </Link>
                  <Link to="/investors" className={footerLinkClass}>
                    Investors
                  </Link>
                  <Link to="/industry-partners" className={footerLinkClass}>
                    Industry Partners
                  </Link>
                </nav>
              </div>

              {/* Resources */}
              <div className="flex min-w-0 flex-col gap-4 md:gap-6">
                <h4 className={footerSectionHeadingClass}>Resources</h4>
                <nav className="flex flex-col gap-2 md:gap-3" aria-label="Resources links">
                  <Link to="/stories" className={footerLinkClass}>
                    Stories
                  </Link>
                  <Link to="/founders/directory" className={footerLinkClass}>
                    Startups Directory
                  </Link>
                  <Link to="/advisors/directory" className={footerLinkClass}>
                    Advisors Directory
                  </Link>
                  <a
                    href={GETPROVEN_VENDORS_GRID_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footerLinkClass}
                  >
                    Industry Partners Directory
                  </a>
                </nav>
              </div>

              {/* Company */}
              <div className="flex min-w-0 flex-col gap-4 md:gap-6">
                <h4 className={footerSectionHeadingClass}>Company</h4>
                <nav className="flex flex-col gap-2 md:gap-3" aria-label="Company links">
                  <Link to="/about" className={footerLinkClass}>
                    About Us
                  </Link>
                  <Link to="/faq" className={footerLinkClass}>
                    FAQ
                  </Link>
                  <Link
                    to="/careers"
                    className={`inline-flex max-w-full flex-wrap items-center gap-2 ${footerLinkClass}`}
                  >
                    <span>Careers</span>
                    <CareersHiringBadge />
                  </Link>
                  <Link to="/contact" className={footerLinkClass}>
                    Contact
                  </Link>
                </nav>
              </div>
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

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:pt-8">
            <p className="text-left font-urbanist text-[13px] leading-snug text-white/55 md:text-sm sm:max-w-[min(100%,28rem)]">
              &copy; {new Date().getFullYear()} {g.copyrightLine} · Ontario, Canada
            </p>
            <nav
              className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:ml-auto sm:shrink-0 sm:justify-end lg:gap-x-8 lg:pr-2"
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
