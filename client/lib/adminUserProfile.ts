import type { User } from "@supabase/supabase-js"

const FULL_NAME_KEY = "full_name"
const AVATAR_URL_KEY = "avatar_url"

export const getAdminDisplayName = (user: User | null | undefined): string => {
  if (!user) return ""
  const meta = user.user_metadata ?? {}
  const raw =
    (typeof meta[FULL_NAME_KEY] === "string" && meta[FULL_NAME_KEY]) ||
    (typeof meta.name === "string" && meta.name) ||
    ""
  return raw.trim()
}

export const getAdminAvatarUrl = (user: User | null | undefined): string => {
  const meta = user?.user_metadata ?? {}
  const raw =
    (typeof meta[AVATAR_URL_KEY] === "string" && meta[AVATAR_URL_KEY]) ||
    (typeof meta.picture === "string" && meta.picture) ||
    ""
  const val = raw.trim()
  if (val === "removed") return ""
  if (val) return val

  // Fallback for Megan Kane if no avatar is explicitly uploaded
  const email = user?.email?.trim().toLowerCase()
  const name = getAdminDisplayName(user).toLowerCase()
  if (email === "megan@relliahealth.com" || name.includes("megan")) {
    return "/images/megan-headshot.jpeg"
  }

  return ""
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
