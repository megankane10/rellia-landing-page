import { useEffect, useMemo } from "react"
import ScrollReveal from "@/components/ScrollReveal"
import StoryGridCard from "@/components/StoryGridCard"
import RelatedContentSection from "@/components/related/RelatedContentSection"
import type { StoryListItem } from "@/content/stories"
import { useStories, useStoriesPage } from "@/hooks/useCmsDocuments"
import { isSanityConfigured } from "@/lib/sanity"
import {
  DEFAULT_STORIES_RELATED_COPY,
  mergeRelatedContentCopy,
} from "@shared/cms/relatedContentCopy"
import { pickRelatedStories } from "@shared/cms/relatedStories"

type RelatedStoriesProps = {
  currentSlug: string
  currentTag?: string
  onHasRelatedChange?: (hasRelated: boolean) => void
}

const RelatedStories = ({ currentSlug, currentTag, onHasRelatedChange }: RelatedStoriesProps) => {
  const { data: cmsStories } = useStories()
  const { data: storiesPage } = useStoriesPage()

  const copy = mergeRelatedContentCopy(storiesPage, DEFAULT_STORIES_RELATED_COPY)

  const related = useMemo(() => {
    const cmsPool: StoryListItem[] = isSanityConfigured()
      ? (cmsStories ?? [])
          .map((story) => ({
            slug: story.slug,
            title: story.title,
            excerpt: story.excerpt ?? "",
            coverImageSrc: story.coverImageSrc ?? "",
            coverImageAlt: (story.coverImageAlt ?? "Story cover").trim() || "Story cover",
            tag: (story.tag ?? "Story").trim() || "Story",
            publishedAt: typeof story.publishedAt === "string" ? story.publishedAt : "",
          }))
          .filter((story) => story.slug && story.title && story.coverImageSrc)
      : []

    const pool = cmsPool
    return pickRelatedStories(pool, currentSlug, currentTag, 3)
  }, [cmsStories, currentSlug, currentTag])

  const visible = copy.relatedSectionEnabled && related.length > 0

  useEffect(() => {
    onHasRelatedChange?.(visible)
  }, [onHasRelatedChange, visible])

  if (!copy.relatedSectionEnabled || related.length === 0) return null

  return (
    <RelatedContentSection
      headingId="related-stories-heading"
      title={copy.relatedSectionTitle}
      subheadline={copy.relatedSectionSubheadline}
      viewAllHref="/stories"
      viewAllLabel="View all stories"
    >
      {related.map((story, index) => (
        <ScrollReveal key={story.slug} delay={index * 0.05} className="h-full">
          <StoryGridCard
            story={{
              slug: story.slug,
              title: story.title,
              excerpt: story.excerpt ?? "",
              coverImageSrc: story.coverImageSrc ?? "",
              coverImageAlt: (story.coverImageAlt ?? "Story cover").trim() || "Story cover",
              tag: (story.tag ?? "Story").trim() || "Story",
            }}
          />
        </ScrollReveal>
      ))}
    </RelatedContentSection>
  )
}

export default RelatedStories
