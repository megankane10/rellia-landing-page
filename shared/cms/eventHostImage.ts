/** Default host portrait for Rellia-branded or company-hosted events without a custom host image. */
export const RELLIA_FAVICON_HOST_IMAGE = "/images/favicon-192.png"

/**
 * Events that should show the Rellia icon as the host portrait instead of
 * testimonial headshots or other inferred speaker avatars.
 */
export const EVENT_FAVICON_HOST_SLUGS = new Set([
  "leadership-under-pressure",
  "set-your-stage",
  "clinician-connect-primary-care",
  "investor-readiness-how-vcs-evaluate-startups",
])

export const eventUsesRelliaFaviconHost = (slug: string | undefined): boolean =>
  Boolean(slug?.trim() && EVENT_FAVICON_HOST_SLUGS.has(slug.trim()))
