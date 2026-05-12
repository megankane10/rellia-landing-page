import { useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import RelliaAction from "@/components/RelliaAction"
import { NETWORK_PATH_ROLE_TAG } from "@/lib/networkPathRoles"
import NetworkEyebrow from "@/components/network/NetworkEyebrow"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { PAGE_HEADER_TITLE_SIZE_CLASS } from "@/components/PageHeader"

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={reduceMotion ? undefined : { duration: 0.7, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  )
}

export function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md shadow-[0_22px_70px_-55px_rgba(0,0,0,0.75)]",
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Inner width aligned with `PageHeader` and marketing pages */
export const PATH_INNER = "max-w-[1300px] mx-auto w-full"

export function SectionShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("bg-rellia-teal px-6 md:px-10 text-white", className)}>
      <div className="max-w-[1440px] mx-auto w-full">{children}</div>
    </section>
  )
}

export function LightSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={cn("bg-white px-6 md:px-10 py-16 md:py-24 text-black", className)}>
      <div className={PATH_INNER}>{children}</div>
    </section>
  )
}

export function CreamSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={cn("bg-rellia-cream/35 px-6 md:px-10 py-16 md:py-24 text-black", className)}>
      <div className={PATH_INNER}>{children}</div>
    </section>
  )
}

/** Glass surface for light backgrounds — matches site blur + subtle border */
export function GlassCardLight({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-black/10 bg-white/80 backdrop-blur-md shadow-[0_22px_70px_-55px_rgba(13,53,64,0.22)]",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function AiGeneratedNote() {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md px-4 py-3 text-white/85 shadow-sm">
      <p className="font-urbanist text-sm leading-relaxed">
        <span className="font-semibold text-white">Note:</span> This page was fully generated with AI and hasn’t been
        reworked yet with deeper thinking and section refinement.
      </p>
    </div>
  )
}

export function ProblemBlock({
  items,
}: {
  items: Array<{ title: string; body: string }>
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((i) => (
        <GlassCard key={i.title} className="p-7">
          <p className="font-host-grotesk text-xl font-semibold tracking-tight text-white">{i.title}</p>
          <p className="mt-3 font-urbanist text-white/75 leading-relaxed">{i.body}</p>
        </GlassCard>
      ))}
    </div>
  )
}

