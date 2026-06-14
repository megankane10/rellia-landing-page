import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Globe, Rocket, Users, type LucideIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import PillTag, { PILL_ON_IMAGE_BLUR_CLASS } from "@/components/PillTag"
import { PAGE_HEADER_TITLE_SIZE_CLASS } from "@/components/PageHeader"
import { HeroHeadlinePortable } from "@/components/HeroHeadlinePortable"
import { cmsCleanText, cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"
import type { SanityPortableText } from "@shared/cms/types"

function useCountUp(target: number, enabled: boolean, durationMs = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setValue(0);
      return;
    }

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (reduceMotion) {
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, target, durationMs]);

  return value;
}

export type NetworkMetric = {
  _key?: string
  label: string;
  value: number;
  valueText?: string;
  suffix?: string;
};

type NetworkMetricsSectionProps = {
  heading: SanityPortableText | string
  subheading?: string
  metrics: NetworkMetric[]
  /** When false, renders edge-to-edge without rounded container (page builder). */
  contained?: boolean
  showBadge?: boolean
  badgeLabel?: string
  backgroundImageUrl?: string
}

const DEFAULT_METRICS_BACKGROUND = "/images/metrics-bg-pexels-2.jpg"

const METRIC_ROW_ICONS: LucideIcon[] = [Users, Rocket, Globe]
const METRIC_FALLBACK_LABELS = ["Members", "Startups", "Countries"]

