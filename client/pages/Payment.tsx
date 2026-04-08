import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Check, CheckCircle2, Copy } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import { usePaymentPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_PAYMENT_PAGE, DEFAULT_STRIPE_PAYMENT_LINK_FALLBACK } from "@shared/cms/defaults"
import { cn } from "@/lib/utils"

export default function Payment() {
  const { data: paymentCms } = usePaymentPage()
  const p = paymentCms ?? DEFAULT_PAYMENT_PAGE

  const [codeCopied, setCodeCopied] = useState(false)

  const monthlyHref =
    (import.meta.env.VITE_STRIPE_MONTHLY_PLAN_LINK as string | undefined)?.trim() || DEFAULT_STRIPE_PAYMENT_LINK_FALLBACK
  const annualHref =
    (import.meta.env.VITE_STRIPE_ANNUAL_PLAN_LINK as string | undefined)?.trim() || DEFAULT_STRIPE_PAYMENT_LINK_FALLBACK

  const handleCopyCode = () => {
    const code = p.discountBannerSubtitle.trim() || "RELLIA50"
    void navigator.clipboard.writeText(code).then(() => {
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    })
  }

  const paymentHeadingParts = useMemo(() => {
    const raw = p.benefitsTitle ?? ""
    const needle = "Rellia Health"
    if (!raw.includes(needle)) {
      return { before: "Join the ", accent: "Rellia Health", after: " Network" }
    }
    const [before, after] = raw.split(needle)
    return { before: before || "", accent: needle, after: after || "" }
  }, [p.benefitsTitle])

  useEffect(() => {
    const meta = document.createElement("meta")
    meta.name = "robots"
    meta.content = "noindex, nofollow"
    document.head.appendChild(meta)
    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  const benefitsImageSrc = "/images/benefits-payment.jpg"

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main>
        <>
          <section className="relative overflow-hidden bg-rellia-teal pt-[87px]">
            <div className="pointer-events-none absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rellia-mint via-transparent to-transparent blur-3xl" />
            </div>
            <img
              src="/images/hologram-logo.png"
              alt=""
              aria-hidden
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[70%] md:h-[90%] w-auto object-contain opacity-[0.07] select-none"
            />

            <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10 pt-16 pb-36 md:pt-24 md:pb-44">
              <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
                <span>{p.heroHeadlinePrefix}</span>
                <span className="text-rellia-mint">{p.heroHeadlineAccent}</span>
                <br />
                <span>{p.heroHeadlineSuffix}</span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl max-w-3xl font-urbanist leading-relaxed">{p.heroSubheadline}</p>
            </div>
          </section>

          <section className="relative z-10 -mt-16 px-4 md:-mt-24 md:px-8">
            <div className="absolute inset-x-0 bottom-0 top-16 bg-rellia-cream md:top-24" aria-hidden />
            <div className="relative mx-auto max-w-[1300px]">
              <div
                className="relative overflow-hidden rounded-[40px] bg-cover bg-center md:rounded-[56px]"
                style={{ backgroundImage: `url(${benefitsImageSrc})` }}
              >
                <div className="absolute inset-0 bg-black/55" aria-hidden />

                <div className="relative px-6 pb-[150px] pt-9 md:px-10 md:pb-[220px] md:pt-11 lg:px-12">
                  <div className="max-w-2xl space-y-3 md:space-y-4">
                    <span className="inline-flex w-fit items-center rounded-[20px] border border-rellia-mint/70 bg-rellia-mint/90 px-4 py-1.5 font-urbanist text-sm font-semibold text-rellia-teal">
                      {p.imageCardBadge}
                    </span>
                    <h2 className="font-host-grotesk text-3xl font-bold leading-tight tracking-[-0.02em] text-white md:text-[40px] md:leading-tight w-3/4">
                      <span>{p.imageCardHeadlinePrefix}</span>
                      <span className="text-rellia-mint">{p.imageCardHeadlineAccent}</span>
                    </h2>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="grid grid-cols-1 border-t border-white/35 bg-gradient-to-b from-transparent to-rellia-teal sm:grid-cols-2 lg:grid-cols-4">
                      {p.highlightBenefits.map((line, index) => (
                        <div
                          key={`${index}-${line.slice(0, 20)}`}
                          className={cn(
                            "group relative flex min-h-[140px] items-center justify-center overflow-hidden px-6 py-7 text-center md:min-h-[160px] md:px-8 lg:min-h-[190px]",
                            index > 0 && "border-t border-white/35 sm:border-t-0 sm:border-l lg:border-t-0",
                          )}
                        >
                          <span
                            className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-700 ease-in-out group-hover:scale-y-100"
                            aria-hidden
                          />
                          <p className="relative z-10 font-urbanist text-base font-semibold leading-snug tracking-[-0.01em] text-white/90 transition-colors duration-700 ease-in-out group-hover:text-primary-foreground md:text-lg">
                            {line}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-x-hidden bg-rellia-cream py-20 md:py-24">
            <div className="mx-auto max-w-[1100px] px-6 md:px-10">
              <h2 className="mb-10 text-center font-host-grotesk text-3xl font-semibold tracking-tight text-black md:mb-12 md:text-[40px] md:leading-tight">
                <span>{paymentHeadingParts.before || "Join the "}</span>
                <span className="text-rellia-teal">{paymentHeadingParts.accent}</span>
                <span>{paymentHeadingParts.after || " Network"}</span>
              </h2>

              <ul className="mx-auto flex max-w-3xl flex-col gap-4 md:gap-5" role="list">
                {p.benefits.map((benefit, index) => (
                  <li key={`${index}-${benefit.slice(0, 20)}`} className="flex list-none items-start gap-3 md:gap-4">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-rellia-teal" aria-hidden />
                    <span className="font-urbanist text-base leading-relaxed text-black/75 md:text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-12 grid grid-cols-1 items-end gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
                <div className="flex flex-col rounded-[24px] border border-black/8 bg-white p-6 shadow-sm md:p-8">
                  <div className="mx-auto mb-6 flex h-[30px] w-fit items-center justify-center rounded-full border border-black/15 bg-transparent px-4">
                    <span className="font-urbanist text-sm text-black/60">{p.pricingMonthlyBadge}</span>
                  </div>
                  <div className="mb-6 text-center">
                    <span className="font-host-grotesk text-5xl font-bold tracking-[-0.02em] text-rellia-teal md:text-6xl">
                      {p.pricingMonthlyAmount}
                    </span>
                    <span className="font-host-grotesk text-xl font-bold text-[#5e5c5c] md:text-[23px]">{p.pricingPerSuffix}</span>
                  </div>
                  <div className="mt-auto">
                    <div className="mb-6 h-px w-full bg-black/10" />
                    <RelliaAction asChild variant="tealCardFull" className="h-[52px] text-base">
                      <a href={monthlyHref} target="_blank" rel="noopener noreferrer">
                        {p.monthlyProceedLabel}
                        <ArrowRight />
                      </a>
                    </RelliaAction>
                  </div>
                </div>

                <div className="flex flex-col rounded-[28px] bg-rellia-teal p-2 shadow-sm">
                  <div className="pb-2 pt-3 text-center">
                    <span className="font-host-grotesk text-xs font-extrabold uppercase tracking-[0.15em] text-white">{p.popularLabel}</span>
                  </div>
                  <div className="flex flex-1 flex-col rounded-[20px] bg-white p-6 md:p-8">
                    <div className="mx-auto mb-6 flex h-[30px] w-fit items-center justify-center rounded-full border border-black/15 bg-transparent px-4">
                      <span className="font-urbanist text-sm text-black/60">{p.pricingAnnualBadge}</span>
                    </div>
                    <div className="mb-6 text-center">
                      <span className="font-host-grotesk text-5xl font-bold tracking-[-0.02em] text-rellia-teal md:text-6xl">
                        {p.pricingAnnualAmount}
                      </span>
                      <span className="font-host-grotesk text-xl font-bold text-[#5e5c5c] md:text-[23px]">{p.pricingPerSuffix}</span>
                    </div>
                    <div className="mt-auto">
                      <div className="mb-6 h-px w-full bg-black/10" />
                      <RelliaAction asChild variant="tealCardFull" className="h-[52px] text-base">
                        <a href={annualHref} target="_blank" rel="noopener noreferrer">
                          {p.annualProceedLabel}
                          <ArrowRight />
                        </a>
                      </RelliaAction>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="mt-8 flex flex-col items-stretch gap-4 rounded-[24px] bg-black px-5 py-4 text-white md:mt-10 md:flex-row md:items-center md:justify-between md:gap-6 md:px-8 md:py-5"
                role="region"
                aria-label="Promotional offer"
              >
                <div className="flex flex-1 flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                  {p.discountBannerBadge.trim() ? (
                    <span className="inline-flex shrink-0 items-center rounded-full border border-[#05d66a] bg-[rgba(38,221,127,0.28)] px-4 py-1.5 font-urbanist text-sm font-bold text-[#08d36a]">
                      {p.discountBannerBadge.trim()}
                    </span>
                  ) : null}
                  <p className="inline-flex flex-wrap items-center gap-2 font-host-grotesk text-base font-medium leading-snug tracking-[-0.01em] md:text-lg">
                    {p.discountBannerTitle.trim()}
                    {p.discountBannerSubtitle.trim() ? (
                      <span className="font-mono">{p.discountBannerSubtitle.trim()}</span>
                    ) : null}
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      aria-label="Copy promo code"
                      className="inline-flex items-center justify-center rounded-md p-1 text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    >
                      {codeCopied ? <Check className="h-4 w-4 text-[#08d36a]" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </p>
                </div>
              </div>

              <div className="mt-16 rounded-3xl bg-rellia-teal px-8 py-14 text-center md:mt-20 md:px-16 md:py-20">
                <h3 className="mx-auto mb-8 max-w-[760px] font-host-grotesk text-3xl font-bold leading-tight tracking-tight text-white md:text-[40px]">
                  {p.questionsTitle}
                </h3>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
                  <RelliaAction asChild variant="mintOnTealStrip" className="min-w-[220px] px-8 py-4 text-base">
                    <Link to={p.questionsFaqPath}>{p.questionsFaqLabel}</Link>
                  </RelliaAction>
                  <RelliaAction asChild variant="heroSolidOnTeal" className="min-w-[220px] px-8 py-4 text-base">
                    <Link to={p.questionsContactPath}>{p.questionsContactLabel}</Link>
                  </RelliaAction>
                </div>
              </div>
            </div>
          </section>
        </>
      </main>

      <Footer />
    </div>
  )
}
