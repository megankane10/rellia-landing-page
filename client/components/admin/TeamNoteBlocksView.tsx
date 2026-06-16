import { useState } from "react"
import type { AdminTeamNoteBlock } from "@/lib/adminApi"
import ImageExpandModal from "@/components/ImageExpandModal"
import { renderTeamNoteRichText } from "@/lib/teamNoteRichText"
import { cn } from "@/lib/utils"

type TeamNoteBlocksViewProps = {
  blocks: AdminTeamNoteBlock[]
  className?: string
  /** Slightly larger type for the edit preview panel */
  preview?: boolean
}

const TeamNoteBlocksView = ({ blocks, className, preview = false }: TeamNoteBlocksViewProps) => {
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null)

  const stickers = blocks.filter((block): block is Extract<AdminTeamNoteBlock, { type: "sticker" }> => block.type === "sticker")
  const texts = blocks.filter((block): block is Extract<AdminTeamNoteBlock, { type: "text" }> => block.type === "text")
  const images = blocks.filter((block): block is Extract<AdminTeamNoteBlock, { type: "image" }> => block.type === "image")

  const textContent = texts.map((block) => block.text).join("\n").trim()

  return (
    <>
      <div className={cn("flex flex-col gap-3", className)}>
        {stickers.length > 0 ? (
          <div className="flex flex-wrap gap-2" aria-hidden>
            {stickers.map((block, index) => (
              <span
                key={`sticker-${index}-${block.emoji}`}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card/80 text-2xl shadow-sm dark:border-rellia-mint/20 dark:bg-card/60"
              >
                {block.emoji}
              </span>
            ))}
          </div>
        ) : null}

        {textContent ? (
          <div
            className={cn(
              "font-urbanist text-foreground dark:text-white",
              preview ? "text-base leading-relaxed" : "text-sm",
            )}
          >
            {renderTeamNoteRichText(textContent)}
          </div>
        ) : null}

        {images.length > 0 ? (
          <div className="flex flex-col gap-2">
            {images.map((block, index) => {
              const alt = block.alt?.trim() || "Team note image"
              return (
                <button
                  key={`image-${index}-${block.url}`}
                  type="button"
                  onClick={() => setExpandedImage({ src: block.url, alt })}
                  className="group w-fit max-w-full overflow-hidden rounded-xl border border-rellia-teal/15 bg-card/60 text-left shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rellia-teal/40 dark:border-rellia-mint/20 dark:bg-card/50"
                  aria-label={`View full size: ${alt}`}
                >
                  <img
                    src={block.url}
                    alt={alt}
                    className="max-h-36 max-w-full rounded-xl object-cover transition-opacity group-hover:opacity-90"
                    loading="lazy"
                  />
                </button>
              )
            })}
          </div>
        ) : null}
      </div>

      <ImageExpandModal
        open={Boolean(expandedImage)}
        onOpenChange={(open) => {
          if (!open) setExpandedImage(null)
        }}
        src={expandedImage?.src ?? null}
        alt={expandedImage?.alt ?? "Team note image"}
      />
    </>
  )
}

export default TeamNoteBlocksView
