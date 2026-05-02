import { useEffect, useState } from "react"

type UsePexelsPhotoOptions = {
  query: string
  fallbackUrl: string
  orientation?: "landscape" | "portrait" | "square"
}

/**
 * Fetches one hero-sized photo URL via server `/api/pexels/search` (PEXELS_API_KEY on server).
 * Falls back when API is unavailable or returns an error.
 */
export const usePexelsPhoto = ({ query, fallbackUrl, orientation = "landscape" }: UsePexelsPhotoOptions) => {
  const [src, setSrc] = useState(fallbackUrl)

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams({ query, per_page: "1", orientation })
    fetch(`/api/pexels/search?${params.toString()}`)
      .then((res) => {
        if (!res.ok) return null
        return res.json() as Promise<{ url?: string }>
      })
      .then((data) => {
        if (cancelled || !data?.url) return
        setSrc(data.url)
      })
      .catch(() => {
        /* keep fallback */
      })
    return () => {
      cancelled = true
    }
  }, [query, orientation])

  return src
}
