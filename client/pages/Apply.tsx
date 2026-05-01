import { useLayoutEffect } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const FILLOUT_FORM_ID = "r5hdDmQodfus"
/** Fillout only hydrates embeds present when the embed script runs; SPA navigations mount later. */
const FILLOUT_EMBED_SCRIPT_SRC = "https://server.fillout.com/embed/v1/"

export default function Apply() {
  useLayoutEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${FILLOUT_EMBED_SCRIPT_SRC}"]`)
    if (existing) existing.remove()

    const script = document.createElement("script")
    script.src = FILLOUT_EMBED_SCRIPT_SRC
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white font-host-grotesk">
      <Navbar />

      <main
        id="main-content"
        className="flex w-full flex-1 flex-col pt-[72px] md:pt-[86px]"
      >
        <div
          data-fillout-id={FILLOUT_FORM_ID}
          data-fillout-embed-type="standard"
          data-fillout-inherit-parameters
          className="h-[calc(100svh-72px)] w-full md:h-[calc(100svh-86px)]"
          aria-label="Rellia application form"
        />
      </main>

      <Footer />
    </div>
  )
}
