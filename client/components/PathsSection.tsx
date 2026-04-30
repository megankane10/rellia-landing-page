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
  const founders = useMemo(() => list.find((x) => x.key === "founders") ?? list[0], [list])
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
      {/* Gradient blobs only */}
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
      </motion.div>

      <div className="max-w-[1300px] mx-auto w-full py-12 md:py-24">
        <motion.div
          className="w-full"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
          animate={reduceMotion ? { opacity: 1, y: 0 } : isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
          transition={reduceMotion ? undefined : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className={cn(
              "relative isolate grid grid-cols-1 gap-8 md:gap-10 items-start",
              "lg:grid-cols-[minmax(0,1fr)_520px] xl:grid-cols-[minmax(0,1fr)_560px]",
            )}
          >
            {/* Left panel — full-bleed text + links on small screens; card shell only from lg */}
            <div className="relative z-10 max-lg:p-0 text-black lg:rounded-[28px] lg:p-9">
              <div>
                <h2 className="relative font-host-grotesk font-semibold text-black text-3xl md:text-[44px] leading-tight tracking-tight max-w-xl">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 opacity-70 blur-2xl"
                    style={{
                      background:
                        "radial-gradient(50% 55% at 30% 35%, rgba(157,214,208,0.75), rgba(157,214,208,0.0) 70%)",
                    }}
                  />
                  Find <span className="text-rellia-teal">your place</span> in the Rellia community.
                </h2>
                <p className="mt-4 font-urbanist text-black/70 text-base md:text-lg leading-relaxed max-w-xl">
                  Select your role to see where you fit in
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

                {/* Mobile: show the preview image after the left content */}
                <div
                  className={cn(
                    "relative mt-8 overflow-hidden rounded-[22px] border border-black/10 lg:hidden",
                    "bg-white shadow-[0_18px_60px_-36px_rgba(0,0,0,0.25)]",
                    "h-[260px] sm:h-[300px]",
                  )}
                >
                  {/*
                    Mobile default: show Founders image only (no overlay).
                    When a link is hovered/focused, show that role's image + overlay content.
                  */}
                  <AnimatePresence mode="sync" initial={false}>
                    <motion.img
                      key={showOverlay ? activeKey : "mobile-founders"}
                      src={(showOverlay ? active?.imageSrc : founders?.imageSrc) ?? "/images/hero-network.png"}
                      alt={(showOverlay ? active?.imageAlt : founders?.imageAlt) ?? "Preview image"}
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

                  {showOverlay ? (
                    <>
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                      <div aria-hidden className="absolute inset-0 bg-black/20" />

                      <div className="absolute inset-0 flex items-end p-6">
                        <div className="max-w-[34rem]">
                          <p className="font-host-grotesk font-medium text-white text-xl tracking-tight leading-tight">
                            {active?.title ?? ""}
                          </p>
                          <p className="mt-2 font-urbanist text-white/85 text-sm leading-relaxed">
                            {active?.description ?? ""}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Right panel (full image) */}
            <div
              className={cn(
                "relative z-10 hidden overflow-hidden rounded-[28px] border border-black/10 lg:block group",
                "bg-white shadow-[0_18px_60px_-36px_rgba(0,0,0,0.25)]",
                "lg:sticky lg:top-28",
                "h-[560px] xl:h-[620px]",
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
                aria-hidden
                className={cn(
                  "absolute inset-0 bg-black/30 transition-opacity duration-300 motion-reduce:transition-none",
                  showOverlay ? "opacity-100" : "opacity-0",
                )}
              />

              <div
                className={cn(
                  "absolute inset-0 flex items-end p-7 md:p-9",
                  "transition-opacity duration-300 motion-reduce:transition-none",
                  showOverlay ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="max-w-[34rem]">
                  <p className="font-host-grotesk font-medium text-white text-2xl md:text-3xl tracking-tight leading-tight">
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

