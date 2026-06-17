import { useEffect, useState } from "react"
import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

type AdminHeaderClockProps = {
  className?: string
}

const AdminHeaderClock = ({ className }: AdminHeaderClockProps) => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <div
      className={cn("flex items-center gap-3 font-urbanist", className)}
      aria-live="polite"
    >
      <span
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rellia-teal/25",
          "bg-rellia-mint/10 text-rellia-teal dark:border-rellia-mint/25 dark:bg-rellia-mint/10 dark:text-rellia-mint",
        )}
        aria-hidden
      >
        <CalendarDays className="h-5 w-5" strokeWidth={1.75} />
      </span>

      <div className="flex min-w-0 items-center gap-3 whitespace-nowrap">
        <span className="text-lg font-semibold text-foreground">{formatDate(now)}</span>
        <div className="h-5 w-px shrink-0 bg-border/80" aria-hidden />
        <time
          dateTime={now.toISOString()}
          className="text-lg font-normal tabular-nums text-rellia-teal dark:text-rellia-mint"
        >
          {formatTime(now)}
        </time>
      </div>
    </div>
  )
}

export default AdminHeaderClock
