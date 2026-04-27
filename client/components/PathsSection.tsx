import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion"

type PathItem = {
  key: string
  label: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
}

const defaultItems: PathItem[] = [
  {
    key: "founders",
    label: "Founders",
    title: "For founders building in health tech",
    description:
      "Find the experts, clinicians, and operators who can help you avoid costly detours and hit your next milestone faster.",
    imageSrc: "/images/paths-founders.png",
    imageAlt: "Rellia network visualization",
  },
  {
    key: "advisors",
    label: "Advisors",
    title: "For advisors who want to have impact",
    description:
      "Support the next generation of healthcare innovation with focused 1:1 guidance and curated introductions.",
    imageSrc: "/images/paths-advisors.png",
    imageAlt: "Conference and community",
  },
  {
    key: "investors",
    label: "Investors",
    title: "For investors focused on outcomes",
    description:
      "Meet founders who are building with clinical insight and operational rigor, backed by a community that vouches for them.",
    imageSrc: "/images/paths-investors.png",
    imageAlt: "Portfolio company logo",
  },
  {
    key: "partners",
    label: "Industry partners",
    title: "For partners who want to collaborate",
    description:
      "Engage with founders through sponsored programming, mentorship, and industry-informed commercialization support.",
    imageSrc: "/images/paths-industryPartners.png",
    imageAlt: "Portfolio company logo",
  },
]

