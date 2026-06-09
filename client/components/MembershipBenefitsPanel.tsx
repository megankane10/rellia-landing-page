import { cn } from "@/lib/utils"

type MembershipBenefitsPanelProps = {
  headline: string
  benefits: string[]
  backgroundSrc: string
  className?: string
}

export default function MembershipBenefitsPanel({
  headline,
  benefits,
  backgroundSrc,
  className,
}: MembershipBenefitsPanelProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[min(520px,calc(100vh-10rem))] flex-1 flex-col overflow-hidden rounded-[1.75rem]",
        className,
      )}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <img
          src={backgroundSrc}
          alt=""
          className="h-full w-full scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-rellia-teal/94 via-[#0c4a4a]/88 to-[#071f26]/92" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071f26]/80 via-transparent to-black/20" />
        <div className="absolute inset-y-0 left-0 w-[85%] bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
        <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-rellia-mint/15 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-rellia-mint/10 blur-[80px]" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col p-8 md:p-10 lg:p-11">
        <div className="mb-8 flex items-center gap-3">
          <img
            src="/images/hologram-logo.png"
            alt=""
            aria-hidden
            width={44}
            height={44}
            loading="lazy"
            className="h-10 w-10 opacity-95 drop-shadow-[0_0_18px_rgba(152,255,232,0.35)] md:h-11 md:w-11"
          />
          <span className="font-host-grotesk text-[11px] font-bold uppercase tracking-[0.18em] text-rellia-mint/90">
            Founder membership
          </span>
        </div>

        <div className="max-w-md">
          <h1 className="font-host-grotesk text-[1.65rem] font-semibold leading-tight tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] md:text-[2rem] lg:text-[2.125rem]">
            {headline}
          </h1>
          <div className="mt-5 h-px w-10 bg-rellia-mint/70 md:mt-6" aria-hidden />
        </div>

        <ul className="mt-8 flex flex-1 flex-col gap-y-5 md:mt-10 md:gap-y-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-4">
              <span
                className="mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-rellia-mint/50 bg-rellia-mint/15"
                aria-hidden
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rellia-mint" />
              </span>
              <p className="font-urbanist text-[15px] font-medium leading-relaxed text-white/92 drop-shadow-[0_1px_12px_rgba(0,0,0,0.35)] md:text-base">
                {benefit}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
