import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

type AdminAuthLayoutProps = {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

const AdminAuthLayout = ({ title, description, children, footer }: AdminAuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <section className="relative w-full min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] xl:grid-cols-[40%_60%] min-h-screen">
          <AdminAuthLeftPanel />
          <div className="bg-white px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-32 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-rellia-mint/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 -right-20 w-80 h-80 bg-rellia-mint/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="relative z-10 w-full max-w-sm">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="font-host-grotesk text-2xl font-bold text-rellia-teal">{title}</h1>
                <p className="mt-2 font-urbanist text-sm text-black/60">{description}</p>
                <div className="mt-8">{children}</div>
                {footer ? <div className="mt-6">{footer}</div> : null}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const AdminAuthLeftPanel = () => {
  return (
    <div className="relative bg-rellia-teal min-h-[420px] lg:min-h-full flex flex-col px-6 pt-24 pb-16 md:pt-32 md:pb-20 lg:px-20 overflow-hidden">
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
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-rellia-mint/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-rellia-mint/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center">
        <Link
          to="/"
          className="inline-flex w-fit items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal"
          aria-label="Rellia Health home"
        >
          <img
            src="/images/hologram-logo.png"
            alt=""
            aria-hidden
            width={72}
            height={72}
            loading="eager"
            decoding="async"
            className="h-[72px] w-[72px] opacity-90 drop-shadow-[0_0_15px_rgba(152,255,232,0.3)]"
          />
        </Link>
        <p className="mt-10 max-w-md font-urbanist text-lg leading-relaxed text-white/90">
          Internal tools for diagnostic submissions and content operations.
        </p>
      </div>

      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rellia-mint/15 rounded-full blur-[120px] pointer-events-none" />
    </div>
  )
}

export default AdminAuthLayout
