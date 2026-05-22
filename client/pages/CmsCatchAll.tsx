import { useMemo } from "react"
import { useLocation } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NotFound from "@/pages/NotFound"
import { useCmsPageBySlug } from "@/hooks/useCmsDocuments"
import { PageRenderer } from "@/components/cms/PageRenderer"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import CmsPageLoadingShell from "@/components/cms/CmsPageLoadingShell"
import { isCmsQueryLoading, shouldShowCmsEmptyState } from "@/lib/cmsQueryState"

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
  const pageQuery = useCmsPageBySlug(slug)
  const { data: page } = pageQuery
  useApplyCmsSeo(page?.seo)

  if (!slug) return <NotFound />

  if (isCmsQueryLoading(pageQuery)) return <CmsPageLoadingShell />

  if (shouldShowCmsEmptyState(pageQuery) && !page) return <NotFound />

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

