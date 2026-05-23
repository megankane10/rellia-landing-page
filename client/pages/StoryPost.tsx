import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ScrollReveal from "@/components/ScrollReveal"
import { cn } from "@/lib/utils"
import { getStoryBySlug } from "@/content/stories"
import { allowCmsSeedFallbacks } from "@/lib/deploymentEnv"
import {
  buildPageUrl,
  clampMetaDescription,
  clampMetaTitle,
  getShareOrigin,
  resolveSocialOgImageUrl,
} from "@/config/seo"
import StoryArticleJsonLd from "@/components/seo/StoryArticleJsonLd"
import PageSocialHelmet from "@/components/seo/PageSocialHelmet"
import { ChevronLeft, Check } from "lucide-react"
import { RichTextImageCarousel } from "@/components/RichTextImageCarousel"
import { AnimatePresence, motion } from "framer-motion"
import { PortableRichText } from "@/components/PortableRichText"
import { useStoryBySlug } from "@/hooks/useCmsDocuments"
import { isCmsQueryLoading, shouldShowCmsEmptyState } from "@/lib/cmsQueryState"
import CmsPageLoadingShell from "@/components/cms/CmsPageLoadingShell"
import { isSanityConfigured } from "@/lib/sanity"
import {
  ShareIconCopy,
  ShareIconFacebook,
  ShareIconLinkedIn,
  ShareIconX,
  shareToolbarButtonClassName,
} from "@/components/share/sharePageIcons"

