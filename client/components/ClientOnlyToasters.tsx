import { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"

/** Radix toast portals differ between SSR and the client — mount after hydration. */
export const ClientOnlyToasters = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <Toaster />
      <Sonner />
    </>
  )
}
