import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, FileEdit, Inbox, Stethoscope, TrendingUp, Users } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useAuth } from "@/context/AuthContext"
import { fetchAdminTeam } from "@/lib/adminApi"
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

  const contactsQuery = useQuery({ queryKey: ["admin-contact-submissions"], queryFn: fetchContactSubmissions })
  const diagnosticsQuery = useQuery({ queryKey: ["admin-company-profiles"], queryFn: fetchDiagnosticSubmissions })
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
  const trend = buildLastNDaysTrend(contacts, diagnostics)
  const statusBreakdown = buildStatusBreakdown(contacts, diagnostics)
  const recentContacts = [...contacts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
  const recentDiagnostics = [...diagnostics]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const unresolved = countUnresolved(contacts, diagnostics)
  const weekCount = countRecentAll(contacts, diagnostics)
  const previousWeekCount = countSubmissionsBetweenDays(contacts, diagnostics, 14, 7)
  const weekChangePct = percentChange(weekCount, previousWeekCount)
  const weekDiagnostics = countSubmissionsBetweenDays([], diagnostics, 7, 0)
  const previousWeekDiagnostics = countSubmissionsBetweenDays([], diagnostics, 14, 7)
  const diagnosticsChangePct = percentChange(weekDiagnostics, previousWeekDiagnostics)
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
          label="Submissions this week"
          value={weekCount}
          changePct={weekChangePct}
          changeCompare="vs prior 7 days"
          loading={loading}
        />
      </div>

      <Card className="w-full rounded-2xl">
        <CardHeader>
          <CardTitle className="font-host-grotesk text-lg">Submissions this week</CardTitle>
          <CardDescription className="font-urbanist">Daily web forms and startup diagnostics</CardDescription>
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
            <CardTitle className="flex items-center gap-2 font-host-grotesk text-lg">
              <TrendingUp className="h-4 w-4 text-rellia-teal" aria-hidden />
              Diagnostic survey
            </CardTitle>
            <CardDescription className="font-urbanist">Weekly diagnostic intake volume</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[220px] w-full rounded-xl" />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="font-urbanist text-sm text-muted-foreground">Submissions this week</p>
                  <p className="mt-2 font-host-grotesk text-3xl font-semibold tabular-nums">{weekDiagnostics}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="font-urbanist text-sm text-muted-foreground">Change vs prior week</p>
                  <p
                    className={cn(
                      "mt-2 font-host-grotesk text-3xl font-semibold tabular-nums",
                      diagnosticsChangePct === null || diagnosticsChangePct === 0
                        ? "text-foreground"
                        : diagnosticsChangePct > 0
                          ? "text-emerald-600"
                          : "text-amber-700",
                    )}
                  >
                    {formatPercentChange(diagnosticsChangePct)}
                  </p>
                  <p className="mt-1 font-urbanist text-xs text-muted-foreground">vs prior 7 days</p>
                </div>
              </div>
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
