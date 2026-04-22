import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import WordRevealHeading from "@/components/WordRevealHeading"
import { ArrowRight } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

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

  const active = useMemo(() => list.find((x) => x.key === activeKey) ?? list[0], [activeKey, list])
  const showOverlay = Boolean(hoverKey) && !isImageHovered

  const handleActivate = (key: string) => {
    setActiveKey(key)
  }

  return (
    <section className="relative w-full bg-rellia-teal py-16 md:py-24 px-6 md:px-10 overflow-hidden">
      {/* Abstract left linework */}
      <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-full w-[180px] opacity-[0.28]">
        <svg
          className="h-full w-full"
          viewBox="0 0 180 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M110 -40C72 40 152 110 108 180C64 250 26 308 78 380C130 452 146 520 92 596C38 672 132 742 96 820C74 868 54 908 46 940"
            stroke="rgba(157,214,208,0.95)"
            strokeWidth="2.2"
          />
          <path
            d="M38 40C30 120 102 160 78 230C54 300 6 360 50 430C94 500 118 560 74 628C30 696 96 760 70 840"
            stroke="rgba(247,239,229,0.75)"
            strokeWidth="1.4"
          />
          <circle cx="110" cy="180" r="7" fill="rgba(157,214,208,0.35)" />
          <circle cx="92" cy="596" r="10" fill="rgba(247,239,229,0.22)" />
          <circle cx="70" cy="840" r="6" fill="rgba(157,214,208,0.28)" />
        </svg>
      </div>

      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Left panel */}
          <div className="rounded-[28px] bg-rellia-teal/85 backdrop-blur-sm p-7 md:p-9 text-white">
            <div>
              <h2 className="font-host-grotesk font-semibold text-white text-3xl md:text-[40px] leading-tight tracking-tight">
                Making <span className="text-rellia-mint">healthcare</span> work for{" "}
                <span className="text-rellia-mint">all of us</span>
              </h2>
              <p className="mt-4 font-urbanist text-white/80 text-base md:text-lg leading-relaxed max-w-xl">
                Explore the path that fits you best. Hover to preview what each door unlocks.
              </p>

              <div className="mt-8 flex flex-col" onMouseLeave={() => setHoverKey(null)}>
                {list.map((item) => {
                  const isHovered = item.key === hoverKey
                  const to = `/paths/${item.key}`
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
                            "text-white/90",
                            isHovered && "text-rellia-mint translate-x-1.5",
                          )}
                        >
                          {item.label}
                        </span>
                        <span
                          className={cn(
                            "h-9 w-9 rounded-full border flex items-center justify-center",
                            "transition-[transform,color,border-color,background-color] duration-200 motion-reduce:transition-none",
                            "border-white/25 bg-white/5 text-white/70",
                            isHovered && "border-rellia-mint text-rellia-mint",
                            "motion-safe:group-hover:translate-x-0.5",
                          )}
                          aria-hidden="true"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>

                      <div className="mt-4 h-px w-full bg-white/15">
                        <div
                          className={cn(
                            "h-px w-full origin-left bg-rellia-mint",
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
            className="hidden lg:block group relative overflow-hidden rounded-[28px] border border-white/15 bg-rellia-teal/40 shadow-[0_18px_60px_-36px_rgba(0,0,0,0.55)]"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={activeKey}
                src={active?.imageSrc ?? "/images/hero-network.png"}
                alt={active?.imageAlt ?? "Preview image"}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                initial={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.035 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.99 }}
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
                }
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
      </div>
    </section>
  )
}

