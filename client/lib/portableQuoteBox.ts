import { cmsCleanText, cmsHasDisplayText } from "@/lib/cmsStega"

export type PortableQuoteBoxValue = {
  quote?: string
  attribution?: string
  imageAlt?: string
  imageSrc?: string
  image?: { asset?: { url?: string } }
}

export const resolvePortableQuoteBoxImage = (
  value: PortableQuoteBoxValue | null | undefined,
): { imageSrc: string; imageAlt: string } | null => {
  const uploadedSrc =
    typeof value?.image?.asset?.url === "string" ? value.image.asset.url.trim() : ""
  const fallbackSrc = cmsCleanText(value?.imageSrc)
  const imageSrc = uploadedSrc || fallbackSrc
  if (!imageSrc) return null

  const imageAlt = cmsHasDisplayText(value?.imageAlt) ? cmsCleanText(value?.imageAlt) : ""
  return { imageSrc, imageAlt }
}
