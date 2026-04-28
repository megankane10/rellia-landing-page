import ScrollReveal from "@/components/ScrollReveal";
import { useEffect, useMemo, useRef, useState } from "react";

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
  index,
  entered,
}: {
  metric: NetworkMetric;
  index: number;
  entered: boolean;
}) {
  const count = useCountUp(metric.value, entered, 1200 + index * 150);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="font-host-grotesk font-bold text-white text-5xl md:text-6xl tracking-tight leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
        {count}
        {metric.suffix ?? ""}
      </div>
      <p className="mt-3 font-urbanist text-white/85 text-sm md:text-base font-medium leading-snug max-w-[18rem] drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
        {metric.label}
      </p>
    </div>
  );
}

export default function NetworkMetricsSection({ heading, subheading, metrics }: NetworkMetricsSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [entered, setEntered] = useState(false);

  const metricList = useMemo(() => metrics, [metrics]);

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

  return (
    <section
      className="relative z-[2] w-full bg-transparent py-16 md:py-24"
    >
      {/* Soft top wash (contained in this section — does not overlap Paths above) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-rellia-mint/[0.14] via-rellia-teal/[0.05] to-transparent md:h-36"
      />
      <div className="relative z-[3] px-6 md:px-10">
        <div
          ref={(node) => {
            sectionRef.current = node
          }}
          className="relative z-[4] mx-auto w-full max-w-[1300px] overflow-hidden rounded-3xl border border-black/10 shadow-[0_40px_90px_-60px_rgba(0,0,0,0.45)]"
        >
          {/* Image container */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden>
            <img src="/images/metrics-bg.jpg" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-rellia-teal/35" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/45" />
          </div>

          <div className="relative px-6 py-14 md:px-12 md:py-16">
          {entered ? (
            <ScrollReveal className="flex flex-col items-center text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-rellia-mint" aria-hidden />
                <span className="font-host-grotesk text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  Network impact
                </span>
              </div>
              <h2 className="font-host-grotesk font-semibold text-white text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
                <AccentHeading text={heading} />
              </h2>
              <ScrollReveal className="mt-10">
                <div aria-hidden className="h-px w-28 bg-gradient-to-r from-transparent via-white/55 to-transparent" />
              </ScrollReveal>
            </ScrollReveal>
          ) : (
            <div className="opacity-0">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-rellia-mint" aria-hidden />
                <span className="font-host-grotesk text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  Network impact
                </span>
              </div>
              <h2 className="font-host-grotesk font-semibold text-white text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
                <AccentHeading text={heading} />
              </h2>
              <div className="mt-10 h-px w-28 bg-gradient-to-r from-transparent via-white/55 to-transparent" aria-hidden />
            </div>
          )}

          <div className="mt-12 md:mt-14">
            <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-5 sm:grid-cols-3">
              {metricList.slice(0, 3).map((m, i) => {
                return (
                  entered ? (
                    <ScrollReveal key={m.label} delay={i * 0.08}>
                      <div className="h-full rounded-2xl border border-white/20 bg-white/10 px-6 py-9 md:px-7 md:py-10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.55)] backdrop-blur-md">
                        <MetricValue metric={m} index={i} entered={entered} />
                      </div>
                    </ScrollReveal>
                  ) : (
                    <div
                      key={m.label}
                      className="opacity-0 h-full rounded-2xl border border-white/20 bg-white/10 px-6 py-9 md:px-7 md:py-10 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.55)] backdrop-blur-md"
                    >
                      <MetricValue metric={m} index={i} entered={entered} />
                    </div>
                  )
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

