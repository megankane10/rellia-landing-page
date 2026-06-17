export const GTM_CONTAINER_ID = "GTM-KHJG6V9B"

type DataLayerEvent = Record<string, unknown>

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[]
  }
}

const getDataLayer = (): DataLayerEvent[] => {
  if (typeof window === "undefined") return []
  window.dataLayer = window.dataLayer ?? []
  return window.dataLayer
}

/** Push a virtual page view for client-side route changes (GTM History Change / GA4 SPA). */
export const trackGtmPageView = (pathname: string) => {
  if (typeof window === "undefined" || !import.meta.env.PROD) return

  getDataLayer().push({
    event: "page_view",
    page_path: pathname,
    page_location: window.location.href,
    page_title: document.title,
  })
}
