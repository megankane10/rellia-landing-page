import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaCta, { ctaActionFromHref } from "@/components/RelliaCta"
import { Sparkles } from "lucide-react"

const defaultSubtitle =
  "This page is currently under development. Stay tuned for the full Rellia Health experience!"

export default function PlaceholderPage({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  const emphasisTitle = title.startsWith("**") ? title : `**${title}**`

  return (
    <div className="flex min-h-screen flex-col bg-white font-host-grotesk overflow-x-hidden">
      <Navbar forceSolid={true} />

      <main id="main-content" className="flex flex-1 flex-col">
        <RelliaCta
          icon={<Sparkles className="h-20 w-20 text-rellia-teal" strokeWidth={1.25} />}
          title={emphasisTitle}
          body={subtitle ?? defaultSubtitle}
          primary={ctaActionFromHref("Back to home", "/")}
          secondary={ctaActionFromHref("Get in touch", "/contact")}
          className="flex-1"
        />
      </main>

      <Footer />
    </div>
  )
}
