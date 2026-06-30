/** Default admin inbox route; change to `/admin/inbox` when you rename the page. */
export const DEFAULT_ADMIN_INBOX_PATH = "/admin/inbox"

const trimTrailingSlash = (url: string) => url.replace(/\/$/, "")

export const resolveSiteOrigin = (): string => {
  const fromVite =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    typeof (import.meta.env as Record<string, any>).VITE_SITE_URL === "string"
      ? (import.meta.env as Record<string, any>).VITE_SITE_URL.trim()
      : ""

  const fromNode =
    typeof process !== "undefined"
      ? (process.env.VITE_SITE_URL?.trim() || process.env.SITE_URL?.trim() || "")
      : ""

  return trimTrailingSlash(fromVite || fromNode || "https://www.relliahealth.com")
}

/** Public marketing site URL for admin “Website” links — prod uses configured origin, not localhost. */
export const resolvePublicWebsiteUrl = (): string => {
  if (typeof window !== "undefined") {
    const { hostname, origin } = window.location
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return trimTrailingSlash(origin)
    }
  }
  return resolveSiteOrigin()
}

export const resolveAdminInboxPath = (): string => {
  const fromVite =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    typeof (import.meta.env as Record<string, any>).VITE_ADMIN_INBOX_PATH ===
      "string"
      ? (import.meta.env as Record<string, any>).VITE_ADMIN_INBOX_PATH.trim()
      : ""

  const fromNode =
    typeof process !== "undefined" ? process.env.ADMIN_INBOX_PATH?.trim() || "" : ""

  const path = fromVite || fromNode || DEFAULT_ADMIN_INBOX_PATH
  return path.startsWith("/") ? path : `/${path}`
}

export const adminInboxUrl = (tab: "contact" | "diagnostic" = "contact"): string => {
  const base = resolveSiteOrigin()
  const path = resolveAdminInboxPath()
  return `${base}${path}?tab=${tab}`
}

export const adminContentUrl = (): string => `${resolveSiteOrigin()}/admin/content`

export const resolveSanityStudioOrigin = (): string => {
  const fromVite =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    typeof (import.meta.env as Record<string, string>).VITE_SANITY_STUDIO_URL === "string"
      ? (import.meta.env as Record<string, string>).VITE_SANITY_STUDIO_URL.trim()
      : ""

  const fromNode =
    typeof process !== "undefined"
      ? (
          process.env.SANITY_STUDIO_URL?.trim() ||
          process.env.VITE_SANITY_STUDIO_URL?.trim() ||
          ""
        )
      : ""

  return trimTrailingSlash(fromVite || fromNode || "https://relliahealth.sanity.studio")
}

const encodeIntentParams = (params: Record<string, string>): string =>
  Object.entries(params)
    .filter(([, value]) => value.length > 0)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join(";")

/** Strip drafts. prefix for published intent links; keep it when opening draft documents. */
const resolveStudioDocumentId = (documentId: string, editDraft: boolean): string => {
  const trimmed = typeof documentId === "string" ? documentId.trim() : ""
  if (!trimmed) return ""
  if (editDraft) return trimmed.startsWith("drafts.") ? trimmed : `drafts.${trimmed}`
  return trimmed.replace(/^drafts\./, "")
}

export const studioDeskUrl = (
  documentType: string,
  documentId: string,
  options?: { editDraft?: boolean },
): string => {
  const studioBase = resolveSanityStudioOrigin()
  const editDraft = options?.editDraft ?? documentId.trim().startsWith("drafts.")
  const docId = resolveStudioDocumentId(documentId, editDraft)
  const docType = typeof documentType === "string" ? documentType.trim() : ""
  if (!docId || !docType) return studioBase

  // Studio 5.x router expects path-segment params (`/intent/edit/id=…;type=…`), not `?id=…&type=…`.
  const params = encodeIntentParams({ id: docId, type: docType })
  return `${studioBase}/intent/edit/${params}`
}
