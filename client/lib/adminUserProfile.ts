import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

const FULL_NAME_KEY = "full_name"
const AVATAR_URL_KEY = "avatar_url"
export const WELCOME_SPLASH_SEEN_KEY = "welcome_splash_seen"

/** Same portrait as About → Team (Megan Kane). */
export const MEGAN_AVATAR_FALLBACK_SRC = "/images/team-megankane.jpg"

const isMeganUser = (email: string | undefined, name: string): boolean => {
  const normalizedEmail = email?.trim().toLowerCase() ?? ""
  const normalizedName = name.trim().toLowerCase()
  return normalizedEmail === "megan@relliahealth.com" || normalizedName.includes("megan")
}

export const resolveAdminMemberAvatarUrl = (member: {
  email: string
  fullName: string | null
  avatarUrl: string | null
}): string => {
  if (member.avatarUrl === "removed") return ""
  if (member.avatarUrl?.trim()) return member.avatarUrl.trim()
  if (isMeganUser(member.email, member.fullName ?? "")) return MEGAN_AVATAR_FALLBACK_SRC
  return ""
}

export const getAdminFirstName = (fullName: string, fallbackEmail?: string | null): string => {
  const trimmed = fullName.trim()
  if (trimmed) {
    const first = trimmed.split(/\s+/).filter(Boolean)[0]
    if (first) return first
  }
  const emailLocal = fallbackEmail?.trim().split("@")[0]?.trim()
  return emailLocal || "there"
}

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

  if (isMeganUser(user?.email, getAdminDisplayName(user))) {
    return MEGAN_AVATAR_FALLBACK_SRC
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

export const adminUserHasSeenWelcomeSplash = (user: User | null | undefined): boolean =>
  user?.user_metadata?.[WELCOME_SPLASH_SEEN_KEY] === true

type AdminWelcomeSplashOptions = {
  forceWelcome?: boolean
  previewWelcome?: boolean
}

export const adminUserShouldSeeWelcomeSplash = (
  user: User | null | undefined,
  options?: AdminWelcomeSplashOptions,
): boolean => {
  if (options?.previewWelcome || options?.forceWelcome) return true
  if (!user || adminUserHasSeenWelcomeSplash(user)) return false
  return true
}

export const markAdminWelcomeSplashSeen = async (): Promise<{ error: string | null }> => {
  const { error } = await supabase.auth.updateUser({
    data: { [WELCOME_SPLASH_SEEN_KEY]: true },
  })
  return { error: error?.message ?? null }
}
