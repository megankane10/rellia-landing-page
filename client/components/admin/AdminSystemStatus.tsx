import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, CheckCircle2, HelpCircle, Loader2, XCircle } from "lucide-react"
import { isSanityConfigured, sanityFetch } from "@/lib/sanity"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ServiceState = "checking" | "online" | "offline" | "unconfigured"

type ServiceStatus = {
  label: string
  tooltipLabel?: string
  summary?: string
  detail?: string
  state: ServiceState
  title?: string
}

type SanityDraftPing = {
  _id?: string
}

const stateLabel = (state: ServiceState): string => {
  if (state === "checking") return "Checking"
  if (state === "online") return "Online"
  if (state === "unconfigured") return "Not set up"
  return "Offline"
}

const statusTheme = (state: ServiceState) => {
  if (state === "online") {
    return {
      pill: "border-emerald-200/70 bg-emerald-50/90 text-emerald-950 dark:border-emerald-500/70 dark:bg-emerald-500/15 dark:text-emerald-100",
      iconWrap: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
      icon: CheckCircle2,
    }
  }
  if (state === "offline") {
    return {
      pill: "border-red-200/70 bg-red-50/90 text-red-950 dark:border-red-500/70 dark:bg-red-500/15 dark:text-red-100",
      iconWrap: "bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-300",
      icon: XCircle,
    }
  }
  if (state === "unconfigured") {
    return {
      pill: "border-amber-200/70 bg-amber-50/90 text-amber-950 dark:border-amber-500/70 dark:bg-amber-500/15 dark:text-amber-100",
      iconWrap: "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
      icon: AlertTriangle,
    }
  }
  return {
    pill: "border-border bg-card/80 text-muted-foreground",
    iconWrap: "bg-muted text-muted-foreground",
    icon: Loader2,
  }
}

const StatusPill = ({ service, compact }: { service: ServiceStatus; compact?: boolean }) => {
  const theme = statusTheme(service.state)
  const Icon = theme.icon

  const tooltipTitle = service.tooltipLabel ?? service.label
  const statusText = stateLabel(service.state)

  const oneLiner = (() => {
    if (service.label === "Database") {
      if (service.state === "online") return "Supabase: form submissions and dashboard data save & load normally"
      if (service.state === "offline") return "Supabase: saving form submissions and dashboard data may fail"
      if (service.state === "unconfigured") return "Supabase: not connected, so submissions can’t be saved"
      return "Supabase: checking connection…"
    }

    if (service.label === "Content") {
      if (service.state === "online") return "Sanity: website content and drafts are reachable"
      if (service.state === "offline") return "Sanity: content and drafts may not load"
      if (service.state === "unconfigured") return "Sanity: not connected, so content won’t load"
      return "Sanity: checking connection…"
    }

    return `${tooltipTitle}: checking…`
  })()
  const ariaLabel = `${tooltipTitle}. ${statusText}. ${oneLiner}`

  const statusChipClass = (() => {
    if (service.state === "online") return "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200"
    if (service.state === "offline") return "bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-200"
    if (service.state === "unconfigured") return "bg-amber-100 text-amber-950 dark:bg-amber-500/20 dark:text-amber-200"
    return "bg-muted text-muted-foreground"
  })()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <li
          className={cn(
            "min-w-0 items-center gap-2 rounded-full border font-urbanist font-semibold",
            "shadow-[0_6px_18px_-14px_rgba(13,53,64,0.26)]",
            compact
              ? "flex h-8 gap-1.5 px-2 text-[11px] leading-none sm:h-10 sm:gap-2 sm:px-3 sm:text-sm"
              : "inline-flex px-3 py-1.5 text-sm",
            theme.pill,
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          aria-label={ariaLabel}
        >
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full [&_svg]:block",
              compact ? "h-4 w-4 sm:h-6 sm:w-6" : "h-6 w-6",
              theme.iconWrap,
            )}
            aria-hidden
          >
            <Icon
              className={cn(
                compact ? "h-3 w-3 sm:h-4 sm:w-4" : "h-4 w-4",
                service.state === "checking" && "animate-spin",
              )}
              strokeWidth={2.25}
              aria-hidden
            />
          </span>
          <span className="inline-flex min-w-0 items-center truncate leading-none">{service.label}</span>
        </li>
      </TooltipTrigger>
      <TooltipContent
        className={cn(
          "max-w-[320px] rounded-2xl border border-border bg-popover px-4 py-3.5 shadow-xl",
          "overflow-visible",
          "font-urbanist text-sm leading-relaxed text-popover-foreground",
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
              "border-border bg-muted text-foreground",
            )}
            aria-hidden
          >
            <Icon
              className={cn("h-5 w-5", service.state === "checking" && "animate-spin")}
              strokeWidth={2.25}
              aria-hidden
            />
          </span>
          <p className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">
            {tooltipTitle}
          </p>
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
              statusChipClass,
            )}
          >
            {statusText}
          </span>
        </div>
        <p className="mt-2.5 text-sm font-medium leading-snug text-muted-foreground">{oneLiner}</p>
      </TooltipContent>
    </Tooltip>
  )
}

