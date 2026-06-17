import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta"
import { SearchAlertIcon } from "@/components/icons/SearchAlertIcon"
import { lookupLucideIcon } from "@/lib/resolveLucideIcon"
import { useNotFoundPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_NOT_FOUND } from "@shared/cms/defaults"
import { useApplyCmsSeo } from "@/hooks/useApplyCmsSeo"
import { cmsDisplayText } from "@/lib/cmsStega"

const NotFound = () => {
  const location = useLocation()
  const notFoundQuery = useNotFoundPage()
  const copy = notFoundQuery.data ?? DEFAULT_NOT_FOUND

  useApplyCmsSeo(copy.seo)

  useEffect(() => {
    if (!import.meta.env.DEV) return

    const key = `rellia:not-found-logged:${location.pathname}`
    if (window.sessionStorage.getItem(key)) return
    window.sessionStorage.setItem(key, "1")

    console.warn("404 route:", location.pathname)
  }, [location.pathname])

  const iconKey = copy.iconKey?.trim() || DEFAULT_NOT_FOUND.iconKey || "search-alert"
  const NotFoundIcon = lookupLucideIcon(iconKey) ?? SearchAlertIcon

  return (
    <div className="flex min-h-screen flex-col bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />
      <main id="main-content" className="flex flex-1 flex-col">
        <h1 className="sr-only">{cmsDisplayText(copy.title)}</h1>
        <RelliaCta
          icon={
            <div className="-translate-y-6 sm:-translate-y-8" aria-hidden>
              <NotFoundIcon className="h-32 w-32 text-rellia-teal sm:h-40 sm:w-40" strokeWidth={1.25} />
            </div>
          }
          title={cmsDisplayText(copy.title)}
          body={cmsDisplayText(copy.message)}
          bodyClassName="text-xl md:text-2xl lg:text-3xl"
          primary={ctaActionFromHref(copy.ctaLabel || "Back to home", "/")}
          className="mt-0 flex min-h-[calc(100svh-72px)] flex-1 flex-col items-center justify-center !pt-0 !pb-0 md:min-h-[calc(100svh-86px)] md:!pt-0 md:!pb-0 lg:!pt-0 lg:!pb-0"
          roundedClassName="rounded-none"
        />
      </main>
      <Footer />
    </div>
  )
}

export default NotFound
