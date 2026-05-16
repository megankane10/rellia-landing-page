import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NotFound from "@/pages/NotFound"
import { PageRenderer } from "@/components/cms/PageRenderer"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import type { CmsSingletonPageContent } from "@shared/cms/types"

export default function NetworkCmsPage({
  page,
  isLoading,
}: {
  page: CmsSingletonPageContent | null
  isLoading: boolean
}) {
  useApplyCmsSeo(page?.seo)

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

  if (!page || (page.sections ?? []).length === 0) return <NotFound />

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

