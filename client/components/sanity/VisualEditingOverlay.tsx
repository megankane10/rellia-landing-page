import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { enableVisualEditing } from "@sanity/visual-editing"
import type { HistoryUpdate } from "@sanity/visual-editing"
import {
  getSanityStudioUrl,
  isSanityPresentationPreview,
} from "@/lib/sanityPresentation"

/**
 * Connects the marketing site to Sanity Presentation (click-to-edit overlays + comlink).
 * Requires draft-mode cookie + stega-encoded CMS responses from `/api/sanity/query`.
 */
export const VisualEditingOverlay = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const routeNavigateRef = useRef<((update: HistoryUpdate) => void) | null>(null)
  const connectAttemptRef = useRef(0)

  useEffect(() => {
    if (!isSanityPresentationPreview()) return

    const studioUrl = getSanityStudioUrl()
    connectAttemptRef.current += 1

    const disable = enableVisualEditing({
      zIndex: 100_001,
      studioUrl,
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
      refresh: (payload) => {
        void queryClient.invalidateQueries({ queryKey: ["cms"] })
        if (payload.source === "mutation" && payload.livePreviewEnabled) {
          return false
        }
        return false
      },
    })

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info("[sanity] Visual editing enabled", { studioUrl, attempt: connectAttemptRef.current })
    }

    return () => {
      routeNavigateRef.current = null
      disable()
    }
  }, [navigate, queryClient])

  useEffect(() => {
    if (!isSanityPresentationPreview()) return
    routeNavigateRef.current?.({
      type: "push",
      url: `${location.pathname}${location.search}${location.hash}`,
    })
  }, [location.pathname, location.search, location.hash])

  return null
}