export default function StoryPost() {
  const { slug } = useParams()
  const resolvedSlug = slug?.trim() ?? ""
  const storyQuery = useStoryBySlug(resolvedSlug)
  const { data: cmsStory } = storyQuery
  const story = slug && allowCmsSeedFallbacks() ? getStoryBySlug(slug) : undefined
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle")

  const canonical = cmsStory?.slug
    ? buildPageUrl(`/stories/${cmsStory.slug}`)
    : story
      ? buildPageUrl(`/stories/${story.slug}`)
      : buildPageUrl("/stories")

  const title = cmsStory?.title
    ? `${cmsStory.title} — Rellia Health`
    : story?.seoTitle ||
      (story ? `${story.title} — Rellia Health` : "Stories — Rellia Health")

  const description =
    cmsStory?.excerpt?.trim() ||
    story?.seoDescription ||
    story?.excerpt ||
    cmsStory?.seo?.metaDescription?.trim() ||
    cmsStory?.seo?.ogDescription?.trim() ||
    "Stories and insights from Rellia Health."

  const resolvedTitle = clampMetaTitle(title)
  const resolvedDescription = clampMetaDescription(description)

  const toAbsoluteImageUrl = (src: string): string => {
    const origin = getShareOrigin()
    if (/^https?:\/\//i.test(src)) return src
    if (!src.startsWith("/")) return `${origin}/${src}`
    return `${origin}${src}`
  }

  const headerCoverSrc = cmsStory?.coverImageSrc?.trim() || story?.coverImageSrc?.trim()
  const imageUrl = headerCoverSrc
    ? resolveSocialOgImageUrl(headerCoverSrc) ?? toAbsoluteImageUrl(headerCoverSrc)
    : undefined

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonical)
      setCopyState("copied")
      window.setTimeout(() => setCopyState("idle"), 2000)
    } catch {
      setCopyState("idle")
    }
  }

  if (resolvedSlug && isSanityConfigured() && isCmsQueryLoading(storyQuery)) {
    return <CmsPageLoadingShell />
  }

  if (!cmsStory && !story && (!resolvedSlug || shouldShowCmsEmptyState(storyQuery))) {
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

  if (cmsStory) {
    return (
      <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
        <PageSocialHelmet
          title={resolvedTitle}
          description={resolvedDescription}
          canonical={canonical}
          ogImage={imageUrl}
          ogType="article"
        />

        <Navbar />

        <main id="main-content">
          <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 bg-rellia-cream overflow-hidden">
            <div aria-hidden className="absolute inset-0 pointer-events-none">
              {cmsStory.coverImageSrc ? (
                <img
                  src={toAbsoluteImageUrl(cmsStory.coverImageSrc)}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-[0.62]"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-r from-rellia-cream/90 via-rellia-cream/55 to-transparent" />
              <div className="absolute -left-28 -top-32 h-[520px] w-[520px] rounded-full bg-rellia-mint/20 blur-3xl" />
              <div className="absolute -right-40 top-1/3 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-rellia-teal/10 blur-3xl" />
              <div className="absolute left-1/3 bottom-[-220px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-rellia-mint/15 blur-3xl" />
              <div className="absolute inset-0 opacity-[0.18] mix-blend-multiply [background-image:radial-gradient(circle_at_20%_10%,rgba(13,53,64,0.10),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(13,53,64,0.08),transparent_52%),radial-gradient(circle_at_40%_95%,rgba(13,53,64,0.09),transparent_55%)]" />
            </div>

            <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10">
              <div className="mx-auto w-full max-w-[1100px]">
                <div className="flex flex-col">
                  <ScrollReveal>
                    <div className="inline-flex items-center gap-2 rounded-full bg-rellia-mint px-3 py-1.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rellia-teal" aria-hidden />
                      <span className="font-host-grotesk text-[11px] font-semibold uppercase tracking-[0.14em] text-rellia-teal">
                        {(cmsStory.tag ?? "Story").trim() || "Story"}
                      </span>
                    </div>

                    <h1 className="mt-6 text-rellia-teal text-3xl md:text-4xl lg:text-5xl font-medium leading-tight tracking-tight">
                      {cmsStory.title}
                    </h1>
                    {cmsStory.excerpt ? (
                      <p className="mt-4 text-black text-base md:text-lg max-w-3xl font-urbanist font-normal leading-relaxed">
                        {cmsStory.excerpt}
                      </p>
                    ) : null}
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 md:px-10 py-10 md:py-14">
            <div className="max-w-[900px] mx-auto">
              <div className="mb-8">
                <Link
                  to="/stories"
                  className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:underline hover:underline-offset-4"
                  aria-label="Back to stories"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Back to stories
                </Link>
              </div>

              <PortableRichText value={cmsStory.body} />

              <div className="mt-12 border-t border-black/10 pt-8">
                <Link
                  to="/stories"
                  className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:underline hover:underline-offset-4"
                  aria-label="Back to stories"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
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

  return (
    <div className="min-h-screen bg-white font-host-grotesk overflow-x-hidden">
      <PageSocialHelmet
        title={resolvedTitle}
        description={resolvedDescription}
        canonical={canonical}
        ogImage={imageUrl}
        ogType="article"
      />
      <StoryArticleJsonLd
        headline={cmsStory?.title ?? story?.title ?? "Rellia Health story"}
        description={resolvedDescription}
        url={canonical}
        imageUrl={imageUrl}
      />

      <Navbar />

      <main id="main-content">
        <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 bg-rellia-cream overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <img
              src={toAbsoluteImageUrl(story.coverImageSrc)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-[0.62]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rellia-cream/90 via-rellia-cream/55 to-transparent" />
            <div className="absolute -left-28 -top-32 h-[520px] w-[520px] rounded-full bg-rellia-mint/20 blur-3xl" />
            <div className="absolute -right-40 top-1/3 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-rellia-teal/10 blur-3xl" />
            <div className="absolute left-1/3 bottom-[-220px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-rellia-mint/15 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.18] mix-blend-multiply [background-image:radial-gradient(circle_at_20%_10%,rgba(13,53,64,0.10),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(13,53,64,0.08),transparent_52%),radial-gradient(circle_at_40%_95%,rgba(13,53,64,0.09),transparent_55%)]" />
          </div>

          <div className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10">
            <div className="mx-auto w-full max-w-[1100px]">
              <div className="flex flex-col">
                <ScrollReveal>
                  <div className="inline-flex items-center gap-2 rounded-full bg-rellia-mint px-3 py-1.5">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rellia-teal" aria-hidden />
                    <span className="font-host-grotesk text-[11px] font-semibold uppercase tracking-[0.14em] text-rellia-teal">
                      {story.tag}
                    </span>
                  </div>

                  <h1 className="mt-6 text-rellia-teal text-3xl md:text-4xl lg:text-5xl font-medium leading-tight tracking-tight">
                    {story.title}
                  </h1>
                  <p className="mt-4 text-black text-base md:text-lg max-w-3xl font-urbanist font-normal leading-relaxed">
                    {story.excerpt}
                  </p>

                  <div className="h-8 md:h-10" aria-hidden />

                  <div className="mt-8 flex flex-col items-start gap-4">
                    <p className="font-host-grotesk text-[12px] font-semibold uppercase tracking-[0.14em] text-black/55">
                      Share this story
                    </p>
                    <div className="h-px w-full bg-black/10" aria-hidden />

                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={shareToolbarButtonClassName}
                        aria-label="Share on X"
                      >
                        <ShareIconX />
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={shareToolbarButtonClassName}
                        aria-label="Share on LinkedIn"
                      >
                        <ShareIconLinkedIn />
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={shareToolbarButtonClassName}
                        aria-label="Share on Facebook"
                      >
                        <ShareIconFacebook />
                      </a>

                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className={cn(
                          shareToolbarButtonClassName,
                          copyState === "copied" && "bg-rellia-mint text-rellia-teal border-rellia-teal shadow-md"
                        )}
                        aria-label={copyState === "copied" ? "Link copied" : "Copy story link"}
                      >
                        {copyState === "copied" ? (
                          <Check className="h-5 w-5 shrink-0 animate-scale-in" />
                        ) : (
                          <ShareIconCopy />
                        )}
                      </button>

                      <AnimatePresence mode="wait" initial={false}>
                        {copyState === "copied" ? (
                          <motion.span
                            key="copied-feedback"
                            className="font-host-grotesk text-sm font-semibold text-rellia-teal"
                            initial={{ opacity: 0, y: 4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.98 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          >
                            Copied!
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-10 py-10 md:py-14">
          <div className="max-w-[900px] mx-auto">
            <div className="mb-8">
              <Link
                to="/stories"
                className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:underline hover:underline-offset-4"
                aria-label="Back to stories"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Back to stories
              </Link>
            </div>

            <div>
              <div className="prose prose-neutral max-w-none">
                {story.body.map((b, i) => {
                  const key = `${b.type}-${i}`

                  if (b.type === "h2") {
                    return (
                      <h2 key={key} className="mt-10 font-host-grotesk text-2xl md:text-3xl font-semibold tracking-tight text-black">
                        {b.text}
                      </h2>
                    )
                  }

                  if (b.type === "h3") {
                    return (
                      <h3 key={key} className="mt-8 font-host-grotesk text-xl md:text-2xl font-semibold tracking-tight text-black">
                        {b.text}
                      </h3>
                    )
                  }

                  if (b.type === "quote") {
                    return (
                      <figure
                        key={key}
                        className="relative my-10 overflow-hidden rounded-[1.75rem] bg-rellia-teal px-6 py-8 md:px-8 md:py-10"
                      >
                        <div
                          className="pointer-events-none absolute top-[-20%] right-[-10%] h-40 w-40 rounded-full bg-rellia-mint/20 blur-[80px]"
                          aria-hidden
                        />
                        <blockquote className="relative font-urbanist text-xl font-medium leading-snug text-rellia-mint md:text-2xl">
                          &ldquo;{b.text}&rdquo;
                        </blockquote>
                        {b.attribution ? (
                          <figcaption className="relative mt-6 font-host-grotesk text-sm font-semibold tracking-wide text-rellia-mint/85">
                            — {b.attribution}
                          </figcaption>
                        ) : null}
                      </figure>
                    )
                  }

                  if (b.type === "image") {
                    return (
                      <figure key={key} className="my-10">
                        <div className="overflow-hidden rounded-2xl bg-black/5 aspect-video">
                          <img src={b.src} alt={b.alt} className="h-full w-full object-cover" loading="lazy" />
                        </div>
                        {b.caption ? (
                          <figcaption className="mt-3 font-urbanist text-sm text-black/55">{b.caption}</figcaption>
                        ) : null}
                      </figure>
                    )
                  }

                  if (b.type === "imageCarousel") {
                    const slides = b.slides.map((s) => ({
                      imageSrc: s.src,
                      alt: s.alt,
                      caption: s.caption,
                    }))
                    return (
                      <RichTextImageCarousel
                        key={key}
                        title={b.title}
                        slides={slides}
                        className="my-10"
                      />
                    )
                  }

                  if (b.type === "cta") {
                    return (
                      <div key={key} className="my-12 rounded-3xl border border-black/10 bg-white px-7 py-7 md:px-10 md:py-9">
                        <h3 className="font-host-grotesk text-xl md:text-2xl font-semibold tracking-tight text-black">
                          {b.title}
                        </h3>
                        <p className="mt-3 font-urbanist text-black/65 text-base md:text-lg leading-relaxed">
                          {b.body}
                        </p>
                        <div className="mt-6">
                          <Link
                            to={b.buttonHref}
                            className="inline-flex items-center rounded-full border-2 border-rellia-teal bg-white px-6 py-3 font-host-grotesk font-semibold text-rellia-teal transition-colors hover:bg-rellia-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2"
                            aria-label={b.buttonLabel}
                          >
                            {b.buttonLabel}
                          </Link>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <p
                      key={key}
                      className={cn("font-urbanist text-black/80 text-base md:text-lg leading-[1.85] mb-6")}
                    >
                      {b.text}
                    </p>
                  )
                })}
              </div>
            </div>

            <div className="mt-12 border-t border-black/10 pt-8">
              <Link
                to="/stories"
                className="inline-flex items-center gap-2 font-host-grotesk text-sm font-semibold text-rellia-teal hover:underline hover:underline-offset-4"
                aria-label="Back to stories"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
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

