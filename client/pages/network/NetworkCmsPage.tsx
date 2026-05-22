import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NotFound from "@/pages/NotFound"
import { PageRenderer } from "@/components/cms/PageRenderer"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import type { CmsSingletonPageContent } from "@shared/cms/types"
import CmsPageLoadingShell from "@/components/cms/CmsPageLoadingShell"
import { isCmsQueryLoading, shouldShowCmsEmptyState } from "@/lib/cmsQueryState"
import type { UseQueryResult } from "@tanstack/react-query"

export default function NetworkCmsPage({
  page,
  query,
}: {
  page: CmsSingletonPageContent | null | undefined
  query: Pick<UseQueryResult<CmsSingletonPageContent | null>, "isPending" | "isFetching" | "isLoading" | "data" | "isFetched" | "isError">
}) {
  useApplyCmsSeo(page?.seo)

  if (isCmsQueryLoading(query)) return <CmsPageLoadingShell />

  if (
    shouldShowCmsEmptyState(query) &&
    (!page || (page.sections ?? []).length === 0)
  ) {
    return <NotFound />
  }

  if (!page) return <CmsPageLoadingShell />

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />
      <main id="main-content">
        <PageRenderer page={{ title: page.title, slug: "network", seo: page.seo, sections: page.sections }} />
      </main>
      <Footer />
    </div>
  )
}

