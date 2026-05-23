import { createClient } from "@supabase/supabase-js"
import { clearApiCsrfCache, getApiCsrfHeaders } from "@/lib/apiCsrf"

export type InvestorNotifyPayload = {
  name: string
  email: string
  investmentCriteria: string
}

const getSupabaseConfig = () => {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
  const anonKey = (
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    ""
  )
    .toString()
    .trim()

  if (!url || !anonKey) return null
  return { url: url.replace(/\/$/, ""), anonKey }
}

const submitViaSupabaseClient = async (data: InvestorNotifyPayload): Promise<void> => {
  const config = getSupabaseConfig()
  if (!config) {
    throw new Error("Supabase is not configured for this form.")
  }

  const supabase = createClient(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const trimmedName = data.name.trim()
  const spaceIndex = trimmedName.indexOf(" ")
  const firstName = spaceIndex > 0 ? trimmedName.slice(0, spaceIndex) : trimmedName
  const lastName = spaceIndex > 0 ? trimmedName.slice(spaceIndex + 1).trim() : "."

  const { error } = await supabase.from("contact_responses").insert({
    first_name: firstName || trimmedName,
    last_name: lastName,
    email: data.email.trim(),
    company: null,
    job_title: null,
    message: data.investmentCriteria.trim(),
    submission_type: "investor",
  })

  if (error) {
    const rateLimited = error.message.toLowerCase().includes("too many submissions")
    throw new Error(
      rateLimited
        ? "Too many submissions from this email. Please try again in an hour."
        : error.message || "Could not submit your request. Please try again.",
    )
  }
}

const submitViaApi = async (data: InvestorNotifyPayload): Promise<void> => {
  const postOnce = async () => {
    const csrf = await getApiCsrfHeaders()
    return fetch("/api/investor-notify", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json", ...csrf },
      body: JSON.stringify(data),
    })
  }

  let res = await postOnce()
  let json = (await res.json().catch(() => ({}))) as { error?: string; code?: string }

  if (!res.ok && res.status === 403 && json.code === "CSRF") {
    clearApiCsrfCache()
    res = await postOnce()
    json = (await res.json().catch(() => ({}))) as { error?: string }
  }

  if (!res.ok) {
    throw new Error(json.error || "Something went wrong. Please try again.")
  }
}

export const submitInvestorNotifyForm = async (data: InvestorNotifyPayload): Promise<void> => {
  const config = getSupabaseConfig()
  if (config) {
    await submitViaSupabaseClient(data)
    return
  }
  await submitViaApi(data)
}
