import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const HOLOGRAM_LOGO_SRC = "/images/hologram-logo.png"

type AdminAuthLayoutProps = {
  title: string
  description: string
  leftHeading: string
  leftDescription: string
  children: ReactNode
}

const AdminAuthLayout = ({
  title,
  description,
  leftHeading,
  leftDescription,
  children,
}: AdminAuthLayoutProps) => (
  <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
    <section className="relative min-h-screen w-full">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[45%_55%] xl:grid-cols-[40%_60%] lg:items-stretch">
        <AdminAuthLeftPanel heading={leftHeading} description={leftDescription} />
        <div className="relative flex min-h-[480px] flex-col justify-center bg-white px-6 py-14 md:px-12 md:py-16 lg:min-h-screen lg:px-16">
          <div className="pointer-events-none absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-rellia-mint/5 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-10 -right-20 h-80 w-80 rounded-full bg-rellia-mint/10 blur-[120px]" />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center"
          >
            <div className="w-full text-center">
              <h1 className="font-host-grotesk text-2xl font-bold text-black">{title}</h1>
              <p className="mt-2 font-urbanist text-base text-black/65">{description}</p>
            </div>
            <div className="mt-8 w-full">{children}</div>
            <nav className="mt-10" aria-label="Admin page utilities">
              <Link
                to="/"
                className="rounded font-urbanist text-sm text-black/50 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint"
              >
                ← Back to website
              </Link>
            </nav>
          </motion.div>
        </div>
      </div>
    </section>
  </div>
)

type AdminAuthLeftPanelProps = {
  heading: string
  description: string
}

const AdminAuthLeftPanel = ({ heading, description }: AdminAuthLeftPanelProps) => (
  <div className="relative flex min-h-[420px] flex-1 flex-col justify-center overflow-hidden bg-rellia-teal px-6 py-14 md:px-12 md:py-16 lg:min-h-screen lg:px-12 xl:px-16">
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
      <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal via-rellia-teal/95 to-rellia-teal/80" />
      <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-rellia-mint/20 blur-[120px]" />
      <div className="absolute bottom-[-5%] right-[-5%] h-[40%] w-[40%] rounded-full bg-rellia-mint/10 blur-[100px]" />
    </div>

    <div className="relative z-10 mx-auto w-full max-w-xl">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint"
          aria-label="Rellia Health home"
        >
          <img
            src={HOLOGRAM_LOGO_SRC}
            alt=""
            width={64}
            height={64}
            className="h-16 w-16 opacity-90 drop-shadow-[0_0_15px_rgba(152,255,232,0.3)]"
          />
        </Link>
      </div>

      <h2 className="max-w-md text-left font-urbanist text-2xl font-medium leading-snug text-white md:text-3xl lg:text-4xl">
        {heading}
      </h2>
      <p className="mt-6 max-w-md text-left font-urbanist text-sm leading-relaxed text-white/80 md:text-base">
        {description}
      </p>
    </div>

    <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-rellia-mint/15 blur-[120px]" />
  </div>
)

export default AdminAuthLayout
