import { Instagram, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults";

const g = DEFAULT_GLOBAL_SETTINGS

export default function Footer() {
  return (
    <footer className="bg-rellia-teal text-white pt-20 pb-10 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center">
              <img
                src="/images/logo-rellia-footer.webp"
                alt="Rellia"
                className="h-10 w-auto"
              />
            </Link>
            <p className="font-urbanist text-white/70 text-[15px] leading-relaxed max-w-[280px]">
              {g.footerTagline}
            </p>
            <div className="flex gap-4">
              <a
                href={g.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Rellia Health on LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white/80" />
              </a>
              <a
                href={g.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Rellia Health on Instagram"
              >
                <Instagram className="w-5 h-5 text-white/80" />
              </a>
              <a
                href={`mailto:${g.supportEmail}`}
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                aria-label={`Email ${g.supportEmail}`}
              >
                <Mail className="w-5 h-5 text-white/80" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-6">
            <h4 className="font-host-grotesk font-bold text-lg text-white">Company</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/about" className="font-urbanist text-white/70 hover:text-rellia-mint transition-colors text-[15px]">About Us</Link>
              <Link to="/terms" className="font-urbanist text-white/70 hover:text-rellia-mint transition-colors text-[15px]">
                Terms of Use
              </Link>
              <Link to="/privacy" className="font-urbanist text-white/70 hover:text-rellia-mint transition-colors text-[15px]">
                Privacy Policy
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-6">
            <h4 className="font-host-grotesk font-bold text-lg text-white">Support</h4>
            <nav className="flex flex-col gap-3">
              <Link
                to="/faq"
                className="font-urbanist text-white/70 hover:text-rellia-mint transition-colors text-[15px]"
              >
                FAQ
              </Link>
              <Link
                to="/contact"
                className="font-urbanist text-white/70 hover:text-rellia-mint transition-colors text-[15px]"
              >
                Contact Us
              </Link>
            </nav>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex items-center justify-center">
          <p className="font-urbanist text-white/50 text-sm text-center">
            &copy; {new Date().getFullYear()} {g.copyrightLine}
          </p>
        </div>
      </div>
    </footer>
  );
}
