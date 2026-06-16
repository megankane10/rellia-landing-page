import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta"
import { SearchAlertIcon } from "@/components/icons/SearchAlertIcon"
import { lookupLucideIcon } from "@/lib/resolveLucideIcon"
import { CmsNotFoundPageSkeleton } from "@/components/cms/CmsPageSkeletons"
import { useNotFoundPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_NOT_FOUND } from "@shared/cms/defaults"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { isCmsQueryLoading } from "@/lib/cmsQueryState"
import { isSanityConfigured } from "@/lib/sanity"
import { cmsDisplayText } from "@/lib/cmsStega"

const NotFound = () => {
  const location = useLocation()
  const notFoundQuery = useNotFoundPage()
  const copy = notFoundQuery.data ?? DEFAULT_NOT_FOUND
  const cmsLoading = isSanityConfigured() && isCmsQueryLoading(notFoundQuery)

  useApplyCmsSeo(copy.seo)

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname)
  }, [location.pathname])

  const iconKey = copy.iconKey?.trim() || DEFAULT_NOT_FOUND.iconKey || "search-alert"
  const NotFoundIcon = lookupLucideIcon(iconKey) ?? SearchAlertIcon

  return (
    <div className="flex min-h-screen flex-col bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />
      <main id="main-content" className="flex flex-1 flex-col pt-0">
        {cmsLoading ? (
          <CmsNotFoundPageSkeleton />
        ) : (
          <>
            <h1 className="sr-only">{cmsDisplayText(copy.title)}</h1>
            <RelliaCta
              icon={<NotFoundIcon className="h-20 w-20 text-rellia-teal" strokeWidth={1.25} />}
              title={cmsDisplayText(copy.title)}
              body={cmsDisplayText(copy.message)}
              primary={ctaActionFromHref(copy.ctaLabel || "Back to home", "/")}
              className="flex-1 mt-0 pt-20 md:pt-32 lg:pt-40"
              roundedClassName="rounded-none"
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default NotFound
