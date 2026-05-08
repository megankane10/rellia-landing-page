import { useEffect } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const getStudioUrl = (): string => {
  const url = (import.meta.env.VITE_SANITY_STUDIO_URL as string | undefined)?.trim()
  return url || ""
}

export default function StudioRedirect() {
  useEffect(() => {
    const url = getStudioUrl()
    if (!url) return
    window.location.replace(url)
  }, [])

  const url = getStudioUrl()

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />
      <main
        id="main-content"
        className="flex min-h-[50vh] flex-col items-center justify-center px-6 pb-24 pt-32 text-center md:pt-40"
      >
        <p className="max-w-md font-urbanist text-lg leading-relaxed text-black/70">
          {url ? "Opening the CMS…" : "CMS link is not configured."}
        </p>
        {url ? (
          <a
            href={url}
            className="mt-6 font-host-grotesk text-base font-semibold text-rellia-teal underline underline-offset-4 transition-colors hover:text-rellia-teal/90"
          >
            Continue to CMS
          </a>
        ) : (
          <p className="mt-4 max-w-md font-urbanist text-sm leading-relaxed text-black/55">
            Set <span className="font-mono">VITE_SANITY_STUDIO_URL</span> in your Vercel environment variables.
          </p>
        )}
      </main>
      <Footer />
    </div>
  )
}
