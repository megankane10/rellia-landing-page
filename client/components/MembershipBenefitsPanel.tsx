import { cn } from "@/lib/utils"
import {
  parseMembershipPanelDescription,
  type ParsedMembershipPanelDescription,
} from "@/lib/parseMembershipPanelDescription"
import { cmsCleanText, cmsDisplayText, isVisualEditingPreview } from "@/lib/cmsStega"

type MembershipBenefitsPanelProps = {
  headline: string
  description: string
  imageEnabled?: boolean
  imageSrc?: string
  className?: string
}

const PanelDescription = ({
  content,
  previewMode,
}: {
  content: ParsedMembershipPanelDescription
  previewMode: boolean
}) => {
  if (content.paragraphs.length === 0 && content.bullets.length === 0) return null

  return (
    <div className="mt-6 space-y-5 md:mt-8">
      {content.paragraphs.map((paragraph, index) => (
        <p
          key={`p-${index}`}
          className="font-urbanist text-[15px] font-normal leading-relaxed text-white/72 [text-shadow:0_1px_14px_rgba(0,0,0,0.5)] md:text-base"
        >
          {previewMode ? cmsDisplayText(paragraph) : cmsCleanText(paragraph)}
        </p>
      ))}

      {content.bullets.length > 0 ? (
        <ul className="list-disc space-y-3 pl-5 marker:text-white/40">
          {content.bullets.map((bullet, index) => (
            <li
              key={`b-${index}`}
              className="font-urbanist text-[15px] font-normal leading-relaxed text-white/68 [text-shadow:0_1px_14px_rgba(0,0,0,0.5)] md:text-base"
            >
              {previewMode ? cmsDisplayText(bullet) : cmsCleanText(bullet)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default function MembershipBenefitsPanel({
  headline,
  description,
  imageEnabled = true,
  imageSrc,
  className,
}: MembershipBenefitsPanelProps) {
  const previewMode = isVisualEditingPreview()
  const showImage = imageEnabled && Boolean(imageSrc?.trim())
  const parsed = parseMembershipPanelDescription(description)

  return (
    <div
      className={cn(
        "relative flex min-h-[min(520px,calc(100vh-10rem))] flex-1 flex-col overflow-hidden rounded-[1.75rem] bg-rellia-teal",
        className,
      )}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {showImage ? (
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full scale-105 object-cover"
          />
        ) : null}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-rellia-teal via-[#0c4a4a] to-[#071f26]",
            showImage && "via-[#0c4a4a]/90 to-[#071f26]/92",
          )}
        />
        {showImage ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-[#071f26]/90 via-[#071f26]/50 to-black/25" />
            <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-rellia-mint/15 blur-[100px]" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-rellia-mint/10 blur-[80px]" />
          </>
        )}
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end p-8 md:p-10 lg:p-11">
        <div className="max-w-md">
          <h1 className="font-host-grotesk text-[1.75rem] font-semibold leading-tight tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)] md:text-[2.125rem]">
            {previewMode ? cmsDisplayText(headline) : cmsCleanText(headline)}
          </h1>
          <div className="mt-5 h-px w-10 bg-rellia-mint/70 md:mt-6" aria-hidden />
        </div>

        <PanelDescription content={parsed} previewMode={previewMode} />
      </div>
    </div>
  )
}
