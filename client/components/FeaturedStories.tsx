import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import ScrollReveal from "@/components/ScrollReveal"
import SectionHeading from "@/components/SectionHeading"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import RelliaAction from "@/components/RelliaAction"
import { getFeaturedStories, type Story, type StoryTag } from "@/content/stories"

const tagTone = (tag: StoryTag) => {
  switch (tag) {
    case "Founder Story":
      return "bg-rellia-mint/18 text-rellia-teal border-rellia-mint/35"
    case "Industry Insight":
      return "bg-rellia-teal/8 text-rellia-teal border-rellia-teal/15"
    case "Program Update":
      return "bg-black/5 text-black/70 border-black/10"
  }
}

const arrowClass = cn(
  "static translate-x-0 translate-y-0 relative",
  "h-12 w-12 rounded-full border-2 border-rellia-teal bg-white text-rellia-teal shadow-md",
  "hover:bg-rellia-teal hover:text-white",
  "disabled:opacity-40 disabled:pointer-events-none",
)

const formatDate = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

const StoryCard = ({ story }: { story: Story }) => {
  return (
    <article className="h-[440px] md:h-[460px] overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
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
          <span
            className={cn(
              "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
              tagTone(story.tag),
            )}
          >
            {story.tag}
          </span>

          <h3 className="mt-4 font-host-grotesk font-semibold text-black text-xl md:text-2xl tracking-tight leading-snug">
            {story.title}
          </h3>

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-black/10 pt-4">
            <time dateTime={story.publishedAt} className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
              {formatDate(story.publishedAt)}
            </time>
            <Link
              to={`/stories/${story.slug}`}
              className="inline-flex items-center gap-2 font-host-grotesk font-semibold text-rellia-teal outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-md"
              aria-label={`Read more: ${story.title}`}
            >
              Open <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function FeaturedStories({
  showHeading = true,
  showViewAll = true,
  title = "Stories & Insights",
  description = "Founder stories, industry insight, and program updates — all in one place.",
}: {
  showHeading?: boolean
  showViewAll?: boolean
  title?: string
  description?: string
}) {
  const featured = getFeaturedStories()

  return (
    <section className="w-full bg-white py-16 md:py-24 px-6 md:px-10 overflow-x-hidden">
      <div className="max-w-[1300px] mx-auto">
        {showHeading ? (
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <SectionHeading title={title} description={description} align="left" className="max-w-2xl" />

            {showViewAll ? (
              <div className="flex items-center gap-3">
                <RelliaAction asChild variant="outlineOnWhite" size="compact" className="px-5">
                  <Link to="/stories" aria-label="View all stories">
                    View all
                  </Link>
                </RelliaAction>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className={cn(showHeading ? "mt-10" : "")}>
          <ScrollReveal>
            <Carousel opts={{ align: "start", loop: false, containScroll: "trimSnaps" }} className="w-full max-w-full min-w-0">
              <div className="flex flex-col gap-7">
                <CarouselContent className="-ml-4 md:-ml-6">
                  {featured.map((story) => (
                    <CarouselItem key={story.slug} className="pl-4 md:pl-6 min-w-0 basis-full md:basis-1/2 xl:basis-1/3">
                      <StoryCard story={story} />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <div className="flex items-center justify-center gap-4">
                  <CarouselPrevious className={arrowClass} />
                  <CarouselNext className={arrowClass} />
                </div>
              </div>
            </Carousel>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

