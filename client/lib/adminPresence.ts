import type { AdminTeamUser } from "@/lib/adminApi"

export const ADMIN_ONLINE_WINDOW_MS = 15 * 60 * 1000

export const adminOnlineBadgeClass =
  "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/30 px-2.5 py-0.5 font-urbanist text-xs font-medium text-emerald-800 dark:text-emerald-200"

export const isAdminMemberOnlineNow = (member: AdminTeamUser, now = Date.now()): boolean => {
  if (!member.confirmedAt) return false
  const ts = member.lastActiveAt || member.lastSignInAt
  if (!ts) return false
  const t = new Date(ts).getTime()
  if (Number.isNaN(t)) return false
  return now - t <= ADMIN_ONLINE_WINDOW_MS
}