const pingSupabase = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("company_profiles")
      .select("id", { count: "exact", head: true })
    return !error
  } catch {
    return false
  }
}

/** CMS health: same sanityDrafts query as the drafts panel (not globalSettings). */
const pingSanityDrafts = async (): Promise<"online" | "offline" | "unconfigured"> => {
  if (!isSanityConfigured()) return "unconfigured"
  const rows = await sanityFetch<SanityDraftPing[]>("sanityDrafts")
  if (rows === null) return "offline"
  return "online"
}

const AdminSystemStatus = ({ compact = false }: { compact?: boolean }) => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      label: "Database",
      tooltipLabel: "Database",
      state: "checking",
    },
    {
      label: "Content",
      tooltipLabel: "Content system",
      state: "checking",
    },
  ])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const [dbOk, cmsPing] = await Promise.all([pingSupabase(), pingSanityDrafts()])
      if (cancelled) return
      setServices([
        {
          label: "Database",
          tooltipLabel: "Database",
          state: dbOk ? "online" : "offline",
        },
        {
          label: "Content",
          tooltipLabel: "Content system",
          state: cmsPing,
        },
      ])
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  const hasAnyOffline = useMemo(() => services.some((s) => s.state === "offline"), [services])
  const hasAnyUnconfigured = useMemo(
    () => services.some((s) => s.state === "unconfigured"),
    [services],
  )

  return (
    <TooltipProvider delayDuration={120}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2",
          compact && "justify-end",
        )}
        aria-label="System status"
      >
      {!compact ? (
        <span className="font-urbanist text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Status
        </span>
      ) : null}
      <ul className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
        {services.map((service) => (
          <StatusPill key={service.label} service={service} compact={compact} />
        ))}
        {!compact ? (
          <li className="ml-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-full border",
                    "bg-card/70 text-muted-foreground shadow-sm transition-colors",
                    "hover:bg-card hover:text-foreground",
                    (hasAnyOffline || hasAnyUnconfigured) && "border-amber-200/70 bg-amber-50/60 text-amber-900 dark:border-amber-500/70 dark:bg-amber-500/15 dark:text-amber-100",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                  aria-label="What do these statuses mean?"
                >
                  <HelpCircle className="h-4.5 w-4.5" aria-hidden />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[280px] rounded-2xl px-3 py-2 text-xs leading-relaxed">
                <span className="font-semibold text-foreground">System status</span>
                <span className="text-muted-foreground">
                  {" "}
                  shows whether each dependency is reachable from your signed-in session.
                </span>
              </TooltipContent>
            </Tooltip>
          </li>
        ) : null}
      </ul>
      </div>
    </TooltipProvider>
  )
}

export default AdminSystemStatus
