import { useState } from "react"
import { Check, Share2 } from "lucide-react"
import { IconTooltipWrap, type IconTooltipPosition } from "@/components/share/IconTooltipWrap"
import {
  shareCompactControlSizeClass,
  shareIconSize,
  shareOutlineButtonClassName,
  shareOutlineButtonClassNameOnDark,
} from "@/components/share/sharePageIcons"
import { cn } from "@/lib/utils"

export type SharePageButtonProps = {
  url: string
  title?: string
  text?: string
  variant?: "light" | "dark"
  className?: string
  sizeClassName?: string
  idleLabel?: string
  copiedLabel?: string
  tooltipPosition?: IconTooltipPosition
  tooltipMobilePosition?: IconTooltipPosition
}

export const SharePageButton = ({
  url,
  title,
  text,
  variant = "light",
  className,
  sizeClassName = shareCompactControlSizeClass,
  idleLabel = "Share",
  copiedLabel = "Link copied",
  tooltipPosition,
  tooltipMobilePosition,
}: SharePageButtonProps) => {
  const [copied, setCopied] = useState(false)

  const resolveShareUrl = (rawUrl: string): string => {
    const trimmed = rawUrl.trim()
    if (!trimmed) return ""
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    if (typeof window !== "undefined") {
      const origin = window.location.origin?.replace(/\/$/, "") ?? ""
      if (origin) return `${origin}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`
    }
    return trimmed
  }

  const copyLinkToClipboard = async (shareUrl: string) => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    const shareUrl = resolveShareUrl(url)
    if (!shareUrl) return

    const sharePayload: ShareData = { url: shareUrl }
    const trimmedTitle = title?.trim() || document.title.trim()
    if (trimmedTitle) sharePayload.title = trimmedTitle
    const trimmedText = text?.trim()
    if (trimmedText) sharePayload.text = trimmedText

    const prefersNativeShare =
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches

    if (prefersNativeShare) {
      try {
        if (typeof navigator.canShare === "function" && !navigator.canShare(sharePayload)) {
          throw new Error("Cannot share payload")
        }
        await navigator.share(sharePayload)
        return
      } catch (error) {
        if ((error as Error)?.name === "AbortError") return
      }
    }

    try {
      await copyLinkToClipboard(shareUrl)
    } catch {
      setCopied(false)
    }
  }

  const shellClass =
    variant === "dark" ? shareOutlineButtonClassNameOnDark : shareOutlineButtonClassName

  return (
    <IconTooltipWrap
      label={copied ? copiedLabel : idleLabel}
      position={tooltipPosition}
      mobilePosition={tooltipMobilePosition}
    >
      <button
        type="button"
        onClick={handleShare}
        className={cn(
          shellClass,
          sizeClassName,
          copied && variant === "dark" && "border-white bg-white text-rellia-teal",
          copied && variant === "light" && "border-rellia-teal bg-rellia-mint/20 text-rellia-teal",
          className,
        )}
        aria-label={copied ? copiedLabel : idleLabel}
      >
        {copied ? (
          <Check className={cn(shareIconSize, "animate-scale-in")} aria-hidden />
        ) : (
          <Share2 className={shareIconSize} aria-hidden />
        )}
      </button>
    </IconTooltipWrap>
  )
}
