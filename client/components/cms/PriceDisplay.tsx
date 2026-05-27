import { cn } from "@/lib/utils"

type PriceDisplayProps = {
  amount: string
  compareAmount?: string
  discountEnabled?: boolean
  suffix?: string
  amountClassName?: string
  compareClassName?: string
  suffixClassName?: string
}

/** Shows strikethrough compare price + sale price when discount is enabled. */
export const PriceDisplay = ({
  amount,
  compareAmount,
  discountEnabled = false,
  suffix,
  amountClassName = "text-3xl md:text-4xl font-bold text-black tracking-tight",
  compareClassName = "text-xl md:text-2xl font-semibold text-black/40 line-through",
  suffixClassName = "text-black/40 font-medium text-base",
}: PriceDisplayProps) => {
  const showDiscount =
    discountEnabled && typeof compareAmount === "string" && compareAmount.trim().length > 0

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      {showDiscount ? (
        <span className={cn(compareClassName)}>{compareAmount.trim()}</span>
      ) : null}
      <span className={cn(amountClassName, showDiscount && "text-rellia-teal")}>{amount}</span>
      {suffix ? <span className={suffixClassName}>{suffix}</span> : null}
    </div>
  )
}
