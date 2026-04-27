import { Helmet } from "react-helmet-async"
import { Link, useParams } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import { cn } from "@/lib/utils"
import { getStoryBySlug } from "@/content/stories"
import { getDefaultOgImageUrl, getSiteUrl } from "@/config/seo"
import { ChevronRight } from "lucide-react"

export default function StoryPost() {
  const { slug } = useParams()
  const story = slug ? getStoryBySlug(slug) : undefined

  const base = getSiteUrl()
  const canonical = story ? `${base}/stories/${story.slug}` : `${base}/stories`
  const title = story?.seoTitle ?? (story ? `${story.title} — Rellia Health` : "Stories — Rellia Health")
  const description = story?.seoDescription ?? story?.excerpt ?? "Stories and insights from Rellia Health."
  const imageUrl = story ? `${base}${story.coverImageSrc}` : getDefaultOgImageUrl()

  if (!story) {
    return (
      <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
        <Navbar />
        <main id="main-content" className="pt-[110px] md:pt-[132px] px-6 md:px-10 py-16">
          <div className="max-w-[900px] mx-auto">
            <h1 className="font-host-grotesk font-bold text-black text-3xl md:text-5xl tracking-tight">
              Story not found
            </h1>
            <p className="mt-4 font-urbanist text-black/70 text-base md:text-lg">
              The story you’re looking for doesn’t exist (or hasn’t been published yet).
            </p>
            <div className="mt-8">
              <Link
                to="/stories"
                className="inline-flex items-center rounded-full border-2 border-rellia-teal bg-rellia-teal px-6 py-3 font-host-grotesk font-semibold text-white transition-colors hover:bg-white hover:text-rellia-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2"
              >
                Back to stories
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <Helmet htmlAttributes={{ lang: "en" }}>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="article" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Rellia Health" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>

      <Navbar />
      <nav
        aria-label="Breadcrumb"
        className="fixed inset-x-0 top-[72px] md:top-[86px] z-40 border-b border-black/[0.06] bg-gradient-to-r from-rellia-cream/90 to-white/95 backdrop-blur-md"
      >
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-3.5 md:py-4">
          <ol className="flex flex-wrap items-center gap-2 text-sm md:text-[15px] font-urbanist">
            <li>
              <Link
                to="/stories"
                className="font-semibold text-rellia-teal transition-colors hover:text-rellia-teal/85 hover:underline underline-offset-4"
              >
                Stories
              </Link>
            </li>
            <li className="flex items-center text-black/30" aria-hidden>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </li>
            <li className="text-black/55 font-medium max-w-[min(100%,42rem)] truncate" title={story.title}>
              {story.title}
            </li>
          </ol>
        </div>
      </nav>

      <main id="main-content" className="pt-[128px] md:pt-[146px]">
        <section className="px-6 md:px-10 py-10 md:py-14">
          <div className="max-w-[900px] mx-auto">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-black/55">
              <span className="text-black/45">{story.tag}</span>
              <span className="text-black/25" aria-hidden>
                •
              </span>
              <time dateTime={story.publishedAt} className="text-black/45">
                {story.publishedAt}
              </time>
            </div>

            <ScrollReveal>
              <h1 className="mt-5 font-host-grotesk font-extrabold text-black text-3xl sm:text-4xl md:text-6xl tracking-tight leading-[1.06]">
                {story.title}
              </h1>
              <p className="mt-6 font-urbanist text-black/70 text-base md:text-lg leading-relaxed">
                {story.excerpt}
              </p>
            </ScrollReveal>

            <div className="mt-10 overflow-hidden rounded-[32px] border border-black/10 bg-rellia-cream/40">
              <img
                src={story.coverImageSrc}
                alt={story.coverImageAlt}
                className="h-[280px] md:h-[420px] w-full object-cover"
              />
            </div>

            <div className="mt-10">
              <div className="prose prose-neutral max-w-none">
                {story.body.map((b, i) => (
                  <p
                    key={`${b.type}-${i}`}
                    className={cn("font-urbanist text-black/80 text-base md:text-lg leading-relaxed")}
                  >
                    {b.text}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-12 border-t border-black/10 pt-8">
              <Link
                to="/stories"
                className="inline-flex items-center rounded-full border-2 border-rellia-teal bg-white px-6 py-3 font-host-grotesk font-semibold text-rellia-teal transition-colors hover:bg-rellia-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2"
              >
                Back to stories
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

