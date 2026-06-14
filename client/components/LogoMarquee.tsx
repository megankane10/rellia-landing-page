"use client"

import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"

import { PORTFOLIO_LOGO_MARKS } from "@/data/portfolioLogos"

export type LogoMark = { _key?: string; name: string; src: string; href?: string }

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
const LogoItem = ({
  logo,
  density,
  previewMode,
  itemKey,
}: {
  logo: LogoMark
  density: LogoMarqueeDensity
  previewMode: boolean
  itemKey: string
}) => (
  <div
    className={cn(
      "marquee-logo-cell flex shrink-0 select-none items-center justify-center px-8 opacity-[0.94] *:fill-foreground",
      DENSITY_CELL_PADDING[density],
      previewMode ? "pointer-events-auto" : "pointer-events-none",
    )}
  >
    <img
      src={cmsDisplayText(logo.src)}
      alt={cmsDisplayText(logo.name)}
      title={previewMode ? cmsDisplayText(logo.name) : undefined}
      loading="eager"
      decoding="async"
      draggable={false}
      className={cn(
        "w-auto max-w-[min(100%,18.5rem)] object-contain",
        DENSITY_IMG_HEIGHT[density],
        previewMode ? "pointer-events-auto" : "pointer-events-none",
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
  const previewMode = isVisualEditingPreview()
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

          .marquee-track--preview {
            animation: none;
            transform: none;
          }

          @media (hover: hover) and (pointer: fine) {
            .marquee-container:hover .marquee-track:not(.marquee-track--preview) {
              animation-play-state: var(--marquee-pause-on-hover, running);
            }

            .marquee-logo-cell {
              transition: opacity 0.2s ease;
            }

            .marquee-logo-cell:hover {
              opacity: 1;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .marquee-track {
              animation: none;
            }
          }

          /* Mask fades are desktop-only — iOS can blank the track when mask + transform + touch overlap */
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
              className={cn(
                "marquee-track flex w-max touch-none",
                previewMode ? "marquee-track--preview pointer-events-auto" : "pointer-events-none",
              )}
              style={
                {
                  "--marquee-duration": animationDuration,
                  "--marquee-direction": animationDirection,
                  "--marquee-pause-on-hover": pauseOnHover ? "paused" : "running",
                } as CSSProperties
              }
            >
              {logos.map((logo, index) => {
                const itemKey = logo._key ?? `${logo.name}-${index}`
                return (
                  <LogoItem
                    key={`first-${itemKey}`}
                    itemKey={itemKey}
                    logo={logo}
                    density={density}
                    previewMode={previewMode}
                  />
                )
              })}
              {previewMode
                ? null
                : logos.map((logo, index) => {
                    const itemKey = logo._key ?? `${logo.name}-${index}`
                    return (
                      <LogoItem
                        key={`second-${itemKey}`}
                        itemKey={itemKey}
                        logo={logo}
                        density={density}
                        previewMode={previewMode}
                      />
                    )
                  })}
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
