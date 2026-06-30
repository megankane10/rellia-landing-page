import { LinkedInFilled, MailFilled } from "@/components/icons/SocialIcons"
import { cn } from "@/lib/utils"

export const shareIconSize = "h-[1.125rem] w-[1.125rem] shrink-0 sm:h-5 sm:w-5"

/** Compact share / social icon control — default for marketing detail pages. */
export const shareCompactControlSizeClass = "h-9 w-9 shrink-0 sm:h-10 sm:w-10"

/** @deprecated Use shareCompactControlSizeClass */
export const shareControlSizeClass = shareCompactControlSizeClass

/**
 * @deprecated Prefer shareCompactControlSizeClass — kept for ShareCopyLinkButton default prop compatibility.
 */
export const shareComfortableControlSizeClass = shareCompactControlSizeClass

/** Header action row height (apply + share) on cream heroes. */
export const shareHeaderActionHeightClass = "h-11"

const shareOutlineButtonBaseClass =
  "inline-flex items-center justify-center rounded-full border transition-all duration-300 focus-visible:outline-none"

/** Outline share control on light backgrounds — black icon, inverts on hover. */
export const shareOutlineButtonClassName = cn(
  shareOutlineButtonBaseClass,
  shareComfortableControlSizeClass,
  "border-black/10 bg-white text-black hover:border-rellia-teal hover:bg-rellia-teal hover:text-white focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
)

/** Outline share control on teal/dark hero backgrounds — inverts on hover. */
export const shareOutlineButtonClassNameOnDark = cn(
  shareOutlineButtonBaseClass,
  shareComfortableControlSizeClass,
  "border-white/25 bg-white/10 text-white hover:border-white hover:bg-white hover:text-rellia-teal focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal",
)

/** @deprecated Use shareOutlineButtonClassName */
export const shareToolbarButtonClassName = shareOutlineButtonClassName

export const ShareIconX = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={cn(shareIconSize, className)} fill="currentColor">
    <path d="M18.9 2H22l-6.77 7.73L23.2 22h-6.26l-4.9-7.4L5.57 22H2.46l7.24-8.28L1.8 2h6.42l4.43 6.8L18.9 2Z" />
  </svg>
)

export const ShareIconLinkedIn = ({ className }: { className?: string }) => (
  <LinkedInFilled className={cn(shareIconSize, className)} aria-hidden />
)

export const ShareIconFacebook = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={cn(shareIconSize, className)} fill="currentColor">
    <path d="M13.62 21v-8.2h2.76l.41-3.2h-3.17V7.56c0-.93.26-1.56 1.59-1.56H16.9V3.14c-.29-.04-1.29-.14-2.46-.14-2.43 0-4.09 1.48-4.09 4.21v2.39H7.6v3.2h2.75V21h3.27Z" />
  </svg>
)

export const ShareIconMail = ({ className }: { className?: string }) => (
  <MailFilled className={cn(shareIconSize, className)} aria-hidden />
)

export const ShareIconCopy = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={cn(shareIconSize, className)} fill="currentColor">
    <path d="M8.5 3A2.5 2.5 0 0 0 6 5.5v10A2.5 2.5 0 0 0 8.5 18h8a2.5 2.5 0 0 0 2.5-2.5v-10A2.5 2.5 0 0 0 16.5 3h-8Zm-3 4A2.5 2.5 0 0 0 3 9.5v9A2.5 2.5 0 0 0 5.5 21h8.75a2.5 2.5 0 0 0 2.45-2H8.5A3.5 3.5 0 0 1 5 15.5V7.3c.16-.2.33-.4.5-.3Z" />
  </svg>
)
