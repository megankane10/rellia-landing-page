import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Globe, Rocket, Users, type LucideIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { relliaTealGlassCardClass } from "@/lib/relliaTealGlassCard"
import PillTag from "@/components/PillTag"
import { PAGE_HEADER_TITLE_SIZE_CLASS } from "@/components/PageHeader"

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
  label: string;
  value: number;
  suffix?: string;
};

type NetworkMetricsSectionProps = {
  heading: string;
  subheading: string;
  metrics: NetworkMetric[];
};

function AccentHeading({ text }: { text: string }) {
  const target = "all the difference"
  const raw = (text ?? "").trim()
  if (!raw) return null

  const idx = raw.toLowerCase().indexOf(target)
  if (idx === -1) return <>{raw}</>

  const before = raw.slice(0, idx).trimEnd()
  const match = raw.slice(idx, idx + target.length)
  const after = raw.slice(idx + target.length)

  return (
    <>
      {before ? (
        <>
          <span className="inline">{before}</span>
          <span className="md:hidden"> </span>
          <br className="hidden md:block" aria-hidden />
        </>
      ) : null}
      <span className="text-rellia-mint">{match}</span>
      {after}
    </>
  )
}

const METRIC_ROW_ICONS: LucideIcon[] = [Users, Rocket, Globe]

function MetricValue({
  metric,
  label,
  index,
  entered,
}: {
  metric: NetworkMetric;
  label: string;
  index: number;
  entered: boolean;
}) {
  const count = useCountUp(metric.value, entered, 1200 + index * 150);
  const Icon = METRIC_ROW_ICONS[index] ?? Users

  return (
    <div className="inline-flex max-w-full flex-col items-center">
      <div className="flex items-center gap-2.5 md:gap-3">
        <Icon
          className="h-8 w-8 shrink-0 text-white md:h-9 md:w-9"
          strokeWidth={1.35}
          aria-hidden
        />
        <div className="font-host-grotesk text-4xl font-normal leading-none tracking-normal text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] md:text-5xl">
          {count}
          {metric.suffix ?? ""}
        </div>
      </div>
      <p className="mt-2.5 w-full text-center font-host-grotesk text-xs font-extrabold uppercase tracking-[0.16em] text-rellia-mint md:text-sm md:tracking-[0.18em]">
        {label}
      </p>
    </div>
  );
}

export default function NetworkMetricsSection({ heading, subheading, metrics }: NetworkMetricsSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [entered, setEntered] = useState(false);
  const [countReady, setCountReady] = useState(false)
  const reduceMotion = useReducedMotion()

  const metricList = useMemo(() => metrics, [metrics]);
  const labels = useMemo(() => ["MEMBERS", "STARTUPS", "COUNTRIES"], [])
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 95%", "end 5%"],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"])

  useEffect(() => {
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
      // Trigger reveals when the section is meaningfully in view
      { threshold: 0.35 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [entered])

  useEffect(() => {
    if (!entered) return
    if (reduceMotion) {
      setCountReady(true)
      return
    }

    // Let the metric tiles slide in first, then start counting.
    // Matches the last tile's delay (~0.28s) + duration (~0.45s) + a small buffer.
    const t = window.setTimeout(() => setCountReady(true), 820)
    return () => window.clearTimeout(t)
  }, [entered, reduceMotion])

  return (
    <section
      className="relative z-[2] w-full bg-white overflow-x-hidden"
    >
      <div
        ref={(node) => {
          sectionRef.current = node
        }}
        className="relative flex h-auto min-h-[1060px] w-full flex-col overflow-hidden sm:min-h-0 sm:h-[820px] md:h-[840px] lg:h-[780px] xl:h-[800px]"
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <motion.img
            src="/images/metrics-bg-pexels-2.jpg"
            alt=""
            className="h-full w-full object-cover scale-[1.12] object-[62%_50%]"
            style={reduceMotion ? undefined : { y: bgY }}
          />
          <div className="absolute inset-0 bg-rellia-teal/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/55" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1300px] flex-1 flex-col px-6 pb-10 pt-8 md:px-10 md:pb-8 md:pt-12 lg:pb-6">
          <div className="flex flex-col items-start text-left mt-4 md:mt-8 lg:mt-16">
            <motion.div
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              animate={
                reduceMotion
                  ? { opacity: 1, y: 0 }
                  : entered
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 22 }
              }
              transition={reduceMotion ? undefined : { duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start text-left w-full"
            >
              <div className="mb-4 md:mb-6">
                <PillTag
                  label="Network impact"
                  className="border-white/35 bg-transparent shadow-none backdrop-blur-2xl"
                  dot={
                    <motion.span
                      aria-hidden
                      className="relative inline-flex h-2 w-2 rounded-full bg-rellia-mint"
                      initial={false}
                      animate={reduceMotion ? undefined : { opacity: [1, 1, 1], transform: ["scale(1)", "scale(1.35)", "scale(1)"] }}
                      transition={reduceMotion ? undefined : { duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                  }
                />
              </div>
              <h2
                className={`font-host-grotesk max-w-3xl font-bold leading-tight tracking-tight text-white ${PAGE_HEADER_TITLE_SIZE_CLASS}`}
              >
                <AccentHeading text={heading} />
              </h2>
            </motion.div>
          </div>

          <div className="mt-10 flex-1 sm:mt-8 lg:flex lg:items-center lg:-translate-y-2">
            <div className="w-full">
              <div className="flex w-full flex-col items-start gap-10 sm:flex-row sm:flex-wrap sm:justify-start sm:gap-x-12 sm:gap-y-10 md:gap-x-14 md:gap-y-11 lg:gap-x-16 lg:gap-y-11 xl:gap-x-[4.25rem]">
                {metricList.slice(0, 3).map((m, i) => {
                  const label = labels[i] ?? m.label.toUpperCase()
                  return (
                    <motion.div
                      key={`${m.label}-${label}`}
                      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      animate={
                        reduceMotion
                          ? { opacity: 1, y: 0 }
                          : entered
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 10 }
                      }
                      transition={reduceMotion ? undefined : { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.12 + i * 0.08 }}
                      className={cn(
                        relliaTealGlassCardClass,
                        "flex h-[168px] w-full max-w-[260px] shrink-0 items-center justify-center px-5 py-6 sm:h-[176px] md:h-[186px] md:max-w-[276px] md:px-6 md:py-7",
                      )}
                    >
                      <MetricValue metric={m} label={label} index={i} entered={entered && countReady} />
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

