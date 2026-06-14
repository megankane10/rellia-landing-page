import { cn } from "@/lib/utils"
import { HEADING_SECTION } from "@/lib/typography"
import ScrollReveal from "@/components/ScrollReveal"
import WordRevealHeading from "@/components/WordRevealHeading"
import { cmsDisplayText } from "@/lib/cmsStega"

export default function SectionHeading({
  title,
  description,
  align = "left",
  tone = "dark",
  animated = true,
  className,
  titleClassName,
  descriptionClassName,
}: {
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  animated?: boolean;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}) {
  const isCenter = align === "center";
  const isLight = tone === "light";

  return (
    <ScrollReveal className={cn(isCenter && "text-center", className)}>
      {animated ? (
        <WordRevealHeading
          text={title}
          as="h2"
          className={cn(
            "font-host-grotesk font-semibold leading-tight tracking-tight",
            isLight ? "text-white" : "text-black",
            titleClassName ?? HEADING_SECTION,
          )}
        />
      ) : (
        <h2
          className={cn(
            "font-host-grotesk font-semibold leading-tight tracking-tight",
            isLight ? "text-white" : "text-black",
            titleClassName ?? HEADING_SECTION,
          )}
        >
          {cmsDisplayText(title)}
        </h2>
      )}
          {description ? (
        <p
          className={cn(
            "font-urbanist font-medium leading-relaxed tracking-tight mt-1",
            isLight ? "text-white/80" : "text-black/70",
            "text-base md:text-lg",
            isCenter && "mx-auto max-w-[680px]",
            descriptionClassName,
          )}
        >
          {cmsDisplayText(description)}
        </p>
      ) : null}
    </ScrollReveal>
  )
}

