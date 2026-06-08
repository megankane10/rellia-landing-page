import {
  GlobeFilled,
  LinkedInFilled,
} from "@/components/icons/SocialIcons"
import { cn } from "@/lib/utils"
import { Mail } from "lucide-react"

export type ProfileSocialLink = {
  platform?: string
  label?: string
  url?: string
}

type ProfileSocialLinksProps = {
  links?: ProfileSocialLink[] | null
  linkedInUrl?: string | null
  websiteUrl?: string | null
  email?: string | null
  className?: string
  iconClassName?: string
}

type SocialKind = "linkedin" | "website" | "email" | "generic"

const normalizeUrl = (url: string | undefined, platform: string): string | undefined => {
  const trimmed = url?.trim()
  if (!trimmed) return undefined
  if (platform === "email" && !trimmed.startsWith("mailto:")) {
    return `mailto:${trimmed}`
  }
  return trimmed
}

export const ProfileSocialLinks = ({
  links,
  linkedInUrl,
  websiteUrl,
  email,
  className,
  iconClassName = "h-5 w-5",
}: ProfileSocialLinksProps) => {
  const items: { key: string; href: string; label: string; kind: SocialKind }[] = []

  const push = (key: string, href: string | undefined, label: string, kind: SocialKind) => {
    if (!href) return
    items.push({ key, href, label, kind })
  }

  if (Array.isArray(links)) {
    for (const link of links) {
      const platform = (link.platform ?? "other").toLowerCase()
      const href = normalizeUrl(link.url, platform)
      if (!href) continue
      const label =
        link.label?.trim() ||
        (platform === "linkedin"
          ? "LinkedIn profile"
          : platform === "website"
            ? "Website"
            : platform === "email"
              ? "Email"
              : "External link")
      const kind: SocialKind =
        platform === "linkedin"
          ? "linkedin"
          : platform === "website"
            ? "website"
            : platform === "email"
              ? "email"
              : "generic"
      push(`${platform}-${href}`, href, label, kind)
    }
  }

  if (!items.some((i) => i.kind === "linkedin")) {
    push("linkedin-direct", linkedInUrl?.trim(), "LinkedIn profile", "linkedin")
  }
  if (!items.some((i) => i.kind === "website")) {
    push("website-direct", websiteUrl?.trim(), "Website", "website")
  }
  if (!items.some((i) => i.kind === "email")) {
    push("email-direct", normalizeUrl(email ?? undefined, "email"), "Email", "email")
  }

  if (items.length === 0) return null

  const buttonClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black hover:bg-black/5 transition-colors"

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          target={item.kind === "email" ? undefined : "_blank"}
          rel={item.kind === "email" ? undefined : "noopener noreferrer"}
          className={buttonClass}
          aria-label={item.label}
        >
          {item.kind === "linkedin" ? (
            <LinkedInFilled className={iconClassName} />
          ) : item.kind === "website" ? (
            <GlobeFilled className={iconClassName} />
          ) : item.kind === "email" ? (
            <Mail className={iconClassName} />
          ) : (
            <GlobeFilled className={iconClassName} />
          )}
        </a>
      ))}
    </div>
  )
}
