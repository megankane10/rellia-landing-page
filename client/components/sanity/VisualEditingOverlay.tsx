import { useEffect, useState } from "react"
import { enableVisualEditing } from "@sanity/visual-editing"
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants"

const isEmbeddedInIframe = (): boolean => {
  if (typeof window === "undefined") return false
  return window.self !== window.top
}

const hasPreviewPerspectiveCookie = (): boolean => {
  if (typeof document === "undefined") return false
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${perspectiveCookieName}=`))
}

/**
 * Connects the marketing site to Sanity Presentation (click-to-edit overlays).
 * Must stay mounted after draft-mode redirect sets the perspective cookie.
 */
export const VisualEditingOverlay = () => {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!isEmbeddedInIframe()) return

    const sync = () => setActive(hasPreviewPerspectiveCookie())
    sync()

    const intervalId = window.setInterval(sync, 400)
    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (!active) return

    const disable = enableVisualEditing({
      zIndex: 100_000,
    })

    return () => disable()
  }, [active])

  return null
}
