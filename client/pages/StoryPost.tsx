import { useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
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
  resolveShareOgImage,
  resolveSocialOgImage,
} from "@/config/seo"
import StoryArticleJsonLd from "@/components/seo/StoryArticleJsonLd"
import PageSocialHelmet from "@/components/seo/PageSocialHelmet"
import { ChevronLeft } from "lucide-react"
import { RichTextImageCarousel } from "@/components/RichTextImageCarousel"
import { PortableRichText } from "@/components/PortableRichText"
import { useStoryBySlug } from "@/hooks/useCmsDocuments"
import { isCmsQueryLoading, shouldShowCmsEmptyState } from "@/lib/cmsQueryState"
import CmsPageLoadingShell from "@/components/cms/CmsPageLoadingShell"
import { isSanityConfigured } from "@/lib/sanity"
import { StoryArticleShare } from "@/components/StoryArticleShare"
import { resolveStoryCollectionSeo } from "@shared/cms/collectionSeo"
import { resolveStorySlugRedirect } from "@shared/cms/storySlugRedirects"
import { StoryPostHero } from "@/components/StoryPostHero"
import { RichTextQuoteFigure } from "@/components/RichTextQuoteFigure"
import ImageExpandModal from "@/components/ImageExpandModal"

export default function StoryPost() {
  const { slug } = useParams()
  const resolvedSlug = slug?.trim() ?? ""
  const legacyRedirectSlug = resolvedSlug ? resolveStorySlugRedirect(resolvedSlug) : undefined
  const storyQuery = useStoryBySlug(resolvedSlug)
  const { data: cmsStory } = storyQuery
  const story = slug && allowCmsSeedFallbacks() ? getStoryBySlug(slug) : undefined
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null)

  const canonical = cmsStory?.slug
    ? buildPageUrl(`/stories/${cmsStory.slug}`)
    : story
      ? buildPageUrl(`/stories/${story.slug}`)
      : buildPageUrl("/stories")

  const storySeo = cmsStory
    ? resolveStoryCollectionSeo({
        title: cmsStory.title,
        tag: cmsStory.tag,
        excerpt: cmsStory.excerpt,
        seo: cmsStory.seo,
        coverImageSrc: cmsStory.coverImageSrc,
      })
    : story
      ? resolveStoryCollectionSeo({
          title: story.title,
          tag: story.tag,
          excerpt: story.excerpt,
          coverImageSrc: story.coverImageSrc,
          seo:
            story.seoTitle || story.seoDescription
              ? { metaTitle: story.seoTitle, metaDescription: story.seoDescription }
              : undefined,
        })
      : resolveStoryCollectionSeo({
          title: "Stories",
          fallbackDescription: "Stories and insights from Rellia Health.",
        })

  const resolvedTitle = clampMetaTitle(storySeo.title)
  const resolvedDescription = clampMetaDescription(storySeo.description)

  const toAbsoluteImageUrl = (src: string): string => {
    const origin = getShareOrigin()
    if (/^https?:\/\//i.test(src)) return src
    if (!src.startsWith("/")) return `${origin}/${src}`
    return `${origin}${src}`
  }

  const headerCoverSrc = cmsStory?.coverImageSrc?.trim() || story?.coverImageSrc?.trim()
  const headerCoverAlt = cmsStory?.coverImageAlt?.trim() || story?.coverImageAlt?.trim() || cmsStory?.title || story?.title || ""
  const headerLayout = cmsStory?.headerLayout === "background" ? "background" : "block"
  const seoOgImageSrc = storySeo.ogImageUrl || headerCoverSrc
  const resolvedOgImage = seoOgImageSrc
    ? resolveSocialOgImage(seoOgImageSrc, undefined, { landscape: true }) ?? {
        url: toAbsoluteImageUrl(seoOgImageSrc),
      }
    : resolveShareOgImage(undefined, { landscape: true })
  const imageUrl = resolvedOgImage.url
  const shareTitle = resolvedTitle

  const shareBlock = (
    <StoryArticleShare
      shareUrl={canonical}
      shareTitle={shareTitle}
      tone="onDark"
      className="max-w-3xl"
    />
  )

  if (legacyRedirectSlug && legacyRedirectSlug !== resolvedSlug) {
    return <Navigate to={`/stories/${legacyRedirectSlug}`} replace />
  }

  if (
    cmsStory?.slug &&
    resolvedSlug &&
    cmsStory.slug.trim() !== resolvedSlug
  ) {
    return <Navigate to={`/stories/${cmsStory.slug}`} replace />
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
          ogImageWidth={resolvedOgImage.width}
          ogImageHeight={resolvedOgImage.height}
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
        ogImageWidth={resolvedOgImage.width}
        ogImageHeight={resolvedOgImage.height}
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

