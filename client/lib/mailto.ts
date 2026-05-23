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
