"use client"

import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

const logos = [
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

type Logo = (typeof logos)[number]

const SPEED_MAP = {
  slow: "60s",
  normal: "40s",
  fast: "20s",
} as const

type LogoMarqueeSpeed = keyof typeof SPEED_MAP
type LogoMarqueeDirection = "left" | "right"

/** Matches SmoothUI logo-cloud-3 (Logo Marquee) cell layout; images sit inside the same wrapper as SVG logos in the block. */
const LogoItem = ({ logo }: { logo: Logo }) => (
  <div className="flex shrink-0 items-center justify-center px-8 py-5 opacity-80 transition-opacity duration-200 *:fill-foreground hover:opacity-100 md:py-6">
    <img
      src={logo.src}
      alt={logo.name}
      loading="lazy"
      className="h-[72px] w-auto max-w-[min(100%,18.5rem)] object-contain md:h-[88px] lg:h-[104px]"
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
}: {
  title?: ReactNode
  description?: string
  speed?: LogoMarqueeSpeed
  direction?: LogoMarqueeDirection
  pauseOnHover?: boolean
  showHeading?: boolean
  sectionClassName?: string
}) {
  const animationDuration = SPEED_MAP[speed]
  const animationDirection = direction === "right" ? "reverse" : "normal"

  return (
    <section className={cn("overflow-hidden py-20", sectionClassName)}>
      <style>
        {`
          @keyframes marquee-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .marquee-track {
            animation: marquee-scroll var(--marquee-duration, 40s) linear infinite;
            animation-direction: var(--marquee-direction, normal);
          }

          .marquee-container:hover .marquee-track {
            animation-play-state: var(--marquee-pause-on-hover, running);
          }

          @media (prefers-reduced-motion: reduce) {
            .marquee-track {
              animation: none;
            }
          }
        `}
      </style>

      <div className="mx-auto max-w-7xl px-6">
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
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
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
              <LogoItem key={`first-${logo.name}-${index}`} logo={logo} />
            ))}
            {logos.map((logo, index) => (
              <LogoItem key={`second-${logo.name}-${index}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
