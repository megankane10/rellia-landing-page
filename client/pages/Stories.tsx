import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import { cn } from "@/lib/utils"
import { STORIES, type StoryTag } from "@/content/stories"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatePresence, motion } from "framer-motion"

const tags: Array<StoryTag | "All"> = ["All", "Founder Story", "Industry Insight", "Program Update"]

const StoryGridCard = ({
  story,
}: {
  story: {
    slug: string
    title: string
    excerpt: string
    coverImageSrc: string
    coverImageAlt: string
    tag: string
    publishedAt: string
  }
}) => {
  const cleanTitle = useMemo(() => {
    const raw = (story.title ?? "").trim()
    return raw.replace(/^(founder story|industry insight|program update)\s*:\s*/i, "")
  }, [story.title])

  return (
    <article className="w-full">
      <Link
        to={`/stories/${story.slug}`}
        className={cn(
          "group block h-full w-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm",
          "transition-[transform,box-shadow] duration-200 ease-out",
          "hover:-translate-y-0.5 hover:shadow-md hover:shadow-lg hover:ring-1 hover:ring-black/[0.06]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal focus-visible:ring-offset-2",
        )}
        aria-label={`Read ${story.title}`}
      >
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-rellia-teal/5">
          <div className="absolute right-3 top-3 z-10">
            <span className="inline-flex items-center rounded-full bg-rellia-mint/90 px-3 py-1 font-host-grotesk text-[11px] font-extrabold uppercase tracking-[0.16em] text-rellia-teal shadow-lg ring-1 ring-white/50">
              {story.tag}
            </span>
          </div>
          <img
            src={story.coverImageSrc}
            alt={story.coverImageAlt}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-host-grotesk text-[16px] md:text-lg font-medium leading-snug text-black line-clamp-3">
            {cleanTitle}
          </h3>
        </div>
      </Link>
    </article>
  )
}

export default function Stories() {
  const [activeTag, setActiveTag] = useState<(typeof tags)[number]>("All")

  const filtered = useMemo(() => {
    if (activeTag === "All") return STORIES
    return STORIES.filter((s) => s.tag === activeTag)
  }, [activeTag])

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Navbar />
      <main id="main-content">
        <section className="relative flex h-[24rem] flex-shrink-0 flex-col overflow-hidden bg-rellia-teal pt-28 pb-16 md:h-[28rem] md:pt-36 md:pb-20">
          {/* Decorative background */}
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            {/* Modernist grid texture */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.9) 1px, transparent 1px)",
                backgroundSize: "84px 84px",
              }}
            />

            {/* Mint glow blobs */}
            <div className="absolute -top-24 -left-24 h-[320px] w-[320px] rounded-full bg-rellia-mint/35 blur-3xl" />
            <div className="absolute -bottom-28 left-[18%] h-[420px] w-[420px] rounded-full bg-rellia-mint/20 blur-3xl" />
            <div className="absolute top-1/2 -right-32 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-rellia-mint/25 blur-3xl" />

            {/* Faint brand mark */}
            <img
              src="/images/hologram-logo.png"
              alt=""
              className="absolute right-0 top-1/2 -translate-y-1/2 h-[70%] md:h-[88%] w-auto object-contain opacity-[0.08]"
            />

            {/* Gentle vignette for contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-[1300px] flex-1 flex-col justify-center px-6 md:px-10">
            <ScrollReveal>
              <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                Stories & <span className="text-rellia-mint">Insights</span>
              </h1>
              <p className="mt-6 text-white/80 text-base md:text-lg max-w-2xl font-urbanist leading-relaxed">
                Founder stories, industry insight, and program updates — all in one place.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="px-6 md:px-10 pt-12 md:pt-14 pb-16 md:pb-20 bg-white">
          <div className="max-w-[1300px] mx-auto">
            <div>
              {/* Mobile: dropdown */}
              <div className="md:hidden">
                <label className="sr-only" htmlFor="stories-filter">
                  Filter stories
                </label>
                <select
                  id="stories-filter"
                  value={activeTag}
                  onChange={(e) => setActiveTag(e.target.value as (typeof tags)[number])}
                  className={cn(
                    "h-12 w-full rounded-2xl border border-black/10 bg-white px-4",
                    "font-host-grotesk text-[13px] font-semibold uppercase tracking-[0.14em] text-black/80",
                    "focus:outline-none focus:ring-2 focus:ring-rellia-mint focus:ring-offset-2 focus:ring-offset-white",
                  )}
                  aria-label="Filter stories"
                >
                  {tags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Desktop: segmented tabs */}
              <div className="hidden md:block">
                <Tabs value={activeTag} onValueChange={(v) => setActiveTag(v as (typeof tags)[number])}>
                  <TabsList
                    className={cn(
                      "relative h-auto w-fit gap-1 rounded-full bg-white p-1.5",
                      "border border-black/10 shadow-[0_12px_32px_-22px_rgba(0,0,0,0.22)]",
                    )}
                  >
                    {tags.map((t) => (
                      <TabsTrigger
                        key={t}
                        value={t}
                        className={cn(
                          "relative z-10 rounded-full px-4 py-2.5",
                          "font-host-grotesk text-[12px] font-semibold uppercase tracking-[0.14em]",
                          "text-black/80 hover:text-rellia-teal",
                          "data-[state=active]:text-white",
                          "focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                        )}
                      >
                        {activeTag === t ? (
                          <motion.span
                            layoutId="stories-filter-pill"
                            className="absolute inset-0 -z-10 rounded-full bg-rellia-teal shadow-sm"
                            transition={{ duration: 0.32, ease: "easeInOut" }}
                            aria-hidden
                          />
                        ) : null}
                        {t}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <motion.div layout className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout" initial={false}>
                {filtered.map((story, i) => (
                  <motion.div
                    key={story.slug}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ScrollReveal delay={i * 0.05}>
                      <StoryGridCard story={story} />
                    </ScrollReveal>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

