import type { User } from "@supabase/supabase-js"

const FULL_NAME_KEY = "full_name"

export const getAdminDisplayName = (user: User | null | undefined): string => {
  if (!user) return ""
  const meta = user.user_metadata ?? {}
  const raw =
    (typeof meta[FULL_NAME_KEY] === "string" && meta[FULL_NAME_KEY]) ||
    (typeof meta.name === "string" && meta.name) ||
    ""
  return raw.trim()
}

export const getAdminInitials = (user: User | null | undefined): string => {
  const name = getAdminDisplayName(user)
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0]!.charAt(0)}${parts[parts.length - 1]!.charAt(0)}`.toUpperCase()
    }
    return parts[0]!.charAt(0).toUpperCase()
  }
  const email = user?.email?.trim() ?? ""
  return email ? email.charAt(0).toUpperCase() : "?"
}

export const adminUserNeedsDisplayName = (user: User | null | undefined): boolean =>
  Boolean(user) && !getAdminDisplayName(user)

export const buildAdminUserMetadata = (fullName: string) => ({
  [FULL_NAME_KEY]: fullName.trim(),
})
