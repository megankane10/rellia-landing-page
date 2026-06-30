import type { ItemDetailSeo } from "./itemDetailSeo"

const escapeMetaAttr = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")

export type ResolvedSocialMetaTags = {
  title: string
  description: string
  canonical: string
  ogImage?: string
  ogImageWidth?: number
  ogImageHeight?: number
  ogType?: "website" | "article"
  themeColor?: string
}

export const buildSocialMetaTagsHtml = (meta: ResolvedSocialMetaTags): string => {
  const lines: string[] = [
    `<title>${escapeMetaAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeMetaAttr(meta.description)}" />`,
    `<link rel="canonical" href="${escapeMetaAttr(meta.canonical)}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<meta property="og:type" content="${meta.ogType ?? "website"}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:site_name" content="Rellia Health" />`,
    `<meta property="og:url" content="${escapeMetaAttr(meta.canonical)}" />`,
    `<meta property="og:title" content="${escapeMetaAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeMetaAttr(meta.description)}" />`,
    `<meta name="twitter:title" content="${escapeMetaAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeMetaAttr(meta.description)}" />`,
  ]

  if (meta.themeColor) {
    lines.push(`<meta name="theme-color" content="${escapeMetaAttr(meta.themeColor)}" />`)
  }

  if (meta.ogImage?.trim()) {
    lines.push(`<meta property="og:image" content="${escapeMetaAttr(meta.ogImage)}" />`)
    if (typeof meta.ogImageWidth === "number" && typeof meta.ogImageHeight === "number") {
      lines.push(`<meta property="og:image:width" content="${String(meta.ogImageWidth)}" />`)
      lines.push(`<meta property="og:image:height" content="${String(meta.ogImageHeight)}" />`)
    }
    lines.push(`<meta name="twitter:card" content="summary_large_image" />`)
    lines.push(`<meta name="twitter:image" content="${escapeMetaAttr(meta.ogImage)}" />`)
  } else {
    lines.push(`<meta name="twitter:card" content="summary" />`)
  }

  return lines.join("\n")
}

export const injectSocialMetaIntoHtml = (
  html: string,
  meta: ResolvedSocialMetaTags,
): string => {
  const tags = buildSocialMetaTagsHtml(meta)
  const headClose = html.indexOf("</head>")
  if (headClose === -1) return html

  let cleaned = html
    .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\s+name="description"[^>]*>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/<meta\s+name="robots"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:[^"]+"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:[^"]+"[^>]*>/gi, "")
    .replace(/<meta\s+name="theme-color"[^>]*>/gi, "")

  const cleanedHeadClose = cleaned.indexOf("</head>")
  if (cleanedHeadClose === -1) return html

  return `${cleaned.slice(0, cleanedHeadClose)}${tags}\n${cleaned.slice(cleanedHeadClose)}`
}

export const itemDetailSeoToSocialMeta = (
  seo: ItemDetailSeo,
  canonical: string,
  ogImage?: { url: string; width?: number; height?: number },
): ResolvedSocialMetaTags => ({
  title: seo.title,
  description: seo.description,
  canonical,
  ogImage: ogImage?.url,
  ogImageWidth: ogImage?.width,
  ogImageHeight: ogImage?.height,
  ogType: seo.ogType,
  themeColor: "#0D3540",
})
