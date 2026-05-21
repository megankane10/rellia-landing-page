import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-rellia-cream">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-rellia-mint border-t-rellia-teal" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
