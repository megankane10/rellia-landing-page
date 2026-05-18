/** Apply + Careers volunteer — id segment from https://forms.fillout.com/t/&lt;id&gt; */
export const FILLOUT_APPLY_FORM_ID = "r5hdDmQodfus"

/**
 * @fillout/react wraps the iframe in `.fillout-standard-embed` with an inline height that
 * starts small until `dynamicResize` fires. Min-height ensures the embed fills the viewport
 * under the fixed nav; larger resize heights still win via max(height, min-height).
 */
export const FILLOUT_EMBED_VIEWPORT_MIN_CLASS =
  [
    "[&_.fillout-standard-embed]:min-h-[calc(100svh-72px)] md:[&_.fillout-standard-embed]:min-h-[calc(100svh-86px)]",
    /** @fillout/react sets iframe style borderRadius:10; square corners for Apply + Careers */
    "[&_iframe]:!rounded-none",
    "[&_.fillout-standard-embed]:!w-full [&_.fillout-standard-embed]:!max-w-none [&_.fillout-standard-embed]:!overflow-hidden",
    "[&_iframe]:!w-full [&_iframe]:!max-w-none [&_iframe]:!overflow-hidden [&_iframe]:!scrollbar-none",
  ].join(" ")

/** Program enrollment / waitlist full-width embeds — tall default, grows with dynamicResize */
export const PROGRAM_FILLOUT_EMBED_MIN_CLASS =
  [
    "[&_.fillout-standard-embed]:min-h-[min(1400px,calc(100svh-96px))]",
    "md:[&_.fillout-standard-embed]:min-h-[min(1600px,calc(100svh-100px))]",
    "[&_.fillout-standard-embed]:h-auto",
    "[&_iframe]:!min-h-[min(1400px,calc(100svh-96px))]",
    "md:[&_iframe]:!min-h-[min(1600px,calc(100svh-100px))]",
    "[&_iframe]:!rounded-none",
    "[&_.fillout-standard-embed]:!w-full [&_.fillout-standard-embed]:!max-w-none [&_.fillout-standard-embed]:!overflow-hidden",
    "[&_iframe]:!w-full [&_iframe]:!max-w-none [&_iframe]:!overflow-hidden [&_iframe]:!scrollbar-none",
  ].join(" ")

export const isFilloutFormUrl = (url: string): boolean =>
  /fillout\.com\/t\/[^/?#]+/i.test(url.trim())

export const extractFilloutId = (url: string): string | null => {
  try {
    const match = url.trim().match(/fillout\.com\/t\/([^?#/]+)/i)
    return match?.[1] ?? null
  } catch {
    return null
  }
}
