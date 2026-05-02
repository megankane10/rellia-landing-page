/**
 * Direct Pexels CDN URLs for use when `/api/pexels/search` is unavailable or before it resolves.
 * Prefer these over missing `/images/*` paths so img tags always load.
 */
export const PEXELS_OFFICE_COLLABORATION =
  "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1400" as const

export const PEXELS_HEALTH_MEETING =
  "https://images.pexels.com/photos/8376155/pexels-photo-8376155.jpeg?auto=compress&cs=tinysrgb&w=1400" as const

/** Existing bundled asset — safe local fallback */
export const LOCAL_METRICS_BG_JPEG = "/images/metrics-bg-pexels-2.jpg" as const
