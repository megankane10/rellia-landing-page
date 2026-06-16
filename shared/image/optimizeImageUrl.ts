export type OptimizeImageOptions = {
  width?: number
  height?: number
  quality?: number
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min"
  dpr?: number
}

export type ImageSizePreset =
  | "avatar"
  | "logoMarquee"
  | "pathCard"
  | "storyHero"
  | "storyInline"
  | "bentoCard"
  | "teamCard"
  | "metricsBackground"
  | "decorativeLogo"
  | "contentCard"
  | "footerLogo"

type ImagePresetConfig = {
  widths: readonly number[]
  sizes: string
  width?: number
  height?: number
}

export const IMAGE_SIZE_PRESETS: Record<ImageSizePreset, ImagePresetConfig> = {
  avatar: {
    widths: [48, 96],
    sizes: "48px",
    width: 48,
    height: 48,
  },
  logoMarquee: {
    widths: [120, 240],
    sizes: "(max-width: 768px) 101px, 208px",
    width: 208,
    height: 149,
  },
  footerLogo: {
    widths: [96, 192],
    sizes: "40px",
    width: 40,
    height: 41,
  },
  pathCard: {
    widths: [400, 800],
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 364px",
  },
  storyHero: {
    widths: [640, 960, 1280, 1920],
    sizes: "100vw",
  },
  storyInline: {
    widths: [640, 960, 1280],
    sizes: "(max-width: 768px) 100vw, 768px",
  },
  bentoCard: {
    widths: [400, 800],
    sizes: "(max-width: 1024px) 100vw, 358px",
  },
  teamCard: {
    widths: [400, 800],
    sizes: "(max-width: 768px) 50vw, 358px",
  },
  metricsBackground: {
    widths: [960, 1440, 1920],
    sizes: "100vw",
  },
  decorativeLogo: {
    widths: [240, 480],
    sizes: "(max-width: 768px) 55vw, 460px",
    width: 460,
    height: 469,
  },
  contentCard: {
    widths: [400, 800],
    sizes: "(max-width: 768px) 100vw, 410px",
  },
}

const DEFAULT_QUALITY = 80

export const isSanityCdnUrl = (url: string): boolean => url.includes("cdn.sanity.io/images/")

export const isPexelsUrl = (url: string): boolean => url.includes("images.pexels.com/")

export const isUnsplashUrl = (url: string): boolean => url.includes("images.unsplash.com/")

export const isOptimizableRemoteUrl = (url: string): boolean =>
  isSanityCdnUrl(url) || isPexelsUrl(url) || isUnsplashUrl(url)

export const isLocalImagePath = (src: string): boolean =>
  src.startsWith("/images/") && !src.startsWith("/images/opt/")

const localImageBasename = (src: string): string => {
  const path = src.replace(/^\/images\//, "")
  return path.replace(/\.(avif|png|jpe?g|webp)$/i, "")
}

export const buildLocalOptimizedPath = (src: string, width: number): string =>
  `/images/opt/${localImageBasename(src)}-${width}.webp`

const applyQueryParams = (
  url: string,
  options: OptimizeImageOptions,
  extra?: Record<string, string>,
): string => {
  try {
    const parsed = new URL(url)
    for (const [key, value] of Object.entries(extra ?? {})) {
      parsed.searchParams.set(key, value)
    }
    if (options.width) parsed.searchParams.set("w", String(options.width))
    if (options.height) parsed.searchParams.set("h", String(options.height))
    if (options.fit) parsed.searchParams.set("fit", options.fit)
    parsed.searchParams.set("q", String(options.quality ?? DEFAULT_QUALITY))
    if (options.dpr) parsed.searchParams.set("dpr", String(options.dpr))
    return parsed.toString()
  } catch {
    return url
  }
}

const optimizeSanityUrl = (url: string, options: OptimizeImageOptions): string =>
  applyQueryParams(url, options, { auto: "format" })

const optimizePexelsUrl = (url: string, options: OptimizeImageOptions): string =>
  applyQueryParams(url, options, {
    auto: "compress",
    cs: "tinysrgb",
  })

const optimizeUnsplashUrl = (url: string, options: OptimizeImageOptions): string =>
  applyQueryParams(url, options, {
    auto: "format",
    fit: options.fit ?? "crop",
  })

export const optimizeImageUrl = (src: string, options: OptimizeImageOptions = {}): string => {
  const trimmed = src.trim()
  if (!trimmed) return trimmed

  if (isSanityCdnUrl(trimmed)) return optimizeSanityUrl(trimmed, options)
  if (isPexelsUrl(trimmed)) return optimizePexelsUrl(trimmed, options)
  if (isUnsplashUrl(trimmed)) return optimizeUnsplashUrl(trimmed, options)
  if (isLocalImagePath(trimmed) && options.width) {
    return buildLocalOptimizedPath(trimmed, options.width)
  }

  return trimmed
}

export const buildSrcSet = (src: string, widths: readonly number[]): string | undefined => {
  const trimmed = src.trim()
  if (!trimmed) return undefined

  const entries = widths
    .map((width) => {
      const url = optimizeImageUrl(trimmed, { width })
      if (url === trimmed) return null
      return `${url} ${width}w`
    })
    .filter((entry): entry is string => Boolean(entry))

  return entries.length > 0 ? entries.join(", ") : undefined
}

export type ResponsiveImageProps = {
  src: string
  srcSet?: string
  sizes?: string
}

export const buildResponsiveImageProps = (
  src: string,
  preset: ImageSizePreset,
  overrides?: Partial<ImagePresetConfig>,
): ResponsiveImageProps => {
  const trimmed = src.trim()
  if (!trimmed) return { src: trimmed }

  const config = {
    ...IMAGE_SIZE_PRESETS[preset],
    ...overrides,
  }
  const maxWidth = config.widths[config.widths.length - 1]
  const optimizedSrc = optimizeImageUrl(trimmed, { width: maxWidth })
  const srcSet = buildSrcSet(trimmed, config.widths)

  return {
    src: srcSet ? optimizedSrc : trimmed,
    srcSet,
    sizes: config.sizes,
  }
}
