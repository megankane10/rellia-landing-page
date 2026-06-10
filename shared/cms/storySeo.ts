import { buildSeoFieldsPayload, type SeoFieldsPayload } from "./seoFieldsPayload"
import { buildDefaultStorySeoTitle } from "./collectionSeo"

export { buildDefaultStorySeoTitle } from "./collectionSeo"

export const buildStorySeoFieldsPayload = (input: {
  storyTitle: string
  tag?: string
  description?: string
}): SeoFieldsPayload =>
  buildSeoFieldsPayload({
    title: buildDefaultStorySeoTitle(input.storyTitle, input.tag),
    description: input.description,
  })
