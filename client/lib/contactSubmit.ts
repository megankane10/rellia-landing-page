import { createClient } from "@supabase/supabase-js"
import { clearApiCsrfCache, getApiCsrfHeaders } from "@/lib/apiCsrf"

export type ContactFormPayload = {
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle: string
  message: string
}

const getSupabaseConfig = () => {
  const url = (
    import.meta.env.VITE_SUPABASE_URL as string | undefined
  )?.trim()
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

const submitViaSupabaseClient = async (data: ContactFormPayload): Promise<void> => {
  const config = getSupabaseConfig()
  if (!config) {
    throw new Error("Supabase is not configured for the contact form.")
  }

  const supabase = createClient(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { error } = await supabase.from("contact_responses").insert({
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    company: data.company || null,
    job_title: data.jobTitle || null,
    message: data.message,
  })

  if (error) {
    const rateLimited = error.message.toLowerCase().includes("too many submissions")
    throw new Error(
      rateLimited
        ? "Too many messages from this email. Please try again in an hour."
        : error.message || "Could not send your message. Please try again.",
    )
  }
}

const submitViaApi = async (data: ContactFormPayload): Promise<void> => {
  const postOnce = async () => {
    const csrf = await getApiCsrfHeaders()
    return fetch("/api/contact", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json", ...csrf },
      body: JSON.stringify(data),
    })
  }

  let res = await postOnce()
  let json = (await res.json().catch(() => ({}))) as {
    error?: string
    code?: string
  }

  if (!res.ok && res.status === 403 && json.code === "CSRF") {
    clearApiCsrfCache()
    res = await postOnce()
    json = (await res.json().catch(() => ({}))) as { error?: string; code?: string }
  }

  if (!res.ok) {
    throw new Error(
      json.error || "Something went wrong. Please try again or email us directly.",
    )
  }
}

/** Prefer direct Supabase insert (anon RLS); fall back to server API when client env is missing. */
export const submitContactForm = async (data: ContactFormPayload): Promise<void> => {
  const config = getSupabaseConfig()

  if (config) {
    await submitViaSupabaseClient(data)
    return
  }

  await submitViaApi(data)
}
