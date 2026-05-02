"use client"

import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Brand SVG logos from Simple Icons (pinned npm package on unpkg — stable paths; `cdn.simpleicons.org`
 * was returning 404 for several slugs).
 * Illustrative placeholders only; not an endorsement or affiliation claim.
 */
const SI_V = "9.0.0"
const si = (slug: string) => `https://unpkg.com/simple-icons@${SI_V}/icons/${slug}.svg`

export const INVESTOR_BRAND_SVG_MARKS = [
  { name: "Google", src: si("google") },
  { name: "Microsoft", src: si("microsoft") },
  { name: "Amazon", src: si("amazon") },
  { name: "Apple", src: si("apple") },
  { name: "Meta", src: si("meta") },
  { name: "IBM", src: si("ibm") },
  { name: "Oracle", src: si("oracle") },
  { name: "Salesforce", src: si("salesforce") },
  { name: "Siemens", src: si("siemens") },
  { name: "Intel", src: si("intel") },
] as const

/** @deprecated Use INVESTOR_BRAND_SVG_MARKS */
export const BIG_TECH_PLACEHOLDER_MARKS = INVESTOR_BRAND_SVG_MARKS

/** Exported for founder directory cards and other reuse — keep in sync with marquee below */
export const PORTFOLIO_LOGO_MARKS = [
  { name: "Akesyn", src: "/images/portfolio-akesyn.png" },
  { name: "CarePathStudio", src: "/images/portfolio-carepathstudio.png" },
  { name: "Dott", src: "/images/portfolio-dott.png" },
  { name: "GeoClaim", src: "/images/portfolio-geoclaim.png" },
  { name: "Glowlytics", src: "/images/portfolio-glowtylics.png" },
  { name: "HealCycle", src: "/images/portfolio-healcycle.png" },
  { name: "MEA", src: "/images/portfolio-mea.png" },
  { name: "Miraei", src: "/images/portfolio-miraei.png" },
  { name: "MyLigo", src: "/images/portfolio-myligo.png" },
  { name: "Neuromod", src: "/images/portfolio-neuromod.png" },
  { name: "Newgen", src: "/images/portfolio-newgen.png" },
  { name: "Patient Companion", src: "/images/portfolio-patientcompanion.png" },
  { name: "POP", src: "/images/portfolio-pop.png" },
  { name: "Restore", src: "/images/portfolio-restore.png" },
  { name: "Salve Therapeutics", src: "/images/portfolio-salvetherapeutics.png" },
  { name: "SeeMira", src: "/images/portfolio-seemira.png" },
] as const

type LogoMark =
  | (typeof PORTFOLIO_LOGO_MARKS)[number]
  | (typeof INVESTOR_BRAND_SVG_MARKS)[number]

const SPEED_MAP = {
  slow: "60s",
  normal: "40s",
  fast: "20s",
} as const

type LogoMarqueeSpeed = keyof typeof SPEED_MAP
type LogoMarqueeDirection = "left" | "right"

type LogoMarqueeDensity = "default" | "compact"

const DENSITY_CELL_PADDING: Record<LogoMarqueeDensity, string> = {
  default: "py-5 md:py-6",
  compact: "py-3 md:py-4",
}

const DENSITY_IMG_HEIGHT: Record<LogoMarqueeDensity, string> = {
  default: "h-[72px] md:h-[88px] lg:h-[104px]",
  compact: "h-[56px] md:h-[64px] lg:h-[72px]",
}

/** Matches SmoothUI logo-cloud-3 (Logo Marquee) cell layout; images sit inside the same wrapper as SVG logos in the block. */
const LogoItem = ({ logo, density }: { logo: LogoMark; density: LogoMarqueeDensity }) => (
  <div
    className={cn(
      "flex shrink-0 items-center justify-center px-8 opacity-80 transition-opacity duration-200 *:fill-foreground hover:opacity-100",
      DENSITY_CELL_PADDING[density],
    )}
  >
    <img
      src={logo.src}
      alt={logo.name}
      loading="eager"
      decoding="async"
      className={cn(
        "w-auto max-w-[min(100%,18.5rem)] object-contain",
        DENSITY_IMG_HEIGHT[density],
      )}
    />
  </div>
)

