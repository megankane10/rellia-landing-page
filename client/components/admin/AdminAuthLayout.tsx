import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const SANITY_STUDIO_URL = "https://relliahealth.sanity.studio"
const LOGO_SRC = "/images/logo-rellia-footer.webp"

type AdminAuthLayoutProps = {
  title: string
  description: string
  children: ReactNode
}

const AdminAuthLayout = ({ title, description, children }: AdminAuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <section className="relative w-full min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] xl:grid-cols-[40%_60%] min-h-screen">
          <AdminAuthLeftPanel />
          <div className="relative flex min-h-[480px] lg:min-h-screen flex-col items-center justify-center bg-white px-6 py-14 md:px-12 md:py-20 lg:px-16">
            <div className="pointer-events-none absolute top-1/4 -right-20 h-80 w-80 rounded-full bg-rellia-mint/5 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-10 -right-20 h-80 w-80 rounded-full bg-rellia-mint/10 blur-[120px]" />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 flex w-full max-w-sm flex-col items-center"
            >
              <div className="w-full text-center">
                <h1 className="font-host-grotesk text-2xl font-bold text-rellia-teal">{title}</h1>
                <p className="mt-2 font-urbanist text-sm text-black/60">{description}</p>
              </div>
              <div className="mt-8 w-full">{children}</div>
              <nav
                className="mt-10 flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6"
                aria-label="Admin page utilities"
              >
                <Link
                  to="/"
                  className="font-urbanist text-xs text-black/45 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint rounded"
                >
                  ← Back to website
                </Link>
                <a
                  href={SANITY_STUDIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-urbanist text-xs text-black/45 transition-colors hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint rounded"
                >
                  Content Management System
                </a>
              </nav>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

const AdminAuthLeftPanel = () => {
  return (
    <div className="relative flex min-h-[420px] lg:min-h-full flex-col overflow-hidden bg-rellia-teal px-6 py-10 lg:px-12 lg:py-12">
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

      <div className="relative z-10 flex flex-1 flex-col">
        <Link
          to="/"
          className="inline-flex w-fit rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint"
          aria-label="Rellia Health home"
        >
          <img src={LOGO_SRC} alt="Rellia Health" className="h-9 w-auto md:h-10" />
        </Link>

        <div className="flex flex-1 flex-col justify-center py-12 lg:py-16">
          <p className="max-w-md text-left font-urbanist text-2xl font-medium leading-snug text-white md:text-3xl lg:text-4xl">
            The work you do here helps founders move faster—with clarity, care, and confidence.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-rellia-mint/15 blur-[120px]" />
    </div>
  )
}

export default AdminAuthLayout
