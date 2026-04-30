import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

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

  return (
    <div className="flex flex-col items-center text-center">
      <div className="font-host-grotesk font-normal text-white text-5xl md:text-6xl tracking-tight leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
        {count}
        {metric.suffix ?? ""}
      </div>
      <p className="mt-3 font-host-grotesk text-rellia-mint text-xs font-semibold uppercase tracking-[0.18em]">
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
        className="relative w-full overflow-hidden h-[760px] sm:h-[720px] md:h-[820px] lg:h-[1080px]"
      >
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <motion.img
            src="/images/metrics-bg-pexels-2.jpg"
            alt=""
            className="h-full w-full object-cover scale-[1.12]"
            style={reduceMotion ? undefined : { y: bgY }}
          />
          <div className="absolute inset-0 bg-rellia-teal/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/55" />
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1300px] flex-col justify-center px-6 md:px-10">
          <motion.div
            initial={reduceMotion ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 22, filter: "blur(18px)" }}
            animate={
              reduceMotion
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : entered
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 22, filter: "blur(18px)" }
            }
            transition={reduceMotion ? undefined : { duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 shadow-sm backdrop-blur-md">
              <motion.span
                aria-hidden
                className="relative inline-flex h-2 w-2 rounded-full bg-rellia-mint"
                initial={false}
                animate={reduceMotion ? undefined : { opacity: [1, 1, 1], transform: ["scale(1)", "scale(1.35)", "scale(1)"] }}
                transition={reduceMotion ? undefined : { duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <span className="font-host-grotesk text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Network impact
              </span>
            </div>
            <h2 className="font-host-grotesk font-medium text-white text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
              <AccentHeading text={heading} />
            </h2>
            <div aria-hidden className="mt-10 h-px w-28 bg-gradient-to-r from-transparent via-white/55 to-transparent" />
          </motion.div>

          <div className="mt-12 md:mt-14">
            <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
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
                      "h-full rounded-2xl border border-white/18 px-6 py-9 md:px-7 md:py-10",
                      "bg-white/14 backdrop-blur-md",
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
    </section>
  );
}

