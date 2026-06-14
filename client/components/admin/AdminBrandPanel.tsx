import type { ReactNode } from "react"
import { Link } from "react-router-dom"

const HOLOGRAM_LOGO_SRC = "/images/hologram-logo.png"

type AdminBrandPanelProps = {
  heading: ReactNode
  description: string
  children?: ReactNode
  /** Mint accent on admin auth screens; default keeps white text (e.g. contact page). */
  textTone?: "white" | "mint"
}

/** Rounded teal brand panel with gradient — shared by admin login and contact page. */
const AdminBrandPanel = ({ heading, description, children, textTone = "white" }: AdminBrandPanelProps) => {
  const headingClass = textTone === "mint" ? "text-rellia-mint" : "text-white"

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
            className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 inline-flex w-fit rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint"
            aria-label="Rellia Health home"
          >
            <img
              src={HOLOGRAM_LOGO_SRC}
              alt=""
              width={64}
              height={64}
              className="h-12 w-12 md:h-16 md:w-16 opacity-95 drop-shadow-[0_0_15px_rgba(152,255,232,0.3)]"
            />
          </Link>

          <div className="flex w-full flex-1 flex-col justify-start py-10 md:py-12 lg:justify-center">
            <h2 className="w-full px-2 pt-8 text-left font-urbanist text-2xl font-medium leading-snug md:pt-12 md:text-4xl lg:text-5xl">
              {typeof heading === "string" ? (
                <span className={headingClass}>{heading}</span>
              ) : (
                heading
              )}
            </h2>
            <p className="mt-5 w-full px-2 text-left font-urbanist text-lg leading-relaxed text-white/60 md:text-xl">
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
