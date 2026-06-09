import type express from "express"
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants"
import { isVercelPreviewDeployment } from "../shared/cms/sanityEnv"

export const SANITY_STUDIO_FALLBACK_URL = "https://relliahealth.sanity.studio"

export const resolveSanityStudioUrl = (): string =>
  process.env.SANITY_STUDIO_URL?.trim() || SANITY_STUDIO_FALLBACK_URL

export const isSanityStudioReferer = (req: express.Request): boolean => {
  const referer = (req.get("referer") || "").toLowerCase()
  return referer.includes(".sanity.studio") || referer.includes(".sanity.io")
}

export const hasSanityPreviewPerspectiveCookie = (cookieHeader: string): boolean =>
  cookieHeader.includes(`${perspectiveCookieName}=`)

/** Set by the marketing site when running inside Presentation’s preview iframe. */
export const SANITY_PRESENTATION_HEADER = "x-sanity-presentation"

export const isPresentationPreviewRequest = (
  req: express.Request,
  cookieHeader: string,
  siteOriginsAllowed: boolean,
): boolean => {
  if (hasSanityPreviewPerspectiveCookie(cookieHeader)) return true
  if (!siteOriginsAllowed) return false
  return (req.get(SANITY_PRESENTATION_HEADER) || "").trim() === "1"
}

/** Drafts perspective: Vercel preview deploy, or Presentation iframe on www (not stale cookies). */
export const shouldUseSanityDraftsPerspective = (
  req: express.Request,
  isPreviewSession: boolean,
): boolean => {
  if (isVercelPreviewDeployment()) return true

  const hasPresentationHeader =
    (req.get(SANITY_PRESENTATION_HEADER) || "").trim() === "1"

  // Production www: drafts only inside Studio Presentation (header). A leftover
  // draft-mode cookie must not show unpublished content on the public site.
  if (process.env.VERCEL_ENV === "production") {
    return hasPresentationHeader
  }

  return isPreviewSession
}
