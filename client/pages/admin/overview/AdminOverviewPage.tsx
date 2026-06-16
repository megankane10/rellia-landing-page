import { useState, useMemo, useCallback, useEffect } from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, AlertCircle, CalendarDays, CircleHelp, ClockFading, FileEdit, Inbox, PartyPopper, Stethoscope, Users, TrendingUp, XCircle, type LucideIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts"
import { useAuth } from "@/context/AuthContext"
import { fetchAdminTeam } from "@/lib/adminApi"
import { isAdminMemberOnlineNow, adminOnlineBadgeClass } from "@/lib/adminPresence"
import { supabase } from "@/lib/supabase"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import { adminSelectedItemSurfaceOnLightClass } from "@/components/admin/adminSidebarRail"
import AdminSignupWelcomeSplash from "@/components/admin/AdminSignupWelcomeSplash"
import ScrollReveal from "@/components/ScrollReveal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import {
  contactDisplayName,
  contactTypeLabel,
  fetchContactSubmissions,
  fetchDiagnosticSubmissions,
} from "@/lib/adminSubmissions"
import {
  buildLastNDaysTrend,
  buildStatusBreakdown,
  countRecentAll,
  countSubmissionsBetweenDays,
  countUnresolved,
  percentChange,
  welcomeBackTitle,
} from "@/lib/adminOverview"
import {
  adminUserHasSeenWelcomeSplash,
  adminUserShouldSeeWelcomeSplash,
  getAdminDisplayName,
  getAdminFirstName,
  markAdminWelcomeSplashSeen,
} from "@/lib/adminUserProfile"
import { cmsContentQueryKey, fetchCmsContentQueueForDataset, isCmsContentEnabled, ADMIN_SANITY_PRODUCTION_DATASET } from "@/lib/adminSanityContent"
import { formatAdminDate, isActiveSubmissionStatus, statusBadgeClass } from "@/lib/adminSubmissionStatus"
import { Badge } from "@/components/ui/badge"
import { adminChartTooltipClass, adminOverviewArrowChipClass } from "@/components/admin/adminThemeClasses"
import AdminTooltipContent from "@/components/admin/AdminTooltipContent"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const CHART_COLORS = {
  contacts: "hsl(174 42% 35%)",
  diagnostics: "hsl(174 55% 72%)",
  new: "hsl(199 89% 48%)",
  progress: "hsl(38 92% 50%)",
  resolved: "hsl(142 76% 36%)",
}

const STAGE_COLORS = [
  "hsl(174 42% 35%)", // Teal
  "hsl(174 55% 72%)", // Mint
  "hsl(199 89% 48%)", // Blue
  "hsl(38 92% 50%)",  // Orange/Amber
  "hsl(142 76% 36%)", // Green
  "hsl(322 81% 43%)", // Pink
  "hsl(262 83% 58%)", // Violet
]

const trendChartConfig = {
  contacts: { label: "Web forms", color: CHART_COLORS.contacts },
  diagnostics: { label: "Diagnostics", color: CHART_COLORS.diagnostics },
}

const stageChartConfig = {
  count: { label: "Startups", color: CHART_COLORS.contacts },
}

const CHART_X_AXIS_PROPS = {
  tickLine: false as const,
  axisLine: false as const,
  tickMargin: 8,
  fontSize: 11,
  interval: 0 as const,
  angle: -35,
  textAnchor: "end" as const,
  height: 48,
}

const CHART_MARGIN = { top: 8, right: 4, left: 0, bottom: 40 }

const PIE_TOOLTIP_STYLE = {
  borderRadius: "12px",
  border: "1px solid rgba(51, 65, 85, 0.7)",
  backgroundColor: "hsl(222 47% 11%)",
  color: "#ffffff",
  boxShadow: "0 12px 32px rgba(0,0,0,0.38)",
  fontFamily: "Urbanist, sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  zIndex: 50,
} as const

type PieSliceRow = { name: string; value: number; pct: number; fill: string }

const DONUT_CHART_SIZES = {
  default: { height: 200, innerRadius: 58, outerRadius: 78 },
  large: { height: 230, innerRadius: 68, outerRadius: 92 },
} as const

const toTopPieSlices = (
  rows: Array<{ name: string; value: number; fill: string }>,
  limit = 3,
): PieSliceRow[] => {
  const top = rows.slice(0, limit)
  const total = top.reduce((sum, row) => sum + row.value, 0)
  return top.map((row) => ({
    ...row,
    pct: total > 0 ? Math.round((row.value / total) * 100) : 0,
  }))
}

const PieLegend = ({ rows }: { rows: PieSliceRow[] }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 font-urbanist text-sm">
    {rows.filter((row) => row.value > 0).map((row) => (
      <div key={row.name} className="flex max-w-full items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: row.fill }} />
        <span className="truncate font-semibold text-foreground/80 dark:text-slate-100">{row.name}</span>
        <span className="shrink-0 text-muted-foreground dark:text-slate-300">({row.value})</span>
      </div>
    ))}
  </div>
)

