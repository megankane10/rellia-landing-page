import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, ChevronLeft, ChevronRight, FileEdit, Inbox, Stethoscope, Users, TrendingUp, AlertCircle } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useAuth } from "@/context/AuthContext"
import { fetchAdminTeam } from "@/lib/adminApi"
import { supabase } from "@/lib/supabase"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import AdminSystemStatus from "@/components/admin/AdminSystemStatus"
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
import { getAdminDisplayName } from "@/lib/adminUserProfile"
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

const trendChartConfig = {
  contacts: { label: "Web forms", color: CHART_COLORS.contacts },
  diagnostics: { label: "Diagnostics", color: CHART_COLORS.diagnostics },
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

const CHART_MARGIN = { top: 8, right: 4, left: 0, bottom: 32 }

type StatCardProps = {
  label: string
  value: number | string
  changePct?: number | null
  changeCompare?: string
  href?: string
  loading?: boolean
}

const StatCard = ({ label, value, changePct, changeCompare, href, loading }: StatCardProps) => {
  const changeLabel = formatPercentChange(changePct ?? null)
  const changeTone =
    changePct === null || changePct === 0
      ? "text-muted-foreground"
      : changePct > 0
        ? "text-emerald-600"
        : "text-amber-700"

  const body = (
    <Card
      className={cn(
        "flex h-full flex-col rounded-2xl",
        href && "transition-colors hover:border-rellia-teal/25 hover:bg-rellia-mint/5",
      )}
    >
      <CardHeader className="flex flex-1 flex-col pb-4">
        <p className="font-urbanist text-sm font-normal text-foreground/85">{label}</p>
        {loading ? (
          <Skeleton className="mt-3 h-9 w-24 rounded-xl" />
        ) : (
          <div className="mt-3 flex items-start justify-between gap-3">
            <CardTitle className="font-host-grotesk text-3xl tabular-nums leading-none">{value}</CardTitle>
            {changePct !== undefined ? (
              <div className="shrink-0 text-right">
                <span className={cn("font-urbanist text-sm font-semibold tabular-nums", changeTone)}>
                  {changeLabel}
                </span>
                {changeCompare ? (
                  <p className="mt-0.5 font-urbanist text-[11px] leading-tight text-muted-foreground">
                    {changeCompare}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </CardHeader>
    </Card>
  )

  if (!href) return body
  return (
    <Link to={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
      {body}
    </Link>
  )
}

const statusChartConfig = {
  New: { label: "New", color: CHART_COLORS.new },
  "In Progress": { label: "In progress", color: CHART_COLORS.progress },
  Resolved: { label: "Resolved", color: CHART_COLORS.resolved },
}

const AdminOverviewPage = () => {
  const { user, session } = useAuth()
  const token = session?.access_token ?? ""
  const displayName = getAdminDisplayName(user)
  const pageTitle = welcomeBackTitle(displayName, user?.email)

  const [weekOffset, setWeekOffset] = useState(0)

  const contactsQuery = useQuery({ queryKey: ["admin-contact-submissions"], queryFn: fetchContactSubmissions })
  const diagnosticsQuery = useQuery({ queryKey: ["admin-company-profiles"], queryFn: fetchDiagnosticSubmissions })
  const responsesQuery = useQuery({
    queryKey: ["admin-diagnostic-responses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("diagnostic_responses")
        .select("top3_strengths, top3_weaknesses")
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
  const statusBreakdown = buildStatusBreakdown(contacts, diagnostics)
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

  const totalStatusCount = statusBreakdown.reduce((sum, row) => sum + row.count, 0)
  const statusRows = statusBreakdown.map((row) => ({
    ...row,
    pct: totalStatusCount > 0 ? Math.round((row.count / totalStatusCount) * 100) : 0,
    fill:
      row.status === "New"
        ? CHART_COLORS.new
        : row.status === "In Progress"
          ? CHART_COLORS.progress
          : CHART_COLORS.resolved,
  }))

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    diagnostics.forEach((row) => {
      const stage = row.stage || "Not Specified"
      counts[stage] = (counts[stage] || 0) + 1
    })
    return counts
  }, [diagnostics])

  const textStats = useMemo(() => {
    const strengthsCount: Record<string, number> = {}
    const weaknessesCount: Record<string, number> = {}

    const responses = responsesQuery.data ?? []
    responses.forEach((resp) => {
      const strengths = resp.top3_strengths as any[] | null
      const weaknesses = resp.top3_weaknesses as any[] | null

      if (Array.isArray(strengths)) {
        strengths.forEach((s) => {
          if (s?.category) {
            strengthsCount[s.category] = (strengthsCount[s.category] || 0) + 1
          }
        })
      }
      if (Array.isArray(weaknesses)) {
        weaknesses.forEach((w) => {
          if (w?.category) {
            weaknessesCount[w.category] = (weaknessesCount[w.category] || 0) + 1
          }
        })
      }
    })

    const topStrengths = Object.entries(strengthsCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category)

    const topWeaknesses = Object.entries(weaknessesCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category)

    return { topStrengths, topWeaknesses }
  }, [responsesQuery.data])

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
    <div className="space-y-6">
      <AdminPageHeader
        title={pageTitle}
        description="Review, track, and update website inquiries and edit drafts."
        actions={<AdminSystemStatus />}
      />

      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
        <StatCard
          label="Needs attention"
          value={unresolved}
          changePct={unresolvedChangePct}
          changeCompare="vs prior 7 days"
          href="/admin/inbox"
          loading={loading}
        />
        <StatCard
          label="Submissions by week"
          value={weekCount}
          changePct={weekChangePct}
          changeCompare="vs prior 7 days"
          loading={loading}
        />
      </div>

      <Card className="w-full rounded-2xl">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-host-grotesk text-lg">Submissions by week</CardTitle>
            <CardDescription className="font-urbanist">Daily web forms and startup diagnostics</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset((prev) => prev + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50"
              aria-label="Previous week"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-urbanist text-xs font-semibold text-slate-700 min-w-[130px] text-center">
              {getWeekRangeLabel(weekOffset)}
            </span>
            <button
              onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
              disabled={weekOffset === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50"
              aria-label="Next week"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[280px] w-full rounded-lg" />
          ) : (
            <ChartContainer config={trendChartConfig} className="h-[240px] w-full min-w-0 sm:h-[280px]">
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-host-grotesk text-lg">Status breakdown</CardTitle>
            <CardDescription className="font-urbanist">Distribution across New, In progress, and Resolved</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[220px] w-full rounded-xl" />
            ) : (
              <div className="space-y-4">
                {statusRows.map((row) => (
                  <div key={row.status} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="outline" className={cn("border-0", statusBadgeClass(row.status))}>
                        {row.status}
                      </Badge>
                      <div className="flex items-center gap-3 font-urbanist text-sm">
                        <span className="text-muted-foreground tabular-nums">{row.pct}%</span>
                        <span className="font-semibold tabular-nums text-foreground">{row.count}</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${row.pct}%`, background: row.fill }}
                        aria-hidden
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-host-grotesk text-lg">
              Diagnostic survey
            </CardTitle>
            <CardDescription className="font-urbanist">Diagnostics analysis and startup levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {loading ? (
              <Skeleton className="h-[220px] w-full rounded-xl" />
            ) : (
              <>
                <div className="space-y-3">
                  <p className="font-host-grotesk text-sm font-semibold text-foreground">Startup Levels Distribution</p>
                  {Object.keys(stageCounts).length === 0 ? (
                    <p className="font-urbanist text-xs text-muted-foreground">No level data available.</p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {Object.entries(stageCounts).map(([stage, count]) => {
                        const total = diagnostics.length
                        const pct = total > 0 ? Math.round((count / total) * 100) : 0
                        return (
                          <div key={stage} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 flex flex-col justify-between shadow-sm">
                            <div className="flex items-center justify-between text-xs font-urbanist">
                              <span className="font-semibold text-slate-700">{stage}</span>
                              <span className="font-bold text-slate-900">{count} {count === 1 ? "startup" : "startups"} ({pct}%)</span>
                            </div>
                            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200/60 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-rellia-teal transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50/30 border border-emerald-100/50 p-4 shadow-inner">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shadow-sm">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <p className="font-host-grotesk text-sm font-bold text-emerald-900">Key Strengths</p>
                    </div>
                    {responsesQuery.isLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : textStats.topStrengths.length === 0 ? (
                      <p className="font-urbanist text-xs text-muted-foreground">No strength data reported yet.</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {textStats.topStrengths.map((s, idx) => (
                          <div key={s} className="flex items-center gap-2 font-urbanist text-xs text-emerald-800 bg-white border border-emerald-100/60 rounded-xl px-3 py-2 shadow-sm">
                            <span className="font-bold text-emerald-600/80">#{idx + 1}</span>
                            <span className="font-medium">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl bg-amber-50/30 border border-amber-100/50 p-4 shadow-inner">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700 shadow-sm">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <p className="font-host-grotesk text-sm font-bold text-amber-900">Top Growth Gaps</p>
                    </div>
                    {responsesQuery.isLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : textStats.topWeaknesses.length === 0 ? (
                      <p className="font-urbanist text-xs text-muted-foreground">No weakness data reported yet.</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {textStats.topWeaknesses.map((w, idx) => (
                          <div key={w} className="flex items-center gap-2 font-urbanist text-xs text-amber-900 bg-white border border-amber-100/60 rounded-xl px-3 py-2 shadow-sm">
                            <span className="font-bold text-amber-600/80">#{idx + 1}</span>
                            <span className="font-medium">{w}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 font-host-grotesk text-lg">
                <Inbox className="h-4 w-4 text-rellia-teal" aria-hidden />
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

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 font-host-grotesk text-lg">
                <Stethoscope className="h-4 w-4 text-rellia-teal" aria-hidden />
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/drafts"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-rellia-teal/25 hover:bg-rellia-mint/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <FileEdit className="h-8 w-8 text-rellia-teal" aria-hidden />
          <div>
            <p className="font-host-grotesk font-semibold">Sanity Drafts</p>
            <p className="font-urbanist text-sm text-muted-foreground">
              {draftCount} unpublished {draftCount === 1 ? "document" : "documents"} waiting in CMS
            </p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" aria-hidden />
        </Link>
        <Link
          to="/admin/team"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-rellia-teal/25 hover:bg-rellia-mint/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Users className="h-8 w-8 text-rellia-teal" aria-hidden />
          <div>
            <p className="font-host-grotesk font-semibold">Team</p>
            <p className="font-urbanist text-sm text-muted-foreground">{teamCount} dashboard accounts</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" aria-hidden />
        </Link>
      </div>
    </div>
  )
}

export default AdminOverviewPage