export default function LogoMarquee({
  title = "Portfolio companies",
  description = "",
  speed = "normal",
  direction = "left",
  pauseOnHover = false,
  showHeading = true,
  sectionClassName,
  /** No inner horizontal padding — use inside layouts that already use max-w-[1300px] + section px */
  flush = false,
  marks,
  density = "default",
}: {
  title?: ReactNode
  description?: string
  speed?: LogoMarqueeSpeed
  direction?: LogoMarqueeDirection
  pauseOnHover?: boolean
  showHeading?: boolean
  sectionClassName?: string
  flush?: boolean
  /** Override default portfolio marks (e.g. placeholder investor logos). */
  marks?: readonly LogoMark[]
  /** Smaller cells and logos (use for thin strips under heroes). */
  density?: LogoMarqueeDensity
}) {
  const logos = marks ?? PORTFOLIO_LOGO_MARKS
  const animationDuration = SPEED_MAP[speed]
  const animationDirection = direction === "right" ? "reverse" : "normal"

  return (
    <section className={cn("overflow-hidden py-20", sectionClassName)}>
      <style>
        {`
          @keyframes marquee-scroll {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              transform: translate3d(-50%, 0, 0);
            }
          }

          .marquee-track {
            animation: marquee-scroll var(--marquee-duration, 40s) linear infinite;
            animation-direction: var(--marquee-direction, normal);
            /* Compositor layer + stable subpixel loop (avoids visible snap on repeat) */
            will-change: transform;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }

          .marquee-container:hover .marquee-track {
            animation-play-state: var(--marquee-pause-on-hover, running);
          }

          @media (prefers-reduced-motion: reduce) {
            .marquee-track {
              animation: none;
            }
          }

          /* Pixel-based fade so it stays visible on narrow screens; aligns to ~content gutter */
          .marquee-fade-edges {
            mask-image: linear-gradient(
              to right,
              transparent 0,
              black 2.5rem,
              black calc(100% - 2.5rem),
              transparent 100%
            );
            -webkit-mask-image: linear-gradient(
              to right,
              transparent 0,
              black 2.5rem,
              black calc(100% - 2.5rem),
              transparent 100%
            );
          }

          @media (min-width: 768px) {
            .marquee-fade-edges {
              mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
              -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            }
          }
        `}
      </style>

      <div
        className={cn(
          "mx-auto w-full max-w-7xl",
          flush ? "max-w-none px-0" : "px-6 md:px-10",
        )}
      >
        {showHeading ? (
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-2xl text-foreground lg:text-3xl">
              {title}
            </h2>
            {description ? (
              <p className="text-foreground/70 text-lg">{description}</p>
            ) : null}
          </div>
        ) : null}

        <div
          className="marquee-container relative overflow-hidden"
          aria-label="Partner and portfolio logo marquee"
        >
          <div className="marquee-fade-edges relative overflow-hidden">
            <div
              className="marquee-track flex w-max"
              style={
                {
                  "--marquee-duration": animationDuration,
                  "--marquee-direction": animationDirection,
                  "--marquee-pause-on-hover": pauseOnHover ? "paused" : "running",
                } as CSSProperties
              }
            >
              {logos.map((logo, index) => (
                <LogoItem key={`first-${logo.name}-${index}`} logo={logo} density={density} />
              ))}
              {logos.map((logo, index) => (
                <LogoItem key={`second-${logo.name}-${index}`} logo={logo} density={density} />
              ))}
            </div>
          </div>
          {/* White scrim — reliable on iOS; sits above masked track, same edge as marquee */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-10 bg-gradient-to-r from-white via-white/90 to-transparent sm:w-11 md:hidden"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-10 bg-gradient-to-l from-white via-white/90 to-transparent sm:w-11 md:hidden"
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}
