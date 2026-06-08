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
  ShareIconMail,
  ShareIconX,
} from "@/components/share/sharePageIcons"
import { buildMailtoHref } from "@/lib/mailto"
import { DEFAULT_GLOBAL_SETTINGS } from "@shared/cms/defaults"
import { StoryPostHero } from "@/components/StoryPostHero"
import { RichTextQuoteFigure } from "@/components/RichTextQuoteFigure"
import ImageExpandModal from "@/components/ImageExpandModal"

export default function StoryPost() {
  const { slug } = useParams()
  const resolvedSlug = slug?.trim() ?? ""
  const storyQuery = useStoryBySlug(resolvedSlug)
  const { data: cmsStory } = storyQuery
  const story = slug && allowCmsSeedFallbacks() ? getStoryBySlug(slug) : undefined
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle")
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null)

  const canonical = cmsStory?.slug
    ? buildPageUrl(`/stories/${cmsStory.slug}`)
    : story
      ? buildPageUrl(`/stories/${story.slug}`)
      : buildPageUrl("/stories")

  const titleSource =
    cmsStory?.seo?.metaTitle?.trim() ||
    cmsStory?.seo?.ogTitle?.trim() ||
    story?.seoTitle ||
    (cmsStory?.title
      ? `${cmsStory.title} — Rellia Health`
      : story
        ? `${story.title} — Rellia Health`
        : "Stories — Rellia Health")

  const descriptionSource =
    cmsStory?.seo?.metaDescription?.trim() ||
    cmsStory?.seo?.ogDescription?.trim() ||
    cmsStory?.excerpt?.trim() ||
    story?.seoDescription ||
    story?.excerpt ||
    "Stories and insights from Rellia Health."

  const resolvedTitle = clampMetaTitle(titleSource)
  const resolvedDescription = clampMetaDescription(descriptionSource)

  const toAbsoluteImageUrl = (src: string): string => {
    const origin = getShareOrigin()
    if (/^https?:\/\//i.test(src)) return src
    if (!src.startsWith("/")) return `${origin}/${src}`
    return `${origin}${src}`
  }

  const headerCoverSrc = cmsStory?.coverImageSrc?.trim() || story?.coverImageSrc?.trim()
  const headerCoverAlt = cmsStory?.coverImageAlt?.trim() || story?.coverImageAlt?.trim() || cmsStory?.title || story?.title || ""
  const headerLayout = cmsStory?.headerLayout === "background" ? "background" : "block"
  const seoOgImageSrc =
    cmsStory?.seo?.ogImageUrl?.trim() || headerCoverSrc
  const imageUrl = seoOgImageSrc
    ? resolveSocialOgImageUrl(seoOgImageSrc) ?? toAbsoluteImageUrl(seoOgImageSrc)
    : undefined
  const shareTitle = resolvedTitle

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonical)
      setCopyState("copied")
      window.setTimeout(() => setCopyState("idle"), 2000)
    } catch {
      setCopyState("idle")
    }
  }

  const shareToolbarButtonClassNameDark =
    "inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-rellia-teal transition-transform transition-colors hover:-translate-y-0.5 hover:bg-rellia-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-rellia-teal"

  const shareBlock = (
    <div className="flex flex-col items-start gap-4 text-white">
      <p className="font-host-grotesk text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70">
        Share this story
      </p>
      <div className="h-px w-full bg-white/20" aria-hidden />

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(shareTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={shareToolbarButtonClassNameDark}
          aria-label="Share on X"
        >
          <ShareIconX />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={shareToolbarButtonClassNameDark}
          aria-label="Share on LinkedIn"
        >
          <ShareIconLinkedIn />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={shareToolbarButtonClassNameDark}
          aria-label="Share on Facebook"
        >
          <ShareIconFacebook />
        </a>
        <a
          href={buildMailtoHref(DEFAULT_GLOBAL_SETTINGS.supportEmail, {
            subject: shareTitle,
            body: `${shareTitle}\n\n${canonical}`,
          })}
          className={shareToolbarButtonClassNameDark}
          aria-label="Share by email"
        >
          <ShareIconMail />
        </a>

        <button
          type="button"
          onClick={handleCopyLink}
          className={cn(
            shareToolbarButtonClassNameDark,
            copyState === "copied" && "border border-rellia-teal bg-rellia-mint text-rellia-teal shadow-md",
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
              className="font-host-grotesk text-sm font-semibold text-rellia-mint"
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
  )

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
          <StoryPostHero
            tag={(cmsStory.tag ?? "Story").trim() || "Story"}
            title={cmsStory.title}
            excerpt={cmsStory.excerpt}
            coverImageSrc={headerCoverSrc}
            coverImageAlt={headerCoverAlt}
            layout={headerLayout}
            toAbsoluteImageUrl={toAbsoluteImageUrl}
            shareBlock={shareBlock}
          />

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
        <ImageExpandModal
          src={activeImage?.src ?? null}
          alt={activeImage?.alt ?? ""}
          open={Boolean(activeImage)}
          onOpenChange={(open) => !open && setActiveImage(null)}
        />
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
        <StoryPostHero
          tag={story.tag}
          title={story.title}
          excerpt={story.excerpt}
          coverImageSrc={headerCoverSrc}
          coverImageAlt={headerCoverAlt}
          toAbsoluteImageUrl={toAbsoluteImageUrl}
          shareBlock={shareBlock}
        />

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
                      <RichTextQuoteFigure
                        key={key}
                        quote={<>&ldquo;{b.text}&rdquo;</>}
                        attribution={b.attribution}
                      />
                    )
                  }

                  if (b.type === "image") {
                    return (
                      <figure key={key} className="my-10">
                        <div className="overflow-hidden rounded-2xl bg-black/5 aspect-video cursor-pointer" onClick={() => setActiveImage({ src: b.src, alt: b.alt })}>
                          <img src={b.src} alt={b.alt} className="h-full w-full object-cover hover:opacity-95 transition-opacity duration-200" loading="lazy" />
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
      <ImageExpandModal
        src={activeImage?.src ?? null}
        alt={activeImage?.alt ?? ""}
        open={Boolean(activeImage)}
        onOpenChange={(open) => !open && setActiveImage(null)}
      />
    </div>
  )
}

