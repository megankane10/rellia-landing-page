import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import AdminBrandPanel from "@/components/admin/AdminBrandPanel"

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
        <AdminBrandPanel heading={leftHeading} description={leftDescription} />
        <div className="flex min-h-[480px] flex-col justify-center px-6 py-14 md:px-12 md:py-16 lg:min-h-screen lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex w-full max-w-sm flex-col items-center"
          >
            <div className="w-full text-center">
              <h1 className="font-host-grotesk text-2xl text-black">{title}</h1>
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

export default AdminAuthLayout
