import { cn } from "@/lib/utils"

export type MarketingImageProps = {
  src: string
  alt: string
  className?: string
  /** Above-the-fold heroes and logos */
  loading?: "eager" | "lazy"
  width?: number
  height?: number
  decorative?: boolean
}

/**
 * Marketing-site img with CLS-friendly dimensions and loading policy.
 */
export const MarketingImage = ({
  src,
  alt,
  className,
  loading = "lazy",
  width,
  height,
  decorative = false,
}: MarketingImageProps) => (
  <img
    src={src}
    alt={decorative ? "" : alt}
    loading={loading}
    width={width}
    height={height}
    decoding="async"
    aria-hidden={decorative ? true : undefined}
    className={cn(className)}
  />
)
