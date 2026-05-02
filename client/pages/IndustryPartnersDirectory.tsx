import { useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { GETPROVEN_VENDORS_GRID_URL } from "@/config/partnerLinks"

/**
 * Route kept for bookmarks and SEO; immediately sends visitors to the GetProven vendor grid.
 * In-app navigation should link to {@link GETPROVEN_VENDORS_GRID_URL} directly.
 */
export default function IndustryPartnersDirectory() {
  useEffect(() => {
    window.location.replace(GETPROVEN_VENDORS_GRID_URL)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />
      <main id="main-content" className="flex min-h-[50vh] flex-col items-center justify-center px-6 pb-24 pt-32 text-center md:pt-40">
        <p className="max-w-md font-urbanist text-lg leading-relaxed text-black/70">
          Opening the partner vendor directory on GetProven…
        </p>
        <a
          href={GETPROVEN_VENDORS_GRID_URL}
          className="mt-6 font-host-grotesk text-base font-semibold text-rellia-teal underline underline-offset-4 transition-colors hover:text-rellia-teal/90"
        >
          Continue to directory
        </a>
        <Link to="/industry-partners" className="mt-8 font-urbanist text-sm text-black/50 hover:text-rellia-teal">
          Back to Industry partners
        </Link>
      </main>
      <Footer />
    </div>
  )
}
