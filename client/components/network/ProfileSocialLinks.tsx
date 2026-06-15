import {
  GlobeFilled,
  InstagramFilled,
  LinkedInFilled,
} from "@/components/icons/SocialIcons"
import { IconTooltipWrap } from "@/components/share/IconTooltipWrap"
import { cn } from "@/lib/utils"
import { emailToSocialLink, resolveSocialPlatform } from "@shared/cms/socialLinks"
import { Mail } from "lucide-react"

export type ProfileSocialLink = {
  platform?: string
  label?: string
  url?: string
}

type ProfileSocialLinksVariant = "light" | "onDark"

type ProfileSocialLinksProps = {
  links?: ProfileSocialLink[] | null
  email?: string | null
  className?: string
  iconClassName?: string
  /** `onDark` for overlays and tinted backgrounds (e.g. team bio cards). */
  variant?: ProfileSocialLinksVariant
  /** Hover tooltips on each icon. Off for compact founder rows where names are adjacent. */
  showTooltips?: boolean
  /** Slightly larger tap targets on small screens (profile sidebars, founder rows). */
  comfortableTouch?: boolean
}

type SocialKind = "linkedin" | "website" | "instagram" | "x" | "youtube" | "email" | "generic"

const normalizeUrl = (url: string | undefined, platform: string): string | undefined => {
  const trimmed = url?.trim()
  if (!trimmed) return undefined
  if (platform === "email" && !trimmed.startsWith("mailto:")) {
    return `mailto:${trimmed}`
  }
  return trimmed
}

const BUTTON_CLASS: Record<ProfileSocialLinksVariant, string> = {
  light:
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-all duration-300 hover:border-rellia-teal hover:bg-rellia-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
  onDark:
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
}

const COMFORTABLE_BUTTON_CLASS: Record<ProfileSocialLinksVariant, string> = {
  light:
    "inline-flex h-11 w-11 md:h-10 md:w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-all duration-300 hover:border-rellia-teal hover:bg-rellia-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
  onDark:
    "inline-flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
}

export const ProfileSocialLinks = ({
  links,
  email,
  className,
  iconClassName,
  variant = "light",
  showTooltips = true,
  comfortableTouch = false,
}: ProfileSocialLinksProps) => {
  const items: { key: string; href: string; label: string; kind: SocialKind }[] = []

  const push = (key: string, href: string | undefined, label: string, kind: SocialKind) => {
    if (!href) return
    items.push({ key, href, label, kind })
  }

  if (Array.isArray(links)) {
    for (const link of links) {
      const platform = resolveSocialPlatform(link.platform, link.url, link.label)
      const href = normalizeUrl(link.url, platform)
      if (!href) continue
      const label =
        link.label?.trim() ||
        (platform === "linkedin"
          ? "LinkedIn profile"
          : platform === "website"
            ? "Website"
            : platform === "instagram"
              ? "Instagram"
              : platform === "x"
                ? "X profile"
                : platform === "youtube"
                  ? "YouTube"
                  : platform === "email"
                    ? "Email"
                    : "External link")
      const kind: SocialKind =
        platform === "linkedin"
          ? "linkedin"
          : platform === "website"
            ? "website"
            : platform === "instagram"
              ? "instagram"
              : platform === "x"
                ? "x"
                : platform === "youtube"
                  ? "youtube"
                  : platform === "email"
                    ? "email"
                    : "generic"
      push(`${platform}-${href}`, href, label, kind)
    }
  }

  const emailLink = emailToSocialLink(email, "Email")
  if (emailLink && !items.some((item) => item.kind === "email")) {
    push("email-direct", normalizeUrl(emailLink.url, "email"), emailLink.label ?? "Email", "email")
  }

  if (items.length === 0) return null

  const buttonClass = comfortableTouch ? COMFORTABLE_BUTTON_CLASS[variant] : BUTTON_CLASS[variant]
  const resolvedIconClassName =
    iconClassName ?? (comfortableTouch ? "h-6 w-6 md:h-5 md:w-5" : "h-5 w-5")

  const renderLink = (item: { key: string; href: string; label: string; kind: SocialKind }) => (
    <a
      href={item.href}
      target={item.kind === "email" ? undefined : "_blank"}
      rel={item.kind === "email" ? undefined : "noopener noreferrer"}
      className={buttonClass}
      aria-label={item.label}
    >
      {item.kind === "linkedin" ? (
        <LinkedInFilled className={resolvedIconClassName} />
      ) : item.kind === "instagram" ? (
        <InstagramFilled className={resolvedIconClassName} />
      ) : item.kind === "website" ? (
        <GlobeFilled className={resolvedIconClassName} />
      ) : item.kind === "email" ? (
        <Mail className={resolvedIconClassName} />
      ) : (
        <GlobeFilled className={resolvedIconClassName} aria-hidden="true" />
      )}
    </a>
  )

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {items.map((item) =>
        showTooltips ? (
          <IconTooltipWrap key={item.key} label={item.label}>
            {renderLink(item)}
          </IconTooltipWrap>
        ) : (
          renderLink(item)
        ),
      )}
    </div>
  )
}
