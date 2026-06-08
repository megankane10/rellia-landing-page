import { buildSeoFieldsPayload, type SeoFieldsPayload } from "./seoFieldsPayload"

export const buildDefaultStorySeoTitle = (storyTitle: string, tag?: string): string => {
  const title = storyTitle.trim()
  const category = tag?.trim()
  if (!title) return category || "Rellia Health"
  if (!category) return title
  return `${title} — ${category}`
}

export const buildStorySeoFieldsPayload = (input: {
  storyTitle: string
  tag?: string
  description?: string
}): SeoFieldsPayload =>
  buildSeoFieldsPayload({
    title: buildDefaultStorySeoTitle(input.storyTitle, input.tag),
    description: input.description,
  })
