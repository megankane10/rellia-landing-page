import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { hasPendingAuthInUrl } from "@/lib/adminAuthFromUrl"

/**
 * Supabase may redirect to Site URL (homepage) with tokens in the hash if callback URL
 * is not allowlisted. Forward those params to /admin/auth/callback so the session can finish.
 */
const AdminAuthHashRedirect = () => {
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!hasPendingAuthInUrl()) return
    if (pathname === "/admin/auth/callback" || pathname === "/admin/set-password") return

    const target = `/admin/auth/callback${search}${hash}`
    navigate(target, { replace: true })
  }, [pathname, search, hash, navigate])

  return null
}

export default AdminAuthHashRedirect
