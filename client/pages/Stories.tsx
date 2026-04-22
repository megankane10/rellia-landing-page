import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SectionHeading from "@/components/SectionHeading"
import ScrollReveal from "@/components/ScrollReveal"
import { cn } from "@/lib/utils"
import { STORIES, type StoryTag } from "@/content/stories"

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
  const excerptRef = useRef<HTMLParagraphElement | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [canExpand, setCanExpand] = useState(false)

  useEffect(() => {
    const el = excerptRef.current
    if (!el) return

    const check = () => {
      const next = el.scrollHeight > el.clientHeight + 1
      setCanExpand(next)
    }

    check()
    const ro = new ResizeObserver(() => check())
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <article className="h-[520px] md:h-[540px] overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="flex h-full flex-col">
        <Link
          to={`/stories/${story.slug}`}
          className="block outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-[28px]"
          aria-label={`Read ${story.title}`}
        >
          <img
            src={story.coverImageSrc}
            alt={story.coverImageAlt}
            className="h-[220px] w-full object-cover"
            loading="lazy"
          />
        </Link>

        <div className="flex flex-1 flex-col p-6 md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/50">{story.tag}</p>
          <h3 className="mt-2 font-host-grotesk font-semibold text-black text-xl md:text-2xl tracking-tight leading-snug">
            {story.title}
          </h3>

          <div className="mt-3">
            <p
              ref={excerptRef}
              className={cn(
                "font-urbanist text-black/70 text-base leading-relaxed",
                !expanded && "line-clamp-3",
              )}
            >
              {story.excerpt}
            </p>

            {canExpand ? (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-rellia-teal transition-colors hover:border-rellia-teal/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2"
                aria-label={expanded ? "Collapse story description" : "Expand story description"}
              >
                {expanded ? "Show less" : "Read more"}
                <span
                  aria-hidden
                  className={cn(
                    "translate-y-[1px] transition-transform duration-200 motion-reduce:transition-none",
                    expanded ? "-rotate-90" : "rotate-90",
                  )}
                >
                  →
                </span>
              </button>
            ) : null}
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-black/10 pt-4">
            <time dateTime={story.publishedAt} className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
              {story.publishedAt}
            </time>
            <Link
              to={`/stories/${story.slug}`}
              className="inline-flex items-center gap-2 font-host-grotesk font-semibold text-rellia-teal outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-md"
              aria-label={`Read more: ${story.title}`}
            >
              Open
              <span aria-hidden className="translate-y-[1px]">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
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
            <SectionHeading
              title="All stories"
              description="Browse founder stories, industry insight, and program updates."
              align="left"
              className="max-w-2xl"
            />

            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((t) => {
                const isActive = t === activeTag
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTag(t)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-200 motion-reduce:transition-none",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2",
                      isActive ? "border-rellia-teal bg-rellia-teal text-white" : "border-black/10 bg-white text-black/70 hover:border-rellia-teal/30 hover:text-rellia-teal",
                    )}
                    aria-pressed={isActive}
                  >
                    {t}
                  </button>
                )
              })}
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((story, i) => (
                <ScrollReveal key={story.slug} delay={i * 0.05}>
                  <StoryGridCard story={story} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

