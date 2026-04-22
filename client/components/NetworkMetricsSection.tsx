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

  const before = raw.slice(0, idx)
  const match = raw.slice(idx, idx + target.length)
  const after = raw.slice(idx + target.length)

  return (
    <>
      {before}
      <span className="text-rellia-teal">{match}</span>
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
      <div className="font-host-grotesk font-bold text-rellia-teal text-5xl md:text-6xl tracking-tight leading-none">
        {count}
        {metric.suffix ?? ""}
      </div>
      <p className="mt-3 font-urbanist text-black/70 text-sm md:text-base font-medium leading-snug max-w-[18rem]">
        {metric.label}
      </p>
    </div>
  );
}

export default function NetworkMetricsSection({ heading, subheading, metrics }: NetworkMetricsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [entered, setEntered] = useState(false);

  const metricList = useMemo(() => metrics, [metrics]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (entered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [entered]);

  return (
    <section
      ref={(node) => {
        sectionRef.current = node;
      }}
      className="w-full bg-white"
    >
      <div className="bg-rellia-cream px-6 md:px-10 pt-20 pb-32 md:pt-24 md:pb-40">
        <div className="max-w-[1300px] mx-auto">
          <ScrollReveal className="flex flex-col items-center text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-rellia-mint" aria-hidden />
              <span className="font-host-grotesk text-xs font-semibold uppercase tracking-[0.18em] text-rellia-teal">
                Network impact
              </span>
            </div>
            <h2 className="font-host-grotesk font-semibold text-black text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
              <AccentHeading text={heading} />
            </h2>
            <p className="font-urbanist font-medium text-black/70 leading-relaxed tracking-tight mt-5 text-base md:text-lg max-w-[720px] mx-auto">
              {subheading}
            </p>
            <div aria-hidden className="mt-10 h-px w-28 bg-gradient-to-r from-transparent via-rellia-teal/25 to-transparent" />
          </ScrollReveal>
        </div>
      </div>

      <div className="px-6 md:px-10">
        <div className="max-w-[1300px] mx-auto">
          <div className="-mt-20 md:-mt-24 pb-20 md:pb-28">
            <div className="rounded-3xl bg-gradient-to-br from-rellia-teal via-[#2BB8A6] to-[#BFF6E6] p-6 sm:p-8 md:p-12 shadow-[0_28px_90px_-44px_rgba(0,0,0,0.55)]">
              <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-5 sm:grid-cols-3">
                {metricList.slice(0, 3).map((m, i) => {
                  return (
                    <ScrollReveal key={m.label} delay={i * 0.08}>
                      <div className="h-full rounded-2xl border border-white/40 bg-white/95 px-6 py-9 md:px-7 md:py-10 shadow-[0_24px_60px_-22px_rgba(0,0,0,0.25)]">
                        <MetricValue metric={m} index={i} entered={entered} />
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

