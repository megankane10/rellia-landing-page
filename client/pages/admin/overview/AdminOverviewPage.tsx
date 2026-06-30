import { useState, useMemo, useCallback, useEffect, useId, useRef, type ComponentProps, type ReactNode } from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, Bell, ChartPie, ChevronLeft, ChevronRight, AlertCircle, CircleHelp, Inbox, Stethoscope, Users, TrendingUp, type LucideIcon } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useAuth } from "@/context/AuthContext"
import { useAdminTheme } from "@/context/AdminThemeContext"
import { fetchAdminTeam } from "@/lib/adminApi"
import { isAdminMemberOnlineNow, adminOnlineBadgeClass } from "@/lib/adminPresence"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import AdminSelectFilter from "@/components/admin/AdminSelectFilter"
import { adminSelectedItemSurfaceOnLightClass } from "@/components/admin/adminSidebarRail"
import AdminSignupWelcomeSplash from "@/components/admin/AdminSignupWelcomeSplash"
import ScrollReveal from "@/components/ScrollReveal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import {
  contactDisplayName,
  contactTypeLabel,
  fetchContactSubmissions,
  fetchDiagnosticSubmissions,
  type CompanyProfileRow,
  type ContactRow,
} from "@/lib/adminSubmissions"
import {
  buildLastNDaysPendingTrend,
  buildSubmissionTrend,
  buildStageChartFromDiagnostics,
  buildStatusBreakdown,
  countInboxSubmissionsToday,
  countSubmissionsBetweenDays,
  countUnresolved,
  formatTodaySnapshotMessage,
  getPendingSparklineYMax,
  getSubmissionTrendRangeLabel,
  getSubmissionTrendTitle,
  percentChange,
  type SubmissionTrendPeriod,
  type SubmissionSourceFilter,
  type DaySubmissionCount,
  type TodayInboxSnapshot,
} from "@/lib/adminOverview"
import {
  adminUserHasSeenWelcomeSplash,
  adminUserShouldSeeWelcomeSplash,
  getAdminDisplayName,
  getAdminFirstName,
  markAdminWelcomeSplashSeen,
} from "@/lib/adminUserProfile"
import {
  buildCmsEditsSparkline,
  cmsRecentEditsQueryKey,
  fetchCmsRecentEditsForOverview,
  formatCmsLastPublishHeadline,
  getCmsLastPublishSubtitle,
  cmsLastPublishSubtitleAria,
  type CmsLastPublishSubtitle,
  isCmsContentEnabled,
} from "@/lib/adminSanityContent"
import {
  formatAdminDate,
  isActiveSubmissionStatus,
  matchesStatusFilter,
  sortOverviewRecentSubmissions,
  SUBMISSION_STATUS_OPTIONS,
  type SubmissionStatus,
  type StatusFilterValue,
} from "@/lib/adminSubmissionStatus"
import AdminSubmissionStatusBadge from "@/components/admin/AdminSubmissionStatusBadge"
import AdminRecordList, { type AdminRecordField } from "@/components/admin/AdminRecordList"
import { type AdminTableColumn } from "@/components/admin/AdminDataTable"
import { adminChartTooltipClass, adminHighlightedSurfaceClass, adminInteractiveLinkArrowClass, adminInteractiveLinkTitleClass, adminOverviewArrowChipClass, getAdminPieTooltipStyles } from "@/components/admin/adminThemeClasses"
import { prefersReducedThemeMotion } from "@/lib/adminThemeTransition"
import { cn } from "@/lib/utils"

const CHART_COLORS = {
  new: "hsl(199 89% 48%)",
  progress: "hsl(25 95% 53%)",
  resolved: "hsl(142 76% 36%)",
  drafts: "hsl(346 78% 52%)",
}

/** Web forms + surveys — shared by top-card sparklines and submissions trend chart */
const SUBMISSION_SERIES_COLORS = {
  contacts: {
    light: "hsl(196 67% 16%)",
    dark: "hsl(175 42% 73%)",
  },
  diagnostics: {
    light: "hsl(210 88% 46%)",
    dark: "hsl(205 95% 68%)",
  },
} as const

type SubmissionSeriesKey = keyof typeof SUBMISSION_SERIES_COLORS

const SERIES_CHART_COLORS = {
  ...SUBMISSION_SERIES_COLORS,
  drafts: {
    light: CHART_COLORS.drafts,
    dark: "hsl(346 90% 78%)",
  },
  progress: {
    light: CHART_COLORS.progress,
    dark: "hsl(25 95% 62%)",
  },
  resolved: {
    light: CHART_COLORS.resolved,
    dark: "hsl(142 70% 52%)",
  },
} as const

type SparklineSeries = keyof typeof SERIES_CHART_COLORS

const seriesColorFor = (series: SparklineSeries, theme: "light" | "dark") =>
  SERIES_CHART_COLORS[series][theme]

/** Low-opacity area fills — visible tint without overpowering the stroke */
const AREA_FILL_OPACITY = {
  contacts: { top: 0.36 },
  diagnostics: { top: 0.4 },
  sparkline: { top: 0.46, bottom: 0.14 },
} as const

const areaFillGradientStops = (
  color: string,
  opacity: { top: number; bottom: number },
) => (
  <>
    <stop offset="0%" stopColor={color} stopOpacity={opacity.top} />
    <stop offset="100%" stopColor={color} stopOpacity={opacity.bottom} />
  </>
)

/** Trend chart: fade to transparent at baseline so overlaps read as blended layers */
const trendAreaFillGradientStops = (color: string, topOpacity: number) => (
  <>
    <stop offset="0%" stopColor={color} stopOpacity={topOpacity} />
    <stop offset="45%" stopColor={color} stopOpacity={topOpacity * 0.45} />
    <stop offset="78%" stopColor={color} stopOpacity={topOpacity * 0.12} />
    <stop offset="100%" stopColor={color} stopOpacity={0} />
  </>
)

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
  contacts: { label: "Web forms", theme: SUBMISSION_SERIES_COLORS.contacts },
  diagnostics: { label: "Surveys", theme: SUBMISSION_SERIES_COLORS.diagnostics },
} satisfies import("@/components/ui/chart").ChartConfig

const TREND_CHART_MARGIN = { top: 12, right: 8, left: 0, bottom: 4 }
const TREND_CHART_HEIGHT_CLASS = "aspect-auto h-[220px] w-full min-w-0 sm:h-[268px] sm:min-w-[280px]"

const adminOverviewChartLegendClass =
  "mt-2 flex shrink-0 flex-wrap justify-center gap-x-4 gap-y-1.5 pb-1 pt-3 font-urbanist text-sm"

const adminOverviewTrendLegendClass = cn(adminOverviewChartLegendClass, "mt-4 pt-4")

const TREND_PERIOD_OPTIONS: { id: SubmissionTrendPeriod; label: string }[] = [
  { id: "week", label: "Weekly" },
  { id: "month", label: "Monthly" },
  { id: "year", label: "Yearly" },
]

const adminOverviewFilterLabelClass =
  "font-urbanist text-sm font-semibold text-muted-foreground dark:text-slate-300"

const SUBMISSION_SOURCE_FILTER_OPTIONS: { value: SubmissionSourceFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "web", label: "Web" },
  { value: "survey", label: "Survey" },
]

const STAGE_STATUS_FILTER_OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: "all", label: "All statuses" },
  ...SUBMISSION_STATUS_OPTIONS.map((status) => ({ value: status, label: status })),
]

const CHART_X_AXIS_PROPS = {
  tickLine: false as const,
  axisLine: false as const,
  tickMargin: 6,
  fontSize: 11,
  interval: 0 as const,
  angle: -35,
  textAnchor: "end" as const,
  height: 40,
}

type PieSliceRow = { name: string; value: number; pct: number; fill: string }

const DONUT_CHART_SIZES = {
  default: { height: 200, innerRadius: 58, outerRadius: 78 },
  large: { height: 230, innerRadius: 68, outerRadius: 92 },
  column: { height: 268, innerRadius: 78, outerRadius: 108 },
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
  <div className={adminOverviewChartLegendClass}>
    {rows.filter((row) => row.value > 0).map((row) => (
      <div key={row.name} className="flex max-w-full items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: row.fill }} />
        <span className="truncate font-semibold text-foreground/80 dark:text-slate-100">{row.name}</span>
        <span className="shrink-0 text-muted-foreground dark:text-slate-300">({row.value})</span>
      </div>
    ))}
  </div>
)

const RadarCategoryLegend = ({ rows, seriesColor }: { rows: RadarRow[]; seriesColor: string }) => (
  <div className={adminOverviewChartLegendClass}>
    {rows
      .filter((row) => row.value > 0)
      .slice(0, 6)
      .map((row) => (
        <div key={row.name} className="flex max-w-full items-center gap-1.5">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: seriesColor }} />
          <span className="truncate font-semibold text-foreground/80 dark:text-slate-100">{row.name}</span>
          <span className="shrink-0 text-muted-foreground dark:text-slate-300">({row.value})</span>
        </div>
      ))}
  </div>
)

