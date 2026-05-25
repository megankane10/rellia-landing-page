/** Keys Supabase may place in the URL hash or query after invite / recovery / magic link. */
const AUTH_URL_KEYS = [
  "access_token",
  "refresh_token",
  "type",
  "error",
  "error_description",
  "code",
  "token_hash",
] as const

export const hasPendingAuthInUrl = (): boolean => {
  const hash = window.location.hash.replace(/^#/, "").trim()
  if (hash) {
    const hashParams = new URLSearchParams(hash)
    if (AUTH_URL_KEYS.some((key) => hashParams.has(key))) return true
  }

  const query = new URLSearchParams(window.location.search)
  return query.has("code") || query.has("token_hash")
}

/** Invite / verify emails may use `token` or `token_hash` on the Supabase verify URL. */
export const readOtpTokenHash = (params: URLSearchParams): string | null => {
  const tokenHash = params.get("token_hash")?.trim()
  if (tokenHash) return tokenHash
  const token = params.get("token")?.trim()
  return token || null
}

export const readAuthTypeFromUrl = (searchParams: URLSearchParams): string | null => {
  const fromQuery = searchParams.get("type")?.trim()
  if (fromQuery) return fromQuery

  const hash = window.location.hash.replace(/^#/, "").trim()
  if (!hash) return null
  return new URLSearchParams(hash).get("type")
}

export const readHashAuthError = (): string | null => {
  const hash = window.location.hash.replace(/^#/, "").trim()
  if (!hash) return null
  const params = new URLSearchParams(hash)
  return params.get("error_description") || params.get("error")
}
