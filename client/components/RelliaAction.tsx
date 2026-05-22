import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/** Lift + color transition (RelliaCta-style). No horizontal ::before sweep. */
const relliaCtaHoverMotion =
  "before:hidden motion-safe:hover:-translate-y-0.5 transition-[transform,box-shadow,background-color,color,border-color] duration-300"

export const relliaActionVariants = cva(
  cn(
    "group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden font-host-grotesk font-semibold whitespace-nowrap",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:translate-x-0.5",
    relliaCtaHoverMotion,
  ),
  {
    variants: {
      variant: {
        tealFilled:
          "rounded-full border-2 border-rellia-mint bg-rellia-mint text-rellia-teal hover:bg-rellia-teal hover:text-white hover:border-rellia-teal hover:shadow-[0_18px_50px_-30px_rgba(15,77,77,0.45)]",
        tealFilledLift:
          "rounded-full border-2 border-rellia-mint bg-rellia-mint text-rellia-teal hover:bg-rellia-teal hover:text-white hover:border-rellia-teal hover:shadow-[0_22px_60px_-34px_rgba(15,77,77,0.55)]",
        outlineOnWhite:
          "rounded-full border-2 border-rellia-teal bg-white text-rellia-teal hover:bg-rellia-teal hover:text-white hover:border-rellia-teal hover:shadow-[0_18px_50px_-32px_rgba(15,77,77,0.35)]",
        heroSolidOnTeal:
          "rounded-full border-2 border-rellia-mint bg-rellia-mint text-rellia-teal hover:bg-white hover:text-rellia-teal hover:border-white hover:shadow-[0_22px_60px_-34px_rgba(0,0,0,0.45)]",
        heroGhostOnTeal:
          "rounded-full border-2 border-rellia-mint bg-transparent text-white hover:bg-white hover:text-rellia-teal hover:border-white hover:shadow-[0_22px_60px_-34px_rgba(0,0,0,0.45)]",
        mintOnTealStrip:
          "rounded-full border-2 border-rellia-mint bg-rellia-mint text-rellia-teal hover:bg-white hover:text-rellia-teal hover:border-white hover:shadow-[0_22px_60px_-34px_rgba(0,0,0,0.45)]",
        tealCardFull:
          "w-full rounded-full border-2 border-rellia-mint bg-rellia-mint text-sm text-rellia-teal hover:bg-rellia-teal hover:text-white hover:border-rellia-teal",
        creamCardFull:
          "w-full rounded-full border-2 border-rellia-cream bg-rellia-cream text-sm text-rellia-teal hover:bg-rellia-teal hover:text-white hover:border-rellia-teal",
        mintCardFull:
          "w-full rounded-full border-2 border-rellia-mint bg-rellia-mint text-sm text-rellia-teal hover:bg-rellia-teal hover:text-white hover:border-rellia-teal",
        mintCardTealFill:
          "w-full rounded-full border-2 border-rellia-mint bg-rellia-mint text-sm text-rellia-teal hover:bg-rellia-teal hover:text-white hover:border-rellia-teal",
        mintTealFill:
          "rounded-full border-2 border-rellia-mint bg-rellia-mint text-rellia-teal hover:bg-rellia-teal hover:text-white hover:border-rellia-teal",
        brandSolid:
          "rounded-full border-2 border-rellia-mint bg-rellia-mint text-rellia-teal hover:bg-rellia-teal hover:text-white hover:border-rellia-teal hover:shadow-[0_22px_60px_-34px_rgba(15,77,77,0.55)]",
        brandOutline:
          "rounded-full border-2 border-rellia-teal bg-transparent text-white hover:bg-white hover:text-rellia-teal hover:border-white",
        calmPrimary:
          "rounded-2xl border border-blue-600/15 bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md focus-visible:ring-blue-600 focus-visible:ring-offset-slate-50",
        calmSecondary:
          "rounded-2xl border border-slate-900/10 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-blue-600 focus-visible:ring-offset-slate-50",
        creamCtaHeroFill:
          "rounded-full border-2 border-rellia-teal bg-rellia-teal text-white hover:bg-rellia-mint hover:text-rellia-teal hover:border-rellia-mint hover:shadow-[0_22px_60px_-34px_rgba(15,77,77,0.32)] focus-visible:ring-offset-rellia-cream",
        relliaCtaPrimary:
          "rounded-full border-2 border-rellia-teal bg-rellia-teal text-white hover:bg-rellia-mint hover:text-rellia-teal hover:border-rellia-mint hover:shadow-[0_22px_60px_-34px_rgba(15,77,77,0.32)] focus-visible:ring-offset-rellia-greyTeal",
        relliaCtaSecondary:
          "rounded-full border-2 border-white/80 bg-white text-rellia-teal hover:bg-rellia-mint hover:text-rellia-teal hover:border-rellia-mint hover:shadow-[0_22px_60px_-34px_rgba(15,77,77,0.22)] focus-visible:ring-offset-rellia-greyTeal",
      },
      size: {
        comfortable: "px-8 py-4 text-base",
        compact: "py-2.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "tealFilled",
      size: "comfortable",
    },
  },
)

export type RelliaActionProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof relliaActionVariants> & {
    asChild?: boolean
  }

const RelliaAction = React.forwardRef<HTMLButtonElement, RelliaActionProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(relliaActionVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
RelliaAction.displayName = "RelliaAction"

export default RelliaAction
