export type SocialLinkInput = {
  platform?: string
  label?: string
  url?: string
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
