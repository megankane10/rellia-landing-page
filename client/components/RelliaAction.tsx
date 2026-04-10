import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const relliaActionVariants = cva(
  "inline-flex items-center justify-center gap-2 font-host-grotesk font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:h-4 [&_svg]:w-4",
  {
    variants: {
      variant: {
        tealFilled:
          "rounded-full border-2 border-rellia-teal bg-rellia-teal text-white hover:bg-white hover:text-rellia-teal",
        tealFilledLift:
          "rounded-full border-2 border-rellia-teal bg-rellia-teal text-white hover:-translate-y-0.5 hover:bg-white hover:text-rellia-teal hover:shadow-lg",
        outlineOnWhite:
          "rounded-full border-2 border-rellia-teal bg-white text-rellia-teal hover:bg-rellia-teal/5",
        heroSolidOnTeal:
          "rounded-full border-2 border-white bg-white text-rellia-teal hover:border-rellia-mint hover:bg-rellia-mint",
        heroGhostOnTeal:
          "rounded-full border-2 border-white/30 bg-transparent text-white hover:bg-white hover:text-rellia-teal",
        mintOnTealStrip:
          "rounded-full bg-rellia-mint text-rellia-teal hover:bg-white",
        tealCardFull:
          "w-full rounded-full border-2 border-rellia-teal bg-rellia-teal text-sm text-white hover:bg-white hover:text-rellia-teal",
        mintCardFull:
          "w-full rounded-full border-2 border-rellia-teal/15 bg-rellia-mint text-sm text-rellia-teal hover:border-rellia-mint hover:bg-white hover:text-rellia-mint-dark",
        brandSolid:
          "rounded-full border-2 border-rellia-teal bg-rellia-teal text-white hover:border-rellia-mint hover:bg-transparent hover:text-rellia-mint",
        brandOutline:
          "rounded-full border-2 border-rellia-mint bg-transparent text-rellia-mint hover:border-white hover:bg-white hover:text-rellia-teal",
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
