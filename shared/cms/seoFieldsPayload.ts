/** Payload shape for sanity-plugin-seofields (`seoFields` type). */
export type SeoFieldsPayload = {
  title: string
  description?: string
  openGraph?: { title: string; description?: string }
  noIndex?: boolean
  robots?: { noIndex?: boolean; noFollow?: boolean }
}

export const buildSeoFieldsPayload = (input: {
  title: string
  description?: string
  noIndex?: boolean
}): SeoFieldsPayload => {
  const title = input.title.trim()
  const description = input.description?.trim()
  return {
    title,
    ...(description ? { description } : {}),
    openGraph: {
      title,
      ...(description ? { description } : {}),
    },
    ...(input.noIndex ? { noIndex: true, robots: { noIndex: true, noFollow: false } } : {}),
  }
}
