import { Link } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import { ctaActionFromHref } from "@/components/RelliaCta"

type PagePlaceholderProps = {
  title?: string
  message?: string
  ctaLabel?: string
  ctaHref?: string
}

export default function PagePlaceholder({
  title = "Coming soon",
  message = "We are putting the finishing touches on this page. Check back shortly or get in touch if you need something in the meantime.",
  ctaLabel,
  ctaHref,
}: PagePlaceholderProps) {
  const showCta = Boolean(ctaLabel?.trim() && ctaHref?.trim())
  const ctaAction = showCta ? ctaActionFromHref(ctaLabel!.trim(), ctaHref!.trim()) : null

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-host-grotesk">
      <Navbar />
      <main
        id="main-content"
        className="mx-auto flex min-h-[60vh] max-w-[720px] flex-col items-center justify-center px-6 py-24 text-center"
      >
        <h1 className="font-urbanist text-3xl font-semibold tracking-tight text-black md:text-4xl">
          {title}
        </h1>
        {message ? (
          <p className="mt-4 font-host-grotesk text-base leading-relaxed text-black/70 md:text-lg">
            {message}
          </p>
        ) : null}
        {ctaAction ? (
          <div className="mt-8">
            <RelliaAction asChild variant="relliaCtaPrimary" size="comfortable">
              {ctaAction.to ? (
                <Link to={ctaAction.to}>{ctaAction.label}</Link>
              ) : (
                <a
                  href={ctaAction.href}
                  {...(ctaAction.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {ctaAction.label}
                </a>
              )}
            </RelliaAction>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  )
}
