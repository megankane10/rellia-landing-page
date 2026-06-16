import type { BodyCtaBoxProps } from "@/components/BodyCtaBox"
import { cmsCleanText, cmsDisplayText, cmsHasDisplayText } from "@/lib/cmsStega"

export type PortableBodyCtaBoxValue = {
  title?: string
  body?: string
  buttonLabel?: string
  buttonHref?: string
  secondaryButtonLabel?: string
  secondaryButtonHref?: string
  iconKey?: string
}

export const mapPortableBodyCtaBox = (
  value: PortableBodyCtaBoxValue | null | undefined,
): BodyCtaBoxProps | null => {
  if (!cmsHasDisplayText(value?.title)) return null

  const secondaryLabel = value?.secondaryButtonLabel ?? ""
  const secondaryHref = value?.secondaryButtonHref ?? ""

  return {
    title: cmsDisplayText(value!.title),
    body: cmsHasDisplayText(value?.body) ? cmsDisplayText(value?.body) : null,
    iconKey: cmsCleanText(value?.iconKey) || undefined,
    buttonLabel: cmsDisplayText(value?.buttonLabel) || "Learn more",
    buttonHref: cmsCleanText(value?.buttonHref) || "/",
    secondaryButtonLabel: cmsHasDisplayText(secondaryLabel)
      ? cmsDisplayText(secondaryLabel)
      : null,
    secondaryButtonHref: cmsHasDisplayText(secondaryHref) ? cmsCleanText(secondaryHref) : null,
  }
}
