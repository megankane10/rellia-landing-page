import type { ElementType, ReactNode } from "react"
import { cn } from "@/lib/utils"

export const richTextTealPanelShellClassName =
  "relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0d3540] via-[#104856] to-[#196b7f] border border-white/10"

/** Primary quote / CTA title inside teal rich-text panels. */
export const richTextTealPanelQuoteClassName =
  "m-0 border-0 p-0 font-urbanist text-xl font-normal leading-snug text-white md:text-2xl"

/** Optional supporting copy under the title. */
export const richTextTealPanelDescriptionClassName =
  "mt-3 m-0 font-urbanist text-base font-normal leading-relaxed text-white/60 md:text-lg"

/** Inner image radius — slightly inset from the panel's rounded-[1.75rem] shell. */
export const richTextTealPanelImageClassName =
  "h-full w-full rounded-xl object-cover lg:rounded-2xl"

/** Shared inner padding for teal rich-text panels (quote + CTA). */
export const richTextTealPanelPaddingClassName = "px-6 py-8 md:px-8 md:py-10"

export const RichTextTealPanelDecorations = ({
  variant = "default",
}: {
  variant?: "default" | "withSideImage"
}) => (
  <>
    <div
      className={cn(
        "pointer-events-none absolute inset-y-0 right-0 bg-gradient-to-l from-rellia-teal via-rellia-teal/90 to-transparent",
        variant === "withSideImage" ? "w-[22%]" : "w-[45%]",
      )}
      aria-hidden
    />
    <div
      className={cn(
        "pointer-events-none absolute rounded-full bg-rellia-mint/20 blur-[72px]",
        variant === "withSideImage"
          ? "right-0 top-[-10%] h-32 w-32"
          : "-right-6 top-[-15%] h-44 w-44",
      )}
      aria-hidden
    />
  </>
)

type RichTextTealPanelProps = {
  children: ReactNode
  className?: string
  as?: ElementType
  decoration?: "default" | "withSideImage"
}

export const RichTextTealPanel = ({
  children,
  className,
  as: Tag = "div",
  decoration = "default",
}: RichTextTealPanelProps) => (
  <Tag className={cn(richTextTealPanelShellClassName, "not-prose", className)}>
    <RichTextTealPanelDecorations variant={decoration} />
    {children}
  </Tag>
)
