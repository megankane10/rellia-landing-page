import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import type { StripeEmbeddedCheckout } from "@stripe/stripe-js"
import { ArrowRight, CheckCircle2, X } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import RelliaAction from "@/components/RelliaAction"
import { usePaymentPage } from "@/hooks/useCmsDocuments"
import { DEFAULT_PAYMENT_PAGE } from "@shared/cms/defaults"
import { cn } from "@/lib/utils"

const STRIPE_PAYMENT_FALLBACK_URL = "https://buy.stripe.com/14A4gs2jF6Lla0HgCC6wE03"

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined

const scrollToAnnualCheckout = () => {
  document.getElementById("rellia-checkout")?.scrollIntoView({ behavior: "smooth", block: "start" })
}

const scrollToEmbeddedCheckout = () => {
  document.getElementById("rellia-checkout")?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export default function Payment() {
  const { data: paymentCms } = usePaymentPage()
  const p = paymentCms ?? DEFAULT_PAYMENT_PAGE

  const [paymentComplete, setPaymentComplete] = useState(false)
  const [useFallbackLink, setUseFallbackLink] = useState(false)
  const [embedLoading, setEmbedLoading] = useState(true)
  const [checkoutError, setCheckoutError] = useState(false)
  const checkoutRef = useRef<StripeEmbeddedCheckout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [discountDismissed, setDiscountDismissed] = useState(false)

  const showDiscountBanner =
    p.discountBannerEnabled &&
    !discountDismissed &&
    (p.discountBannerTitle.trim().length > 0 ||
      p.discountBannerSubtitle.trim().length > 0 ||
      p.discountBannerBadge.trim().length > 0)

  useEffect(() => {
    try {
      setDiscountDismissed(localStorage.getItem("rellia_discount_dismissed") === "1")
    } catch {
      setDiscountDismissed(false)
    }
  }, [])

  const handleDismissDiscount = () => {
    setDiscountDismissed(true)
    try {
      localStorage.setItem("rellia_discount_dismissed", "1")
    } catch {
      // ignore
    }
  }

  const introBody = useFallbackLink
    ? checkoutError
      ? p.introFallbackError
      : p.introFallback
    : p.introCheckout

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

  useEffect(() => {
    if (!publishableKey) {
      setUseFallbackLink(true)
      setEmbedLoading(false)
      return
    }

    let cancelled = false

    const run = async () => {
      setEmbedLoading(true)
      setUseFallbackLink(false)
      setCheckoutError(false)

      const stripe = await loadStripe(publishableKey)
      if (!stripe || cancelled) {
        setUseFallbackLink(true)
        setEmbedLoading(false)
        return
      }

      const fetchClientSecret = async () => {
        const res = await fetch("/api/create-embedded-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        })
        const data = (await res.json()) as { clientSecret?: string }
        if (!res.ok || !data.clientSecret) {
          throw new Error("Checkout session failed")
        }
        return data.clientSecret
      }

      const handleComplete = () => {
        checkoutRef.current?.destroy()
        checkoutRef.current = null
        setPaymentComplete(true)
        setEmbedLoading(false)
      }

      try {
        const checkout = await stripe.createEmbeddedCheckoutPage({
          fetchClientSecret,
          onComplete: handleComplete,
        })
        checkoutRef.current = checkout

        if (cancelled) {
          checkout.destroy()
          checkoutRef.current = null
          return
        }

        const el = containerRef.current
        if (!el) {
          checkout.destroy()
          checkoutRef.current = null
          setUseFallbackLink(true)
          setEmbedLoading(false)
          return
        }

        checkout.mount(el)
        setEmbedLoading(false)
      } catch {
        if (!cancelled) {
          setCheckoutError(true)
          setUseFallbackLink(true)
          setEmbedLoading(false)
        }
      }
    }

    void run()

    return () => {
      cancelled = true
      checkoutRef.current?.destroy()
      checkoutRef.current = null
    }
  }, [])

  const handleMonthlyProceed = () => {
    if (useFallbackLink) return
    scrollToAnnualCheckout()
  }

  const handleAnnualProceed = () => {
    if (useFallbackLink) return
    scrollToEmbeddedCheckout()
  }

  const applyHref = p.discountBannerApplyHref.trim()
  const benefitsImageSrc = "/images/benefits-payment.jpg"

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />

      <main>
        {paymentComplete ? (
          <section className="relative overflow-x-hidden bg-white pb-24 pt-28 md:pb-28 md:pt-36">
            <div className="relative z-10 mx-auto max-w-lg px-6 md:px-10">
              <div className="rounded-[27px] border border-black/10 bg-white p-8 shadow-[4px_9px_29px_rgba(0,0,0,0.12)] md:p-10">
                <p className="mb-2 font-urbanist text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
                  {p.badge}
                </p>
                <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-black md:text-4xl">
                  {p.successTitle}
                </h1>
                <p className="font-urbanist text-base leading-relaxed text-black/60 md:text-lg">
                  {p.successBody}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="relative overflow-hidden bg-rellia-teal pt-[87px] md:pt-[87px]">
              <div
                className="pointer-events-none absolute -right-4 bottom-0 top-[14%] w-[min(100vw,620px)] opacity-[0.07] md:right-8 lg:right-16"
                aria-hidden
              >
                <img
                  src="/images/hologram-logo.png"
                  alt=""
                  className="h-full w-full object-contain object-right"
                />
              </div>

              <div className="relative z-10 mx-auto flex min-h-[727px] max-w-[1100px] items-center px-6 py-20 md:px-10 md:py-24">
                <div className="w-full">
                  <h1 className="max-w-[760px] font-host-grotesk text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.28)] md:text-6xl md:leading-[1.05]">
                    <span>{p.heroHeadlinePrefix}</span>
                    <span className="text-rellia-mint">{p.heroHeadlineAccent}</span>
                    <span>{p.heroHeadlineSuffix}</span>
                  </h1>
                  <p className="mt-6 max-w-2xl font-urbanist text-base leading-7 text-white/90 drop-shadow-[0_2px_14px_rgba(0,0,0,0.25)] md:mt-8 md:text-xl md:leading-8">
                    {p.heroSubheadline}
                  </p>
                </div>
              </div>
            </section>

            <section className="relative z-10 -mt-44 bg-white px-4 md:-mt-52 md:px-8">
              <div className="mx-auto max-w-[1300px]">
                <div
                  className="relative overflow-hidden rounded-[56px] bg-fixed bg-cover bg-center"
                  style={{ backgroundImage: `url(${benefitsImageSrc})` }}
                >
                  <div className="absolute inset-0 bg-white/14" aria-hidden />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90.55deg, rgba(13, 53, 64, 0.68) 10.46%, rgba(13, 53, 64, 0.22) 58%, rgba(13, 53, 64, 0) 92.65%)",
                    }}
                    aria-hidden
                  />

                  <div className="relative min-h-[82vh] max-h-[820px] px-6 pb-[240px] pt-12 md:min-h-[720px] md:px-10 md:pb-[277px] md:pt-14 lg:px-12">
                    <div className="max-w-2xl space-y-4 md:space-y-6">
                      <span className="inline-flex w-fit items-center rounded-[20px] border border-rellia-mint/70 bg-rellia-mint/90 px-4 py-1.5 font-urbanist text-sm font-semibold text-rellia-teal">
                        {p.imageCardBadge}
                      </span>
                    <h2 className="font-host-grotesk text-3xl font-bold leading-tight tracking-[-0.02em] text-white md:text-[40px] md:leading-tight">
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
                              "group relative flex min-h-[200px] items-center justify-center overflow-hidden px-8 py-10 text-center md:min-h-[240px] lg:min-h-[277px]",
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
                      <span className="font-urbanist text-base leading-relaxed text-black/75 md:text-lg">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-12 grid grid-cols-1 items-stretch gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
                  <div className="flex min-h-[349px] flex-col rounded-[24px] border border-black/5 bg-white/85 p-6 shadow-sm backdrop-blur md:p-8">
                    <div className="mx-auto mb-6 flex h-[30px] w-fit items-center justify-center rounded-full border border-rellia-teal/20 bg-rellia-teal/5 px-4">
                      <span className="font-urbanist text-sm text-rellia-teal">{p.pricingMonthlyBadge}</span>
                    </div>
                    <div className="mb-6 text-center">
                      <span className="font-host-grotesk text-5xl font-bold tracking-[-0.02em] text-rellia-teal md:text-6xl">
                        {p.pricingMonthlyAmount}
                      </span>
                      <span className="font-host-grotesk text-xl font-bold text-[#5e5c5c] md:text-[23px]">
                        {p.pricingPerSuffix}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <div className="mb-6 h-px w-full bg-black/10" />
                      {useFallbackLink ? (
                        <RelliaAction asChild variant="tealCardFull" className="h-[52px] text-base">
                          <a href={STRIPE_PAYMENT_FALLBACK_URL} target="_blank" rel="noopener noreferrer">
                            {p.monthlyProceedLabel}
                            <ArrowRight />
                          </a>
                        </RelliaAction>
                      ) : (
                        <RelliaAction
                          type="button"
                          onClick={handleMonthlyProceed}
                          variant="tealCardFull"
                          className="h-[52px] text-base"
                        >
                          {p.monthlyProceedLabel}
                          <ArrowRight />
                        </RelliaAction>
                      )}
                    </div>
                  </div>

                  <div className="flex min-h-[349px] flex-col rounded-[24px] border border-black/5 bg-white/85 p-6 shadow-sm backdrop-blur md:p-8">
                    <div className="mx-auto mb-5 flex h-[30px] w-fit items-center justify-center rounded-full bg-rellia-teal px-4">
                      <span className="font-host-grotesk text-xs font-extrabold uppercase tracking-wide text-white">
                        {p.popularLabel}
                      </span>
                    </div>
                    <div id="rellia-annual-checkout" className="flex h-full flex-col">
                        <div className="mx-auto mb-6 flex h-[30px] w-fit items-center justify-center rounded-full border border-rellia-teal/20 bg-rellia-teal/5 px-4">
                          <span className="font-urbanist text-sm text-rellia-teal">{p.pricingAnnualBadge}</span>
                        </div>
                        <div className="mb-6 text-center">
                          <span className="font-host-grotesk text-5xl font-bold tracking-[-0.02em] text-rellia-teal md:text-6xl">
                            {p.pricingAnnualAmount}
                          </span>
                          <span className="font-host-grotesk text-xl font-bold text-[#5e5c5c] md:text-[23px]">
                            {p.pricingPerSuffix}
                          </span>
                        </div>
                        <div className="mt-auto">
                          <div className="mb-6 h-px w-full bg-black/10" />
                          {useFallbackLink ? (
                            <RelliaAction asChild variant="tealCardFull" className="h-[52px] text-base">
                              <a href={STRIPE_PAYMENT_FALLBACK_URL} target="_blank" rel="noopener noreferrer">
                                {p.annualProceedLabel}
                                <ArrowRight />
                              </a>
                            </RelliaAction>
                          ) : (
                            <RelliaAction
                              type="button"
                              onClick={handleAnnualProceed}
                              variant="tealCardFull"
                              className="h-[52px] text-base"
                            >
                              {p.annualProceedLabel}
                              <ArrowRight />
                            </RelliaAction>
                          )}
                        </div>
                    </div>
                  </div>
                </div>

                {showDiscountBanner ? (
                  <div
                    className="mx-auto mt-12 flex max-w-[1100px] flex-col items-stretch gap-4 rounded-[22px] bg-black px-4 py-5 text-white md:mt-14 md:flex-row md:items-center md:justify-between md:gap-6 md:px-7 md:py-5"
                    role="region"
                    aria-label="Promotional offer"
                  >
                    <div className="flex flex-1 flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                      {p.discountBannerBadge.trim() ? (
                        <span className="inline-flex shrink-0 items-center rounded-[20px] border border-[#05d66a] bg-[rgba(38,221,127,0.28)] px-4 py-1.5 font-urbanist text-sm font-bold text-[#08d36a]">
                          {p.discountBannerBadge.trim()}
                        </span>
                      ) : null}
                      <p className="font-host-grotesk text-base font-medium leading-snug tracking-[-0.01em] md:text-lg lg:text-xl">
                        {p.discountBannerTitle.trim()}
                        {p.discountBannerSubtitle.trim() ? (
                          <span className="ml-1 font-mono text-lg md:text-xl">{p.discountBannerSubtitle.trim()}</span>
                        ) : null}
                      </p>
                    </div>
                    {p.discountBannerApplyLabel.trim() ? (
                      applyHref ? (
                        applyHref.startsWith("http") ? (
                          <a
                            href={applyHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-[52px] shrink-0 items-center justify-center rounded-[25px] border border-white bg-black px-8 font-host-grotesk text-lg font-medium text-white transition-colors hover:bg-white/10 md:min-w-[190px]"
                          >
                            {p.discountBannerApplyLabel.trim()}
                          </a>
                        ) : (
                          <Link
                            to={applyHref}
                            className="inline-flex h-[52px] shrink-0 items-center justify-center rounded-[25px] border border-white bg-black px-8 font-host-grotesk text-lg font-medium text-white transition-colors hover:bg-white/10 md:min-w-[190px]"
                          >
                            {p.discountBannerApplyLabel.trim()}
                          </Link>
                        )
                      ) : (
                        <span className="inline-flex h-[52px] shrink-0 items-center justify-center rounded-[25px] border border-white bg-black px-8 font-host-grotesk text-lg font-medium text-white md:min-w-[190px]">
                          {p.discountBannerApplyLabel.trim()}
                        </span>
                      )
                    ) : null}
                    <button
                      type="button"
                      onClick={handleDismissDiscount}
                      className="inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[25px] border border-white/40 bg-black text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      aria-label="Dismiss offer"
                    >
                      <X className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                ) : null}

                {!useFallbackLink ? (
                  <div
                    id="rellia-checkout"
                    className="mx-auto mt-10 max-w-[1100px] rounded-3xl border border-black/10 bg-white p-6 shadow-md md:mt-12 md:p-10"
                  >
                    <h3 className="font-host-grotesk text-2xl font-semibold tracking-tight text-black md:text-3xl">
                      {p.headline}
                    </h3>
                    <p className="mt-3 max-w-2xl font-urbanist text-base leading-relaxed text-black/60 md:text-lg">
                      {p.introCheckout}
                    </p>

                    {embedLoading ? (
                      <p className="mt-6 font-urbanist text-base text-black/50">Loading checkout…</p>
                    ) : null}

                    <div
                      ref={containerRef}
                      className="mt-6 min-h-[480px] w-full [&_iframe]:min-h-[480px]"
                      aria-live="polite"
                    />
                  </div>
                ) : null}

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
        )}
      </main>

      <Footer />
    </div>
  )
}
