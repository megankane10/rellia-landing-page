import { useMemo } from "react"
import { useLocation } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NotFound from "@/pages/NotFound"
import { useCmsPageBySlug } from "@/hooks/useCmsDocuments"
import { PageRenderer } from "@/components/cms/PageRenderer"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { isCmsQueryLoading } from "@/lib/cmsQueryState"
import { CmsModularPageSkeleton } from "@/components/cms/CmsPageSkeletons"

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
  useApplyCmsSeo(
    page?.seo,
    page?.title
      ? {
          title: page.seo?.metaTitle?.trim()
            ? undefined
            : `${page.title} — Rellia Health`,
          noIndex: typeof page.seo?.noIndex === "boolean" ? undefined : false,
        }
      : undefined,
  )

  if (!slug) return <NotFound />
  if (isCmsQueryLoading(pageQuery)) {
    return <CmsModularPageSkeleton />
  }
  if (!page) return <NotFound />

  const sections = page?.sections ?? []
  const hasRenderableSections = sections.some((section) => Boolean(section?._type))

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar forceSolid />
      <main id="main-content" className="pt-[72px] md:pt-[86px]">
        {hasRenderableSections ? (
          <PageRenderer page={page!} />
        ) : (
          <div className="mx-auto max-w-[900px] px-6 py-28 md:px-10 md:py-36">
            <h1 className="font-host-grotesk text-2xl font-semibold text-black">{page?.title ?? slug}</h1>
            <p className="mt-4 font-urbanist text-base text-black/65 leading-relaxed">
              This page is published in Sanity but has no sections yet. Add at least one block under{" "}
              <strong>Page sections</strong> in Studio (same library as pre-built pages’ Modular sections tab), then publish.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

