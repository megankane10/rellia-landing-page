import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, FileEdit, Inbox, Stethoscope, Users } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"
import { useAuth } from "@/context/AuthContext"
import { fetchAdminTeam, fetchAdminStripeMetrics } from "@/lib/adminApi"
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
  greetingForUser,
  percentChange,
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

const statusChartConfig = {
  New: { label: "New", color: CHART_COLORS.new },
  "In Progress": { label: "In progress", color: CHART_COLORS.progress },
  Resolved: { label: "Resolved", color: CHART_COLORS.resolved },
}

type StatCardProps = {
  label: string
  value: number | string
  hint?: string
  changePct?: number | null
  href?: string
  loading?: boolean
}

const StatCard = ({ label, value, hint, changePct, href, loading }: StatCardProps) => {
  const changeLabel = formatPercentChange(changePct ?? null)
  const changeTone =
    changePct === null || changePct === 0
      ? "text-muted-foreground"
      : changePct > 0
        ? "text-emerald-600"
        : "text-amber-700"

  const body = (
    <Card className={cn("rounded-2xl", href && "transition-colors hover:border-rellia-teal/25 hover:bg-rellia-mint/5")}>
      <CardHeader className="pb-2">
        <CardDescription className="font-urbanist text-xs uppercase tracking-wide">{label}</CardDescription>
        {loading ? (
          <Skeleton className="mt-2 h-9 w-16 rounded-xl" />
        ) : (
          <div className="flex items-end justify-between gap-3">
            <CardTitle className="font-host-grotesk text-3xl tabular-nums">{value}</CardTitle>
            {changePct !== undefined ? (
              <span className={cn("font-urbanist text-sm font-semibold tabular-nums", changeTone)}>
                {changeLabel}
              </span>
            ) : null}
          </div>
        )}
      </CardHeader>
      {hint ? (
        <CardContent className="pt-0">
          <p className="font-urbanist text-xs text-muted-foreground">{hint}</p>
        </CardContent>
      ) : null}
    </Card>
  )

  if (!href) return body
  return (
    <Link to={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
      {body}
    </Link>
  )
}

const AdminOverviewPage = () => {
  const { user, session } = useAuth()
  const token = session?.access_token ?? ""
  const displayName = getAdminDisplayName(user)
  const greeting = greetingForUser(displayName, user?.email)

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
  const stripeQuery = useQuery({
    queryKey: ["admin-stripe-metrics", token],
    queryFn: () => fetchAdminStripeMetrics(token),
    enabled: Boolean(token),
    staleTime: 5 * 60_000,
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
  const previousUnresolved = countSubmissionsBetweenDays(
    contacts.filter((row) => isActiveSubmissionStatus(row.status as "New" | "In Progress" | "Resolved" | null)),
    diagnostics.filter((row) => isActiveSubmissionStatus(row.status as "New" | "In Progress" | "Resolved" | null)),
    14,
    7,
  )
  const unresolvedChangePct = percentChange(unresolved, previousUnresolved)
  const draftCount = draftsQuery.data?.length ?? 0
  const teamCount = teamQuery.data?.length ?? 0
  const stripeMetrics = stripeQuery.data
  const revenueDisplay =
    stripeMetrics?.configured && typeof stripeMetrics.revenueLast30Days === "number"
      ? new Intl.NumberFormat("en-CA", {
          style: "currency",
          currency: (stripeMetrics.currency ?? "cad").toUpperCase(),
          maximumFractionDigits: 0,
        }).format(stripeMetrics.revenueLast30Days / 100)
      : "—"

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={greeting}
        description="Snapshot of submissions, CMS drafts, and system health."
        actions={<AdminSystemStatus />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Needs attention"
          value={unresolved}
          hint="New or in progress"
          changePct={unresolvedChangePct}
          href="/admin/inbox"
          loading={loading}
        />
        <StatCard
          label="Submissions (7 days)"
          value={weekCount}
          hint="Web forms + diagnostics"
          changePct={weekChangePct}
          loading={loading}
        />
        <StatCard
          label="Stripe revenue (30 days)"
          value={revenueDisplay}
          hint={
            stripeMetrics?.configured
              ? "Server-side read only — secret key never exposed to the browser"
              : "Add STRIPE_SECRET_KEY on the server to enable"
          }
          changePct={stripeMetrics?.revenueChangePct}
          loading={stripeQuery.isLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-host-grotesk text-lg">Submissions this week</CardTitle>
            <CardDescription className="font-urbanist">Daily web forms and startup diagnostics</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[220px] w-full rounded-lg" />
            ) : (
              <ChartContainer config={trendChartConfig} className="h-[220px] w-full">
                <BarChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} fontSize={11} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="contacts" stackId="a" fill="var(--color-contacts)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="diagnostics" stackId="a" fill="var(--color-diagnostics)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-host-grotesk text-lg">Status breakdown</CardTitle>
            <CardDescription className="font-urbanist">All inbox items by workflow status</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 sm:flex-row">
            {loading ? (
              <Skeleton className="h-[220px] w-full rounded-lg" />
            ) : (
              <>
                <ChartContainer config={statusChartConfig} className="mx-auto h-[200px] w-full max-w-[200px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={statusBreakdown}
                      dataKey="count"
                      nameKey="status"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={2}
                    >
                      {statusBreakdown.map((entry) => (
                        <Cell
                          key={entry.status}
                          fill={
                            entry.status === "New"
                              ? CHART_COLORS.new
                              : entry.status === "In Progress"
                                ? CHART_COLORS.progress
                                : CHART_COLORS.resolved
                          }
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <ul className="flex flex-1 flex-col gap-2 font-urbanist text-sm">
                  {statusBreakdown.map((row) => (
                    <li key={row.status} className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("rounded-full text-xs", statusBadgeClass(row.status))}>
                          {row.status}
                        </Badge>
                      </span>
                      <span className="tabular-nums font-medium">{row.count}</span>
                    </li>
                  ))}
                </ul>
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
                    <Badge
                      variant="outline"
                      className={cn("shrink-0 rounded-full text-xs", statusBadgeClass(row.status ?? "New"))}
                    >
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
                    <Badge
                      variant="outline"
                      className={cn("shrink-0 rounded-full text-xs", statusBadgeClass(row.status ?? "New"))}
                    >
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
            <p className="font-host-grotesk font-semibold">Sanity drafts</p>
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
