import { LogIn } from "lucide-react"
import AdminRecordList from "@/components/admin/AdminRecordList"
import type { AdminTableColumn } from "@/components/admin/AdminDataTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { AdminTeamUser } from "@/lib/adminApi"
import { formatAdminActivityAgo, formatAdminDate } from "@/lib/adminSubmissionStatus"
import { cn } from "@/lib/utils"
import { adminTeamCardHeaderClass, adminTeamCardTitleClass, adminTeamCardTitleIconClass } from "@/components/admin/adminThemeClasses"

const RECENT_ACTIVITY_MAX = 6

type AdminRecentSignInsCardProps = {
  members: AdminTeamUser[]
  loading?: boolean
  className?: string
  emptyMessage?: string
  fillerMessage?: string
}

const memberActivityAt = (member: AdminTeamUser): string | null =>
  member.lastActiveAt ?? member.lastSignInAt

const activityColumns: AdminTableColumn<AdminTeamUser>[] = [
  {
    key: "member",
    header: "Name",
    cell: (member) => (
      <span className="font-medium text-foreground">{member.fullName?.trim() || "—"}</span>
    ),
  },
  {
    key: "activeAt",
    header: "Last active",
    cell: (member) => {
      const activeAt = memberActivityAt(member)
      if (!activeAt) return <span className="text-muted-foreground">—</span>
      return (
        <time dateTime={activeAt} className="text-muted-foreground">
          {formatAdminDate(activeAt)}
        </time>
      )
    },
  },
  {
    key: "when",
    header: "When",
    cell: (member) => {
      const activeAt = memberActivityAt(member)
      if (!activeAt) return <span className="text-muted-foreground">—</span>
      return (
        <span className="font-medium text-rellia-teal/90 dark:text-rellia-mint">
          {formatAdminActivityAgo(activeAt)}
        </span>
      )
    },
  },
]

const AdminRecentSignInsCard = ({
  members,
  loading,
  className,
  emptyMessage = "No team activity yet.",
  fillerMessage = "No more recent activity in this list.",
}: AdminRecentSignInsCardProps) => {
  const showFiller = members.length < RECENT_ACTIVITY_MAX

  return (
    <Card className={cn("flex h-full min-w-0 flex-col overflow-hidden rounded-2xl", className)}>
      <CardHeader className={adminTeamCardHeaderClass}>
        <CardTitle className={adminTeamCardTitleClass}>
          <LogIn className={adminTeamCardTitleIconClass} aria-hidden />
          Recent activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-0 pb-0 pt-0">
        {loading ? (
          <div className="space-y-3 px-6 pb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[16rem] flex-1 flex-col">
            {members.length > 0 ? (
              <div className="shrink-0 overflow-hidden [&_ul]:space-y-3 [&_ul]:px-6 [&_ul]:pb-3 [&_ul]:pt-0 md:[&_ul]:hidden">
                <AdminRecordList
                  rows={members}
                  getRowKey={(member) => member.id}
                  columns={activityColumns}
                  tableClassName="w-full"
                  mobileFields={[
                    {
                      label: "Name",
                      value: (member) => <span>{member.fullName?.trim() || member.email}</span>,
                    },
                    {
                      label: "Last active",
                      value: (member) => {
                        const activeAt = memberActivityAt(member)
                        if (!activeAt) return <span>—</span>
                        return (
                          <time dateTime={activeAt} className="text-foreground">
                            {formatAdminDate(activeAt)}
                          </time>
                        )
                      },
                    },
                    {
                      label: "When",
                      value: (member) => {
                        const activeAt = memberActivityAt(member)
                        if (!activeAt) return <span>—</span>
                        return (
                          <span className="font-medium text-rellia-teal/90 dark:text-rellia-mint">
                            {formatAdminActivityAgo(activeAt)}
                          </span>
                        )
                      },
                    },
                  ]}
                />
              </div>
            ) : null}
            {showFiller ? (
              <div
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-2.5 py-8 text-center",
                  members.length > 0
                    ? "border-t border-dashed border-border/80 bg-muted/15 px-6 dark:bg-muted/10"
                    : "mx-6 mb-6 rounded-xl border border-dashed border-border/80 bg-muted/15 px-4 dark:bg-muted/10",
                )}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground">
                  <LogIn className="h-5 w-5" aria-hidden />
                </span>
                <p className="max-w-[15rem] font-urbanist text-sm leading-snug text-muted-foreground">
                  {members.length === 0 ? emptyMessage : fillerMessage}
                </p>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AdminRecentSignInsCard
