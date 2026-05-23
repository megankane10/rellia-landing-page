import type { ReactNode } from "react"
import { Link } from "react-router-dom"

const HOLOGRAM_LOGO_SRC = "/images/hologram-logo.png"

type AdminBrandPanelProps = {
  heading: string
  description: string
  children?: ReactNode
  /** Mint accent on admin auth screens; default keeps white text (e.g. contact page). */
  textTone?: "white" | "mint"
}

/** Rounded teal brand panel with gradient — shared by admin login and contact page. */
const AdminBrandPanel = ({ heading, description, children, textTone = "white" }: AdminBrandPanelProps) => {
  const headingClass = textTone === "mint" ? "text-rellia-mint" : "text-white"
  const descriptionClass = textTone === "mint" ? "text-rellia-mint/80" : "text-white/70"

  return (
    <div className="flex flex-col p-4 md:p-6 lg:min-h-screen lg:p-8">
      <div className="relative flex min-h-[420px] flex-1 flex-col overflow-hidden rounded-[1.75rem] bg-rellia-teal lg:min-h-[min(720px,calc(100vh-4rem))]">
        <div className="absolute inset-0">
          <img
            src="/health_tech_collaboration_1778023064936.png"
            alt=""
            aria-hidden
            width={1920}
            height={1080}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover opacity-35 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal via-[#0f5c5c] to-rellia-teal/85" />
          <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-rellia-mint/25 blur-[120px]" />
          <div className="absolute bottom-[-5%] right-[-5%] h-[40%] w-[40%] rounded-full bg-rellia-mint/15 blur-[100px]" />
        </div>

        <div className="relative z-10 flex min-h-[420px] flex-1 flex-col p-6 md:p-10 lg:min-h-[min(720px,calc(100vh-4rem))]">
          <Link
            to="/"
            className="inline-flex w-fit rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint"
            aria-label="Rellia Health home"
          >
            <img
              src={HOLOGRAM_LOGO_SRC}
              alt=""
              width={64}
              height={64}
              className="h-14 w-14 opacity-90 drop-shadow-[0_0_15px_rgba(152,255,232,0.3)] md:h-16 md:w-16"
            />
          </Link>

          <div className="flex flex-1 flex-col justify-center py-10 md:py-12">
            <h2
              className={`max-w-md text-left font-urbanist text-2xl font-semibold leading-snug md:text-3xl lg:text-[2rem] ${headingClass}`}
            >
              {heading}
            </h2>
            <p className={`mt-5 max-w-md text-left font-urbanist text-sm leading-relaxed md:text-base ${descriptionClass}`}>
              {description}
            </p>
            {children}
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-rellia-mint/15 blur-[120px]" />
      </div>
    </div>
  )
}

export default AdminBrandPanel
