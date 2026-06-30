import { useState } from "react"
import { Check } from "lucide-react"
import { ShareIconCopy, shareCompactControlSizeClass, shareIconSize } from "@/components/share/sharePageIcons"
import { IconTooltipWrap, type IconTooltipPosition } from "@/components/share/IconTooltipWrap"
import { cn } from "@/lib/utils"

export type ShareCopyLinkButtonProps = {
  onCopy: () => void | Promise<void>
  className?: string
  copiedClassName?: string
  iconClassName?: string
  sizeClassName?: string
  wrapperClassName?: string
  idleLabel?: string
  copiedLabel?: string
  showMobileLabel?: boolean
  tooltipPosition?: IconTooltipPosition
  tooltipMobilePosition?: IconTooltipPosition
}

export const ShareCopyLinkButton = ({
  onCopy,
  className,
  copiedClassName,
  iconClassName = shareIconSize,
  sizeClassName = shareCompactControlSizeClass,
  wrapperClassName,
  idleLabel = "Copy link",
  copiedLabel = "Copied!",
  showMobileLabel = false,
  tooltipPosition,
  tooltipMobilePosition,
}: ShareCopyLinkButtonProps) => {
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    try {
      await onCopy()
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const hasCustomShell = Boolean(className)

  return (
    <IconTooltipWrap
      label={copied ? copiedLabel : idleLabel}
      position={tooltipPosition}
      mobilePosition={tooltipMobilePosition}
      className={wrapperClassName}
    >
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "relative inline-flex cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300",
          sizeClassName,
          copied
            ? copiedClassName ?? "border-rellia-teal bg-rellia-mint/20 text-rellia-teal"
            : !hasCustomShell &&
                "border-black/10 bg-white text-black hover:border-rellia-teal hover:bg-rellia-teal hover:text-white",
          className,
        )}
        aria-label={copied ? copiedLabel : idleLabel}
      >
        {copied ? (
          <>
            <Check className={cn(iconClassName, "animate-scale-in")} aria-hidden />
            {showMobileLabel ? (
              <span className="font-host-grotesk text-sm font-semibold sm:sr-only">{copiedLabel}</span>
            ) : null}
          </>
        ) : (
          <>
            <ShareIconCopy className={iconClassName} aria-hidden />
            {showMobileLabel ? (
              <span className="font-host-grotesk text-sm font-semibold sm:sr-only">{idleLabel}</span>
            ) : null}
          </>
        )}
      </button>
    </IconTooltipWrap>
  )
}
