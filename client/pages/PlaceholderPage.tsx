import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Link } from "react-router-dom"
import { MoveLeft } from "lucide-react"

export default function PlaceholderPage({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="min-h-screen bg-rellia-cream flex flex-col font-host-grotesk">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 pt-[72px] md:pt-[86px] text-center">
        <div className="max-w-2xl bg-white/50 backdrop-blur-sm p-12 md:p-20 rounded-3xl border border-black/5 shadow-xl w-full">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-rellia-mint/30 text-rellia-teal text-sm font-semibold uppercase tracking-wider">
            Coming Soon
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 tracking-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-black/70 mb-10 leading-relaxed font-urbanist">
            {subtitle ||
              `The ${title} experience is currently under development. We're building something special—stay tuned.`}
          </p>
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-rellia-teal text-white px-8 py-4 rounded-full font-semibold hover:bg-rellia-teal/90 transition-all hover:gap-4"
              aria-label="Back to Home"
              tabIndex={0}
            >
              <MoveLeft className="w-5 h-5" aria-hidden />
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

