import { describe, expect, it } from "vitest"
import {
  buildLocalOptimizedPath,
  buildResponsiveImageProps,
  buildSrcSet,
  optimizeImageUrl,
} from "./optimizeImageUrl"

describe("optimizeImageUrl", () => {
  it("adds auto format and width to Sanity CDN URLs", () => {
    const url =
      "https://cdn.sanity.io/images/ggbt0o98/production/bfee16230e4391d97d264a91f-928x928.png"
    const result = optimizeImageUrl(url, { width: 400 })
    expect(result).toContain("auto=format")
    expect(result).toContain("w=400")
    expect(result).toContain("q=80")
  })

  it("builds local optimized WebP paths", () => {
    expect(optimizeImageUrl("/images/portfolio-pop.png", { width: 240 })).toBe(
      "/images/opt/portfolio-pop-240.webp",
    )
  })

  it("builds responsive srcSet for Sanity images", () => {
    const url =
      "https://cdn.sanity.io/images/ggbt0o98/production/bfee16230e4391d97d264a91f-928x928.png"
    const srcSet = buildSrcSet(url, [400, 800])
    expect(srcSet).toContain("400w")
    expect(srcSet).toContain("800w")
    expect(srcSet).toContain("auto=format")
  })

  it("returns preset props for avatar images", () => {
    const props = buildResponsiveImageProps("/images/testimonials-nickS.jpeg", "avatar")
    expect(props.src).toBe("/images/opt/testimonials-nickS-96.webp")
    expect(props.srcSet).toContain("48w")
    expect(props.sizes).toBe("48px")
  })

  it("maps local basename without extension", () => {
    expect(buildLocalOptimizedPath("/images/paths-partner-pexels.jpg", 800)).toBe(
      "/images/opt/paths-partner-pexels-800.webp",
    )
  })
})
