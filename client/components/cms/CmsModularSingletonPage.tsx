import type { ReactNode } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import CmsPageVisibilityGate from "@/components/cms/CmsPageVisibilityGate"
import { PageRenderer } from "@/components/cms/PageRenderer"
import type { CmsSingletonPageContent } from "@shared/cms/types"

type CmsModularSingletonPageProps = {
  page: CmsSingletonPageContent | null | undefined
  slug: string
  fallback: ReactNode
}

/**
 * Renders Sanity modular sections when `useModularPage` is on and sections exist;
 * otherwise shows the designed React fallback page (SEO still comes from CMS when wired).
 */
export const CmsModularSingletonPage = ({ page, slug, fallback }: CmsModularSingletonPageProps) => {
  const useModularLayout =
    Boolean(page?.useModularPage) && Array.isArray(page?.sections) && page.sections.length > 0

  if (useModularLayout) {
    return (
      <CmsPageVisibilityGate page={page}>
        <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
          <Navbar forceSolid />
          <main id="main-content" className="pt-[72px] md:pt-[86px]">
            <PageRenderer
              page={{
                title: page?.title,
                slug,
                seo: page?.seo,
                sections: page?.sections,
              }}
            />
          </main>
          <Footer />
        </div>
      </CmsPageVisibilityGate>
    )
  }

  return <CmsPageVisibilityGate page={page}>{fallback}</CmsPageVisibilityGate>
}
