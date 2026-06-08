import type { HomeWhyFeature } from "@shared/cms/types"

type NetworkWhyFeatureInput = {
  title: string
  body?: string
  iconKey?: string
  imageSrc?: string
}

export const mapNetworkWhyFeatures = (
  items: NetworkWhyFeatureInput[],
): HomeWhyFeature[] =>
  items.map((item) => ({
    title: item.title,
    description: item.body ?? "",
    iconKey: item.iconKey ?? "",
    imageSrc: item.imageSrc,
  }))
