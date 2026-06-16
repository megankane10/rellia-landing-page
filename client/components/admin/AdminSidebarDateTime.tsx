import { useEffect, useState } from "react"
import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)

type AdminSidebarDateTimeProps = {
  className?: string
  variant?: "default" | "mobile"
}

export const AdminSidebarDateTime = ({
  className,
  variant = "default",
}: AdminSidebarDateTimeProps) => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const intervalMs = variant === "mobile" ? 15_000 : 30_000
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(id)
  }, [variant])

  if (variant === "mobile") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-rellia-teal/20",
          "bg-gradient-to-br from-slate-900 via-slate-900 to-rellia-teal/[0.12]",
          "px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
          className,
        )}
        aria-live="polite"
      >
        <div
          className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-rellia-mint/10 blur-2xl"
          aria-hidden
        />

        <div className="relative flex flex-col items-start gap-3 text-left">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-rellia-teal/25 bg-rellia-mint/10 text-rellia-mint">
            <CalendarDays className="h-7 w-7" aria-hidden strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <time
              dateTime={now.toISOString()}
              className="block font-host-grotesk text-[2rem] font-semibold leading-none tracking-tight text-white tabular-nums"
            >
              {formatTime(now)}
            </time>
            <p className="mt-4 font-urbanist text-base leading-snug text-rellia-mint">
              {formatDate(now)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800/80 bg-slate-900/60 px-5 py-5",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
        className,
      )}
      aria-live="polite"
    >
      <time
        dateTime={now.toISOString()}
        className="block font-host-grotesk text-[2rem] font-semibold leading-none tracking-tight text-white tabular-nums"
      >
        {formatTime(now)}
      </time>
      <p className="mt-2.5 font-urbanist text-sm leading-snug text-slate-400">{formatDate(now)}</p>
    </div>
  )
}
