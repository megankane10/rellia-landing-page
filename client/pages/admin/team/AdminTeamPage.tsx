import { useMemo } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ExternalLink, Key, UserPlus, Users } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { fetchAdminTeam } from "@/lib/adminApi"
import AdminPageHeader from "@/components/admin/AdminPageHeader"
import AdminPageReveal from "@/components/admin/AdminPageReveal"
import AdminDownloadCsvButton from "@/components/admin/AdminDownloadCsvButton"
import AdminRecordList from "@/components/admin/AdminRecordList"
import AdminCompactEmptyState from "@/components/admin/AdminCompactEmptyState"
import AdminRecentSignInsCard from "@/components/admin/AdminRecentSignInsCard"
import AdminTeamQuickNoteCard from "@/components/admin/AdminTeamQuickNoteCard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatAdminDate } from "@/lib/adminSubmissionStatus"
import { resolveAdminMemberAvatarUrl } from "@/lib/adminUserProfile"
import type { AdminTableColumn } from "@/components/admin/AdminDataTable"
import type { AdminTeamUser } from "@/lib/adminApi"

import AdminTipBox from "@/components/admin/AdminTipBox"

const SUPABASE_AUTH_USERS_URL =
  "https://supabase.com/dashboard/project/agsvypnmlrvpbgrsxtqy/auth/users"

const memberStatus = (member: AdminTeamUser) => {
  return member.confirmedAt ? (
    <span className="inline-flex rounded-full bg-rellia-mint/30 px-2.5 py-0.5 text-xs font-medium text-rellia-teal">
      Active
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900">
      Invite pending
    </span>
  )
}

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

const memberAvatar = (member: AdminTeamUser) => {
  const resolvedAvatarUrl = resolveAdminMemberAvatarUrl(member)

  return (
    <Avatar className="h-9 w-9 shrink-0">
      {resolvedAvatarUrl ? (
        <AvatarImage src={resolvedAvatarUrl} alt="" />
      ) : null}
      <AvatarFallback className="bg-rellia-mint/25 font-urbanist text-xs font-medium text-rellia-teal">
        {memberInitials(member)}
      </AvatarFallback>
    </Avatar>
  )
}

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
      <AdminPageReveal>
        <AdminPageHeader
          title="Team"
          actions={
            <>
              <AdminDownloadCsvButton
                filename="rellia-admin-team"
                rows={users}
                columns={[
                  { header: "Name", value: (member) => member.fullName?.trim() || "" },
                  { header: "Email", value: (member) => member.email },
                  { header: "Joined", value: (member) => formatAdminDate(member.createdAt) },
                  {
                    header: "Status",
                    value: (member) => (member.confirmedAt ? "Active" : "Invite pending"),
                  },
                  {
                    header: "Last sign-in",
                    value: (member) => (member.lastSignInAt ? formatAdminDate(member.lastSignInAt) : ""),
                  },
                ]}
              />
              <Button type="button" variant="outline" size="sm" asChild className="rounded-full">
                <a href={SUPABASE_AUTH_USERS_URL} target="_blank" rel="noopener noreferrer">
                  Invite in Supabase
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
                </a>
              </Button>
            </>
          }
        />

        <AdminTipBox
          title="Invite your team members"
          icon={UserPlus}
          storageKey="rellia-admin-team-tip-collapsed"
          className="w-full"
        >
          <div className="mb-5 space-y-3 font-urbanist text-sm text-black/70 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 font-bold text-rellia-teal">•</span>
              <p>
                <strong>Invite Admin User:</strong> Invite colleagues directly via Supabase Auth to grant dashboard access.{" "}
                <em>Note: Supabase Auth has a default limit of 3 email invitations per day.</em>
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 font-bold text-rellia-teal">•</span>
              <p>
                <strong>Add Admin Directly:</strong> You can add users directly to the dashboard from Supabase Auth by entering the admin account's name, email, and password.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 font-bold text-rellia-teal">•</span>
              <p>
                <strong>Enable Signup:</strong> Alternatively, users can register themselves via{" "}
                <Link to="/admin/signup" className="font-semibold text-rellia-teal hover:underline">
                  the signup page
                </Link>
                . To allow this, toggle the{" "}
                <code className="rounded bg-rellia-mint/10 px-1 py-0.5 text-xs font-semibold text-rellia-teal">
                  ADMIN_SIGNUP_ENABLED
                </code>{" "}
                environment variable to{" "}
                <code className="rounded bg-rellia-mint/10 px-1 py-0.5 text-xs font-semibold text-rellia-teal">
                  true
                </code>{" "}
                in Vercel settings and remember to disable it after use.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <a
              href="https://supabase.com/dashboard/project/agsvypnmlrvpbgrsxtqy/auth/users"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center rounded-2xl border border-rellia-teal/15 bg-white p-5 text-center transition-all hover:border-rellia-teal/30 hover:bg-rellia-mint/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal"
            >
              <UserPlus className="mb-2 h-8 w-8 text-rellia-teal" aria-hidden />
              <span className="font-host-grotesk text-sm font-bold text-foreground">Invite or Add Admin</span>
              <span className="mt-0.5 font-urbanist text-[11px] text-muted-foreground">Go to Supabase Auth</span>
            </a>

            <a
              href="https://vercel.com/relliahealth/~/settings/environment-variables"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center rounded-2xl border border-rellia-teal/15 bg-white p-5 text-center transition-all hover:border-rellia-teal/30 hover:bg-rellia-mint/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal"
            >
              <Key className="mb-2 h-8 w-8 text-rellia-teal" aria-hidden />
              <span className="font-host-grotesk text-sm font-bold text-foreground">Enable Signup</span>
              <span className="mt-0.5 font-urbanist text-[11px] text-muted-foreground">Go to Vercel Settings</span>
            </a>
          </div>
        </AdminTipBox>
      </AdminPageReveal>

      <AdminPageReveal delay={0.06}>
      {isLoading ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm p-4">
          <p className="font-urbanist text-sm text-destructive">
            {error instanceof Error ? error.message : "Could not load team members."}
          </p>
        </div>
      ) : null}

      {!isLoading && !error && users.length === 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm p-4">
          <AdminCompactEmptyState
            icon={Users}
            title="No team members found"
            description="Invite colleagues from Supabase Auth to grant dashboard access."
          />
        </div>
      ) : null}

      {!isLoading && !error && users.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm [&_ul]:p-3 [&_ul]:md:p-0">
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
        </div>
      ) : null}

      <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-2">
        <AdminRecentSignInsCard members={recentActivity} loading={isLoading} />
        <AdminTeamQuickNoteCard members={users} />
      </div>
      </AdminPageReveal>
    </div>
  )
}

export default AdminTeamPage
