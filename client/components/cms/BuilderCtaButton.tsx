import { useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import RelliaAction from "@/components/RelliaAction"
import { FilloutStandardEmbed } from "@fillout/react"
import {
  extractFilloutId,
  FILLOUT_APPLY_FORM_ID,
  FILLOUT_EMBED_VIEWPORT_MIN_CLASS,
  PROGRAM_FILLOUT_EMBED_MIN_CLASS,
} from "@/lib/filloutApplyForm"
import { cmsCleanText } from "@/lib/cmsStega"
import { cn } from "@/lib/utils"
import type { CmsBuilderCtaAction } from "@shared/cms/types"

const isExternalHref = (href: string) => /^(https?:\/\/|mailto:|tel:)/i.test(href)

const normalizeInternalHref = (href: string) => {
  const trimmed = href.trim()
  if (!trimmed) return "/"
  if (isExternalHref(trimmed)) return trimmed
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

type BuilderCtaButtonProps = {
  cta?: CmsBuilderCtaAction | null
  /** Legacy string fields */
  fallbackLabel?: string
  fallbackHref?: string
  variant?: "mintTealFill" | "mintOnTealStrip"
  size?: "compact" | "comfortable"
  className?: string
  onEmbedReveal?: () => void
}

export const BuilderCtaButton = ({
  cta,
  fallbackLabel,
  fallbackHref,
  variant = "mintTealFill",
  size = "comfortable",
  className,
  onEmbedReveal,
}: BuilderCtaButtonProps) => {
  const label = cmsCleanText(cta?.label) || cmsCleanText(fallbackLabel) || "Learn more"
  const actionType = cta?.actionType ?? "link"
  const href = normalizeInternalHref(cmsCleanText(cta?.href) || cmsCleanText(fallbackHref) || "/")
  const formId =
    extractFilloutId(cmsCleanText(cta?.filloutFormUrl)) || FILLOUT_APPLY_FORM_ID

  const [showEmbed, setShowEmbed] = useState(false)

  const handleEmbedClick = () => {
    setShowEmbed(true)
    onEmbedReveal?.()
  }

  const buttonContent = (
    <>
      {label}
      <ArrowRight className="h-5 w-5" aria-hidden />
    </>
  )

  let trigger: ReactNode = null

  if (actionType === "embed") {
    trigger = (
      <RelliaAction
        type="button"
        variant={variant}
        size={size}
        className={cn("inline-flex cursor-pointer items-center gap-2", className)}
        onClick={handleEmbedClick}
        aria-label={label}
      >
        {buttonContent}
      </RelliaAction>
    )
  } else if (isExternalHref(href)) {
    const isMailToOrTel = /^(mailto:|tel:)/i.test(href)
    trigger = (
      <RelliaAction asChild variant={variant} size={size} className={className}>
        <a
          href={href}
          {...(isMailToOrTel ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          className="inline-flex cursor-pointer items-center gap-2"
          aria-label={label}
        >
          {buttonContent}
        </a>
      </RelliaAction>
    )
  } else {
    trigger = (
      <RelliaAction asChild variant={variant} size={size} className={className}>
        <Link to={href} className="inline-flex cursor-pointer items-center gap-2" aria-label={label}>
          {buttonContent}
        </Link>
      </RelliaAction>
    )
  }

  return (
    <>
      {trigger}
      {actionType === "embed" ? (
        <AnimatePresence>
          {showEmbed ? (
            <motion.div
              key="builder-cta-embed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className={cn("mt-10 w-full", FILLOUT_EMBED_VIEWPORT_MIN_CLASS)}
            >
              <button
                type="button"
                onClick={() => setShowEmbed(false)}
                className="mb-6 font-host-grotesk text-sm font-semibold text-rellia-teal underline-offset-4 hover:underline"
              >
                ← Back
              </button>
              <div className={cn("w-full min-h-[640px] md:min-h-[900px]", PROGRAM_FILLOUT_EMBED_MIN_CLASS)}>
                <FilloutStandardEmbed filloutId={formId} dynamicResize />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : null}
    </>
  )
}
