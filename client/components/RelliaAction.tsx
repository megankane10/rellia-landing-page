import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const relliaActionVariants = cva(
  "group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden font-host-grotesk font-semibold whitespace-nowrap transition-[transform,box-shadow,background-color,color,border-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:translate-x-0.5 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out hover:before:scale-x-100",
  {
    variants: {
      variant: {
        tealFilled:
          "rounded-full border-2 border-rellia-mint bg-rellia-mint text-rellia-teal hover:bg-transparent hover:text-white hover:border-rellia-teal hover:shadow-[0_18px_50px_-30px_rgba(15,77,77,0.45)] before:bg-rellia-teal",
        tealFilledLift:
          "rounded-full border-2 border-rellia-mint bg-rellia-mint text-rellia-teal hover:-translate-y-0.5 hover:bg-transparent hover:text-white hover:border-rellia-teal hover:shadow-[0_22px_60px_-34px_rgba(15,77,77,0.55)] before:bg-rellia-teal",
        outlineOnWhite:
          "rounded-full border-2 border-rellia-teal bg-white text-rellia-teal hover:bg-transparent hover:text-white hover:border-rellia-teal hover:shadow-[0_18px_50px_-32px_rgba(15,77,77,0.35)] before:bg-rellia-teal",
        heroSolidOnTeal:
          "rounded-full border-2 border-rellia-mint bg-rellia-mint text-rellia-teal hover:-translate-y-0.5 hover:bg-transparent hover:text-rellia-teal hover:border-white before:bg-white",
        heroGhostOnTeal:
          "rounded-full border-2 border-rellia-mint bg-transparent text-white hover:-translate-y-0.5 hover:text-rellia-teal hover:border-white before:bg-white",
        mintOnTealStrip:
          "rounded-full bg-rellia-mint text-rellia-teal border-2 border-rellia-mint hover:bg-transparent hover:text-white hover:border-rellia-teal hover:shadow-[0_18px_50px_-32px_rgba(0,0,0,0.35)] before:bg-rellia-teal",
        tealCardFull:
          "w-full rounded-full border-2 border-rellia-mint bg-rellia-mint text-sm text-rellia-teal hover:bg-transparent hover:text-white hover:border-rellia-teal before:bg-rellia-teal",
        creamCardFull:
          "w-full rounded-full border-2 border-rellia-cream bg-rellia-cream text-sm text-rellia-teal hover:bg-transparent hover:text-white hover:border-rellia-teal before:bg-rellia-teal",
        mintCardFull:
          "w-full rounded-full border-2 border-rellia-mint bg-rellia-mint text-sm text-rellia-teal hover:bg-transparent hover:text-white hover:border-rellia-teal before:bg-rellia-teal",
        mintCardTealFill:
          "w-full rounded-full border-2 border-rellia-mint bg-rellia-mint text-sm text-rellia-teal hover:bg-transparent hover:text-white hover:border-rellia-teal before:bg-rellia-teal",
        mintTealFill:
          "rounded-full border-2 border-rellia-mint bg-rellia-mint text-rellia-teal hover:bg-transparent hover:text-white hover:border-rellia-teal before:bg-rellia-teal",
        brandSolid:
          "rounded-full border-2 border-rellia-mint bg-rellia-mint text-rellia-teal hover:bg-transparent hover:text-white hover:border-rellia-teal hover:shadow-[0_22px_60px_-34px_rgba(15,77,77,0.55)] before:bg-rellia-teal",
        brandOutline:
          "rounded-full border-2 border-rellia-teal bg-transparent text-white hover:text-rellia-teal hover:border-white before:bg-white",
        calmPrimary:
          "rounded-2xl border border-blue-600/15 bg-blue-600 text-white shadow-sm hover:shadow-md hover:scale-[1.02] before:bg-blue-700 focus-visible:ring-blue-600 focus-visible:ring-offset-slate-50",
        calmSecondary:
          "rounded-2xl border border-slate-900/10 bg-white text-slate-900 hover:bg-slate-50 hover:scale-[1.02] before:bg-slate-50 focus-visible:ring-blue-600 focus-visible:ring-offset-slate-50",
        /** Teal on cream CTA; hero-style horizontal fill on hover (mint sweep, readable on teal). */
        creamCtaHeroFill:
          "rounded-full border-2 border-rellia-teal bg-rellia-teal text-white hover:-translate-y-0.5 hover:bg-rellia-mint hover:text-rellia-teal hover:border-rellia-mint hover:shadow-[0_22px_60px_-34px_rgba(15,77,77,0.32)] before:hidden focus-visible:ring-offset-rellia-cream",
        /** Grey-teal band CTA: teal pill; hover reveals white horizontal fill + teal label. */
        relliaCtaPrimary:
          "rounded-full border-2 border-rellia-teal bg-rellia-teal text-white hover:-translate-y-0.5 hover:bg-rellia-mint hover:text-rellia-teal hover:border-rellia-mint hover:shadow-[0_22px_60px_-34px_rgba(15,77,77,0.32)] before:hidden focus-visible:ring-offset-rellia-greyTeal",
        /** Grey-teal band CTA: white pill; hover fills mint (no outline hover). */
        relliaCtaSecondary:
          "rounded-full border-2 border-white/80 bg-white text-rellia-teal hover:-translate-y-0.5 hover:bg-rellia-mint hover:text-rellia-teal hover:border-rellia-mint hover:shadow-[0_22px_60px_-34px_rgba(15,77,77,0.22)] before:hidden focus-visible:ring-offset-rellia-greyTeal",
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
