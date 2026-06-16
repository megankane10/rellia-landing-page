import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { trackGtmPageView } from "@/lib/googleTagManager"

const GoogleTagManagerPageViews = () => {
  const { pathname } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    trackGtmPageView(pathname)
  }, [pathname])

  return null
}

export default GoogleTagManagerPageViews
