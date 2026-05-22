/** True when admin self-signup is allowed (accepts true, 1, yes, on; strips quotes). */
export const isAdminSignupEnabled = (): boolean => {
  const raw = (process.env.ADMIN_SIGNUP_ENABLED ?? "").trim().toLowerCase()
  if (!raw) return false
  const normalized = raw.replace(/^["']|["']$/g, "")
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on"
}
