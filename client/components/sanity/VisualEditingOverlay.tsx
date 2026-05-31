import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { enableVisualEditing } from "@sanity/visual-editing"
import type { HistoryUpdate } from "@sanity/visual-editing"
import {
  getSanityStudioUrl,
  isSanityPresentationIframe,
} from "@/lib/sanityPresentation"

const fetchDraftModeActive = async (): Promise<boolean> => {
  try {
    const res = await fetch("/api/draft-mode/status", { credentials: "same-origin" })
    if (!res.ok) return false
    const json = (await res.json()) as { active?: boolean }
    return json.active === true
  } catch {
    return false
  }
}

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
  const [previewActive, setPreviewActive] = useState(isSanityPresentationIframe())

  useEffect(() => {
    if (isSanityPresentationIframe()) {
      setPreviewActive(true)
      return
    }

    let cancelled = false
    void fetchDraftModeActive().then((active) => {
      if (!cancelled) setPreviewActive(active)
    })

    return () => {
      cancelled = true
    }
  }, [location.pathname])

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
      // eslint-disable-next-line no-console
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