const sentenceCase = (text: string) => {
  const raw = cmsCleanText(text)
  if (!raw) return ""
  const normalized = raw.toLowerCase()
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

function MetricValue({
  metric,
  label,
  index,
  entered,
  previewMode,
}: {
  metric: NetworkMetric;
  label: string;
  index: number;
  entered: boolean;
  previewMode: boolean;
}) {
  const valueRaw = metric.valueText ?? String(metric.value)
  const numericTarget = Number(cmsCleanText(valueRaw)) || 0
  const count = useCountUp(numericTarget, entered && !previewMode, 1200 + index * 150);
  const Icon = METRIC_ROW_ICONS[index] ?? Users
  const displaySuffix = cmsDisplayText(metric.suffix)

  return (
    <div className="inline-flex max-w-full flex-col items-start">
      <Icon className="h-10 w-10 text-rellia-mint md:h-11 md:w-11" strokeWidth={1.35} aria-hidden />
      <div className="mt-4 font-host-grotesk text-5xl font-semibold leading-none tracking-tight text-white md:text-6xl">
        {previewMode ? cmsDisplayText(valueRaw) : count}
        {displaySuffix}
      </div>
      <p className="mt-3 font-urbanist text-lg font-medium leading-snug text-white/80 md:text-xl">
        {cmsDisplayText(label)}
      </p>
    </div>
  );
}

export default function NetworkMetricsSection({
  heading,
  subheading,
  metrics,
  contained = true,
  showBadge = true,
  badgeLabel = "Network impact",
  backgroundImageUrl,
}: NetworkMetricsSectionProps) {
  const previewMode = isVisualEditingPreview()
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [entered, setEntered] = useState(previewMode);
  const [countReady, setCountReady] = useState(previewMode)
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const metricList = useMemo(() => metrics, [metrics]);
  const metricsBackgroundSrc =
    cmsDisplayText(backgroundImageUrl) || DEFAULT_METRICS_BACKGROUND
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 95%", "end 5%"],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"])

  useEffect(() => {
    if (previewMode) {
      setEntered(true)
      setCountReady(true)
      return
    }

    const el = sectionRef.current;
    if (!el) return;

    if (entered) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [entered, previewMode])

  useEffect(() => {
    if (!entered) return
    if (previewMode || reduceMotion) {
      setCountReady(true)
      return
    }

    const t = window.setTimeout(() => setCountReady(true), 820)
    return () => window.clearTimeout(t)
  }, [entered, previewMode, reduceMotion])

  const headerMotionInitial = previewMode || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }
  const headerMotionAnimate = previewMode || reduceMotion || entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }
  const tileMotionInitial = previewMode || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
  const tileMotionAnimate = previewMode || reduceMotion || entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }

  return (
    <section
      className={cn(
        "relative z-[2] w-full overflow-hidden",
        contained ? "bg-white py-4 md:py-6" : "bg-rellia-teal py-16 md:py-24",
      )}
    >
      <div
        ref={(node) => {
          sectionRef.current = node
        }}
        className={cn(
          "relative flex w-full flex-col overflow-hidden",
          contained
            ? "h-auto min-h-[1100px] rounded-[2.5rem] shadow-lg sm:min-h-0 sm:h-[860px] md:h-[880px] md:rounded-[3.5rem] lg:h-[820px] xl:h-[840px]"
            : "min-h-[560px] md:min-h-[620px]",
        )}
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <motion.img
            src={metricsBackgroundSrc}
            alt=""
            className="h-full w-full object-cover scale-[1.12] object-[62%_50%]"
            style={previewMode || reduceMotion || isMobile ? undefined : { y: bgY }}
          />
          <div className="absolute inset-0 bg-rellia-teal/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/55" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1300px] flex-1 flex-col px-6 pb-10 pt-8 md:px-10 md:pb-8 md:pt-12 lg:pb-6">
          <div className="flex flex-col items-start text-left mt-4 md:mt-8 lg:mt-16">
            <motion.div
              initial={headerMotionInitial}
              animate={headerMotionAnimate}
              transition={previewMode || reduceMotion ? undefined : { duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start text-left w-full"
            >
              <div className="mb-4 md:mb-6">
                {showBadge ? (
                  <PillTag
                    label={badgeLabel}
                    className={PILL_ON_IMAGE_BLUR_CLASS}
                    dot={
                      <motion.span
                        aria-hidden
                        className="relative inline-flex h-2 w-2 rounded-full bg-rellia-mint"
                        initial={false}
                        animate={previewMode || reduceMotion ? undefined : { opacity: [1, 1, 1], transform: ["scale(1)", "scale(1.35)", "scale(1)"] }}
                        transition={previewMode || reduceMotion ? undefined : { duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                      />
                    }
                  />
                ) : null}
              </div>
              <h2
                className={`font-host-grotesk max-w-3xl font-bold leading-tight tracking-tight text-white ${PAGE_HEADER_TITLE_SIZE_CLASS}`}
              >
                <HeroHeadlinePortable value={heading} />
              </h2>
              {cmsCleanText(subheading) ? (
                <p className="mt-4 max-w-2xl font-urbanist text-base font-medium leading-relaxed text-white/80 md:text-lg">
                  {cmsDisplayText(subheading)}
                </p>
              ) : null}
            </motion.div>
          </div>

          <div className="mt-24 flex-1 sm:mt-14 md:mt-10 lg:mt-8 lg:flex lg:items-center lg:-translate-y-2">
            <div className="w-full">
              <div className="flex w-full flex-col items-start gap-10 sm:flex-row sm:flex-wrap sm:justify-start sm:gap-x-12 sm:gap-y-10 md:gap-x-14 md:gap-y-11 lg:gap-x-16 lg:gap-y-11 xl:gap-x-[4.25rem]">
                {metricList.slice(0, 3).map((m, i) => {
                  const fallbackLabel = sentenceCase(METRIC_FALLBACK_LABELS[i])
                  const label = cmsCleanText(m.label) ? m.label : fallbackLabel
                  return (
                    <motion.div
                      key={m._key ?? `${cmsCleanText(m.label)}-${i}`}
                      initial={tileMotionInitial}
                      animate={tileMotionAnimate}
                      transition={previewMode || reduceMotion ? undefined : { duration: 0.52, ease: [0.16, 1, 0.3, 1], delay: 0.14 + i * 0.12 }}
                      className="relative w-full max-w-[260px] shrink-0 pl-6 md:max-w-[300px] md:pl-7"
                    >
                      <motion.span
                        aria-hidden
                        className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full bg-rellia-mint origin-top"
                        initial={previewMode || reduceMotion ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0.6 }}
                        animate={previewMode || reduceMotion || entered ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0.6 }}
                        transition={
                          previewMode || reduceMotion
                            ? undefined
                            : { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.12 }
                        }
                      />
                      <MetricValue metric={m} label={label} index={i} entered={entered && countReady} previewMode={previewMode} />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
