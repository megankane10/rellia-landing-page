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

  const handleShare = async () => {
    const sharePayload = {
      title: title?.trim() || document.title,
      text: text?.trim() || title?.trim() || undefined,
      url,
    }

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(sharePayload)
        return
      } catch (error) {
        if ((error as Error)?.name === "AbortError") return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
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
