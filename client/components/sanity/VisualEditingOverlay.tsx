import { useEffect } from "react"
import { enableVisualEditing } from "@sanity/visual-editing"

const isEmbeddedInPresentationIframe = (): boolean => {
  if (typeof window === "undefined") return false
  return window.self !== window.top
}

/**
 * Connects the marketing site to Sanity Presentation (click-to-edit overlays).
 * Draft mode sets `sanity-preview-perspective` as HttpOnly — JS cannot read it,
 * so we enable whenever the app runs inside the Presentation iframe.
 */
export const VisualEditingOverlay = () => {
  useEffect(() => {
    if (!isEmbeddedInPresentationIframe()) return

    const disable = enableVisualEditing({
      zIndex: 100_000,
    })

    return () => disable()
  }, [])

  return null
}
