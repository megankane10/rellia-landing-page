import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

export type PromoBannerProps = {
  badge?: string
  title: string
  code: string
  onCopy: () => void
  copied?: boolean
  className?: string
}

export default function PromoBanner({
  badge,
  title,
  code,
  onCopy,
  copied = false,
  className,
}: PromoBannerProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm",
        className,
      )}
      role="region"
      aria-label="Promotional offer"
    >
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(157,214,208,0.55),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(13,53,64,0.10),transparent_55%)]"
        />

        <div className="relative flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {badge?.trim() ? (
              <span className="inline-flex shrink-0 items-center rounded-full bg-rellia-mint/70 px-3 py-1 font-urbanist text-xs font-semibold text-rellia-teal">
                {badge.trim()}
              </span>
            ) : null}
            <p className="min-w-0 truncate font-urbanist text-sm font-semibold text-black sm:max-w-[520px]">
              {title.trim()}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-xl bg-white/70 px-3 py-2 ring-1 ring-black/10 backdrop-blur sm:shrink-0">
            <span className="font-mono text-xs font-semibold tracking-[0.14em] text-black">{code}</span>
            <button
              type="button"
              onClick={onCopy}
              aria-label="Copy promo code"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-rellia-teal px-3 py-1.5 font-urbanist text-xs font-semibold text-white transition-colors hover:bg-rellia-teal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40 focus-visible:ring-offset-2"
            >
              {copied ? "Copied" : "Copy"}
              {copied ? <Check className="ml-2 h-4 w-4" /> : <Copy className="ml-2 h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

