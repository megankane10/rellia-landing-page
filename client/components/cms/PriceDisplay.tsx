import { cn } from "@/lib/utils"

type PriceDisplayProps = {
  amount: string
  compareAmount?: string
  discountEnabled?: boolean
  suffix?: string
  amountClassName?: string
  compareClassName?: string
  suffixClassName?: string
  strikeColor?: string
}

/** Shows strikethrough compare price + sale price when discount is enabled. */
export const PriceDisplay = ({
  amount,
  compareAmount,
  discountEnabled = false,
  suffix,
  amountClassName = "text-3xl md:text-4xl font-bold text-black tracking-tight",
  compareClassName = "text-lg md:text-xl font-bold text-black/40",
  suffixClassName = "text-black/40 font-medium text-base",
  strikeColor = "#0D3540", // Defaults to Rellia teal
}: PriceDisplayProps) => {
  const showDiscount =
    discountEnabled && typeof compareAmount === "string" && compareAmount.trim().length > 0

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={cn(amountClassName, showDiscount && "text-rellia-teal")}>{amount}</span>
      {showDiscount ? (
        <span className={cn("relative inline-block ml-1.5", compareClassName)}>
          {compareAmount.trim()}
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to top right, transparent 45%, ${strikeColor} 46%, ${strikeColor} 54%, transparent 55%)`
            }}
          />
        </span>
      ) : null}
      {suffix ? <span className={suffixClassName}>{suffix}</span> : null}
    </div>
  )
}

