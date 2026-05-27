import type { User } from "@supabase/supabase-js"

export const ADMIN_APP_ROLE = "admin" as const

/** True when Supabase JWT `app_metadata.role` is `admin` (set only via service role / dashboard). */
export const isAdminUser = (user: User | null | undefined): boolean => {
  if (!user) return false
  const role = user.app_metadata?.role
  return typeof role === "string" && role.trim().toLowerCase() === ADMIN_APP_ROLE
}