const DonutChartWithCenter = ({
  data,
  centerLabel,
  centerValue,
  tooltipRows,
  size = "default",
}: {
  data: PieSliceRow[]
  centerLabel: string
  centerValue: number | string
  tooltipRows: PieSliceRow[]
  size?: keyof typeof DONUT_CHART_SIZES
}) => {
  const slices = data.filter((row) => row.value > 0)
  const chartSize = DONUT_CHART_SIZES[size]

  return (
    <div
      className="relative flex w-full items-center justify-center"
      style={{ height: chartSize.height }}
    >
      <div className="absolute inset-0 z-10">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              cx="50%"
              cy="50%"
              innerRadius={chartSize.innerRadius}
              outerRadius={chartSize.outerRadius}
              paddingAngle={3}
              dataKey="value"
            >
              {slices.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value: number | string, name: string) => [
                `${value} (${tooltipRows.find((row) => row.name === name)?.pct ?? 0}%)`,
                name,
              ]}
              labelStyle={{ color: "#ffffff", fontWeight: 600 }}
              itemStyle={{ color: "#e2e8f0" }}
              wrapperStyle={{ zIndex: 50 }}
              contentStyle={PIE_TOOLTIP_STYLE}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="pointer-events-none absolute z-0 flex flex-col items-center justify-center text-center">
        <span className="font-urbanist text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          {centerLabel}
        </span>
        <span className="mt-0.5 font-host-grotesk text-xl font-bold leading-none text-foreground">
          {centerValue}
        </span>
      </div>
    </div>
  )
}

type StatCardProps = {
  label: string
  value: number | string
  icon: LucideIcon
  changePct?: number | null
  href?: string
  loading?: boolean
}

const adminStatCardSurfaceClass = cn(
  "overflow-hidden rounded-xl",
  adminSelectedItemSurfaceOnLightClass,
)

const adminOverviewClickableShadowClass =
  "shadow-[0_4px_20px_-12px_rgba(13,53,64,0.18)] transition-[background-color,border-color,box-shadow] duration-150 hover:shadow-[0_8px_28px_-14px_rgba(13,53,64,0.26)]"

const adminOverviewLinkBoxClass = cn(
  "flex min-h-[5.75rem] min-w-0 w-full items-center gap-4 rounded-2xl border border-border bg-card p-5",
  adminOverviewClickableShadowClass,
  "hover:border-rellia-teal/25 hover:bg-rellia-mint/5",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
)

const adminOverviewCardTitleClass = "font-host-grotesk text-xl text-foreground dark:text-white"
const adminOverviewCardTitleWithIconClass = "flex items-center gap-2.5 font-host-grotesk text-xl text-foreground dark:text-white"
const adminOverviewCardTitleIconClass = "h-5 w-5 shrink-0 text-rellia-teal dark:text-rellia-mint"
const adminOverviewCardDescriptionClass = "font-urbanist text-sm"
const adminOverviewPieSectionTitleClass = "font-host-grotesk text-sm font-bold text-foreground dark:text-white"
const adminOverviewPieSectionIconClass = "h-5 w-5 shrink-0"

const overviewTopCardShellClass = cn(
  "group relative min-w-0 overflow-hidden rounded-2xl border bg-card p-5",
  "min-h-[132px]",
  "shadow-[0_4px_20px_-12px_rgba(13,53,64,0.18)] transition-[background-color,border-color,box-shadow,transform] duration-150",
  "border-rellia-teal/22 hover:border-rellia-teal/35 hover:bg-rellia-mint/5 hover:shadow-[0_8px_28px_-14px_rgba(13,53,64,0.26)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/30",
)

const CAUGHT_UP_MESSAGE = "You're all caught up!"

