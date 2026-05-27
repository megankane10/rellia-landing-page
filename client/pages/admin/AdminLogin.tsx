import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import RelliaAction from "@/components/RelliaAction"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AdminAuthLayout from "@/components/admin/AdminAuthLayout"

const AdminLogin = () => {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchParams.get("error") !== "admin_required") return
    const next = new URLSearchParams(searchParams)
    next.delete("error")
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: authError } = await signIn(email.trim(), password)
    setLoading(false)
    if (authError) {
      setError(authError)
      return
    }
    navigate("/admin/inbox", { replace: true })
  }

  return (
    <AdminAuthLayout
      leftHeading="Hello! Ready to see what's new today?"
      leftDescription="Log in to review the latest form submissions, coordinate inquiries, and easily track your website content drafts."
      title="Welcome Back"
      description="Sign in to access admin dashboard"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="admin-login-email" className="font-urbanist text-sm font-medium text-black/80">
            Email
          </Label>
          <Input
            id="admin-login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl focus-visible:ring-rellia-mint"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="admin-login-password" className="font-urbanist text-sm font-medium text-black/80">
            Password
          </Label>
          <Input
            id="admin-login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl focus-visible:ring-rellia-mint"
          />
        </div>
        {error && <p className="font-urbanist text-sm text-destructive">{error}</p>}
        <RelliaAction
          type="submit"
          disabled={loading}
          variant="tealFilled"
          size="comfortable"
          className="w-full"
        >
          {loading ? "Signing in…" : "Sign in"}
        </RelliaAction>
      </form>
    </AdminAuthLayout>
  )
}

export default AdminLogin