const TrendSeriesLegend = () => {
  const { resolvedTheme } = useAdminTheme()

  const visibleSeries = Object.entries(trendChartConfig) as [
    SubmissionSeriesKey,
    (typeof trendChartConfig)[SubmissionSeriesKey],
  ][]

  return (
    <div className={adminOverviewTrendLegendClass}>
      {visibleSeries.map(([key, item]) => (
        <div key={key} className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: seriesColorFor(key, resolvedTheme) }}
          />
          <span className="font-semibold text-foreground/80 dark:text-slate-100">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

const PIE_SLICE_FILL_OPACITY = 0.42

const PIE_FILTER_ANIMATION = {
  duration: 550,
  easing: "ease-in-out",
} as const

const PIE_ENTRANCE_ANIMATION = {
  duration: 900,
  easing: "ease-out",
} as const

/** Extra pause after section reveal before sparklines / charts animate */
const OVERVIEW_POST_REVEAL_SETTLE_MS = 140

/** Pause after loading finishes before swapping skeleton → animated data */
const OVERVIEW_LOAD_TO_DATA_MS = 120

/** Left-to-right reveal for overview sparklines and area charts */
const CHART_CLIP_REVEAL_MS = 800

const RADAR_ENTRANCE_ANIMATION = {
  duration: 850,
  easing: "ease-out",
} as const

const RADAR_FILTER_ANIMATION = {
  duration: 550,
  easing: "ease-in-out",
} as const

const OVERVIEW_CHART_IN_VIEW_OPTIONS: IntersectionObserverInit = {
  threshold: 0.2,
  rootMargin: "0px 0px -4% 0px",
}

const OVERVIEW_CHART_VISIBILITY_POLL_MAX_FRAMES = 120

/** True when the node intersects the viewport and is not hidden by opacity/visibility on itself or ancestors */
const isOverviewChartVisuallyVisible = (node: HTMLElement): boolean => {
  const rect = node.getBoundingClientRect()
  const vh = window.innerHeight
  if (rect.height <= 0 || rect.top >= vh || rect.bottom <= 0) return false

  let el: HTMLElement | null = node
  while (el) {
    const style = window.getComputedStyle(el)
    const opacity = Number.parseFloat(style.opacity)
    if (opacity < 0.98 || style.visibility === "hidden" || style.display === "none") {
      return false
    }
    el = el.parentElement
  }

  return true
}

/** Fire once when a chart box is scrolled into view and actually visible (after ScrollReveal, etc.) */
const useOverviewChartInView = () => {
  const reduceMotion = prefersReducedThemeMotion()
  const [inView, setInView] = useState(reduceMotion)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const pollFrameRef = useRef<number | null>(null)
  const settleTimerRef = useRef<number | null>(null)

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect()
      observerRef.current = null
      if (pollFrameRef.current !== null) {
        cancelAnimationFrame(pollFrameRef.current)
        pollFrameRef.current = null
      }
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current)
        settleTimerRef.current = null
      }
      if (!node || reduceMotion) return

      let revealed = false
      const reveal = () => {
        if (revealed) return
        revealed = true
        settleTimerRef.current = window.setTimeout(() => {
          setInView(true)
          settleTimerRef.current = null
        }, OVERVIEW_POST_REVEAL_SETTLE_MS)
        observerRef.current?.disconnect()
        observerRef.current = null
        if (pollFrameRef.current !== null) {
          cancelAnimationFrame(pollFrameRef.current)
          pollFrameRef.current = null
        }
      }

      const tryReveal = () => {
        if (isOverviewChartVisuallyVisible(node)) {
          reveal()
          return true
        }
        return false
      }

      const pollUntilVisible = (frame = 0) => {
        if (tryReveal()) return
        if (frame >= OVERVIEW_CHART_VISIBILITY_POLL_MAX_FRAMES) return
        pollFrameRef.current = requestAnimationFrame(() => pollUntilVisible(frame + 1))
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return
          if (tryReveal()) return
          pollUntilVisible()
        },
        OVERVIEW_CHART_IN_VIEW_OPTIONS,
      )

      observer.observe(node)
      observerRef.current = observer

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (tryReveal()) return
          pollUntilVisible()
        })
      })
    },
    [reduceMotion],
  )

  return { ref, inView, reduceMotion }
}

/** After section reveal + load, gate chart/sparkline motion so reveal finishes first */
const useOverviewDataAnimReady = (sectionInView: boolean, loading?: boolean) => {
  const reduceMotion = prefersReducedThemeMotion()
  const [ready, setReady] = useState(reduceMotion && sectionInView && !loading)

  useEffect(() => {
    if (reduceMotion) {
      setReady(sectionInView && !loading)
      return
    }
    if (!sectionInView || loading) {
      setReady(false)
      return
    }
    const timer = window.setTimeout(() => setReady(true), OVERVIEW_LOAD_TO_DATA_MS)
    return () => window.clearTimeout(timer)
  }, [sectionInView, loading, reduceMotion])

  return ready
}

