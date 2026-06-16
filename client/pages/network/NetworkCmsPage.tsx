import type { ReactNode } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NotFound from "@/pages/NotFound"
import { SectionsRenderer } from "@/components/cms/PageRenderer"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import type { CmsPageSection, CmsSingletonPageContent } from "@shared/cms/types"
import { CmsModularSectionsSkeleton } from "@/components/cms/CmsPageSkeletons"
import { isCmsQueryLoading, shouldShowCmsEmptyState } from "@/lib/cmsQueryState"
import type { UseQueryResult } from "@tanstack/react-query"

const isHeroSection = (section: CmsPageSection) =>
  section._type === "sectionHero" || section._type === "sectionMarketingHero"

type NetworkCmsPageProps = {
  page: CmsSingletonPageContent | null | undefined
  query: Pick<
    UseQueryResult<CmsSingletonPageContent | null>,
    "isPending" | "isFetching" | "isLoading" | "data" | "isFetched" | "isError"
  >
  slug?: string
  renderExtras?: (page: CmsSingletonPageContent) => ReactNode
  children?: ReactNode
}

export default function NetworkCmsPage({
  page,
  query,
  slug = "network",
  renderExtras,
  children,
}: NetworkCmsPageProps) {
  useApplyCmsSeo(page?.seo)

  if (isCmsQueryLoading(query)) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
        <Navbar forceSolid />
        <main id="main-content" className="pt-[72px] md:pt-[86px]">
          <CmsModularSectionsSkeleton />
        </main>
        <Footer />
      </div>
    )
  }

  if (
    shouldShowCmsEmptyState(query) &&
    (!page || (page.sections ?? []).length === 0)
  ) {
    return <NotFound />
  }

  if (!page) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
        <Navbar forceSolid />
        <main id="main-content" className="pt-[72px] md:pt-[86px]">
          <CmsModularSectionsSkeleton />
        </main>
        <Footer />
      </div>
    )
  }

  const sections = page.sections ?? []
  const afterFirstHero = renderExtras?.(page) ?? children

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar forceSolid />
      <main id="main-content" className="pt-[72px] md:pt-[86px]">
        <SectionsRenderer sections={sections} renderAfterFirstHero={afterFirstHero} />
      </main>
      <Footer />
    </div>
  )
}
