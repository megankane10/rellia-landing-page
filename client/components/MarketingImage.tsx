import { useState, type ImgHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import {
  buildResponsiveImageProps,
  IMAGE_SIZE_PRESETS,
  isLocalImagePath,
  type ImageSizePreset,
  type ResponsiveImageProps,
} from "@shared/image/optimizeImageUrl"

export type MarketingImageProps = {
  src: string
  alt: string
  className?: string
  /** Above-the-fold heroes and logos */
  loading?: "eager" | "lazy"
  width?: number
  height?: number
  decorative?: boolean
  fetchPriority?: "high" | "low" | "auto"
  draggable?: boolean
  title?: string
  preset?: ImageSizePreset
  responsive?: ResponsiveImageProps
  onError?: ImgHTMLAttributes<HTMLImageElement>["onError"]
}

/**
 * Marketing-site img with responsive delivery (Sanity CDN transforms + local WebP variants).
 */
export const MarketingImage = ({
  src,
  alt,
  className,
  loading = "lazy",
  width,
  height,
  decorative = false,
  fetchPriority,
  draggable,
  title,
  preset,
  responsive,
  onError,
}: MarketingImageProps) => {
  const presetConfig = preset ? IMAGE_SIZE_PRESETS[preset] : undefined
  const resolved = responsive ?? (preset ? buildResponsiveImageProps(src, preset) : { src })
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null)
  const displaySrc = fallbackSrc ?? resolved.src
  const intrinsicWidth = width ?? presetConfig?.width
  const intrinsicHeight = height ?? presetConfig?.height

  const handleError: ImgHTMLAttributes<HTMLImageElement>["onError"] = (event) => {
    if (!fallbackSrc && isLocalImagePath(src) && displaySrc !== src) {
      setFallbackSrc(src)
      return
    }
    onError?.(event)
  }

  return (
    <img
      src={displaySrc}
      srcSet={fallbackSrc ? undefined : resolved.srcSet}
      sizes={fallbackSrc ? undefined : resolved.sizes}
      alt={decorative ? "" : alt}
      loading={loading}
      width={intrinsicWidth}
      height={intrinsicHeight}
      decoding="async"
      {...(fetchPriority ? { fetchpriority: fetchPriority } : {})}
      draggable={draggable}
      title={title}
      aria-hidden={decorative ? true : undefined}
      onError={handleError}
      className={cn(className)}
    />
  )
}
