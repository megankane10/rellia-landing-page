import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import { cn } from "@/lib/utils"
import { STORIES, type StoryTag } from "@/content/stories"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const dateParts = useMemo(() => {
    const raw = (story.publishedAt ?? "").trim()
    const [y, m, d] = raw.split("-").map((x) => x?.trim())
    const month = Number(m)
    const day = Number(d)

    const monthLabel =
      month >= 1 && month <= 12
        ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1]
        : ""

    return {
      monthLabel,
      dayLabel: Number.isFinite(day) ? String(day).padStart(2, "0") : "",
    }
  }, [story.publishedAt])

  return (
    <article className="w-full">
      <Link
        to={`/stories/${story.slug}`}
        className={cn(
          "group block w-full overflow-hidden rounded-3xl border border-black/5 bg-[#FAFAFA]",
          "shadow-sm transition-[transform,box-shadow] duration-300 motion-reduce:transition-none",
          "hover:-translate-y-1 hover:bg-[#F5F5F5] hover:shadow-lg hover:shadow-[0_20px_55px_-35px_rgba(0,0,0,0.45)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        )}
        aria-label={`Read ${story.title}`}
      >
        <div className="overflow-hidden">
          <img
            src={story.coverImageSrc}
            alt={story.coverImageAlt}
            className="h-[240px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>

        <div className="flex h-[180px] flex-col px-6 pb-6 pt-5 md:px-7 md:pb-7">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rellia-teal" aria-hidden />
            <span className="font-host-grotesk text-[11px] font-semibold uppercase tracking-[0.14em] text-rellia-teal">
              {story.tag}
            </span>
          </div>

          <h3 className="mt-3 font-host-grotesk font-normal text-black text-xl md:text-2xl tracking-tight leading-snug line-clamp-2">
            {story.title}
          </h3>

          <div className="mt-auto pt-3">
            <div aria-hidden className="mb-3 h-px w-full bg-black/10" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-black/50">
              {dateParts.monthLabel} {dateParts.dayLabel}
            </span>
            <time dateTime={story.publishedAt} className="sr-only">
              {story.publishedAt}
            </time>
          </div>
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
                <Select value={activeTag} onValueChange={(v) => setActiveTag(v as (typeof tags)[number])}>
                  <SelectTrigger
                    className={cn(
                      "h-12 rounded-2xl border-black/10 bg-white px-4",
                      "font-host-grotesk text-[13px] font-semibold uppercase tracking-[0.14em] text-black/80",
                      "focus:ring-rellia-mint focus:ring-offset-2",
                    )}
                    aria-label="Filter stories"
                  >
                    <SelectValue placeholder="Filter stories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-black/10">
                    {tags.map((t) => (
                      <SelectItem
                        key={t}
                        value={t}
                        className="rounded-xl font-host-grotesk text-[12px] font-semibold uppercase tracking-[0.14em] text-black/80"
                      >
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

