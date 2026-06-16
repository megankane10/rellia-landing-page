import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import NetworkEyebrow from "@/components/network/NetworkEyebrow"
import {
  cmsCleanText,
  cmsDisplayText,
  isVisualEditingPreview,
  splitStega,
} from "@/lib/cmsStega"

function useCountUp(target: number, enabled: boolean, durationMs = 1200) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setValue(0)
      return
    }

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches

    if (reduceMotion) {
      setValue(target)
      return
    }

    let raf = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [enabled, target, durationMs])

  return value
}

export type PageBuilderMetric = {
  _key?: string
  label: string
  value: number
  valueText?: string
  suffix?: string
}

type PageBuilderMetricsSectionProps = {
  heading: ReactNode
  subheading?: string
  metrics: PageBuilderMetric[]
  showBadge?: boolean
  badgeLabel?: string
  imageUrl?: string
  imageAlt?: string
}

function MetricStat({
  metric,
  index,
  entered,
  previewMode,
}: {
  metric: PageBuilderMetric
  index: number
  entered: boolean
  previewMode: boolean
}) {
  const valueRaw = metric.valueText ?? String(metric.value)
  const { cleaned: cleanValue, encoded: valueStega } = splitStega(valueRaw)
  const numericTarget = Number(cmsCleanText(cleanValue)) || 0
  const count = useCountUp(numericTarget, entered && !previewMode, 1200 + index * 150)

  return (
    <div className="flex flex-col items-start">
      <div className="font-host-grotesk text-4xl font-semibold leading-none tracking-tight text-rellia-teal md:text-5xl">
        {previewMode ? (
          <>
            {cleanValue}
            {valueStega ? <span className="hidden" aria-hidden="true">{valueStega}</span> : null}
          </>
        ) : (
          count
        )}
        {cmsDisplayText(metric.suffix)}
      </div>
      <p className="mt-2 font-urbanist text-sm font-medium leading-snug text-black/70 md:text-base">
        {cmsDisplayText(metric.label)}
      </p>
    </div>
  )
}

export default function PageBuilderMetricsSection({
  heading,
  subheading,
  metrics,
  showBadge = true,
  badgeLabel = "Network impact",
  imageUrl,
  imageAlt = "",
}: PageBuilderMetricsSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [entered, setEntered] = useState(false)
  const previewMode = isVisualEditingPreview()
  const metricList = useMemo(() => metrics.slice(0, 6), [metrics])

  useEffect(() => {
    if (previewMode) {
      setEntered(true)
      return
    }

    const el = sectionRef.current
    if (!el || entered) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [entered, previewMode])

  return (
    <div ref={sectionRef} className="w-full">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_min(380px,38%)] lg:gap-14 xl:gap-16">
        <div className="flex flex-col items-start text-left">
          {showBadge ? (
            <NetworkEyebrow label={cmsDisplayText(badgeLabel) || badgeLabel} tone="onLight" />
          ) : null}
          <h2
            className={cn(
              "font-host-grotesk text-2xl font-semibold leading-tight tracking-tight text-black md:text-[32px] lg:text-[36px]",
              showBadge && "mt-5",
            )}
          >
            {heading}
          </h2>
          {subheading?.trim() ? (
            <p className="mt-4 max-w-2xl font-urbanist text-base leading-relaxed text-black/70 md:text-lg">
              {cmsDisplayText(subheading)}
            </p>
          ) : null}
          {metricList.length > 0 ? (
            <div className="mt-10 grid w-full grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
              {metricList.map((metric, index) => (
                <MetricStat
                  key={metric._key ?? `${cmsCleanText(metric.label)}-${index}`}
                  metric={metric}
                  index={index}
                  entered={entered}
                  previewMode={previewMode}
                />
              ))}
            </div>
          ) : null}
        </div>

        {imageUrl ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/10 bg-rellia-cream/30 shadow-sm lg:aspect-square lg:max-h-[360px] lg:justify-self-end">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
