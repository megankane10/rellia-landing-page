export type SocialLinkInput = {
  platform?: string
  label?: string
  url?: string
}

export type ResolvedSocialPlatform =
  | "linkedin"
  | "website"
  | "instagram"
  | "x"
  | "youtube"
  | "email"
  | "other"

const normalizePlatformToken = (value: string | undefined): string =>
  (value ?? "").trim().toLowerCase()

/** Infer icon/platform from URL when CMS platform is missing or mismatched. */
export const resolveSocialPlatform = (
  platform: string | undefined,
  url: string | undefined,
  label?: string | undefined,
): ResolvedSocialPlatform => {
  const normalizedPlatform = normalizePlatformToken(platform)
  const normalizedUrl = (url ?? "").trim().toLowerCase()
  const normalizedLabel = normalizePlatformToken(label)

  const fromUrl = (): ResolvedSocialPlatform | null => {
    if (!normalizedUrl) return null
    if (normalizedUrl.includes("linkedin.com")) return "linkedin"
    if (normalizedUrl.includes("instagram.com")) return "instagram"
    if (normalizedUrl.includes("twitter.com") || normalizedUrl.includes("x.com")) return "x"
    if (normalizedUrl.includes("youtube.com") || normalizedUrl.includes("youtu.be")) {
      return "youtube"
    }
    if (normalizedUrl.startsWith("mailto:") || normalizedUrl.includes("@")) return "email"
    return null
  }

  const fromLabel = (): ResolvedSocialPlatform | null => {
    if (!normalizedLabel) return null
    if (normalizedLabel.includes("linkedin")) return "linkedin"
    if (normalizedLabel.includes("instagram")) return "instagram"
    if (normalizedLabel === "x" || normalizedLabel.includes("twitter")) return "x"
    if (normalizedLabel.includes("youtube")) return "youtube"
    if (normalizedLabel.includes("email")) return "email"
    if (normalizedLabel.includes("website")) return "website"
    return null
  }

  const inferred = fromUrl() ?? fromLabel()

  if (!normalizedPlatform || normalizedPlatform === "other") {
    return inferred ?? "other"
  }

  if (
    normalizedPlatform === "website" &&
    (inferred === "linkedin" ||
      inferred === "instagram" ||
      inferred === "x" ||
      inferred === "youtube")
  ) {
    return inferred
  }

  if (
    normalizedPlatform === "linkedin" ||
    normalizedPlatform === "website" ||
    normalizedPlatform === "instagram" ||
    normalizedPlatform === "x" ||
    normalizedPlatform === "youtube" ||
    normalizedPlatform === "email"
  ) {
    return normalizedPlatform
  }

  return inferred ?? "other"
}

export const buildSocialLinksFromLegacy = (input: {
  linkedinUrl?: string | null
  websiteUrl?: string | null
  socialLinks?: SocialLinkInput[] | null
}): SocialLinkInput[] => {
  if (Array.isArray(input.socialLinks) && input.socialLinks.length > 0) {
    return input.socialLinks.filter((link) => Boolean(link?.url?.trim()))
  }

  const links: SocialLinkInput[] = []

  const linkedin = input.linkedinUrl?.trim()
  if (linkedin) {
    links.push({ platform: "linkedin", label: "LinkedIn", url: linkedin })
  }

  const website = input.websiteUrl?.trim()
  if (website) {
    links.push({ platform: "website", label: "Website", url: website })
  }

  return links
}

export const emailToSocialLink = (
  email: string | null | undefined,
  label = "Email",
): SocialLinkInput | null => {
  const trimmed = email?.trim()
  if (!trimmed) return null
  return {
    platform: "email",
    label,
    url: trimmed.startsWith("mailto:") ? trimmed : `mailto:${trimmed}`,
  }
}
