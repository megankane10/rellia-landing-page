/** Build a mailto: href with RFC-friendly encoding (spaces as %20, not +). */
export const buildMailtoHref = (
  email: string,
  options?: { subject?: string; body?: string },
): string => {
  const trimmed = email.trim()
  if (!trimmed) return ""

  const parts: string[] = []
  if (options?.subject?.trim()) {
    parts.push(`subject=${encodeURIComponent(options.subject.trim())}`)
  }
  if (options?.body?.trim()) {
    parts.push(`body=${encodeURIComponent(options.body.trim())}`)
  }

  const query = parts.join("&")
  return query ? `mailto:${trimmed}?${query}` : `mailto:${trimmed}`
}

export type ParsedMailtoHref = {
  email: string
  subject?: string
  body?: string
}

export const parseMailtoHref = (href: string): ParsedMailtoHref | null => {
  const trimmed = href.trim()
  if (!trimmed.toLowerCase().startsWith("mailto:")) return null

  const withoutScheme = trimmed.slice(7)
  const queryIndex = withoutScheme.indexOf("?")
  const emailRaw = queryIndex === -1 ? withoutScheme : withoutScheme.slice(0, queryIndex)
  const email = decodeURIComponent(emailRaw.split(",")[0]?.trim() ?? "")
  if (!email) return null

  let subject: string | undefined
  let body: string | undefined

  if (queryIndex !== -1) {
    const params = new URLSearchParams(withoutScheme.slice(queryIndex + 1))
    subject = params.get("subject") ?? undefined
    body = params.get("body") ?? undefined
  }

  return { email, subject, body }
}

/** Rebuild mailto links with safe encoding — fixes decoded CMS URLs where & breaks the href. */
export const normalizeMailtoHref = (href: string, fallbackSubject?: string): string => {
  const parsed = parseMailtoHref(href)
  if (!parsed) return href.trim()

  return buildMailtoHref(parsed.email, {
    subject: parsed.subject ?? fallbackSubject,
    body: parsed.body,
  })
}