export function BentoGrid({
  items,
}: {
  items: Array<{
    title: string
    body: string
    imageUrl: string
    span?: "wide" | "tall" | "normal"
  }>
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {items.map((i) => (
        <GlassCard
          key={i.title}
          className={cn(
            "overflow-hidden",
            i.span === "wide" && "md:col-span-8",
            i.span === "tall" && "md:col-span-6 md:row-span-2",
            (!i.span || i.span === "normal") && "md:col-span-6",
          )}
        >
          <div className="grid grid-cols-1 sm:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[220px] sm:min-h-[280px]">
              <img
                src={i.imageUrl}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
            </div>
            <div className="bg-white p-7 sm:p-9">
              <p className="font-host-grotesk text-2xl font-semibold tracking-tight text-rellia-teal">{i.title}</p>
              <p className="mt-3 font-urbanist text-black/70 leading-relaxed">{i.body}</p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}

export function PathToSuccess({
  steps,
}: {
  steps: Array<{ title: string; body: string }>
}) {
  return (
    <GlassCard className="p-7 md:p-9">
      {/* Mobile: stacked */}
      <div className="flex flex-col gap-5 md:hidden">
        {steps.map((s, idx) => (
          <div key={s.title} className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white font-host-grotesk font-bold"
              aria-hidden
            >
              {idx + 1}
            </div>
            <div>
              <p className="font-host-grotesk text-lg font-semibold text-white tracking-tight">{s.title}</p>
              <p className="mt-2 font-urbanist text-white/75 leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: icons row with centered connectors (no line over text) */}
      <div className="hidden md:block relative">
        <div aria-hidden className="absolute left-10 right-10 top-5 h-px bg-white/20" />
        <div className="grid grid-cols-4 gap-8">
          {steps.map((s, idx) => (
            <div key={s.title} className="relative z-10">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white font-host-grotesk font-bold"
                aria-hidden
              >
                {idx + 1}
              </div>
              <div className="mt-5">
                <p className="font-host-grotesk text-lg font-semibold text-white tracking-tight">{s.title}</p>
                <p className="mt-2 font-urbanist text-white/75 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}

type FormState = "step1" | "step2" | "success"

export function MultiStepSignupForm({
  ctaLabel,
  roleLabel,
  step2Fields,
}: {
  ctaLabel: string
  roleLabel: string
  step2Fields: Array<{ name: string; label: string; placeholder: string }>
}) {
  const [state, setState] = useState<FormState>("step1")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [details, setDetails] = useState<Record<string, string>>({})

  const canContinue = useMemo(() => name.trim().length > 1 && email.includes("@"), [name, email])

  return (
    <GlassCard className="p-7 md:p-9">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">High-conversion signup</p>
          <p className="mt-2 font-host-grotesk text-2xl md:text-3xl font-semibold tracking-tight text-white">
            Tell us who you are
          </p>
          <p className="mt-3 font-urbanist text-white/75 leading-relaxed max-w-2xl">
            A quick first step so we can match you to the right programs, introductions, and resources—without a long
            back-and-forth.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", state !== "step1" ? "bg-white/35" : "bg-[#ccfbf1]")} />
          <span className={cn("h-2.5 w-2.5 rounded-full", state == "success" ? "bg-[#ccfbf1]" : "bg-white/20")} />
        </div>
      </div>

      <div className="mt-8">
        {state === "success" ? (
          <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
            <p className="font-host-grotesk text-xl font-semibold text-white tracking-tight">You’re in.</p>
            <p className="mt-2 font-urbanist text-white/75 leading-relaxed">
              We’ll follow up soon. In the meantime, keep building—momentum wins.
            </p>
          </div>
        ) : state === "step1" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-white/80">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/25"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-white/80">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/25"
              />
            </label>
            <div className="md:col-span-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
              <p className="font-urbanist text-white/60 text-sm">
                Step 1 of 2 — quick start (Name + Email)
              </p>
              <RelliaAction
                type="button"
                variant="mintOnTealStrip"
                size="comfortable"
                className="bg-[#ccfbf1] border-[#ccfbf1] hover:bg-transparent hover:border-white text-[#022c2e]"
                disabled={!canContinue}
                onClick={() => setState("step2")}
                aria-label="Continue to step 2"
              >
                Continue
              </RelliaAction>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-white/80">{roleLabel} details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {step2Fields.map((f) => (
                <label key={f.name} className="block">
                  <span className="text-sm font-semibold text-white/80">{f.label}</span>
                  <input
                    value={details[f.name] ?? ""}
                    onChange={(e) => setDetails((d) => ({ ...d, [f.name]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/25"
                  />
                </label>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
              <button
                type="button"
                onClick={() => setState("step1")}
                className="text-left text-sm font-semibold text-white/70 hover:text-white"
              >
                Back
              </button>
              <RelliaAction
                type="button"
                variant="mintOnTealStrip"
                size="comfortable"
                className="bg-[#ccfbf1] border-[#ccfbf1] hover:bg-transparent hover:border-white text-[#022c2e]"
                onClick={() => setState("success")}
                aria-label={ctaLabel}
              >
                {ctaLabel}
              </RelliaAction>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  )
}

export function RoleHero({
  roleId,
  eyebrowLabel,
  title,
  subtitle,
  imageSrc,
  primaryCta,
  secondaryCta,
  onPrimaryClick,
}: {
  roleId?: "founder" | "advisor" | "investor" | "partner"
  eyebrowLabel?: string
  title: React.ReactNode
  subtitle: React.ReactNode
  imageSrc: string
  primaryCta: { label: string; to?: string }
  secondaryCta?: { label: string; to: string }
  onPrimaryClick?: () => void
}) {
  const tag = roleId ? NETWORK_PATH_ROLE_TAG[roleId] : undefined
  const label = eyebrowLabel || (tag ? tag.label : "Network")
  
  const renderPrimary = () => {
    if (onPrimaryClick) {
      return (
        <button 
          type="button" 
          onClick={onPrimaryClick} 
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 sm:w-auto"
        >
          {primaryCta.label}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      )
    }
    return (
      <Link to={primaryCta.to || "/"} className="inline-flex w-full cursor-pointer items-center justify-center gap-2 sm:w-auto">
        {primaryCta.label}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    )
  }

  return (
    <section className="relative overflow-hidden bg-rellia-teal pt-[72px] md:pt-[86px] lg:flex lg:flex-1 lg:flex-col lg:min-h-0 lg:pt-[96px]">
      <img
        src={imageSrc}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal/[0.88] via-rellia-teal/72 to-[#0a2830]/82" aria-hidden />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_20%_20%,rgba(167,219,214,0.35),transparent_50%),radial-gradient(circle_at_85%_30%,rgba(255,255,255,0.14),transparent_45%)]" />
      <img
        src="/images/hologram-logo.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 w-[min(52vw,420px)] opacity-[0.07] md:right-0"
      />

      <div className="relative z-10 mx-auto max-w-[1300px] px-6 pb-20 pt-10 md:px-10 md:pb-28 md:pt-14 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:pb-20 lg:pt-0">
        <Reveal>
          <NetworkEyebrow label={label} tone="onDark" className="mb-6 md:mb-8" />
          <h1
            className={cn(
              "max-w-4xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-sm",
              PAGE_HEADER_TITLE_SIZE_CLASS,
            )}
          >
            {title}
          </h1>
          <div className="mt-6 max-w-2xl font-urbanist text-lg leading-relaxed text-white/80 md:text-xl">
            {subtitle}
          </div>
          <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
            <RelliaAction
              asChild
              variant="mintOnTealStrip"
              size="comfortable"
              className="w-full min-w-0 justify-center sm:min-w-[220px] sm:w-auto"
            >
              {renderPrimary()}
            </RelliaAction>
            {secondaryCta && (
              <RelliaAction
                asChild
                variant="heroGhostOnTeal"
                size="comfortable"
                className="w-full min-w-0 justify-center border-white/45 hover:border-white/70 sm:min-w-[220px] sm:w-auto"
              >
                <Link to={secondaryCta.to} className="inline-flex w-full cursor-pointer items-center justify-center sm:w-auto">
                  {secondaryCta.label}
                </Link>
              </RelliaAction>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
