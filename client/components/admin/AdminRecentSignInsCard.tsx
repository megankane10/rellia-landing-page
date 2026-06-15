import { LogIn } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import type { AdminTeamUser } from "@/lib/adminApi"
import {
  formatAdminDateWithWeekday,
  formatAdminRelativeAgo,
} from "@/lib/adminSubmissionStatus"
import { cn } from "@/lib/utils"

type AdminRecentSignInsCardProps = {
  members: AdminTeamUser[]
  loading?: boolean
  className?: string
}

const AdminRecentSignInsCard = ({ members, loading, className }: AdminRecentSignInsCardProps) => (
  <Card className={cn("min-w-0 overflow-hidden rounded-2xl", className)}>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2.5 font-host-grotesk text-lg">
        <LogIn className="h-5 w-5 shrink-0 text-rellia-teal" aria-hidden />
        Recent sign-ins
      </CardTitle>
      <CardDescription className="font-urbanist">Who has been active on the dashboard lately.</CardDescription>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <AdminCompactEmptyState
          icon={LogIn}
          title="No sign-in activity yet"
          description="When team members sign in to the dashboard, their recent activity will show here."
        />
      ) : (
        <ul className="space-y-2">
          {members.map((member) => {
            const signedInAt = member.lastSignInAt!
            return (
              <li
                key={member.id}
                className="rounded-xl border border-border/70 bg-muted/20 px-3 py-2.5"
              >
                <p className="truncate font-urbanist text-sm font-semibold text-foreground">
                  {member.fullName?.trim() || member.email}
                </p>
                <p className="mt-0.5 font-urbanist text-xs leading-snug text-muted-foreground">
                  <time dateTime={signedInAt} className="text-foreground/80">
                    {formatAdminDateWithWeekday(signedInAt)}
                  </time>
                  <span className="mx-1.5 text-border">·</span>
                  <span className="font-medium text-rellia-teal/90">
                    {formatAdminRelativeAgo(signedInAt)}
                  </span>
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </CardContent>
  </Card>
)

export default AdminRecentSignInsCard