const OverviewTopLinkCard = ({
  title,
  value,
  statusLabel,
  statusTone,
  caughtUpTooltip,
  href,
  loading,
}: {
  title: string
  value: number | string
  statusLabel: string
  statusTone: "good" | "warn" | "muted"
  caughtUpTooltip?: string
  href: string
  loading?: boolean
}) => {
  const StatusIcon = statusTone === "good" ? PartyPopper : statusTone === "muted" ? XCircle : ClockFading
  const isCaughtUpMessage = value === CAUGHT_UP_MESSAGE
  const isCompactValue = typeof value !== "number" && !isCaughtUpMessage

  const statusTooltip =
    statusTone === "good"
      ? (caughtUpTooltip ?? "Nothing here needs your attention right now.")
      : statusLabel

  const statusAccentClass =
    statusTone === "good"
      ? "text-emerald-700 dark:text-emerald-400"
      : statusTone === "warn"
        ? "text-amber-800 dark:text-amber-400"
        : "text-slate-600 dark:text-slate-300"

  const statusCircleClass =
    statusTone === "good"
      ? "border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-500/70 dark:bg-emerald-500/10 dark:text-emerald-400"
      : statusTone === "warn"
        ? "border-amber-200/70 bg-amber-50 text-amber-800 dark:border-amber-500/70 dark:bg-amber-500/10 dark:text-amber-400"
        : "border-slate-200/70 bg-slate-50 text-slate-600 dark:border-slate-500/70 dark:bg-slate-500/10 dark:text-slate-300"

  return (
    <Link to={href} className={overviewTopCardShellClass} aria-label={title}>
      <div className="flex min-h-[5.5rem] items-center sm:min-h-[6rem]">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 truncate font-host-grotesk text-base font-semibold text-foreground dark:text-white sm:text-lg">
              {title}
            </p>
            <span
              className={cn(
                adminOverviewArrowChipClass,
                "group-hover:-translate-y-[1px]",
              )}
              aria-hidden
            >
              <ArrowUpRight
                className={cn(
                  "h-4 w-4 transition-transform duration-150",
                  "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                )}
                strokeWidth={2.25}
                aria-hidden
              />
            </span>
          </div>

          {loading ? (
            <Skeleton className="mt-3 h-10 w-20 rounded-lg bg-rellia-mint/25" />
          ) : (
            <div className={cn("mt-2 flex min-w-0 gap-3", isCaughtUpMessage ? "items-start" : "items-center")}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={cn(
                      "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border",
                      statusCircleClass,
                      isCaughtUpMessage && "mt-0.5",
                    )}
                    onClick={(e) => e.preventDefault()}
                    onPointerDown={(e) => e.stopPropagation()}
                    tabIndex={0}
                    aria-label={statusTooltip}
                  >
                    <StatusIcon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" strokeWidth={2.25} aria-hidden />
                  </span>
                </TooltipTrigger>
                <AdminTooltipContent>{statusTooltip}</AdminTooltipContent>
              </Tooltip>
              <p
                className={cn(
                  "min-w-0 font-host-grotesk font-semibold",
                  statusAccentClass,
                  isCaughtUpMessage
                    ? "text-base leading-snug sm:text-lg"
                    : isCompactValue
                      ? "text-2xl leading-none sm:text-[1.75rem]"
                      : "text-[2.5rem] leading-none tabular-nums sm:text-[2.75rem]",
                )}
              >
                {value}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

const StatCard = ({ label, value, icon: Icon, changePct, href, loading }: StatCardProps) => {
  const changeTagClass =
    changePct === null || changePct === 0
      ? "bg-rellia-mint/30 text-rellia-teal dark:text-rellia-mint"
      : changePct > 0
        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200"

  const renderChangeTag = () => {
    if (changePct === undefined) return null
    if (changePct === null) {
      return (
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-full px-3 py-1 font-urbanist text-sm font-semibold",
            changeTagClass,
          )}
        >
          —
        </span>
      )
    }
    if (changePct === 0) {
      return (
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-full px-3 py-1 font-urbanist text-sm font-semibold tabular-nums",
            changeTagClass,
          )}
        >
          0%
        </span>
      )
    }

    const isUp = changePct > 0
    const ChangeIcon = isUp ? ArrowUp : ArrowDown

    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 font-urbanist text-sm font-semibold tabular-nums",
          changeTagClass,
        )}
      >
        <ChangeIcon className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
        {Math.abs(changePct)}%
      </span>
    )
  }

  const body = (
    <Card
      className={cn(
        "flex h-full min-w-0 flex-row items-stretch bg-transparent text-card-foreground",
        adminStatCardSurfaceClass,
        href
          ? cn(
              adminOverviewClickableShadowClass,
              "hover:!bg-rellia-mint/25 hover:!border-rellia-teal/28",
            )
          : "shadow-none",
      )}
    >
      <div className="flex shrink-0 items-center self-stretch py-4 pl-4 pr-5 sm:py-5 sm:pl-5">
        <div className="flex size-[4.5rem] shrink-0 items-center justify-center rounded-2xl border border-rellia-teal/12 bg-gradient-to-br from-white via-white to-rellia-mint/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:size-[4.75rem]">
          <Icon className="size-8 text-rellia-teal sm:size-9" strokeWidth={1.5} aria-hidden />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 items-center py-5 pr-5">
        <div className="min-w-0">
          {loading ? (
            <Skeleton className="h-10 w-20 rounded-lg bg-rellia-mint/25" />
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <p className="font-host-grotesk text-4xl font-bold tabular-nums leading-none text-rellia-teal sm:text-[2.75rem]">
                  {value}
                </p>
                {renderChangeTag()}
              </div>
              <p className="mt-2 font-urbanist text-base font-medium text-rellia-teal">{label}</p>
            </>
          )}
        </div>
      </div>
    </Card>
  )

  if (!href) return body
  return (
    <Link
      to={href}
      className="group block min-w-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/30"
    >
      {body}
    </Link>
  )
}

