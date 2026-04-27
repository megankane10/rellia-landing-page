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

        {/* Faint grid texture (adds depth without noise assets) */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(12,61,73,0.9) 1px, transparent 1px), linear-gradient(to bottom, rgba(12,61,73,0.9) 1px, transparent 1px)",
            backgroundSize: "92px 92px",
          }}
        />

        {/* Gentle vignette to keep content readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/55" />
      </motion.div>

      {/* Blur blobs (hero-style) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={reduceMotion ? undefined : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="absolute -top-24 -left-24 h-[340px] w-[340px] rounded-full bg-rellia-mint/35 blur-3xl"
          animate={shouldAnimate ? { y: [0, 18, 0] } : { y: 0 }}
          transition={shouldAnimate ? { duration: 8, ease: [0.45, 0, 0.55, 1], repeat: Infinity, repeatType: "mirror" } : undefined}
        />
        <motion.div
          className="absolute -bottom-28 left-[12%] h-[460px] w-[460px] rounded-full bg-rellia-mint/20 blur-3xl"
          animate={shouldAnimate ? { y: [0, -14, 0] } : { y: 0 }}
          transition={shouldAnimate ? { duration: 10, ease: [0.45, 0, 0.55, 1], repeat: Infinity, repeatType: "mirror" } : undefined}
        />
        <motion.div
          className="absolute top-1/2 -right-32 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-rellia-teal/10 blur-3xl"
          animate={shouldAnimate ? { x: [0, -16, 0] } : { x: 0 }}
          transition={shouldAnimate ? { duration: 9, ease: [0.45, 0, 0.55, 1], repeat: Infinity, repeatType: "mirror" } : undefined}
        />

        {/* Small accent blobs for richer composition */}
        <motion.div
          className="absolute right-[22%] top-[18%] h-36 w-36 rounded-full bg-rellia-teal/10 blur-2xl"
          animate={shouldAnimate ? { y: [0, 10, 0], x: [0, 6, 0] } : { y: 0, x: 0 }}
          transition={shouldAnimate ? { duration: 7.5, ease: [0.45, 0, 0.55, 1], repeat: Infinity, repeatType: "mirror" } : undefined}
        />
        <motion.div
          className="absolute left-[58%] bottom-[12%] h-44 w-44 rounded-full bg-rellia-mint/18 blur-2xl"
          animate={shouldAnimate ? { y: [0, -12, 0] } : { y: 0 }}
          transition={shouldAnimate ? { duration: 9.5, ease: [0.45, 0, 0.55, 1], repeat: Infinity, repeatType: "mirror" } : undefined}
        />
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
          <div className="relative isolate grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2 items-stretch">
            {/* Gradient over the grid; masked out behind the path links (clear / section bg shows through) */}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 z-0 max-lg:rounded-none lg:rounded-[28px]",
                /* mobile: fade gradient out across the vertical band where the link list sits */
                "[mask-image:linear-gradient(to_bottom,black_0%,black_14%,transparent_26%,transparent_62%,black_72%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_14%,transparent_26%,transparent_62%,black_72%,black_100%)]",
                /* lg: only the right column + seam carries the wash; left stays clear for buttons */
                "lg:[mask-image:linear-gradient(to_right,transparent_0%,transparent_calc(50%-0.625rem),black_calc(50%-0.125rem),black_100%)] lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,transparent_calc(50%-0.625rem),black_calc(50%-0.125rem),black_100%)]",
              )}
              style={{
                background:
                  "linear-gradient(118deg, rgba(12,61,73,0.10) 0%, rgba(167,219,214,0.16) 42%, rgba(255,255,255,0.72) 68%, rgba(12,61,73,0.06) 100%)",
              }}
            />

            {/* Left panel — full-bleed text + links on small screens; card shell only from lg */}
            <div className="relative z-10 max-lg:p-0 text-black lg:rounded-[28px] lg:p-9">
              <div>
                <h2 className="font-host-grotesk font-semibold text-black text-3xl md:text-[44px] leading-tight tracking-tight max-w-xl">
                  Reimagining healthcare, <span className="text-rellia-teal">together</span>.
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
                "relative z-10 hidden overflow-hidden rounded-[28px] border border-black/10 lg:block group",
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

