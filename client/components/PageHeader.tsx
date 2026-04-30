import type { ReactNode } from "react"
import ScrollReveal from "@/components/ScrollReveal"
import { cn } from "@/lib/utils"

type PageHeaderVariant = "dark" | "light"

export type PageHeaderProps = {
  title: ReactNode
  subtitle?: ReactNode
  variant?: PageHeaderVariant
  className?: string
}

const DARK_BG = [
  "bg-rellia-teal overflow-hidden",
  "relative",
  "pt-24 pb-12 md:pt-32 md:pb-16",
].join(" ")

const LIGHT_BG = [
  "bg-rellia-cream overflow-hidden",
  "relative",
  "pt-24 pb-12 md:pt-32 md:pb-16",
].join(" ")

export default function PageHeader({ title, subtitle, variant = "dark", className }: PageHeaderProps) {
  const isDark = variant === "dark"

  return (
    <section className={cn(isDark ? DARK_BG : LIGHT_BG, className)}>
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r",
            isDark ? "from-rellia-teal/85 via-rellia-teal/55 to-rellia-teal/30" : "from-rellia-cream via-white/60 to-rellia-cream",
          )}
        />
        <div
          className={cn(
            "absolute -left-28 -top-32 h-[520px] w-[520px] rounded-full blur-3xl",
            isDark ? "bg-rellia-mint/25" : "bg-rellia-mint/20",
          )}
        />
        <div
          className={cn(
            "absolute -right-16 sm:-right-28 md:-right-40 top-1/3 h-[560px] w-[560px] -translate-y-1/2 rounded-full blur-3xl",
            isDark ? "bg-white/10" : "bg-rellia-teal/10",
          )}
        />
        <div
          className={cn(
            "absolute left-1/3 bottom-[-220px] h-[620px] w-[620px] -translate-x-1/2 rounded-full blur-3xl",
            "bg-rellia-mint/15",
          )}
        />
        <div
          className={cn(
            "absolute inset-0 opacity-[0.22] mix-blend-soft-light",
            isDark
              ? "[background-image:radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(255,255,255,0.12),transparent_52%),radial-gradient(circle_at_40%_95%,rgba(255,255,255,0.14),transparent_55%)]"
              : "opacity-[0.18] mix-blend-multiply [background-image:radial-gradient(circle_at_20%_10%,rgba(13,53,64,0.10),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(13,53,64,0.08),transparent_52%),radial-gradient(circle_at_40%_95%,rgba(13,53,64,0.09),transparent_55%)]",
          )}
        />
      </div>

      <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10">
        <ScrollReveal>
          <div className="relative w-fit">
            <h1
              className={cn(
                "relative font-bold leading-tight tracking-tight",
                isDark ? "text-white" : "text-black",
                "text-4xl md:text-5xl lg:text-6xl",
                "mb-5",
              )}
            >
              {title}
            </h1>
          </div>

          {subtitle ? (
            <div
              className={cn(
                "max-w-3xl font-urbanist leading-relaxed",
                isDark ? "text-white/80" : "text-black/65",
                "text-base md:text-lg",
              )}
            >
              {subtitle}
            </div>
          ) : null}
        </ScrollReveal>
      </div>
    </section>
  )
}

