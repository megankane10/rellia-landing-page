import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AdminAuthLayout from "@/components/admin/AdminAuthLayout"

const AdminLogin = () => {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
    navigate("/admin/dashboard", { replace: true })
  }

  return (
    <AdminAuthLayout
      title="Rellia Admin"
      description="Sign in to view diagnostic submissions."
      footer={
        <p className="font-urbanist text-center text-sm text-black/55">
          Need an account?{" "}
          <Link
            to="/admin/signup"
            className="font-medium text-rellia-teal underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint rounded"
          >
            Create one
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="admin-login-email" className="font-urbanist text-sm font-medium">
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
          <Label htmlFor="admin-login-password" className="font-urbanist text-sm font-medium">
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
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-rellia-teal text-white hover:bg-rellia-teal/90"
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AdminAuthLayout>
  )
}

export default AdminLogin
