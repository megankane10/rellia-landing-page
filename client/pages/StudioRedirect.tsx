import { useEffect } from "react"

export default function StudioRedirect() {
  useEffect(() => {
    window.location.replace("https://relliahealth.sanity.studio")
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-host-grotesk">
      <p className="font-urbanist text-lg text-black/70 animate-pulse">
        Redirecting to Rellia Web Studio...
      </p>
    </div>
  )
}
