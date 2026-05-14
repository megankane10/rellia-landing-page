/** Server sets cookie + returns token; POSTs must send matching `x-csrf-token`. */
let csrfTokenCache: string | null = null

export const clearApiCsrfCache = () => {
  csrfTokenCache = null
}

export const getApiCsrfHeaders = async (): Promise<Record<string, string>> => {
  if (!csrfTokenCache) {
    const res = await fetch("/api/csrf-token", {
      credentials: "same-origin",
    })
    if (!res.ok) {
      throw new Error("Could not initialize security token. Refresh the page.")
    }
    const j = (await res.json()) as { csrfToken?: string }
    if (!j.csrfToken?.trim()) {
      throw new Error("Invalid security token response.")
    }
    csrfTokenCache = j.csrfToken.trim()
  }
  return { "x-csrf-token": csrfTokenCache }
}