export default function PathsSection({ items = defaultItems }: { items?: PathItem[] }) {
  const list = useMemo(() => (items.length > 0 ? items : defaultItems), [items])
  const [activeKey, setActiveKey] = useState(list[0]?.key ?? "founders")
  const [hoverKey, setHoverKey] = useState<string | null>(null)
  const [isImageHovered, setIsImageHovered] = useState(false)
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-15% 0px -35% 0px" })
  const shouldAnimate = Boolean(isInView) && !reduceMotion

  const active = useMemo(() => list.find((x) => x.key === activeKey) ?? list[0], [activeKey, list])
  const showOverlay = Boolean(hoverKey) && !isImageHovered

  useEffect(() => {
    if (typeof window === "undefined") return
    list.forEach((item) => {
      const img = new Image()
      img.src = item.imageSrc
    })
  }, [list])

  const handleActivate = (key: string) => {
    setActiveKey(key)
  }

  return (
    <section
      ref={(node) => {
        sectionRef.current = node
      }}
      id="paths-section"
      className="relative w-full bg-white min-h-screen flex items-center px-6 md:px-10 overflow-hidden"
    >
      {/* Soft background wash (subtle, animated on enter) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={reduceMotion ? undefined : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(12,61,73,0.10),transparent_55%),radial-gradient(circle_at_90%_40%,rgba(167,219,214,0.22),transparent_52%),radial-gradient(circle_at_50%_100%,rgba(12,61,73,0.06),transparent_55%)]" />
      </motion.div>

      {/* Abstract left linework (teal + draws on enter) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-full w-[180px] opacity-[0.22]"
        initial={reduceMotion ? { y: 0 } : { y: -12 }}
        animate={reduceMotion ? { y: 0 } : isInView ? { y: 56 } : { y: -12 }}
        transition={reduceMotion ? undefined : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.svg
          className="h-full w-full"
          viewBox="0 0 180 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={reduceMotion ? { opacity: 1 } : isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={reduceMotion ? undefined : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.path
            d="M110 -40C72 40 152 110 108 180C64 250 26 308 78 380C130 452 146 520 92 596C38 672 132 742 96 820C74 868 54 908 46 940"
            stroke="hsl(var(--rellia-teal))"
            strokeOpacity={0.55}
            strokeWidth="2.2"
            initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={reduceMotion ? { pathLength: 1 } : isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={reduceMotion ? undefined : { duration: 1.35, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d="M38 40C30 120 102 160 78 230C54 300 6 360 50 430C94 500 118 560 74 628C30 696 96 760 70 840"
            stroke="hsl(var(--rellia-teal))"
            strokeOpacity={0.32}
            strokeWidth="1.4"
            initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={reduceMotion ? { pathLength: 1 } : isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={reduceMotion ? undefined : { duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          />
          <motion.circle
            cx="110"
            cy="180"
            r="7"
            fill="hsl(var(--rellia-teal))"
            fillOpacity={0.14}
            initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            animate={reduceMotion ? { opacity: 1, scale: 1 } : isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            transition={reduceMotion ? undefined : { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
          />
          <motion.circle
            cx="92"
            cy="596"
            r="10"
            fill="hsl(var(--rellia-teal))"
            fillOpacity={0.1}
            initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            animate={reduceMotion ? { opacity: 1, scale: 1 } : isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            transition={reduceMotion ? undefined : { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.44 }}
          />
          <motion.circle
            cx="70"
            cy="840"
            r="6"
            fill="hsl(var(--rellia-teal))"
            fillOpacity={0.12}
            initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            animate={reduceMotion ? { opacity: 1, scale: 1 } : isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            transition={reduceMotion ? undefined : { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.56 }}
          />
        </motion.svg>
      </motion.div>

      {/* Animated abstract blob (appears + animates on enter) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-140px] top-0 bottom-0 h-full w-[560px] blur-3xl"
        initial={reduceMotion ? { opacity: 0.22, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: -18 }}
        animate={
          reduceMotion
            ? { opacity: 0.22, scale: 1, y: 0 }
            : shouldAnimate
              ? { opacity: 0.32, scale: 1, y: [0, 16, 0] }
              : { opacity: 0, scale: 0.92, y: -18 }
        }
        transition={
          reduceMotion
            ? undefined
            : shouldAnimate
              ? {
                  opacity: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  y: { duration: 6.5, ease: [0.45, 0, 0.55, 1], repeat: Infinity, repeatType: "mirror" },
                }
              : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(167,219,214,0.85), rgba(167,219,214,0) 60%), radial-gradient(circle at 70% 60%, rgba(12,61,73,0.55), rgba(12,61,73,0) 62%)",
        }}
      />

      <div className="max-w-[1300px] mx-auto w-full py-16 md:py-24">
        <motion.div
          className="w-full"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
          animate={reduceMotion ? { opacity: 1, y: 0 } : isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
          transition={reduceMotion ? undefined : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-stretch">
            {/* Left panel */}
            <div className="rounded-[28px] p-7 md:p-9 text-black">
              <div>
                <h2 className="font-host-grotesk font-semibold text-rellia-teal text-3xl md:text-[44px] leading-tight tracking-tight max-w-xl">
                  Reimagining healthcare, together.
                </h2>
                <p className="mt-4 font-urbanist text-black/70 text-base md:text-lg leading-relaxed max-w-xl">
                  Join a global ecosystem built to scale healthcare innovation. Select your role to see how we partner.
                </p>

                <div className="mt-9 flex flex-col" onMouseLeave={() => setHoverKey(null)}>
                  {list.map((item) => {
                    const isHovered = item.key === hoverKey
                    const to = `/${item.key}`
                    return (
                      <Link
                        key={item.key}
                        onMouseEnter={() => {
                          setHoverKey(item.key)
                          handleActivate(item.key)
                        }}
                        onFocus={() => {
                          setHoverKey(item.key)
                          handleActivate(item.key)
                        }}
                        to={to}
                        className={cn(
                          "group text-left py-4 outline-none",
                          "focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal rounded-2xl px-2 -mx-2",
                        )}
                        aria-label={`Preview ${item.label}`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span
                            className={cn(
                              "font-host-grotesk font-medium text-lg md:text-xl tracking-tight transition-[color,transform] duration-300 motion-reduce:transition-none",
                              "text-black/80",
                              isHovered && "text-rellia-teal translate-x-1.5",
                            )}
                          >
                            {item.label}
                          </span>
                          <span
                            className={cn(
                              "h-9 w-9 rounded-full border flex items-center justify-center",
                              "transition-[transform,color,border-color,background-color] duration-200 motion-reduce:transition-none",
                              "border-black/15 bg-white text-black/55",
                              isHovered && "border-rellia-teal text-rellia-teal",
                              "motion-safe:group-hover:translate-x-0.5",
                            )}
                            aria-hidden="true"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>

                        <div className="mt-4 h-px w-full bg-black/10">
                          <div
                            className={cn(
                              "h-px w-full origin-left bg-rellia-teal",
                              "transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none",
                              isHovered ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
                            )}
                          />
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* Mobile: no preview image (keeps section compact) */}
              </div>
            </div>

            {/* Right panel (full image) */}
            <div
              className={cn(
                "hidden lg:block group relative overflow-hidden rounded-[28px] border border-black/10",
                "bg-white shadow-[0_18px_60px_-36px_rgba(0,0,0,0.25)]",
                "min-h-[72vh]",
              )}
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              <AnimatePresence mode="sync" initial={false}>
                <motion.img
                  key={activeKey}
                  src={active?.imageSrc ?? "/images/hero-network.png"}
                  alt={active?.imageAlt ?? "Preview image"}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.995 }}
                  transition={reduceMotion ? undefined : { duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                />
              </AnimatePresence>
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

              <div
                className={cn(
                  "absolute inset-0 flex items-end p-7 md:p-9",
                  "transition-opacity duration-300 motion-reduce:transition-none",
                  showOverlay ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="max-w-[34rem]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                    {active?.label ?? ""}
                  </p>
                  <p className="mt-3 font-host-grotesk font-semibold text-white text-2xl md:text-3xl tracking-tight leading-tight">
                    {active?.title ?? ""}
                  </p>
                  <p className="mt-3 font-urbanist text-white/80 text-base md:text-lg leading-relaxed">
                    {active?.description ?? ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

