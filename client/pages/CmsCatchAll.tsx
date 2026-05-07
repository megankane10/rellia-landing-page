import { useMemo } from "react"
import { useLocation } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NotFound from "@/pages/NotFound"
import { useCmsPageBySlug } from "@/hooks/useCmsDocuments"
import { PageRenderer } from "@/components/cms/PageRenderer"

const getSingleSegmentSlug = (pathname: string) => {
  const clean = pathname.trim().replace(/\/+$/, "")
  if (!clean || clean === "/") return ""
  const raw = clean.startsWith("/") ? clean.slice(1) : clean
  if (!raw) return ""
  if (raw.includes("/")) return ""
  return raw
}

export default function CmsCatchAll() {
  const location = useLocation()

  const slug = useMemo(() => getSingleSegmentSlug(location.pathname), [location.pathname])
  const { data: page, isLoading } = useCmsPageBySlug(slug)

  if (!slug) return <NotFound />

  if (isLoading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
        <Navbar />
        <main id="main-content" className="pt-28 md:pt-36">
          <div className="mx-auto max-w-[900px] px-6 md:px-10">
            <div className="h-10 w-2/3 animate-pulse rounded-xl bg-black/5" />
            <div className="mt-6 h-5 w-full animate-pulse rounded-lg bg-black/5" />
            <div className="mt-3 h-5 w-11/12 animate-pulse rounded-lg bg-black/5" />
            <div className="mt-10 h-40 w-full animate-pulse rounded-2xl bg-black/5" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!page) return <NotFound />

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />
      <main id="main-content">
        <PageRenderer page={page} />
      </main>
      <Footer />
    </div>
  )
}

