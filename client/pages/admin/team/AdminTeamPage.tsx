import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { ExternalLink, Users } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { fetchAdminTeam } from "@/lib/adminApi"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import AdminRecordList from "@/components/admin/AdminRecordList"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatAdminDate } from "@/lib/adminSubmissionStatus"
import type { AdminTableColumn } from "@/components/admin/AdminDataTable"
import type { AdminTeamUser } from "@/lib/adminApi"

const SUPABASE_AUTH_USERS_URL =
  "https://supabase.com/dashboard/project/agsvypnmlrvpbgrsxtqy/auth/users"

const memberStatus = (member: AdminTeamUser) =>
  member.confirmedAt ? (
    <span className="inline-flex rounded-full bg-rellia-mint/30 px-2.5 py-0.5 text-xs font-medium text-rellia-teal">
      Active
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900">
      Invite pending
    </span>
  )

const memberInitials = (member: AdminTeamUser) => {
  const name = member.fullName?.trim()
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0]!.charAt(0)}${parts[parts.length - 1]!.charAt(0)}`.toUpperCase()
    }
    return parts[0]!.charAt(0).toUpperCase()
  }
  return member.email.charAt(0).toUpperCase()
}

const memberAvatar = (member: AdminTeamUser) => (
  <Avatar className="h-9 w-9 shrink-0">
    {member.avatarUrl ? <AvatarImage src={member.avatarUrl} alt="" /> : null}
    <AvatarFallback className="bg-rellia-mint/25 font-urbanist text-xs font-medium text-rellia-teal">
      {memberInitials(member)}
    </AvatarFallback>
  </Avatar>
)

const AdminTeamPage = () => {
  const { session } = useAuth()
  const token = session?.access_token ?? ""

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["admin-team", token],
    queryFn: () => fetchAdminTeam(token),
    enabled: Boolean(token),
    staleTime: 60_000,
  })

  const columns: AdminTableColumn<AdminTeamUser>[] = [
    {
      key: "name",
      header: "Name",
      cell: (member) => (
        <div className="flex items-center gap-3">
          {memberAvatar(member)}
          <span className="font-medium text-foreground">{member.fullName?.trim() || "—"}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      cell: (member) => <span>{member.email}</span>,
    },
    {
      key: "joined",
      header: "Joined",
      cell: (member) => <span className="text-muted-foreground">{formatAdminDate(member.createdAt)}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (member) => memberStatus(member),
    },
  ]

  const recentActivity = useMemo(
    () =>
      [...users]
        .filter((u) => u.lastSignInAt)
        .sort((a, b) => new Date(b.lastSignInAt!).getTime() - new Date(a.lastSignInAt!).getTime())
        .slice(0, 6),
    [users],
  )

  return (
    <div className="space-y-6">
      <div className="rounded-r-xl border-l-4 border-indigo-600 bg-indigo-50/60 p-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-indigo-900">🔒 Administrative Access Controls</span>
          <p className="text-xs leading-relaxed text-indigo-700">
            To register a brand-new administrator account, choose one of the following methods:
          </p>
          <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-indigo-700">
            <li>
              Use the direct link to{" "}
              <a
                href="https://supabase.com/dashboard/project/agsvypnmlrvpbgrsxtqy/auth/users"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline transition-colors hover:text-indigo-900"
              >
                Invite via Supabase Console
              </a>{" "}
              (Note: Platforms enforce a strict native safety limit of 3 invitations per day).
            </li>
            <li>
              Alternatively, temporarily switch your deployment variable <strong>ADMIN_SIGNUP_ENABLED</strong> to{" "}
              <strong>&quot;true&quot;</strong> within your{" "}
              <a
                href="https://vercel.com/relliahealth/settings/environment-variables"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline transition-colors hover:text-indigo-900"
              >
                Vercel Dashboard Settings
              </a>
              . This temporarily activates the public registration endpoint located at{" "}
              <a href="/admin/signup" className="font-medium underline transition-colors hover:text-indigo-900">
                /admin/signup
              </a>
              . Remember to toggle this variable back to &quot;false&quot; immediately after your team registration is
              completed to prevent open backdoors.
            </li>
          </ul>
        </div>
      </div>

      <AdminPageHeader
        title="Team"
        description="Dashboard accounts and invite status."
        actions={
          <Button type="button" variant="outline" size="sm" asChild className="rounded-full">
            <a href={SUPABASE_AUTH_USERS_URL} target="_blank" rel="noopener noreferrer">
              Invite in Supabase
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </a>
          </Button>
        }
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-host-grotesk text-lg">Members</CardTitle>
          <CardDescription className="font-urbanist">Newest members first.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : null}

          {error ? (
            <p className="font-urbanist text-sm text-destructive">
              {error instanceof Error ? error.message : "Could not load team members."}
            </p>
          ) : null}

          {!isLoading && !error && users.length === 0 ? (
            <AdminCompactEmptyState
              icon={Users}
              title="No team members found"
              description="Invite colleagues from Supabase Auth to grant dashboard access."
            />
          ) : null}

          {!isLoading && !error && users.length > 0 ? (
            <AdminRecordList
              rows={users}
              getRowKey={(member) => member.id}
              columns={columns}
              mobileFields={[
                {
                  label: "Member",
                  value: (member) => (
                    <div className="flex items-center gap-2">
                      {memberAvatar(member)}
                      <span>{member.fullName?.trim() || member.email}</span>
                    </div>
                  ),
                },
                { label: "Email", value: (member) => member.email },
                { label: "Status", value: (member) => memberStatus(member) },
              ]}
            />
          ) : null}
        </CardContent>
      </Card>

      {recentActivity.length > 0 ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-host-grotesk text-lg">Recent sign-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {recentActivity.map((member) => (
                <li key={member.id} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-urbanist text-sm font-medium">
                    {member.fullName?.trim() || member.email}
                  </span>
                  <span className="font-urbanist text-xs text-muted-foreground">
                    {formatAdminDate(member.lastSignInAt!)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

export default AdminTeamPage
