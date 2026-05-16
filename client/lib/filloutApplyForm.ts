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
  ].join(" ")
