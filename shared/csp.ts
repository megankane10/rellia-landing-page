/**
 * Marketing site CSP — intentionally minimal.
 *
 * We only restrict who may embed the site in iframes (Sanity Presentation).
 * Do NOT add script-src here: Helmet's default script-src 'self' blocks eval(),
 * inline GTM bootstrap, and several third-party embeds.
 *
 * Vercel static HTML uses the same value in vercel.json headers.
 */
export const MARKETING_FRAME_ANCESTORS_CSP =
  "frame-ancestors 'self' https://*.sanity.studio https://*.sanity.io"
