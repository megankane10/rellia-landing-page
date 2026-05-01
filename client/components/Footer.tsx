import { Link } from "react-router-dom"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"
import { InstagramFilled, LinkedInFilled, MailFilled } from "@/components/icons/SocialIcons"

const g = DEFAULT_GLOBAL_SETTINGS

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

          <div className="mb-14 grid grid-cols-2 gap-x-6 gap-y-11 md:mb-16 md:grid-cols-2 md:gap-x-12 md:gap-y-12 lg:grid-cols-3">
            <div className="hidden flex-col gap-6 md:flex">
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

            {/* Company */}
            <div className="flex min-w-0 flex-col gap-4 md:gap-6">
              <h4 className="font-host-grotesk text-[14px] font-semibold leading-snug tracking-normal text-rellia-mint md:text-[15px] md:leading-normal">
                Company
              </h4>
              <nav className="flex flex-col gap-2 md:gap-3">
                <Link
                  to="/about"
                  className="font-urbanist text-[14px] leading-snug text-white transition-colors hover:text-rellia-mint md:text-[15px] md:leading-normal"
                >
                  About Us
                </Link>
                <Link
                  to="/careers"
                  className="font-urbanist text-[14px] leading-snug text-white transition-colors hover:text-rellia-mint md:text-[15px] md:leading-normal"
                >
                  Careers
                </Link>
                <Link
                  to="/terms"
                  className="font-urbanist text-[14px] leading-snug text-white transition-colors hover:text-rellia-mint md:text-[15px] md:leading-normal"
                >
                  Terms of Use
                </Link>
                <Link
                  to="/privacy"
                  className="font-urbanist text-[14px] leading-snug text-white transition-colors hover:text-rellia-mint md:text-[15px] md:leading-normal"
                >
                  Privacy Policy
                </Link>
              </nav>
            </div>

            {/* Support */}
            <div className="flex min-w-0 flex-col gap-4 md:gap-6">
              <h4 className="font-host-grotesk text-[14px] font-semibold leading-snug tracking-normal text-rellia-mint md:text-[15px] md:leading-normal">
                Support
              </h4>
              <nav className="flex flex-col gap-2 md:gap-3">
                <Link
                  to="/faq"
                  className="font-urbanist text-[14px] leading-snug text-white transition-colors hover:text-rellia-mint md:text-[15px] md:leading-normal"
                >
                  FAQ
                </Link>
                <Link
                  to="/contact"
                  className="font-urbanist text-[14px] leading-snug text-white transition-colors hover:text-rellia-mint md:text-[15px] md:leading-normal"
                >
                  Contact Us
                </Link>
              </nav>
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

          <div className="flex items-center justify-center border-t border-white/10 pt-6 md:pt-8">
            <p className="text-center font-urbanist text-[13px] leading-snug text-white/55 md:text-sm">
              &copy; {new Date().getFullYear()} {g.copyrightLine} · Ontario, Canada
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
