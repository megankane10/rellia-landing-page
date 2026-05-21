import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    <div className="flex min-h-screen items-center justify-center bg-rellia-cream px-4">
      <Card className="w-full max-w-sm rounded-[20px] border border-black/10 shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-host-grotesk text-xl font-bold text-rellia-teal">
            Rellia Admin
          </CardTitle>
          <CardDescription className="font-urbanist text-black/60">
            Sign in to view diagnostic submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="font-urbanist text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl focus-visible:ring-rellia-mint"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="font-urbanist text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl focus-visible:ring-rellia-mint"
              />
            </div>
            {error && (
              <p className="font-urbanist text-sm text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-rellia-teal text-white hover:bg-rellia-teal/90"
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminLogin
