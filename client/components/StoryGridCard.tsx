import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { cmsCleanText, cmsDisplayStoryTitle, cmsDisplayText } from "@/lib/cmsStega"

export type StoryGridCardStory = {
  slug: string
  title: string
  excerpt: string
  coverImageSrc: string
  coverImageAlt: string
  tag: string
}

type StoryGridCardProps = {
  story: StoryGridCardStory
}

const StoryGridCard = ({ story }: StoryGridCardProps) => {
  return (
    <article className="h-full w-full">
      <Link
        to={`/stories/${story.slug}`}
        className={cn(
          "group flex h-auto w-full flex-col overflow-hidden rounded-2xl",
          "transition-all duration-500 ease-in hover:-translate-y-0.5",
          "outline outline-2 outline-offset-[10px] outline-transparent hover:outline-rellia-teal",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-mint focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        )}
        aria-label={`Read ${cmsCleanText(story.title)}`}
      >
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-rellia-teal/5">
          <img
            src={story.coverImageSrc}
            alt={story.coverImageAlt}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-1.5 pt-3 pb-1 md:h-[160px]">
          <div className="mb-2 inline-flex w-fit items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rellia-teal" aria-hidden />
            <span className="font-host-grotesk text-[11px] font-bold uppercase tracking-[0.14em] text-rellia-teal">
              {cmsDisplayText(story.tag)}
            </span>
          </div>

          <h3 className="line-clamp-2 h-auto font-host-grotesk text-[16px] font-semibold leading-snug text-black group-hover:underline group-hover:underline-offset-4 md:text-lg">
            {cmsDisplayStoryTitle(story.title)}
          </h3>

          <p className="mt-3 line-clamp-4 h-auto overflow-hidden break-words font-urbanist text-sm leading-relaxed text-black/70 md:text-base">
            {cmsDisplayText(story.excerpt)}
          </p>
        </div>
      </Link>
    </article>
  )
}

export default StoryGridCard
