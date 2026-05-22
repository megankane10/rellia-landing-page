/** True when the marketing site runs inside Sanity Presentation’s preview iframe. */
export const isSanityPresentationIframe = (): boolean => {
  if (typeof window === "undefined") return false
  return window.self !== window.top
}
