import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { enableVisualEditing } from "@sanity/visual-editing"
import type { HistoryUpdate } from "@sanity/visual-editing"
import {
  getSanityStudioUrl,
  isSanityPresentationIframe,
} from "@/lib/sanityPresentation"

/**
 * Connects the marketing site to Sanity Presentation (click-to-edit overlays + comlink).
 * Only active inside Studio’s Presentation iframe — not from a stale draft-mode cookie on www.
 */
export const VisualEditingOverlay = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const routeNavigateRef = useRef<((update: HistoryUpdate) => void) | null>(null)
  const connectAttemptRef = useRef(0)
  const previewActive = isSanityPresentationIframe()

  useEffect(() => {
    if (!previewActive) return

    const studioUrl = getSanityStudioUrl()
    connectAttemptRef.current += 1

    const disable = enableVisualEditing({
      zIndex: 100_001,
      history: {
        subscribe: (onNavigate) => {
          routeNavigateRef.current = onNavigate
          return () => {
            routeNavigateRef.current = null
          }
        },
        update: (update) => {
          if (update.type === "push" || update.type === "replace") {
            navigate(update.url, { replace: update.type === "replace" })
            return
          }
          if (update.type === "pop") {
            navigate(-1)
          }
        },
      },
      refresh: () => {
        void queryClient.invalidateQueries({ queryKey: ["cms"] })
        return false
      },
    })

    if (import.meta.env.DEV) {
       
      console.info("[sanity] Visual editing enabled", { studioUrl, attempt: connectAttemptRef.current })
    }

    return () => {
      routeNavigateRef.current = null
      disable()
    }
  }, [navigate, previewActive, queryClient])

  useEffect(() => {
    if (!previewActive) return
    routeNavigateRef.current?.({
      type: "push",
      url: `${location.pathname}${location.search}${location.hash}`,
    })
  }, [location.pathname, location.search, location.hash, previewActive])

  return null
}
