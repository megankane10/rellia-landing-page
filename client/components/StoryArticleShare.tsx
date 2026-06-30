import { SharePageButton } from "@/components/share/SharePageButton"
import { cn } from "@/lib/utils"

type StoryArticleShareProps = {
  shareUrl: string
  shareTitle: string
  tone?: "light" | "onDark"
  className?: string
}

export const StoryArticleShare = ({
  shareUrl,
  shareTitle,
  tone = "light",
  className,
}: StoryArticleShareProps) => (
  <div
    className={cn(
      "mt-8 flex w-full items-center gap-3 border-t pt-5 md:mt-10",
      tone === "onDark" ? "border-white/15" : "border-black/10",
      className,
    )}
  >
    <p
      className={cn(
        "font-host-grotesk text-[12px] font-semibold uppercase tracking-[0.14em]",
        tone === "onDark" ? "text-white/55" : "text-black/55",
      )}
    >
      Share this story
    </p>
    <SharePageButton
      url={shareUrl}
      title={shareTitle}
      variant={tone === "onDark" ? "dark" : "light"}
      idleLabel="Share"
      copiedLabel="Link copied"
    />
  </div>
)
