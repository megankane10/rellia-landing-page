import type { Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

const SESSION_WAIT_MS = 6000

/** Allows implicit-flow hash parsing to finish before we treat the user as signed out. */
export const waitForSupabaseSession = async (): Promise<Session | null> => {
  const initial = (await supabase.auth.getSession()).data.session
  if (initial) return initial

  return new Promise((resolve) => {
    let settled = false
    const finish = (session: Session | null) => {
      if (settled) return
      settled = true
      subscription.unsubscribe()
      window.clearTimeout(timer)
      resolve(session)
    }

    const timer = window.setTimeout(() => {
      void supabase.auth.getSession().then(({ data }) => finish(data.session))
    }, SESSION_WAIT_MS)

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        session &&
        (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "TOKEN_REFRESHED")
      ) {
        finish(session)
      }
    })
  })
}
