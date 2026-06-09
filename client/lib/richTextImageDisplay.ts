import {
  type RichTextImageDisplayMode,
  normalizeRichTextImageDisplayMode,
} from "@shared/cms/richTextImageDisplay"
import { cn } from "@/lib/utils"

export { normalizeRichTextImageDisplayMode, type RichTextImageDisplayMode }

const isFull = (mode: RichTextImageDisplayMode) => mode === "full"

export const richTextCroppedFrameClassName =
  "relative aspect-[16/10] w-full overflow-hidden md:aspect-[21/9]"

export const richTextCarouselImageClassName = (
  displayMode: RichTextImageDisplayMode,
  index = 0,
) =>
  cn(
    "w-full cursor-pointer transition-opacity duration-200 hover:opacity-95",
    isFull(displayMode) ? "h-auto" : "h-full object-cover",
    !isFull(displayMode) && index === 0 && "object-top",
  )

export const richTextInlineImageClassName = (displayMode: RichTextImageDisplayMode) =>
  cn(
    "w-full max-w-full cursor-pointer rounded-2xl border border-black/10 shadow-sm transition-opacity duration-200 hover:opacity-95",
    isFull(displayMode) ? "h-auto" : "h-full object-cover object-top",
  )
