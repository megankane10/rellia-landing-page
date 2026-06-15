import { useState, useMemo, useCallback, useEffect } from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, ChevronLeft, ChevronRight, AlertCircle, CalendarDays, CircleHelp, FileEdit, Inbox, Stethoscope, Users, TrendingUp, type LucideIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useAuth } from "@/context/AuthContext"
import { fetchAdminTeam } from "@/lib/adminApi"
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
  formatPercentChange,
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
import { cmsContentQueryKey, fetchCmsContentQueue, isCmsContentEnabled } from "@/lib/adminSanityContent"
import { formatAdminDate, isActiveSubmissionStatus, statusBadgeClass } from "@/lib/adminSubmissionStatus"
import { Badge } from "@/components/ui/badge"
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
  border: "1px solid rgba(0,0,0,0.08)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  fontFamily: "Urbanist",
  fontSize: "11px",
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
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 font-urbanist text-xs">
    {rows.filter((row) => row.value > 0).map((row) => (
      <div key={row.name} className="flex max-w-full items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: row.fill }} />
        <span className="truncate font-semibold text-slate-700">{row.name}</span>
        <span className="shrink-0 text-slate-400">({row.value})</span>
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
            <Tooltip
              formatter={(value: number | string, name: string) => [
                `${value} (${tooltipRows.find((row) => row.name === name)?.pct ?? 0}%)`,
                name,
              ]}
              wrapperStyle={{ zIndex: 50 }}
              contentStyle={PIE_TOOLTIP_STYLE}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="pointer-events-none absolute z-0 flex flex-col items-center justify-center text-center">
        <span className="font-urbanist text-[9px] font-semibold uppercase tracking-wider text-slate-500">
          {centerLabel}
        </span>
        <span className="mt-0.5 font-host-grotesk text-xl font-bold leading-none text-slate-800">
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
  changeCompare?: string
  href?: string
  loading?: boolean
}

const adminStatCardSurfaceClass = cn(
  "overflow-hidden rounded-xl",
  adminSelectedItemSurfaceOnLightClass,
)

const adminOverviewLinkBoxClass = cn(
  "flex min-h-[5.75rem] min-w-0 w-full items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors",
  "hover:border-rellia-teal/25 hover:bg-rellia-mint/5",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
)

const adminOverviewCardTitleClass = "font-host-grotesk text-xl"
const adminOverviewCardTitleWithIconClass = "flex items-center gap-2.5 font-host-grotesk text-xl"
const adminOverviewCardTitleIconClass = "h-5 w-5 shrink-0 text-rellia-teal"
const adminOverviewCardDescriptionClass = "font-urbanist text-sm"
const adminOverviewPieSectionTitleClass = "font-host-grotesk text-sm font-bold"
const adminOverviewPieSectionIconClass = "h-5 w-5 shrink-0"

const StatCard = ({ label, value, icon: Icon, changePct, changeCompare, href, loading }: StatCardProps) => {
  const changeLabel = formatPercentChange(changePct ?? null)
  const changeTone =
    changePct === null || changePct === 0
      ? "text-rellia-teal/80"
      : changePct > 0
        ? "text-emerald-800"
        : "text-amber-800"

  const body = (
    <Card
      className={cn(
        "flex h-full min-w-0 flex-row items-stretch bg-transparent text-card-foreground",
        adminStatCardSurfaceClass,
        href && "transition-[background-color,border-color] duration-150 hover:!bg-rellia-mint/25 hover:!border-rellia-teal/50",
      )}
    >
      <div className="flex shrink-0 items-center self-stretch py-5 pl-5 pr-8">
        <Icon className="h-14 w-14 text-rellia-teal" strokeWidth={1.5} aria-hidden />
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3 py-5 pr-5">
        <div className="min-w-0">
          {loading ? (
            <Skeleton className="h-10 w-20 rounded-lg bg-rellia-mint/25" />
          ) : (
            <>
              <p className="font-host-grotesk text-4xl font-bold tabular-nums leading-none text-rellia-teal sm:text-[2.75rem]">
                {value}
              </p>
              <p className="mt-2 font-urbanist text-base font-medium text-rellia-teal">{label}</p>
            </>
          )}
        </div>
        {!loading && changePct !== undefined ? (
          <div className="shrink-0 text-right">
            <span className={cn("font-urbanist text-base font-semibold tabular-nums", changeTone)}>
              {changeLabel}
            </span>
            {changeCompare ? (
              <p className="mt-0.5 font-urbanist text-sm leading-tight text-rellia-teal/70">
                {changeCompare}
              </p>
            ) : null}
          </div>
        ) : null}
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
  const [splashComplete, setSplashComplete] = useState(!wantsWelcome)
  const showSplash = wantsWelcome && !splashComplete
  const token = session?.access_token ?? ""
  const displayName = getAdminDisplayName(user)
  const pageTitle = welcomeBackTitle(displayName, user?.email)
  const welcomeFirstName =
    previewName ||
    welcomeState?.firstName?.trim() ||
    getAdminFirstName(displayName, user?.email)

  const handleSplashComplete = useCallback(() => {
    setSplashComplete(true)
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
    queryKey: cmsContentQueryKey(),
    queryFn: fetchCmsContentQueue,
    enabled: isCmsContentEnabled(),
    staleTime: 60_000,
  })
  const teamQuery = useQuery({
    queryKey: ["admin-team", token],
    queryFn: () => fetchAdminTeam(token),
    enabled: Boolean(token),
    staleTime: 60_000,
  })
  const loading = contactsQuery.isLoading || diagnosticsQuery.isLoading
  const contacts = contactsQuery.data ?? []
  const diagnostics = diagnosticsQuery.data ?? []
  const trend = buildLastNDaysTrend(contacts, diagnostics, 7, weekOffset)

  // Filtered status breakdown logic
  const filteredContacts = useMemo(() => {
    if (statusFilter === "survey") return []
    if (selectedStage !== "all") return [] // Exclude contacts when filtering by startup level
    return contacts
  }, [contacts, statusFilter, selectedStage])

  const filteredDiagnostics = useMemo(() => {
    if (statusFilter === "web") return []
    let list = diagnostics
    if (selectedStage !== "all") {
      list = list.filter((d) => d.stage === selectedStage)
    }
    return list
  }, [diagnostics, statusFilter, selectedStage])

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

  const newCount = useMemo(() => statusBreakdown.find((r) => r.status === "New")?.count ?? 0, [statusBreakdown])
  const resolvedCount = useMemo(() => statusBreakdown.find((r) => r.status === "Resolved")?.count ?? 0, [statusBreakdown])

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
        titleClassName="text-3xl font-semibold leading-tight md:text-4xl md:leading-tight"
      />
      </ScrollReveal>

      <ScrollReveal variant="ctaReveal" delay={0.05} hold={showSplash}>
      <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Needs attention"
          icon={AlertCircle}
          value={unresolved}
          changePct={unresolvedChangePct}
          changeCompare="vs prior 7 days"
          href="/admin/inbox"
          loading={loading}
        />
        <StatCard
          label="Submissions this week"
          icon={CalendarDays}
          value={weekCount}
          changePct={weekChangePct}
          changeCompare="vs prior 7 days"
          loading={loading}
        />
        <StatCard
          label="Unpublished drafts"
          icon={FileEdit}
          value={isCmsContentEnabled() ? draftCount : "—"}
          href="/admin/drafts"
          loading={isCmsContentEnabled() && draftsQuery.isLoading}
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
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50"
                aria-label="Previous week"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="min-w-0 flex-1 text-center font-urbanist text-sm font-semibold text-slate-700 sm:min-w-[10rem] sm:flex-none">
                {getWeekRangeLabel(weekOffset)}
              </span>
              <button
                onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
                disabled={weekOffset === 0}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50"
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
                  <ChartTooltip content={<ChartTooltipContent />} />
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
            <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50/80 p-1 w-fit">
              {(["all", "web", "survey"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setStatusFilter(mode)}
                  className={cn(
                    "rounded-lg px-3.5 py-2 font-urbanist text-sm font-semibold transition-all",
                    statusFilter === mode
                      ? "bg-rellia-teal text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
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
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2">
            <div>
              <CardTitle className={adminOverviewCardTitleClass}>Level Distribution</CardTitle>
              <CardDescription className={adminOverviewCardDescriptionClass}>Diagnostic survey stages</CardDescription>
            </div>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="h-10 min-w-[9rem] rounded-xl border border-slate-200 bg-white px-3.5 font-urbanist text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rellia-teal w-full sm:w-auto"
            >
              <option value="all">All Levels</option>
              {allStages.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
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
          <CardHeader className="pb-2">
            <CardTitle className={adminOverviewCardTitleClass}>Strengths & Weaknesses</CardTitle>
            <CardDescription className={adminOverviewCardDescriptionClass}>Top capabilities and growth gaps based on diagnostic responses</CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-[360px] min-w-0 flex-1 flex-col gap-4 pt-2 pb-6 md:flex-row">
            <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-emerald-100/40 bg-emerald-50/20 p-4">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className={cn(adminOverviewPieSectionIconClass, "text-emerald-600")} aria-hidden />
                <p className={cn(adminOverviewPieSectionTitleClass, "text-emerald-950")}>Top Strengths</p>
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

            <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-amber-100/40 bg-amber-50/20 p-4">
              <div className="mb-3 flex items-center gap-2">
                <AlertCircle className={cn(adminOverviewPieSectionIconClass, "text-amber-600")} aria-hidden />
                <p className={cn(adminOverviewPieSectionTitleClass, "text-amber-950")}>Top Weaknesses</p>
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
                    <Badge variant="outline" className={cn("shrink-0 border-0", statusBadgeClass(row.status ?? "New"))}>
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
                    <Badge variant="outline" className={cn("shrink-0 border-0", statusBadgeClass(row.status ?? "New"))}>
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
            <p className="font-host-grotesk text-lg font-semibold">Team</p>
            <p className="mt-0.5 font-urbanist text-base text-muted-foreground">
              {teamQuery.isLoading ? "Loading…" : `${teamCount} dashboard ${teamCount === 1 ? "account" : "accounts"}`}
            </p>
          </div>
          <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        </Link>

        <Link to="/admin/help" className={adminOverviewLinkBoxClass}>
          <CircleHelp className="h-9 w-9 shrink-0 text-rellia-teal" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="font-host-grotesk text-lg font-semibold">Help</p>
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
