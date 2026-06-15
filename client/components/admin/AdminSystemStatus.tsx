import { useEffect, useState } from "react"
import { isSanityConfigured, sanityFetch } from "@/lib/sanity"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

type ServiceState = "checking" | "online" | "offline" | "unconfigured"

type ServiceStatus = {
  label: string
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

const StatusPill = ({ service, compact }: { service: ServiceStatus; compact?: boolean }) => (
  <li
    className={cn(
      "inline-flex items-center gap-2 rounded-full border font-urbanist",
      compact ? "h-10 px-3.5 text-sm" : "px-3 py-1.5 text-sm",
      service.state === "online" && "border-emerald-200/80 bg-emerald-50/90 text-emerald-900",
      service.state === "checking" && "border-black/10 bg-white/90 text-black/60",
      service.state === "offline" && "border-red-200/80 bg-red-50/90 text-red-800",
      service.state === "unconfigured" && "border-amber-200/80 bg-amber-50/90 text-amber-900",
    )}
    title={service.title}
  >
    <span
      className={cn(
        "h-2 w-2 shrink-0 rounded-full",
        service.state === "checking" && "animate-pulse bg-black/30",
        service.state === "online" && "bg-emerald-500",
        service.state === "offline" && "bg-red-500",
        service.state === "unconfigured" && "bg-amber-500",
      )}
      aria-hidden
    />
    <span>{service.label}</span>
    <span className="text-black/40">·</span>
    <span>{stateLabel(service.state)}</span>
    {service.detail ? (
      <>
        <span className="text-black/40">·</span>
        <span className="text-black/55">{service.detail}</span>
      </>
    ) : null}
  </li>
)

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
    { label: "Database", state: "checking" },
    { label: "CMS", state: "checking" },
  ])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const [dbOk, cmsPing] = await Promise.all([pingSupabase(), pingSanityDrafts()])
      if (cancelled) return
      setServices([
        {
          label: "Database",
          state: dbOk ? "online" : "offline",
          title: "Supabase reachable with your signed-in session",
        },
        {
          label: "CMS",
          state: cmsPing,
          title:
            cmsPing === "online"
              ? "Sanity CMS reachable for draft content"
              : "Sanity drafts query failed — check VITE_SANITY_* and SANITY_API_READ_TOKEN on the server",
        },
      ])
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="System status">
      {!compact ? (
        <span className="font-urbanist text-[10px] uppercase tracking-[0.12em] text-black/45">
          Status
        </span>
      ) : null}
      <ul className="flex flex-wrap items-center gap-2">
        {services.map((service) => (
          <StatusPill key={service.label} service={service} compact={compact} />
        ))}
      </ul>
    </div>
  )
}

export default AdminSystemStatus
