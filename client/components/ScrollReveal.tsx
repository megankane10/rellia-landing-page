import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react"
import { useReducedMotion } from "framer-motion"

type ScrollRevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  /** `ctaReveal`: slide up + unblur (e.g. bottom CTA band) */
  /** `lineReveal`: vertical grow top→bottom + unblur (e.g. trajectory divider) */
  variant?: "default" | "ctaReveal" | "lineReveal"
} & Pick<HTMLAttributes<HTMLDivElement>, "aria-hidden">

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
  variant = "default",
  "aria-hidden": ariaHidden,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      el.style.animationDelay = `${delay}s`;
      if (reduceMotion) {
        if (variant === "ctaReveal") {
          el.classList.remove("opacity-0", "translate-y-8", "blur-[14px]")
        } else if (variant === "lineReveal") {
          el.classList.remove("opacity-0", "scale-y-0", "origin-top", "blur-[10px]")
        } else {
          el.classList.remove("opacity-0")
        }
        el.classList.add("opacity-100")
        return
      }
      el.classList.add(
        variant === "ctaReveal"
          ? "animate-cta-reveal"
          : variant === "lineReveal"
            ? "animate-line-reveal"
            : "animate-fade-up",
      )
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.unobserve(el);
        }
      },
      // Any overlap counts; avoids columns staying invisible if only part of the row intersects
      { threshold: 0, rootMargin: "0px 0px 12% 0px" },
    );

    observer.observe(el);

    // If already in view after layout (e.g. short hero, or observer edge cases), reveal — avoids stuck opacity-0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.top < vh && rect.bottom > 0) {
          reveal();
          observer.unobserve(el);
        }
      });
    });

    return () => observer.disconnect();
  }, [delay, reduceMotion, variant]);

  const initialCls =
    variant === "ctaReveal"
      ? "opacity-0 translate-y-8 blur-[14px]"
      : variant === "lineReveal"
        ? "opacity-0 scale-y-0 origin-top blur-[10px]"
        : "opacity-0"

  return (
    <div ref={ref} className={`${initialCls} ${className}`} aria-hidden={ariaHidden}>
      {children}
    </div>
  )
}
