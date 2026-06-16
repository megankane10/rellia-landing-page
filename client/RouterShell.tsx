import { useEffect, type ReactNode } from "react"
import { useLocation } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import ScrollToTop from "@/components/ScrollToTop"
import RouteSeo from "@/components/RouteSeo"
import { PageSeoProvider, type PageSeoOverrides } from "@/context/PageSeoContext"
import PageTransition from "@/components/PageTransition"
import PageRevealOverlay from "@/components/PageRevealOverlay"
import AdminAuthHashRedirect from "@/components/admin/AdminAuthHashRedirect"

const ensurePreconnect = (href: string) => {
  const existing = document.querySelector<HTMLLinkElement>(`link[rel="preconnect"][href="${href}"]`)
  if (existing) return
  const link = document.createElement("link")
  link.rel = "preconnect"
  link.href = href
  document.head.appendChild(link)
}

const ensureScript = (src: string) => {
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
  if (existing) return
  const script = document.createElement("script")
  script.src = src
  script.async = true
  document.body.appendChild(script)
}

const ThirdPartyPreloads = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const needsStripe =
      pathname === "/membership" ||
      pathname.startsWith("/startup-diagnostic") ||
      pathname.startsWith("/diagnostic-survey")

    const needsFillout =
      pathname === "/apply" ||
      pathname.startsWith("/careers") ||
      pathname.startsWith("/programs")

    if (needsStripe) {
      ensurePreconnect("https://js.stripe.com")
    }

    if (needsFillout) {
      ensurePreconnect("https://embed.fillout.com")
      ensurePreconnect("https://server.fillout.com")
      ensureScript("https://server.fillout.com/embed/v1/")
    }
  }, [pathname])

  return null
}

const VercelObservability = () => <>{import.meta.env.PROD ? <Analytics /> : null}</>

export const RouterShell = ({
  children,
  initialPageSeo,
}: {
  children: ReactNode
  initialPageSeo?: PageSeoOverrides
}) => (
  <PageSeoProvider initialOverrides={initialPageSeo}>
    <PageTransition />
    <PageRevealOverlay />
    <VercelObservability />
    <ThirdPartyPreloads />
    <AdminAuthHashRedirect />
    <ScrollToTop />
    {children}
    <RouteSeo />
  </PageSeoProvider>
)
