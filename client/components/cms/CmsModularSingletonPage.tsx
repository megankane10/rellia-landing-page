import type { ReactNode } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { PageRenderer } from "@/components/cms/PageRenderer"
import type { CmsSingletonPageContent } from "@shared/cms/types"

type CmsModularSingletonPageProps = {
  page: CmsSingletonPageContent | null | undefined
  slug: string
  fallback: ReactNode
  renderAfterFirstHero?: ReactNode | ((page: CmsSingletonPageContent) => ReactNode)
}

/**
 * Renders Sanity modular sections when sections exist;
 * otherwise shows the designed React fallback page (SEO still comes from CMS when wired).
 */
export const CmsModularSingletonPage = ({
  page,
  slug,
  fallback,
  renderAfterFirstHero,
}: CmsModularSingletonPageProps) => {
  const useModularLayout = (page?.sections?.length ?? 0) > 0

  if (useModularLayout && page) {
    const extras =
      typeof renderAfterFirstHero === "function"
        ? renderAfterFirstHero(page)
        : renderAfterFirstHero

    return (
      <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
        <Navbar forceSolid />
        <main id="main-content" className="pt-[72px] md:pt-[86px]">
          <PageRenderer
            page={{
              title: page.title,
              slug,
              seo: page.seo,
              sections: page.sections,
            }}
            renderAfterFirstHero={extras}
          />
        </main>
        <Footer />
      </div>
    )
  }

  return <>{fallback}</>
}