const statusChartConfig = {
  New: { label: "New", color: CHART_COLORS.new },
  "In Progress": { label: "In progress", color: CHART_COLORS.progress },
  Resolved: { label: "Resolved", color: CHART_COLORS.resolved },
}

type AdminWelcomeLocationState = {
  showWelcome?: boolean
  firstName?: string
}

const AdminOverviewPage = () => {
  const { user, session } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const welcomeState = (location.state as AdminWelcomeLocationState | null) ?? null
  const previewWelcome = searchParams.get("previewWelcome") === "1"
  const previewName = searchParams.get("name")?.trim() ?? ""
  const wantsWelcome = adminUserShouldSeeWelcomeSplash(user, {
    forceWelcome: welcomeState?.showWelcome === true,
    previewWelcome,
  })
  // Start false so a brief null user on first paint cannot permanently skip the splash.
  const [splashDismissed, setSplashDismissed] = useState(false)
  const showSplash = wantsWelcome && !splashDismissed
  const token = session?.access_token ?? ""
  const displayName = getAdminDisplayName(user)
  const pageTitle = welcomeBackTitle(displayName, user?.email)
  const welcomeFirstName =
    previewName ||
    welcomeState?.firstName?.trim() ||
    getAdminFirstName(displayName, user?.email)

  const handleSplashComplete = useCallback(() => {
    setSplashDismissed(true)
    if (previewWelcome) {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete("previewWelcome")
      nextParams.delete("name")
      const nextSearch = nextParams.toString()
      navigate(
        { pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : "" },
        { replace: true, state: null },
      )
      return
    }

    if (!adminUserHasSeenWelcomeSplash(user)) {
      void markAdminWelcomeSplashSeen()
    }

    if (welcomeState?.showWelcome) {
      const nextSearch = searchParams.toString()
      navigate(
        { pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : "" },
        { replace: true, state: null },
      )
    }
  }, [location.pathname, navigate, previewWelcome, searchParams, user, welcomeState?.showWelcome])

  useEffect(() => {
    if (!showSplash) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showSplash])

  const [weekOffset, setWeekOffset] = useState(0)
  const [statusFilter, setStatusFilter] = useState<"all" | "survey" | "web">("all")
  const [selectedStage, setSelectedStage] = useState<string>("all")

  const contactsQuery = useQuery({ queryKey: ["admin-contact-submissions"], queryFn: fetchContactSubmissions })
  const diagnosticsQuery = useQuery({ queryKey: ["admin-company-profiles"], queryFn: fetchDiagnosticSubmissions })
  const responsesQuery = useQuery({
    queryKey: ["admin-diagnostic-responses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("diagnostic_responses")
        .select("company_profile_id, top3_strengths, top3_weaknesses")
      if (error) throw error
      return data ?? []
    },
  })
  const draftsQuery = useQuery({
    queryKey: cmsContentQueryKey(ADMIN_SANITY_PRODUCTION_DATASET),
    queryFn: () => fetchCmsContentQueueForDataset(token, ADMIN_SANITY_PRODUCTION_DATASET),
    enabled: isCmsContentEnabled() && Boolean(token),
    staleTime: 60_000,
  })
  const teamQuery = useQuery({
    queryKey: ["admin-team", token],
    queryFn: () => fetchAdminTeam(token),
    enabled: Boolean(token),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
  const loading = contactsQuery.isLoading || diagnosticsQuery.isLoading
  const contacts = contactsQuery.data ?? []
  const diagnostics = diagnosticsQuery.data ?? []
  const trend = buildLastNDaysTrend(contacts, diagnostics, 7, weekOffset)

  // Filtered status breakdown logic — only by submission type, not startup level
  const filteredContacts = useMemo(() => {
    if (statusFilter === "survey") return []
    return contacts
  }, [contacts, statusFilter])

  const filteredDiagnostics = useMemo(() => {
    if (statusFilter === "web") return []
    return diagnostics
  }, [diagnostics, statusFilter])

  const statusBreakdown = useMemo(() => {
    return buildStatusBreakdown(filteredContacts, filteredDiagnostics)
  }, [filteredContacts, filteredDiagnostics])

  const recentContacts = [...contacts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
  const recentDiagnostics = [...diagnostics]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const unresolved = countUnresolved(contacts, diagnostics)
  const unresolvedWebForms = contacts.filter((row) =>
    isActiveSubmissionStatus(row.status as "New" | "In Progress" | "Resolved" | null),
  ).length
  const unresolvedDiagnostics = diagnostics.filter((row) =>
    isActiveSubmissionStatus(row.status as "New" | "In Progress" | "Resolved" | null),
  ).length
  const weekCount = countSubmissionsBetweenDays(contacts, diagnostics, (weekOffset + 1) * 7, weekOffset * 7)
  const previousWeekCount = countSubmissionsBetweenDays(contacts, diagnostics, (weekOffset + 2) * 7, (weekOffset + 1) * 7)
  const weekChangePct = percentChange(weekCount, previousWeekCount)
  const previousUnresolved = countSubmissionsBetweenDays(
    contacts.filter((row) => isActiveSubmissionStatus(row.status as "New" | "In Progress" | "Resolved" | null)),
    diagnostics.filter((row) => isActiveSubmissionStatus(row.status as "New" | "In Progress" | "Resolved" | null)),
    14,
    7,
  )
  const unresolvedChangePct = percentChange(unresolved, previousUnresolved)
  const draftCount = draftsQuery.data?.length ?? 0
  const teamCount = teamQuery.data?.length ?? 0

  const onlineNowCount = useMemo(() => {
    const rows = teamQuery.data ?? []
    return rows.filter((member) => isAdminMemberOnlineNow(member)).length
  }, [teamQuery.data])

  const totalStatusCount = useMemo(() => {
    return statusBreakdown.reduce((sum, row) => sum + row.count, 0)
  }, [statusBreakdown])

  const statusRows = useMemo(() => {
    return statusBreakdown.map((row) => ({
      name: row.status,
      value: row.count,
      pct: totalStatusCount > 0 ? Math.round((row.count / totalStatusCount) * 100) : 0,
      fill:
        row.status === "New"
          ? CHART_COLORS.new
          : row.status === "In Progress"
            ? CHART_COLORS.progress
            : CHART_COLORS.resolved,
    }))
  }, [statusBreakdown, totalStatusCount])

  const allStages = useMemo(() => {
    const stages = new Set<string>()
    diagnostics.forEach((row) => {
      if (row.stage) stages.add(row.stage)
    })
    return Array.from(stages).sort()
  }, [diagnostics])

  const profileStageMap = useMemo(() => {
    const map = new Map<string, string | null>()
    diagnostics.forEach((d) => {
      map.set(d.id, d.stage)
    })
    return map
  }, [diagnostics])

  const stageChartData = useMemo(() => {
    const counts: Record<string, number> = {}
    diagnostics.forEach((row) => {
      const stage = row.stage || "Not Specified"
      counts[stage] = (counts[stage] || 0) + 1
    })
    const total = Object.values(counts).reduce((sum, val) => sum + val, 0)
    return Object.entries(counts).map(([stage, count], idx) => ({
      name: stage,
      value: count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
      fill: STAGE_COLORS[idx % STAGE_COLORS.length]
    }))
  }, [diagnostics])

  // Strengths and Gaps Pie Chart data
  const strengthsPieData = useMemo(() => {
    const counts: Record<string, number> = {}
    const responses = responsesQuery.data ?? []
    responses.forEach((resp) => {
      const stage = profileStageMap.get(resp.company_profile_id)
      if (selectedStage !== "all" && stage !== selectedStage) return

      const strengths = resp.top3_strengths as any[] | null
      if (Array.isArray(strengths)) {
        strengths.forEach((s) => {
          if (s?.category) {
            counts[s.category] = (counts[s.category] || 0) + 1
          }
        })
      }
    })

    const palette = [
      "hsl(174 42% 35%)", // Rellia Teal
      "hsl(175 42% 73%)", // Rellia Mint
      "hsl(199 89% 48%)", // Blue
      "hsl(38 92% 50%)",  // Orange/Amber
      "hsl(142 76% 36%)", // Green
      "hsl(322 81% 43%)", // Pink
      "hsl(262 83% 58%)", // Violet
      "hsl(28 80% 52%)"   // Red-orange
    ]

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([category, val], idx) => ({
        name: category,
        value: val,
        fill: palette[idx % palette.length]
      }))
  }, [responsesQuery.data, profileStageMap, selectedStage])

  const gapsPieData = useMemo(() => {
    const counts: Record<string, number> = {}
    const responses = responsesQuery.data ?? []
    responses.forEach((resp) => {
      const stage = profileStageMap.get(resp.company_profile_id)
      if (selectedStage !== "all" && stage !== selectedStage) return

      const weaknesses = resp.top3_weaknesses as any[] | null
      if (Array.isArray(weaknesses)) {
        weaknesses.forEach((w) => {
          if (w?.category) {
            counts[w.category] = (counts[w.category] || 0) + 1
          }
        })
      }
    })

    const palette = [
      "hsl(38 92% 50%)",  // Orange/Amber
      "hsl(28 80% 52%)",   // Red-orange
      "hsl(322 81% 43%)", // Pink
      "hsl(174 42% 35%)", // Rellia Teal
      "hsl(199 89% 48%)", // Blue
      "hsl(262 83% 58%)", // Violet
      "hsl(142 76% 36%)", // Green
      "hsl(175 42% 73%)"  // Rellia Mint
    ]

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([category, val], idx) => ({
        name: category,
        value: val,
        fill: palette[idx % palette.length]
      }))
  }, [responsesQuery.data, profileStageMap, selectedStage])

  const topStrengthsPieRows = useMemo(
    () => toTopPieSlices(strengthsPieData, 3),
    [strengthsPieData],
  )

  const topGapsPieRows = useMemo(
    () => toTopPieSlices(gapsPieData, 3),
    [gapsPieData],
  )

  const topStrengthsTotal = useMemo(
    () => topStrengthsPieRows.reduce((sum, row) => sum + row.value, 0),
    [topStrengthsPieRows],
  )

  const topGapsTotal = useMemo(
    () => topGapsPieRows.reduce((sum, row) => sum + row.value, 0),
    [topGapsPieRows],
  )

  const getWeekRangeLabel = (offset: number) => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const DAY_MS = 24 * 60 * 60 * 1000
    const firstDay = new Date(now.getTime() - 6 * DAY_MS - offset * 7 * DAY_MS)
    const lastDay = new Date(now.getTime() - offset * 7 * DAY_MS)

    const formatOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
    const startStr = firstDay.toLocaleDateString("en-US", formatOptions)
    const endStr = lastDay.toLocaleDateString("en-US", formatOptions)

    const currentYear = new Date().getFullYear()
    const startYear = firstDay.getFullYear()
    const endYear = lastDay.getFullYear()

    const startYearStr = startYear !== currentYear ? `, ${startYear}` : ""
    const endYearStr = endYear !== currentYear ? `, ${endYear}` : ""

    return `${startStr}${startYearStr} – ${endStr}${endYearStr}`
  }

  return (
    <div className="min-w-0 space-y-6">
      {showSplash ? (
        <AdminSignupWelcomeSplash
          firstName={welcomeFirstName}
          onComplete={handleSplashComplete}
        />
      ) : null}

      <div
        className={cn(
          "min-w-0 space-y-6",
          showSplash && "invisible pointer-events-none",
        )}
        aria-hidden={showSplash}
      >
      <ScrollReveal variant="ctaReveal" hold={showSplash}>
      <AdminPageHeader
        title={pageTitle}
        showDivider={false}
        titleClassName="text-2xl font-semibold leading-tight md:text-4xl md:leading-tight"
      />
      </ScrollReveal>

      <ScrollReveal variant="ctaReveal" delay={0.05} hold={showSplash}>
      <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <OverviewTopLinkCard
          title="Web forms"
          href="/admin/inbox?tab=contact"
          loading={loading}
          value={unresolvedWebForms === 0 && !loading ? CAUGHT_UP_MESSAGE : unresolvedWebForms}
          caughtUpTooltip="No contact or investor form submissions are waiting for review."
          statusLabel="Needs attention"
          statusTone={unresolvedWebForms === 0 && !loading ? "good" : "warn"}
        />
        <OverviewTopLinkCard
          title="Diagnostic surveys"
          href="/admin/inbox?tab=diagnostic"
          loading={loading}
          value={unresolvedDiagnostics === 0 && !loading ? CAUGHT_UP_MESSAGE : unresolvedDiagnostics}
          caughtUpTooltip="No startup diagnostic submissions are waiting for review."
          statusLabel="Needs attention"
          statusTone={unresolvedDiagnostics === 0 && !loading ? "good" : "warn"}
        />
        <OverviewTopLinkCard
          title="Sanity drafts"
          href="/admin/drafts"
          loading={isCmsContentEnabled() && draftsQuery.isLoading}
          value={
            !isCmsContentEnabled()
              ? "—"
              : draftCount === 0 && !draftsQuery.isLoading
                ? CAUGHT_UP_MESSAGE
                : draftCount
          }
          caughtUpTooltip="No unpublished Sanity drafts are waiting to go live."
          statusLabel={
            !isCmsContentEnabled()
              ? "Unavailable"
              : "Needs attention"
          }
          statusTone={
            !isCmsContentEnabled()
              ? "muted"
              : draftCount === 0 && !draftsQuery.isLoading
                ? "good"
                : "warn"
          }
        />
      </div>
      </ScrollReveal>

      <ScrollReveal variant="ctaReveal" delay={0.08} hold={showSplash}>
      <div className="grid min-w-0 gap-4 lg:grid-cols-3">
        {/* Submissions by week */}
        <Card className="min-w-0 overflow-hidden lg:col-span-2 rounded-2xl">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <CardTitle className={adminOverviewCardTitleClass}>Submissions by week</CardTitle>
              <CardDescription className={adminOverviewCardDescriptionClass}>Daily web forms and startup diagnostics</CardDescription>
            </div>
            <div className="flex w-full min-w-0 flex-wrap items-center justify-start gap-2 sm:w-auto sm:justify-end">
              <button
                onClick={() => setWeekOffset((prev) => prev + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted/50 active:bg-slate-100 disabled:opacity-50"
                aria-label="Previous week"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="min-w-0 flex-1 text-center font-urbanist text-sm font-semibold text-muted-foreground sm:min-w-[10rem] sm:flex-none">
                {getWeekRangeLabel(weekOffset)}
              </span>
              <button
                onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
                disabled={weekOffset === 0}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted/50 active:bg-slate-100 disabled:opacity-50"
                aria-label="Next week"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="min-w-0 overflow-x-auto">
            {loading ? (
              <Skeleton className="h-[320px] w-full min-w-0 rounded-lg" />
            ) : (
              <ChartContainer config={trendChartConfig} className="h-[280px] w-full min-w-[280px] sm:h-[340px]">
                <BarChart data={trend} margin={CHART_MARGIN}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" {...CHART_X_AXIS_PROPS} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} fontSize={11} />
                  <ChartTooltip content={<ChartTooltipContent className={adminChartTooltipClass} />} />
                  <Bar dataKey="contacts" stackId="a" fill="var(--color-contacts)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="diagnostics" stackId="a" fill="var(--color-diagnostics)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Card 1: Submission Status */}
        <Card className="min-w-0 overflow-hidden lg:col-span-1 rounded-2xl flex flex-col h-full">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2">
            <div>
              <CardTitle className={adminOverviewCardTitleClass}>Submission Status</CardTitle>
              <CardDescription className={adminOverviewCardDescriptionClass}>Distribution of submissions</CardDescription>
            </div>
            <div className="flex gap-1 rounded-xl border border-border bg-muted/50 p-1 w-fit">
              {(["all", "web", "survey"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setStatusFilter(mode)}
                  className={cn(
                    "rounded-lg px-3.5 py-2 font-urbanist text-sm font-semibold transition-all",
                    statusFilter === mode
                      ? "bg-rellia-teal text-white shadow-sm dark:bg-rellia-mint/20 dark:text-rellia-mint"
                      : "text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white",
                  )}
                >
                  {mode === "all" ? "All" : mode === "web" ? "Web" : "Survey"}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="flex min-h-[260px] flex-1 flex-col justify-center pb-6">
            {loading ? (
              <Skeleton className="h-[200px] w-full rounded-xl" />
            ) : totalStatusCount === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-center">
                <p className="font-urbanist text-xs text-muted-foreground">No submissions found.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <DonutChartWithCenter
                  data={statusRows}
                  centerLabel="Total"
                  centerValue={totalStatusCount}
                  tooltipRows={statusRows}
                />

                <PieLegend rows={statusRows} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </ScrollReveal>

      <ScrollReveal variant="ctaReveal" delay={0.11} hold={showSplash}>
      <div className="grid min-w-0 gap-4 lg:grid-cols-3">
        {/* Card 2: Startup Level Distribution */}
        <Card className="min-w-0 overflow-hidden lg:col-span-1 rounded-2xl flex flex-col h-full">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className={adminOverviewCardTitleClass}>Level Distribution</CardTitle>
              <CardDescription className={adminOverviewCardDescriptionClass}>Diagnostic survey stages</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-[260px] flex-1 flex-col justify-center pb-6">
            {loading ? (
              <Skeleton className="h-[200px] w-full rounded-xl" />
            ) : stageChartData.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-center">
                <p className="font-urbanist text-xs text-muted-foreground">No stage data found.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <DonutChartWithCenter
                  data={stageChartData}
                  centerLabel="Total"
                  centerValue={diagnostics.length}
                  tooltipRows={stageChartData}
                />

                <PieLegend rows={stageChartData} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Top Strengths & Growth Gaps */}
        <Card className="min-w-0 overflow-hidden lg:col-span-2 rounded-2xl h-full flex flex-col">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2">
            <div>
              <CardTitle className={adminOverviewCardTitleClass}>Strengths & Weaknesses</CardTitle>
              <CardDescription className={adminOverviewCardDescriptionClass}>Top capabilities and growth gaps based on diagnostic responses</CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="h-10 min-w-[9rem] w-full appearance-none rounded-xl border border-border bg-card pl-3.5 pr-11 font-urbanist text-sm font-semibold text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rellia-teal sm:w-auto"
                aria-label="Filter strengths and weaknesses by startup level"
              >
                <option value="all">All Levels</option>
                {allStages.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
            </div>
          </CardHeader>
          <CardContent className="flex min-h-[360px] min-w-0 flex-1 flex-col gap-4 pt-2 pb-6 md:flex-row">
            <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-emerald-100/40 bg-emerald-50/20 p-4 dark:border-emerald-500/20 dark:bg-emerald-950/25">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className={cn(adminOverviewPieSectionIconClass, "text-emerald-600 dark:text-emerald-400")} aria-hidden />
                <p className={adminOverviewPieSectionTitleClass}>Top Strengths</p>
              </div>
              {responsesQuery.isLoading ? (
                <Skeleton className="h-[230px] w-full rounded-xl" />
              ) : topStrengthsPieRows.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                  <p className="font-urbanist text-xs text-muted-foreground">No data reported.</p>
                </div>
              ) : (
                <div className="flex flex-1 flex-col justify-center gap-4">
                  <DonutChartWithCenter
                    size="large"
                    data={topStrengthsPieRows}
                    centerLabel="Total"
                    centerValue={topStrengthsTotal}
                    tooltipRows={topStrengthsPieRows}
                  />
                  <PieLegend rows={topStrengthsPieRows} />
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-amber-100/40 bg-amber-50/20 p-4 dark:border-amber-500/20 dark:bg-amber-950/25">
              <div className="mb-3 flex items-center gap-2">
                <AlertCircle className={cn(adminOverviewPieSectionIconClass, "text-amber-600 dark:text-amber-400")} aria-hidden />
                <p className={adminOverviewPieSectionTitleClass}>Top Weaknesses</p>
              </div>
              {responsesQuery.isLoading ? (
                <Skeleton className="h-[230px] w-full rounded-xl" />
              ) : topGapsPieRows.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                  <p className="font-urbanist text-xs text-muted-foreground">No data reported.</p>
                </div>
              ) : (
                <div className="flex flex-1 flex-col justify-center gap-4">
                  <DonutChartWithCenter
                    size="large"
                    data={topGapsPieRows}
                    centerLabel="Total"
                    centerValue={topGapsTotal}
                    tooltipRows={topGapsPieRows}
                  />
                  <PieLegend rows={topGapsPieRows} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      </ScrollReveal>

      <ScrollReveal variant="ctaReveal" delay={0.14} hold={showSplash}>
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <Card className="min-w-0 overflow-hidden rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className={adminOverviewCardTitleWithIconClass}>
                <Inbox className={adminOverviewCardTitleIconClass} aria-hidden />
                Recent web forms
              </CardTitle>
            </div>
            <Link
              to="/admin/inbox?tab=contact"
              className="inline-flex items-center gap-1 font-urbanist text-sm text-rellia-teal hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : recentContacts.length === 0 ? (
              <p className="font-urbanist text-sm text-muted-foreground">No contact submissions yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentContacts.map((row) => (
                  <li key={row.id} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                    <div className="min-w-0">
                      <Link
                        to={`/admin/contacts/${row.id}`}
                        className="truncate font-urbanist text-sm font-medium text-rellia-teal hover:underline"
                      >
                        {contactDisplayName(row)}
                      </Link>
                      <p className="truncate font-urbanist text-xs text-muted-foreground">
                        {contactTypeLabel(row)} · {formatAdminDate(row.created_at)}
                      </p>
                    </div>
                    <Badge variant="outline" className={cn("shrink-0", statusBadgeClass(row.status ?? "New"))}>
                      {row.status ?? "New"}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0 overflow-hidden rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className={adminOverviewCardTitleWithIconClass}>
                <Stethoscope className={adminOverviewCardTitleIconClass} aria-hidden />
                Recent diagnostics
              </CardTitle>
            </div>
            <Link
              to="/admin/inbox?tab=diagnostic"
              className="inline-flex items-center gap-1 font-urbanist text-sm text-rellia-teal hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : recentDiagnostics.length === 0 ? (
              <p className="font-urbanist text-sm text-muted-foreground">No diagnostic submissions yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentDiagnostics.map((row) => (
                  <li key={row.id} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                    <div className="min-w-0">
                      <Link
                        to={`/admin/companies/${row.id}`}
                        className="truncate font-urbanist text-sm font-medium text-rellia-teal hover:underline"
                      >
                        {row.company_name}
                      </Link>
                      <p className="truncate font-urbanist text-xs text-muted-foreground">
                        {row.name} · {formatAdminDate(row.created_at)}
                      </p>
                    </div>
                    <Badge variant="outline" className={cn("shrink-0", statusBadgeClass(row.status ?? "New"))}>
                      {row.status ?? "New"}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      </ScrollReveal>

      <ScrollReveal variant="ctaReveal" delay={0.17} hold={showSplash}>
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <Link to="/admin/team" className={adminOverviewLinkBoxClass}>
          <Users className="h-9 w-9 shrink-0 text-rellia-teal" aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-host-grotesk text-lg font-semibold text-foreground dark:text-white">Team</p>
              {!teamQuery.isLoading && onlineNowCount > 0 ? (
                <span className={adminOnlineBadgeClass}>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                  {onlineNowCount} Online
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 font-urbanist text-base text-muted-foreground">
              {teamQuery.isLoading ? "Loading…" : `${teamCount} dashboard ${teamCount === 1 ? "account" : "accounts"}`}
            </p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        </Link>

        <Link to="/admin/help" className={adminOverviewLinkBoxClass}>
          <CircleHelp className="h-9 w-9 shrink-0 text-rellia-teal" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="font-host-grotesk text-lg font-semibold text-foreground dark:text-white">Help</p>
            <p className="mt-0.5 font-urbanist text-base text-muted-foreground">
              Documentation, tools, and dashboard guides
            </p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        </Link>
      </div>
      </ScrollReveal>
      </div>
    </div>
  )
}

export default AdminOverviewPage
