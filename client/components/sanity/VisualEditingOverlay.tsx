import { useMemo } from "react"
import { VisualEditing } from "@sanity/visual-editing/react"
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants"

const isEmbeddedInIframe = (): boolean => {
  if (typeof window === "undefined") return false
  return window.self !== window.top
}

const hasPreviewPerspectiveCookie = (): boolean => {
  if (typeof document === "undefined") return false
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${perspectiveCookieName}=`))
}

export const VisualEditingOverlay = () => {
  const shouldEnable = useMemo(() => {
    if (!isEmbeddedInIframe()) return false
    return hasPreviewPerspectiveCookie()
  }, [])

  if (!shouldEnable) return null

  return <VisualEditing portal />
}