const useOverviewClipReveal = (startWhen: boolean) => {
  const reduceMotion = prefersReducedThemeMotion()
  const [isRevealed, setIsRevealed] = useState(reduceMotion)

  useEffect(() => {
    if (reduceMotion || !startWhen) return

    const revealFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsRevealed(true))
    })

    return () => cancelAnimationFrame(revealFrame)
  }, [reduceMotion, startWhen])

  const revealStyle = reduceMotion
    ? undefined
    : {
        clipPath: isRevealed ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
        transition: isRevealed
          ? `clip-path ${CHART_CLIP_REVEAL_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
          : undefined,
        willChange: isRevealed ? ("clip-path" as const) : undefined,
      }

  return { revealStyle }
}

const pieSliceFill = (color: string, opacity = PIE_SLICE_FILL_OPACITY): string => {
  const trimmed = color.trim()
  if (trimmed.includes("/")) return trimmed
  if (trimmed.endsWith(")")) return trimmed.replace(/\)$/, ` / ${opacity})`)
  return trimmed
}

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
  const chartSize = DONUT_CHART_SIZES[size]
  const { resolvedTheme } = useAdminTheme()
  const pieTooltipStyles = getAdminPieTooltipStyles(resolvedTheme)
  const { ref, inView, reduceMotion } = useOverviewChartInView()
  const dataAnimReady = useOverviewDataAnimReady(inView)
  const [entranceDone, setEntranceDone] = useState(reduceMotion)
  const shouldShowPie = dataAnimReady || reduceMotion
  const shouldAnimatePie = dataAnimReady && !reduceMotion
  const pieAnimation = entranceDone ? PIE_FILTER_ANIMATION : PIE_ENTRANCE_ANIMATION

  useEffect(() => {
    if (!shouldAnimatePie) return
    const timer = window.setTimeout(() => setEntranceDone(true), PIE_ENTRANCE_ANIMATION.duration)
    return () => window.clearTimeout(timer)
  }, [shouldAnimatePie])

  return (
    <div
      ref={ref}
      className="relative flex w-full items-center justify-center"
      style={{ height: chartSize.height }}
    >
      <div className="absolute inset-0 z-10">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {shouldShowPie ? (
              <Pie
                key={shouldAnimatePie ? "pie-entrance" : "pie-static"}
                data={data}
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={chartSize.innerRadius}
                outerRadius={chartSize.outerRadius}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                strokeLinejoin="round"
                isAnimationActive={shouldAnimatePie}
                animationBegin={0}
                animationDuration={pieAnimation.duration}
                animationEasing={pieAnimation.easing}
              >
                {data.map((entry) => {
                  const isVisible = entry.value > 0
                  return (
                    <Cell
                      key={entry.name}
                      fill={isVisible ? pieSliceFill(entry.fill) : "transparent"}
                      stroke={isVisible ? entry.fill : "transparent"}
                      strokeWidth={isVisible ? 2 : 0}
                    />
                  )
                })}
              </Pie>
            ) : null}
            <RechartsTooltip
              formatter={(value: number | string, name: string) => [
                `${value} (${tooltipRows.find((row) => row.name === name)?.pct ?? 0}%)`,
                name,
              ]}
              labelStyle={pieTooltipStyles.labelStyle}
              itemStyle={pieTooltipStyles.itemStyle}
              wrapperStyle={{ zIndex: 50 }}
              contentStyle={pieTooltipStyles.contentStyle}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="pointer-events-none absolute z-0 flex flex-col items-center justify-center text-center">
        <span className="font-urbanist text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {centerLabel}
        </span>
        <span
          className={cn(
            "mt-1 font-host-grotesk font-bold leading-none text-foreground",
            size === "column" ? "text-4xl" : "text-2xl",
          )}
        >
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
  "group flex min-w-0 w-full items-center gap-4 rounded-2xl border border-border bg-card p-5 sm:min-h-[5.75rem]",
  adminOverviewClickableShadowClass,
  "hover:border-rellia-teal/25 hover:bg-rellia-mint/5 dark:hover:border-rellia-mint/30 dark:hover:bg-rellia-mint/10",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
)

const adminOverviewCardTitleClass =
  "flex min-h-10 min-w-0 items-center font-host-grotesk text-lg font-semibold leading-snug tracking-tight text-foreground dark:text-white sm:text-xl sm:leading-none"
const adminOverviewCardTitleWithIconClass =
  "flex min-h-10 min-w-0 items-center gap-2.5 font-host-grotesk text-lg font-semibold leading-snug tracking-tight text-foreground dark:text-white sm:text-xl sm:leading-none"
const adminOverviewCardTitleIconClass = "h-5 w-5 shrink-0 text-rellia-teal dark:text-rellia-mint"
/** Shared header shell — title row matches Diagnostic applicant stages positioning */
const adminOverviewCardHeaderClass = "space-y-0 p-6 pb-2"
const adminOverviewCardHeaderRowClass =
  "flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between"
const adminOverviewRecentCardHeaderRowClass =
  "flex min-w-0 flex-col items-stretch gap-3 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between"
const adminOverviewChartCardClass = "flex h-full min-w-0 flex-col overflow-hidden rounded-2xl"
const adminOverviewChartCardContentClass = "flex flex-1 flex-col pb-4 pt-0"
const adminOverviewChartRowCardContentClass = cn(
  adminOverviewChartCardContentClass,
  "min-h-[22rem] pt-5",
)
const adminOverviewCardFilterRowClass =
  "flex min-h-10 w-full min-w-0 flex-wrap items-center justify-start gap-2 sm:w-auto sm:flex-nowrap sm:justify-end sm:gap-3"
const adminOverviewPieSectionTitleClass = "font-host-grotesk text-sm font-bold text-foreground dark:text-white"
const adminOverviewPieSectionIconClass = "h-5 w-5 shrink-0"

const adminOverviewSegmentedControlClass =
  "flex gap-1 rounded-xl border border-border bg-muted/50 p-1 w-fit shrink-0"

type SegmentedOption<T extends string> = { value: T; label: string }

const AdminOverviewSegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
}) => (
  <div className={adminOverviewSegmentedControlClass} role="group" aria-label={ariaLabel}>
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={cn(
          "rounded-lg px-2.5 py-1.5 font-urbanist text-xs font-semibold transition-all sm:px-3.5 sm:py-2 sm:text-sm",
          value === option.value
            ? "bg-rellia-teal text-white shadow-sm dark:bg-rellia-mint/20 dark:text-rellia-mint"
            : cn(adminOverviewFilterLabelClass, "hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800/60 dark:hover:text-white"),
        )}
        aria-pressed={value === option.value}
      >
        {option.label}
      </button>
    ))}
  </div>
)

const adminOverviewTodaySnapshotPillClass = cn(
  "inline-flex max-w-full items-center gap-3 rounded-2xl px-4 py-2.5",
  adminHighlightedSurfaceClass,
)

const OverviewTodaySnapshotPill = ({ snapshot }: { snapshot: TodayInboxSnapshot }) => {
  const message = formatTodaySnapshotMessage(snapshot)
  const hasActivity = snapshot.total > 0

  return (
    <div
      className={adminOverviewTodaySnapshotPillClass}
      aria-label={`Inbox activity today: ${message}`}
    >
      <span className="relative inline-flex shrink-0" aria-hidden>
        <Bell className="h-5 w-5 text-muted-foreground" strokeWidth={2} />
        {hasActivity ? (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-rellia-teal ring-2 ring-rellia-mint/40 dark:bg-rellia-mint dark:ring-rellia-mint/25" />
        ) : null}
      </span>
      <span
        className={cn(
          "min-w-0 font-urbanist text-base font-semibold leading-snug",
          hasActivity ? "text-rellia-teal dark:text-rellia-mint" : "text-muted-foreground",
        )}
      >
        {message}
      </span>
    </div>
  )
}

const AdminOverviewFilterCardHeader = ({
  title,
  filters,
  centerSlot,
}: {
  title: string
  filters?: ReactNode
  /** Desktop: title left, centerSlot centered in card, filters right — same row as heading */
  centerSlot?: ReactNode
}) => (
  <CardHeader className={adminOverviewCardHeaderClass}>
    {centerSlot ? (
      <>
        <div className="flex min-w-0 flex-col gap-3 md:hidden">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <CardTitle className={adminOverviewCardTitleClass}>{title}</CardTitle>
            {filters ? <div className={adminOverviewCardFilterRowClass}>{filters}</div> : null}
          </div>
          <div className="flex min-h-10 w-full items-center justify-center">{centerSlot}</div>
        </div>
        <div className="hidden min-w-0 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
          <CardTitle className={cn(adminOverviewCardTitleClass, "justify-self-start")}>{title}</CardTitle>
          <div className="flex min-h-10 items-center justify-center justify-self-center">{centerSlot}</div>
          {filters ? (
            <div className={cn(adminOverviewCardFilterRowClass, "justify-self-end")}>{filters}</div>
          ) : (
            <span aria-hidden />
          )}
        </div>
      </>
    ) : (
      <div className={adminOverviewCardHeaderRowClass}>
        <CardTitle className={adminOverviewCardTitleClass}>{title}</CardTitle>
        {filters ? <div className={adminOverviewCardFilterRowClass}>{filters}</div> : null}
      </div>
    )}
  </CardHeader>
)

const overviewTopCardShellClass = cn(
  "group relative min-w-0 overflow-hidden rounded-2xl border bg-card p-5",
  "min-h-[10.5rem]",
  "shadow-[0_4px_20px_-12px_rgba(13,53,64,0.18)] transition-[background-color,border-color,box-shadow,transform] duration-150",
  "border-rellia-teal/22 hover:border-rellia-teal/35 hover:bg-rellia-mint/5 hover:shadow-[0_8px_28px_-14px_rgba(13,53,64,0.26)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/30",
)

const SPARKLINE_DAYS = 7

const matchesOverviewStageFilter = (stage: string | null | undefined, filter: string) => {
  if (filter === "all") return true
  return String(stage ?? "").trim().toLowerCase() === filter.trim().toLowerCase()
}

const aggregateDiagnosticCategoryCounts = (
  profiles: CompanyProfileRow[],
  selectedStage: string,
  field: "top3_strengths" | "top3_weaknesses",
) => {
  const counts: Record<string, number> = {}

  profiles.forEach((profile) => {
    if (!matchesOverviewStageFilter(profile.stage, selectedStage)) return

    const items = profile.diagnostic_response?.[field]
    if (!Array.isArray(items)) return

    items.forEach((item) => {
      const category = item?.category
      if (!category) return
      counts[category] = (counts[category] || 0) + 1
    })
  })

  return counts
}

const mapCategoryCountsToRadarRows = (
  counts: Record<string, number>,
  palette: string[],
) =>
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([category, value], idx) => ({
      name: category,
      value,
      fill: palette[idx % palette.length],
    }))

/** Gentle curves at data points instead of sharp linear segments */
const OVERVIEW_CHART_CURVE = "monotone" as const

const OverviewSparkline = ({
  values,
  color = SUBMISSION_SERIES_COLORS.contacts.light,
  startAnimation = false,
}: {
  values: number[]
  color?: string
  startAnimation?: boolean
}) => {
  const gradientId = useId().replace(/:/g, "")
  const { revealStyle } = useOverviewClipReveal(startAnimation)
  const chartData = values.map((value, index) => ({ index, value }))
  const yMax = getPendingSparklineYMax(values)

  return (
    <div className="h-14 w-full min-w-0 overflow-hidden" aria-hidden>
      <div className="h-full w-full overflow-hidden" style={revealStyle}>
        <ResponsiveContainer width="100%" height="100%" minWidth={1}>
          <AreaChart data={chartData} margin={{ top: 4, right: 2, left: 2, bottom: 3 }}>
            <XAxis dataKey="index" type="number" domain={["dataMin", "dataMax"]} hide />
            <YAxis hide domain={[0, yMax]} padding={{ top: 2, bottom: 3 }} />
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                {areaFillGradientStops(color, AREA_FILL_OPACITY.sparkline)}
              </linearGradient>
            </defs>
            <Area
              type={OVERVIEW_CHART_CURVE}
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              isAnimationActive={false}
              baseValue={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

type OverviewTrendAreaChartProps = {
  data: DaySubmissionCount[]
  yMax: number
  xAxisProps: ComponentProps<typeof XAxis>
}

const OverviewTrendAreaChart = ({ data, yMax, xAxisProps }: OverviewTrendAreaChartProps) => {
  const { ref, inView } = useOverviewChartInView()
  const dataAnimReady = useOverviewDataAnimReady(inView)
  const { revealStyle } = useOverviewClipReveal(dataAnimReady)

  return (
    <div ref={ref} className="min-w-0 w-full overflow-x-auto">
      <div className="overflow-hidden" style={revealStyle}>
        <ChartContainer config={trendChartConfig} className={TREND_CHART_HEIGHT_CLASS}>
          <AreaChart data={data} margin={TREND_CHART_MARGIN}>
            <defs>
              <linearGradient id="trendFillContacts" x1="0" y1="0" x2="0" y2="1">
                {trendAreaFillGradientStops("var(--color-contacts)", AREA_FILL_OPACITY.contacts.top)}
              </linearGradient>
              <linearGradient id="trendFillDiagnostics" x1="0" y1="0" x2="0" y2="1">
                {trendAreaFillGradientStops("var(--color-diagnostics)", AREA_FILL_OPACITY.diagnostics.top)}
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" {...xAxisProps} />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={28}
              fontSize={11}
              domain={[0, yMax]}
            />
            <ChartTooltip content={<ChartTooltipContent className={adminChartTooltipClass} />} />
            <Area
              type={OVERVIEW_CHART_CURVE}
              dataKey="contacts"
              stroke="var(--color-contacts)"
              fill="url(#trendFillContacts)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
              baseValue={0}
              isAnimationActive={false}
            />
            <Area
              type={OVERVIEW_CHART_CURVE}
              dataKey="diagnostics"
              stroke="var(--color-diagnostics)"
              fill="url(#trendFillDiagnostics)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
              baseValue={0}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}

type RadarRow = { name: string; value: number; fill: string }

type RadarChartDatum = {
  category: string
  count: number
  fill: string
}

const toRadarChartRows = (rows: RadarRow[], limit = 6): RadarChartDatum[] =>
  rows.slice(0, limit).map((row) => ({
    category: row.name,
    count: row.value,
    fill: row.fill,
  }))

const RADAR_CHART_MIN_HEIGHT_CLASS = "min-h-[320px]"

type RadarLabelLayout = "compact" | "comfortable" | "spacious"

const getRadarLabelLayout = (): RadarLabelLayout => {
  if (typeof window === "undefined") return "comfortable"
  const width = window.innerWidth
  if (width < 768) return "compact"
  if (width < 1024) return "comfortable"
  return "spacious"
}

const useRadarLabelLayout = () => {
  const [layout, setLayout] = useState<RadarLabelLayout>(getRadarLabelLayout)

  useEffect(() => {
    const onChange = () => setLayout(getRadarLabelLayout())
    window.addEventListener("resize", onChange)
    onChange()
    return () => window.removeEventListener("resize", onChange)
  }, [])

  return layout
}

const RADAR_LABEL_WRAP: Record<
  RadarLabelLayout,
  { maxCharsPerLine: number; maxLines: number; fontSize: number; lineHeight: number }
> = {
  compact: { maxCharsPerLine: 10, maxLines: 3, fontSize: 11, lineHeight: 13 },
  comfortable: { maxCharsPerLine: 12, maxLines: 3, fontSize: 12, lineHeight: 14 },
  spacious: { maxCharsPerLine: 15, maxLines: 2, fontSize: 13, lineHeight: 16 },
}

const expandRadarLabelWords = (label: string, maxCharsPerLine: number) =>
  label.split(/\s+/).flatMap((word) => {
    if (word.length <= maxCharsPerLine) return [word]
    if (!word.includes("-")) return [word]

    const segments = word.split("-")
    return segments.map((segment, index) =>
      index < segments.length - 1 ? `${segment}-` : segment,
    )
  })

const wrapRadarLabelLines = (label: string, maxCharsPerLine: number, maxLines: number) => {
  const words = expandRadarLabelWords(label.trim(), maxCharsPerLine)
  if (words.length === 0) return []

  const lines: string[] = []
  let current = ""

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index]
    const candidate = current ? `${current} ${word}` : word

    if (candidate.length <= maxCharsPerLine) {
      current = candidate
      continue
    }

    if (current) {
      lines.push(current)
      current = ""
    }

    if (lines.length >= maxLines - 1) {
      lines.push([word, ...words.slice(index + 1)].join(" "))
      return lines.slice(0, maxLines)
    }

    if (word.length > maxCharsPerLine) {
      let rest = word
      while (rest.length > maxCharsPerLine && lines.length < maxLines - 1) {
        lines.push(rest.slice(0, maxCharsPerLine))
        rest = rest.slice(maxCharsPerLine)
      }
      current = rest
      continue
    }

    current = word
  }

  if (current) lines.push(current)
  return lines.slice(0, maxLines)
}

const ADMIN_OVERVIEW_CHART_EMPTY_MESSAGE = "No data found."

const AdminOverviewChartEmptyState = ({ className }: { className?: string }) => (
  <div
    className={cn("flex flex-col items-center justify-center px-4 py-10 text-center", className)}
    role="status"
    aria-live="polite"
  >
    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground">
      <ChartPie className="h-7 w-7 text-rellia-teal dark:text-rellia-mint" aria-hidden />
    </span>
    <p className="mt-3 max-w-[16rem] font-urbanist text-base leading-snug text-muted-foreground">
      {ADMIN_OVERVIEW_CHART_EMPTY_MESSAGE}
    </p>
  </div>
)

const RADAR_CHART_LAYOUT = {
  outerRadius: "78%",
  margin: { top: 40, right: 72, bottom: 40, left: 72 },
} as const

const RADAR_CHART_LAYOUT_BY_LABEL: Record<
  RadarLabelLayout,
  { outerRadius: string; margin: { top: number; right: number; bottom: number; left: number } }
> = {
  compact: {
    outerRadius: "58%",
    margin: { top: 44, right: 62, bottom: 44, left: 62 },
  },
  comfortable: {
    outerRadius: "70%",
    margin: { top: 36, right: 64, bottom: 36, left: 64 },
  },
  spacious: RADAR_CHART_LAYOUT,
}

const getRadarDomainMax = (maxCount: number) => {
  if (maxCount <= 0) return 1
  const padded = Math.ceil(maxCount * 1.12)
  return Math.max(padded, maxCount + 1)
}

const RadarCategoryTick = ({
  x = 0,
  y = 0,
  payload,
  textAnchor,
  layout = "comfortable",
}: {
  x?: number
  y?: number
  payload?: { value?: string }
  textAnchor?: "start" | "middle" | "end" | "inherit"
  layout?: RadarLabelLayout
}) => {
  const label = payload?.value ?? ""
  if (!label) return null

  const { maxCharsPerLine, maxLines, fontSize, lineHeight } = RADAR_LABEL_WRAP[layout]
  const lines = wrapRadarLabelLines(label, maxCharsPerLine, maxLines)
  const startY = y - ((lines.length - 1) * lineHeight) / 2

  return (
    <text
      x={x}
      y={startY}
      textAnchor={textAnchor}
      fill="hsl(var(--foreground))"
      fontSize={fontSize}
      fontWeight={600}
      fontFamily="Urbanist, sans-serif"
    >
      {lines.map((line, index) => (
        <tspan key={`${line}-${index}`} x={x} dy={index === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

const CategoryRadarChart = ({
  rows,
  color,
  loading,
  className,
  chartKey,
}: {
  rows: RadarRow[]
  color: string
  loading?: boolean
  className?: string
  chartKey?: string
}) => {
  const labelLayout = useRadarLabelLayout()
  const radarLayout = RADAR_CHART_LAYOUT_BY_LABEL[labelLayout]
  const { ref, inView, reduceMotion } = useOverviewChartInView()
  const dataAnimReady = useOverviewDataAnimReady(inView, loading)
  const chartInstanceKey = chartKey ?? "default"
  const [lastAnimatedKey, setLastAnimatedKey] = useState<string | null>(reduceMotion ? chartInstanceKey : null)
  const radarData = useMemo(() => toRadarChartRows(rows), [rows])
  const radarChartConfig = {
    count: { label: "Startups", color },
  }
  const isFilterTransition = lastAnimatedKey !== null && lastAnimatedKey !== chartInstanceKey
  const radarAnimation = isFilterTransition ? RADAR_FILTER_ANIMATION : RADAR_ENTRANCE_ANIMATION
  const shouldAnimate =
    dataAnimReady && !reduceMotion && !loading && radarData.length > 0 && lastAnimatedKey !== chartInstanceKey

  useEffect(() => {
    if (!shouldAnimate) return
    const timer = window.setTimeout(() => setLastAnimatedKey(chartInstanceKey), radarAnimation.duration)
    return () => window.clearTimeout(timer)
  }, [shouldAnimate, chartInstanceKey, radarAnimation.duration])

  const content = loading ? (
    <Skeleton className={cn("h-full w-full rounded-xl", RADAR_CHART_MIN_HEIGHT_CLASS)} />
  ) : radarData.length === 0 ? (
    <AdminOverviewChartEmptyState className={cn("h-full w-full", RADAR_CHART_MIN_HEIGHT_CLASS)} />
  ) : (
    <ChartContainer
      config={radarChartConfig}
      className={cn("aspect-auto h-full w-full min-w-0", RADAR_CHART_MIN_HEIGHT_CLASS)}
    >
      <RadarChart
        key={chartKey}
        data={radarData}
        cx="50%"
        cy="50%"
        outerRadius={radarLayout.outerRadius}
        margin={radarLayout.margin}
      >
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="category"
          tick={(props) => <RadarCategoryTick {...props} layout={labelLayout} />}
          tickLine={false}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, getRadarDomainMax(Math.max(...radarData.map((row) => row.count), 1))]}
          tick={false}
          axisLine={false}
        />
        <Radar
          name="Startups"
          dataKey="count"
          stroke="var(--color-count)"
          fill="var(--color-count)"
          fillOpacity={0.28}
          strokeWidth={2}
          isAnimationActive={shouldAnimate}
          animationBegin={0}
          animationDuration={radarAnimation.duration}
          animationEasing={radarAnimation.easing}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className={adminChartTooltipClass}
              labelFormatter={(_, payload) => {
                const row = payload?.[0]?.payload as { category?: string } | undefined
                return row?.category ?? ""
              }}
            />
          }
        />
      </RadarChart>
    </ChartContainer>
  )

  return (
    <div ref={ref} className={cn("flex h-full w-full min-w-0 flex-col", className)}>
      <div className="min-h-0 flex-1">{content}</div>
      {!loading && rows.length > 0 ? <RadarCategoryLegend rows={rows} seriesColor={color} /> : null}
    </div>
  )
}

const overviewTopCardSkeletonToneClass = {
  contacts: {
    value: "bg-[hsl(196_67%_16%/0.28)] dark:bg-[hsl(175_42%_73%/0.22)]",
    sub: "bg-[hsl(196_67%_16%/0.2)] dark:bg-[hsl(175_42%_73%/0.16)]",
  },
  diagnostics: {
    value: "bg-[hsl(210_88%_46%/0.28)] dark:bg-[hsl(205_95%_68%/0.22)]",
    sub: "bg-[hsl(210_88%_46%/0.2)] dark:bg-[hsl(205_95%_68%/0.16)]",
  },
  sanity: {
    value: "bg-[hsl(346_78%_52%/0.28)] dark:bg-[hsl(346_90%_78%/0.22)]",
    sub: "bg-[hsl(346_78%_52%/0.2)] dark:bg-[hsl(346_90%_78%/0.16)]",
  },
} as const

const overviewTopCardSubtextClass =
  "mt-2.5 font-urbanist text-sm font-semibold leading-snug"

const getOverviewTopCardValueClass = (display: number | string) => {
  const label = String(display)
  if (label.length > 9) {
    return "text-3xl font-semibold leading-none sm:text-4xl"
  }
  return "text-[2.75rem] font-semibold leading-none"
}

const OverviewTopCardSubtext = ({
  children,
  isUnavailable,
  seriesAccentStyle,
}: {
  children: ReactNode
  isUnavailable: boolean
  seriesAccentStyle?: { color: string }
}) => (
  <p
    className={cn(overviewTopCardSubtextClass, isUnavailable && "text-muted-foreground")}
    style={seriesAccentStyle ? { color: seriesAccentStyle.color, opacity: 0.85 } : undefined}
  >
    {children}
  </p>
)

const CmsLastPublishSubtext = ({ subtitle }: { subtitle: CmsLastPublishSubtitle }) => {
  if (subtitle.kind === "plain") return <>{subtitle.text}</>

  return (
    <span className="block truncate">
      <span>{subtitle.documentName}</span>
      <span className="opacity-50">
        {" · "}
        {subtitle.typeLabel}
      </span>
    </span>
  )
}

const OverviewTopLinkCard = ({
  title,
  value,
  statusLabel,
  statusLabelAria,
  clearedStatusLabel,
  clearedValueLabel,
  sparklineValues,
  sparklineSeries = "contacts",
  href,
  loading,
  skeletonTone = "contacts",
  external = false,
}: {
  title: string
  value: number | string
  statusLabel: ReactNode
  statusLabelAria?: string
  clearedStatusLabel?: string
  /** Replaces the big pending count when the queue is clear (pending = 0). */
  clearedValueLabel?: string
  sparklineValues?: number[]
  sparklineSeries?: SparklineSeries
  href: string
  loading?: boolean
  skeletonTone?: keyof typeof overviewTopCardSkeletonToneClass
  external?: boolean
}) => {
  const { resolvedTheme } = useAdminTheme()
  const { ref, inView } = useOverviewChartInView()
  const dataAnimReady = useOverviewDataAnimReady(inView, loading)
  const skeletonToneClass = overviewTopCardSkeletonToneClass[skeletonTone]
  const isUnavailable = value === "—"
  const numericValue = typeof value === "number" ? value : null
  const isCleared = numericValue === 0 && !isUnavailable
  const showClearedCopy = isCleared && Boolean(clearedValueLabel)
  const displayValue = showClearedCopy ? clearedValueLabel : value
  const displayStatusLabel = isCleared ? (clearedStatusLabel ?? statusLabel) : statusLabel
  const seriesColor = seriesColorFor(sparklineSeries, resolvedTheme)
  const seriesAccentStyle = !isUnavailable ? { color: seriesColor } : undefined
  const valueSizeClass = getOverviewTopCardValueClass(displayValue)
  const isNumericHeadline = typeof displayValue === "number"

  const sparklineBase =
    sparklineValues && sparklineValues.length > 0
      ? sparklineValues
      : Array.from({ length: SPARKLINE_DAYS }, () => 0)

  const effectiveSparklineColor = seriesColor
  const cardStatusAria = showClearedCopy
    ? `${title}: ${clearedValueLabel}. ${typeof displayStatusLabel === "string" ? displayStatusLabel : statusLabelAria ?? ""}`.trim()
    : statusLabelAria ??
      (typeof displayStatusLabel === "string" ? displayStatusLabel : undefined)

  const cardBody = (
    <div ref={ref} className="flex min-h-[8rem] flex-col gap-3 sm:min-h-[8.5rem]">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 font-host-grotesk text-base font-semibold leading-snug text-foreground dark:text-white sm:text-lg">
          {title}
        </p>
        <span
          className={cn(adminOverviewArrowChipClass, "group-hover:-translate-y-[1px]")}
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
        <div className="min-w-0" aria-hidden>
          <Skeleton
            className={cn("h-10 w-24 rounded-2xl sm:h-11", skeletonToneClass.value)}
          />
          <Skeleton
            className={cn("mt-2.5 h-4 w-36 max-w-[75%] rounded-xl", skeletonToneClass.sub)}
          />
        </div>
      ) : (
        <>
          <div className="min-w-0">
            {isUnavailable ? (
              <p className="font-host-grotesk text-[2.75rem] font-semibold tabular-nums leading-none text-slate-500 dark:text-slate-400">
                —
              </p>
            ) : (
              <p
                className={cn(
                  "font-host-grotesk",
                  valueSizeClass,
                  isNumericHeadline && "tabular-nums",
                )}
                style={seriesAccentStyle}
              >
                {displayValue}
              </p>
            )}
            <OverviewTopCardSubtext
              isUnavailable={isUnavailable}
              seriesAccentStyle={seriesAccentStyle}
            >
              {displayStatusLabel}
            </OverviewTopCardSubtext>
          </div>
          {!isUnavailable ? (
            <OverviewSparkline
              values={sparklineBase}
              color={effectiveSparklineColor}
              startAnimation={dataAnimReady}
            />
          ) : null}
        </>
      )}
    </div>
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={overviewTopCardShellClass}
        aria-label={cardStatusAria ? `${title}: ${cardStatusAria}` : title}
      >
        {cardBody}
      </a>
    )
  }

  return (
    <Link to={href} className={overviewTopCardShellClass} aria-label={cardStatusAria ? `${title}: ${cardStatusAria}` : title}>
      {cardBody}
    </Link>
  )
}

const RECENT_SUBMISSION_MAX = 5
const RECENT_SUBMISSION_ROW_HEIGHT_REM = 4.25

const recentContactLinkClass =
  "font-urbanist text-base font-semibold text-rellia-teal hover:underline dark:text-rellia-mint"

const recentContactColumns: AdminTableColumn<ContactRow>[] = [
  {
    key: "name",
    header: "Name",
    cell: (row) => (
      <Link to={`/admin/contacts/${row.id}`} className={recentContactLinkClass}>
        {contactDisplayName(row)}
      </Link>
    ),
  },
  {
    key: "type",
    header: "Type",
    cell: (row) => <span className="text-muted-foreground">{contactTypeLabel(row)}</span>,
  },
  {
    key: "date",
    header: "Received",
    className: "whitespace-nowrap",
    cell: (row) => <span className="text-muted-foreground">{formatAdminDate(row.created_at)}</span>,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <AdminSubmissionStatusBadge status={(row.status ?? "New") as SubmissionStatus} />,
  },
]

const recentContactMobileFields: AdminRecordField<ContactRow>[] = [
  {
    label: "Name",
    value: (row) => (
      <Link to={`/admin/contacts/${row.id}`} className={recentContactLinkClass}>
        {contactDisplayName(row)}
      </Link>
    ),
  },
  { label: "Type", value: (row) => contactTypeLabel(row) },
  { label: "Received", value: (row) => formatAdminDate(row.created_at) },
  {
    label: "Status",
    value: (row) => <AdminSubmissionStatusBadge status={(row.status ?? "New") as SubmissionStatus} />,
  },
]

const recentDiagnosticColumns: AdminTableColumn<CompanyProfileRow>[] = [
  {
    key: "company",
    header: "Company",
    cell: (row) => (
      <Link to={`/admin/companies/${row.id}`} className={recentContactLinkClass}>
        {row.company_name}
      </Link>
    ),
  },
  {
    key: "contact",
    header: "Contact",
    cell: (row) => <span className="text-muted-foreground">{row.name}</span>,
  },
  {
    key: "date",
    header: "Received",
    className: "whitespace-nowrap",
    cell: (row) => <span className="text-muted-foreground">{formatAdminDate(row.created_at)}</span>,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <AdminSubmissionStatusBadge status={(row.status ?? "New") as SubmissionStatus} />,
  },
]

const recentDiagnosticMobileFields: AdminRecordField<CompanyProfileRow>[] = [
  {
    label: "Company",
    value: (row) => (
      <Link to={`/admin/companies/${row.id}`} className={recentContactLinkClass}>
        {row.company_name}
      </Link>
    ),
  },
  { label: "Contact", value: (row) => row.name },
  { label: "Received", value: (row) => formatAdminDate(row.created_at) },
  {
    label: "Status",
    value: (row) => <AdminSubmissionStatusBadge status={(row.status ?? "New") as SubmissionStatus} />,
  },
]

const AdminRecentSubmissionsCard = <T extends { id: string }>({
  title,
  titleIcon: TitleIcon,
  viewAllHref,
  loading,
  rows,
  pairedRowCount,
  emptyMessage,
  fillerMessage,
  columns,
  mobileFields,
}: {
  title: string
  titleIcon: LucideIcon
  viewAllHref: string
  loading?: boolean
  rows: T[]
  /** Match the taller sibling card so filler only appears when heights diverge. */
  pairedRowCount: number
  emptyMessage: string
  fillerMessage: string
  columns: AdminTableColumn<T>[]
  mobileFields: AdminRecordField<T>[]
}) => {
  const missingRowCount = Math.max(0, pairedRowCount - rows.length)
  const showFiller = missingRowCount > 0
  const fillerHeightRem = missingRowCount * RECENT_SUBMISSION_ROW_HEIGHT_REM
  const isFullyEmpty = pairedRowCount === 0 && rows.length === 0

  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl">
      <CardHeader className={adminOverviewCardHeaderClass}>
        <div className={adminOverviewRecentCardHeaderRowClass}>
          <CardTitle className={cn(adminOverviewCardTitleWithIconClass, "min-[380px]:min-w-0 min-[380px]:flex-1")}>
            <TitleIcon className={adminOverviewCardTitleIconClass} aria-hidden />
            {title}
          </CardTitle>
          <Link
            to={viewAllHref}
            className="inline-flex shrink-0 items-center gap-1 self-start font-urbanist text-sm text-rellia-teal hover:underline min-[380px]:self-center"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col px-0 pb-0 pt-0">
        {loading ? (
          <div className="space-y-3 px-6 pb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {rows.length > 0 ? (
              <div className="shrink-0 overflow-hidden [&_tbody_tr]:h-[4.25rem] [&_ul]:space-y-3 [&_ul]:px-6 [&_ul]:pb-3 [&_ul]:pt-0 md:[&_ul]:hidden">
                <AdminRecordList
                  rows={rows}
                  getRowKey={(row) => row.id}
                  columns={columns}
                  mobileFields={mobileFields}
                  tableClassName="w-full"
                />
              </div>
            ) : null}
            {isFullyEmpty ? (
              <div className="mx-6 mb-6 flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-border/80 bg-muted/15 px-4 py-8 text-center dark:bg-muted/10">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border/80 bg-card">
                  <TitleIcon className="h-7 w-7 text-rellia-teal dark:text-rellia-mint" aria-hidden strokeWidth={1.75} />
                </span>
                <p className="max-w-[16rem] font-urbanist text-base leading-snug text-muted-foreground">{emptyMessage}</p>
              </div>
            ) : null}
            {showFiller ? (
              <div
                style={{ height: `${fillerHeightRem}rem` }}
                className={cn(
                  "box-border flex w-full shrink-0 items-center justify-center gap-3 px-4 text-center",
                  rows.length > 0 && "hidden md:flex",
                  "flex-col md:flex-row md:px-6",
                  rows.length > 0
                    ? "border-t border-dashed border-border/80 bg-muted/15 dark:bg-muted/10"
                    : "mx-6 mb-6 rounded-xl border border-dashed border-border/80 bg-muted/15 dark:bg-muted/10",
                )}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground">
                  <TitleIcon className="h-5 w-5 text-rellia-teal dark:text-rellia-mint" aria-hidden strokeWidth={1.75} />
                </span>
                <p
                  className={cn(
                    "font-urbanist text-base leading-snug text-muted-foreground",
                    rows.length === 0 ? "max-w-[16rem]" : "max-w-[16rem] md:max-w-none md:flex-1 md:whitespace-nowrap md:text-left",
                  )}
                >
                  {rows.length === 0 ? emptyMessage : fillerMessage}
                </p>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
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
              "hover:!bg-rellia-mint/25 hover:!border-rellia-teal/28 dark:hover:!bg-rellia-mint/10 dark:hover:!border-rellia-mint/30",
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

  const [trendPeriod, setTrendPeriod] = useState<SubmissionTrendPeriod>("week")
  const [trendOffset, setTrendOffset] = useState(0)
  const [statusDonutSourceFilter, setStatusDonutSourceFilter] = useState<SubmissionSourceFilter>("all")
  const [stageStatusFilter, setStageStatusFilter] = useState<StatusFilterValue>("all")
  const [selectedStage, setSelectedStage] = useState<string>("all")

  const contactsQuery = useQuery({
    queryKey: ["admin-contact-submissions", "status-updated-at"],
    queryFn: fetchContactSubmissions,
  })
  const diagnosticsQuery = useQuery({
    queryKey: ["admin-company-profiles", "status-updated-at"],
    queryFn: fetchDiagnosticSubmissions,
  })
  const recentEditsQuery = useQuery({
    queryKey: cmsRecentEditsQueryKey(),
    queryFn: () => fetchCmsRecentEditsForOverview(token),
    enabled: isCmsContentEnabled() && Boolean(token),
    staleTime: 60_000,
    refetchInterval: 60_000,
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
  const trend = useMemo(
    () => buildSubmissionTrend(contacts, diagnostics, trendPeriod, trendOffset),
    [contacts, diagnostics, trendPeriod, trendOffset],
  )

  const trendChartMax = useMemo(() => {
    let max = 0
    for (const row of trend) {
      max = Math.max(max, row.contacts, row.diagnostics)
    }
    return Math.max(max, 1)
  }, [trend])

  const trendChartLoading = loading

  const trendXAxisProps = useMemo(() => {
    if (trendPeriod === "year") {
      return {
        ...CHART_X_AXIS_PROPS,
        angle: 0,
        textAnchor: "middle" as const,
        height: 36,
      }
    }
    if (trendPeriod === "month") {
      return {
        ...CHART_X_AXIS_PROPS,
        interval: "preserveStartEnd" as const,
        minTickGap: 14,
      }
    }
    return CHART_X_AXIS_PROPS
  }, [trendPeriod])

  const handleTrendPeriodChange = (period: SubmissionTrendPeriod) => {
    setTrendPeriod(period)
    setTrendOffset(0)
  }

  const filteredContacts = useMemo(() => {
    if (statusDonutSourceFilter === "survey") return []
    return contacts
  }, [contacts, statusDonutSourceFilter])

  const filteredDiagnostics = useMemo(() => {
    if (statusDonutSourceFilter === "web") return []
    return diagnostics
  }, [diagnostics, statusDonutSourceFilter])

  const statusBreakdown = useMemo(() => {
    return buildStatusBreakdown(filteredContacts, filteredDiagnostics)
  }, [filteredContacts, filteredDiagnostics])

  const recentContacts = sortOverviewRecentSubmissions(contacts, RECENT_SUBMISSION_MAX)
  const recentDiagnostics = sortOverviewRecentSubmissions(diagnostics, RECENT_SUBMISSION_MAX)
  const recentSubmissionPairCount = Math.max(recentContacts.length, recentDiagnostics.length)

  const unresolved = countUnresolved(contacts, diagnostics)
  const unresolvedWebForms = contacts.filter((row) =>
    isActiveSubmissionStatus(row.status as "New" | "In Progress" | "Resolved" | null),
  ).length
  const unresolvedDiagnostics = diagnostics.filter((row) =>
    isActiveSubmissionStatus(row.status as "New" | "In Progress" | "Resolved" | null),
  ).length
  const previousUnresolved = countSubmissionsBetweenDays(
    contacts.filter((row) => isActiveSubmissionStatus(row.status as "New" | "In Progress" | "Resolved" | null)),
    diagnostics.filter((row) => isActiveSubmissionStatus(row.status as "New" | "In Progress" | "Resolved" | null)),
    14,
    7,
  )
  const unresolvedChangePct = percentChange(unresolved, previousUnresolved)
  const recentPublishes = recentEditsQuery.data ?? []
  const latestPublishedEdit = recentPublishes[0]
  const lastPublishedAt = latestPublishedEdit?._updatedAt
  const cmsEditsSparkline = useMemo(
    () => buildCmsEditsSparkline(recentPublishes, SPARKLINE_DAYS),
    [recentPublishes],
  )
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

  const filteredStageDiagnostics = useMemo(
    () => diagnostics.filter((row) => matchesStatusFilter(row, stageStatusFilter)),
    [diagnostics, stageStatusFilter],
  )

  const stageChartData = useMemo(
    () => buildStageChartFromDiagnostics(filteredStageDiagnostics, STAGE_COLORS),
    [filteredStageDiagnostics],
  )

  const stageCenterValue = useMemo(
    () => stageChartData.reduce((sum, row) => sum + row.value, 0),
    [stageChartData],
  )

  const strengthsPieData = useMemo(() => {
    const palette = [
      "hsl(174 42% 35%)",
      "hsl(175 42% 73%)",
      "hsl(199 89% 48%)",
      "hsl(38 92% 50%)",
      "hsl(142 76% 36%)",
      "hsl(322 81% 43%)",
      "hsl(262 83% 58%)",
      "hsl(28 80% 52%)",
    ]

    return mapCategoryCountsToRadarRows(
      aggregateDiagnosticCategoryCounts(diagnostics, selectedStage, "top3_strengths"),
      palette,
    )
  }, [diagnostics, selectedStage])

  const gapsPieData = useMemo(() => {
    const palette = [
      "hsl(38 92% 50%)",
      "hsl(28 80% 52%)",
      "hsl(322 81% 43%)",
      "hsl(174 42% 35%)",
      "hsl(199 89% 48%)",
      "hsl(262 83% 58%)",
      "hsl(142 76% 36%)",
      "hsl(175 42% 73%)",
    ]

    return mapCategoryCountsToRadarRows(
      aggregateDiagnosticCategoryCounts(diagnostics, selectedStage, "top3_weaknesses"),
      palette,
    )
  }, [diagnostics, selectedStage])

  const webFormsSparkline = useMemo(
    () => buildLastNDaysPendingTrend(contacts, SPARKLINE_DAYS),
    [contacts],
  )

  const diagnosticsSparkline = useMemo(
    () => buildLastNDaysPendingTrend(diagnostics, SPARKLINE_DAYS),
    [diagnostics],
  )

  const displayLastPublishHeadline = !isCmsContentEnabled()
    ? "—"
    : lastPublishedAt
      ? formatCmsLastPublishHeadline(lastPublishedAt)
      : "None"
  const displayLastPublishSubtitle = useMemo((): CmsLastPublishSubtitle => {
    if (!isCmsContentEnabled()) return { kind: "plain", text: "Unavailable" }
    return getCmsLastPublishSubtitle(latestPublishedEdit, lastPublishedAt)
  }, [latestPublishedEdit, lastPublishedAt])

  const displayLastPublishStatus = useMemo(
    () => <CmsLastPublishSubtext subtitle={displayLastPublishSubtitle} />,
    [displayLastPublishSubtitle],
  )

  const displayLastPublishStatusAria = useMemo(
    () => cmsLastPublishSubtitleAria(displayLastPublishSubtitle),
    [displayLastPublishSubtitle],
  )

  const todaySnapshot = useMemo(
    (): TodayInboxSnapshot => countInboxSubmissionsToday(contacts, diagnostics),
    [contacts, diagnostics],
  )

  const topCardsLoading = loading
  const siteContentCardLoading = isCmsContentEnabled() && recentEditsQuery.isPending
  const chartSectionLoading = loading
  const radarSectionLoading = loading

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
        headingLevel="h2"
        title={
          <>
            Welcome back, {welcomeFirstName}{" "}
            <span className="text-muted-foreground dark:text-slate-400">
              — here&apos;s your overview
            </span>
          </>
        }
        showDivider={false}
        titleClassName="text-2xl font-semibold leading-tight md:text-4xl md:leading-tight"
        actions={
          topCardsLoading ? (
            <Skeleton className="h-12 w-52 rounded-2xl" aria-hidden />
          ) : (
            <OverviewTodaySnapshotPill snapshot={todaySnapshot} />
          )
        }
      />
      </ScrollReveal>

      <ScrollReveal variant="ctaReveal" delay={0.05} hold={showSplash}>
      <div className="grid min-w-0 grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <OverviewTopLinkCard
          title="Web forms"
          href="/admin/inbox?tab=contact"
          loading={topCardsLoading}
          skeletonTone="contacts"
          sparklineValues={webFormsSparkline}
          sparklineSeries="contacts"
          value={unresolvedWebForms}
          statusLabel="Pending review"
          clearedValueLabel="All clear"
          clearedStatusLabel="No forms pending review"
        />
        <OverviewTopLinkCard
          title="Diagnostic surveys"
          href="/admin/inbox?tab=diagnostic"
          loading={topCardsLoading}
          skeletonTone="diagnostics"
          sparklineValues={diagnosticsSparkline}
          sparklineSeries="diagnostics"
          value={unresolvedDiagnostics}
          statusLabel="Pending review"
          clearedValueLabel="All clear"
          clearedStatusLabel="No surveys pending review"
        />
        <OverviewTopLinkCard
          title="Last content publish"
          href="/admin/content?status=published"
          loading={siteContentCardLoading}
          skeletonTone="sanity"
          sparklineValues={isCmsContentEnabled() ? cmsEditsSparkline : undefined}
          sparklineSeries="drafts"
          value={displayLastPublishHeadline}
          statusLabel={displayLastPublishStatus}
          statusLabelAria={displayLastPublishStatusAria}
        />
      </div>
      </ScrollReveal>

      <ScrollReveal variant="ctaReveal" delay={0.08} hold={showSplash}>
      <div className="grid min-w-0 gap-4 lg:grid-cols-3 lg:items-stretch">
        {/* Submissions trend */}
        <Card className={cn(adminOverviewChartCardClass, "lg:col-span-2")}>
          <AdminOverviewFilterCardHeader
            title={getSubmissionTrendTitle(trendPeriod)}
            centerSlot={
              <div className="flex min-w-0 items-center justify-center gap-1">
                <button
                  onClick={() => setTrendOffset((prev) => prev + 1)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted/50 active:bg-slate-100 dark:active:bg-slate-800 disabled:opacity-50 md:h-10 md:w-10"
                  aria-label={
                    trendPeriod === "week"
                      ? "Previous week"
                      : trendPeriod === "month"
                        ? "Previous month"
                        : "Previous year"
                  }
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span
                  className={cn(
                    adminOverviewFilterLabelClass,
                    "min-w-0 whitespace-nowrap px-1.5 text-center text-xs md:px-2.5 md:text-sm",
                  )}
                >
                  {getSubmissionTrendRangeLabel(trendPeriod, trendOffset)}
                </span>
                <button
                  onClick={() => setTrendOffset((prev) => Math.max(0, prev - 1))}
                  disabled={trendOffset === 0}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted/50 active:bg-slate-100 dark:active:bg-slate-800 disabled:opacity-50 md:h-10 md:w-10"
                  aria-label={
                    trendPeriod === "week"
                      ? "Next week"
                      : trendPeriod === "month"
                        ? "Next month"
                        : "Next year"
                  }
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            }
            filters={
              <AdminOverviewSegmentedControl<SubmissionTrendPeriod>
                options={TREND_PERIOD_OPTIONS.map((option) => ({
                  value: option.id,
                  label: option.label,
                }))}
                value={trendPeriod}
                onChange={handleTrendPeriodChange}
                ariaLabel="Filter submissions by time period"
              />
            }
          />
          <CardContent className={cn(adminOverviewChartRowCardContentClass, "min-w-0 overflow-hidden sm:overflow-x-auto")}>
            {trendChartLoading ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex min-h-0 flex-1 items-center justify-center">
                  <Skeleton className={cn(TREND_CHART_HEIGHT_CLASS, "rounded-lg")} />
                </div>
                <Skeleton className="mx-auto mt-4 h-8 w-48 max-w-full rounded-lg" aria-hidden />
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex min-h-0 flex-1 items-center justify-center">
                  <OverviewTrendAreaChart
                    key={`${trendPeriod}-${trendOffset}`}
                    data={trend}
                    yMax={trendChartMax}
                    xAxisProps={trendXAxisProps}
                  />
                </div>
                <TrendSeriesLegend />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 1: Submission Status */}
        <Card className={cn(adminOverviewChartCardClass, "lg:col-span-1")}>
          <AdminOverviewFilterCardHeader
            title="Inbox submission statuses"
            filters={
              <AdminOverviewSegmentedControl<SubmissionSourceFilter>
                options={SUBMISSION_SOURCE_FILTER_OPTIONS}
                value={statusDonutSourceFilter}
                onChange={setStatusDonutSourceFilter}
                ariaLabel="Filter submission statuses by source"
              />
            }
          />
          <CardContent className={adminOverviewChartRowCardContentClass}>
            {chartSectionLoading ? (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex min-h-0 flex-1 items-center justify-center">
                  <Skeleton className="h-[268px] w-full max-w-[248px] rounded-xl" />
                </div>
                <Skeleton className="mx-auto mt-4 h-8 w-40 max-w-full rounded-lg" aria-hidden />
              </div>
            ) : totalStatusCount === 0 ? (
              <AdminOverviewChartEmptyState className="flex-1" />
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex min-h-0 flex-1 items-center justify-center">
                  <DonutChartWithCenter
                    size="column"
                    data={statusRows}
                    centerLabel="Total"
                    centerValue={totalStatusCount}
                    tooltipRows={statusRows}
                  />
                </div>
                <PieLegend rows={statusRows} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </ScrollReveal>

      <ScrollReveal variant="ctaReveal" delay={0.11} hold={showSplash}>
      <div className="grid min-w-0 gap-4 lg:grid-cols-3 lg:items-stretch">
        {/* Card 2: Startup Level Distribution */}
        <Card className={cn(adminOverviewChartCardClass, "lg:col-span-1")}>
          <AdminOverviewFilterCardHeader
            title="Diagnostic applicant stages"
            filters={
              <AdminSelectFilter<StatusFilterValue>
                value={stageStatusFilter}
                onChange={(value) => setStageStatusFilter(value)}
                options={STAGE_STATUS_FILTER_OPTIONS}
                ariaLabel="Filter diagnostic applicant stages by survey status"
              />
            }
          />
          <CardContent className={adminOverviewChartCardContentClass}>
            {chartSectionLoading ? (
              <Skeleton className="h-[280px] w-full flex-1 rounded-xl" />
            ) : stageChartData.length === 0 ? (
              <AdminOverviewChartEmptyState className="flex-1" />
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex min-h-0 flex-1 items-center justify-center">
                  <DonutChartWithCenter
                    size="column"
                    data={stageChartData}
                    centerLabel="Total"
                    centerValue={stageCenterValue}
                    tooltipRows={stageChartData}
                  />
                </div>
                <PieLegend rows={stageChartData} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Top Strengths & Growth Gaps */}
        <Card className={cn(adminOverviewChartCardClass, "lg:col-span-2")}>
          <AdminOverviewFilterCardHeader
            title="Diagnostic strengths & growth gaps"
            filters={
              <AdminSelectFilter
                value={selectedStage}
                onChange={setSelectedStage}
                options={[
                  { value: "all", label: "All Levels" },
                  ...allStages.map((stage) => ({ value: stage, label: stage })),
                ]}
                ariaLabel="Filter strengths and weaknesses by startup level"
              />
            }
          />
          <CardContent className={cn(adminOverviewChartCardContentClass, "min-w-0 gap-3 md:flex-row md:items-stretch")}>
            <div className="flex min-h-[360px] min-w-0 flex-1 flex-col rounded-xl border border-emerald-100/40 bg-emerald-50/20 p-3 dark:border-emerald-500/20 dark:bg-emerald-950/25 md:min-h-0 md:h-full">
              <div className="mb-2 flex shrink-0 items-center gap-2">
                <TrendingUp className={cn(adminOverviewPieSectionIconClass, "text-emerald-600 dark:text-emerald-400")} aria-hidden />
                <p className={adminOverviewPieSectionTitleClass}>Top Strengths</p>
              </div>
              <div className="min-h-[320px] w-full shrink-0 md:min-h-0 md:flex-1">
                <CategoryRadarChart
                  rows={strengthsPieData}
                  color="hsl(142 76% 36%)"
                  loading={radarSectionLoading}
                  className="h-full"
                  chartKey={`strengths-${selectedStage}`}
                />
              </div>
            </div>

            <div className="flex min-h-[360px] min-w-0 flex-1 flex-col rounded-xl border border-amber-100/40 bg-amber-50/20 p-3 dark:border-amber-500/20 dark:bg-amber-950/25 md:min-h-0 md:h-full">
              <div className="mb-2 flex shrink-0 items-center gap-2">
                <AlertCircle className={cn(adminOverviewPieSectionIconClass, "text-amber-600 dark:text-amber-400")} aria-hidden />
                <p className={adminOverviewPieSectionTitleClass}>Top Weaknesses</p>
              </div>
              <div className="min-h-[320px] w-full shrink-0 md:min-h-0 md:flex-1">
                <CategoryRadarChart
                  rows={gapsPieData}
                  color="hsl(38 92% 50%)"
                  loading={radarSectionLoading}
                  className="h-full"
                  chartKey={`gaps-${selectedStage}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </ScrollReveal>

      <ScrollReveal variant="ctaReveal" delay={0.14} hold={showSplash}>
      <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:items-stretch">
        <AdminRecentSubmissionsCard
          title="Recent web forms"
          titleIcon={Inbox}
          viewAllHref="/admin/inbox?tab=contact"
          loading={chartSectionLoading}
          rows={recentContacts}
          pairedRowCount={recentSubmissionPairCount}
          emptyMessage="No contact submissions yet."
          fillerMessage="No more recent web forms in this list."
          columns={recentContactColumns}
          mobileFields={recentContactMobileFields}
        />

        <AdminRecentSubmissionsCard
          title="Recent diagnostics"
          titleIcon={Stethoscope}
          viewAllHref="/admin/inbox?tab=diagnostic"
          loading={chartSectionLoading}
          rows={recentDiagnostics}
          pairedRowCount={recentSubmissionPairCount}
          emptyMessage="No diagnostic submissions yet."
          fillerMessage="No more recent diagnostics in this list."
          columns={recentDiagnosticColumns}
          mobileFields={recentDiagnosticMobileFields}
        />
      </div>
      </ScrollReveal>

      <ScrollReveal variant="ctaReveal" delay={0.17} hold={showSplash}>
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <Link to="/admin/team" className={adminOverviewLinkBoxClass}>
          <Users className="h-9 w-9 shrink-0 text-rellia-teal dark:text-rellia-mint" aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className={cn("font-host-grotesk text-lg font-semibold text-foreground dark:text-white", adminInteractiveLinkTitleClass)}>Team</p>
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
          <ArrowRight className={cn("ml-auto h-5 w-5 shrink-0 text-muted-foreground", adminInteractiveLinkArrowClass)} aria-hidden />
        </Link>

        <Link to="/admin/help" className={adminOverviewLinkBoxClass}>
          <CircleHelp className="h-9 w-9 shrink-0 text-rellia-teal dark:text-rellia-mint" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className={cn("font-host-grotesk text-lg font-semibold text-foreground dark:text-white", adminInteractiveLinkTitleClass)}>Help</p>
            <p className="mt-0.5 font-urbanist text-base text-muted-foreground">
              Documentation, tools, and dashboard guides
            </p>
          </div>
          <ArrowRight className={cn("ml-auto h-5 w-5 shrink-0 text-muted-foreground", adminInteractiveLinkArrowClass)} aria-hidden />
        </Link>
      </div>
      </ScrollReveal>
      </div>
    </div>
  )
}

export default AdminOverviewPage
