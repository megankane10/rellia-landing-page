import type express from "express"

const safeOriginFromUrl = (input: string | undefined): string | null => {
  const value = (input ?? "").trim()
  if (!value) return null
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

/** Origins allowed for browser-initiated API calls (production + preview deploys). */
export const buildSiteOrigins = (): Set<string> => {
  const origins = new Set<string>()

  const add = (value: string | undefined) => {
    const origin = safeOriginFromUrl(value)
    if (origin) origins.add(origin)
  }

  add(process.env.VITE_SITE_URL)
  add(process.env.SITE_URL)

  const vercelUrl = process.env.VERCEL_URL?.trim()
  if (vercelUrl) {
    add(vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`)
  }

  for (const entry of (process.env.ALLOWED_ORIGINS || "").split(",")) {
    add(entry.trim())
  }

  // Known production hosts
  origins.add("https://www.relliahealth.com")
  origins.add("https://relliahealth.com")
  origins.add("https://relliahealth.vercel.app")

  return origins
}

export const isAllowedBrowserOrigin = (
  req: express.Request,
  baseOrigins: Set<string>,
  isDev: boolean,
): boolean => {
  if (isDev) return true

  const allowed = new Set(baseOrigins)
  const host = (req.get("host") || "").trim()
  const forwardedProto = (req.get("x-forwarded-proto") || req.protocol || "https").split(",")[0]?.trim()
  const proto = forwardedProto || "https"

  if (host) {
    allowed.add(`${proto}://${host}`)
    if (host.startsWith("www.")) {
      allowed.add(`${proto}://${host.slice(4)}`)
    }
  }

  const originHeader = (req.get("origin") || "").trim()
  if (originHeader && allowed.has(originHeader)) return true

  if (originHeader && (originHeader.endsWith(".sanity.studio") || originHeader.endsWith(".sanity.io"))) {
    return true
  }

  const refererHeader = (req.get("referer") || "").trim()
  const refererOrigin = safeOriginFromUrl(refererHeader)
  if (refererOrigin && allowed.has(refererOrigin)) return true

  if (refererOrigin && (refererOrigin.endsWith(".sanity.studio") || refererOrigin.endsWith(".sanity.io"))) {
    return true
  }

  // Same-origin navigation often omits Origin on GET; allow when Host matches a known deployment.
  if (!originHeader && host && allowed.has(`${proto}://${host}`)) return true

  return false
}
