import { LogIn } from "lucide-react"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import AdminRecordList from "@/components/admin/AdminRecordList"
import type { AdminTableColumn } from "@/components/admin/AdminDataTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { AdminTeamUser } from "@/lib/adminApi"
import { formatAdminDate, formatAdminRelativeAgo } from "@/lib/adminSubmissionStatus"
import { cn } from "@/lib/utils"

type AdminRecentSignInsCardProps = {
  members: AdminTeamUser[]
  loading?: boolean
  className?: string
}

const signInColumns: AdminTableColumn<AdminTeamUser>[] = [
  {
    key: "member",
    header: "Name",
    cell: (member) => (
      <span className="font-medium text-foreground">{member.fullName?.trim() || "—"}</span>
    ),
  },
  {
    key: "signedIn",
    header: "Signed in",
    cell: (member) => {
      const signedInAt = member.lastSignInAt!
      return (
        <time dateTime={signedInAt} className="text-muted-foreground">
          {formatAdminDate(signedInAt)}
        </time>
      )
    },
  },
  {
    key: "when",
    header: "When",
    cell: (member) => (
      <span className="font-medium text-rellia-teal/90 dark:text-rellia-mint">
        {formatAdminRelativeAgo(member.lastSignInAt!)}
      </span>
    ),
  },
]

const AdminRecentSignInsCard = ({ members, loading, className }: AdminRecentSignInsCardProps) => (
  <Card className={cn("min-w-0 overflow-hidden rounded-2xl", className)}>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2.5 font-host-grotesk text-lg text-foreground dark:text-white">
        <LogIn className="h-5 w-5 shrink-0 text-rellia-teal" aria-hidden />
        Recent sign-ins
      </CardTitle>
      <CardDescription className="font-urbanist">Who has been active on the dashboard lately.</CardDescription>
    </CardHeader>
    <CardContent className="p-0">
      {loading ? (
        <div className="space-y-3 border-t border-border/80 p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="border-t border-border/80 p-4">
          <AdminCompactEmptyState
            icon={LogIn}
            title="No sign-in activity yet"
            description="When team members sign in to the dashboard, their recent activity will show here."
          />
        </div>
      ) : (
        <div className="overflow-hidden border-t border-border/80 [&_ul]:p-3 [&_ul]:md:p-0">
          <AdminRecordList
            rows={members}
            getRowKey={(member) => member.id}
            columns={signInColumns}
            mobileFields={[
              {
                label: "Name",
                value: (member) => <span>{member.fullName?.trim() || member.email}</span>,
              },
              {
                label: "Signed in",
                value: (member) => (
                  <time dateTime={member.lastSignInAt!} className="text-foreground">
                    {formatAdminDate(member.lastSignInAt!)}
                  </time>
                ),
              },
              {
                label: "When",
                value: (member) => (
                  <span className="font-medium text-rellia-teal/90 dark:text-rellia-mint">
                    {formatAdminRelativeAgo(member.lastSignInAt!)}
                  </span>
                ),
              },
            ]}
          />
        </div>
      )}
    </CardContent>
  </Card>
)

export default AdminRecentSignInsCard
