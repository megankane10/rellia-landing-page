import type { LogoMark } from "@/components/LogoMarquee"
import { cmsCleanText } from "@/lib/cmsStega"
import type { LogoMarqueeEntry } from "@shared/cms/types"

type ResolveLogoMarqueeOptions = {
  /** Drop entries whose cleaned name matches any of these (case-insensitive). */
  excludeNames?: readonly string[]
}

export const resolveLogoMarqueeMarks = (
  entries: LogoMarqueeEntry[] | undefined,
  fallback: readonly LogoMark[],
  options?: ResolveLogoMarqueeOptions,
): LogoMark[] => {
  const exclude = new Set(
    (options?.excludeNames ?? []).map((name) => cmsCleanText(name).toLowerCase()).filter(Boolean),
  )

  const fromCms = (entries ?? [])
    .map((entry) => ({
      _key: entry._key,
      name: typeof entry.name === "string" ? entry.name : "",
      src: typeof entry.src === "string" ? entry.src : "",
      href: typeof entry.href === "string" ? entry.href : undefined,
    }))
    .filter((entry) => {
      const cleanName = cmsCleanText(entry.name)
      const cleanSrc = cmsCleanText(entry.src)
      if (!cleanName || !cleanSrc) return false
      if (exclude.has(cleanName.toLowerCase())) return false
      return true
    })

  if (fromCms.length > 0) return fromCms
  return [...fallback]
}
